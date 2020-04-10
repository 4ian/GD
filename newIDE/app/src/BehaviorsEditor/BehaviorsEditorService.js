// @flow
import BehaviorPropertiesEditor from './Editors/BehaviorPropertiesEditor';
import Physics2Editor from './Editors/Physics2Editor';

/**
 * A service returning editor components for each behavior type.
 */
export default {
  getEditor(behaviorType: string) {
    if (!this.components[behaviorType]) {
      return BehaviorPropertiesEditor; // Default properties editor
    }
    return this.components[behaviorType].component; // Custom  behavior editor
  },
  components: {
    'Physics2::Physics2Behavior': {
      component: Physics2Editor,
    },
    'Physics3::Physics3Behavior': {
      component: Physic32Editor,
    },
  },
};
