declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL?: string;
    WEB_CLIENT_ID?: string;
    NODE_ENV?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
