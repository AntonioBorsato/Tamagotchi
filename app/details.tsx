import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  TamagochiDatabase,
  useTamagochiDatabase,
} from "@/db/useTamagochiDatabase";
import { useRoute } from "@react-navigation/native";
import {
  ButtonAlimentar,
  ButtonDormir,
  ButtonJogar,
  ButtonVoltar,
} from "@/components/Button";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomText from "@/components/CustomText";

import { Audio } from "expo-av"; // Importação do expo-av

const IMAGES: Record<string, any> = {
  eevee: require("@/assets/images/azulmarrom.gif"),
  piplup: require("@/assets/images/roxoazul.gif"),
  ponyta: require("@/assets/images/roxobranco.gif"),
  jigglypuff: require("@/assets/images/verdeazul.gif"),
};

export default function Details() {
  const [tamagochi, setTamagochi] = useState<TamagochiDatabase | null>(null);
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const tamagochiDatabase = useTamagochiDatabase();
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [sound, setSound] = useState<Audio.Sound | null>(null); // Estado para o som

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./sound/dream-99404.mp3") // Arquivo de som
    );
    setSound(sound);
  }

  useEffect(() => {
    loadSound();
    return sound
      ? () => {
          sound.unloadAsync(); // Libera o som da memória
        }
      : undefined;
  }, [sound]);

  const calcularStatus = (
    hunger: number,
    sleep: number,
    fun: number
  ): string => {
    const total = hunger + sleep + fun;

    if (total === 0) return "morto";
    if (total <= 50) return "crítico";
    if (total <= 100) return "muito triste";
    if (total <= 150) return "triste";
    if (total <= 200) return "ok";
    if (total <= 250) return "bem";
    return "muito bem";
  };

  async function updateAtributos(tamagochi: TamagochiDatabase) {
    const newHunger = Math.max(tamagochi.hunger - 10, 0);
    const newSleep = Math.max(tamagochi.sleep - 10, 0);
    const newFun = Math.max(tamagochi.fun - 10, 0);

    await tamagochiDatabase.update({
      id: tamagochi.id,
      name: tamagochi.name,
      hunger: newHunger,
      sleep: newSleep,
      fun: newFun,
      image: tamagochi.image,
    });

    const status = calcularStatus(newHunger, newSleep, newFun);

    await tamagochiDatabase.update({
      id: tamagochi.id,
      name: tamagochi.name,
      hunger: newHunger,
      sleep: newSleep,
      fun: newFun,
      image: tamagochi.image,
    });

    const novoTamagochi = await tamagochiDatabase.show(tamagochi.id);
    setTamagochi(novoTamagochi);
  }

  async function alimentarTamagochi() {
    if (!tamagochi) return;

    const newHunger = Math.min(tamagochi.hunger + 10, 100);

    await tamagochiDatabase.update({
      id: tamagochi.id,
      name: tamagochi.name,
      hunger: newHunger,
      sleep: tamagochi.sleep,
      fun: tamagochi.fun,
      image: tamagochi.image,
    });

    const atualizadoTamagochi = await tamagochiDatabase.show(tamagochi.id);
    setTamagochi(atualizadoTamagochi);
  }

  async function diversaoTamagotchi() {
    if (!tamagochi) return;

    const newFun = Math.min(tamagochi.fun + 10, 100);

    await tamagochiDatabase.update({
      id: tamagochi.id,
      name: tamagochi.name,
      hunger: tamagochi.hunger,
      sleep: tamagochi.sleep,
      fun: newFun,
      image: tamagochi.image,
    });

    const atualizadoTamagochi = await tamagochiDatabase.show(tamagochi.id);
    setTamagochi(atualizadoTamagochi);
  }

  async function dormirTamagochi() {
    if (!tamagochi) return;

    // Verifica se o som foi carregado antes de tocar
    if (sound) {
      await sound.playAsync();
    } else {
      console.log("Som não carregado."); // Log para depuração
    }

    Alert.alert("Dormir", "O Tamagochi está dormindo por 5 segundos...");
    setTimeout(async () => {
      const newSleep = Math.min(tamagochi.sleep + 10, 100);

      await tamagochiDatabase.update({
        id: tamagochi.id,
        name: tamagochi.name,
        hunger: tamagochi.hunger,
        sleep: newSleep,
        fun: tamagochi.fun,
        image: tamagochi.image,
      });

      const atualizadoTamagochi = await tamagochiDatabase.show(tamagochi.id);
      setTamagochi(atualizadoTamagochi);
      Alert.alert("Dormir", "O Tamagochi acordou e ganhou 10 de sono!");
    }, 5000);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (tamagochi) {
        updateAtributos(tamagochi);
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [tamagochi]);

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

  const shakeImage = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {tamagochi ? (
          <View style={styles.detailsContainer}>
            <CustomText bold size={26} style={styles.name}>
              {tamagochi.name}
            </CustomText>
            <TouchableOpacity onPress={shakeImage}>
              <Animated.Image
                source={getImageSource(tamagochi.image)}
                style={[
                  styles.image,
                  {
                    transform: [{ translateX: shakeAnimation }],
                  },
                ]}
              />
            </TouchableOpacity>

            <View style={styles.row}>
              <CustomText bold size={16} style={styles.textWithPadding}>
                Fome: {tamagochi.hunger}
              </CustomText>
              <CustomText bold size={16} style={styles.textWithPadding}>
                Sono: {tamagochi.sleep}
              </CustomText>
              <CustomText bold size={16} style={styles.textWithPadding}>
                Diversão: {tamagochi.fun}
              </CustomText>
            </View>

            <CustomText bold size={18} style={styles.statusText}>
              Status:{" "}
              {calcularStatus(tamagochi.hunger, tamagochi.sleep, tamagochi.fun)}
            </CustomText>

            <View style={styles.buttonContainer}>
              <ButtonAlimentar
                labelButton="Alimentar"
                onpress={alimentarTamagochi}
              />
              <ButtonDormir labelButton="Dormir" onpress={dormirTamagochi} />
              <ButtonJogar
                labelButton="Jogar"
                onpress={async () => {
                  await diversaoTamagotchi(); // Executa a função de diversão do Tamagotchi
                  router.push("/gamesScreen"); // Após a função, redireciona para a tela de jogos
                }}
              />
            </View>
          </View>
        ) : (
          <Text>Carregando...</Text>
        )}
        <ButtonVoltar labelButton="Voltar" onpress={() => router.back()} />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  detailsContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "space-between",
  },
  image: {
    width: 320,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 24,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  textWithPadding: {
    paddingHorizontal: 8,
  },
  statusText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
