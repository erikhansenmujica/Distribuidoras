import * as React from "react";
import { Button, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addOrders, getOrders } from "../../store/actions/orders";
import { RootState } from "../../store/reducers";

export default function ({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const orders = useSelector((state: RootState) => state.orders.all);
  const [loading, setLoading] = React.useState(false);
  const [info, setInfo] = React.useState({
    totalPedidos: 0,
    totalProductos: 0,
    importeTotal: 0,
  });
  React.useEffect(() => {
    dispatch(getOrders(user.distribuidoraId, route.params.route, setLoading));
    return () => dispatch(addOrders([]));
  }, []);
  if (orders.length && !info.totalPedidos) {
    const ordersObj = {};
    let importe = 0;
    let cantidad = 0;
    orders.forEach((order) => {
      if (!ordersObj[order.id]) ordersObj[order.id] = { total: 0 };
      order.productos &&
        order.productos.forEach((prod) => {
          importe += parseFloat(prod.precio) * parseFloat(prod.cantidad);
          cantidad += prod.cantidad;
        });
    });
    setInfo({
      totalPedidos: Object.keys(ordersObj).length,
      totalProductos: cantidad,
      importeTotal: Math.round((importe + Number.EPSILON) * 100) / 100,
    });
  }

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
      <Text>Total pedidos: {info.totalPedidos}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Total de productos: {info.totalProductos}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Importe total: {info.importeTotal}</Text>
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
