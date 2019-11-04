// @flow
import { Trans } from '@lingui/macro';
import React, { Component } from 'react';
import { List, ListItem } from '../UI/List';
import RaisedButton from '../UI/RaisedButton';
import { sendNewGameCreated } from '../Utils/Analytics/EventSender';
import { Column, Line } from '../UI/Grid';
import ListIcon from '../UI/ListIcon';
import Text from '../UI/Text';
import { type StorageProvider, type FileMetadata } from '../ProjectsStorage';
import InternalFileStorageProvider from '../ProjectsStorage/InternalFileStorageProvider';
const gd = global.gd;

type Props = {|
  onOpen: (
    storageProvider: StorageProvider,
    fileMetadata: FileMetadata
  ) => void,
  onCreate: (
    gdProject,
    storageProvider: ?StorageProvider,
    fileMetadata: ?FileMetadata
  ) => void,
  onShowExamples: () => void,
|};

export default class BrowserStarters extends Component<Props> {
  render() {
    return (
      <Column noMargin>
        <Line>
          <Column>
            <Text>
              <Trans>Choose a game to use as a starter:</Trans>
            </Text>
          </Column>
        </Line>
        <Line>
          <Column expand noMargin>
            <List>
              <ListItem
                leftIcon={
                  <ListIcon
                    iconSize={40}
                    src="res/starters_icons/platformer.png"
                  />
                }
                primaryText={<Trans>Platformer</Trans>}
                secondaryText={
                  <Trans>
                    A simple platform game, with coins to collect, moving
                    platforms and enemies.
                  </Trans>
                }
                secondaryTextLines={2}
                onClick={() => {
                  sendNewGameCreated('platformer');
                  this.props.onOpen(InternalFileStorageProvider, {
                    fileIdentifier: 'example://platformer',
                  });
                }}
              />
              <ListItem
                leftIcon={
                  <ListIcon
                    iconSize={40}
                    src="res/starters_icons/space-shooter.png"
                  />
                }
                primaryText={<Trans>8-bit Space Shooter</Trans>}
                secondaryText={
                  <Trans>
                    A beautiful, retro side-scrolling shooter where you must
                    defeat incoming enemies with your mecha transforming
                    spaceship. Huge boss included!
                  </Trans>
                }
                secondaryTextLines={2}
                onClick={() => {
                  sendNewGameCreated('space-shooter');
                  this.props.onOpen(InternalFileStorageProvider, {
                    fileIdentifier: 'example://space-shooter',
                  });
                }}
              />
              <ListItem
                leftIcon={
                  <ListIcon
                    iconSize={40}
                    src="res/starters_icons/isometric-game.png"
                  />
                }
                primaryText={<Trans>Isometric game</Trans>}
                secondaryText={
                  <Trans>
                    An example of an isometric game where you can explore a map
                    with your character.
                  </Trans>
                }
                secondaryTextLines={2}
                onClick={() => {
                  sendNewGameCreated('isometric-game');
                  this.props.onOpen(InternalFileStorageProvider, {
                    fileIdentifier: 'example://isometric-game',
                  });
                }}
              />
              <ListItem
                leftIcon={
                  <ListIcon
                    iconSize={40}
                    src="res/starters_icons/downhill-bike-physics-demo.png"
                  />
                }
                primaryText="Downhill Bike Racing"
                secondaryText={
                  <Trans>
                    An example of a 2D physics based driving game, where player
                    have to reach the end as fast as possible.
                  </Trans>
                }
                secondaryTextLines={2}
                onClick={() => {
                  sendNewGameCreated('downhill-bike-physics-demo');
                  this.props.onOpen(InternalFileStorageProvider, {
                    fileIdentifier: 'example://downhill-bike-physics-demo',
                  });
                }}
              />
              <ListItem
                leftIcon={
                  <ListIcon iconSize={40} src="res/starters_icons/pairs.png" />
                }
                primaryText="Pairs"
                secondaryText={
                  <Trans>
                    Find all matching pairs of cards in this relaxing game. Use
                    tweens to create smooth, natural animations with a few
                    events.
                  </Trans>
                }
                secondaryTextLines={2}
                onClick={() => {
                  sendNewGameCreated('pairs');
                  this.props.onOpen(InternalFileStorageProvider, {
                    fileIdentifier: 'example://pairs',
                  });
                }}
              />
              <ListItem
                primaryText={<Trans>Empty game</Trans>}
                secondaryText={<Trans>Start a new game from scratch.</Trans>}
                secondaryTextLines={2}
                onClick={() => {
                  sendNewGameCreated('');

                  const project = gd.ProjectHelper.createNewGDJSProject();
                  this.props.onCreate(project, null, null);
                }}
              />
            </List>
            <Line alignItems="center" justifyContent="center">
              <RaisedButton
                label={<Trans>See examples</Trans>}
                onClick={() => this.props.onShowExamples()}
              />
            </Line>
          </Column>
        </Line>
      </Column>
    );
  }
}
