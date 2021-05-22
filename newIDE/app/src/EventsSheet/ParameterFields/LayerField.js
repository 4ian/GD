// @flow
import React, { Component } from 'react';
import { mapFor } from '../../Utils/MapFor';
import { type ParameterFieldProps } from './ParameterFieldCommons';
import GenericExpressionField from './GenericExpressionField';
import { type ExpressionAutocompletion } from '../../ExpressionAutocompletion';

export default class LayerField extends Component<ParameterFieldProps, {||}> {
  _field: ?GenericExpressionField;

  focus() {
    if (this._field) this._field.focus();
  }

  render() {
    const { layout } = this.props.scope;
    const layerNames: Array<ExpressionAutocompletion> = layout
      ? mapFor(0, layout.getLayersCount(), i => {
          const layer = layout.getLayerAt(i);
          return { kind: 'Text', completion: `"${layer.getName()}"` };
        })
      : [];

    return (
      <GenericExpressionField
        expressionType="string"
        getAdditionalAutocompletions={expression =>
          layerNames.filter(
            ({ completion }) => completion.indexOf(expression) === 0
          )
        }
        ref={field => (this._field = field)}
        {...this.props}
      />
    );
  }
}
