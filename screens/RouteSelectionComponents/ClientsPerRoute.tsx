import * as React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import faker from "faker";
import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";
import Loading from "../../components/Loading";


export default function ({ routeSelected, user }: { routeSelected: number; user:any}) {
  const [clients, setClients]= React.useState([])
  const [loading, setLoading ] =React.useState(false)
  async function getClients() {
    setLoading(true)
    const res=await axios.post(ApiUrl+"/route/clients/"+routeSelected,user )
    setLoading(false)
    setClients(res.data)
  }
  React.useEffect(()=>{
    getClients()
  },[routeSelected])

    return loading?<Loading title=""/>:!clients.length?<Text>No hay clientes en esta ruta.</Text>:(
    <View >
      <View style={styles.boxes}>
            <Text style={styles.pColumn}>Pr...</Text>
            <Text style={styles.nColumn}>Nombre</Text>
            <Text style={styles.dColumn}>Dirección</Text>
          </View>
      <ScrollView contentContainerStyle={styles.container}>
        {clients.map((c) => (
          <View style={styles.boxes} key={c.codigo}>
            <Text style={styles.productColumn}>{c.codigo}</Text>
            <Text style={styles.nameColumn}>{c.nombre}</Text>
            <Text style={styles.directionColumn}>{c.direccion}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: actualDimensions.width * 0.002,
  },
  productColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex:1,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign:"center",
    borderBottomColor: "black",
  },
  nameColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex:4,
    borderLeftColor:"black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    textAlign:"center",
    borderBottomColor: "black",
  },
  directionColumn: {
    fontSize: actualDimensions.height * 0.023,
    flex:5,
    borderLeftColor:"black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign:"center"
},
  pColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex:1,
    fontWeight:"bold",
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign:"center"
  },
  nColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex:4,
    fontWeight:"bold",
    borderLeftColor:"black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign:"center"
  },
  dColumn: {
    fontSize: actualDimensions.height * 0.025,
    flex:5,
    fontWeight:"bold",
    borderLeftColor:"black",
    borderLeftWidth: actualDimensions.width * 0.002,
    borderBottomWidth: actualDimensions.width * 0.002,
    borderBottomColor: "black",
    textAlign:"center"
  },
  boxes: {
    borderColor: "black",
    width: actualDimensions.width * 0.9,
    height: actualDimensions.height * 0.059,
    display: "flex",
    flexDirection: "row",
  },
  
});
