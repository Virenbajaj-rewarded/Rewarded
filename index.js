import { AppRegistry } from "react-native";

import { name as appName } from "./app.json";
import App from "./src/App";
import { PaperProvider } from "react-native-paper";

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
