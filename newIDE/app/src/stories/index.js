// @flow
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Welcome from './Welcome';
import HelpButton from '../UI/HelpButton';
import StartPage from '../MainFrame/Editors/StartPage';
import AboutDialog from '../MainFrame/AboutDialog';
import CreateProjectDialog from '../ProjectCreation/CreateProjectDialog';
import { Tabs, Tab } from '../UI/Tabs';
import DragHandle from '../UI/DragHandle';
import HelpFinder from '../HelpFinder';
import LocalFolderPicker from '../UI/LocalFolderPicker';
import LocalExport from '../Export/LocalExporters/LocalExport';
import LocalCordovaExport from '../Export/LocalExporters/LocalCordovaExport';
import Progress from '../Export/LocalExporters/LocalOnlineCordovaExport/Progress';
import LocalS3Export from '../Export/LocalExporters/LocalS3Export';
import LocalNetworkPreviewDialog from '../Export/LocalExporters/LocalPreviewLauncher/LocalNetworkPreviewDialog';
import TextEditor from '../ObjectEditor/Editors/TextEditor';
import TiledSpriteEditor from '../ObjectEditor/Editors/TiledSpriteEditor';
import PanelSpriteEditor from '../ObjectEditor/Editors/PanelSpriteEditor';
import SpriteEditor from '../ObjectEditor/Editors/SpriteEditor';
import PointsEditor from '../ObjectEditor/Editors/SpriteEditor/PointsEditor';
import CollisionMasksEditor from '../ObjectEditor/Editors/SpriteEditor/CollisionMasksEditor';
import EmptyEditor from '../ObjectEditor/Editors/EmptyEditor';
import ImageThumbnail from '../ResourcesList/ResourceThumbnail/ImageThumbnail';
import ShapePainterEditor from '../ObjectEditor/Editors/ShapePainterEditor';
import ExternalEventsField from '../EventsSheet/InstructionEditor/ParameterFields/ExternalEventsField';
import LayerField from '../EventsSheet/InstructionEditor/ParameterFields/LayerField';
import MouseField from '../EventsSheet/InstructionEditor/ParameterFields/MouseField';
import SceneVariableField from '../EventsSheet/InstructionEditor/ParameterFields/SceneVariableField';
import KeyField from '../EventsSheet/InstructionEditor/ParameterFields/KeyField';
import ExpressionField from '../EventsSheet/InstructionEditor/ParameterFields/ExpressionField';
import StringField from '../EventsSheet/InstructionEditor/ParameterFields/StringField';
import AdMobEditor from '../ObjectEditor/Editors/AdMobEditor';
import ObjectsList from '../ObjectsList';
import ObjectSelector from '../ObjectsList/ObjectSelector';
import InstancePropertiesEditor from '../InstancesEditor/InstancePropertiesEditor';
import SerializedObjectDisplay from './SerializedObjectDisplay';
import EventsTree from '../EventsSheet/EventsTree';
import LayoutChooserDialog from '../MainFrame/Editors/LayoutChooserDialog';
import InstructionEditor from '../EventsSheet/InstructionEditor';
import EventsSheet from '../EventsSheet';
import BehaviorsEditor from '../BehaviorsEditor';
import ObjectsGroupEditor from '../ObjectsGroupEditor';
import ObjectsGroupsList from '../ObjectsGroupsList';
import muiDecorator from './MuiDecorator';
import paperDecorator from './PaperDecorator';
import ValueStateHolder from './ValueStateHolder';
import RefGetter from './RefGetter';
import DragDropContextProvider from '../Utils/DragDropHelpers/DragDropContextProvider';
import ResourcesLoader from '../ResourcesLoader';
import VariablesList from '../VariablesList';
import ExpressionSelector from '../EventsSheet/InstructionEditor/InstructionOrExpressionSelector/ExpressionSelector';
import InstructionSelector from '../EventsSheet/InstructionEditor/InstructionOrExpressionSelector/InstructionSelector';
import ParameterRenderingService from '../EventsSheet/InstructionEditor/ParameterRenderingService';
import { ErrorFallbackComponent } from '../UI/ErrorBoundary';
import { makeTestProject } from '../fixtures/TestProject';
import CreateProfile from '../Profile/CreateProfile';
import ProfileDetails from '../Profile/ProfileDetails';
import LimitDisplayer from '../Profile/LimitDisplayer';
import ResourcePreview from '../ResourcesList/ResourcePreview';
import ResourcesList from '../ResourcesList';
import {
  subscriptionForIndieUser,
  limitsForIndieUser,
  limitsReached,
  noSubscription,
  usagesForIndieUser,
  profileForIndieUser,
  fakeNoSubscriptionUserProfile,
  fakeIndieUserProfile,
  fakeNotAuthenticatedUserProfile,
  fakeAuthenticatedButLoadingUserProfile,
} from '../fixtures/GDevelopServicesTestData';
import debuggerGameDataDump from '../fixtures/DebuggerGameDataDump.json';
import SubscriptionDetails from '../Profile/SubscriptionDetails';
import UsagesDetails from '../Profile/UsagesDetails';
import SubscriptionDialog from '../Profile/SubscriptionDialog';
import LoginDialog from '../Profile/LoginDialog';
import UserProfileContext from '../Profile/UserProfileContext';
import { SubscriptionCheckDialog } from '../Profile/SubscriptionChecker';
import DebuggerContent from '../Debugger/DebuggerContent';

