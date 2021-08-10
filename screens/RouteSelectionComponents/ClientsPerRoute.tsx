import * as React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";
import faker from "faker";


export default function ({ routeSelected }: { routeSelected: number }) {
  
const data = {
    clients: [
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
      {
        id: Math.round(Math.random() * 1000),
        products: Math.round(Math.random() * 1000),
        name: faker.name.findName(),
        direction: faker.address.streetAddress(),
      },
    ],
  };
    return (
    <View >
      <View style={styles.boxes}>
            <Text style={styles.pColumn}>Pr...</Text>
            <Text style={styles.nColumn}>Nombre</Text>
            <Text style={styles.dColumn}>Dirección</Text>
          </View>
      <ScrollView contentContainerStyle={styles.container}>
        {data.clients.map((route) => (
          <View style={styles.boxes} key={route.id}>
            <Text style={styles.productColumn}>{route.id}</Text>
            <Text style={styles.nameColumn}>{route.name}</Text>
            <Text style={styles.directionColumn}>{route.direction}</Text>
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
