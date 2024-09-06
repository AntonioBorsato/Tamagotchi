import React from "react";
import { TextInput, StyleSheet } from "react-native";

type InputProps = {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
};

export function Input({ placeholder, onChangeText, value }: InputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
