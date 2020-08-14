// @flow
import * as React from 'react';
import { Trans } from '@lingui/macro';
import Dialog from '../UI/Dialog';
import FlatButton from '../UI/FlatButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { getShortcutDisplayName, getShortcutStringFromEvent } from './index';

const styles = {
  shortcutBox: {
    padding: 15,
    textAlign: 'center',
  },
};

type Props = {|
  commandText: ?string,
  onSet: (shortcut: string) => void,
  onClose: () => void,
|};

const DetectShortcutDialog = (props: Props) => {
  const [shortcutString, setShortcutString] = React.useState<?string>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      const shortcut = getShortcutStringFromEvent(e);
      if (!shortcut) return;
      setShortcutString(shortcut);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <Dialog
      open
      title={<Trans>Set shortcut</Trans>}
      onRequestClose={props.onClose}
      cannotBeDismissed={false}
      maxWidth="xs"
      actions={[
        <FlatButton
          key="Cancel"
          label={<Trans>Cancel</Trans>}
          onClick={props.onClose}
        />,
        <FlatButton
          label={<Trans>Set shortcut</Trans>}
          primary
          key="Set"
          onClick={() => {
            shortcutString && props.onSet(shortcutString);
            props.onClose();
          }}
          disabled={!shortcutString}
        />,
      ]}
      secondaryActions={[
        <FlatButton
          key="Remove"
          label={<Trans>Remove shortcut</Trans>}
          onClick={() => {
            props.onSet('');
            props.onClose();
          }}
        />,
      ]}
    >
      <Typography>{props.commandText}</Typography>
      <Paper variant="outlined" style={styles.shortcutBox}>
        <Typography>
          {shortcutString ? (
            getShortcutDisplayName(shortcutString)
          ) : (
            <Trans>Press a shortcut combination...</Trans>
          )}
        </Typography>
      </Paper>
    </Dialog>
  );
};

export default DetectShortcutDialog;