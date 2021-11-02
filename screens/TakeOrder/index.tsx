import * as React from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import Loading from "../../components/Loading";
import ProductList from "./ProductList";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import AddedProductsList from "./AddedProductsList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { setNewOrder } from "../../store/actions/orders";
import moment from "moment";

export default function ({ route, navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const [loading, setLoading] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [keyboardStatus, setKeyboardStatus] = React.useState(null);
  const [section, setSection] = React.useState(1);
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [tilde, setTilde] = React.useState(1);

  const hora_inicio = moment().format("HH:mm");
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
  };

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(null);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function resume() {
    const res = {
      iva: 0,
      neto: 0,
      total: 0,
      unidades: 0,
    };
    selectedProducts.forEach((product) => {
      if (product.quantity) {
        res.neto += product.precio_venta * product.quantity;
        res.unidades += product.quantity;
      } else {
        res.neto += product.precio_venta;
        res.unidades += 1;
      }
    });
    res.iva = res.neto * 0.21;
    res.total = res.iva + res.neto;
    return res;
  }
  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return (Math.round(m) / 100) * Math.sign(num);
  }
  const client = route.params.selectedUser;
  const closeOrder = async () => {
    let fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    let hora = moment().format("HH:mm");
    let cliente = client.codigo;
    let usuario = user.id;
    let ruta = route.params.route;
    let fecha_entrega = date.toISOString().slice(0, 19).replace("T", " ");
    const completeOrder = {
      products: selectedProducts,
      order: {
        fecha,
        cliente,
        hora,
        usuario,
        ruta,
        tilde,
        fecha_entrega,
        hora_inicio,
      },
      company: user.distribuidoraId,
    };
    await setNewOrder(completeOrder, setLoading, navigation);
  };
  return loading ? (
    <Loading title={"Pedido de" + client.nombre} />
  ) : section === 1 ? (
    <View style={styles.container}>
      <View style={styles.firstBoxContainer}>
        <Text style={styles.title}>Pedido de {client.nombre}</Text>
        <View style={styles.subtitleContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ClientHistorical", { client })}
          >
            <View style={styles.buttons}>
              <Text style={styles.text}>Pedidos históricos</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.saldo}>(saldo actual: {client.saldo})</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Payment", {
                client,
                route: route.params.route,
              })
            }
          >
            <View style={styles.buttons}>
              <Text style={styles.text}>Ingresar pago</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.productsContainer}>
        <ProductList
          navigation={navigation}
          route={route}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </View>
      {!keyboardStatus && (
        <View style={styles.addedProductsContainer}>
          <AddedProductsList
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            setSection={setSection}
            section={section}
            closeOrder={closeOrder}
          />
        </View>
      )}

      <View style={styles.goback}>
        <Button onPress={() => navigation.goBack()} title="volver"></Button>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      {!keyboardStatus && (
        <View
          style={{
            ...styles.addedProductsContainer,
            marginTop: actualDimensions.height * 0.01,
            width: actualDimensions.width * 0.8,
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>Resumen de pedido:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Total de articulos:
              <Text >
                {selectedProducts.length}
              </Text>
            </Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Total de unidades:
              <Text >{resume().unidades}</Text>
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Neto:
              <Text >{round(resume().neto)}</Text>
            </Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              IVA:
              <Text >{round(resume().iva)}</Text>
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Total:
              <Text>
                {round(resume().total)}
              </Text>
            </Text>
            <Text style={{ flex: 1, fontWeight: "bold" }}>
              Fecha:
              <Text >
                {date.toString().split(" ").splice(0, 4).join(" ")}
              </Text>
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={{...styles.paragraph, fontWeight:"bold"}}>Entrega resumen de cuenta</Text>
            <Checkbox
              style={styles.checkbox}
              value={tilde ? true : false}
              onValueChange={() => setTilde(tilde ? 0 : 1)}
              color={tilde ? "#4630EB" : undefined}
            />
          </View>
        </View>
      )}
      <View style={{marginTop:-actualDimensions.height*0.04}}>
        <Button onPress={showMode} title="Seleccionar fecha" />
      </View>
      <View
        style={{
          ...styles.addedProductsContainer,
          maxHeight: actualDimensions.height * 0.5,
        }}
      >
        <AddedProductsList
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          setSection={setSection}
          section={section}
          closeOrder={closeOrder}
        />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <View style={styles.goback}>
        <Button onPress={() => setSection(1)} title="atras"></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {},
  checkbox: {},
  firstBoxContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: actualDimensions.height * 0.03,
  },
  productsContainer: {
    maxHeight: actualDimensions.height * 0.54,
    marginTop: -actualDimensions.height * 0.02,
  },
  addedProductsContainer: {
    maxHeight: actualDimensions.height * 0.3,
    marginTop: -actualDimensions.height * 0.02,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  subtitleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: actualDimensions.width * 0.8,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: actualDimensions.height * 0.021,
  },
  title: {
    fontSize: actualDimensions.height * 0.023,
    fontWeight: "bold",
    marginBottom: actualDimensions.height * 0.02,
  },
  saldo: {
    fontSize: actualDimensions.height * 0.02,
    fontWeight: "bold",
    marginBottom: actualDimensions.height * 0.02,
    color: "green",
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
    top: actualDimensions.height * 0.03,
    left: actualDimensions.width * 0.02,
  },
  buttons: {
    height: actualDimensions.height * 0.065,
    width: actualDimensions.width * 0.2,
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
});
