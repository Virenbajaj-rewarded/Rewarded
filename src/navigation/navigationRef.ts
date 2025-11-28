import { createNavigationContainerRef } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import type { RootStackParamList } from './types';
import { Paths } from './paths';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function resetToChooseRole() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Paths.CHOOSE_ROLE }],
      })
    );
  }
}
