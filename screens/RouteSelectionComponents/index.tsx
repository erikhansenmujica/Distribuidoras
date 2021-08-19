import * as React from "react";
import { Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import { RootState } from "../../store/reducers";
import ClientsPerRoute from "./ClientsPerRoute";
import DeliveryRoutes from "./DeliveryRoutes";
export default function ({navigation}) {
  const user = useSelector((state: RootState) => state.user.data);
  const [routeSelected, setRouteSelected] = React.useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selección de ruta</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <DeliveryRoutes routeSelected={routeSelected} setRouteSelected={setRouteSelected} user={user}/>
      {routeSelected!==0?<View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />:<Text></Text>}
      {routeSelected!==0?<View style={styles.heightContainer}><ClientsPerRoute user={user} routeSelected={routeSelected}/></View>:<Text></Text>}
      {routeSelected!==0?<View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />:<Text></Text>}
      {routeSelected!==0?<Button  onPress={()=>navigation.navigate("selectedRouteOptions",{routeSelected})}title={"Continuar ruta: "+routeSelected} />:<Text></Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: actualDimensions.height*0.035,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: actualDimensions.height*0.03,
    height: actualDimensions.height*0.003,
    width: actualDimensions.width*0.8,
  },
  heightContainer: {
    height: actualDimensions.height * 0.25,
  },
});
