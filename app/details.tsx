import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
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

            <View style={styles.buttonContainer}>
              <ButtonAlimentar
                labelButton="Alimentar"
                onpress={() => alert("Bixin alimentado")}
              />
              <ButtonDormir
                labelButton="Dormir"
                onpress={() => alert("Zzz...")}
              />
              <ButtonJogar
                labelButton="Jogar"
                onpress={() => router.push("/gamesScreen")}
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
});
