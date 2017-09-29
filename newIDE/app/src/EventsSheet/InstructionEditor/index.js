import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import InstructionTypeSelector from './InstructionTypeSelector.js';
import InstructionParametersEditor from './InstructionParametersEditor.js';

const styles = {
  container: {
    display: 'flex',
    flex: 1,
  },
  typeSelector: {
    flex: 1,
    overflowY: 'scroll',
    backgroundColor: 'white',
  },
  parametersEditor: {
    flex: 2,
    paddingLeft: 16,
    paddingRight: 16,
    zIndex: 1, // Put the Paper shadow on the type selector
  },
};

export default class InstructionEditor extends Component {
  render() {
    const { instruction, isCondition, project, layout } = this.props;

    return (
      <div style={styles.container}>
        <InstructionTypeSelector
          style={styles.typeSelector}
          isCondition={isCondition}
          selectedType={instruction.getType()}
          onChoose={type => {
            instruction.setType(type);
            this.forceUpdate();
          }}
        />
        <Paper style={styles.parametersEditor} rounded={false} zDepth={2}>
          <InstructionParametersEditor
            project={project}
            layout={layout}
            isCondition={isCondition}
            instruction={instruction}
          />
        </Paper>
      </div>
    );
  }
}
