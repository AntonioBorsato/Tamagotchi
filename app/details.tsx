import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Button, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTamagochiDatabase, TamagochiDatabase } from "@/db/useTamagochiDatabase";

export default function Details() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };
  const [tamagochi, setTamagochi] = useState<TamagochiDatabase | null>(null);
  const tamagochiDatabase = useTamagochiDatabase();

  useEffect(() => {
    async function fetchTamagochi() {
      try {
        const data = await tamagochiDatabase.show(Number(id)); // Use 'show' aqui
        setTamagochi(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchTamagochi();
  }, [id]);

  async function handleDelete() {
    try {
      await tamagochiDatabase.remove(Number(id));
      Alert.alert("Tamagochi deletado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  if (!tamagochi) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Validando se a imagem é um número válido para acessar o array
  const imageIndex = Number(tamagochi.image); // Supondo que `image` é um índice numérico

  // Verifique se imageIndex está dentro dos limites do array
  const imageSource = (imageIndex >= 0 && imageIndex < IMAGES.length) 
    ? IMAGES[imageIndex]
    : IMAGES[0]; // Usar uma imagem padrão caso o índice esteja fora dos limites

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={styles.image}
      />
      <Text style={styles.text}>Nome: {tamagochi.name}</Text>
      <Text style={styles.text}>Fome: {tamagochi.hunger}</Text>
      <Text style={styles.text}>Sono: {tamagochi.sleep}</Text>
      <Text style={styles.text}>Diversão: {tamagochi.fun}</Text>
      <Button title="Deletar" onPress={handleDelete} />
    </View>
  );
}

const IMAGES = [
  require('@/assets/images/eevee.png'),
  require('@/assets/images/piplup.png'),
  require('@/assets/images/ponyta.png'),
  require('@/assets/images/jigglypuff.png'),
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginVertical: 4,
  },
});
