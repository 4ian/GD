// @flow
import optionalRequire from '../Utils/OptionalRequire.js';
import { type ExternalEditorOpenOptions } from './ResourceExternalEditor.flow';
import { createOrUpdateResource } from './ResourceUtils.js';
const electron = optionalRequire('electron');
const path = optionalRequire('path');
const ipcRenderer = electron ? electron.ipcRenderer : null;
const gd = global.gd;

/**
 * Open Piskel editor for the specified resources.
 * Take a list of resource names to be edited and will call the callback methods
 * (notably onChangesSaved with the name of the edited resources)
 */
export const openPiskel = ({
  project,
  resourcesLoader,
  resourceNames,
  singleFrame,
  onChangesSaved,
  extraOptions,
}: ExternalEditorOpenOptions) => {
  if (!electron || !ipcRenderer) return;

  const resources = resourceNames.map((resourceName, originalIndex) => {
    let resourcePath = resourcesLoader.getResourceFullUrl(
      project,
      resourceName
    );

    //TODO: check if this is necessary or if resourcesLoader should be updated.
    resourcePath = resourcePath.substring(
      7,
      resourcePath.lastIndexOf('?cache=')
    );
    return {
      resourcePath,
      resourceName,
      originalIndex,
    };
  });

  const projectPath = path.dirname(project.getProjectFile());
  const completePiskelOptions = {
    ...extraOptions,
    resources,
    singleFrame,
    projectPath,
  };

  // Listen to events meaning that edition in Piskel is finished
  ipcRenderer.removeAllListeners('piskel-changes-saved');
  ipcRenderer.on(
    'piskel-changes-saved',
    (event, outputResources, newAnimationName, metadata) => {
      const newMetadata = metadata.data
        ? {
            pskl: metadata,
          }
        : {};

      const resourcesManager = project.getResourcesManager();
      outputResources.forEach(resource => {
        resource.name = path.relative(projectPath, resource.path); // Still needed for onChangesSaved()
        createOrUpdateResource(project, new gd.ImageResource(), resource.name);
      });

      // in case this is for a tiledSprite object, save the metadata in the Image object
      if (metadata.isTiled) {
        resourcesManager
          .getResource(path.relative(projectPath, outputResources[0].path))
          .setMetadata(JSON.stringify(newMetadata));
      } else {
        // if not, the metadata will still be passed onto SpritesList.js to be set in the Direction object
        outputResources[0].metadata = newMetadata;
      }

      onChangesSaved(outputResources, newAnimationName);
    }
  );

  // Issue the event to open piskel
  ipcRenderer.send('piskel-open-then-load-animation', completePiskelOptions);
};
