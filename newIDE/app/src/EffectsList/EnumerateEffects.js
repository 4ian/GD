// @flow
import { mapFor } from '../Utils/MapFor';
import { type Schema } from '../PropertiesEditor';
import flatten from 'lodash/flatten';

export type EnumeratedEffectMetadata = {|
  extension: gdPlatformExtension,
  effectMetadata: gdEffectMetadata,
  type: string,
  fullName: string,
  description: string,
  parametersSchema: Schema,
|};

/**
 * Fetch all the effects available for a project, and convert them
 * to a format easier to use.
 */
export const enumerateEffectsMetadata = (
  project: gdProject
): Array<EnumeratedEffectMetadata> => {
  const platform = project.getCurrentPlatform();
  const extensionsList = platform.getAllPlatformExtensions();

  return flatten(
    mapFor(0, extensionsList.size(), i => {
      const extension = extensionsList.at(i);

      return extension
        .getExtensionEffectTypes()
        .toJSArray()
        .map(type => extension.getEffectMetadata(type))
        .map(effectMetadata => {
          const effectType = effectMetadata.getType();

          // Convert the effect type properties to a PropertiesEditor Schema.
          const properties = effectMetadata.getProperties();
          const parameterNames = properties.keys().toJSArray();
          const parametersSchema: Schema = parameterNames
            .map((parameterName: string) => {
              const property = properties.get(parameterName);
              const valueType = property.getType().toLowerCase();
              const propertyLabel = property.getLabel();
              const propertyDescription = property.getDescription();
              const getLabel = () => propertyLabel;
              const getDescription = () => propertyDescription;

              if (valueType === 'number') {
                return {
                  name: parameterName,
                  valueType: 'number',
                  getValue: (effect: gdEffect) =>
                    effect.getDoubleParameter(parameterName),
                  setValue: (effect: gdEffect, newValue: number) =>
                    effect.setDoubleParameter(parameterName, newValue),
                  getLabel,
                  getDescription,
                };
              } else if (valueType === 'resource') {
                // Resource is a "string" (with a selector in the UI)
                const kind = property.getExtraInfo().toJSArray()[0] || '';
                return {
                  name: parameterName,
                  valueType: 'resource',
                  resourceKind: kind,
                  getValue: (effect: gdEffect) =>
                    effect.getStringParameter(parameterName),
                  setValue: (effect: gdEffect, newValue: number) =>
                    effect.setStringParameter(parameterName, newValue),
                  getLabel,
                  getDescription,
                };
              } else if (valueType === 'color') {
                return {
                  name: parameterName,
                  valueType: 'color',
                  getValue: (effect: gdEffect) =>
                    effect.getStringParameter(parameterName),
                  setValue: (effect: gdEffect, newValue: number) =>
                    effect.setStringParameter(parameterName, newValue),
                  getLabel,
                  getDescription,
                };
              } else {
                console.error(
                  `A property with type=${valueType} could not be mapped to a field for effect ${effectType}. Ensure that this type is correct.`
                );
                return null;
              }
            })
            .filter(Boolean);

          return {
            extension,
            type: effectType,
            effectMetadata,
            fullName: effectMetadata.getFullName(),
            description: effectMetadata.getDescription(),
            parametersSchema,
          };
        });
    })
  );
};

export const setEffectDefaultParameters = (
  effect: gdEffect,
  effectMetadata: gdEffectMetadata
) => {
  effect.clearParameters();

  const properties = effectMetadata.getProperties();
  const parameterNames = properties.keys().toJSArray();
  parameterNames.forEach((parameterName: string) => {
    const property = properties.get(parameterName);
    const valueType = property.getType().toLowerCase();

    if (valueType === 'number') {
      effect.setDoubleParameter(
        parameterName,
        parseFloat(property.getValue()) || 0
      );
    } else {
      effect.setStringParameter(parameterName, property.getValue());
    }
  });
};
