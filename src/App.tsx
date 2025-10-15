import 'react-native-gesture-handler';

import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';

import ApplicationNavigator from '@/navigation/Application';
import { ThemeProvider } from '@/theme';
import '@/translations';
import { AuthProvider } from '@/services/auth/AuthProvider';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config';

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID,
});

focusManager.setEventListener(handleFocus => {
  const sub = AppState.addEventListener('change', state => {
    handleFocus(state === 'active');
  });
  return () => sub.remove();
});

onlineManager.setEventListener(setOnline => {
  const unSubscription = NetInfo.addEventListener(state => {
    setOnline(Boolean(state.isConnected));
  });
  return () => unSubscription();
});

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

export const storage = new MMKV();

function App() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <AuthProvider>
            <ApplicationNavigator />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
