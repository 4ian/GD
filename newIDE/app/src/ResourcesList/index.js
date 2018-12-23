// @flow
import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import SortableVirtualizedItemList from '../UI/SortableVirtualizedItemList';
import Background from '../UI/Background';
import SearchBar from 'material-ui-search-bar';
import { showWarningBox } from '../UI/Messages/MessageBox';
import { filterResourcesList } from './EnumerateResources';
import optionalRequire from '../Utils/OptionalRequire.js';
import {
  createOrUpdateResource,
  getLocalResourceFullPath,
  resourceHasValidPath,
  selectLocalResourcePath,
} from './ResourceUtils.js';
// import ResourcesLoader from '../ResourcesLoader';
import { type ResourceKind } from './ResourceSource.flow';

const path = optionalRequire('path');
const glob = optionalRequire('glob');
const electron = optionalRequire('electron');
const hasElectron = electron ? true : false;

const RESOURCE_EXTENSIONS = {
  image: 'png,jpg,jpeg,PNG,JPG,JPEG',
  audio: 'wav,mp3,ogg,WAV,MP3,OGG',
  font: 'ttf,ttc,TTF,TTC',
}

const gd = global.gd;

const styles = {
  listContainer: {
    flex: 1,
  },
};

type State = {|
  renamedResource: ?gdResource,
  searchText: string,
  resourcesWithMissingPath: { [string]: boolean },
|};

type Props = {|
  project: gdProject,
  selectedResource: ?gdResource,
  onSelectResource: (resource: gdResource) => void,
  onDeleteResource: (resource: gdResource) => void,
  onRenameResource: (
    resource: gdResource,
    newName: string,
    cb: (boolean) => void
  ) => void,
|};

export default class ResourcesList extends React.Component<Props, State> {
  static defaultProps = {
    onDeleteResource: (resource: gdResource, cb: boolean => void) => cb(true),
    onRenameResource: (
      resource: gdResource,
      newName: string,
      cb: boolean => void
    ) => cb(true),
  };

  sortableList: any;
  state: State = {
    renamedResource: null,
    searchText: '',
    resourcesWithMissingPath: {},
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // The component is costly to render, so avoid any re-rendering as much
    // as possible.
    // We make the assumption that no changes to resources list is made outside
    // from the component.
    // If a change is made, the component won't notice it: you have to manually
    // call forceUpdate.

    if (
      this.state.renamedResource !== nextState.renamedResource ||
      this.state.searchText !== nextState.searchText
    )
      return true;

    if (
      this.props.project !== nextProps.project ||
      this.props.selectedResource !== nextProps.selectedResource
    )
      return true;

    return false;
  }

  _deleteResource = (resource: gdResource) => {
    this.props.onDeleteResource(resource);
  };

  _setResourcePath = (resource: gdResource) => {
    const {project} = this.props
    const projectPath = path.dirname(project.getProjectFile());
    const options = {
      multiSelections: false,
      title:'Choose a resource file',
      name: 'Resource files',
      extensions: RESOURCE_EXTENSIONS[resource.getKind()].split(','),
      forEachPath: resourcePath => {
        resource.setFile(path.relative(projectPath, resourcePath))
        // return resourcePath
      },
      callback: () => {
        this.forceCheckMissingPaths();
        this.forceUpdateList();
      },
    };
    selectLocalResourcePath(this.props.project, options);
  };

  _locateResourceFile = (resource: gdResource) => {
    const resourceFolderPath = path.dirname(
      getLocalResourceFullPath(this.props.project, resource.getFile())
    );
    electron.shell.openItem(resourceFolderPath);
  };

  _openResourceFile = (resource: gdResource) => {
    const resourceFilePath = getLocalResourceFullPath(
      this.props.project,
      resource.getFile()
    );
    electron.shell.openItem(resourceFilePath);
  };

  _copyResourceFilePath = (resource: gdResource) => {
    const resourceFilePath = getLocalResourceFullPath(
      this.props.project,
      resource.getFile()
    );
    electron.clipboard.writeText(resourceFilePath);
  };

  _scanForNewResources = (
    extensions: string,
    createResource: () => gdResource
  ) => {
    const project = this.props.project;
    const resourcesManager = project.getResourcesManager();
    const projectPath = path.dirname(project.getProjectFile());

    const getDirectories = (src, callback) => {
      glob(src + '/**/*.{' + extensions + '}', callback);
    };
    getDirectories(projectPath, (err, res) => {
      if (err) {
        console.error('Error loading ', err);
      } else {
        res.forEach(pathFound => {
          const fileName = path.relative(projectPath, pathFound);
          if (!resourcesManager.hasResource(fileName)) {
            createOrUpdateResource(project, createResource(), fileName);
            console.info(`${fileName} added to project.`);
          }
        });
      }
      this.forceUpdate();
    });
  };

  _removeUnusedResources = (resourceType: ResourceKind) => {
    const { project } = this.props;
    gd.ProjectResourcesAdder.getAllUseless(project, resourceType)
      .toJSArray()
      .forEach(resourceName => {
        console.info(
          `Removing unused` + resourceType + ` resource: ${resourceName}`
        );
      });
    gd.ProjectResourcesAdder.removeAllUseless(project, resourceType);
    this.forceUpdate();
  };

