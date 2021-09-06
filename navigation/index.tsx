/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import JWT from "expo-jwt";
import * as React from "react";
import { ColorSchemeName, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import ApiUrl from "../constants/ApiUrl";
import Login from "../screens/Login";
import NotFoundScreen from "../screens/NotFoundScreen";
import Register from "../screens/Register";
import RouteSelection from "../screens/RouteSelectionComponents";
import SelectedRouteOptions from "../screens/SelectedRouteOptions";
import { getUserSavedToken } from "../store/actions/user";
import { RootState } from "../store/reducers";
import * as Application from "expo-application";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import NewClient from "../screens/NewClient";
import OrderList from "../screens/OrderList";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const user = useSelector((state: RootState) => state.user.data);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const deviceId = Application.androidId;

  React.useEffect(() => {
    dispatch(getUserSavedToken(deviceId, setLoading))
  }, []);

  return loading ? (
    <Loading title="" />
  ) : (
    <Stack.Navigator
      initialRouteName={user ? "Root" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Root" component={RouteSelection} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OrderList" component={OrderList} />

      <Stack.Screen name="NewClient" component={NewClient} />
      <Stack.Screen
        name="selectedRouteOptions"
        component={SelectedRouteOptions}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
