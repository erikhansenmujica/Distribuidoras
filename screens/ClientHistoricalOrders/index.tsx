import * as React from "react";
import {
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { getClientHistorical } from "../../store/actions/clients";

const ProductsItem = ({ c }) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.boxes} key={c.id_contenido_pedido}>
        <Text style={styles.productColumn}>{c.Producto_nombre}</Text>
        <Text style={styles.cantidadColumn}>{c.cantidad}</Text>
      </View>
    </TouchableOpacity>
  );
};
const Mod = ({ modalVisible, setModalVisible, products, setSelectedOrder }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.boxes}>
            <Text style={styles.pColumn}>Producto</Text>
            <Text style={styles.cColumn}>Cantidad</Text>
          </View>
          <FlatList
            data={products}
            style={{ maxHeight: actualDimensions.height * 0.5 }}
            renderItem={({ item }) => <ProductsItem c={item} />}
            contentContainerStyle={styles.flatContainer}
            keyExtractor={(item) => item.id_contenido_pedido}
          ></FlatList>
          <Button
            title="CERRAR"
            onPress={() => {
              setModalVisible(false);
              setSelectedOrder({ productos: [] });
            }}
          ></Button>
        </View>
      </View>
    </Modal>
  );
};
const Item = ({ c, setSelectedOrder, setModalVisible }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedOrder(c);
        setModalVisible(true);
      }}
    >
      <View style={styles.boxes} key={c.id}>
        <Text style={styles.productColumn}>{c.id}</Text>
        <Text style={styles.cantidadColumn}>{c.productos&&c.productos.length}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ({ navigation, route }) {
  const user = useSelector((state: RootState) => state.user.data);
  const [loading, setLoading] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState({ productos: [] });
  const [orders, setOrders] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  React.useEffect(() => {
    async function getOds() {
      getClientHistorical(
        { company: user.distribuidoraId, client: route.params.client.codigo },
        setLoading,
        setOrders
      );
    }
    getOds();
  }, []);
  return loading ? (
    <Loading title="Pedidos históricos" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pedidos históricos de {route.params.client.nombre}
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.boxes}>
        <Text style={styles.pColumn}>Pedido</Text>
        <Text style={styles.cColumn}>Productos</Text>
      </View>
      {orders.length?<FlatList
        data={orders}
        style={{ maxHeight: actualDimensions.height * 0.5 }}
        renderItem={({ item }) => (
          <Item
            c={item}
            setSelectedOrder={setSelectedOrder}
            setModalVisible={setModalVisible}
          />
        )}
        contentContainerStyle={styles.flatContainer}
        keyExtractor={(item, i) => JSON.stringify(i)}
      ></FlatList>:<View></View>}
      <Mod
        setSelectedOrder={setSelectedOrder}
        products={selectedOrder.productos}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
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
    alignSelf: "center",
  },
  title: {
    fontSize: actualDimensions.height * 0.035,
    fontWeight: "bold",
    marginBottom: actualDimensions.height * 0.02,
    marginTop: actualDimensions.height * 0.2,
    textAlign: "center",
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
  modalView: {
    borderRadius: 20,
    padding: actualDimensions.width * 0.055,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
