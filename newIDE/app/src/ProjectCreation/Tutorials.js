import { Trans } from '@lingui/macro';
import React, { PureComponent } from 'react';
import { Column, Line } from '../UI/Grid';
import { sendTutorialOpened } from '../Utils/Analytics/EventSender';
import Window from '../Utils/Window';
import { getHelpLink } from '../Utils/HelpLink';
import { List, ListItem } from '../UI/List';
import Text from '../UI/Text';
import Subheader from '../UI/Subheader';
import RaisedButton from '../UI/RaisedButton';

export default class Tutorials extends PureComponent {
  render() {
    return (
      <Column noMargin>
        <Line>
          <Column>
            <Text>
              <Trans>
                Tutorials are available on GDevelop wiki. Choose a tutorial to
                read:
              </Trans>
            </Text>
          </Column>
        </Line>
        <Line>
          <Column expand noMargin>
            <List>
              <ListItem
                primaryText={<Trans>Platformer Tutorial</Trans>}
                secondaryText={
                  <Trans>Make a platform game from scratch.</Trans>
                }
                onClick={() => {
                  sendTutorialOpened('Platformer');
                  Window.openExternalURL(
                    getHelpLink('/tutorials/platform-game/start')
                  );
                }}
              />
              <ListItem
                primaryText={<Trans>Tank Shooter Tutorial</Trans>}
                secondaryText={
                  <Trans>Make a simple tank shooter game from scratch.</Trans>
                }
                onClick={() => {
                  sendTutorialOpened('Tank Shooter');
                  Window.openExternalURL(
                    getHelpLink('/tutorials/tank-shooter')
                  );
                }}
              />
              <Subheader>
                <Trans>Community Tutorials</Trans>
              </Subheader>
              <ListItem
                primaryText={<Trans>Endless Runner Tutorial</Trans>}
                secondaryText={
                  <Trans>
                    Make a simple game where the player must jump on platforms
                    for as long as possible.
                  </Trans>
                }
                secondaryTextLines={2}
                onClick={() => {
                  sendTutorialOpened('Endless Runner');
                  Window.openExternalURL(
                    getHelpLink('/tutorials/endless-runner')
                  );
                }}
              />
              <ListItem
                primaryText={<Trans>Endless Car Game Tutorial</Trans>}
                secondaryText={
                  <Trans>
                    Create a simple game where you must dodge the cars on the
                    road.
                  </Trans>
                }
                secondaryTextLines={2}
                onClick={() => {
                  sendTutorialOpened('Endless Car Game');
                  Window.openExternalURL(getHelpLink('/tutorials/roadrider'));
                }}
              />
              <ListItem
                primaryText={<Trans>Breakout Tutorial</Trans>}
                secondaryText={
                  <Trans>
                    Create a simple breakout game where you must destroy all the
                    bricks on the screen.
                  </Trans>
                }
                secondaryTextLines={2}
                onClick={() => {
                  sendTutorialOpened('Breakout');
                  Window.openExternalURL(getHelpLink('/tutorials/breakout'));
                }}
              />
            </List>
            <Line alignItems="center" justifyContent="center">
              <RaisedButton
                label={<Trans>See other tutorials on wiki</Trans>}
                onClick={() => {
                  Window.openExternalURL(getHelpLink('/tutorials'));
                }}
              />
            </Line>
          </Column>
        </Line>
      </Column>
    );
  }
}
