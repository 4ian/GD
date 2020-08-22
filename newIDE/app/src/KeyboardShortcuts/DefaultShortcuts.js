// @flow
import { type CommandName } from '../CommandPalette/CommandsList';

export type ShortcutMap = { [CommandName]: string };

const defaultShortcuts: ShortcutMap = {
  QUIT_APP: 'CmdOrCtrl+Shift+KeyQ',
  OPEN_PROJECT_MANAGER: 'CmdOrCtrl+Alt+KeyE',
  LAUNCH_PREVIEW: 'F5',
  LAUNCH_DEBUG_PREVIEW: 'F6',
  OPEN_START_PAGE: '',
  CREATE_NEW_PROJECT: 'CmdOrCtrl+Shift+KeyN',
  OPEN_PROJECT: 'CmdOrCtrl+KeyO',
  SAVE_PROJECT: 'CmdOrCtrl+KeyS',
  SAVE_PROJECT_AS: 'CmdOrCtrl+Shift+KeyS',
  CLOSE_PROJECT: 'CmdOrCtrl+KeyQ',
  EXPORT_GAME: 'CmdOrCtrl+Shift+KeyE',
  OPEN_RECENT_PROJECT: '',
  OPEN_COMMAND_PALETTE: 'CmdOrCtrl+KeyP',

  OPEN_PROJECT_PROPERTIES: '',
  OPEN_PROJECT_VARIABLES: '',
  OPEN_PLATFORM_SPECIFIC_ASSETS_DIALOG: '',
  OPEN_PROJECT_RESOURCES: '',

  OPEN_LAYOUT: 'Alt+KeyS',
  OPEN_EXTERNAL_EVENTS: 'Alt+KeyV',
  OPEN_EXTERNAL_LAYOUT: 'Alt+KeyW',
  OPEN_EXTENSION: 'Alt+KeyE',

  OPEN_SCENE_PROPERTIES: 'KeyS',
  OPEN_SCENE_VARIABLES: 'KeyV',

  OPEN_OBJECTS_PANEL: 'KeyO',
  OPEN_OBJECT_GROUPS_PANEL: 'KeyG',
  OPEN_PROPERTIES_PANEL: 'KeyP',
  TOGGLE_INSTANCES_PANEL: 'KeyI',
  TOGGLE_LAYERS_PANEL: 'KeyL',
  TOGGLE_WINDOW_MASK: 'KeyM',
  TOGGLE_GRID: 'CmdOrCtrl+G',
  OPEN_SETUP_GRID: 'CmdOrCtrl+Alt+G',
  EDIT_LAYER_EFFECTS: 'E',
  EDIT_OBJECT: 'Shift+KeyE',
  EDIT_OBJECT_VARIABLES: 'Shift+KeyV',
  EDIT_OBJECT_GROUP: 'Shift+KeyG',

  ADD_STANDARD_EVENT: 'Shift+KeyA',
  ADD_SUBEVENT: 'Shift+KeyD',
  ADD_COMMENT_EVENT: '',
  CHOOSE_AND_ADD_EVENT: 'Shift+KeyW',
  OPEN_SETTINGS: '',
};

export default defaultShortcuts;
