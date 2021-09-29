import * as React from "react";
import {
  StyleSheet,
  Button,
  TouchableOpacity,
  VirtualizedList,
} from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import Navigation from "../../navigation";
const Item = ({ c, selectedUser, setSelectedUser }) => {
  return (
    <TouchableOpacity
      onPress={() => (setSelectedUser ? setSelectedUser(c) : "")}
    >
      <View
        style={
          selectedUser && selectedUser.codigo === c.codigo
            ? styles.selectedBox
            : styles.boxes
        }
        key={c.codigo}
      >
        <Text style={styles.positionColumn}>{c.codigo}</Text>
        <Text style={styles.nameColumn}>{c.nombre}</Text>
        <Text style={styles.directionColumn}>{c.direccion}</Text>
      </View>
    </TouchableOpacity>
  );
};
const getItem = (data: any, i: any) => data[i];

export default function ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [clients, setClients] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState({});
  const user = useSelector((state: RootState) => state.user.data);
  async function getClients() {
    let res: any;
    setLoading(true);
    if (user)
      res = await axios.get(
        ApiUrl + "/company/allclients/" + user.distribuidoraId
      );
    setLoading(false);
    if (res.data.error) alert(res.data.error);
    else setClients(res.data);
  }
  React.useEffect(() => {
    getClients();
  }, []);
  console.log(route)
  return loading ? (
    <Loading title="Pedido Extra" />
  ) : !clients.length ? (
    <Text>No hay clientes en esta ruta.</Text>
  ) : (
    <View style={{ flex: 1 }}>
      <View
        style={{ ...styles.boxes, marginTop: actualDimensions.height * 0.2 }}
      >
        <Text style={styles.pColumn}>Codigo</Text>
        <Text style={styles.nColumn}>Nombre</Text>
        <Text style={styles.dColumn}>Dirección</Text>
      </View>
      <VirtualizedList
        data={clients}
        getItemCount={(data) => data.length}
        getItem={getItem}
        initialNumToRender={6}
        style={{ maxHeight: actualDimensions.height * 0.4 }}
        renderItem={({ item }) => (
          <Item
            c={item}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        )}
        contentContainerStyle={styles.container}
        keyExtractor={(item, i) => i.toString()}
      ></VirtualizedList>
      <Button
        title="añadir pedido"
        onPress={() => {
          selectedUser
          ?  navigation.navigate("TakeOrder", {
            selectedUser,
            route: route.params.route,
          })
          : alert("Seleccione un cliente.")
        }}
      ></Button>

      <View style={styles.goback}>
        <Button onPress={() => navigation.goBack()} title="atras"></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: actualDimensions.width * 0.002,
  },
  positionColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign: "center",
    borderBottomColor: "black",
  },
  nameColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 4,
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign: "center",
    borderBottomColor: "black",
  },
  goback: {
    position: "absolute",
    top: actualDimensions.height * 0.05,
    left: actualDimensions.width * 0.02,
  },
  directionColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 5,
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  pColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 2,
    fontWeight: "bold",
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  nColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 4,
    fontWeight: "bold",
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  dColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 5,
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
    alignSelf: "center",
  },
  selectedBox: {
    borderColor: "black",
    width: actualDimensions.width * 0.9,
    height: actualDimensions.height * 0.065,
    display: "flex",
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
  },
});
