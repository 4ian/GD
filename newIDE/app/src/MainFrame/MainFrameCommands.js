// @flow
import * as React from 'react';
import { type I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  useCommand,
  useCommandWithOptions,
} from '../CommandPalette/CommandHooks';
import {
  enumerateLayouts,
  enumerateExternalEvents,
  enumerateExternalLayouts,
  enumerateEventsFunctionsExtensions,
} from '../ProjectManager/EnumerateProjectItems';

type Item =
  | gdLayout
  | gdExternalEvents
  | gdExternalLayout
  | gdEventsFunctionsExtension;

/**
 * Helper function to generate options list
 * for each kind of project item
 */
const generateProjectItemOptions = <T: Item>(
  project: ?gdProject,
  enumerate: (project: gdProject) => Array<T>,
  onOpen: string => void
) => {
  if (!project) return [];
  return enumerate(project).map(item => ({
    text: item.getName(),
    handler: () => onOpen(item.getName()),
  }));
};

type CommandHandlers = {|
  i18n: I18n,
  project: ?gdProject,
  previewEnabled: boolean,
  onOpenProjectManager: () => void,
  onLaunchPreview: () => void | Promise<void>,
  onLaunchDebugPreview: () => void,
  onOpenStartPage: () => void,
  onCreateProject: () => void,
  onOpenProject: () => void,
  onSaveProject: () => void,
  onSaveProjectAs: () => void,
  onCloseApp: () => void,
  onCloseProject: () => Promise<void>,
  onExportGame: () => void,
  onOpenLayout: string => void,
  onOpenExternalEvents: string => void,
  onOpenExternalLayout: string => void,
  onOpenEventsFunctionsExtension: string => void,
|};

const useMainFrameCommands = (handlers: CommandHandlers) => {
  useCommand('QUIT_APP', true, {
    handler: handlers.onCloseApp,
  });

  useCommand('OPEN_PROJECT_MANAGER', !!handlers.project, {
    handler: handlers.onOpenProjectManager,
  });

  useCommand('LAUNCH_PREVIEW', handlers.previewEnabled, {
    handler: handlers.onLaunchPreview,
  });

  useCommand('LAUNCH_DEBUG_PREVIEW', handlers.previewEnabled, {
    handler: handlers.onLaunchDebugPreview,
  });

  useCommand('OPEN_START_PAGE', true, {
    handler: handlers.onOpenStartPage,
  });

  useCommand('CREATE_NEW_PROJECT', true, {
    handler: handlers.onCreateProject,
  });

  useCommand('OPEN_PROJECT', true, {
    handler: handlers.onOpenProject,
  });

  useCommand('SAVE_PROJECT', !!handlers.project, {
    handler: handlers.onSaveProject,
  });

  useCommand('SAVE_PROJECT_AS', !!handlers.project, {
    handler: handlers.onSaveProjectAs,
  });

  useCommand('CLOSE_PROJECT', !!handlers.project, {
    handler: handlers.onCloseProject,
  });

  useCommand('EXPORT_GAME', !!handlers.project, {
    handler: handlers.onExportGame,
  });

  useCommandWithOptions('OPEN_LAYOUT', !!handlers.project, {
    generateOptions: React.useCallback(
      () =>
        generateProjectItemOptions(
          handlers.project,
          enumerateLayouts,
          handlers.onOpenLayout
        ),
      [handlers.project, handlers.onOpenLayout]
    ),
  });

  useCommandWithOptions('OPEN_EXTERNAL_EVENTS', !!handlers.project, {
    generateOptions: React.useCallback(
      () =>
        generateProjectItemOptions(
          handlers.project,
          enumerateExternalEvents,
          handlers.onOpenExternalEvents
        ),
      [handlers.project, handlers.onOpenExternalEvents]
    ),
  });

  useCommandWithOptions('OPEN_EXTERNAL_LAYOUT', !!handlers.project, {
    generateOptions: React.useCallback(
      () =>
        generateProjectItemOptions(
          handlers.project,
          enumerateExternalLayouts,
          handlers.onOpenExternalLayout
        ),
      [handlers.project, handlers.onOpenExternalLayout]
    ),
  });

  useCommandWithOptions('OPEN_EXTENSION', !!handlers.project, {
    generateOptions: React.useCallback(
      () =>
        generateProjectItemOptions(
          handlers.project,
          enumerateEventsFunctionsExtensions,
          handlers.onOpenEventsFunctionsExtension
        ),
      [handlers.project, handlers.onOpenEventsFunctionsExtension]
    ),
  });
};

export default useMainFrameCommands;
