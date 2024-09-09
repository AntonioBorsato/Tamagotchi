import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Input } from "@/components/input";
import { Tamagochi } from "@/components/Tamagochi";
import {
  useTamagochiDatabase,
  TamagochiDatabase,
} from "@/db/useTamagochiDatabase";

const IMAGES: Record<string, any> = {
  eevee: require("@/assets/images/eevee.png"),
  piplup: require("@/assets/images/piplup.png"),
  ponyta: require("@/assets/images/ponyta.png"),
  jigglypuff: require("@/assets/images/jigglypuff.png"),
};

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
      Alert.alert("Tamagochi cadastrado");
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

    setId(null);
    setName("");
    setHunger(100);
    setSleep(100);
    setFun(100);
    setImage("eevee");
    await list();
  }

  useEffect(() => {
    list();
  }, [search]);

  return (
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
                style={[
                  styles.image,
                  image === key && styles.selectedImage,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Salvar" onPress={handleSave} color="#4CAF50" />

        <Input
          placeholder="Pesquisar Tamagochis"
          onChangeText={setSearch}
          value={search}
        />
      </View>

      {tamagochis.map((item) => (
        <Tamagochi
          key={item.id}
          data={item}
          onPress={() => showDetails(item.id)}
          onDelete={() => remove(item.id)}
          onOpen={() => router.push({ pathname: '../details', params: { id: item.id } })}
        />
      ))}
    </ScrollView>
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
    width: 120, 
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