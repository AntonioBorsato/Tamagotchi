import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export type TamagochiProps = {
  data: {
    id: number;
    name: string;
    hunger: number;
    sleep: number;
    fun: number;
    image: string; // Chave da imagem
  };
  onPress: () => Promise<void>;
  onDelete: () => Promise<void>;
  onOpen: () => void;
};

const IMAGES = {
  eevee: require("@/assets/images/eevee.png"),
  piplup: require("@/assets/images/piplup.png"),
  ponyta: require("@/assets/images/ponyta.png"),
  jigglypuff: require("@/assets/images/jigglypuff.png"),
};

export const Tamagochi: React.FC<TamagochiProps> = ({
  data,
  onPress,
  onDelete,
  onOpen,
}) => {
  // Acessa diretamente a imagem com a chave
  const selectedImage = IMAGES[data.image as keyof typeof IMAGES];

  return (
    <View style={styles.container}>
      {/* Exibe a imagem selecionada */}
      <Image source={selectedImage || IMAGES.eevee} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{data.name}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>Fome: {data.hunger}</Text>
          <Text style={styles.stats}>Sono: {data.sleep}</Text>
          <Text style={styles.stats}>Diversão: {data.fun}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={onPress}
            style={[styles.button, styles.detailsButton]}
          >
            <Text style={styles.buttonText}>Abrir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={[styles.button, styles.deleteButton]}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    elevation: 3,
    marginBottom: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  statsContainer: {
    marginBottom: 10,
  },
  stats: {
    fontSize: 16,
    color: "#666",
    marginVertical: 2,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailsButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
});
