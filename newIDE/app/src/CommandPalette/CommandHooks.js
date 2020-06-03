// @flow
import * as React from 'react';
import { type Command } from './CommandManager';
import CommandsContext from './CommandsContext';

export const useCommand = (commandName: string, command: Command) => {
  const commandManager = React.useContext(CommandsContext);
  React.useEffect(
    () => {
      if (!command.enabled) return;
      commandManager.registerCommand(commandName, command);
      return () => commandManager.deregisterCommand(commandName);
    },
    [
      commandManager,
      commandName,
      command.displayText,
      command.enabled,
      command.handler,
    ]
  );
};