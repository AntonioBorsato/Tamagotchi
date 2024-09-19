import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ButtonJogar, ButtonVoltar } from "@/components/Button";
import { useTamagochiDatabase } from "@/db/useTamagochiDatabase";

interface Tamagochi {
  id: number;
}

const GamesScreen: React.FC = () => {
  const [tamagochiId, setTamagochiId] = useState<number | null>(null);
  const tamagochiDatabase = useTamagochiDatabase();
  const router = useRouter();

  const fetchTamagochi = useCallback(async () => {
    try {
      const tamagotchis: Tamagochi[] =
        await tamagochiDatabase.getAllTamagochi();
      if (tamagotchis.length > 0) {
        setTamagochiId(tamagotchis[0].id);
      } else {
        // Handle empty array scenario
        console.error("No tamagotchis found");
      }
    } catch (error) {
      console.error("Error fetching tamagotchis:", error);
    }
  }, [tamagochiDatabase]);

  useEffect(() => {
    fetchTamagochi();
  }, [fetchTamagochi]);

  if (tamagochiId === null) {
    return <Text>Carregando...</Text>;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>Jogo da Velha</Text>
        <ButtonJogar
          labelButton="Iniciar"
          onpress={() =>
            router.push({
              pathname: "/jogoDaVelha",
              params: { id: tamagochiId },
            })
          }
        />
      </View>
      <View style={styles.gameContainer}>
        <Text style={styles.gameTitle}>Adivinhar Distância</Text>
        <ButtonJogar
          labelButton="Iniciar"
          onpress={() => router.push("/quizGame")}
        />
      </View>
      <ButtonVoltar labelButton="Voltar" onpress={() => router.back()} />
    </GestureHandlerRootView>
  );
};

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

export default GamesScreen;
