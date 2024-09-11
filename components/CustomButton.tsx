import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

// Definindo os tipos das propriedades do botão
interface CustomButtonProps {
  label: string; // O texto do botão
  onPress: () => void; // Função a ser executada ao pressionar
  backgroundColor?: string; // Cor de fundo
  textColor?: string; // Cor do texto
  borderRadius?: number; // Arredondamento das bordas
  paddingHorizontal?: number; // Espaçamento interno horizontal
  paddingVertical?: number; // Espaçamento interno vertical
  style?: ViewStyle; // Qualquer outro estilo para o botão
  textStyle?: TextStyle; // Estilo adicional para o texto
  marginTop?: number;
  marginBottom?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  backgroundColor = "#007BFF", // Azul padrão
  textColor = "#fff", // Branco padrão
  borderRadius = 8, // Arredondamento padrão
  paddingHorizontal = 20,
  paddingVertical = 10,
  style,
  textStyle,
  marginTop = 10,
  marginBottom = 10,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          borderRadius,
          paddingHorizontal,
          paddingVertical,
          marginBottom,
          marginTop,
        },
        style, // Estilos customizáveis adicionais
      ]}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // Sombras para Android
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
