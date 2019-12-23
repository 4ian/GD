// @flow
import { Trans } from '@lingui/macro';
import { t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import * as React from 'react';
import { Column, Line } from '../UI/Grid';
import SelectField from '../UI/SelectField';
import SelectOption from '../UI/SelectOption';
import { mapFor } from '../Utils/MapFor';
import RaisedButton from '../UI/RaisedButton';
import IconButton from '../UI/IconButton';
import EmptyMessage from '../UI/EmptyMessage';
import ElementWithMenu from '../UI/Menu/ElementWithMenu';
import MoreVert from '@material-ui/icons/MoreVert';
import SemiControlledTextField from '../UI/SemiControlledTextField';
import MiniToolbar, { MiniToolbarText } from '../UI/MiniToolbar';
import newNameGenerator from '../Utils/NewNameGenerator';
import Add from '@material-ui/icons/Add';
import PropertiesEditor from '../PropertiesEditor';
import DismissableAlertMessage from '../UI/DismissableAlertMessage';
import {
  enumerateEffectsMetadata,
  type EnumeratedEffectMetadata,
  setEffectDefaultParameters,
} from './EnumerateEffects';
import {
  type ResourceSource,
  type ChooseResourceFunction,
} from '../ResourcesList/ResourceSource.flow';
import { type ResourceExternalEditor } from '../ResourcesList/ResourceExternalEditor.flow';

type Props = {|
  project: gdProject,
  resourceSources: Array<ResourceSource>,
  onChooseResource: ChooseResourceFunction,
  resourceExternalEditors: Array<ResourceExternalEditor>,
  effectsContainer: gdEffectsContainer,
  onEffectsUpdated: () => void,
|};

const getEnumeratedEffectMetadata = (
  allEffectDescriptions: Array<EnumeratedEffectMetadata>,
  effectType: string
): ?EnumeratedEffectMetadata => {
  return allEffectDescriptions.find(
    effectMetadata => effectMetadata.type === effectType
  );
};

/**
 * Display a list of effects and allow to add/remove/edit them.
 *
 * All available effects are fetched from the project's platform.
 */
export default class EffectsList extends React.Component<Props, {||}> {
  _allEffectMetadata = enumerateEffectsMetadata(this.props.project);

  _addEffect = () => {
    const { effectsContainer } = this.props;

    const newName = newNameGenerator('Effect', name =>
      effectsContainer.hasEffectNamed(name)
    );
    effectsContainer.insertNewEffect(
      newName,
      effectsContainer.getEffectsCount()
    );

    this.forceUpdate();
    this.props.onEffectsUpdated();
  };

  _removeEffect = (name: string) => {
    const { effectsContainer } = this.props;

    effectsContainer.removeEffect(name);
    this.forceUpdate();
    this.props.onEffectsUpdated();
  };

  _chooseEffectType = (effect: gdEffect, newEffectType: string) => {
    effect.setEffectType(newEffectType);
    const effectMetadata = getEnumeratedEffectMetadata(
      this._allEffectMetadata,
      newEffectType
    );

    if (effectMetadata) {
      setEffectDefaultParameters(effect, effectMetadata.effectMetadata);
    }

    this.forceUpdate();
    this.props.onEffectsUpdated();
  };

  render() {
    const { effectsContainer } = this.props;

    return (
      <I18n>
        {({ i18n }) => {
          return (
            <Column noMargin expand>
              <Line>
                <Column>
                  <DismissableAlertMessage
                    identifier="effects-usage"
                    kind="info"
                  >
                    <Trans>
                      Effects can change how the layer is rendered on screen.
                      After adding an effect, set up its parameters. Launch a
                      preview to see the result. Using the events and the name
                      of the effect, you can change the parameters during the
                      game.
                    </Trans>
                  </DismissableAlertMessage>
                </Column>
              </Line>
              {effectsContainer.getEffectsCount() > 3 && (
                <Line>
                  <Column>
                    <DismissableAlertMessage
                      identifier="too-much-effects"
                      kind="warning"
                    >
                      <Trans>
                        Using a lot of effects can have a severe negative impact
                        on the rendering performance, especially on low-end or
                        mobile devices. Consider using less effects if possible.
                        You can also disable and re-enable effects as needed
                        using events.
                      </Trans>
                    </DismissableAlertMessage>
                  </Column>
                </Line>
              )}
              {mapFor(0, effectsContainer.getEffectsCount(), (i: number) => {
                const effect: gdEffect = effectsContainer.getEffectAt(i);
                const effectType = effect.getEffectType();
                const effectMetadata = getEnumeratedEffectMetadata(
                  this._allEffectMetadata,
                  effectType
                );

                return (
                  <React.Fragment key={i}>
                    <MiniToolbar>
                      <MiniToolbarText>
                        <Trans>Effect name:</Trans>
                      </MiniToolbarText>
                      <SemiControlledTextField
                        margin="none"
                        commitOnBlur
                        hintText={t`Enter the effect name`}
                        value={effect.getName()}
                        onChange={newName => {
                          if (newName === effect.getName()) return;

                          effect.setName(newName);
                          this.forceUpdate();
                          this.props.onEffectsUpdated();
                        }}
                        fullWidth
                      />
                      <MiniToolbarText>
                        <Trans>Type:</Trans>
                      </MiniToolbarText>
                      <SelectField
                        margin="none"
                        value={effectType}
                        onChange={(e, i, newEffectType: string) =>
                          this._chooseEffectType(effect, newEffectType)
                        }
                        fullWidth
                        hintText={t`Choose the effect to apply`}
                      >
                        {this._allEffectMetadata.map(effectMetadata => (
                          <SelectOption
                            key={effectMetadata.type}
                            value={effectMetadata.type}
                            primaryText={effectMetadata.fullName}
                          />
                        ))}
                      </SelectField>
                      <ElementWithMenu
                        element={
                          <IconButton>
                            <MoreVert />
                          </IconButton>
                        }
                        buildMenuTemplate={() => [
                          {
                            label: i18n._(t`Delete`),
                            click: () => this._removeEffect(effect.getName()),
                          },
                        ]}
                      />
                    </MiniToolbar>
                    <Line expand noMargin>
                      <Column expand>
                        {!!effectType && effectMetadata ? (
                          <PropertiesEditor
                            instances={[effect]}
                            schema={effectMetadata.parametersSchema}
                            project={this.props.project}
                            resourceSources={this.props.resourceSources}
                            onChooseResource={this.props.onChooseResource}
                            resourceExternalEditors={
                              this.props.resourceExternalEditors
                            }
                          />
                        ) : null}
                      </Column>
                    </Line>
                  </React.Fragment>
                );
              })}
              {effectsContainer.getEffectsCount() === 0 ? (
                <EmptyMessage>
                  <Trans>No effects applied.</Trans>
                </EmptyMessage>
              ) : null}
              <Column>
                <Line justifyContent="flex-end" alignItems="center" expand>
                  <RaisedButton
                    primary
                    label={<Trans>Add an effect</Trans>}
                    onClick={this._addEffect}
                    labelPosition="before"
                    icon={<Add />}
                  />
                </Line>
              </Column>
            </Column>
          );
        }}
      </I18n>
    );
  }
}
