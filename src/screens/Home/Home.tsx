import type { RootScreenProps } from '@/navigation/types';

import React from 'react';
import { Text, View } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';
import PrimaryButton from '@/components/auth/PrimaryButton';

function Home({ navigation }: RootScreenProps<Paths.Home>) {
  const { layout, gutters, fonts, colors } = useTheme();

  const onLogout = () => {
    // For now, just reset back to Login
    navigation.reset({ index: 0, routes: [{ name: Paths.Login }] });
  };

  return (
    <SafeScreen>
      <View style={[layout.flex_1, layout.itemsCenter, layout.justifyCenter, gutters.padding_16]}>
        <Text style={[fonts.size_24, { color: colors.gray800 }, gutters.marginBottom_16]}>Home</Text>
        <PrimaryButton label="Log out" onPress={onLogout} />
      </View>
    </SafeScreen>
  );
}

export default Home;
