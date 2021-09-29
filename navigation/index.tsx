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
import * as React from "react";
import { ColorSchemeName } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
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
import OrdersList from "../screens/OrdersList";
import ProductsList from "../screens/ProductsList";
import TakeOrder from "../screens/TakeOrder";
import Payment from "../screens/Payment";
import ClientHistoricalOrders from "../screens/ClientHistoricalOrders";
import ExtraOrder from "../screens/ExtraOrder";

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
      <Stack.Screen name="OrdersList" component={OrdersList} />
      <Stack.Screen name="TakeOrder" component={TakeOrder} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="NewClient" component={NewClient} />
      <Stack.Screen name="ProductsList" component={ProductsList} />
      <Stack.Screen name="ClientHistorical" component={ClientHistoricalOrders} />
      <Stack.Screen name="ExtraOrder" component={ExtraOrder} />

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
