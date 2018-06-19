// @flow
import {type ResourceKind} from './ResourceSource.flow';
import ResourcesLoader from '../ResourcesLoader';

/**
 * These are the options passed to an external editor to edit one or more resources.
 */
export type ExternalEditorOpenOptions = {|
  project: gdProject,
  resourcesLoader: typeof ResourcesLoader,
  singleFrame: boolean, // If set to true, edition should be limited to a single frame
  resourceNames: Array<string>,
  onChangesSaved: (
    Array<{ path: string, name: string, originalIndex: ?number }>,name:string
  ) => void,
  extraOptions: {
    name: string,
    isLooping: boolean,
    fps: number,
  },
|};

export type ResourceExternalEditor = {
  name: string,
  displayName: string,
  kind: ResourceKind,
  edit: (ExternalEditorOpenOptions) => void,
};