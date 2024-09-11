import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ButtonJogar, ButtonVoltar } from "@/components/Button";

export default function GamesScreen() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.gameContainer}>
          <Text style={styles.gameTitle}>Jogo da Velha</Text>
          <View>
            <ButtonJogar
              labelButton="Iniciar"
              onpress={() => router.push("/jogoDaVelha")}
            />
          </View>
        </View>
        <View style={styles.gameContainer}>
          <Text style={styles.gameTitle}>Adivinhar Distancia</Text>
          <View>
            <ButtonJogar
              labelButton="Iniciar"
              onpress={() => router.push("/quizGame")}
            />
          </View>
        </View>
        <ButtonVoltar labelButton="Voltar" onpress={() => router.back()} />
      </View>
    </GestureHandlerRootView>
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
