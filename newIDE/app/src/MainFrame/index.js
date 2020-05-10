// @flow
import { Trans } from '@lingui/macro';

import * as React from 'react';
import './MainFrame.css';
import Drawer from '@material-ui/core/Drawer';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from './Toolbar';
import ProjectTitlebar from './ProjectTitlebar';
import PreferencesDialog from './Preferences/PreferencesDialog';
import AboutDialog from './AboutDialog';
import ProjectManager from '../ProjectManager';
import PlatformSpecificAssetsDialog from '../PlatformSpecificAssetsEditor/PlatformSpecificAssetsDialog';
import LoaderModal from '../UI/LoaderModal';
import EditorBar from '../UI/EditorBar';
import CloseConfirmDialog from '../UI/CloseConfirmDialog';
import ProfileDialog from '../Profile/ProfileDialog';
import Window from '../Utils/Window';
import { showErrorBox } from '../UI/Messages/MessageBox';
import {
  ClosableTabs,
  ClosableTab,
  TabContentContainer,
} from '../UI/ClosableTabs';
import {
  getEditorTabsInitialState,
  openEditorTab,
  closeEditorTab,
  closeOtherEditorTabs,
  closeAllEditorTabs,
  changeCurrentTab,
  getEditors,
  getCurrentTabIndex,
  getCurrentTab,
  closeProjectTabs,
  closeLayoutTabs,
  closeExternalLayoutTabs,
  closeExternalEventsTabs,
  closeEventsFunctionsExtensionTabs,
  saveUiSettings,
  type EditorTabsState,
  type EditorTab,
  getEventsFunctionsExtensionEditor,
} from './EditorTabsHandler';
import { timePromise } from '../Utils/TimeFunction';
import newNameGenerator from '../Utils/NewNameGenerator';
import HelpFinder from '../HelpFinder';
import DebuggerEditor from './Editors/DebuggerEditor';
import EventsEditor from './Editors/EventsEditor';
import ExternalEventsEditor from './Editors/ExternalEventsEditor';
import SceneEditor from './Editors/SceneEditor';
import ExternalLayoutEditor from './Editors/ExternalLayoutEditor';
import EventsFunctionsExtensionEditor from './Editors/EventsFunctionsExtensionEditor';
import StartPage from './Editors/StartPage';
import ResourcesEditor from './Editors/ResourcesEditor';
import ErrorBoundary from '../UI/ErrorBoundary';
import SubscriptionDialog from '../Profile/SubscriptionDialog';
import ResourcesLoader from '../ResourcesLoader/index';
import {
  type PreviewLauncherInterface,
  type PreviewLauncherProps,
  type PreviewLauncherComponent,
  type PreviewOptions,
} from '../Export/PreviewLauncher.flow';
import { type ResourceSource } from '../ResourcesList/ResourceSource.flow';
import { type ResourceExternalEditor } from '../ResourcesList/ResourceExternalEditor.flow';
import { type JsExtensionsLoader } from '../JsExtensionsLoader';
import { type EventsFunctionsExtensionsState } from '../EventsFunctionsExtensionsLoader/EventsFunctionsExtensionsContext';
import {
  getUpdateNotificationTitle,
  getUpdateNotificationBody,
  type UpdateStatus,
} from './UpdaterTools';
import { showWarningBox } from '../UI/Messages/MessageBox';
import EmptyMessage from '../UI/EmptyMessage';
import ChangelogDialogContainer from './Changelog/ChangelogDialogContainer';
import { getNotNullTranslationFunction } from '../Utils/i18n/getTranslationFunction';
import { type I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import LanguageDialog from './Preferences/LanguageDialog';
import PreferencesContext from './Preferences/PreferencesContext';
import { getFunctionNameFromType } from '../EventsFunctionsExtensionsLoader';
import { type ExportDialogWithoutExportsProps } from '../Export/ExportDialog';
import { type CreateProjectDialogWithComponentsProps } from '../ProjectCreation/CreateProjectDialog';
import { getStartupTimesSummary } from '../Utils/StartupTimes';
import {
  type StorageProvider,
  type StorageProviderOperations,
  type FileMetadata,
} from '../ProjectsStorage';
import OpenFromStorageProviderDialog from '../ProjectsStorage/OpenFromStorageProviderDialog';
import SaveToStorageProviderDialog from '../ProjectsStorage/SaveToStorageProviderDialog';
import OpenConfirmDialog from '../ProjectsStorage/OpenConfirmDialog';
import verifyProjectContent from '../ProjectsStorage/ProjectContentChecker';
import { type UnsavedChanges } from './UnsavedChangesContext';
import { type MainMenuProps } from './MainMenu.flow';
import { emptyPreviewButtonSettings } from './Toolbar/PreviewButtons';
import useForceUpdate from '../Utils/UseForceUpdate';
import useStateWithCallback from '../Utils/UseSetStateWithCallback';

const GD_STARTUP_TIMES = global.GD_STARTUP_TIMES || [];

const gd = global.gd;

const styles = {
  drawerContent: {
    width: 320,
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};

export type State = {|
  createDialogOpen: boolean,
  exportDialogOpen: boolean,
  openConfirmDialogOpen: boolean,
  loadingProject: boolean,
  previewLoading: boolean,
  currentProject: ?gdProject,
  currentFileMetadata: ?FileMetadata,
  editorTabs: EditorTabsState,
  snackMessage: string,
  snackMessageOpen: boolean,
  updateStatus: UpdateStatus,
  openFromStorageProviderDialogOpen: boolean,
  saveToStorageProviderDialogOpen: boolean,
  eventsFunctionsExtensionsError: ?Error,
  gdjsDevelopmentWatcherEnabled: boolean,
  isPreviewFirstSceneOverriden: boolean,
  previewFirstSceneName: string,
|};

export type Props = {
  integratedEditor?: boolean,
  introDialog?: React.Element<*>,
  renderMainMenu?: MainMenuProps => React.Node,
  renderPreviewLauncher?: (
    props: PreviewLauncherProps,
    ref: (previewLauncher: ?PreviewLauncherInterface) => void
  ) => React.Element<PreviewLauncherComponent>,
  onEditObject?: gdObject => void,
  storageProviderOperations: StorageProviderOperations,
  storageProviders: Array<StorageProvider>,
  useStorageProvider: (?StorageProvider) => Promise<void>,
  resourceSources: Array<ResourceSource>,
  resourceExternalEditors: Array<ResourceExternalEditor>,
  loading?: boolean,
  requestUpdate?: () => void,
  renderExportDialog?: ExportDialogWithoutExportsProps => React.Node,
  renderCreateDialog?: CreateProjectDialogWithComponentsProps => React.Node,
  renderGDJSDevelopmentWatcher?: ?() => React.Node,
  extensionsLoader?: JsExtensionsLoader,
  initialFileMetadataToOpen: ?FileMetadata,
  eventsFunctionsExtensionsState: EventsFunctionsExtensionsState,
  i18n: I18n,
  unsavedChanges?: UnsavedChanges,
};

const MainFrame = (props: Props) => {
  const [state, setState]: [
    State,
    ((State => State) | State) => Promise<State>,
  ] = useStateWithCallback(({
    createDialogOpen: false,
    exportDialogOpen: false,
    openConfirmDialogOpen: false,
    loadingProject: false,
    previewLoading: false,
    currentProject: null,
    currentFileMetadata: null,
    editorTabs: getEditorTabsInitialState(),
    snackMessage: '',
    snackMessageOpen: false,
    updateStatus: { message: '', status: 'unknown' },
    openFromStorageProviderDialogOpen: false,
    saveToStorageProviderDialogOpen: false,
    eventsFunctionsExtensionsError: null,
    gdjsDevelopmentWatcherEnabled: false,
    isPreviewFirstSceneOverriden: false,
    previewFirstSceneName: '',
  }: State));
  const toolbar = React.useRef(null);
  const _resourceSourceDialogs = React.useRef({});
  const _previewLauncher = React.useRef((null: ?PreviewLauncherInterface));
  const forceUpdate = useForceUpdate();
  const [projectManagerOpen, openProjectManager] = React.useState<boolean>(false);
  const [introDialogOpen, openIntroDialog] = React.useState<boolean>(false);
  const [languageDialogOpen, openLanguageDialog] = React.useState<boolean>(false);
  const [helpFinderDialogOpen, openHelpFinderDialog] = React.useState<boolean>(false);
  const [platformSpecificAssetsDialogOpen, openPlatformSpecificAssetsDialog] = React.useState<boolean>(false);
  const [aboutDialogOpen, openAboutDialog] = React.useState<boolean>(false);
  const [profileDialogOpen, openProfileDialog] = React.useState<boolean>(false);
  const [preferencesDialogOpen, openPreferencesDialog] = React.useState<boolean>(false);
  const [subscriptionDialogOpen, openSubscriptionDialog] = React.useState<boolean>(false);

  React.useEffect(() => {
    // This is just for testing, to check if we're getting the right state
    // and gives us an idea about the number of re-renders.
    console.log(state);
  });

  const { integratedEditor, initialFileMetadataToOpen, introDialog } = props;
  React.useEffect(
    () => {
      if (!integratedEditor) openStartPage();
      GD_STARTUP_TIMES.push([
        'MainFrameComponentDidMount',
        performance.now(),
      ]);
      _loadExtensions()
        .then(() =>
          // Enable the GDJS development watcher *after* the extensions are loaded,
          // to avoid the watcher interfering with the extension loading (by updating GDJS,
          // which could lead in the extension loading failing for some extensions as file
          // are removed/copied).
          setState(state => ({
            ...state,
            gdjsDevelopmentWatcherEnabled: true,
          }))
        )
        .then(state => {
          if (initialFileMetadataToOpen) {
            _openInitialFileMetadata(/* isAfterUserInteraction= */ false);
          } else if (introDialog && !Window.isDev()) openIntroDialog(true);

          GD_STARTUP_TIMES.push([
            'MainFrameComponentDidMountFinished',
            performance.now(),
          ]);
          console.info('Startup times:', getStartupTimesSummary());
        })
        .catch(() => {
          /* Ignore errors */
        });
    },
    // eslint-disable-next-line
    []
  );

  const _openInitialFileMetadata = (isAfterUserInteraction: boolean) => {
    const { storageProviderOperations, initialFileMetadataToOpen } = props;

    if (!initialFileMetadataToOpen) return;

    if (
      !isAfterUserInteraction &&
      storageProviderOperations.doesInitialOpenRequireUserInteraction
    ) {
      _openOpenConfirmDialog(true);
      return;
    }

    openFromFileMetadata(initialFileMetadataToOpen, state, {
      i18n: props.i18n,
      storageProviderOperations: props.storageProviderOperations,
      eventsFunctionsExtensionsState: props.eventsFunctionsExtensionsState,
    }).then(state => {
      if (state)
        openSceneOrProjectManager({
          currentProject: state.currentProject,
          editorTabs: state.editorTabs,
        });
    });
  };

  const updateToolbar = React.useCallback(
    (newEditorTabs = state.editorTabs) => {
      const editorTab = getCurrentTab(newEditorTabs);
      if (!editorTab || !editorTab.editorRef) {
        setEditorToolbar(null);
        return;
      }

      editorTab.editorRef.updateToolbar();
    },
    [state.editorTabs]
  );

  React.useEffect(
    () => {
      updateToolbar();
    },
    [updateToolbar]
  );

  const _languageDidChange = () => {
    // A change in the language will automatically be applied
    // on all React components, as it's handled by GDI18nProvider.
    // We still have this method that will be called when the language
    // dialog is closed after a language change. We then reload GDevelop
    // extensions so that they declare all objects/actions/condition/etc...
    // using the new language.
    gd.JsPlatform.get().reloadBuiltinExtensions();
    _loadExtensions().catch(() => {});
  };

  const _loadExtensions = (): Promise<void> => {
    const { extensionsLoader, i18n } = props;
    if (!extensionsLoader) {
      console.info(
        'No extensions loader specified, skipping extensions loading.'
      );
      return Promise.reject(new Error('No extension loader specified.'));
    }

    return extensionsLoader
      .loadAllExtensions(getNotNullTranslationFunction(i18n))
      .then(loadingResults => {
        const successLoadingResults = loadingResults.filter(
          loadingResult => !loadingResult.result.error
        );
        const failLoadingResults = loadingResults.filter(
          loadingResult =>
            loadingResult.result.error && !loadingResult.result.dangerous
        );
        const dangerousLoadingResults = loadingResults.filter(
          loadingResult =>
            loadingResult.result.error && loadingResult.result.dangerous
        );
        console.info(`Loaded ${successLoadingResults.length} JS extensions.`);
        if (failLoadingResults.length) {
          console.error(
            `⚠️ Unable to load ${
              failLoadingResults.length
            } JS extensions. Please check these errors:`,
            failLoadingResults
          );
        }
        if (dangerousLoadingResults.length) {
          console.error(
            `💣 Dangerous exceptions while loading ${
              dangerousLoadingResults.length
            } JS extensions. 🔥 Please check these errors as they will CRASH GDevelop:`,
            dangerousLoadingResults
          );
        }
      });
  };

  const loadFromSerializedProject = (
    serializedProject: gdSerializerElement,
    fileMetadata: ?FileMetadata,
    newState: {
      currentProject: ?gdProject,
      editorTabs: EditorTabsState,
    },
    eventsFunctionsExtensionsState = props.eventsFunctionsExtensionsState
  ): Promise<State> => {
    return timePromise(
      () => {
        const newProject = gd.ProjectHelper.createNewGDJSProject();
        newProject.unserializeFrom(serializedProject);
        return loadFromProject(
          newProject,
          fileMetadata,
          newState,
          eventsFunctionsExtensionsState
        ).then(state => Promise.resolve(state));
      },
      time => console.info(`Unserialization took ${time} ms`)
    );
  };

  const loadFromProject = (
    project: gdProject,
    fileMetadata: ?FileMetadata,
    newState: {
      currentProject: ?gdProject,
      editorTabs: EditorTabsState,
    },
    eventsFunctionsExtensionsState = props.eventsFunctionsExtensionsState
  ): Promise<State> => {
    return closeProject(newState, eventsFunctionsExtensionsState).then(
      state => {
        // Make sure that the ResourcesLoader cache is emptied, so that
        // the URL to a resource with a name in the old project is not re-used
        // for another resource with the same name in the new project.
        ResourcesLoader.burstAllUrlsCache();
        // TODO: Pixi cache should also be burst
        eventsFunctionsExtensionsState.loadProjectEventsFunctionsExtensions(
          project
        );
        if (fileMetadata) {
          project.setProjectFile(fileMetadata.fileIdentifier);
        }
        return setState({
          ...state,
          currentProject: project,
          currentFileMetadata: fileMetadata,
          createDialogOpen: false,
        }).then(state => {
          if (
            state.editorTabs.editors.length > 1 ||
            state.isPreviewFirstSceneOverriden
          )
            return setState({
              ...state,
              editorTabs: closeProjectTabs(
                state.editorTabs,
                state.currentProject
              ),
              isPreviewFirstSceneOverriden: false,
              previewFirstSceneName: '',
            });
          return Promise.resolve(state);
        });
      }
    );
  };

  const openFromFileMetadata = (
    fileMetadata: FileMetadata,
    newState: State = state,
    newProps: {
      i18n: I18n,
      storageProviderOperations: StorageProviderOperations,
      eventsFunctionsExtensionsState: EventsFunctionsExtensionsState,
    }
  ): Promise<?State> => {
    const {
      i18n,
      storageProviderOperations,
      eventsFunctionsExtensionsState,
    } = newProps;
    const {
      hasAutoSave,
      onGetAutoSave,
      onOpen,
      getOpenErrorMessage,
    } = storageProviderOperations;

    if (!onOpen) {
      console.error(
        'Tried to open a file for a storage without onOpen support:',
        fileMetadata,
        storageProviderOperations
      );
      return Promise.resolve();
    }

    const checkForAutosave = (): Promise<FileMetadata> => {
      if (!hasAutoSave || !onGetAutoSave) {
        return Promise.resolve(fileMetadata);
      }

      return hasAutoSave(fileMetadata, true).then(canOpenAutosave => {
        if (!canOpenAutosave) return fileMetadata;

        const answer = Window.showConfirmDialog(
          i18n._(
            t`An autosave file (backup made automatically by GDevelop) that is newer than the project file exists. Would you like to load it instead?`
          )
        );
        if (!answer) return fileMetadata;

        return onGetAutoSave(fileMetadata);
      });
    };

    const checkForAutosaveAfterFailure = (): Promise<?FileMetadata> => {
      if (!hasAutoSave || !onGetAutoSave) {
        return Promise.resolve(null);
      }

      return hasAutoSave(fileMetadata, false).then(canOpenAutosave => {
        if (!canOpenAutosave) return null;

        const answer = Window.showConfirmDialog(
          i18n._(
            t`The project file appears to be malformed, but an autosave file exists (backup made automatically by GDevelop). Would you like to try to load it instead?`
          )
        );
        if (!answer) return null;

        return onGetAutoSave(fileMetadata);
      });
    };

    return setState({ ...newState, loadingProject: true }).then(state => {
      // Try to find an autosave (and ask user if found)
      return checkForAutosave()
        .then(fileMetadata => onOpen(fileMetadata))
        .catch(err => {
          // onOpen failed, tried to find again an autosave
          return checkForAutosaveAfterFailure().then(fileMetadata => {
            if (fileMetadata) {
              return onOpen(fileMetadata);
            }

            throw err;
          });
        })
        .then(({ content }) => {
          if (!verifyProjectContent(i18n, content)) {
            // The content is not recognized and the user was warned. Abort the opening.
            return;
          }

          const serializedProject = gd.Serializer.fromJSObject(content);
          return loadFromSerializedProject(
            serializedProject,
            // Note that fileMetadata is the original, unchanged one, even if we're loading
            // an autosave. If we're for some reason loading an autosave, we still consider
            // that we're opening the file that was originally requested by the user.
            fileMetadata,
            {
              currentProject: state.currentProject,
              editorTabs: state.editorTabs,
            },
            eventsFunctionsExtensionsState
          ).then(
            state => {
              serializedProject.delete();
              return Promise.resolve(state);
            },
            err => {
              serializedProject.delete();
              throw err;
            }
          );
        })
        .catch(error => {
          const errorMessage = getOpenErrorMessage
            ? getOpenErrorMessage(error)
            : t`Check that the path/URL is correct, that you selected a file that is a game file created with GDevelop and that is was not removed.`;
          showErrorBox(
            [i18n._(t`Unable to open the project.`), i18n._(errorMessage)].join(
              '\n'
            ),
            error
          );
        });
    });
  };

  const closeApp = (): void => {
    return Window.quit();
  };

  const closeProject = (
    newState: {
      currentProject: ?gdProject,
      editorTabs: EditorTabsState,
    },
    eventsFunctionsExtensionsState: EventsFunctionsExtensionsState
  ): Promise<State> => {
    const { currentProject, editorTabs } = newState;
    if (!currentProject)
      return Promise.resolve({ ...state, currentProject, editorTabs });

    if (currentProject) {
      eventsFunctionsExtensionsState.unloadProjectEventsFunctionsExtensions(
        currentProject
      );
      currentProject.delete();
    }
    return setState(state => ({
      ...state,
      currentProject: null,
      currentFileMetadata: null,
      editorTabs: closeProjectTabs(editorTabs, currentProject),
      isPreviewFirstSceneOverriden: false,
      previewFirstSceneName: '',
    }));
  };

  const toggleProjectManager = () => {
    if (toolbar.current)
      openProjectManager(projectManagerOpen => !projectManagerOpen)
  };

  const setEditorToolbar = (editorToolbar: any) => {
    if (!toolbar.current) return;

    toolbar.current.setEditorToolbar(editorToolbar);
  };

  const _togglePreviewFirstSceneOverride = () => {
    setState(state => ({
      ...state,
      isPreviewFirstSceneOverriden: !state.isPreviewFirstSceneOverriden,
    }));
  };

  const addLayout = () => {
    const { currentProject } = state;
    if (!currentProject) return;

    const name = newNameGenerator('New scene', name =>
      currentProject.hasLayoutNamed(name)
    );
    const newLayout = currentProject.insertNewLayout(
      name,
      currentProject.getLayoutsCount()
    );
    newLayout.updateBehaviorsSharedData(currentProject);
    _onProjectItemModified();
  };

  const addExternalLayout = () => {
    const { currentProject } = state;
    if (!currentProject) return;

    const name = newNameGenerator('NewExternalLayout', name =>
      currentProject.hasExternalLayoutNamed(name)
    );
    currentProject.insertNewExternalLayout(
      name,
      currentProject.getExternalLayoutsCount()
    );
    _onProjectItemModified();
  };

  const addExternalEvents = () => {
    const { currentProject } = state;
    if (!currentProject) return;

    const name = newNameGenerator('NewExternalEvents', name =>
      currentProject.hasExternalEventsNamed(name)
    );
    currentProject.insertNewExternalEvents(
      name,
      currentProject.getExternalEventsCount()
    );
    _onProjectItemModified();
  };

  const addEventsFunctionsExtension = () => {
    const { currentProject } = state;
    if (!currentProject) return;

    const name = newNameGenerator('NewExtension', name =>
      currentProject.hasEventsFunctionsExtensionNamed(name)
    );
    currentProject.insertNewEventsFunctionsExtension(
      name,
      currentProject.getEventsFunctionsExtensionsCount()
    );
    _onProjectItemModified();
  };

  const deleteLayout = (layout: gdLayout) => {
    const { i18n } = props;
    if (!state.currentProject) return;

    const answer = Window.showConfirmDialog(
      i18n._(
        t`Are you sure you want to remove this scene? This can't be undone.`
      )
    );
    if (!answer) return;

    setState(state => ({
      ...state,
      editorTabs: closeLayoutTabs(state.editorTabs, layout),
    })).then(state => {
      if (state.currentProject)
        state.currentProject.removeLayout(layout.getName());
      _onProjectItemModified();
    });
  };

  const deleteExternalLayout = (externalLayout: gdExternalLayout) => {
    const { currentProject } = state;
    const { i18n } = props;
    if (!currentProject) return;

    const answer = Window.showConfirmDialog(
      i18n._(
        t`Are you sure you want to remove this external layout? This can't be undone.`
      )
    );
    if (!answer) return;

    setState(state => ({
      ...state,
      editorTabs: closeExternalLayoutTabs(state.editorTabs, externalLayout),
    })).then(state => {
      if (state.currentProject)
        state.currentProject.removeExternalLayout(externalLayout.getName());
      _onProjectItemModified();
    });
  };

  const deleteExternalEvents = (externalEvents: gdExternalEvents) => {
    const { i18n } = props;
    if (!state.currentProject) return;

    const answer = Window.showConfirmDialog(
      i18n._(
        t`Are you sure you want to remove these external events? This can't be undone.`
      )
    );
    if (!answer) return;

    setState(state => ({
      ...state,
      editorTabs: closeExternalEventsTabs(state.editorTabs, externalEvents),
    })).then(state => {
      if (state.currentProject)
        state.currentProject.removeExternalEvents(externalEvents.getName());
      _onProjectItemModified();
    });
  };

  const deleteEventsFunctionsExtension = (
    externalLayout: gdEventsFunctionsExtension
  ) => {
    const { currentProject } = state;
    const { i18n, eventsFunctionsExtensionsState } = props;
    if (!currentProject) return;

    const answer = Window.showConfirmDialog(
      i18n._(
        t`Are you sure you want to remove this extension? This can't be undone.`
      )
    );
    if (!answer) return;

    setState(state => ({
      ...state,
      editorTabs: closeEventsFunctionsExtensionTabs(
        state.editorTabs,
        externalLayout
      ),
    })).then(state => {
      currentProject.removeEventsFunctionsExtension(externalLayout.getName());
      _onProjectItemModified();
    });

    // Reload extensions to make sure the deleted extension is removed
    // from the platform
    eventsFunctionsExtensionsState.reloadProjectEventsFunctionsExtensions(
      currentProject
    );
  };

  const renameLayout = (oldName: string, newName: string) => {
    const { currentProject } = state;
    const { i18n } = props;
    if (!currentProject) return;

    if (!currentProject.hasLayoutNamed(oldName) || newName === oldName) return;

    if (newName === '') {
      showWarningBox(
        i18n._(t`This name cannot be empty, please enter a new name.`)
      );
      return;
    }

    if (currentProject.hasLayoutNamed(newName)) {
      showWarningBox(i18n._(t`Another scene with this name already exists.`));
      return;
    }

    const layout = currentProject.getLayout(oldName);
    setState(state => ({
      ...state,
      editorTabs: closeLayoutTabs(state.editorTabs, layout),
    })).then(state => {
      layout.setName(newName);
      _onProjectItemModified();
    });
  };

  const renameExternalLayout = (oldName: string, newName: string) => {
    const { currentProject } = state;
    const { i18n } = props;
    if (!currentProject) return;

    if (!currentProject.hasExternalLayoutNamed(oldName) || newName === oldName)
      return;

    if (newName === '') {
      showWarningBox(
        i18n._(t`This name cannot be empty, please enter a new name.`)
      );
      return;
    }

    if (currentProject.hasExternalLayoutNamed(newName)) {
      showWarningBox(
        i18n._(t`Another external layout with this name already exists.`)
      );
      return;
    }

    const externalLayout = currentProject.getExternalLayout(oldName);
    setState(state => ({
      ...state,
      editorTabs: closeExternalLayoutTabs(state.editorTabs, externalLayout),
    })).then(state => {
      externalLayout.setName(newName);
      _onProjectItemModified();
    });
  };

  const renameExternalEvents = (oldName: string, newName: string) => {
    const { currentProject } = state;
    const { i18n } = props;
    if (!currentProject) return;

    if (!currentProject.hasExternalEventsNamed(oldName) || newName === oldName)
      return;

    if (newName === '') {
      showWarningBox(
        i18n._(t`This name cannot be empty, please enter a new name.`)
      );
      return;
    }

    if (currentProject.hasExternalEventsNamed(newName)) {
      showWarningBox(
        i18n._(t`Other external events with this name already exist.`)
      );
      return;
    }

    const externalEvents = currentProject.getExternalEvents(oldName);
    setState(state => ({
      ...state,
      editorTabs: closeExternalEventsTabs(state.editorTabs, externalEvents),
    })).then(state => {
      externalEvents.setName(newName);
      _onProjectItemModified();
    });
  };

  const renameEventsFunctionsExtension = (oldName: string, newName: string) => {
    const { currentProject } = state;
    const { i18n } = props;
    const { eventsFunctionsExtensionsState } = props;
    if (!currentProject) return;

    if (
      !currentProject.hasEventsFunctionsExtensionNamed(oldName) ||
      newName === oldName
    )
      return;

    if (newName === '') {
      showWarningBox(
        i18n._(t`This name cannot be empty, please enter a new name.`)
      );
      return;
    }

    if (currentProject.hasEventsFunctionsExtensionNamed(newName)) {
      showWarningBox(
        i18n._(t`Another extension with this name already exists.`)
      );
      return;
    }

    if (!gd.Project.validateName(newName)) {
      showWarningBox(
        i18n._(
          t`This name is invalid. Only use alphanumeric characters (0-9, a-z) and underscores. Digits are not allowed as the first character.`
        )
      );
      return;
    }

    const eventsFunctionsExtension = currentProject.getEventsFunctionsExtension(
      oldName
    );
    setState(state => ({
      ...state,
      editorTabs: closeEventsFunctionsExtensionTabs(
        state.editorTabs,
        eventsFunctionsExtension
      ),
    })).then(state => {
      // Refactor the project to update the instructions (and later expressions)
      // of this extension:
      gd.WholeProjectRefactorer.renameEventsFunctionsExtension(
        currentProject,
        eventsFunctionsExtension,
        oldName,
        newName
      );
      eventsFunctionsExtension.setName(newName);
      eventsFunctionsExtensionsState.reloadProjectEventsFunctionsExtensions(
        currentProject
      );
      _onProjectItemModified();
    });
  };

  const _launchLayoutPreview = (
    project: gdProject,
    layout: gdLayout,
    options: PreviewOptions
  ) => {
    if (!_previewLauncher.current) return;

    setState(state => ({
      ...state,
      previewLoading: true,
    }))
      .then(state => {
        let previewedLayout = layout;
        const { previewFirstSceneName, isPreviewFirstSceneOverriden } = state;
        if (previewFirstSceneName && isPreviewFirstSceneOverriden) {
          if (project.hasLayoutNamed(previewFirstSceneName)) {
            previewedLayout = project.getLayout(previewFirstSceneName);
          }
        }
        if (_previewLauncher.current)
          return _previewLauncher.current.launchLayoutPreview(
            project,
            previewedLayout,
            options
          );
      })
      .catch(error => {
        console.error(
          'Error caught while launching preview, this should never happen.',
          error
        );
      })
      .then(() => {
        setState(state => ({
          ...state,
          previewLoading: false,
        }));
      });
  };

  const _launchExternalLayoutPreview = (
    project: gdProject,
    layout: gdLayout,
    externalLayout: gdExternalLayout,
    options: PreviewOptions
  ) => {
    if (!_previewLauncher.current) return;

    setState(state => ({
      ...state,
      previewLoading: true,
    })).then(state => {
      if (_previewLauncher.current)
        _previewLauncher.current
          .launchExternalLayoutPreview(project, layout, externalLayout, options)
          .catch(error => {
            console.error(
              'Error caught while launching preview, this should never happen.',
              error
            );
          })
          .then(() => {
            setState(state => ({
              ...state,
              previewLoading: false,
            }));
          });
    });
  };

  const openLayout = (
    name: string,
    {
      openEventsEditor = true,
      openSceneEditor = true,
    }: { openEventsEditor: boolean, openSceneEditor: boolean } = {},
    editorTabs = state.editorTabs
  ) => {
    const { i18n, storageProviderOperations } = props;
    const sceneEditorOptions = {
      label: name,
      renderEditor: ({ isActive, editorRef, newState, newProps }) => (
        <PreferencesContext.Consumer>
          {({ values }) => (
            <SceneEditor
              previewButtonSettings={{
                isPreviewFirstSceneOverriden:
                  newState.isPreviewFirstSceneOverriden,
                togglePreviewFirstSceneOverride: () =>
                  _togglePreviewFirstSceneOverride(),
                previewFirstSceneName: newState.previewFirstSceneName,
                useSceneAsPreviewFirstScene: () => {
                  _setPreviewFirstScene(name);
                },
              }}
              project={newState.currentProject}
              layoutName={name}
              setToolbar={setEditorToolbar}
              onPreview={(project, layout, options) => {
                _launchLayoutPreview(project, layout, options);
                const { currentFileMetadata } = newState;
                if (
                  values.autosaveOnPreview &&
                  storageProviderOperations.onAutoSaveProject &&
                  currentFileMetadata
                ) {
                  storageProviderOperations.onAutoSaveProject(
                    project,
                    currentFileMetadata
                  );
                }
              }}
              showPreviewButton={!!newProps.renderPreviewLauncher}
              showNetworkPreviewButton={
                _previewLauncher.current &&
                _previewLauncher.current.canDoNetworkPreview()
              }
              onOpenDebugger={openDebugger}
              onEditObject={newProps.onEditObject}
              resourceSources={newProps.resourceSources}
              onChooseResource={(sourceName, multiSelection) =>
                _onChooseResource(
                  sourceName,
                  multiSelection,
                  newState.currentProject
                )
              }
              resourceExternalEditors={newProps.resourceExternalEditors}
              isActive={isActive}
              ref={editorRef}
              unsavedChanges={newProps.unsavedChanges}
            />
          )}
        </PreferencesContext.Consumer>
      ),
      key: 'layout ' + name,
    };
    const eventsEditorOptions = {
      label: name + ' ' + i18n._(t`(Events)`),
      renderEditor: ({ isActive, editorRef, newState, newProps }) => (
        <PreferencesContext.Consumer>
          {({ values }) => (
            <EventsEditor
              project={newState.currentProject}
              layoutName={name}
              setToolbar={setEditorToolbar}
              previewButtonSettings={{
                isPreviewFirstSceneOverriden:
                  newState.isPreviewFirstSceneOverriden,
                togglePreviewFirstSceneOverride: () =>
                  _togglePreviewFirstSceneOverride(),
                previewFirstSceneName: newState.previewFirstSceneName,
                useSceneAsPreviewFirstScene: () => {
                  _setPreviewFirstScene(name);
                },
              }}
              onPreview={(project, layout, options) => {
                _launchLayoutPreview(project, layout, options);
                const { currentFileMetadata } = newState;
                if (
                  values.autosaveOnPreview &&
                  storageProviderOperations.onAutoSaveProject &&
                  currentFileMetadata
                ) {
                  storageProviderOperations.onAutoSaveProject(
                    project,
                    currentFileMetadata
                  );
                }
              }}
              showPreviewButton={!!newProps.renderPreviewLauncher}
              showNetworkPreviewButton={
                _previewLauncher.current &&
                _previewLauncher.current.canDoNetworkPreview()
              }
              onOpenDebugger={openDebugger}
              onOpenExternalEvents={openExternalEvents}
              onOpenLayout={name =>
                openLayout(name, {
                  openEventsEditor: true,
                  openSceneEditor: false,
                })
              }
              resourceSources={newProps.resourceSources}
              onChooseResource={(sourceName, multiSelection) =>
                _onChooseResource(
                  sourceName,
                  multiSelection,
                  newState.currentProject
                )
              }
              resourceExternalEditors={newProps.resourceExternalEditors}
              openInstructionOrExpression={(extension, type) =>
                _openInstructionOrExpression(extension, type, {
                  currentProject: newState.currentProject,
                  editorTabs: newState.editorTabs,
                })
              }
              onCreateEventsFunction={(extensionName, eventsFunction) =>
                _onCreateEventsFunction(
                  extensionName,
                  eventsFunction,
                  newState.currentProject,
                  newProps.eventsFunctionsExtensionsState
                )
              }
              isActive={isActive}
              ref={editorRef}
              unsavedChanges={newProps.unsavedChanges}
            />
          )}
        </PreferencesContext.Consumer>
      ),
      key: 'layout events ' + name,
      dontFocusTab: openSceneEditor,
    };

    const tabsWithSceneEditor = openSceneEditor
      ? openEditorTab(editorTabs, sceneEditorOptions)
      : editorTabs;
    const tabsWithSceneAndEventsEditors = openEventsEditor
      ? openEditorTab(tabsWithSceneEditor, eventsEditorOptions)
      : tabsWithSceneEditor;

    setState(state => ({
      ...state,
      editorTabs: tabsWithSceneAndEventsEditors,
      loadingProject: false,
    }));
    openProjectManager(false);
  };

  const openExternalEvents = (name: string) => {
    setState(state => ({
      ...state,
      editorTabs: openEditorTab(state.editorTabs, {
        label: name,
        renderEditor: ({ isActive, editorRef, newState, newProps }) => (
          <ExternalEventsEditor
            project={newState.currentProject}
            externalEventsName={name}
            setToolbar={setEditorToolbar}
            onOpenExternalEvents={openExternalEvents}
            onOpenLayout={name =>
              openLayout(name, {
                openEventsEditor: true,
                openSceneEditor: false,
              })
            }
            resourceSources={newProps.resourceSources}
            onChooseResource={(sourceName, multiSelection) =>
              _onChooseResource(
                sourceName,
                multiSelection,
                newState.currentProject
              )
            }
            resourceExternalEditors={newProps.resourceExternalEditors}
            openInstructionOrExpression={(extension, type) =>
              _openInstructionOrExpression(extension, type, {
                currentProject: newState.currentProject,
                editorTabs: newState.editorTabs,
              })
            }
            onCreateEventsFunction={(extensionName, eventsFunction) =>
              _onCreateEventsFunction(
                extensionName,
                eventsFunction,
                newState.currentProject,
                newProps.eventsFunctionsExtensionsState
              )
            }
            previewButtonSettings={emptyPreviewButtonSettings}
            isActive={isActive}
            ref={editorRef}
            unsavedChanges={newProps.unsavedChanges}
          />
        ),
        key: 'external events ' + name,
      }),
    }));
    openProjectManager(false);
  };

  const openExternalLayout = (name: string) => {
    const { storageProviderOperations } = props;
    setState(state => ({
      ...state,
      editorTabs: openEditorTab(state.editorTabs, {
        label: name,
        renderEditor: ({ isActive, editorRef, newState, newProps }) => (
          <PreferencesContext.Consumer>
            {({ values }) => (
              <ExternalLayoutEditor
                project={newState.currentProject}
                externalLayoutName={name}
                setToolbar={setEditorToolbar}
                onPreview={(project, layout, externalLayout, options) => {
                  _launchExternalLayoutPreview(
                    project,
                    layout,
                    externalLayout,
                    options
                  );
                  const { currentFileMetadata } = state;
                  if (
                    values.autosaveOnPreview &&
                    storageProviderOperations.onAutoSaveProject &&
                    currentFileMetadata
                  ) {
                    storageProviderOperations.onAutoSaveProject(
                      project,
                      currentFileMetadata
                    );
                  }
                }}
                showPreviewButton={!!newProps.renderPreviewLauncher}
                showNetworkPreviewButton={
                  _previewLauncher.current &&
                  _previewLauncher.current.canDoNetworkPreview()
                }
                previewButtonSettings={emptyPreviewButtonSettings}
                onOpenDebugger={openDebugger}
                onEditObject={newProps.onEditObject}
                resourceSources={newProps.resourceSources}
                onChooseResource={(sourceName, multiSelection) =>
                  _onChooseResource(
                    sourceName,
                    multiSelection,
                    newState.currentProject
                  )
                }
                resourceExternalEditors={newProps.resourceExternalEditors}
                isActive={isActive}
                ref={editorRef}
              />
            )}
          </PreferencesContext.Consumer>
        ),
        key: 'external layout ' + name,
      }),
    }));
    openProjectManager(false);
  };

  const openEventsFunctionsExtension = (
    name: string,
    initiallyFocusedFunctionName?: string,
    initiallyFocusedBehaviorName?: ?string
  ) => {
    const { i18n, eventsFunctionsExtensionsState } = props;
    setState(state => ({
      ...state,
      editorTabs: openEditorTab(state.editorTabs, {
        label: name + ' ' + i18n._(t`(Extension)`),
        renderEditor: ({ isActive, editorRef, newState, newProps }) => (
          <EventsFunctionsExtensionEditor
            project={newState.currentProject}
            eventsFunctionsExtensionName={name}
            setToolbar={setEditorToolbar}
            resourceSources={newProps.resourceSources}
            onChooseResource={(sourceName, multiSelection) =>
              _onChooseResource(
                sourceName,
                multiSelection,
                newState.currentProject
              )
            }
            resourceExternalEditors={newProps.resourceExternalEditors}
            isActive={isActive}
            initiallyFocusedFunctionName={initiallyFocusedFunctionName}
            initiallyFocusedBehaviorName={initiallyFocusedBehaviorName}
            openInstructionOrExpression={(extension, type) =>
              _openInstructionOrExpression(extension, type, {
                currentProject: newState.currentProject,
                editorTabs: newState.editorTabs,
              })
            }
            onCreateEventsFunction={(extensionName, eventsFunction) =>
              _onCreateEventsFunction(
                extensionName,
                eventsFunction,
                newState.currentProject,
                newProps.eventsFunctionsExtensionsState
              )
            }
            ref={editorRef}
            onLoadEventsFunctionsExtensions={() => {
              eventsFunctionsExtensionsState.loadProjectEventsFunctionsExtensions(
                newState.currentProject
              );
            }}
            unsavedChanges={newProps.unsavedChanges}
          />
        ),
        key: 'events functions extension ' + name,
      }),
    }));
    openProjectManager(false);
  };

  const openResources = () => {
    const { i18n } = props;
    setState(state => ({
      ...state,
      editorTabs: openEditorTab(state.editorTabs, {
        label: i18n._(t`Resources`),
        renderEditor: ({ isActive, editorRef, newState, newProps }) => (
          <ResourcesEditor
            project={newState.currentProject}
            setToolbar={setEditorToolbar}
            onDeleteResource={(resource: gdResource, cb: boolean => void) => {
              // TODO: Project wide refactoring of objects/events using the resource
              cb(true);
            }}
            onRenameResource={(
              resource: gdResource,
              newName: string,
              cb: boolean => void
            ) => {
              // TODO: Project wide refactoring of objects/events using the resource
              cb(true);
            }}
            isActive={isActive}
            ref={editorRef}
            onChooseResource={(sourceName, multiSelection) =>
              _onChooseResource(
                sourceName,
                multiSelection,
                newState.currentProject
              )
            }
            resourceSources={newProps.resourceSources}
          />
        ),
        key: 'resources',
      }),
    }));
  };

  const openStartPage = () => {
    const { i18n, storageProviders } = props;
    setState(state => ({
      ...state,
      editorTabs: openEditorTab(state.editorTabs, {
        label: i18n._(t`Start Page`),
        renderEditor: ({ isActive, editorRef, newState, newProps }) => (
          <StartPage
            project={newState.currentProject}
            setToolbar={setEditorToolbar}
            canOpen={
              !!storageProviders.filter(
                ({ hiddenInOpenDialog }) => !hiddenInOpenDialog
              ).length
            }
            onOpen={() => chooseProject(newState, newProps)}
            onCreate={() => openCreateDialog()}
            onOpenProjectManager={() => openProjectManager(true)}
            onCloseProject={() =>
              askToCloseProject(
                {
                  currentProject: newState.currentProject,
                  editorTabs: newState.editorTabs,
                },
                {
                  unsavedChanges: newProps.unsavedChanges,
                  eventsFunctionsExtensionsState:
                    newProps.eventsFunctionsExtensionsState,
                }
              )
            }
            onOpenAboutDialog={() => openAboutDialog(true)}
            onOpenHelpFinder={() => openHelpFinderDialog(true)}
            onOpenLanguageDialog={() => openLanguageDialog(true)}
            isActive={isActive}
            ref={editorRef}
          />
        ),
        key: 'start page',
        closable: false,
      }),
    }));
  };

  const openDebugger = () => {
    const { i18n } = props;
    setState(state => ({
      ...state,
      editorTabs: openEditorTab(state.editorTabs, {
        label: i18n._(t`Debugger`),
        renderEditor: ({ isActive, editorRef, newState }) => (
          <DebuggerEditor
            project={newState.currentProject}
            setToolbar={setEditorToolbar}
            isActive={isActive}
            ref={editorRef}
            onChangeSubscription={() => openSubscriptionDialog(true)}
          />
        ),
        key: 'debugger',
      }),
    }));
  };

  const _openInstructionOrExpression = (
    extension: gdPlatformExtension,
    type: string,
    newState: {
      currentProject: ?gdProject,
      editorTabs: EditorTabsState,
    }
  ) => {
    const { currentProject, editorTabs } = newState;
    if (!currentProject) return;

    const extensionName = extension.getName();
    if (currentProject.hasEventsFunctionsExtensionNamed(extensionName)) {
      // It's an events functions extension, open the editor for it.
      const eventsFunctionsExtension = currentProject.getEventsFunctionsExtension(
        extensionName
      );
      const functionName = getFunctionNameFromType(type);

      const foundTab = getEventsFunctionsExtensionEditor(
        editorTabs,
        eventsFunctionsExtension
      );
      if (foundTab) {
        // Open the given function and focus the tab
        foundTab.editor.selectEventsFunctionByName(
          functionName.name,
          functionName.behaviorName
        );
        setState(state => ({
          ...state,
          editorTabs: changeCurrentTab(editorTabs, foundTab.tabIndex),
        }));
      } else {
        // Open a new editor for the extension and the given function
        openEventsFunctionsExtension(
          extensionName,
          functionName.name,
          functionName.behaviorName
        );
      }
    } else {
      // It's not an events functions extension, we should not be here.
      console.warn(
        `Extension with name=${extensionName} can not be opened (no editor for this)`
      );
    }
  };

  const _onProjectItemModified = () => {
    if (props.unsavedChanges) props.unsavedChanges.triggerUnsavedChanges();
    forceUpdate();
  };

  const _onCreateEventsFunction = (
    extensionName: string,
    eventsFunction: gdEventsFunction,
    currentProject: ?gdProject,
    eventsFunctionsExtensionsState: EventsFunctionsExtensionsState
  ) => {
    if (!currentProject) return;

    // Names are assumed to be already validated
    const createNewExtension = !currentProject.hasEventsFunctionsExtensionNamed(
      extensionName
    );
    const extension = createNewExtension
      ? currentProject.insertNewEventsFunctionsExtension(extensionName, 0)
      : currentProject.getEventsFunctionsExtension(extensionName);

    if (createNewExtension) {
      extension.setFullName(extensionName);
      extension.setDescription(
        'Originally automatically extracted from events of the project'
      );
    }

    extension.insertEventsFunction(eventsFunction, 0);
    eventsFunctionsExtensionsState.loadProjectEventsFunctionsExtensions(
      currentProject
    );
  };

  const openCreateDialog = (open: boolean = true) => {
    setState(state => ({ ...state, createDialogOpen: open }));
  };

  const chooseProject = (newState: State = state, newProps: Props = props) => {
    const { storageProviders } = newProps;

    if (
      storageProviders.filter(({ hiddenInOpenDialog }) => !hiddenInOpenDialog)
        .length > 1
    ) {
      openOpenFromStorageProviderDialog();
    } else {
      chooseProjectWithStorageProviderPicker(newState, newProps);
    }
  };

  const chooseProjectWithStorageProviderPicker = (
    newState: State = state,
    newProps = {
      i18n: props.i18n,
      eventsFunctionsExtensionsState: props.eventsFunctionsExtensionsState,
      storageProviderOperations: props.storageProviderOperations,
    }
  ) => {
    const { storageProviderOperations, i18n } = newProps;
    if (!storageProviderOperations.onOpenWithPicker) return;

    storageProviderOperations
      .onOpenWithPicker()
      .then(fileMetadata => {
        if (!fileMetadata) return;

        return openFromFileMetadata(fileMetadata, newState, {
          i18n: newProps.i18n,
          storageProviderOperations: newProps.storageProviderOperations,
          eventsFunctionsExtensionsState:
            newProps.eventsFunctionsExtensionsState,
        }).then(state => {
          if (state)
            openSceneOrProjectManager({
              currentProject: state.currentProject,
              editorTabs: state.editorTabs,
            });
          //addRecentFile(fileMetadata);
        });
      })
      .catch(error => {
        const errorMessage = storageProviderOperations.getOpenErrorMessage
          ? storageProviderOperations.getOpenErrorMessage(error)
          : t`Verify that you have the authorizations for reading the file you're trying to access.`;
        showErrorBox(
          [i18n._(t`Unable to open the project.`), i18n._(errorMessage)].join(
            '\n'
          ),
          error
        );
      });
  };

  const saveProject = () => {
    const { currentProject, currentFileMetadata } = state;
    if (!currentProject) return;
    if (!currentFileMetadata) {
      return saveProjectAs();
    }

    const { i18n, storageProviderOperations } = props;
    const { onSaveProject } = storageProviderOperations;
    if (!onSaveProject) {
      return saveProjectAs();
    }

    saveUiSettings(state.editorTabs);
    _showSnackMessage(i18n._(t`Saving...`));

    onSaveProject(currentProject, currentFileMetadata).then(
      ({ wasSaved }) => {
        if (wasSaved) {
          if (props.unsavedChanges) props.unsavedChanges.sealUnsavedChanges();
          _showSnackMessage(i18n._(t`Project properly saved`));
        }
      },
      err => {
        showErrorBox(
          i18n._(
            t`Unable to save the project! Please try again by choosing another location.`
          ),
          err
        );
      }
    );
  };

  const saveProjectAs = () => {
    const { currentProject } = state;
    const { storageProviders, storageProviderOperations } = props;
    if (!currentProject) return;

    if (
      storageProviders.filter(({ hiddenInSaveDialog }) => !hiddenInSaveDialog)
        .length > 1 ||
      !storageProviderOperations.onSaveProjectAs
    ) {
      openSaveToStorageProviderDialog();
    } else {
      saveProjectAsWithStorageProvider();
    }
  };

  const saveProjectAsWithStorageProvider = () => {
    const { currentProject, currentFileMetadata } = state;
    if (!currentProject) return;

    saveUiSettings(state.editorTabs);
    const { i18n, storageProviderOperations } = props;

    if (!storageProviderOperations.onSaveProjectAs) {
      return;
    }

    storageProviderOperations
      .onSaveProjectAs(currentProject, currentFileMetadata)
      .then(
        ({ wasSaved, fileMetadata }) => {
          if (wasSaved) {
            if (props.unsavedChanges) props.unsavedChanges.sealUnsavedChanges();
            _showSnackMessage(i18n._(t`Project properly saved`));

            if (fileMetadata) {
              setState(state => ({
                ...state,
                currentFileMetadata: fileMetadata,
              }));
            }
          }
        },
        err => {
          showErrorBox(
            i18n._(
              t`Unable to save as the project! Please try again by choosing another location.`
            ),
            err
          );
        }
      );
  };

  const askToCloseProject = (
    newState: {
      currentProject: ?gdProject,
      editorTabs: EditorTabsState,
    },
    newProps: {
      unsavedChanges: ?UnsavedChanges,
      eventsFunctionsExtensionsState: EventsFunctionsExtensionsState,
    }
  ): Promise<State> => {
    const { unsavedChanges, eventsFunctionsExtensionsState } = newProps;
    const { currentProject, editorTabs } = newState;
    if (unsavedChanges && unsavedChanges.hasUnsavedChanges) {
      if (!newState.currentProject)
        return Promise.resolve({ ...state, currentProject, editorTabs });

      const answer = Window.showConfirmDialog(
        i18n._(
          t`Close the project? Any changes that have not been saved will be lost.`
        )
      );
      if (!answer)
        return Promise.resolve({ ...state, currentProject, editorTabs });
    }
    return closeProject(newState, eventsFunctionsExtensionsState);
  };

  const openSceneOrProjectManager = (
    newState = {
      currentProject: state.currentProject,
      editorTabs: state.editorTabs,
    }
  ) => {
    const { currentProject, editorTabs } = newState;
    if (!currentProject) return;

    if (currentProject.getLayoutsCount() === 1) {
      openLayout(
        currentProject.getLayoutAt(0).getName(),
        {
          openSceneEditor: true,
          openEventsEditor: true,
        },
        editorTabs
      );
    } else {
      setState(state => ({
        ...state,
        currentProject,
        editorTabs,
        loadingProject: false,
      })).then(state => openProjectManager(true));
    }
  };

  const openExportDialog = (open: boolean = true) => {
    setState(state => ({ ...state, exportDialogOpen: open }));
  };

  const _openOpenConfirmDialog = (open: boolean = true) => {
    setState(state => ({ ...state, openConfirmDialogOpen: open }));
  };

  const _setPreviewFirstScene = (name: string) => {
    setState(state => ({
      ...state,
      previewFirstSceneName: name,
      isPreviewFirstSceneOverriden: true,
    }));
  };

  const _onChangeEditorTab = (value: number) => {
    setState(state => ({
      ...state,
      editorTabs: changeCurrentTab(state.editorTabs, value),
    })).then(state =>
      _onEditorTabActive(getCurrentTab(state.editorTabs), state)
    );
  };

  const _onEditorTabActive = (
    editorTab: EditorTab,
    newState: State = state
  ) => {
    updateToolbar(newState.editorTabs);
    // Ensure the editors shown on the screen are updated. This is for
    // example useful if global objects have been updated in another editor.
    if (editorTab.editorRef) {
      editorTab.editorRef.forceUpdateEditor();
    }
  };

  const _onCloseEditorTab = (editorTab: EditorTab) => {
    saveUiSettings(state.editorTabs);
    setState(state => ({
      ...state,
      editorTabs: closeEditorTab(state.editorTabs, editorTab),
    }));
  };

  const _onCloseOtherEditorTabs = (editorTab: EditorTab) => {
    saveUiSettings(state.editorTabs);
    setState(state => ({
      ...state,
      editorTabs: closeOtherEditorTabs(state.editorTabs, editorTab),
    }));
  };

  const _onCloseAllEditorTabs = () => {
    saveUiSettings(state.editorTabs);
    setState(state => ({
      ...state,
      editorTabs: closeAllEditorTabs(state.editorTabs),
    }));
  };

  const _onChooseResource = (
    sourceName: string,
    multiSelection: boolean = true,
    currentProject: ?gdProject
  ): Promise<Array<any>> => {
    const resourceSourceDialog = _resourceSourceDialogs.current[sourceName];
    if (!resourceSourceDialog) return Promise.resolve([]);

    return resourceSourceDialog.chooseResources(currentProject, multiSelection);
  };

  const openOpenFromStorageProviderDialog = (open: boolean = true) => {
    setState(state => ({ ...state, openFromStorageProviderDialogOpen: open }));
  };

  const openSaveToStorageProviderDialog = (open: boolean = true) => {
    if (open) {
      // Ensure the project manager is closed as Google Drive storage provider
      // display a picker that does not play nice with material-ui's overlays.
      openProjectManager(false);
    }
    setState(state => ({ ...state, saveToStorageProviderDialogOpen: open }));
  };

  const setUpdateStatus = (updateStatus: UpdateStatus) => {
    setState(state => ({ ...state, updateStatus }));

    const notificationTitle = getUpdateNotificationTitle(updateStatus);
    const notificationBody = getUpdateNotificationBody(updateStatus);
    if (notificationTitle) {
      const notification = new window.Notification(notificationTitle, {
        body: notificationBody,
      });
      notification.onclick = () => openAboutDialog(true);
    }
  };

  const simulateUpdateDownloaded = () =>
    setUpdateStatus({
      status: 'update-downloaded',
      message: 'update-downloaded',
      info: {
        releaseName: 'Fake update',
      },
    });

  const simulateUpdateAvailable = () =>
    setUpdateStatus({
      status: 'update-available',
      message: 'Update available',
    });

  const _showSnackMessage = (snackMessage: string) => {
    setState(state => ({
      ...state,
      snackMessage,
      snackMessageOpen: true,
    }));
  };
  const _closeSnackMessage = () => {
    setState(state => ({
      ...state,
      snackMessageOpen: false,
    }));
  };

  const {
    currentProject,
    currentFileMetadata,
    updateStatus,
    eventsFunctionsExtensionsError,
  } = state;
  const {
    renderExportDialog,
    renderCreateDialog,
    resourceSources,
    renderPreviewLauncher,
    resourceExternalEditors,
    eventsFunctionsExtensionsState,
    useStorageProvider,
    i18n,
    renderGDJSDevelopmentWatcher,
    renderMainMenu,
  } = props;
  const showLoader =
    state.loadingProject || state.previewLoading || props.loading;

  return (
    <div className="main-frame">
      {!!renderMainMenu &&
        renderMainMenu({
          i18n: i18n,
          project: state.currentProject,
          onChooseProject: chooseProject,
          onSaveProject: saveProject,
          onSaveProjectAs: saveProjectAs,
          onCloseProject: () =>
            askToCloseProject(
              {
                currentProject: state.currentProject,
                editorTabs: state.editorTabs,
              },
              {
                unsavedChanges: props.unsavedChanges,
                eventsFunctionsExtensionsState:
                  props.eventsFunctionsExtensionsState,
              }
            ),
          onCloseApp: closeApp,
          onExportProject: openExportDialog,
          onCreateProject: openCreateDialog,
          onOpenProjectManager: () => openProjectManager(true),
          onOpenStartPage: openStartPage,
          onOpenDebugger: openDebugger,
          onOpenAbout: () => openAboutDialog(true),
          onOpenPreferences: () => openPreferencesDialog(true),
          onOpenLanguage: () => openLanguageDialog(true),
          onOpenProfile: () => openProfileDialog(true),
          setUpdateStatus: setUpdateStatus,
        })}
      <ProjectTitlebar fileMetadata={currentFileMetadata} />
      <Drawer
        open={projectManagerOpen}
        PaperProps={{
          style: styles.drawerContent,
        }}
        ModalProps={{
          keepMounted: true,
        }}
        onClose={toggleProjectManager}
      >
        <EditorBar
          title={
            state.currentProject ? state.currentProject.getName() : 'No project'
          }
          displayRightCloseButton
          onClose={toggleProjectManager}
        />
        {currentProject && (
          <ProjectManager
            project={currentProject}
            onOpenExternalEvents={openExternalEvents}
            onOpenLayout={openLayout}
            onOpenExternalLayout={openExternalLayout}
            onOpenEventsFunctionsExtension={openEventsFunctionsExtension}
            onAddLayout={addLayout}
            onAddExternalLayout={addExternalLayout}
            onAddEventsFunctionsExtension={addEventsFunctionsExtension}
            onAddExternalEvents={addExternalEvents}
            onDeleteLayout={deleteLayout}
            onDeleteExternalLayout={deleteExternalLayout}
            onDeleteEventsFunctionsExtension={deleteEventsFunctionsExtension}
            onDeleteExternalEvents={deleteExternalEvents}
            onRenameLayout={renameLayout}
            onRenameExternalLayout={renameExternalLayout}
            onRenameEventsFunctionsExtension={renameEventsFunctionsExtension}
            onRenameExternalEvents={renameExternalEvents}
            onSaveProject={saveProject}
            onSaveProjectAs={saveProjectAs}
            onCloseProject={() => {
              askToCloseProject(
                {
                  currentProject: state.currentProject,
                  editorTabs: state.editorTabs,
                },
                {
                  unsavedChanges: props.unsavedChanges,
                  eventsFunctionsExtensionsState:
                    props.eventsFunctionsExtensionsState,
                }
              );
            }}
            onExportProject={openExportDialog}
            onOpenPreferences={() => openPreferencesDialog(true)}
            onOpenProfile={() => openProfileDialog(true)}
            onOpenResources={() => {
              openResources();
              openProjectManager(false);
            }}
            onOpenPlatformSpecificAssets={() => openPlatformSpecificAssetsDialog(true)}
            onChangeSubscription={() => openSubscriptionDialog(true)}
            eventsFunctionsExtensionsError={eventsFunctionsExtensionsError}
            onReloadEventsFunctionsExtensions={() => {
              // Check if load is sufficient
              eventsFunctionsExtensionsState.reloadProjectEventsFunctionsExtensions(
                currentProject
              );
            }}
            freezeUpdate={!projectManagerOpen}
            unsavedChanges={props.unsavedChanges}
          />
        )}
        {!state.currentProject && (
          <EmptyMessage>
            <Trans>To begin, open or create a new project.</Trans>
          </EmptyMessage>
        )}
      </Drawer>
      <Toolbar
        ref={toolbar}
        showProjectIcons={!props.integratedEditor}
        hasProject={!!currentProject}
        toggleProjectManager={toggleProjectManager}
        exportProject={() => openExportDialog(true)}
        requestUpdate={props.requestUpdate}
        simulateUpdateDownloaded={simulateUpdateDownloaded}
        simulateUpdateAvailable={simulateUpdateAvailable}
      />
      <ClosableTabs hideLabels={!!props.integratedEditor}>
        {getEditors(state.editorTabs).map((editorTab, id) => {
          const isCurrentTab = getCurrentTabIndex(state.editorTabs) === id;
          return (
            <ClosableTab
              label={editorTab.label}
              key={editorTab.key}
              active={isCurrentTab}
              onClick={() => _onChangeEditorTab(id)}
              onClose={() => _onCloseEditorTab(editorTab)}
              onCloseOthers={() => _onCloseOtherEditorTabs(editorTab)}
              onCloseAll={_onCloseAllEditorTabs}
              onActivated={() => _onEditorTabActive(editorTab)}
              closable={editorTab.closable}
            />
          );
        })}
      </ClosableTabs>
      {getEditors(state.editorTabs).map((editorTab, id) => {
        const isCurrentTab = getCurrentTabIndex(state.editorTabs) === id;
        return (
          <TabContentContainer key={editorTab.key} active={isCurrentTab}>
            <ErrorBoundary>
              {editorTab.render(isCurrentTab, state, props)}
            </ErrorBoundary>
          </TabContentContainer>
        );
      })}
      <LoaderModal show={showLoader} />
      <HelpFinder
        open={helpFinderDialogOpen}
        onClose={() => openHelpFinderDialog(false)}
      />
      <Snackbar
        open={state.snackMessageOpen}
        autoHideDuration={3000}
        onClose={_closeSnackMessage}
        ContentProps={{
          'aria-describedby': 'snackbar-message',
        }}
        message={<span id="snackbar-message">{state.snackMessage}</span>}
      />
      {!!renderExportDialog &&
        state.exportDialogOpen &&
        renderExportDialog({
          onClose: () => openExportDialog(false),
          onChangeSubscription: () => {
            openExportDialog(false);
            openSubscriptionDialog(true);
          },
          project: state.currentProject,
        })}
      {!!renderCreateDialog &&
        state.createDialogOpen &&
        renderCreateDialog({
          open: state.createDialogOpen,
          onClose: () => openCreateDialog(false),
          onOpen: (storageProvider, fileMetadata) => {
            setState(state => ({ ...state, createDialogOpen: false })).then(
              state => {
                // eslint-disable-next-line
                useStorageProvider(storageProvider)
                  .then(() =>
                    openFromFileMetadata(fileMetadata, state, {
                      i18n: props.i18n,
                      storageProviderOperations:
                        props.storageProviderOperations,
                      eventsFunctionsExtensionsState:
                        props.eventsFunctionsExtensionsState,
                    })
                  )
                  .then(state => {
                    if (state)
                      openSceneOrProjectManager({
                        currentProject: state.currentProject,
                        editorTabs: state.editorTabs,
                      });
                  });
              }
            );
          },
          onCreate: (project, storageProvider, fileMetadata) => {
            setState(state => ({ ...state, createDialogOpen: false })).then(
              state => {
                // eslint-disable-next-line
                useStorageProvider(storageProvider)
                  .then(() =>
                    loadFromProject(project, fileMetadata, {
                      currentProject: state.currentProject,
                      editorTabs: state.editorTabs,
                    })
                  )
                  .then(state =>
                    openSceneOrProjectManager({
                      currentProject: state.currentProject,
                      editorTabs: state.editorTabs,
                    })
                  );
              }
            );
          },
        })}
      {!!introDialog && introDialogOpen &&
        React.cloneElement(introDialog, {
          open: true,
          onClose: () => openIntroDialog(false),
        })}
      {!!currentProject && platformSpecificAssetsDialogOpen && (
        <PlatformSpecificAssetsDialog
          project={currentProject}
          open
          onApply={() => openPlatformSpecificAssetsDialog(false)}
          onClose={() => openPlatformSpecificAssetsDialog(false)}
          resourceSources={resourceSources}
          onChooseResource={(sourceName, multiSelection) =>
            _onChooseResource(sourceName, multiSelection, currentProject)
          }
          resourceExternalEditors={resourceExternalEditors}
        />
      )}
      {!!renderPreviewLauncher &&
        renderPreviewLauncher(
          {
            onExport: () => openExportDialog(true),
            onChangeSubscription: () => openSubscriptionDialog(true),
          },
          (previewLauncher: ?PreviewLauncherInterface) => {
            _previewLauncher.current = previewLauncher;
          }
        )}
      {resourceSources.map(
        (resourceSource, index): React.Node => {
          const Component = resourceSource.component;
          return (
            <PreferencesContext.Consumer key={resourceSource.name}>
              {({ getLastUsedPath, setLastUsedPath }) => {
                return (
                  <Component
                    ref={dialog =>
                      (_resourceSourceDialogs.current[
                        resourceSource.name
                      ] = dialog)
                    }
                    i18n={i18n}
                    getLastUsedPath={getLastUsedPath}
                    setLastUsedPath={setLastUsedPath}
                  />
                );
              }}
            </PreferencesContext.Consumer>
          );
        }
      )}
      {profileDialogOpen && (
        <ProfileDialog
          open
          onClose={() => openProfileDialog(false)}
          onChangeSubscription={() => openSubscriptionDialog(true)}
        />
      )}
      {subscriptionDialogOpen && (
        <SubscriptionDialog
          onClose={() => {
            openSubscriptionDialog(false);
          }}
          open
        />
      )}
      {preferencesDialogOpen && (
        <PreferencesDialog onClose={() => openPreferencesDialog(false)} />
      )}
      {languageDialogOpen && (
        <LanguageDialog
          open
          onClose={languageChanged => {
            openLanguageDialog(false);
            if (languageChanged) {
              _languageDidChange();
            }
          }}
        />
      )}
      {aboutDialogOpen && (
        <AboutDialog
          open
          onClose={() => openAboutDialog(false)}
          updateStatus={updateStatus}
        />
      )}
      {state.openFromStorageProviderDialogOpen && (
        <OpenFromStorageProviderDialog
          onClose={() => openOpenFromStorageProviderDialog(false)}
          storageProviders={props.storageProviders}
          onChooseProvider={storageProvider => {
            openOpenFromStorageProviderDialog(false);
            props.useStorageProvider(storageProvider).then(() => {
              chooseProjectWithStorageProviderPicker();
            });
          }}
          onCreateNewProject={() => {
            openOpenFromStorageProviderDialog(false);
            openCreateDialog(true);
          }}
        />
      )}
      {state.saveToStorageProviderDialogOpen && (
        <SaveToStorageProviderDialog
          onClose={() => openSaveToStorageProviderDialog(false)}
          storageProviders={props.storageProviders}
          onChooseProvider={storageProvider => {
            openSaveToStorageProviderDialog(false);
            props.useStorageProvider(storageProvider).then(() => {
              saveProjectAsWithStorageProvider();
            });
          }}
        />
      )}
      {state.openConfirmDialogOpen && (
        <OpenConfirmDialog
          onClose={() => {
            _openOpenConfirmDialog(false);
          }}
          onConfirm={() => {
            _openOpenConfirmDialog(false);
            _openInitialFileMetadata(/* isAfterUserInteraction= */ true);
          }}
        />
      )}
      <CloseConfirmDialog
        shouldPrompt={!!state.currentProject}
        i18n={props.i18n}
        language={props.i18n.language}
        hasUnsavedChanges={
          !!props.unsavedChanges && props.unsavedChanges.hasUnsavedChanges
        }
      />
      <ChangelogDialogContainer />
      {state.gdjsDevelopmentWatcherEnabled &&
        renderGDJSDevelopmentWatcher &&
        renderGDJSDevelopmentWatcher()}
    </div>
  );
};

export default MainFrame;
