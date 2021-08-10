import * as React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import actualDimensions from "../../dimensions";

const data = {
  routes: [
    { id: 1, name: "Necochea" },
    { id: 5, name: "Balcarse" },
    { id: 2, name: "Mar del Plata" },
    { id: 3, name: "Azul" },
    { id: 4, name: "Necochea - Martes - Guille" },
    { id: 6, name: "Mar del Pla2ta - Martes - Guille" },
    { id: 7, name: "Mar del Platsda - Martes - Guille" },
    { id: 8, name: "Mar del Platsda - Martes - Guille" },
    { id: 9, name: "Mar del Platsda - Martes - Guille" },
    { id: 10, name: "Mar del Platsda - Martes - Guille" },
    { id: 11, name: "Mar del Platsda - Martes - Guille" },
    { id: 12, name: "Mar del Platsda - Martes - Guille" },
    { id: 13, name: "Mar del Platsda - Martes - Guille" },
  ],
};

export default function ({
  routeSelected,
  setRouteSelected,
}: {
  routeSelected: number;
  setRouteSelected: any;
}) {
  return (
    <View style={styles.heightContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {data.routes.map((route) => (
          <TouchableOpacity onPress={() => setRouteSelected(route.id)} key={route.id}>
            <View
              style={
                route.id === routeSelected ? styles.selectedBox : styles.boxes
              }
            >
              <Text
                style={
                  route.id === routeSelected
                    ? styles.selectedBoxText
                    : styles.boxesText
                }
              >
                {route.id}
              </Text>
              <Text
                style={
                  route.id === routeSelected
                    ? styles.selectedBoxText
                    : styles.boxesText
                }
              >
                {route.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    overflow: "scroll",
    flexWrap: "wrap",
  },
  boxesText: {
    fontSize: actualDimensions.height * 0.023,
  },
  selectedBoxText: {
    fontSize: actualDimensions.height * 0.026,
  },
  boxes: {
    borderColor: "black",
    borderWidth: actualDimensions.width * 0.002,
    marginBottom: actualDimensions.height * 0.03,
    width: actualDimensions.width * 0.3,
    height: actualDimensions.height * 0.15,
    display: "flex",
    alignItems: "center",
  },
  heightContainer: {
    height: actualDimensions.height * 0.33,
  },
  selectedBox: {
    borderColor: "black",
    borderWidth: actualDimensions.width * 0.004,
    marginBottom: actualDimensions.height * 0.03,
    width: actualDimensions.width * 0.3,
    height: actualDimensions.height * 0.15,
    display: "flex",
    alignItems: "center",
  },
});
