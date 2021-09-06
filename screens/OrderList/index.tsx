import * as React from "react";
import { Button, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import Loading from "../../components/Loading";

export default function ({ navigation }) {
  const [loading, setLoading] = React.useState(false);

  return loading ? (
    <Loading title="Resumen de pedidos" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de pedidos</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Total pedidos:</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Total de productos:</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Importe total:</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.goback}>
        <Button
          onPress={() => navigation.goBack()}
          title="CERRAR RESUMEN"
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  title: {
    fontSize: actualDimensions.height * 0.035,
    fontWeight: "bold",
    marginBottom: actualDimensions.height * 0.02,
  },
  separator: {
    marginVertical: actualDimensions.height * 0.02,
    height: actualDimensions.height * 0.003,
    width: actualDimensions.width * 0.8,
  },
  button: {
    marginTop: actualDimensions.height * 0.02,
  },
  goback: {
    position: "absolute",
    top: actualDimensions.height * 0.07,
    left: actualDimensions.width * 0.02,
  },
});
