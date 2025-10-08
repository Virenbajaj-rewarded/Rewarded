import Bugsnag from "@bugsnag/react-native";
Bugsnag.start();

import { AppRegistry } from "react-native";

import { name as appName } from "./app.json";
import App from "./src/App";
import { PaperProvider } from "react-native-paper";

//FIXME Migrate to v22
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
