import React from "react";
import { Text, StyleSheet, TextProps, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
  bold?: boolean;
  size?: number;
  color?: string;
}

const CustomText: React.FC<CustomTextProps> = ({
  bold,
  size,
  color,
  style,
  children,
  ...props
}) => {
  // Criar um array de estilos sem valores inválidos
  const textStyles: TextStyle[] = [styles.text];

  if (bold) textStyles.push(styles.bold);
  if (size) textStyles.push({ fontSize: size });
  if (color) textStyles.push({ color });

  return (
    <Text style={[...textStyles, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16, // Tamanho padrão
    color: "#000", // Cor padrão
  },
  bold: {
    fontWeight: "bold",
  },
});

export default CustomText;
