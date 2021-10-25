import moment from "moment";
import * as React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  TouchableHighlight,
} from "react-native";
import { Text } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import "moment/locale/es";
import DateTimePicker from "@react-native-community/datetimepicker";

import { TextInput } from "react-native-gesture-handler";
import { setNewPayment } from "../../store/actions/payments";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import Loading from "../../components/Loading";
const Mod = ({
  modalVisible,
  setModalVisible,
  selectedCheque,
  removeCheque,
}) => (
  <Modal animationType="slide" transparent={true} visible={modalVisible}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          Eliminar cheque: {selectedCheque && selectedCheque.numero}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
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
            onPress={() => {
              removeCheque();
            }}
          >
            <Text style={styles.textStyle}>Enviar</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  </Modal>
);
const Item = ({
  c,
  selectedCheque,
  setSelectedCheque,
  modalVisible,
  setModalVisible,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedCheque ? setSelectedCheque(c) : "";
        setModalVisible(!modalVisible);
      }}
    >
      <View
        style={
          selectedCheque.numero && selectedCheque.numero === c.numero
            ? styles.selectedBox
            : styles.boxes
        }
        key={c.numero}
      >
        <Text style={styles.numColumn}>{c.numero}</Text>
        <Text style={styles.impColumn}>{c.importe}</Text>
        <Text style={styles.banColumn}>{c.banco}</Text>
        <Text style={styles.fecColumn}>
          {
            c.fecha_cobro
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
              .split(" ")[0]
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ({ navigation, route }) => {
  const user = useSelector((state: RootState) => state.user.data);
  const [loading, setLoading] = React.useState(false);
  const [section, setSection] = React.useState({
    name: "efectivo",
    id: false,
    nextSection: "cheque",
  });
  const [efectivo, setEfectivo] = React.useState({ importe: "", detalle: "" });
  const [cheques, setCheques] = React.useState([]);
  const [cheque, setCheque] = React.useState({
    numero: "",
    importe: "",
    banco: "",
    fecha_cobro: new Date(),
  });
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedCheque, setSelectedCheque] = React.useState({ numero: null });
  const [show, setShow] = React.useState(false);
  const client = route.params.client;
  const date = moment().locale("es").format("LL");
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setCheque({ ...cheque, fecha_cobro: selectedDate });
  };
  const removeCheque = () => {
    let cheqs = cheques.filter((c) => c.numero !== selectedCheque.numero);
    setCheques(cheqs);
    setModalVisible(false);
  };
  const handleAddCheque = () => {
    if (cheque.importe && cheque.banco && cheque.numero) {
      if (cheques.length) {
        let cheqs = cheques.filter((c) => c.numero === cheque.numero);
        if (cheqs.length) {
          alert("Ya hay un cheque con ese numero.");
          return;
        }
        setCheques([...cheques, cheque]);
        setCheque({
          numero: "",
          importe: "",
          banco: "",
          fecha_cobro: new Date(),
        })
      } else {
        setCheques([...cheques, cheque]);
        setCheque({
          numero: "",
          importe: "",
          banco: "",
          fecha_cobro: new Date(),
        })
      }
    } else alert("Hay campos sin completar.");
  };
  const handleSubmit = () => {
    let fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    let hora = moment().format("HH:mm");
    if (section.name === "efectivo") {
      setNewPayment(
        {
          fecha,
          hora,
          cliente: client.codigo,
          usuario: user.id,
          ruta: route.params.route,
          importe: efectivo.importe,
          fecha_cobro_cheque: null,
          detalle: efectivo.detalle,
          company: user.distribuidoraId,
        },
        setLoading,
        setCheques,
        setEfectivo
      );
    } else {
      let finalCheques = cheques.map((c) => ({
        ...c,
        fecha,
        hora,
        cliente: client.codigo,
        usuario: user.id,
        ruta: route.params.route,
        detalle: "Cheque Nº "+ c.numero+" del banco: "+ c.banco,
        company: user.distribuidoraId,
        fecha_cobro: c.fecha_cobro.toISOString().slice(0, 19).replace("T", " ")
      }));
      setNewPayment(finalCheques, setLoading, setCheques, setEfectivo);
    }
  };
  return loading ? (
    <Loading title="" />
  ) : (
    <View style={styles.container}>
      {!section.id ? (
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>
            Ingresar pago en efectivo de {client.nombre}
          </Text>
          <Text>Fecha: {date}</Text>
          <Text>Nº de Cuenta: {client.codigo}</Text>
          <View style={styles.inputsContainer}>
            <View>
              <Text>Importe</Text>
              <TextInput
                style={styles.input}
                value={efectivo.importe}
                onChangeText={(x) => {
                  setEfectivo({
                    ...efectivo,
                    importe: x
                      ? x.includes(".")
                        ? x.replace(/\./g, "")
                        : x
                      : "",
                  });
                }}
                keyboardType="numeric"
              ></TextInput>
            </View>
            <View>
              <Text>Detalle</Text>
              <TextInput
                style={styles.input}
                value={efectivo.detalle}
                onChangeText={(e) => {
                  setEfectivo({ ...efectivo, detalle: e });
                }}
              ></TextInput>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            height: actualDimensions.height * 0.6,
            marginTop: actualDimensions.height * 0.1,
          }}
        >
          <Text style={styles.title}>
            Ingresar pago a traves de cheque de {client.nombre}
          </Text>
          <View style={styles.boxes}>
            <Text style={styles.numberColumn}>Nº</Text>
            <Text style={styles.importeColumn}>Importe</Text>
            <Text style={styles.bancoColumn}>Banco</Text>
            <Text style={styles.fechaColumn}>Fecha Cobro</Text>
          </View>
          <FlatList
            data={cheques}
            renderItem={({ item }) => (
              <Item
                c={item}
                selectedCheque={selectedCheque}
                setSelectedCheque={setSelectedCheque}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              />
            )}
            contentContainerStyle={styles.flatListContainer}
            keyExtractor={(_, i) => i.toString()}
          ></FlatList>

          <Text>Fecha: {date}</Text>
          <Text>Nº de Cuenta: {client.codigo}</Text>
          <View style={styles.boxes}>
            <View style={styles.numberColumnInputs}>
              <Text>Nº</Text>
              <TextInput
                style={styles.inputs}
                value={cheque.numero}
                onChangeText={(x) => {
                  setCheque({
                    ...cheque,
                    numero: x,
                  });
                }}
                keyboardType="numeric"
              ></TextInput>
            </View>
            <View style={styles.importeColumnInputs}>
              <Text>Importe</Text>
              <TextInput
                style={styles.inputs}
                value={cheque.importe}
                onChangeText={(x) => {
                  setCheque({
                    ...cheque,
                    importe: x
                      ? x.includes(".")
                        ? x.replace(/\./g, "")
                        : x
                      : "",
                  });
                }}
                keyboardType="numeric"
              ></TextInput>
            </View>
            <View style={styles.bancoColumnInputs}>
              <Text>Banco</Text>
              <TextInput
                style={styles.inputs}
                value={cheque.banco}
                onChangeText={(x) => {
                  setCheque({
                    ...cheque,
                    banco: x,
                  });
                }}
              ></TextInput>
            </View>
            <View style={styles.fechaColumnInputs}>
              <Text>Fecha Cobro</Text>
              <TextInput
                style={styles.inputs}
                value={
                  cheque.fecha_cobro
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                    .split(" ")[0]
                }
                onFocus={() => setShow(true)}
              ></TextInput>
            </View>
          </View>
          <View style={{ marginTop: actualDimensions.height * 0.05 }}>
            <Button title="Añadir cheque" onPress={() => handleAddCheque()} />
          </View>
        </View>
      )}
      <Mod
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedCheque={selectedCheque}
        removeCheque={removeCheque}
      />

      <View style={styles.button}>
        <Button
          title={"Ingresar pago en " + section.nextSection}
          onPress={() =>
            setSection({
              id: !section.id,
              name: section.nextSection,
              nextSection: section.name,
            })
          }
        />
      </View>
      <View style={{ marginTop: actualDimensions.height * 0.05 }}>
        <Button onPress={() => handleSubmit()} title="enviar"></Button>
      </View>
      <View style={styles.goback}>
        <Button onPress={() => navigation.goBack()} title="volver"></Button>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={cheque.fecha_cobro}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: actualDimensions.height * 0.03,
    fontWeight: "bold",
    marginBottom: actualDimensions.height * 0.05,
    textAlign: "center",
  },
  goback: {
    position: "absolute",
    top: actualDimensions.height * 0.05,
    left: actualDimensions.width * 0.02,
  },
  button: {
    width: actualDimensions.width * 0.4,
    position: "absolute",
    top: actualDimensions.height * 0.05,
    right: actualDimensions.width * 0.02,
  },
  input: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "black",
    width: actualDimensions.width * 0.4,
  },
  inputs: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "black",
  },
  inputIncorrect: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "red",
    width: actualDimensions.width * 0.4,
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: actualDimensions.width,
    marginTop: actualDimensions.height * 0.05,
  },

  numberColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign: "center",
    borderBottomColor: "black",
  },
  bancoColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign: "center",
    borderBottomColor: "black",
  },
  importeColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 1.5,
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  fechaColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  numColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 2,
    fontWeight: "bold",
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  banColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 2,
    fontWeight: "bold",
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  impColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 1.5,
    fontWeight: "bold",
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },

  fecColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 2,
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
    backgroundColor: "white",
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
  selectedBox: {
    borderColor: "black",
    width: actualDimensions.width * 0.9,
    height: actualDimensions.height * 0.065,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
  },
  flatListContainer: {
    height: actualDimensions.height * 0.4,
  },
  numberColumnInputs: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
  },
  bancoColumnInputs: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
    textAlign: "center",
  },
  importeColumnInputs: {
    fontSize: actualDimensions.height * 0.023,
    flex: 1.5,
    textAlign: "center",
  },
  fechaColumnInputs: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
    textAlign: "center",
  },
});
