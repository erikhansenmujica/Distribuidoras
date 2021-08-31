import * as React from "react";
import {  StyleSheet, ActivityIndicator } from "react-native";
import { Text, View } from "./Themed";
import actualDimensions from "../dimensions";

export default function ({title }) {
  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>{title}</Text>
      <ActivityIndicator size="large" color="black"></ActivityIndicator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: actualDimensions.height * 0.035,
    fontWeight: "bold",
    marginBottom: actualDimensions.height * 0.02,
  },
});
