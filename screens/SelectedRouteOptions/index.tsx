import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import { RootState } from "../../store/reducers";
import ClientsPerRoute from "../RouteSelectionComponents/ClientsPerRoute";

export default function ({ route, navigation }) {
  const user= useSelector((state: RootState)=>state.user.data)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruta {route.params.routeSelected}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.heightContainer}>
        <ClientsPerRoute routeSelected={route.params.routeSelected} user={user}/>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => ""}>
          <Text style={styles.text}> Pedido extra</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => ""}>
          <Text style={styles.text}> Tomar pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => ""}>
          <Text style={styles.text}> Cambio de ruta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => ""}>
          <Text style={styles.text}> Nueva cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => ""}>
          <Text style={styles.text}> Resumen de pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => ""}>
          <Text style={styles.text}> Total productos</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cerrarPedidos} onPress={() => ""}>
        <Text style={styles.text}> Cerrar pedidos</Text>
      </TouchableOpacity>
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
    fontSize: actualDimensions.height * 0.035,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: actualDimensions.height * 0.03,
    height: actualDimensions.height * 0.003,
    width: actualDimensions.width * 0.8,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
  button: {
    height: actualDimensions.height * 0.08,
    width: actualDimensions.width * 0.3,
    backgroundColor: "#2196F3",
    marginBottom: actualDimensions.height * 0.01,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    color: "white",
  },
  heightContainer: {
    height: actualDimensions.height * 0.4,
    marginBottom: actualDimensions.height * 0.05,
  },
  cerrarPedidos: {
    height: actualDimensions.height * 0.08,
    width: actualDimensions.width * 0.5,
    backgroundColor: "#2196F3",
    marginTop: actualDimensions.height * 0.05,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: "flex",
    justifyContent: "center",
  },
});