  _removeAllResourcesWithInvalidPath = () => {
    const { project } = this.props;
    const resourcesManager = project.getResourcesManager();
    resourcesManager
      .getAllResourceNames()
      .toJSArray()
      .forEach(resourceName => {
        if (!resourceHasValidPath(project, resourceName)) {
          resourcesManager.removeResource(resourceName);
          console.info('Removed due to invalid path: ' + resourceName);
        }
      });
    this.forceUpdate();
  };

  _editName = (resource: ?gdResource) => {
    this.setState(
      {
        renamedResource: resource,
      },
      () => this.sortableList.getWrappedInstance().forceUpdateGrid()
    );
  };

  _rename = (resource: gdResource, newName: string) => {
    const { project } = this.props;
    this.setState({
      renamedResource: null,
    });

    if (resource.getName() === newName) return;

    if (project.getResourcesManager().hasResource(newName)) {
      showWarningBox('Another resource with this name already exists');
      return;
    }

    this.props.onRenameResource(resource, newName, doRename => {
      if (!doRename) return;
      resource.setName(newName);
      this.forceUpdate();
    });
  };

  _move = (oldIndex: number, newIndex: number) => {
    const { project } = this.props;

    project.getResourcesManager().moveResource(oldIndex, newIndex);
    this.forceUpdateList();
  };

  forceUpdateList = () => {
    this.forceUpdate();
    this.sortableList.getWrappedInstance().forceUpdateGrid();
  };

  _renderResourceMenuTemplate = (resource: gdResource) => {
    return [
      {
        label: 'Rename',
        click: () => this._editName(resource),
      },
      {
        label: 'Remove',
        click: () => this._deleteResource(resource),
      },
      {
        label: 'Set Path',
        click: () => this._setResourcePath(resource),
        enabled: hasElectron,
      },
      { type: 'separator' },
      {
        label: 'Open File',
        click: () => this._openResourceFile(resource),
        enabled: hasElectron,
      },
      {
        label: 'Locate File',
        click: () => this._locateResourceFile(resource),
        enabled: hasElectron,
      },
      {
        label: 'Copy File Path',
        click: () => this._copyResourceFilePath(resource),
        enabled: hasElectron,
      },
      { type: 'separator' },
      {
        label: 'Scan for Images',
        click: () => {
          this._scanForNewResources(
            RESOURCE_EXTENSIONS.image,
            () => new gd.ImageResource()
          );
        },
        enabled: hasElectron,
      },
      {
        label: 'Scan for Audio',
        click: () => {
          this._scanForNewResources(
            RESOURCE_EXTENSIONS.audio,
            () => new gd.AudioResource()
          );
        },
        enabled: hasElectron,
      },
      {
        label: 'Scan for Fonts',
        click: () => {
          this._scanForNewResources(
            RESOURCE_EXTENSIONS.font,
            () => new gd.FontResource()
          );
        },
        enabled: hasElectron,
      },
      { type: 'separator' },
      {
        label: 'Remove Unused Images',
        click: () => {
          this._removeUnusedResources('image');
        },
      },
      {
        label: 'Remove Unused Audio',
        click: () => {
          this._removeUnusedResources('audio');
        },
      },
      {
        label: 'Remove Unused Fonts',
        click: () => {
          this._removeUnusedResources('font');
        },
      },
      {
        label: 'Remove Resources with Invalid Path',
        click: () => {
          this._removeAllResourcesWithInvalidPath();
        },
        enabled: hasElectron,
      },
    ];
  };

  forceCheckMissingPaths = () => {
    const { project } = this.props;
    const resourcesManager = project.getResourcesManager();
    const resourceNames = resourcesManager.getAllResourceNames().toJSArray();
    const resourcesWithMissingPath = {};
    resourceNames.forEach(resourceName => {
      resourcesWithMissingPath[resourceName] = !resourceHasValidPath(
        project,
        resourceName
      );
    });
    this.setState({ resourcesWithMissingPath });
  };

  componentDidMount() {
    this.forceCheckMissingPaths()
  };

  render() {
    const { project, selectedResource, onSelectResource } = this.props;
    const { searchText } = this.state;

    const resourcesManager = project.getResourcesManager();
    const allResourcesList = resourcesManager
      .getAllResourceNames()
      .toJSArray()
      .map(resourceName => resourcesManager.getResource(resourceName));
    const filteredList = filterResourcesList(allResourcesList, searchText);

    // Force List component to be mounted again if project
    // has been changed. Avoid accessing to invalid objects that could
    // crash the app.
    const listKey = project.ptr;

    return (
      <Background>
        <div style={styles.listContainer}>
          <AutoSizer>
            {({ height, width }) => (
              <SortableVirtualizedItemList
                key={listKey}
                ref={sortableList => (this.sortableList = sortableList)}
                fullList={filteredList}
                width={width}
                height={height}
                selectedItem={selectedResource}
                onItemSelected={onSelectResource}
                renamedItem={this.state.renamedResource}
                onRename={this._rename}
                onSortEnd={({ oldIndex, newIndex }) =>
                  this._move(oldIndex, newIndex)
                }
                buildMenuTemplate={this._renderResourceMenuTemplate}
                helperClass="sortable-helper"
                distance={20}
                erroredItems={this.state.resourcesWithMissingPath}
              />
            )}
          </AutoSizer>
        </div>
        <SearchBar
          value={searchText}
          onRequestSearch={() => {}}
          onChange={text =>
            this.setState({
              searchText: text,
            })
          }
        />
      </Background>
    );
  }
}
