import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import ObjectsEditorService from './ObjectsEditorService';
import Dialog from '../UI/Dialog';
import BehaviorsEditor from '../BehaviorsEditor';
import { Tabs, Tab } from 'material-ui/Tabs';

const styles = {
  titleContainer: {
    padding: 0,
  },
};

export default class ObjectEditorDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editor: null,
      currentTab: 'properties',
    };
  }

  componentWillMount() {
    this._loadFrom(this.props.object);
  }

  componentWillReceiveProps(newProps) {
    if (
      (!this.props.open && newProps.open) ||
      (newProps.open && this.props.object !== newProps.object)
    ) {
      this._loadFrom(newProps.object);
    }
  }

  _onChangeTab = value => {
    this.setState({
      currentTab: value,
    });
  };

  _onApply = () => {
    if (this.props.onApply) this.props.onApply();
  };

  _loadFrom(object) {
    if (!object) return;

    this.setState({
      editor: ObjectsEditorService.getEditor(object.getType()),
    });
  }

  render() {
    const { editor } = this.state;
    if (!editor) return null;

    const actions = [
      <FlatButton
        label="Apply"
        primary
        keyboardFocused
        onTouchTap={this._onApply}
      />,
    ];

    const EditorComponent = editor.component;
    const { currentTab } = this.state;

    return (
      <Dialog
        key={this.props.object && this.props.object.ptr}
        actions={actions}
        autoScrollBodyContent
        noMargin
        modal
        onRequestClose={this.props.onCancel}
        open={this.props.open}
        title={
          <div>
            <Tabs value={currentTab} onChange={this._onChangeTab}>
              <Tab label="Properties" value={'properties'} key={'properties'} />
              <Tab label="Behaviors" value={'behaviors'} key={'behaviors'} />
            </Tabs>
          </div>
        }
        titleStyle={styles.titleContainer}
      >
        {currentTab === 'properties' &&
          EditorComponent && (
            <EditorComponent
              object={this.props.object}
              project={this.props.project}
              resourceSources={this.props.resourceSources}
              onSizeUpdated={() =>
                this.forceUpdate() /*Force update to ensure dialog is properly positionned*/}
            />
          )}
        {currentTab === 'behaviors' && (
          <BehaviorsEditor
            object={this.props.object}
            project={this.props.project}
            onSizeUpdated={() =>
              this.forceUpdate() /*Force update to ensure dialog is properly positionned*/}
          />
        )}
      </Dialog>
    );
  }
}
