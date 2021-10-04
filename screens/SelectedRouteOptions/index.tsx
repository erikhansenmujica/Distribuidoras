import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import {
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { Button, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import {
  closeOrders,
  getOrders,
  updateOrder,
} from "../../store/actions/orders";
import { fetchRoutes } from "../../store/actions/routes";
import { RootState } from "../../store/reducers";
import ClientsPerRoute from "../RouteSelectionComponents/ClientsPerRoute";

const Mod = ({ modalVisible, setModalVisible, selectedUser, user, route }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const orders = useSelector((state: RootState) => state.orders.all);
  const routes = useSelector((state: RootState) => state.routes.all);
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  React.useEffect(() => {
    dispatch(getOrders(user.distribuidoraId, route, setLoading));
    if (!routes.length) {
      dispatch(fetchRoutes(user.distribuidoraId, setLoading));
    }
  }, []);
  const onSubmit = () => {
    dispatch(
      updateOrder(
        user.distribuidoraId,
        {
          routeId: route,
          clientId: selectedUser.codigo,
          newRouteId: selectedRoute,
        },
        setLoading,
        setModalVisible
      )
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Cambiar ruta de usuario: {selectedUser && selectedUser.nombre}
          </Text>
          {loading ? (
            <View style={{ maxHeight: actualDimensions.height * 0.2 }}>
              <Loading title="" />
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.item}>
                <Picker
                  selectedValue={selectedRoute}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedRoute(itemValue)
                  }
                  style={styles.dropdown}
                  mode="dropdown"
                  enabled={true}
                >
                  <Picker.Item label={""} value={""}></Picker.Item>

                  {routes.length &&
                    routes.map((c) => (
                      <Picker.Item
                        label={c.codigo_ruta + ": " + c.nombre}
                        value={c.codigo_ruta}
                        key={c.codigo_ruta}
                      ></Picker.Item>
                    ))}
                </Picker>
              </View>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={(e) => {
                  onSubmit();
                }}
              >
                <Text style={styles.textStyle}>Enviar</Text>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default function ({ route, navigation }) {
  const user = useSelector((state: RootState) => state.user.data);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  return loading ? (
    <Loading title="Sincronizando..." />
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Ruta {route.params.routeSelected}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.heightContainer}>
        <ClientsPerRoute
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          routeSelected={route.params.routeSelected}
          user={user}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("ExtraOrder", {
              route: route.params.routeSelected,
            })
          }
        >
          <Text style={styles.text}> Pedido extra</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            selectedUser
              ? navigation.navigate("TakeOrder", {
                  selectedUser,
                  route: route.params.routeSelected,
                })
              : alert("Seleccione un cliente.")
          }
        >
          <Text style={styles.text}> Tomar pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            selectedUser
              ? setModalVisible(!modalVisible)
              : alert("Seleccione un cliente.")
          }
        >
          <Mod
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            selectedUser={selectedUser}
            user={user}
            route={route.params.routeSelected}
          />
          <Text style={styles.text}> Cambio de ruta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("NewClient")}
        >
          <Text style={styles.text}> Nueva cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("OrdersList", {
              route: route.params.routeSelected,
            })
          }
        >
          <Text style={styles.text}> Resumen de pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("ProductsList", {
              route: route.params.routeSelected,
            })
          }
        >
          <Text style={styles.text}> Total productos</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.cerrarPedidos}
        onPress={() =>
          closeOrders(setLoading, navigation, user.distribuidoraId)
        }
      >
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    marginBottom: actualDimensions.height * 0.04,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  dropdown: {
    width: actualDimensions.width * 0.4,
    height: actualDimensions.height * 0.052,
  },
  item: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "black",
  },
});
