import * as React from "react";
import { Button, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import * as Application from "expo-application";
import { logUserAction } from "../../store/actions/user";
import Loading from "../../components/Loading";
import { useDispatch } from "react-redux";

export default function ({ navigation }) {
  const dispatch=useDispatch()
  const [loading, setLoading] = React.useState(false);
  const [email, setemail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const deviceId = Application.androidId;

  const check = () => {
    return password && email;
  };
  const loginUser = async () => {
    if (!check()) {
      alert("Hay campos sin completar.");
      return;
    }
    dispatch(await logUserAction({ deviceId, email, password }, navigation, setLoading));
  };

  return loading ? (
    <Loading title="Ingresar" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresar</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text>Email</Text>
      <TextInput
        value={email}
        style={!email ? styles.inputIncorrect : styles.input}
        onChangeText={(val) => setemail(val)}
        keyboardType="email-address"
      ></TextInput>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Contraseña</Text>
      <TextInput
        style={!password ? styles.inputIncorrect : styles.input}
        secureTextEntry={true}
        value={password}
        onChangeText={(val) => setPassword(val)}
      ></TextInput>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <View style={styles.button}>
        <Button onPress={async () => await loginUser()} title="ENVIAR"></Button>
      </View>
      <View style={styles.loginbutton}>
        <Button
          onPress={() => navigation.navigate("Register")}
          title="REGISTRARSE"
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
  dropdown: {
    width: actualDimensions.width * 0.4,
    height: actualDimensions.height * 0.052,
  },
  input: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "black",
    width: actualDimensions.width * 0.4,
  },
  inputIncorrect: {
    borderWidth: actualDimensions.height * 0.001,
    borderColor: "red",
    width: actualDimensions.width * 0.4,
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
  loginbutton: {
    position: "absolute",
    top: actualDimensions.height * 0.07,
    right: actualDimensions.width * 0.02,
  },
});
