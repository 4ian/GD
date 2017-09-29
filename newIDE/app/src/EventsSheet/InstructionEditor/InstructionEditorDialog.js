import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import InstructionEditor from './index.js';

const styles = {
  dialogContent: {
    width: '100%',
    maxWidth: 'none',
  },
  dialogBody: {
    padding: 0,
    display: 'flex',
  },
};

export default class InstructionEditorDialog extends React.Component {
  _getTitle() {
    if (this.props.isCondition) {
      return this.props.isNewInstruction
        ? 'Add a new condition'
        : 'Edit condition';
    } else {
      return this.props.isNewInstruction ? 'Add a new action' : 'Edit action';
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.props.onCancel}
      />,
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.props.onSubmit}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.onCancel}
        contentStyle={styles.dialogContent}
        bodyStyle={styles.dialogBody}
      >
        <InstructionEditor {...this.props} />
      </Dialog>
    );
  }
}
