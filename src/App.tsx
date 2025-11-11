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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Config from 'react-native-config';
import { useUser } from '@/services/user/useUser';
import { useState, useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import Bugsnag from '@bugsnag/react-native';
import { Toast, toastConfig } from '@/components';

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

function AppContent() {
  const { useFetchProfileQuery } = useUser();

  const { data: profile } = useFetchProfileQuery();
  const [bootSplashHidden, setBootSplashHidden] = useState(false);

  useEffect(() => {
    if (!bootSplashHidden) {
      const timer = setTimeout(() => {
        BootSplash.hide({ fade: true }).then(() => {
          setBootSplashHidden(true);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [bootSplashHidden]);

  useEffect(() => {
    if (profile) {
      Bugsnag.setUser(profile.id, profile.email);
    }
  }, [profile]);

  return <ApplicationNavigator />;
}

function App() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <AppContent />
          <Toast config={toastConfig} />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
