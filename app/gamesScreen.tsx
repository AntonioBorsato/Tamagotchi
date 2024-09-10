import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function GamesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>Jogo da Velha</Text>
        <Button title="Iniciar" onPress={() => router.push("/jogoDaVelha")} color="#4CAF50" />
      </View>
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>Adivinhar Distancia</Text>
        <Button title="Iniciar" onPress={() => router.push("/quizGame")}  color="#4CAF50" />
      </View>
      <Button title="Voltar" onPress={() => router.back()} color="#FF4500" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  gameContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

