import * as React from "react";
import { Text, View } from "../../components/Themed";
import { StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default ({
  styles,
  iva,
  setIva,
  cuit,
  setCuit,
  priceList,
  setPriceList,
  position,
  setPosition,
  route,
  setRoute,
  routes,
  prices,
}) => (
  <View>
    <View style={styles.container}>
      <View style={styles.box}>
        <Text>Inscripcion IVA</Text>

        <View style={styles.item}>
          <Picker
            selectedValue={iva}
            onValueChange={(itemValue) => setIva(itemValue)}
            style={styles.dropdown}
            mode="dropdown"
            enabled={true}
          >
            <Picker.Item label={""} value={""}></Picker.Item>

            <Picker.Item
              label={"Responsable inscripto"}
              value={"Responsable inscripto"}
            ></Picker.Item>
            <Picker.Item
              label={"Monotributista"}
              value={"Monotributista"}
            ></Picker.Item>
            <Picker.Item
              label={"Consumidor final"}
              value={"Consumidor final"}
            ></Picker.Item>
          </Picker>
        </View>
      </View>
      <View style={styles.box}>
        <Text>CUIT</Text>
        <TextInput
          value={cuit}
          style={!cuit ? styles.inputIncorrect : styles.input}
          onChangeText={(val) => setCuit(val)}
        ></TextInput>
      </View>
      <View style={styles.box}>
        <Text>Lista de precios</Text>

        <View style={styles.item}>
          <Picker
            selectedValue={priceList}
            onValueChange={(itemValue) => setPriceList(itemValue)}
            style={styles.dropdown}
            mode="dropdown"
            enabled={true}
          >
            <Picker.Item label={""} value={""}></Picker.Item>

            {prices &&
              prices.map((c: any, i: any) => (
                <Picker.Item
                  label={c.lista_precio}
                  value={c.lista_precio}
                  key={i}
                ></Picker.Item>
              ))}
          </Picker>
        </View>
      </View>
      <View style={styles.box}>
        <Text>Ruta</Text>
        <View style={styles.item}>
          <Picker
            selectedValue={route}
            onValueChange={(itemValue) => setRoute(itemValue)}
            style={styles.dropdown}
            mode="dropdown"
            enabled={true}
          >
            <Picker.Item label={""} value={""}></Picker.Item>
            {routes &&
              routes.map((c: any, i: any) => (
                <Picker.Item
                  label={c.nombre}
                  value={c.codigo_ruta}
                  key={i}
                ></Picker.Item>
              ))}
          </Picker>
        </View>
      </View>

      <View style={styles.box}>
        <Text>Posicion</Text>
        <TextInput
          value={position}
          style={!position ? styles.inputIncorrect : styles.input}
          onChangeText={(val) => setPosition(val)}
          keyboardType="numeric"
        ></TextInput>
      </View>
    </View>
  </View>
);
