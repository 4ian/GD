// @flow
import * as React from 'react';
import { Trans, t } from '@lingui/macro';
import assignIn from 'lodash/assignIn';
import {
  type Build,
  buildElectron,
  getBuildFileUploadOptions,
} from '../../Utils/GDevelopServices/Build';
import { type UserProfile } from '../../Profile/UserProfileContext';
import { findGDJS } from '../../GameEngineFinder/LocalGDJSFinder';
import { uploadLocalFile } from './LocalFileUploader';
import { archiveLocalFolder } from '../../Utils/LocalArchiver';
import optionalRequire from '../../Utils/OptionalRequire.js';
import localFileSystem from './LocalFileSystem';
import {
  type ExportPipeline,
  type ExportPipelineContext,
} from '../ExportPipeline.flow';
import {
  type ExportState,
  SetupExportHeader,
} from '../GenericExporters/OnlineElectronExport';
const path = optionalRequire('path');
const os = optionalRequire('os');
const gd: libGDevelop = global.gd;

type PreparedExporter = {|
  exporter: gdjsExporter,
  temporaryOutputDir: string,
|};

type ExportOutput = {|
  temporaryOutputDir: string,
|};

type ResourcesDownloadOutput = {|
  temporaryOutputDir: string,
|};

type CompressionOutput = string;

export const localOnlineElectronExportPipeline: ExportPipeline<
  ExportState,
  PreparedExporter,
  ExportOutput,
  ResourcesDownloadOutput,
  CompressionOutput
> = {
  name: 'local-online-electron',
  onlineBuildType: 'electron-build',
  shouldHaveUniquePackageName: t`The package name begins with com.example, make sure you replace it with an unique one, else installing your game might overwrite other games.`,

  getInitialExportState: () => ({
    targets: ['winExe'],
  }),

  canLaunchBuild: (exportState: ExportState) => !!exportState.targets.length,

  renderHeader: props => <SetupExportHeader {...props} />,

  renderLaunchButtonLabel: () => <Trans>Package</Trans>,

  prepareExporter: (
    context: ExportPipelineContext<ExportState>
  ): Promise<PreparedExporter> => {
    return findGDJS().then(({ gdjsRoot }) => {
      console.info('GDJS found in ', gdjsRoot);

      const fileSystem = assignIn(
        new gd.AbstractFileSystemJS(),
        localFileSystem
      );
      const exporter = new gd.Exporter(fileSystem, gdjsRoot);
      const temporaryOutputDir = path.join(
        fileSystem.getTempDir(),
        'OnlineElectronExport'
      );
      fileSystem.mkDir(temporaryOutputDir);
      fileSystem.clearDir(temporaryOutputDir);

      return {
        exporter,
        temporaryOutputDir,
      };
    });
  },

  launchExport: (
    context: ExportPipelineContext<ExportState>,
    { exporter, temporaryOutputDir }: PreparedExporter
  ): Promise<ExportOutput> => {
    const exportOptions = new gd.MapStringBoolean();
    exportOptions.set('exportForElectron', true);
    exporter.exportWholePixiProject(
      context.project,
      temporaryOutputDir,
      exportOptions
    );
    exportOptions.delete();
    exporter.delete();

    return Promise.resolve({ temporaryOutputDir });
  },

  launchResourcesDownload: (
    context: ExportPipelineContext<ExportState>,
    { temporaryOutputDir }: ExportOutput
  ): Promise<ResourcesDownloadOutput> => {
    return Promise.resolve({ temporaryOutputDir });
  },

  launchCompression: (
    context: ExportPipelineContext<ExportState>,
    { temporaryOutputDir }: ResourcesDownloadOutput
  ): Promise<CompressionOutput> => {
    const archiveOutputDir = os.tmpdir();
    return archiveLocalFolder({
      path: temporaryOutputDir,
      outputFilename: path.join(archiveOutputDir, 'game-archive.zip'),
    });
  },

  launchUpload: (
    context: ExportPipelineContext<ExportState>,
    outputFile: CompressionOutput
  ): Promise<string> => {
    return getBuildFileUploadOptions().then(uploadOptions => {
      return uploadLocalFile(
        outputFile,
        uploadOptions,
        context.updateStepProgress
      ).then(() => uploadOptions.key);
    });
  },

  launchOnlineBuild: (
    exportState: ExportState,
    userProfile: UserProfile,
    uploadBucketKey: string
  ): Promise<Build> => {
    const { getAuthorizationHeader, profile } = userProfile;
    if (!profile) return Promise.reject(new Error('User is not authenticated'));

    return buildElectron(
      getAuthorizationHeader,
      profile.uid,
      uploadBucketKey,
      exportState.targets
    );
  },
};
