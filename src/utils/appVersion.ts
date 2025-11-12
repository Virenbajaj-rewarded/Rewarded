import { Platform, NativeModules } from 'react-native';
import Config from 'react-native-config';

const packageJson = require('../../package.json');

interface AppVersionInfo {
  appVersion: string;
  buildNumber: string;
  envType: string;
}

export const getAppVersionInfo = (): AppVersionInfo => {
  const appVersion = packageJson.version || '0.0.1';

  let buildNumber = 'N/A';

  if (Platform.OS === 'android') {
    // For Android, get versionCode from BuildConfig
    try {
      const BuildConfig = NativeModules.BuildConfig;
      buildNumber = BuildConfig?.VERSION_CODE?.toString() || '16';
    } catch (error) {
      buildNumber = '16';
    }
  } else if (Platform.OS === 'ios') {
    // For iOS, we'll use the CURRENT_PROJECT_VERSION
    // This needs to be set in Info.plist or via native module
    buildNumber = '14';
  }

  const envType = Config.NODE_ENV || 'development';

  return {
    appVersion,
    buildNumber,
    envType,
  };
};

export const getVersionString = (): string => {
  const { appVersion, buildNumber, envType } = getAppVersionInfo();
  return `v${appVersion} (${buildNumber}) - ${envType}`;
};
