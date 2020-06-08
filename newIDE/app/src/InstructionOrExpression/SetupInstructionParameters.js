// @flow
import { getObjectParameterIndex } from './EnumerateInstructions';
const gd = global.gd;

/**
 * After selecting an instruction, this function allows to set up the proper
 * number of parameters, set up the object name (if an object instruction was chosen)
 * and set up the behavior name (if a behavior instruction was chosen).
 */
export const setupInstructionParameters = (
  globalObjectsContainer: gdObjectsContainer,
  objectsContainer: gdObjectsContainer,
  instruction: gdInstruction,
  instructionMetadata: gdInstructionMetadata,
  objectName: ?string
) => {
  instruction.setParametersCount(instructionMetadata.getParametersCount());

  // For free instructions (not linked to an object or behavior), we can stop there.
  // In the future, we could set up default values for parameters.
  if (!objectName) return;

  // Set the object name.
  const objectParameterIndex = getObjectParameterIndex(instructionMetadata);
  if (objectParameterIndex === -1) {
    console.error(
      `Instruction "${instructionMetadata.getFullName()}" is used for an object, but does not have an object as first parameter`
    );
    return;
  }

  instruction.setParameter(objectParameterIndex, objectName);

  // Set the behavior name, if any.
  const maybeBehaviorParameterIndex = objectParameterIndex + 1;
  if (maybeBehaviorParameterIndex < instructionMetadata.getParametersCount()) {
    const maybeBehaviorParameterMetadata = instructionMetadata.getParameter(
      maybeBehaviorParameterIndex
    );
    if (
      !gd.ParameterMetadata.isBehavior(maybeBehaviorParameterMetadata.getType())
    ) {
      // The parameter after the object is not a behavior, there is nothing to complete.
      return;
    }

    const allowedBehaviorType = maybeBehaviorParameterMetadata.getExtraInfo();
    const behaviorNames = gd
      .getBehaviorsOfObject(
        globalObjectsContainer,
        objectsContainer,
        objectName,
        true
      )
      .toJSArray()
      .filter(behaviorName => {
        return (
          !allowedBehaviorType ||
          gd.getTypeOfBehavior(
            globalObjectsContainer,
            objectsContainer,
            behaviorName
          ) === allowedBehaviorType
        );
      });

    if (behaviorNames.length > 0) {
      instruction.setParameter(maybeBehaviorParameterIndex, behaviorNames[0]);
    } else {
      // Ignore - this will either be shown as an error in the BehaviorField
      // or should not happen if the instruction was added using the NewInstructionEditor
      // (as the editor should only show instructions available for the behaviors
      // of the object and for the object).
    }
  }
};
