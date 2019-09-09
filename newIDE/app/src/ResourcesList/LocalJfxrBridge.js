// @flow
import optionalRequire from '../Utils/OptionalRequire.js';
import { type ExternalEditorOpenOptions } from './ResourceExternalEditor.flow';
import {
  createOrUpdateResource,
  getLocalResourceFullPath,
} from './ResourceUtils.js';

const electron = optionalRequire('electron');
const path = optionalRequire('path');
const ipcRenderer = electron ? electron.ipcRenderer : null;
const gd = global.gd;

/**
 * Open JFXR to create wav resources.
 */
export const openJfxr = ({
  project,
  resourcesLoader,
  resourceNames,
  onChangesSaved,
  resourcePath,
  extraOptions,
}: ExternalEditorOpenOptions) => {
  if (!electron || !ipcRenderer) return;
  const projectPath = path.dirname(project.getProjectFile());
  const initialResourcePath = getLocalResourceFullPath(
    project,
    resourceNames[0]
  );

  const externalEditorData = {
    resourcePath: initialResourcePath,
    externalEditorData: extraOptions.initialResourceMetadata,
    projectPath,
  };

  ipcRenderer.removeAllListeners('jfxr-changes-saved');
  ipcRenderer.on(
    'jfxr-changes-saved',
    (event, newFilePath, externalEditorData) => {
      const name = path.relative(projectPath, newFilePath);
      createOrUpdateResource(project, new gd.AudioResource(), name);

      const metadata = {
        jfxr: externalEditorData,
      };
      project
        .getResourcesManager()
        .getResource(name)
        .setMetadata(JSON.stringify(metadata));
      onChangesSaved([{ metadata, name }]);
    }
  );

  ipcRenderer.send('jfxr-create-wav', externalEditorData);
};
