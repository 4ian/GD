// @flow
import DefaultField from './ParameterFields/DefaultField';
import RelationalOperatorField from './ParameterFields/RelationalOperatorField';
import OperatorField from './ParameterFields/OperatorField';
import MouseField from './ParameterFields/MouseField';
import KeyField from './ParameterFields/KeyField';
import ObjectField from './ParameterFields/ObjectField';
import YesNoField from './ParameterFields/YesNoField';
import TrueFalseField from './ParameterFields/TrueFalseField';
import ExpressionField from './ParameterFields/ExpressionField';
import StringField from './ParameterFields/StringField';
import BehaviorField from './ParameterFields/BehaviorField';
import SceneVariableField from './ParameterFields/SceneVariableField';
import GlobalVariableField from './ParameterFields/GlobalVariableField';
import ObjectVariableField from './ParameterFields/ObjectVariableField';
import LayerField from './ParameterFields/LayerField';
import AudioResourceField from './ParameterFields/AudioResourceField';
const gd = global.gd;

const components = {
  default: DefaultField,
  mouse: MouseField,
  object: ObjectField,
  relationalOperator: RelationalOperatorField,
  operator: OperatorField,
  yesorno: YesNoField,
  trueorfalse: TrueFalseField,
  expression: ExpressionField,
  string: StringField,
  behavior: BehaviorField,
  scenevar: SceneVariableField,
  globalvar: GlobalVariableField,
  objectvar: ObjectVariableField,
  layer: LayerField,
  key: KeyField,
  file: DefaultField, //TODO
  musicfile: AudioResourceField,
  soundfile: AudioResourceField,
  color: DefaultField, //TODO
  police: DefaultField, //TODO
  joyaxis: DefaultField, //TODO
};

export default {
  components,
  getParameterComponent: (type: string) =>  {
    const fieldType = gd.ParameterMetadata.isObject(type) ? 'object' : type;

    if (components.hasOwnProperty(fieldType))
      return components[fieldType];
    else return components.default;
  },
};
