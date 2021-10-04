import * as React from "react";
import {
  Button,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import { addUser } from "../../store/actions/user";
import { RootState } from "../../store/reducers";
import { removeToken } from "../../token";
import ClientsPerRoute from "./ClientsPerRoute";
import DeliveryRoutes from "./DeliveryRoutes";
import getData from "./getData";

export default function ({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const [cubes, setCubes] = React.useState(0);
  const [message, setMessage] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(
    false
  );
  const [routeSelected, setRouteSelected] = React.useState(0);
  React.useEffect(() => {
    if (user&&user.device&&!user.device.ultimo_movimiento_cta_cte) {
      setModalVisible(true)
      getData(user.distribuidoraId, setCubes, setMessage, setModalVisible, user.device.deviceId, dispatch, user);
    }
  },[user]);
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Sincronizando bases de datos, espere por favor...
          </Text>
          <View style={styles.progressBar20}>
            <View
              style={{
                ...(cubes === 6 && styles.cubeRight),
                ...styles.cubeLeft,
                flex: cubes,
                backgroundColor: "black",
              }}
            />
            <View
              style={{
                ...(cubes === 0 && styles.cubeLeft),
                ...styles.cubeRight,
                flex: 6 - cubes,
              }}
            />
          </View>
          {/* <Button
              onPress={() => setModalVisible(!modalVisible)}
              title="OK!"
            >
            </Button> */}
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{message}</Text>
            <ActivityIndicator
              color="black"
            />
          </View>
        </View>
      </Modal>
      {routeSelected === 0 && (
        <Text style={styles.title}>Selección de ruta</Text>
      )}
      {routeSelected === 0 && (
        <View style={styles.logOutButton}>
          <Button
            onPress={async () => {
              await removeToken();
              dispatch(addUser(null));
              navigation.navigate("Login");
            }}
            title="Cerrar sesión"
          />
        </View>
      )}
      {routeSelected !== 0 && (
        <View style={styles.container2}>
          <Text style={styles.title}>Selección de ruta</Text>
          <Button
            onPress={async () => {
              await removeToken();
              dispatch(addUser(null));
              navigation.navigate("Login");
            }}
            title="Cerrar sesión"
          />
        </View>
      )}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {!modalVisible && (
        <DeliveryRoutes
          routeSelected={routeSelected}
          setRouteSelected={setRouteSelected}
          user={user}
        />
      )}
      {routeSelected !== 0 ? (
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      ) : (
        <Text></Text>
      )}
      {routeSelected !== 0 ? (
        <View style={styles.heightContainer}>
          <ClientsPerRoute user={user} routeSelected={routeSelected} selectedUser={null} setSelectedUser={null}/>
        </View>
      ) : (
        <Text></Text>
      )}
      {routeSelected !== 0 ? (
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      ) : (
        <Text></Text>
      )}
      {routeSelected !== 0 ? (
        <Button
          onPress={() =>
            navigation.navigate("selectedRouteOptions", { routeSelected })
          }
          title={"Continuar ruta: " + routeSelected}
        />
      ) : (
        <Text></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    display: "flex",
    flexDirection: "row",
    width: actualDimensions.width,
    justifyContent: "space-around",
  },
  messageContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    alignContent:"center",
    marginTop:actualDimensions.height*0.01
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
  heightContainer: {
    height: actualDimensions.height * 0.25,
  },
  logOutButton: {
    position: "absolute",
    top: actualDimensions.height * 0.06,
    right: actualDimensions.width * 0.03,
  },
  modalView: {
    margin: actualDimensions.width * 0.1,
    backgroundColor: "white",
    borderRadius: actualDimensions.width * 0.1,
    padding: actualDimensions.width * 0.2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: actualDimensions.height * 0.2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: actualDimensions.height * 0.03,
    textAlign: "center",
  },
  progressBar20: {
    borderRadius: actualDimensions.width * 0.1,
    borderColor: "black",
    borderWidth: actualDimensions.height * 0.002,
    width: actualDimensions.width * 0.6,
    height: actualDimensions.height * 0.05,
    display: "flex",
    flexDirection: "row",
  },
  cubeLeft: {
    borderTopLeftRadius: actualDimensions.width * 0.1,
    borderBottomLeftRadius: actualDimensions.width * 0.1,
  },
  cubeRight: {
    borderTopRightRadius: actualDimensions.width * 0.1,
    borderBottomRightRadius: actualDimensions.width * 0.1,
  },
  message: {
    textAlign: "center",
  },
});
