import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import { defaultAutocompleteProps } from '../../../UI/AutocompleteProps';
const gd = global.gd;

export default class BehaviorField extends Component {
  state = { errorText: null, focused: false, text: null };

  constructor(props) {
    super(props);

    const { parameterMetadata } = this.props;
    this._description = parameterMetadata
      ? parameterMetadata.getDescription()
      : undefined;

    this._behaviorTypeAllowed = parameterMetadata
      ? parameterMetadata.getExtraInfo()
      : undefined;
  }

  _updateBehaviorsList() {
    const { instructionOrExpression } = this.props;
    if (
      !instructionOrExpression ||
      instructionOrExpression.getParametersCount() === 0
    )
      return;

    const objectName = instructionOrExpression.getParameter(0);
    this._behaviorNames = gd
      .getBehaviorsOfObject(
        this.props.project,
        this.props.layout,
        objectName,
        true
      )
      .toJSArray()
      .filter(behaviorName => {
        return (
          !this._behaviorTypeAllowed ||
          gd.getTypeOfBehavior(
            this.props.project,
            this.props.layout,
            behaviorName
          ) === this._behaviorTypeAllowed
        );
      });
  }

  focus() {
    if (this._field) this._field.focus();
  }

  _getError = (value?: string) => {
    if (!value && !this.props.value) return null;

    const isValidChoice =
      this._behaviorNames.filter(choice => this.props.value === choice)
        .length !== 0;

    if (!isValidChoice) return 'This behavior is not attached to the object';

    return null;
  };

  _doValidation = (value?: string) => {
    this.setState({ errorText: this._getError(value) });
  };

  componentDidUpdate() {
    const { instructionOrExpression } = this.props;
    if (
      !instructionOrExpression ||
      instructionOrExpression.getParametersCount() === 0
    )
      return;

    // This is a bit hacky:
    // force the behavior selection if there is only one selectable behavior
    if (this._behaviorNames.length === 1) {
      if (this.props.value !== this._behaviorNames[0]) {
        this.props.onChange(this._behaviorNames[0]);
      }
    }
  }

  render() {
    this._updateBehaviorsList();

    const noBehaviorErrorText =
      this._behaviorTypeAllowed !== ''
        ? 'The behavior is not attached to this object. Please select another object or add the behavior'
        : 'This object has no behaviors: please add a behavior to the object first';

    return (
      <AutoComplete
        {...defaultAutocompleteProps}
        floatingLabelText={this._description}
        errorText={
          !this._behaviorNames.length
            ? noBehaviorErrorText
            : this.state.errorText
        }
        searchText={this.state.focused ? this.state.text : this.props.value}
        onFocus={() => {
          this.setState({
            focused: true,
            text: this.props.value,
          });
        }}
        onUpdateInput={value => {
          this.setState({
            focused: true,
            text: value,
          });
        }}
        onBlur={event => {
          this.props.onChange(event.target.value);
          this.setState({
            focused: false,
            text: null,
          });
          this._doValidation(event.target.value);
        }}
        onNewRequest={data => {
          // Note that data may be a string or a {text, value} object.
          if (typeof data === 'string') {
            this.props.onChange(data);
          } else if (typeof data.value === 'string') {
            this.props.onChange(data.value);
          }
        }}
        dataSource={this._behaviorNames.map(behaviorName => ({
          text: behaviorName,
          value: behaviorName,
        }))}
        openOnFocus={!this.props.isInline}
        disabled={this._behaviorNames.length <= 1}
        ref={field => (this._field = field)}
      />
    );
  }
}
