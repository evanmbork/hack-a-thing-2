import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./src/screens/HomeScreen";
import CaptureScreen from "./src/screens/CaptureScreen";
import EditorScreen from "./src/screens/EditorScreen";
import ResultScreen from "./src/screens/ResultScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Journal Grammar" }} />
        <Stack.Screen name="Capture" component={CaptureScreen} options={{ title: "Photo" }} />
        <Stack.Screen name="Editor" component={EditorScreen} options={{ title: "Write / Paste" }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: "Feedback" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
