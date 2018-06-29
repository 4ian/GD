// @flow
import * as React from 'react';
import optionalRequire from '../Utils/OptionalRequire';
import Window from '../Utils/Window';
const electron = optionalRequire('electron');

type Props = {|
  shouldPrompt: boolean,
|};

export default class CloseConfirmDialog extends React.Component<Props, *> {
  _delayElectronClose = true;

  componentDidMount() {
    this._setup(this.props);
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.shouldPrompt !== this.props.shouldPrompt)
      this._setup(newProps);
  }

  _setup(props: Props) {
    if (Window.isDev()) return; // Don't prevent live-reload in development

    const { shouldPrompt } = props;
    const message =
      'Are you sure you want to quit GDevelop? Any unsaved changes will be lost.';

    if (electron) {
      window.onbeforeunload = e => {
        if (this._delayElectronClose && shouldPrompt) {
          // Use setTimeout to avoiding blocking the thread with the "confirm" dialog,
          // which would make Electron to close the window for some weird reason.
          // See https://github.com/electron/electron/issues/7977
          setTimeout(() => {
            //eslint-disable-next-line
            const answer = confirm(message);
            if (answer) {
              // If answer is positive, re-trigger the close
              this._delayElectronClose = false;
              electron.remote.getCurrentWindow().close();
            }
          }, 10);

          // Prevents closing the window immediately. See https://github.com/electron/electron/blob/master/docs/api/browser-window.md#event-close
          e.returnValue = true; //"It is recommended to always set the event.returnValue explicitly, instead of only returning a value, as the former works more consistently within Electron.""
          return false; //"In Electron, returning any value other than undefined would cancel the close"
        } else {
          // Returning undefined will let the window close
        }
      };
    } else if (window) {
      if (shouldPrompt) {
        window.onbeforeunload = () => message;
      } else {
        window.onbeforeunload = null;
      }
    }
  }

  render() {
    return null;
  }
}
