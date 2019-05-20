// @flow
import * as React from 'react';
import { List } from 'react-virtualized';
import { ListItem } from 'material-ui/List';
import ItemRow from './ItemRow';
import { makeAddItem } from '../ListCommonItem';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const listItemHeight = 48; // TODO: Move this into theme?

const AddItemRow = makeAddItem(ListItem);

const SortableItemRow = SortableElement(props => {
  const { style, ...otherProps } = props;
  return (
    <div style={style}>
      <ItemRow {...otherProps} />
    </div>
  );
});

const SortableAddItemRow = SortableElement(props => {
  return <AddItemRow {...props} />;
});

export type Item = {
  key: string | number,
  getName: () => string,
};

type ItemsListProps = {
  height: number,
  width: number,
  fullList: Array<Item>,
  selectedItem: ?Item,
  onAddNewItem?: () => void,
  onRename: (Item, string) => void,
  getThumbnail?: Item => string,
  onItemSelected: (?Item) => void,
  renamedItem: ?Item,
  addNewItemLabel: React.Node | string,
  erroredItems?: { [string]: '' | 'error' | 'warning' },
  buildMenuTemplate: (Item, index: number) => any,
};

class ItemsList extends React.Component<ItemsListProps, *> {
  list: any;

  forceUpdateGrid() {
    if (this.list) this.list.forceUpdateGrid();
  }

  render() {
    const {
      height,
      width,
      fullList,
      selectedItem,
      addNewItemLabel,
      renamedItem,
      getThumbnail,
      erroredItems,
    } = this.props;

    return (
      <List
        ref={list => (this.list = list)}
        height={height}
        rowCount={fullList.length}
        rowHeight={listItemHeight}
        rowRenderer={({ index, key, style }) => {
          const item = fullList[index];
          if (item.key === 'add-item-row') {
            return (
              <SortableAddItemRow
                index={fullList.length}
                key={key}
                style={style}
                disabled
                onClick={this.props.onAddNewItem}
                primaryText={addNewItemLabel}
              />
            );
          }

          const nameBeingEdited = renamedItem === item;

          return (
            <SortableItemRow
              index={index}
              key={key}
              item={item}
              style={style}
              onRename={newName => this.props.onRename(item, newName)}
              editingName={nameBeingEdited}
              getThumbnail={getThumbnail ? () => getThumbnail(item) : undefined}
              selected={item === selectedItem}
              onItemSelected={this.props.onItemSelected}
              errorStatus={erroredItems ? erroredItems[item.getName()] : ''}
              buildMenuTemplate={() =>
                this.props.buildMenuTemplate(item, index)
              }
            />
          );
        }}
        width={width}
      />
    );
  }
}

const SortableItemsList = SortableContainer(ItemsList, { withRef: true });
export default SortableItemsList;