const gd = global.gd;
const {
  project,
  shapePainterObject,
  adMobObject,
  tiledSpriteObject,
  panelSpriteObject,
  textObject,
  spriteObject,
  testLayout,
  testLayoutInstance1,
  testInstruction,
  spriteObjectWithBehaviors,
  group2,
  emptyLayout,
} = makeTestProject(gd);

const Placeholder = () => <div>Placeholder component</div>;

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Tabs', module)
  .addDecorator(muiDecorator)
  .add('3 tabs', () => (
    <Tabs>
      <Tab label="Tab 1" onClose={action('Close tab 1')}>
        <div>Tab 1 content</div>
      </Tab>
      <Tab label="Tab 2" onClose={action('Close tab 2')}>
        <div>Tab 2 content</div>
      </Tab>
      <Tab label="Tab 3 with a long label" onClose={action('Close tab 3')}>
        <div>Tab 3 content</div>
      </Tab>
    </Tabs>
  ))
  .add('long labels', () => (
    <Tabs>
      <Tab
        label="Tab 1 with a very very long label"
        onClose={action('Close tab 1')}
      >
        <div>Tab 1 content</div>
      </Tab>
      <Tab label="Small 2" onClose={action('Close tab 2')}>
        <div>Tab 2 content</div>
      </Tab>
      <Tab
        label="Tab 3 with a very very loooong label"
        onClose={action('Close tab 3')}
      >
        <div>Tab 3 content</div>
      </Tab>
      <Tab label="Small 4" onClose={action('Close tab 4')}>
        <div>Tab 4 content</div>
      </Tab>
    </Tabs>
  ));

storiesOf('HelpButton', module)
  .addDecorator(muiDecorator)
  .add('default', () => <HelpButton helpPagePath="/test" />);

storiesOf('HelpFinder', module)
  .addDecorator(muiDecorator)
  .add('default', () => <HelpFinder open onClose={action('close')} />);

storiesOf('ParameterFields', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('ExpressionField', () => (
    <ValueStateHolder
      initialValue={'MySpriteObject.X() + MouseX("", 0)'}
      render={(value, onChange) => (
        <ExpressionField
          project={project}
          layout={testLayout}
          value={value}
          onChange={onChange}
          parameterRenderingService={ParameterRenderingService}
        />
      )}
    />
  ))
  .add('StringField', () => (
    <ValueStateHolder
      initialValue={'ToString(0) + "Test" + NewLine() + VariableString(MyVar)'}
      render={(value, onChange) => (
        <StringField
          project={project}
          layout={testLayout}
          value={value}
          onChange={onChange}
          parameterRenderingService={ParameterRenderingService}
        />
      )}
    />
  ))
  .add('ExternalEventsField', () => (
    <ValueStateHolder
      initialValue={'Test'}
      render={(value, onChange) => (
        <ExternalEventsField
          project={project}
          value={value}
          onChange={onChange}
        />
      )}
    />
  ))
  .add('LayerField', () => (
    <ValueStateHolder
      initialValue={'Test'}
      render={(value, onChange) => (
        <LayerField
          project={project}
          layout={testLayout}
          value={value}
          onChange={onChange}
        />
      )}
    />
  ))
  .add('KeyField', () => (
    <ValueStateHolder
      initialValue={'Space'}
      render={(value, onChange) => (
        <KeyField project={project} value={value} onChange={onChange} />
      )}
    />
  ))
  .add('MouseField', () => (
    <ValueStateHolder
      initialValue={'Left'}
      render={(value, onChange) => (
        <MouseField project={project} value={value} onChange={onChange} />
      )}
    />
  ))
  .add('SceneVariableField', () => (
    <ValueStateHolder
      initialValue={'Variable1'}
      render={(value, onChange) => (
        <SceneVariableField
          project={project}
          layout={testLayout}
          value={value}
          onChange={onChange}
        />
      )}
    />
  ));

storiesOf('LocalExport', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <LocalExport open project={project} onClose={action('close')} />
  ));

