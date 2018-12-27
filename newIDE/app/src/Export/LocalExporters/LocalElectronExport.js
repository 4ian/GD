// @flow
import React, { Component } from 'react';
import Dialog from '../../UI/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { sendExportLaunched } from '../../Utils/Analytics/EventSender';
import { Column, Line, Spacer } from '../../UI/Grid';
import { showErrorBox } from '../../UI/Messages/MessageBox';
import { findGDJS } from './LocalGDJSFinder';
import localFileSystem from './LocalFileSystem';
import LocalFolderPicker from '../../UI/LocalFolderPicker';
import HelpButton from '../../UI/HelpButton';
import {
  displayProjectErrorsBox,
  getErrors,
} from '../../ProjectManager/ProjectErrorsChecker';
import { translate, type TranslatorProps } from 'react-i18next';
import assignIn from 'lodash/assignIn';
import optionalRequire from '../../Utils/OptionalRequire';
const electron = optionalRequire('electron');
const shell = electron ? electron.shell : null;

const gd = global.gd;

type Props = TranslatorProps & {|
  project: gdProject,
|};

type State = {|
  outputDir: string,
  exportFinishedDialogOpen: boolean,
|};

class LocalElectronExport extends Component<Props, State> {
  state = {
    exportFinishedDialogOpen: false,
    outputDir: '',
  };

  componentDidMount() {
    const { project } = this.props;
    this.setState({
      outputDir: project ? project.getLastCompilationDirectory() : '',
    });
  }

  static prepareExporter = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      findGDJS(gdjsRoot => {
        if (!gdjsRoot) {
          showErrorBox('Could not find GDJS');
          return reject();
        }
        console.info('GDJS found in ', gdjsRoot);

        const fileSystem = assignIn(
          new gd.AbstractFileSystemJS(),
          localFileSystem
        );
        const exporter = new gd.Exporter(fileSystem, gdjsRoot);

        resolve({
          exporter,
        });
      });
    });
  };

  launchExport = () => {
    const { t, project } = this.props;
    if (!project) return;

    sendExportLaunched('local-electron');

    if (!displayProjectErrorsBox(t, getErrors(t, project))) return;

    const outputDir = this.state.outputDir;
    project.setLastCompilationDirectory(outputDir);

    LocalElectronExport.prepareExporter()
      .then(({ exporter }) => {
        const exportOptions = new gd.MapStringBoolean();
        exportOptions.set('exportForElectron', true);
        exporter.exportWholePixiProject(project, outputDir, exportOptions);
        exportOptions.delete();
        exporter.delete();

        this.setState({
          exportFinishedDialogOpen: true,
        });
      })
      .catch(err => {
        showErrorBox('Unable to export the game', err);
      });
  };

  openExportFolder = () => {
    if (shell) shell.openItem(this.state.outputDir);
  };

  render() {
    const { t, project } = this.props;
    if (!project) return null;

    return (
      <Column noMargin>
        <Line>
          <Column noMargin>
            <p>
              This will export your game so that you can package it for Windows,
              macOS or Linux. You will need to install third-party tools
              (Node.js, Electron Builder) to package your game by yourself.
            </p>
          </Column>
        </Line>
        <Line>
          <LocalFolderPicker
            value={this.state.outputDir}
            defaultPath={project.getLastCompilationDirectory()}
            onChange={value => this.setState({ outputDir: value })}
            fullWidth
          />
        </Line>
        <Line>
          <Spacer expand />
          <RaisedButton
            label="Export"
            primary={true}
            onClick={this.launchExport}
            disabled={!this.state.outputDir}
          />
        </Line>
        <Dialog
          title={t('Export finished')}
          actions={[
            <FlatButton
              key="open"
              label="Open folder"
              primary={true}
              onClick={this.openExportFolder}
            />,
            <FlatButton
              key="close"
              label="Close"
              primary={false}
              onClick={() =>
                this.setState({
                  exportFinishedDialogOpen: false,
                })
              }
            />,
          ]}
          secondaryActions={
            <HelpButton key="help" helpPagePath="/publishing" />
          }
          modal
          open={this.state.exportFinishedDialogOpen}
        >
          <p>
            The game was properly exported. You can now use Electron Builder
            (you need Node.js installed and to use the command-line to run it)
            to create an executable.
          </p>
        </Dialog>
      </Column>
    );
  }
}

export default translate()(LocalElectronExport);
