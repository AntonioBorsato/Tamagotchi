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

// Mapa estático de imagens com índice de assinatura para strings
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
  const { id } = route.params as { id: string }; // Obtém o id da rota

  const tamagochiDatabase = useTamagochiDatabase();

  useEffect(() => {
    async function fetchTamagochi() {
      try {
        const item = await tamagochiDatabase.show(Number(id)); // Converte o id para número
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

  // Obtém a imagem com base no nome
  const getImageSource = (imageKey: string) => {
    return IMAGES[imageKey] || IMAGES.eevee; // Fallback para uma imagem padrão se a chave não for encontrada
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
          <Button title="Voltar" onPress={() => router.back()} color="#4CAF50" />
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
    backgroundColor: "#f5f5f5",
  },
  detailsContainer: {
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stats: {
    fontSize: 18,
    marginVertical: 5,
  },
});
