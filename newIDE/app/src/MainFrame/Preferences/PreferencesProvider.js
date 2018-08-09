// @flow

import * as React from 'react';
import PreferencesContext, {
  initialPreferences,
  type Preferences,
  type PreferencesValues,
} from './PreferencesContext';
import optionalRequire from '../../Utils/OptionalRequire';
const electron = optionalRequire('electron');
const ipcRenderer = electron ? electron.ipcRenderer : null;

type Props = {|
  children: React.Node,
|};

type State = Preferences;

const LocalStorageItem = 'gd-preferences';

export default class PreferencesProvider extends React.Component<Props, State> {
  state = {
    values: this._loadValuesFromLocalStorage() || initialPreferences.values,
    setThemeName: this._setThemeName.bind(this),
    setAutoDownloadUpdates: this._setAutoDownloadUpdates.bind(this),
    checkUpdates: this._checkUpdates.bind(this),
  };

  componentDidMount() {
    this._checkUpdates();
  }

  _setThemeName(themeName: string) {
    this.setState(
      state => ({
        values: {
          ...state.values,
          themeName,
        },
      }),
      () => this._persistValuesToLocalStorage(this.state)
    );
  }

  _setAutoDownloadUpdates(autoDownloadUpdates: boolean) {
    this.setState(
      state => ({
        values: {
          ...state.values,
          autoDownloadUpdates,
        },
      }),
      () => this._persistValuesToLocalStorage(this.state)
    );
  }

  _checkUpdates(forceDownload?: boolean) {
    // Checking for updates is only done on Electron.
    // Note: This could be abstracted away later if other updates mechanisms
    // should be supported.
    if (!ipcRenderer) return;

    if (!!forceDownload || this.state.values.autoDownloadUpdates) {
      ipcRenderer.send('updates-check-and-download');
    } else {
      ipcRenderer.send('updates-check');
    }
  }

  _loadValuesFromLocalStorage(): ?PreferencesValues {
    try {
      const persistedState = localStorage.getItem(LocalStorageItem);
      if (!persistedState) return null;

      const values = JSON.parse(persistedState);

      // "Migrate" non existing properties to their default values
      // (useful when upgrading the preferences to a new version where
      // a new preference was added).
      for (const key in initialPreferences.values) {
        if (
          initialPreferences.values.hasOwnProperty(key) &&
          typeof values[key] === 'undefined'
        ) {
          values[key] = initialPreferences.values[key];
        }
      }

      return values;
    } catch (e) {
      return null;
    }
  }

  _persistValuesToLocalStorage(preferences: Preferences) {
    try {
      localStorage.setItem(
        LocalStorageItem,
        JSON.stringify(preferences.values)
      );
    } catch (e) {
      console.warn('Unable to persist preferences', e);
    }

    return preferences;
  }

  render() {
    return (
      <PreferencesContext.Provider value={this.state}>
        {this.props.children}
      </PreferencesContext.Provider>
    );
  }
}
