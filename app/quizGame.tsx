import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import CustomButton from "@/components/CustomButton";

const countries = [
  { name: "Afeganistão", latitude: 33.9391, longitude: 67.71 },
  { name: "África do Sul", latitude: -30.5595, longitude: 22.9375 },
  { name: "Alemanha", latitude: 51.1657, longitude: 10.4515 },
  { name: "Andorra", latitude: 42.5462, longitude: 1.6016 },
  { name: "Angola", latitude: -11.2027, longitude: 17.8739 },
  { name: "Antígua e Barbuda", latitude: 17.0608, longitude: -61.7964 },
  { name: "Arábia Saudita", latitude: 23.8859, longitude: 45.0792 },
  { name: "Argélia", latitude: 28.0339, longitude: 1.6596 },
  { name: "Argentina", latitude: -38.4161, longitude: -63.6167 },
  { name: "Armênia", latitude: 40.0694, longitude: 45.0382 },
  { name: "Austrália", latitude: -25.2744, longitude: 133.7751 },
  { name: "Áustria", latitude: 47.5162, longitude: 14.5501 },
  { name: "Azerbaijão", latitude: 40.1431, longitude: 47.5769 },
  { name: "Bahamas", latitude: 25.0343, longitude: -77.3963 },
  { name: "Bahrein", latitude: 25.9304, longitude: 50.6378 },
  { name: "Bangladesh", latitude: 23.685, longitude: 90.3563 },
  { name: "Barbados", latitude: 13.1939, longitude: -59.5432 },
  { name: "Belize", latitude: 17.1899, longitude: -88.4976 },
  { name: "Benim", latitude: 9.3085, longitude: 2.3158 },
  { name: "Bermudas", latitude: 32.3078, longitude: -64.7505 },
  { name: "Botswana", latitude: -22.3285, longitude: 24.6849 },
  { name: "Brunei", latitude: 4.5353, longitude: 114.7277 },
  { name: "Bulgária", latitude: 42.7339, longitude: 25.4858 },
  { name: "Burquina Faso", latitude: 12.2383, longitude: -1.5616 },
  { name: "Burundi", latitude: -3.3731, longitude: 29.9189 },
  { name: "Butão", latitude: 27.5142, longitude: 90.4336 },
  { name: "Cabo Verde", latitude: 16.5388, longitude: -23.0418 },
  { name: "Camarões", latitude: 3.848, longitude: 11.5021 },
  { name: "Canadá", latitude: 56.1304, longitude: -106.3468 },
  { name: "Catar", latitude: 25.276987, longitude: 51.520008 },
  { name: "Cazaquistão", latitude: 48.0196, longitude: 66.9237 },
  { name: "República Centro-Africana", latitude: 6.6111, longitude: 20.9394 },
  { name: "Chade", latitude: 15.4542, longitude: 18.7322 },
  { name: "Chile", latitude: -35.6751, longitude: -71.543 },
  { name: "China", latitude: 35.8617, longitude: 104.1954 },
  { name: "Colômbia", latitude: 4.5709, longitude: -74.2973 },
  { name: "Comores", latitude: -11.6455, longitude: 43.3333 },
  { name: "Congo", latitude: -0.228, longitude: 15.827 },
  {
    name: "Congo (República Democrática)",
    latitude: -4.0383,
    longitude: 21.7587,
  },
  { name: "Costa do Marfim", latitude: 7.5399, longitude: -5.5471 },
  { name: "Costa Rica", latitude: 9.7489, longitude: -83.7534 },
  { name: "Croácia", latitude: 45.1, longitude: 15.2 },
  { name: "Cuba", latitude: 21.5216, longitude: -77.7812 },
  { name: "Chipre", latitude: 35.1264, longitude: 33.4299 },
  { name: "Dinamarca", latitude: 56.2639, longitude: 9.5018 },
  { name: "Djibuti", latitude: 11.8251, longitude: 42.5903 },
  { name: "Dominica", latitude: 15.4148, longitude: -61.37 },
  { name: "República Dominicana", latitude: 18.7357, longitude: -70.1627 },
  { name: "Egito", latitude: 26.8206, longitude: 30.8025 },
  { name: "El Salvador", latitude: 13.7942, longitude: -88.8965 },
  { name: "Equador", latitude: -1.8312, longitude: -78.1834 },
  { name: "Espanha", latitude: 40.4637, longitude: -3.7492 },
  { name: "Estados Unidos", latitude: 37.0902, longitude: -95.7129 },
  { name: "Estônia", latitude: 58.5953, longitude: 25.0136 },
  { name: "Eswatini", latitude: -26.5225, longitude: 31.4659 },
  { name: "Etiópia", latitude: 9.145, longitude: 40.4897 },
  { name: "Fiji", latitude: -17.7134, longitude: 178.065 },
  { name: "Filipinas", latitude: 12.8797, longitude: 121.774 },
  { name: "Finlândia", latitude: 61.9241, longitude: 25.7482 },
  { name: "França", latitude: 46.6034, longitude: 1.8883 },
  { name: "Gabão", latitude: -0.8037, longitude: 11.6094 },
  { name: "Gâmbia", latitude: 13.4432, longitude: -15.3101 },
  { name: "Gana", latitude: 7.6731, longitude: -0.8128 },
  { name: "Geórgia", latitude: 42.3154, longitude: 43.3569 },
  { name: "Granada", latitude: 12.1165, longitude: -61.679 },
  { name: "Grécia", latitude: 39.0742, longitude: 21.8243 },
  { name: "Gana", latitude: 7.6731, longitude: -0.8128 },
  { name: "Guatemala", latitude: 15.7835, longitude: -90.2308 },
  { name: "Guiné", latitude: 9.9456, longitude: -9.6966 },
  { name: "Guiné-Bissau", latitude: 11.8037, longitude: -15.1804 },
  { name: "Guiana", latitude: 4.8604, longitude: -58.9302 },
  { name: "Guiana Francesa", latitude: 3.9339, longitude: -53.1258 },
  { name: "Haiti", latitude: 18.9712, longitude: -72.2852 },
  { name: "Honduras", latitude: 13.5046, longitude: -82.5416 },
  { name: "Hungria", latitude: 47.1625, longitude: 19.5033 },
  { name: "Iémen", latitude: 15.552, longitude: 48.5164 },
  { name: "Ilhas Marshall", latitude: 7.1315, longitude: 171.1845 },
  { name: "Ilhas Salomão", latitude: -9.428, longitude: 160.145 },
  { name: "Índia", latitude: 20.5937, longitude: 78.9629 },
  { name: "Indonésia", latitude: -0.7893, longitude: 113.9213 },
  { name: "Irã", latitude: 32.4279, longitude: 53.688 },
  { name: "Iraque", latitude: 33.2232, longitude: 43.6793 },
  { name: "Irlanda", latitude: 53.4129, longitude: -8.2439 },
  { name: "Islândia", latitude: 64.9631, longitude: -19.0208 },
  { name: "Israel", latitude: 31.0461, longitude: 34.8516 },
  { name: "Itália", latitude: 41.8719, longitude: 12.5674 },
  { name: "Jamaica", latitude: 18.1096, longitude: -77.2975 },
  { name: "Japão", latitude: 36.2048, longitude: 138.2529 },
  { name: "Jordânia", latitude: 30.5852, longitude: 36.2384 },
  { name: "Kiribati", latitude: -3.3704, longitude: -168.734 },
  { name: "Kênia", latitude: -0.0236, longitude: 37.9062 },
  { name: "Laos", latitude: 19.8563, longitude: 102.495 },
  { name: "Lesoto", latitude: -29.6094, longitude: 28.2336 },
  { name: "Letônia", latitude: 56.8796, longitude: 24.6032 },
  { name: "Líbano", latitude: 33.8547, longitude: 35.8623 },
  { name: "Libéria", latitude: 6.4281, longitude: -9.4295 },
  { name: "Líbia", latitude: 26.3351, longitude: 17.2283 },
  { name: "Liechtenstein", latitude: 47.166, longitude: 9.5554 },
  { name: "Lituânia", latitude: 55.1694, longitude: 23.8813 },
  { name: "Luxemburgo", latitude: 49.8153, longitude: 6.1296 },
  { name: "Madagáscar", latitude: -18.7669, longitude: 46.8691 },
  { name: "Malawi", latitude: -13.2543, longitude: 34.3015 },
  { name: "Malásia", latitude: 4.2105, longitude: 101.9758 },
  { name: "Maldivas", latitude: 3.2028, longitude: 73.2207 },
  { name: "Mali", latitude: 17.5707, longitude: -3.9962 },
  { name: "Malta", latitude: 35.9375, longitude: 14.3754 },
  { name: "Marrocos", latitude: 31.7917, longitude: -7.0926 },
  { name: "Maurícia", latitude: -20.348404, longitude: 57.552152 },
  { name: "Mauritânia", latitude: 21.0079, longitude: -10.9408 },
  { name: "México", latitude: 23.6345, longitude: -102.5528 },
  { name: "Moçambique", latitude: -18.6657, longitude: 35.5296 },
  { name: "Moldávia", latitude: 47.4116, longitude: 28.3699 },
  { name: "Mônaco", latitude: 43.7333, longitude: 7.4167 },
  { name: "Mongólia", latitude: 46.8625, longitude: 103.8467 },
  { name: "Montenegro", latitude: 42.7087, longitude: 19.3744 },
  { name: "Marrocos", latitude: 31.7917, longitude: -7.0926 },
  { name: "Myanmar", latitude: 21.9162, longitude: 95.956 },
  { name: "Namíbia", latitude: -22.9576, longitude: 18.4904 },
  { name: "Nauru", latitude: -0.5228, longitude: 166.9315 },
  { name: "Nepal", latitude: 28.3949, longitude: 84.124 },
  { name: "Nicarágua", latitude: 12.8654, longitude: -85.2072 },
  { name: "Nigéria", latitude: 9.082, longitude: 8.6753 },
  { name: "Noruega", latitude: 60.472, longitude: 8.4689 },
  { name: "Nova Zelândia", latitude: -40.9006, longitude: 174.886 },
  { name: "Omã", latitude: 21.5126, longitude: 55.9233 },
  { name: "Paquistão", latitude: 30.3753, longitude: 69.3451 },
  { name: "Palau", latitude: 7.5149, longitude: 134.5825 },
  { name: "Panamá", latitude: 8.9824, longitude: -79.5208 },
  { name: "Papua-Nova Guiné", latitude: -9.45, longitude: 147.15 },
  { name: "Paraguai", latitude: -23.442, longitude: -58.4438 },
  { name: "Países Baixos", latitude: 52.1326, longitude: 5.2913 },
  { name: "Peru", latitude: -9.19, longitude: -75.0152 },
  { name: "Polônia", latitude: 51.9194, longitude: 19.1451 },
  { name: "Portugal", latitude: 39.3999, longitude: -8.2245 },
  { name: "Qatar", latitude: 25.276987, longitude: 51.520008 },
  { name: "Romênia", latitude: 45.9432, longitude: 24.9668 },
  { name: "Ruanda", latitude: -1.9403, longitude: 29.8739 },
  { name: "Rússia", latitude: 61.524, longitude: 105.3188 },
  { name: "São Cristóvão e Névis", latitude: 17.357822, longitude: -62.782998 },
  { name: "São Marino", latitude: 43.9333, longitude: 12.45 },
  { name: "São Tomé e Príncipe", latitude: 0.1866, longitude: 6.6131 },
  { name: "Senegal", latitude: 14.6928, longitude: -14.0068 },
  { name: "Serra Leoa", latitude: 8.46, longitude: -11.7799 },
  { name: "Serbia", latitude: 44.0165, longitude: 21.0059 },
  { name: "Seychelles", latitude: -4.6796, longitude: 55.492 },
  { name: "Singapura", latitude: 1.3521, longitude: 103.8198 },
  { name: "Síria", latitude: 34.8021, longitude: 38.9968 },
  { name: "Somália", latitude: 5.1521, longitude: 46.1996 },
  { name: "Sri Lanka", latitude: 7.8731, longitude: 80.7718 },
  { name: "Suazilândia", latitude: -26.5225, longitude: 31.4659 },
  { name: "Sudão", latitude: 12.8628, longitude: 30.2176 },
  { name: "Suriname", latitude: 3.9193, longitude: -56.0278 },
  { name: "Suécia", latitude: 60.1282, longitude: 18.6435 },
  { name: "Suíça", latitude: 46.8182, longitude: 8.2275 },
  { name: "Tajiquistão", latitude: 38.861, longitude: 71.2761 },
  { name: "Tailândia", latitude: 15.87, longitude: 100.9925 },
  { name: "Timor-Leste", latitude: -8.8742, longitude: 125.7275 },
  { name: "Togo", latitude: 8.6195, longitude: 0.8248 },
  { name: "Tonga", latitude: -21.1789, longitude: -175.1982 },
  { name: "Trinidad e Tobago", latitude: 10.6918, longitude: -61.2225 },
  { name: "Tunísia", latitude: 33.8869, longitude: 9.5375 },
  { name: "Turcomenistão", latitude: 38.9697, longitude: 59.5563 },
  { name: "Turquia", latitude: 38.9637, longitude: 35.2433 },
  { name: "Tuvalu", latitude: -7.1095, longitude: 179.194 },
  { name: "Ucrânia", latitude: 48.3794, longitude: 31.1656 },
  { name: "Uganda", latitude: 1.3733, longitude: 32.2903 },
  { name: "Uruguai", latitude: -32.5228, longitude: -55.7652 },
  { name: "Vanuatu", latitude: -15.3767, longitude: 166.9592 },
  { name: "Vaticano", latitude: 41.9029, longitude: 12.4534 },
  { name: "Venezuela", latitude: 6.4238, longitude: -66.5897 },
  { name: "Vietnã", latitude: 14.0583, longitude: 108.2772 },
  { name: "Zâmbia", latitude: -13.1339, longitude: 27.8493 },
  { name: "Zimbábue", latitude: -19.0154, longitude: 29.1549 },
];

