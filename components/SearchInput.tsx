import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Biblioteca de ícones

// Definindo os tipos das props
interface SearchInputProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ search, setSearch }) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Pesquisar Tamagochis"
        onChangeText={setSearch}
        value={search}
        placeholderTextColor="#888" // Cor do texto placeholder
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default SearchInput;
