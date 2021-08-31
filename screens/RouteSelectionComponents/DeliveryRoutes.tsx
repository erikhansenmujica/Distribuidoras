import axios from "axios";
import * as React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Loading from "../../components/Loading";
import { Text, View } from "../../components/Themed";
import ApiUrl from "../../constants/ApiUrl";
import actualDimensions from "../../dimensions";

export default function ({
  routeSelected,
  setRouteSelected,
  user,
}: {
  routeSelected: number;
  setRouteSelected: any;
  user: any;
}) {
  const [loading, setLoading] = React.useState(false);
  const [routes, setRoutes] = React.useState([]);
  async function getRoutes() {
    setLoading(true);

    const res = await axios.get(
      ApiUrl + "/company/routes/" + user.distribuidoraId
    );
    if (res.data.error) alert(res.data.error);
    else setRoutes(res.data);
    setLoading(false);
  }
  React.useEffect(() => {
    if (user) getRoutes();
  }, [user]);
  return loading ? (
    <View style={styles.heightContainer}>
      <Loading title="Buscando rutas..." />
    </View>
  ) : !routes.length ? (
    <Text>No hay rutas disponibles.</Text>
  ) : (
    <View style={styles.heightContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {routes.map((route) => (
          <TouchableOpacity
            onPress={() => setRouteSelected(route.codigo_ruta)}
            key={route.codigo_ruta}
          >
            <View
              style={
                route.codigo_ruta === routeSelected
                  ? styles.selectedBox
                  : styles.boxes
              }
            >
              <Text
                style={
                  route.codigo_ruta === routeSelected
                    ? styles.selectedBoxText
                    : styles.boxesText
                }
              >
                {route.codigo_ruta}
              </Text>
              <Text
                style={
                  route.codigo_ruta === routeSelected
                    ? styles.selectedBoxText
                    : styles.boxesText
                }
              >
                {route.nombre}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    overflow: "scroll",
    flexWrap: "wrap",
  },
  boxesText: {
    fontSize: actualDimensions.height * 0.023,
  },
  selectedBoxText: {
    fontSize: actualDimensions.height * 0.026,
  },
  boxes: {
    borderColor: "black",
    borderWidth: actualDimensions.width * 0.002,
    marginBottom: actualDimensions.height * 0.03,
    width: actualDimensions.width * 0.3,
    height: actualDimensions.height * 0.15,
    display: "flex",
    alignItems: "center",
  },
  heightContainer: {
    height: actualDimensions.height * 0.33,
  },
  selectedBox: {
    borderColor: "black",
    borderWidth: actualDimensions.width * 0.004,
    marginBottom: actualDimensions.height * 0.03,
    width: actualDimensions.width * 0.3,
    height: actualDimensions.height * 0.15,
    display: "flex",
    alignItems: "center",
  },
});
