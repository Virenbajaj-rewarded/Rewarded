import type { Paths } from '@/navigation/paths';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = NativeStackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Home]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Login]: undefined;
  [Paths.SignUp]: undefined;
};
