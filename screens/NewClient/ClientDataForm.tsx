import * as React from "react";
import { Text, View } from "../../components/Themed";
import { StyleSheet, TextInput } from "react-native";

export default ({
  styles,
  accountType,
  setAccountType,
  name,
  setName,
  email,
  setEmail,
  adress,
  setAdress,
  city,
  setCity,
  state,
  setState,
  phone,
  setPhone,
  cp,
  setCp,
  deliveryData,
  setDeliveryData,
}) => (
  <View>
    <View style={styles.container}>
      <View style={styles.box}>
        <Text>Tipo de cuenta</Text>
        <TextInput
          value={accountType}
          style={!accountType ? styles.inputIncorrect : styles.input}
          onChangeText={(val) => setAccountType("1")}
        ></TextInput>
      </View>
      <View style={styles.box}>
        <Text>Nombre</Text>
        <TextInput
          value={name}
          style={!name ? styles.inputIncorrect : styles.input}
          onChangeText={(val) => setName(val)}
        ></TextInput>
      </View>
      <View style={styles.box}>
        <Text>Email</Text>
        <TextInput
          value={email}
          style={!email ? styles.inputIncorrect : styles.input}
          onChangeText={(val) => setEmail(val)}
          keyboardType="email-address"
        ></TextInput>
      </View>
      <View style={styles.box}>
        <Text>Direccion</Text>
          <TextInput
            value={adress}
            style={!adress ? styles.inputIncorrect : styles.input}
            onChangeText={(val) => setAdress(val)}
          ></TextInput>
      </View>

      <View style={styles.box}>
        <Text>Localidad</Text>
          <TextInput
            value={city}
            style={!city ? styles.inputIncorrect : styles.input}
            onChangeText={(val) => setCity(val)}
          ></TextInput>
      </View>
      <View style={styles.box}>
        <Text>Provincia</Text>
          <TextInput
            value={state}
            style={!state ? styles.inputIncorrect : styles.input}
            onChangeText={(val) => setState(val)}
          ></TextInput>
      </View>
      <View style={styles.box}>
        <Text>Telefono</Text>
          <TextInput
            value={phone}
            style={!phone ? styles.inputIncorrect : styles.input}
            onChangeText={(val) => setPhone(val)}
            keyboardType="numeric"

          ></TextInput>
      </View>
      <View style={styles.box}>
        <Text>C.P</Text>
          <TextInput
            value={cp}
            style={!cp ? styles.inputIncorrect : styles.input}
            onChangeText={(val) => setCp(val)}
          ></TextInput>
      </View>
      <View style={styles.box}>
        <Text>Datos de entrega</Text>
          <TextInput
            value={deliveryData}
            style={!deliveryData ? styles.inputIncorrect : styles.input}
            onChangeText={(val) => setDeliveryData(val)}
          ></TextInput>
      </View>
    </View>
  </View>
);
