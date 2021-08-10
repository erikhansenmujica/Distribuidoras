import * as React from "react";
import { Button, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import { Picker } from "@react-native-picker/picker";
import * as Application from "expo-application";
import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";
export default function ({ navigation }) {
  const [loading, setLoading] = React.useState(false);
  const [company, setcompany] = React.useState("");
  const [name, setname] = React.useState("");
  const [email, setemail] = React.useState("");
  const [passwords, setPasswords] = React.useState({ pass: "", secure: "" });
  const deviceId = Application.androidId;
  const [companies, setcompanies] = React.useState([]);
  React.useEffect(() => {
    const getCompanies = async () => {
      let comps;
      setLoading(true);
      try {
        comps = await axios.get(ApiUrl + "/companies");
      } catch (error) {
        console.log(error)
        setLoading(false);
         setcompanies([]);
         return;
      }
      setLoading(false);
      console.log(comps.data);
       setcompanies(comps.data);
       return;
    };
    getCompanies();
  }, []);
  const check =()=>{
   return name&&company&&passwords.pass&&passwords.secure&&email
  }
  const registerUser = async () => {
    if (!check()) {
      alert("Hay campos sin completar.")
      return;
    }
    let user;
    setLoading(true);
    try {
      user = await axios.post(ApiUrl + "/register", {
        deviceId,
        company,
        name,
        email,
        password: passwords.pass,
      });
    } catch (error) {
      setLoading(false);
      return false;
    }
    setLoading(false);
    return user;
  };
  console.log(company)
  return loading ? (
    <View style={[styles.container]}>
      <Text style={styles.title}>Registro</Text>
      <ActivityIndicator size="large" color="black"></ActivityIndicator>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Nombre completo</Text>
      <TextInput
        value={name}
        style={!name ? styles.inputIncorrect : styles.input}
        onChangeText={(val) => setname(val)}
      ></TextInput>
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
      <Text>Empresa</Text>
      <View style={styles.item}>
        <Picker
          selectedValue={company}
          onValueChange={(itemValue, itemIndex) => setcompany(itemValue)}
          style={styles.dropdown}
          mode="dropdown"
          enabled={true}
        >
          {companies &&
            companies.map((c) => (
              <Picker.Item label={c.nombre} value={c.id} key={c.id}></Picker.Item>
            ))}
        </Picker>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Contraseña</Text>
      <TextInput
        style={
          passwords.pass !== passwords.secure || !passwords.pass
            ? styles.inputIncorrect
            : styles.input
        }
        secureTextEntry={true}
        value={passwords.pass}
        onChangeText={(val) => setPasswords({ ...passwords, pass: val })}
      ></TextInput>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Repetir contraseña</Text>
      <TextInput
        style={
          passwords.pass !== passwords.secure || !passwords.secure
            ? styles.inputIncorrect
            : styles.input
        }
        secureTextEntry={true}
        value={passwords.secure}
        onChangeText={(val) => setPasswords({ ...passwords, secure: val })}
      ></TextInput>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {passwords.pass !== passwords.secure ? (
        <Text style={styles.warningText}>Las contraseñas no coinciden</Text>
      ) : (
        <Text></Text>
      )}
      <View style={styles.button}>
        <Button onPress={async()=>await registerUser()} title="ENVIAR"></Button>
      </View>
      <View style={styles.loginbutton}>
        <Button
          onPress={() => navigation.navigate("Login")}
          title="IR A LOGIN"
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
    padding: 10
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