storiesOf('LocalS3Export', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <LocalS3Export open project={project} onClose={action('close')} />
  ));

storiesOf('LocalCordovaExport', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => <LocalCordovaExport project={project} />);

storiesOf('LocalOnlineCordovaExport', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('Progress (not started)', () => <Progress exportStep={''} />)
  .add('Progress (export)', () => <Progress exportStep={'export'} />)
  .add('Progress (compress)', () => <Progress exportStep={'compress'} />)
  .add('Progress (upload)', () => <Progress exportStep={'upload'} />)
  .add('Progress (upload) (errored)', () => (
    <Progress exportStep={'upload'} errored />
  ))
  .add('Progress (waiting-for-build)', () => (
    <Progress exportStep={'waiting-for-build'} />
  ))
  .add('Progress (build)', () => <Progress exportStep={'build'} />)
  .add('Progress (build) (errored)', () => (
    <Progress exportStep={'build'} errored />
  ))
  .add('Progress (done)', () => <Progress exportStep={'done'} />);

storiesOf('LocalFolderPicker', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => <LocalFolderPicker floatingLabelText="Export folder" />)
  .add('full width', () => (
    <LocalFolderPicker floatingLabelText="Export folder" fullWidth />
  ));

storiesOf('StartPage', module)
  .addDecorator(muiDecorator)
  .add('default', () => <StartPage />);

storiesOf('DebuggerContent', module)
  .addDecorator(muiDecorator)
  .add('with data', () => (
    <DragDropContextProvider>
      <div style={{ height: 550, display: 'flex' }}>
        <DebuggerContent
          gameData={debuggerGameDataDump}
          onPause={action('on pause')}
          onPlay={action('on play')}
          onRefresh={action('on refresh')}
          onEdit={() => false}
          onCall={() => false}
        />
      </div>
    </DragDropContextProvider>
  ))
  .add('without data', () => (
    <DragDropContextProvider>
      <div style={{ height: 550, display: 'flex' }}>
        <DebuggerContent
          gameData={null}
          onPause={action('on pause')}
          onPlay={action('on play')}
          onRefresh={action('on refresh')}
          onEdit={() => false}
          onCall={() => false}
        />
      </div>
    </DragDropContextProvider>
  ));

storiesOf('AboutDialog', module)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <AboutDialog
      open
      onClose={action('close')}
      updateStatus={{ message: '', status: 'unknown' }}
    />
  ));

storiesOf('CreateProjectDialog', module)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <CreateProjectDialog open examplesComponent={Placeholder} />
  ));

storiesOf('LayoutChooserDialog', module)
  .addDecorator(muiDecorator)
  .add('default', () => <LayoutChooserDialog open project={project} />);

storiesOf('DragHandle', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => <DragHandle />);

storiesOf('EventsTree', module)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <DragDropContextProvider>
      <div className="gd-events-sheet">
        <EventsTree
          events={testLayout.getEvents()}
          selectedEvents={[]}
          selectedInstructions={[]}
        />
      </div>
    </DragDropContextProvider>
  ));

storiesOf('EventsSheet', module)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <DragDropContextProvider>
      <EventsSheet
        project={project}
        layout={testLayout}
        events={testLayout.getEvents()}
        onOpenExternalEvents={action('Open external events')}
        resourceSources={[]}
        onChooseResource={source =>
          action('Choose resource from source', source)}
        resourceExternalEditors={[]}
      />
    </DragDropContextProvider>
  ))
  .add('empty (no events)', () => (
    <DragDropContextProvider>
      <EventsSheet
        project={project}
        layout={emptyLayout}
        events={emptyLayout.getEvents()}
        onOpenExternalEvents={action('Open external events')}
        resourceSources={[]}
        onChooseResource={source =>
          action('Choose resource from source', source)}
        resourceExternalEditors={[]}
      />
    </DragDropContextProvider>
  ));

