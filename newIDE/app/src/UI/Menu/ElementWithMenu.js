// @flow
import * as React from 'react';
import { type I18n as I18nType } from '@lingui/core';
import ReactDOM from 'react-dom';
import ContextMenu from './ContextMenu';
import { type MenuItemTemplate } from './Menu.flow';

type Props = {|
  shouldOpen?: (SyntheticEvent<HTMLButtonElement>) => boolean,
  element: React$Element<any>,
  buildMenuTemplate: (i18n: I18nType) => Array<MenuItemTemplate>,
  openMenuWithSecondaryClick?: boolean,
  passExtraProps?: boolean,
|};

type State = {||};

/**
 * Wrap an element and display a menu when `onClick` prop is called on the element.
 */

export default class ElementWithMenu extends React.Component<Props, State> {
  _contextMenu: ?ContextMenu;
  _wrappedElement: ?any;

  open = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { _contextMenu } = this;
    if (!_contextMenu || (this.props.shouldOpen && !this.props.shouldOpen(e)))
      return;

    const node = ReactDOM.findDOMNode(this._wrappedElement);
    if (node instanceof HTMLElement) {
      const dimensions = node.getBoundingClientRect();

      _contextMenu.open(
        Math.round(dimensions.left + dimensions.width / 2),
        Math.round(dimensions.top + dimensions.height)
      );
    }
  };

  render() {
    const {
      element,
      buildMenuTemplate,
      openMenuWithSecondaryClick,
      passExtraProps,
      ...otherProps
    } = this.props;

    return (
      <React.Fragment>
        {React.cloneElement(element, {
          onContextMenu: this.open,
          // $FlowFixMe - Flow complaining about using too much spread operators
          ...(openMenuWithSecondaryClick ? {} : { onClick: this.open }),
          ref: wrappedElement => (this._wrappedElement = wrappedElement),
          ...(passExtraProps ? otherProps : {}),
        })}
        <ContextMenu
          ref={contextMenu => (this._contextMenu = contextMenu)}
          buildMenuTemplate={buildMenuTemplate}
        />
      </React.Fragment>
    );
  }
}
