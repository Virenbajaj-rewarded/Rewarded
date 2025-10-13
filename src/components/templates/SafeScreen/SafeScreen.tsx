import React, { PropsWithChildren } from 'react';
import type { SafeAreaViewProps } from 'react-native-safe-area-context';

import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';
import DefaultError from '@/components/molecules/DefaultError';
import Bugsnag from '@bugsnag/react-native';
import { styles } from './SafeScreen.styles';

type Properties = PropsWithChildren<
  {
    readonly isError?: boolean;
    readonly onResetError?: () => void;
  } & Omit<SafeAreaViewProps, 'mode'>
>;

function SafeScreen({
  children = undefined,
  isError = false,
  onResetError = undefined,
  style,
  ...props
}: Properties) {
  const { navigationTheme } = useTheme();

  const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

  return (
    <SafeAreaView {...props} mode="padding" style={[styles.container, style]}>
      <StatusBar
        backgroundColor={navigationTheme.colors.background}
        //FIXME
        //barStyle={variant === "dark" ? "light-content" : "dark-content"}
        barStyle={'light-content'}
      />
      <ErrorBoundary FallbackComponent={DefaultError}>{children}</ErrorBoundary>
    </SafeAreaView>
  );
}

export default SafeScreen;