storiesOf('ExpressionSelector', module)
  .addDecorator(muiDecorator)
  .add('number', () => (
    <ExpressionSelector
      selectedType=""
      expressionType="number"
      onChoose={action('Expression chosen')}
    />
  ))
  .add('string', () => (
    <ExpressionSelector
      selectedType=""
      expressionType="string"
      onChoose={action('(String) Expression chosen')}
    />
  ));

storiesOf('InstructionSelector', module)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <InstructionSelector
      selectedType=""
      onChoose={action('Instruction chosen')}
      isCondition
    />
  ));

storiesOf('InstructionEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <InstructionEditor
      project={project}
      layout={testLayout}
      isCondition
      instruction={testInstruction}
    />
  ));

storiesOf('TextEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={textObject}>
      <TextEditor object={textObject} project={project} />
    </SerializedObjectDisplay>
  ));

storiesOf('TiledSpriteEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={tiledSpriteObject}>
      <TiledSpriteEditor object={tiledSpriteObject} project={project} />
    </SerializedObjectDisplay>
  ));

storiesOf('PanelSpriteEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={panelSpriteObject}>
      <PanelSpriteEditor object={panelSpriteObject} project={project} />
    </SerializedObjectDisplay>
  ));

storiesOf('SpriteEditor and related editors', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('SpriteEditor', () => (
    <SerializedObjectDisplay object={spriteObject}>
      <SpriteEditor object={spriteObject} project={project} />
    </SerializedObjectDisplay>
  ))
  .add('PointsEditor', () => (
    <SerializedObjectDisplay object={spriteObject}>
      <PointsEditor
        object={spriteObject}
        project={project}
        resourcesLoader={ResourcesLoader}
      />
    </SerializedObjectDisplay>
  ))
  .add('CollisionMasksEditor', () => (
    <SerializedObjectDisplay object={spriteObject}>
      <CollisionMasksEditor
        object={spriteObject}
        project={project}
        resourcesLoader={ResourcesLoader}
      />
    </SerializedObjectDisplay>
  ));

storiesOf('ShapePainterEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={shapePainterObject}>
      <ShapePainterEditor object={shapePainterObject} project={project} />
    </SerializedObjectDisplay>
  ));

storiesOf('AdMobEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={adMobObject}>
      <AdMobEditor object={adMobObject} project={project} />
    </SerializedObjectDisplay>
  ));

storiesOf('ImageThumbnail', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <ImageThumbnail
      project={project}
      resourceName="res/icon128.png"
      resourcesLoader={ResourcesLoader}
    />
  ))
  .add('selectable', () => (
    <ImageThumbnail
      selectable
      project={project}
      resourceName="res/icon128.png"
      resourcesLoader={ResourcesLoader}
    />
  ));

storiesOf('EmptyEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => <EmptyEditor />);

storiesOf('ObjectsList', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={testLayout}>
      <div style={{ height: 250 }}>
        <ObjectsList
          getThumbnail={() => 'res/unknown32.png'}
          project={project}
          objectsContainer={testLayout}
          onEditObject={action('On edit object')}
        />
      </div>
    </SerializedObjectDisplay>
  ));

storiesOf('ObjectSelector', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('without groups', () => (
    <ObjectSelector
      project={project}
      layout={testLayout}
      value=""
      onChoose={action('onChoose in ObjectSelector')}
      noGroups
      hintText="Choose an object to add to the group"
      fullWidth
      openOnFocus
    />
  ))
  .add('with groups', () => (
    <ObjectSelector
      project={project}
      layout={testLayout}
      value=""
      onChoose={action('onChoose in ObjectSelector')}
      hintText="Choose an object or a group"
      fullWidth
      openOnFocus
    />
  ));

storiesOf('InstancePropertiesEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={testLayout}>
      <InstancePropertiesEditor
        project={project}
        layout={testLayout}
        instances={[testLayoutInstance1]}
      />
    </SerializedObjectDisplay>
  ));

storiesOf('ObjectsGroupEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <ObjectsGroupEditor project={project} layout={testLayout} group={group2} />
  ));

storiesOf('ObjectsGroupsList', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={testLayout}>
      <div style={{ height: 250 }}>
        <ObjectsGroupsList
          project={project}
          objectsContainer={testLayout}
          onEditGroup={() => {}}
        />
      </div>
    </SerializedObjectDisplay>
  ));

