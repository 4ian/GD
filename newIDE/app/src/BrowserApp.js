// @flow
import * as React from 'react';
import MainFrame from './MainFrame';
import Window from './Utils/Window';
import ExportDialog from './Export/ExportDialog';
import CreateProjectDialog from './ProjectCreation/CreateProjectDialog';
import Authentification from './Utils/GDevelopServices/Authentification';
import './UI/iconmoon-font.css'; // Styles for Iconmoon font.

// Import for browser only IDE
import BrowserExamples from './ProjectCreation/BrowserExamples';
import BrowserStarters from './ProjectCreation/BrowserStarters';
import BrowserIntroDialog from './MainFrame/BrowserIntroDialog';
import browserResourceSources from './ResourcesList/BrowserResourceSources';
import browserResourceExternalEditors from './ResourcesList/BrowserResourceExternalEditors';
import BrowserS3PreviewLauncher from './Export/BrowserExporters/BrowserS3PreviewLauncher';
import { getBrowserExporters } from './Export/BrowserExporters';
import makeExtensionsLoader from './JsExtensionsLoader/BrowserJsExtensionsLoader';
import ObjectsEditorService from './ObjectEditor/ObjectsEditorService';
import ObjectsRenderingService from './ObjectsRendering/ObjectsRenderingService';
import { makeBrowserS3EventsFunctionCodeWriter } from './EventsFunctionsExtensionsLoader/CodeWriters/BrowserS3EventsFunctionCodeWriter';
import Providers from './MainFrame/Providers';
import ProjectStorageProviders from './ProjectsStorage/ProjectStorageProviders';
import InternalFileStorageProvider from './ProjectsStorage/InternalFileStorageProvider';
import GoogleDriveStorageProvider from './ProjectsStorage/GoogleDriveStorageProvider';
import DownloadFileStorageProvider from './ProjectsStorage/DownloadFileStorageProvider';
import DropboxStorageProvider from './ProjectsStorage/DropboxStorageProvider';
import OneDriveStorageProvider from './ProjectsStorage/OneDriveStorageProvider';

export const create = (authentification: Authentification) => {
  Window.setUpContextMenu();

  let app = null;
  const appArguments = Window.getArguments();

  app = (
    <Providers
      authentification={authentification}
      disableCheckForUpdates={!!appArguments['disable-update-check']}
      eventsFunctionCodeWriter={makeBrowserS3EventsFunctionCodeWriter()}
      eventsFunctionsExtensionWriter={null}
      eventsFunctionsExtensionOpener={null}
    >
      {({ i18n, eventsFunctionsExtensionsState }) => (
        <ProjectStorageProviders
          appArguments={appArguments}
          storageProviders={
            Window.isDev()
              ? [
                  InternalFileStorageProvider,
                  GoogleDriveStorageProvider,
                  DropboxStorageProvider,
                  OneDriveStorageProvider,
                  DownloadFileStorageProvider,
                ]
              : [
                  // TODO: Enable Google Drive once app is validated.
                  InternalFileStorageProvider,
                  DownloadFileStorageProvider,
                ]
          }
          defaultStorageProvider={InternalFileStorageProvider}
        >
          {({
            currentStorageProviderOperations,
            useStorageProvider,
            storageProviders,
            initialFileMetadataToOpen,
          }) => (
            <MainFrame
              i18n={i18n}
              eventsFunctionsExtensionsState={eventsFunctionsExtensionsState}
              renderPreviewLauncher={(props, ref) => <BrowserS3PreviewLauncher {...props} ref={ref} />}
              renderExportDialog={props => (
                <ExportDialog {...props} exporters={getBrowserExporters()} />
              )}
              renderCreateDialog={props => (
                <CreateProjectDialog
                  {...props}
                  examplesComponent={BrowserExamples}
                  startersComponent={BrowserStarters}
                />
              )}
              introDialog={<BrowserIntroDialog />}
              storageProviders={storageProviders}
              useStorageProvider={useStorageProvider}
              storageProviderOperations={currentStorageProviderOperations}
              resourceSources={browserResourceSources}
              resourceExternalEditors={browserResourceExternalEditors}
              authentification={authentification}
              extensionsLoader={makeExtensionsLoader({
                objectsEditorService: ObjectsEditorService,
                objectsRenderingService: ObjectsRenderingService,
                filterExamples: !Window.isDev(),
              })}
              initialFileMetadataToOpen={initialFileMetadataToOpen}
            />
          )}
        </ProjectStorageProviders>
      )}
    </Providers>
  );

  return app;
};
