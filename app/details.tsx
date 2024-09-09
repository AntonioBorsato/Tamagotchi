import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTamagochiDatabase, TamagochiDatabase } from "@/db/useTamagochiDatabase";
import { useRoute } from "@react-navigation/native";

const IMAGES: Record<string, any> = {
  eevee: require("@/assets/images/eevee.png"),
  piplup: require("@/assets/images/piplup.png"),
  ponyta: require("@/assets/images/ponyta.png"),
  jigglypuff: require("@/assets/images/jigglypuff.png"),
};

export default function Details() {
  const [tamagochi, setTamagochi] = useState<TamagochiDatabase | null>(null);
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id: string };

  const tamagochiDatabase = useTamagochiDatabase();

  useEffect(() => {
    async function fetchTamagochi() {
      try {
        const item = await tamagochiDatabase.show(Number(id));
        if (item) {
          setTamagochi(item);
        } else {
          Alert.alert("Erro", "Tamagochi não encontrado.");
        }
      } catch (error) {
        console.log("Erro ao buscar Tamagochi:", error);
        Alert.alert("Erro", "Erro ao buscar Tamagochi.");
      }
    }
    fetchTamagochi();
  }, [id]);


  const getImageSource = (imageKey: string) => {
    return IMAGES[imageKey] || IMAGES.eevee;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tamagochi ? (
        <View style={styles.detailsContainer}>
          <Image source={getImageSource(tamagochi.image)} style={styles.image} />
          <Text style={styles.name}>{tamagochi.name}</Text>
          <Text style={styles.stats}>Fome: {tamagochi.hunger}</Text>
          <Text style={styles.stats}>Sono: {tamagochi.sleep}</Text>
          <Text style={styles.stats}>Diversão: {tamagochi.fun}</Text>

          <View style={styles.buttonContainer}>
            <Button title="Alimentar" color="#4CAF50" />
            <Button title="Dormir" color="#6A5ACD" />
            <Button
              title="Jogos"
              onPress={() => router.push("/gamesScreen")}
              color="#FF4500"
            />
          </View>
        </View>
      ) : (
        <Text>Carregando...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  detailsContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stats: {
    fontSize: 18,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
