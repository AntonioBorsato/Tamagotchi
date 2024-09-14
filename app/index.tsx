import React, { useState, useEffect, useCallback } from "react";

import {
  View,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Input } from "@/components/input";
import { Tamagochi } from "@/components/Tamagochi";
import {
  useTamagochiDatabase,
  TamagochiDatabase,
} from "@/db/useTamagochiDatabase";

import { GestureHandlerRootView } from "react-native-gesture-handler";

const IMAGES: Record<string, any> = {
  eevee: require("@/assets/images/azulmarrom.gif"),
  piplup: require("@/assets/images/roxoazul.gif"),
  ponyta: require("@/assets/images/roxobranco.gif"),
  jigglypuff: require("@/assets/images/verdeazul.gif"),
};

import { ButtonTama } from "@/components/Button";
import SearchInput from "@/components/SearchInput";

export default function Index() {
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [hunger, setHunger] = useState<number>(100);
  const [sleep, setSleep] = useState<number>(100);
  const [fun, setFun] = useState<number>(100);
  const [image, setImage] = useState<string>("eevee");
  const [search, setSearch] = useState<string>("");
  const [tamagochis, setTamagochis] = useState<TamagochiDatabase[]>([]);

  const tamagochiDatabase = useTamagochiDatabase();

  async function create() {
    try {
      const response = await tamagochiDatabase.create({
        name,
        hunger,
        sleep,
        fun,
        image,
      });
      Alert.alert(`Tamagochi cadastrado` + response.insertedRowId);
      await list();
    } catch (error) {
      console.log("Erro ao criar Tamagochi:", error);
    }
  }

  async function update() {
    if (id) {
      try {
        await tamagochiDatabase.update({
          id: Number(id),
          name,
          hunger,
          sleep,
          fun,
          image,
        });
        Alert.alert("Tamagochi atualizado!");
        await list();
      } catch (error) {
        console.log("Erro ao atualizar Tamagochi:", error);
      }
    }
  }

  async function list() {
    try {
      const response = await tamagochiDatabase.searchByName(search);
      setTamagochis(response);
    } catch (error) {
      console.log("Erro ao listar Tamagochis:", error);
    }
  }

  async function remove(id: number) {
    try {
      await tamagochiDatabase.remove(id);
      await list();
    } catch (error) {
      console.log("Erro ao remover Tamagochi:", error);
    }
  }

  async function showDetails(id: number) {
    try {
      const item = await tamagochiDatabase.show(id);
      if (item) {
        setId(String(item.id));
        setName(item.name);
        setHunger(item.hunger);
        setSleep(item.sleep);
        setFun(item.fun);
        setImage(item.image);
      }
    } catch (error) {
      console.log("Erro ao mostrar detalhes do Tamagochi:", error);
    }
  }

  function handleImageSelect(imageKey: string) {
    setImage(imageKey);
  }

  async function handleSave() {
    if (name.trim() === "") {
      Alert.alert("Erro", "O nome do Tamagochi é obrigatório!");
      return;
    }

    if (id) {
      await update();
    } else {
      await create();
    }
  }

  function statusTamagotchi(statusTamagotchi: number) {
    switch (true) {
      case statusTamagotchi < 1:
        return "Morto!";
      case statusTamagotchi < 51:
        return "Critico!";
      case statusTamagotchi < 101:
        return "Muito triste...";
      case statusTamagotchi < 151:
        return "Triste";
      case statusTamagotchi < 201:
        return "OK";
      case statusTamagotchi < 251:
        return "Até que tá bem";
      case statusTamagotchi < 301:
        return "Muito Bem !!";

      default:
        return "Status Indefinido ";
    }
  }

  async function updateAtributos() {
    const allTamagochi = await tamagochiDatabase.getAllTamagochi();
    allTamagochi.map(async (tamagochi) => {
      const updatedHunger = Math.max(tamagochi.hunger - 10, 0);
      const updatedSleep = Math.max(tamagochi.sleep - 10, 0);
      const updatedFun = Math.max(tamagochi.fun - 10, 0);

      await tamagochiDatabase.update({
        id: tamagochi.id,
        name: tamagochi.name,
        hunger: updatedHunger,
        sleep: updatedSleep,
        fun: updatedFun,
        image: tamagochi.image,
      });
    });
    setTamagochis(allTamagochi);
  }

  useFocusEffect(
    useCallback(() => {
      updateAtributos();
    }, [])
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateAtributos();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [tamagochis]);

  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Cadastro de Tamagochi</Text>
          <Input
            placeholder="Nome do Tamagochi"
            onChangeText={setName}
            value={name}
          />
          <View style={styles.imageContainer}>
            {Object.keys(IMAGES).map((key, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImageSelect(key)}
              >
                <Image
                  source={IMAGES[key]}
                  style={[styles.image, image === key && styles.selectedImage]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <ButtonTama labelButton="Salvar" onpress={handleSave} />
          <SearchInput search={search} setSearch={setSearch} />
        </View>

        <View>
          {tamagochis.map((item) => (
            <Tamagochi
              key={item.id}
              data={item}
              onPress={() => showDetails(item.id)}
              onDelete={() => remove(item.id)}
              onOpen={() =>
                router.push({ pathname: "../details", params: { id: item.id } })
              }
            />
          ))}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedImage: {
    borderColor: "#007bff",
  },
});
