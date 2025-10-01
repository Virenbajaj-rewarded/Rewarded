// FIXME: https://github.com/import-js/eslint-plugin-import/issues/3169
import type { RootStackParamList } from "@/navigation/types.ts";

declare module "eslint-plugin-import" {
  import type { Linter } from "eslint";

  export const flatConfigs: {
    [key: string]: Linter.Config | undefined;
    recommended: Linter.Config;
    typescript: Linter.Config;
  };
}

// TypeScript shim for React Navigation native-stack in case types are not resolved during type-check
declare module "@react-navigation/native-stack" {
  import type { ComponentType } from "react";
  import type {
    NavigatorScreenParams,
    ParamListBase,
  } from "@react-navigation/native";

  export type NativeStackScreenProps<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = keyof ParamList,
  > = {
    navigation: any;
    route: { key: string; name: RouteName; params: ParamList[RouteName] };
  };

  export function createNativeStackNavigator<
    ParamList extends ParamListBase,
  >(): {
    Navigator: ComponentType<any>;
    Screen: ComponentType<any>;
    Group: ComponentType<any>;
  };
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
