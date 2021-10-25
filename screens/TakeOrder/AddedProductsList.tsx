import * as React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import Loading from "../../components/Loading";
import ProductList from "./ProductList";
import productsReducer from "../../store/reducers/productsReducer";

const Item = ({
  c,
  setSelectedProduct,
  selectedProduct,
  setSelectedProducts,
  selectedProducts,
}) => {
  return (
    <TouchableOpacity onPress={() => setSelectedProduct(c)}>
      <View style={styles.boxes}>
        <Text style={styles.descriptionColumn}>{c.descripcion}</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.priceColumn}
          defaultValue={c.precio_venta.toString()}
          placeholder={c.precio_venta.toString()}
          onEndEditing={(e) => {
            let x = e.nativeEvent.text;
            let i = selectedProducts.map((p) => p.codigo).indexOf(c.codigo);
            let prod = selectedProducts[i];
            prod.precio_venta = x
              ? x.includes(".")
                ? x.replace(/\./g, "")
                : x
              : "";
            setSelectedProducts([...selectedProducts]);
          }}
        ></TextInput>
        <Text style={styles.idColumn}>{c.codigo}</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.idColumn}
          defaultValue={c.quantity ? c.quantity.toString() : "1"}
          placeholder="1"
          onEndEditing={(e) => {
            if (e.nativeEvent.text === "0") {
              setSelectedProducts(
                selectedProducts.filter((p) => p.codigo !== c.codigo)
              );
            } else {
              let i = selectedProducts.map((p) => p.codigo).indexOf(c.codigo);
              let prod = selectedProducts[i];
              if (prod.quantity)
                e.nativeEvent.text
                  ? (prod.quantity = parseInt(e.nativeEvent.text))
                  : (prod.quantity = 1);
              else
                e.nativeEvent.text
                  ? (prod.quantity = parseInt(e.nativeEvent.text))
                  : (prod.quantity = 1);
              setSelectedProducts([...selectedProducts]);
            }
          }}
        ></TextInput>
      </View>
    </TouchableOpacity>
  );
};

export default function ({
  section,
  setSelectedProducts,
  selectedProducts,
  closeOrder,
  setSection,
}) {
  const [loading, setLoading] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState({});
  return loading ? (
    <Loading title="" />
  ) : (
    <View style={styles.container}>
      <Text style={styles.centerText}>Productos seleccionados</Text>
      {section === 2 && (
        <Text
          style={{
            marginTop: -actualDimensions.height * 0.015,
            marginBottom: actualDimensions.height * 0.015,
          }}
        >
          (tocar cantidad para cambiar cantidad de unidades)
        </Text>
      )}
      <View style={styles.boxes}>
        <Text style={styles.dColumn}>Descripcion</Text>
        <Text style={styles.pColumn}>Precio</Text>
        <Text style={styles.cColumn}>Codigo</Text>
        <Text style={styles.cColumn}>Cantidad</Text>
      </View>
      <FlatList
        data={selectedProducts}
        renderItem={({ item }) => (
          <Item
            c={item}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            setSelectedProducts={setSelectedProducts}
            selectedProducts={selectedProducts}
          />
        )}
        contentContainerStyle={styles.container}
        keyExtractor={(item,i) => i.toString()}
      ></FlatList>
      {section === 1 ? (
        <Button
          title="continuar"
          onPress={() => {
            setSection(2);
          }}
        />
      ) : (
        <Button
          title="cerrar pedido"
          onPress={async () => {
            await closeOrder();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
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
  centerText: {
    textAlign: "center",
    fontSize: actualDimensions.height * 0.027,
    marginBottom: actualDimensions.height * 0.02,
  },
  descriptionColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 5,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign: "center",
    borderBottomColor: "black",
  },
  priceColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign: "center",
    borderBottomColor: "black",
  },
  idColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex: 2,
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  dColumn: {
    fontSize: actualDimensions.height * 0.02,
    flex: 5,
    fontWeight: "bold",
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  pColumn: {
    fontSize: actualDimensions.height * 0.02,
    flex: 2,
    fontWeight: "bold",
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  cColumn: {
    fontSize: actualDimensions.height * 0.02,
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
    display: "flex",
    flexDirection: "row",
    height: actualDimensions.height * 0.055,
  },
  selectedBox: {
    borderColor: "black",
    width: actualDimensions.width * 0.9,
    display: "flex",
    height: actualDimensions.height * 0.055,
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
  },
});
