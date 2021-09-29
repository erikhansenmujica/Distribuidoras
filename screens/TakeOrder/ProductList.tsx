import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  VirtualizedList,
  TextInput,
  Button,
  TouchableHighlight,
  Alert,
  Modal,
} from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addProducts, fetchProducts } from "../../store/actions/products";
import { RootState } from "../../store/reducers";

const Item = ({ c, setSelectedProduct, selectedProduct }) => {
  return (
    <TouchableOpacity onPress={() => setSelectedProduct(c)}>
      <View
        style={
          selectedProduct.codigo && selectedProduct.codigo === c.codigo
            ? styles.selectedBox
            : styles.boxes
        }
      >
        <Text style={styles.descriptionColumn}>{c.descripcion}</Text>
        <Text style={styles.priceColumn}>{c.precio_venta}</Text>
        <Text style={styles.idColumn}>{c.codigo}</Text>
      </View>
    </TouchableOpacity>
  );
};
const getItem = (data: any, i: any) => data[i];

export default function ({
  route,
  navigation,
  selectedProducts,
  setSelectedProducts,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const products = useSelector((state: RootState) => state.products.all);
  const [loading, setLoading] = React.useState(false);
  const [prod, setProd] = React.useState([]);
  const [quantity, setQuantity] = React.useState("1")
  const [selectedProduct, setSelectedProduct] = React.useState({
    codigo: null,
  });
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    user && dispatch(fetchProducts(user.distribuidoraId, setLoading));
  }, []);
  const filterBy = (name: any, code: any) => {
    if (name) {
      let ps = products.filter((p) =>
        p.descripcion.toLowerCase().includes(name.toLowerCase())
      );
      if (ps.length) setProd(ps);
      else {
        setProd([1]);
      }
    } else if (code) {
      let ps = products.filter((p) => p.codigo + "" === code);
      if (ps.length) setProd(ps);
      else {
        setProd([1]);
      }
    } else if (!name && !code) setProd([]);
  };

  return loading ? (
    <Loading title="" />
  ) : !products.length || (prod[0] && prod[0] === 1) ? (
    <View>
      <Text style={styles.centerText}>Filtrar productos</Text>
      <View style={styles.inputsContainer}>
        <View style={styles.inputButtonContainerN}>
          <TextInput
            placeholder="Por nombre"
            style={styles.inputBuscar}
            onChangeText={(e) => {
              filterBy(e, null);
            }}
          ></TextInput>
        </View>
        <View style={styles.inputButtonContainerC}>
          <TextInput
            placeholder="Por codigo"
            style={styles.inputCBuscar}
            onChangeText={(e) => {
              filterBy(null, e);
            }}
          ></TextInput>
        </View>
      </View>
      <Text>No hay productos que mostrar.</Text>
    </View>
  ) : (
    <View>
      <Text style={styles.centerText}>Filtrar productos</Text>
      <View style={styles.inputsContainer}>
        <View style={styles.inputButtonContainerN}>
          <TextInput
            placeholder="Por nombre"
            style={styles.inputBuscar}
            onChangeText={(e) => {
              filterBy(e, null);
            }}
          ></TextInput>
        </View>
        <View style={styles.inputButtonContainerC}>
          <TextInput
            placeholder="Por codigo"
            style={styles.inputCBuscar}
            onChangeText={(e) => {
              filterBy(null, e);
            }}
            keyboardType="numeric"
          ></TextInput>
        </View>
      </View>
      <View style={styles.boxes}>
        <Text style={styles.dColumn}>Descripcion</Text>
        <Text style={styles.pColumn}>Precio</Text>
        <Text style={styles.cColumn}>Codigo</Text>
      </View>
      <VirtualizedList
        getItemCount={(data) => data.length}
        getItem={getItem}
        data={prod.length ? prod : products}
        initialNumToRender={6}
        renderItem={({ item }) => (
          <Item
            c={item}
            setSelectedProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
          />
        )}
        contentContainerStyle={styles.container}
        keyExtractor={(item,i) => i.toString()}
      ></VirtualizedList>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Añadir cantidad de producto</Text>
            <TextInput style={styles.inputCantidad} defaultValue="1" onChangeText={(e)=>setQuantity(e)} keyboardType="numeric" />
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
                onPress={(e) => {
                  setSelectedProducts([...selectedProducts, {...selectedProduct, quantity:parseInt(quantity)}]);
                  setQuantity("1")
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Enviar</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      <Button
        title="agregar"
        onPress={() => {
          if (
            selectedProduct.codigo &&
            !selectedProducts.filter(
              (p) => p.codigo === selectedProduct.codigo
            )[0]
          ) {
            setModalVisible(true);
          } else alert("Producto ya agregado.");
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: actualDimensions.width * 0.002,
  },
  //list:{marginBottom:actualDimensions.height*0.06},
  inputsContainer: {
    display: "flex",
    flexDirection: "row",
    width: actualDimensions.width * 0.9,
    marginBottom: actualDimensions.height * 0.02,
    justifyContent: "space-around",
  },
  centerText: {
    textAlign: "center",
    fontSize: actualDimensions.height * 0.027,
    marginBottom: actualDimensions.height * 0.02,
  },
  pages: {
    width: actualDimensions.width * 0.08,
    backgroundColor: "#D9D9D9",
  },
  text: {
    textAlign: "center",
    color: "white",
  },
  inputButtonContainerN: {
    display: "flex",
    flexDirection: "row",
    flex: 3,
  },
  inputButtonContainerC: {
    display: "flex",
    flexDirection: "row",
    flex: 2,
    marginLeft: actualDimensions.width * 0.02,
  },
  searchButton: {
    height: actualDimensions.height * 0.04,
    width: actualDimensions.width * 0.1,
    backgroundColor: "#2196F3",
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
  pagesText: { textAlign: "center" },
  selectedPage: {
    width: actualDimensions.width * 0.09,
    backgroundColor: "#ededed",
    height: actualDimensions.height * 0.04,
    display: "flex",
    justifyContent: "center",
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
    fontSize: actualDimensions.height * 0.025,
    flex: 5,
    fontWeight: "bold",
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  pColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex: 2,
    fontWeight: "bold",
    borderLeftColor: "black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign: "center",
  },
  cColumn: {
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
  selectedBox: {
    borderColor: "black",
    width: actualDimensions.width * 0.9,
    height: actualDimensions.height * 0.065,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
  },
  pagesContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: actualDimensions.width * 0.9,
    borderTopColor: "red",
    borderTopWidth: 2,
    alignSelf: "center",
    marginTop: actualDimensions.height * 0.02,
    flexWrap: "wrap",
  },
  inputBuscar: {
    borderWidth: actualDimensions.height * 0.002,
    flex: 8,
    textAlign: "center",
  },
  inputCantidad: {
    borderWidth: actualDimensions.height * 0.002,
    textAlign: "center",
    margin: actualDimensions.width * 0.1,
    width: actualDimensions.width * 0.2,
  },
  inputCBuscar: {
    borderWidth: actualDimensions.height * 0.002,
    flex: 2,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
  },
});
