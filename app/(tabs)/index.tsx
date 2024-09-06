import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import { router } from "expo-router";
import { Input } from "@/components/input";
import { Tamagochi } from "@/components/Tamagochi";
import {
  useTamagochiDatabase,
  TamagochiDatabase,
} from "@/db/useTamagochiDatabase";

const IMAGES = [
  { uri: require("@/assets/images/eevee.png") },
  { uri: require("@/assets/images/piplup.png") },
  { uri: require("@/assets/images/ponyta.jpg") },
  { uri: require("@/assets/images/jigglypuff.png") },
];

export default function Index() {
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [hunger, setHunger] = useState<number>(100);
  const [sleep, setSleep] = useState<number>(100);
  const [fun, setFun] = useState<number>(100);
  const [image, setImage] = useState<string>(IMAGES[0].uri);
  const [search, setSearch] = useState<string>("");
  const [tamagochis, setTamagochis] = useState<TamagochiDatabase[]>([]);
  const [availableIds, setAvailableIds] = useState<number[]>([]); // Lista de IDs disponíveis

  const tamagochiDatabase = useTamagochiDatabase();

  async function create() {
    try {
      let newId: number;
      if (availableIds.length > 0) {
        newId = availableIds[0];
        setAvailableIds(availableIds.slice(1));
      } else {
        const lastTamagochi = tamagochis[tamagochis.length - 1];
        newId = lastTamagochi ? lastTamagochi.id + 1 : 1;
      }

      // Crie o Tamagochi sem o id
      const response = await tamagochiDatabase.create({
        name,
        hunger,
        sleep,
        fun,
        image,
      });

      Alert.alert("Tamagochi cadastrado com o ID: " + response.insertedRowId);
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
      } catch (error) {
        console.log("Erro ao atualizar Tamagochi:", error);
      }
    }
  }

  async function list() {
    try {
      const response = await tamagochiDatabase.searchByName(search);
      setTamagochis(response);

      // Atualiza a lista de IDs disponíveis
      const usedIds = response.map((item) => item.id);
      setAvailableIds((prev) => {
        // Adiciona IDs que não estão mais em uso à lista de IDs disponíveis
        const newAvailableIds = prev.filter((id) => !usedIds.includes(id));
        return [...newAvailableIds, ...usedIds].sort();
      });
    } catch (error) {
      console.log("Erro ao listar Tamagochis:", error);
    }
  }

  async function remove(id: number) {
    try {
      await tamagochiDatabase.remove(id);
      setAvailableIds((prev) => {
        // Adiciona o ID removido à lista de IDs disponíveis
        if (!prev.includes(id)) {
          return [...prev, id].sort();
        }
        return prev;
      });
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

  function handleImageSelect(imageUri: string) {
    setImage(imageUri);
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
    setImage(IMAGES[0].uri); // Reset para a imagem padrão
    await list();
  }

  useEffect(() => {
    list();
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Cadastro de Tamagochi</Text>
        <Input
          placeholder="Nome do Tamagochi"
          onChangeText={setName}
          value={name}
        />

        <View style={styles.imageContainer}>
          {IMAGES.map((img, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageSelect(img.uri)}
            >
              <Image
                source={img.uri}
                style={[
                  styles.image,
                  image === img.uri && styles.selectedImage,
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

        <FlatList
          data={tamagochis}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Tamagochi
              data={item}
              onPress={() => showDetails(item.id)}
              onDelete={() => remove(item.id)}
              onOpen={() => router.push(`../details/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.flatList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedImage: {
    borderColor: "#007bff",
  },
  flatList: {
    paddingTop: 10,
  },
});
