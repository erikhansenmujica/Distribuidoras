import * as React from "react";
import { Button, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import * as Application from "expo-application";
import Loading from "../../components/Loading";
import ClientDataForm from "./ClientDataForm";
import FinancialDataForm from "./FinancialDataForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { registerClientAction } from "../../store/actions/clients";
import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";
import { getPriceList } from "../../store/actions/prices";

export default function ({ navigation }) {
  const dispatch=useDispatch()
  const user = useSelector((state: RootState) => state.user.data);
  const routes = useSelector((state: RootState) => state.routes.all);
  const prices = useSelector((state: RootState) => state.prices.all);

  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [adress, setAdress] = React.useState("");
  const [accountType, setAccountType] = React.useState("1");
  const [email, setEmail] = React.useState("");
  const [section, setSection] = React.useState(1);
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [cp, setCp] = React.useState("");
  const [deliveryData, setDeliveryData] = React.useState("");
  const [iva, setIva] = React.useState("");
  const [cuit, setCuit] = React.useState("");
  const [priceList, setPriceList] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [route, setRoute] = React.useState("");
  React.useEffect(()=>{
    user&&dispatch(getPriceList(user.distribuidoraId,setLoading))
  },[])
  const check = () => {
    return (
      accountType &&
      adress &&
      email &&
      name &&
      city &&
      state &&
      phone &&
      cp &&
      deliveryData &&
      iva &&
      cuit &&
      priceList &&
      position &&
      route
    );
  };
  const registerClient = async () => {
    if (!check()) {
      alert("Hay campos sin completar.");
      return;
    }
    registerClientAction(
      {
        tipo_cuenta: accountType,
        nombre: name,
        direccion: adress,
        localidad: city,
        provincia: state,
        codigo_postal: cp,
        telefono: phone,
        email,
        datos_entrega: deliveryData,
        numero_lista: priceList,
        cuit: cuit,
        categoria_de_iva: iva,
        cod_ruta: route,
        pos_ruta: position,
        company: user.distribuidoraId,
      },
      navigation,
      setLoading
    );
  };
  console.log(prices)
  return loading ? (
    <Loading title="Alta de cuenta" />
  ) : (
    <View style={styles.container2}>
      <Text style={styles.title}>Alta de cuenta</Text>
      <Text style={styles.subTitle}>
        {section === 1 ? "(datos del usuario)" : "(datos contables y ruta)"}
      </Text>

      {section === 1 ? (
        <ClientDataForm
          styles={styles}
          accountType={accountType}
          setAccountType={setAccountType}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          adress={adress}
          setAdress={setAdress}
          city={city}
          setCity={setCity}
          state={state}
          setState={setState}
          phone={phone}
          setPhone={setPhone}
          cp={cp}
          setCp={setCp}
          deliveryData={deliveryData}
          setDeliveryData={setDeliveryData}
        />
      ) : (
        <FinancialDataForm
          styles={styles}
          iva={iva}
          setIva={setIva}
          cuit={cuit}
          setCuit={setCuit}
          priceList={priceList}
          setPriceList={setPriceList}
          position={position}
          setPosition={setPosition}
          route={route}
          setRoute={setRoute}
          prices={prices}
          routes={routes}
        />
      )}
      <View style={styles.buttonsContainer}>
        {section !== 1 && (
          <View style={styles.button}>
            <Button onPress={() => setSection(1)} title="ATRAS" />
          </View>
        )}
        <View style={styles.button}>
          {section === 1 ? (
            <Button title="Continuar" onPress={() => setSection(2)} />
          ) : (
            <Button
              onPress={async () => await registerClient()}
              title="ENVIAR"
            ></Button>
          )}
        </View>
      </View>
      {section === 1 && (
        <View style={styles.gobackbutton}>
          <Button onPress={() => navigation.goBack()} title="Volver"></Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "space-around",
  },
  container2: {
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
  subTitle: {
    fontSize: actualDimensions.height * 0.025,
    fontWeight: "bold",
    marginBottom: actualDimensions.height * 0.02,
  },
  separator: {
    marginVertical: actualDimensions.height * 0.02,
    height: actualDimensions.height * 0.003,
    width: actualDimensions.width * 0.8,
  },
  dropdown: {
    width: actualDimensions.width * 0.4,
    height: actualDimensions.height * 0.052,
  },
  input: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "black",
    width: actualDimensions.width * 0.4,
    textAlign: "center",
  },
  inputIncorrect: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "red",
    width: actualDimensions.width * 0.4,
    textAlign: "center",
  },
  item: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "black",
  },
  button: {
    marginTop: actualDimensions.height * 0.02,
  },
  warningText: {
    color: "red",
  },
  gobackbutton: {
    position: "absolute",
    top: actualDimensions.height * 0.07,
    left: actualDimensions.width * 0.02,
  },
  box: {
    margin: actualDimensions.height * 0.02,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: actualDimensions.width * 0.4,
  },
});
