import React from "react";
import {
  StyleSheet,
  Text,
  GestureResponderEvent,
  TouchableOpacity,
} from "react-native";

// Define a interface para as propriedades do componente
interface ButtonTamaProps {
  labelButton: string;
  onpress?: (event?: GestureResponderEvent) => void; // Torna o evento opcional
}

interface ButtonAlimentarProps {
  labelButton: string;
  onpress?: (event?: GestureResponderEvent) => void; // Torna o evento opcional
}

interface ButtonDormirProps {
  labelButton: string;
  onpress?: (event?: GestureResponderEvent) => void; // Torna o evento opcional
}
interface ButtonJogarProps {
  labelButton: string;
  onpress?: (event?: GestureResponderEvent) => void; // Torna o evento opcional
}

const ButtonTama: React.FC<ButtonTamaProps> = ({ labelButton, onpress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onpress}>
      <Text style={styles.buttonText}>{labelButton}</Text>
    </TouchableOpacity>
  );
};

const ButtonAlimentar: React.FC<ButtonAlimentarProps> = ({
  labelButton,
  onpress,
}) => {
  return (
    <TouchableOpacity style={styles.buttonAlimentar} onPress={onpress}>
      <Text style={styles.buttonText}>{labelButton}</Text>
    </TouchableOpacity>
  );
};

const ButtonDormir: React.FC<ButtonDormirProps> = ({
  labelButton,
  onpress,
}) => {
  return (
    <TouchableOpacity style={styles.buttonDormir} onPress={onpress}>
      <Text style={styles.buttonText}>{labelButton}</Text>
    </TouchableOpacity>
  );
};

const ButtonJogar: React.FC<ButtonJogarProps> = ({ labelButton, onpress }) => {
  return (
    <TouchableOpacity style={styles.buttonJogar} onPress={onpress}>
      <Text style={styles.buttonText}>{labelButton}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    margin: "auto",
    marginTop: 6,
    marginBottom: 12,
    width: 120,
  },
  buttonAlimentar: {
    backgroundColor: "#faa916",
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    margin: 4,
    width: 95,
  },
  buttonDormir: {
    backgroundColor: "#6d676e",
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    margin: 4,
    width: 95,
  },
  buttonJogar: {
    backgroundColor: "black",
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    margin: 4,
    width: 95,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export { ButtonTama, ButtonAlimentar, ButtonDormir, ButtonJogar };