storiesOf('BehaviorsEditor', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={spriteObjectWithBehaviors}>
      <BehaviorsEditor project={project} object={spriteObjectWithBehaviors} />
    </SerializedObjectDisplay>
  ));

storiesOf('VariablesList', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SerializedObjectDisplay object={testLayout}>
      <VariablesList variablesContainer={testLayout.getVariables()} />
    </SerializedObjectDisplay>
  ));

const fakeError = new Error('Fake error for storybook');
storiesOf('ErrorBoundary', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <ErrorFallbackComponent componentStack="Fake stack" error={fakeError} />
  ));

storiesOf('CreateProfile', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => <CreateProfile onLogin={action('login')} />);

storiesOf('LimitDisplayer', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <LimitDisplayer
      subscription={subscriptionForIndieUser}
      limit={limitsForIndieUser['cordova-build']}
      onChangeSubscription={action('change subscription')}
    />
  ))
  .add('limit reached', () => (
    <LimitDisplayer
      subscription={subscriptionForIndieUser}
      limit={limitsReached['cordova-build']}
      onChangeSubscription={action('change subscription')}
    />
  ))
  .add('limit reached without subscription', () => (
    <LimitDisplayer
      subscription={noSubscription}
      limit={limitsReached['cordova-build']}
      onChangeSubscription={action('change subscription')}
    />
  ));

storiesOf('ProfileDetails', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('profile', () => <ProfileDetails profile={profileForIndieUser} />)
  .add('loading', () => <ProfileDetails profile={null} />);

storiesOf('SubscriptionDetails', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <SubscriptionDetails
      subscription={subscriptionForIndieUser}
      onChangeSubscription={action('change subscription')}
    />
  ))
  .add('limit reached', () => (
    <SubscriptionDetails
      subscription={noSubscription}
      onChangeSubscription={action('change subscription')}
    />
  ));

storiesOf('UsagesDetails', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => <UsagesDetails usages={usagesForIndieUser} />)
  .add('empty', () => <UsagesDetails usages={[]} />);

storiesOf('SubscriptionDialog', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('not authenticated', () => (
    <UserProfileContext.Provider value={fakeNotAuthenticatedUserProfile}>
      <SubscriptionDialog open onClose={action('on close')} />
    </UserProfileContext.Provider>
  ))
  .add('authenticated but loading', () => (
    <UserProfileContext.Provider value={fakeAuthenticatedButLoadingUserProfile}>
      <SubscriptionDialog open onClose={action('on close')} />
    </UserProfileContext.Provider>
  ))
  .add('authenticated user with subscription', () => (
    <UserProfileContext.Provider value={fakeIndieUserProfile}>
      <SubscriptionDialog open onClose={action('on close')} />
    </UserProfileContext.Provider>
  ))
  .add('authenticated user with no subscription', () => (
    <UserProfileContext.Provider value={fakeNoSubscriptionUserProfile}>
      <SubscriptionDialog open onClose={action('on close')} />
    </UserProfileContext.Provider>
  ));

storiesOf('LoginDialog', module)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <LoginDialog
      open
      onClose={action('on close')}
      loginInProgress={false}
      createAccountInProgress={false}
      onCreateAccount={action('on create account')}
      onLogin={action('on login')}
      onForgotPassword={action('on forgot password')}
      onCloseResetPasswordDialog={action('on close reset password dialog')}
      resetPasswordDialogOpen={false}
      forgotPasswordInProgress={false}
      error={null}
    />
  ))
  .add('login in progress', () => (
    <LoginDialog
      open
      onClose={action('on close')}
      loginInProgress
      createAccountInProgress={false}
      onCreateAccount={action('on create account')}
      onLogin={action('on login')}
      onForgotPassword={action('on forgot password')}
      onCloseResetPasswordDialog={action('on close reset password dialog')}
      resetPasswordDialogOpen={false}
      forgotPasswordInProgress={false}
      error={null}
    />
  ))
  .add('create account in progress', () => (
    <LoginDialog
      open
      onClose={action('on close')}
      loginInProgress={false}
      createAccountInProgress
      onCreateAccount={action('on create account')}
      onLogin={action('on login')}
      onForgotPassword={action('on forgot password')}
      onCloseResetPasswordDialog={action('on close reset password dialog')}
      resetPasswordDialogOpen={false}
      forgotPasswordInProgress={false}
      error={null}
    />
  ))
  .add('weak-password error', () => (
    <LoginDialog
      open
      onClose={action('on close')}
      loginInProgress={false}
      createAccountInProgress={false}
      onCreateAccount={action('on create account')}
      onLogin={action('on login')}
      onForgotPassword={action('on forgot password')}
      onCloseResetPasswordDialog={action('on close reset password dialog')}
      resetPasswordDialogOpen={false}
      forgotPasswordInProgress={false}
      error={{
        code: 'auth/weak-password',
      }}
    />
  ))
  .add('invalid-email error', () => (
    <LoginDialog
      open
      onClose={action('on close')}
      loginInProgress={false}
      createAccountInProgress={false}
      onCreateAccount={action('on create account')}
      onLogin={action('on login')}
      onForgotPassword={action('on forgot password')}
      onCloseResetPasswordDialog={action('on close reset password dialog')}
      resetPasswordDialogOpen={false}
      forgotPasswordInProgress={false}
      error={{
        code: 'auth/invalid-email',
      }}
    />
  ))
  .add('Reset password', () => (
    <LoginDialog
      open
      onClose={action('on close')}
      loginInProgress={false}
      createAccountInProgress={false}
      onCreateAccount={action('on create account')}
      onLogin={action('on login')}
      onForgotPassword={action('on forgot password')}
      onCloseResetPasswordDialog={action('on close reset password dialog')}
      forgotPasswordInProgress={false}
      resetPasswordDialogOpen
      error={null}
    />
  ));

