// @flow
import { t } from '@lingui/macro';
import * as React from 'react';
import { TreeTableRow, TreeTableCell } from '../UI/TreeTable';
import DragHandle from '../UI/DragHandle';
import SemiControlledTextField from '../UI/SemiControlledTextField';
import Checkbox from '../UI/Checkbox';
import AddCircle from '@material-ui/icons/AddCircle';
import BuildIcon from '@material-ui/icons/Build';
import SubdirectoryArrowRight from '@material-ui/icons/SubdirectoryArrowRight';
import TextField from '../UI/TextField';
import IconButton from '../UI/IconButton';
import Replay from '@material-ui/icons/Replay';
import styles from './styles';
import BooleanEditor from '../UI/BooleanField';
import { type VariableOrigin } from './VariablesList.flow';
import Text from '../UI/Text';
import ElementWithMenu from '../UI/Menu/ElementWithMenu';
const gd: libGDevelop = global.gd;

//TODO: Refactor into TreeTable?
const Indent = ({ width }) => (
  <div style={{ ...styles.indent, width }}>
    <SubdirectoryArrowRight htmlColor={styles.indentIconColor} />
  </div>
);

type Props = {|
  name: string,
  variable: gdVariable,
  depth: number,
  errorText?: ?string,
  commitVariableValueOnBlur: boolean,
  onChangeType: (type: string) => void,
  onBlur: () => void,
  onRemove: () => void,
  onAddChild: () => void,
  onChangeValue: string => void,
  onResetToDefaultValue: () => void,
  children?: React.Node,
  showHandle: boolean,
  showSelectionCheckbox: boolean,
  isSelected: boolean,
  onSelect: boolean => void,
  origin: VariableOrigin,
  arrayElement: boolean,
|};

const VariableRow = ({
  name,
  variable,
  depth,
  errorText,
  onChangeType,
  onBlur,
  commitVariableValueOnBlur,
  onRemove,
  onAddChild,
  onChangeValue,
  onResetToDefaultValue,
  children,
  showHandle,
  showSelectionCheckbox,
  isSelected,
  onSelect,
  origin,
  arrayElement,
}: Props) => {
  const type = variable.getType();
  const isCollection = !gd.Variable.isPrimitive(type);

  const key = '' + depth + name;
  const limitEditing = origin === 'parent' || origin === 'inherited';

  const columns = [
    <TreeTableCell key="name" expand>
      {depth > 0 && (
        <Indent width={(depth + 1) * styles.tableChildIndentation} />
      )}
      {depth === 0 && showHandle && <DragHandle />}
      {showSelectionCheckbox && !limitEditing && (
        <Checkbox
          checked={isSelected}
          onCheck={(e, checked) => onSelect(checked)}
        />
      )}
      {arrayElement ? (
        <Text noMargin fullWidth>
          {name}
        </Text>
      ) : (
        <TextField
          margin="none"
          style={{
            fontStyle: origin !== 'inherited' ? 'normal' : 'italic',
          }}
          fullWidth
          name={key + 'name'}
          defaultValue={name}
          errorText={errorText}
          onBlur={onBlur}
          disabled={origin === 'parent'}
        />
      )}
    </TreeTableCell>,
  ];
  if (isCollection) {
    columns.push(
      <TreeTableCell
        expand
        key="value"
        style={limitEditing ? styles.fadedButton : undefined}
      >
        <Text noMargin>
          ({type === gd.Variable.Structure ? 'Structure' : 'Array'})
        </Text>
      </TreeTableCell>
    );
  } else {
    if (type !== gd.Variable.Boolean)
      columns.push(
        <TreeTableCell key="value" expand>
          <SemiControlledTextField
            margin="none"
            type={type === gd.Variable.String ? 'text' : 'number'}
            commitOnBlur={commitVariableValueOnBlur}
            fullWidth
            name={key + 'value'}
            value={
              type === gd.Variable.String
                ? variable.getString()
                : variable.getValue()
            }
            onChange={newValue => {
              if (
                type === gd.Variable.String
                  ? variable.getString() !== newValue
                  : variable.getValue() !== newValue
              ) {
                onChangeValue(newValue);
              }
            }}
            disabled={origin === 'parent' && depth !== 0}
            multiline={type === gd.Variable.String}
          />
        </TreeTableCell>
      );
    else
      columns.push(
        <TreeTableCell key="value" expand>
          <BooleanEditor
            value={variable.getBool()}
            onChange={onChangeValue}
            disabled={origin === 'parent' && depth !== 0}
          />
        </TreeTableCell>
      );
  }
  columns.push(
    <TreeTableCell key="tools" style={styles.toolColumn}>
      {origin === 'inherited' && depth === 0 ? (
        <IconButton
          size="small"
          onClick={onResetToDefaultValue}
          style={isCollection ? undefined : styles.fadedButton}
          tooltip={t`Reset`}
        >
          <Replay />
        </IconButton>
      ) : (
        origin !== 'parent' && (
          <>
            <ElementWithMenu
              shouldOpen={e =>
                isCollection && !e.shiftKey && e.type !== 'contextmenu'
                  ? onAddChild() && false
                  : true
              }
              element={
                <IconButton
                  size="small"
                  style={isCollection ? undefined : styles.fadedButton}
                  tooltip={t`Add child variable`}
                >
                  <AddCircle />
                </IconButton>
              }
              buildMenuTemplate={(i18n: I18nType) =>
                (isCollection
                  ? [
                      {
                        label: i18n._(t`Add child`),
                        click: () => onAddChild(),
                      },
                    ]
                  : []
                )
                  .concat(
                    variable.getType() !== gd.Variable.Structure
                      ? [
                          {
                            label: i18n._(t`Convert to structure`),
                            click: () => onChangeType('structure'),
                          },
                        ]
                      : []
                  )
                  .concat(
                    variable.getType() !== gd.Variable.Array
                      ? [
                          {
                            label: i18n._(t`Convert to array`),
                            click: () => onChangeType('array'),
                          },
                        ]
                      : []
                  )
              }
            />
            <ElementWithMenu
              element={
                <IconButton size="small" tooltip={t`Change variable type`}>
                  <BuildIcon />
                </IconButton>
              }
              buildMenuTemplate={(i18n: I18nType) =>
                [
                  {
                    gdType: gd.Variable.String,
                    label: i18n._(t`Convert to string`),
                    click: () => onChangeType('string'),
                  },
                  {
                    gdType: gd.Variable.Number,
                    label: i18n._(t`Convert to number`),
                    click: () => onChangeType('number'),
                  },
                  {
                    gdType: gd.Variable.Boolean,
                    label: i18n._(t`Convert to boolean`),
                    click: () => onChangeType('boolean'),
                  },
                  {
                    type: 'separator',
                  },
                  {
                    gdType: gd.Variable.Structure,
                    label: i18n._(t`Convert to structure`),
                    click: () => onChangeType('structure'),
                  },
                  {
                    gdType: gd.Variable.Array,
                    label: i18n._(t`Convert to array`),
                    click: () => onChangeType('array'),
                  },
                ].filter(e => e.gdType !== type)
              }
            />
          </>
        )
      )}
    </TreeTableCell>
  );

  return (
    <div>
      <TreeTableRow>{columns}</TreeTableRow>
      {children}
    </div>
  );
};

export default VariableRow;
