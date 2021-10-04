import * as React from "react";
import { Button, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addOrders, getOrders } from "../../store/actions/orders";
import { RootState } from "../../store/reducers";

const Item = ({ c }) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.boxes} key={c.id_contenido_pedido}>
        <Text style={styles.productColumn}>{c.Producto_nombre}</Text>
        <Text style={styles.cantidadColumn}>{c.cantidad}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const orders = useSelector((state: RootState) => state.orders.all);
  const [loading, setLoading] = React.useState(false);
  const [ods, setOds] = React.useState([]);
  React.useEffect(() => {
    dispatch(getOrders(user.distribuidoraId, route.params.route, setLoading));
    return () => dispatch(addOrders([]));
  }, []);
  if (!ods.length && orders.length) {
    let arr = [];
    orders.forEach((o: any) => {
      if (o.productos)
        o.productos.forEach((product) => {
          let items = arr.filter(
            (i) => i.Producto_nombre !== product.Producto_nombre
          );
          if (items.length !== arr.length) {
            let item = arr.filter(
              (i) => i.Producto_nombre === product.Producto_nombre
            )[0];
            item.cantidad = product.cantidad + item.cantidad;
            arr = [...items, item];
          } else {
            arr = [...items, product];
          }
        });
    });
    setOds(arr);
  }
  return loading ? (
    <Loading title="Resumen de productos" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de productos</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.boxes}>
        <Text style={styles.pColumn}>Producto</Text>
        <Text style={styles.cColumn}>Cantidad</Text>
      </View>
      <FlatList
        data={ods}
        style={{ maxHeight: actualDimensions.height * 0.5 }}
        renderItem={({ item }) => <Item c={item} />}
        contentContainerStyle={styles.flatContainer}
        keyExtractor={(item) => item.id_contenido_pedido}
      ></FlatList>
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
    alignSelf: "center",
    width: actualDimensions.width * 1,
  },
  title: {
    fontSize: actualDimensions.height * 0.035,
    fontWeight: "bold",
    marginBottom: actualDimensions.height * 0.02,
    marginTop: actualDimensions.height * 0.2,
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
  flatContainer: {
    borderWidth: actualDimensions.width * 0.002,
  },
  productColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 1,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign: "center",
    borderBottomColor: "black",
  },
  cantidadColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 1,
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign: "center",
    borderBottomColor: "black",
  },
  pColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 1,
    fontWeight: "bold",
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  cColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 1,
    fontWeight: "bold",
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  boxes: {
    borderColor: "black",
    width: actualDimensions.width * 0.9,
    height: actualDimensions.height * 0.059,
    display: "flex",
    flexDirection: "row",
  },
  selectedBox: {
    borderColor: "black",
    width: actualDimensions.width * 0.9,
    height: actualDimensions.height * 0.065,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
  },
});