storiesOf('LocalNetworkPreviewDialog', module)
  .addDecorator(paperDecorator)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <LocalNetworkPreviewDialog
      open
      url="192.168.0.1:2929"
      error={null}
      onRunPreviewLocally={action('on run preview locally')}
      onExport={action('on export')}
      onClose={action('on close')}
    />
  ))
  .add('waiting for url', () => (
    <LocalNetworkPreviewDialog
      open
      url=""
      error={null}
      onRunPreviewLocally={action('on run preview locally')}
      onExport={action('on export')}
      onClose={action('on close')}
    />
  ))
  .add('error', () => (
    <LocalNetworkPreviewDialog
      open
      url="192.168.0.1:2929"
      error={{ message: 'Oops' }}
      onRunPreviewLocally={action('on run preview locally')}
      onExport={action('on export')}
      onClose={action('on close')}
    />
  ));

storiesOf('SubscriptionCheckDialog', module)
  .addDecorator(muiDecorator)
  .add('default (try mode)', () => (
    <RefGetter onRef={ref => ref.checkHasSubscription()}>
      <SubscriptionCheckDialog
        title="Preview over wifi"
        userProfile={fakeNoSubscriptionUserProfile}
        onChangeSubscription={action('change subscription')}
        mode="try"
      />
    </RefGetter>
  ))
  .add('default (mandatory mode)', () => (
    <RefGetter onRef={ref => ref.checkHasSubscription()}>
      <SubscriptionCheckDialog
        title="Preview over wifi"
        userProfile={fakeNoSubscriptionUserProfile}
        onChangeSubscription={action('change subscription')}
        mode="mandatory"
      />
    </RefGetter>
  ));

storiesOf('ResourcePreview', module)
  .addDecorator(muiDecorator)
  .add('not existing/missing resource', () => (
    <ResourcePreview
      project={project}
      resourceName="resource-that-does-not-exists-in-the-project"
      resourcesLoader={ResourcesLoader}
    />
  ))
  .add('image resource', () => (
    <ResourcePreview
      project={project}
      resourceName="icon128.png"
      resourcesLoader={ResourcesLoader}
    />
  ))
  .add('audio resource', () => (
    <ResourcePreview
      project={project}
      resourceName="fake-audio1.mp3"
      resourcesLoader={ResourcesLoader}
    />
  ));

storiesOf('ResourcesList', module)
  .addDecorator(muiDecorator)
  .add('default', () => (
    <div style={{ height: 200 }}>
      <ValueStateHolder
        initialValue={null}
        render={(value, onChange) => (
          <ResourcesList
            onSelectResource={onChange}
            selectedResource={value}
            onDeleteResource={() => {}}
            onRenameResource={() => {}}
            project={project}
          />
        )}
      />
    </div>
  ));