const quizGame = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [currentCountry, setCurrentCountry] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userGuess, setUserGuess] = useState<string>("");
  const [distance, setDistance] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Permissão para acessar localização foi negada"
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const generateQuestion = () => {
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    setCurrentCountry(randomCountry);
    setDistance(null);
    setUserGuess("");
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (location && currentCountry) {
      const distInMeters = getDistance(location, {
        latitude: currentCountry.latitude,
        longitude: currentCountry.longitude,
      });
      const distInKilometers = distInMeters / 1000;
      setDistance(distInKilometers);

      const userGuessInKilometers = parseFloat(userGuess);
      const marginOfError = 600;
      if (
        userGuessInKilometers >= distInKilometers - marginOfError &&
        userGuessInKilometers <= distInKilometers + marginOfError
      ) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }

      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {currentCountry ? (
          <View style={styles.quizContainer}>
            {isCorrect !== null && (
              <Text
                style={[
                  styles.resultText,
                  isCorrect ? styles.correct : styles.incorrect,
                ]}
              >
                {isCorrect ? "Correto!" : "Incorreto!"}
              </Text>
            )}
            <Text style={styles.questionText}>
              Qual a distância até {currentCountry.name}?
            </Text>
            <Text style={styles.subtext}>
              Digite sua resposta em quilômetros:
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={userGuess}
              onChangeText={(text) => setUserGuess(text)}
              placeholder="Digite sua resposta"
              ref={inputRef}
            />

            <View>
              <CustomButton
                label="Verificar"
                onPress={checkAnswer}
                backgroundColor="#21A33F"
                textColor="white"
              />
              {distance !== null && (
                <Text style={styles.resultText}>
                  A distância real é de {distance.toFixed(2)} quilômetros.
                </Text>
              )}
              <CustomButton
                label="Gerar"
                onPress={generateQuestion}
                backgroundColor="#ff5733"
                textColor="#000"
              />
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <CustomButton
              label="Gerar"
              onPress={generateQuestion}
              backgroundColor="#ff5733"
              textColor="#000"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 80,
  },
  quizContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 400,
    //marginTop: 90,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  subtext: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  correct: {
    color: "green",
  },
  incorrect: {
    color: "red",
  },
});

export default quizGame;
