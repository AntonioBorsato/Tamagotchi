import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  TamagochiDatabase,
  useTamagochiDatabase,
} from "@/db/useTamagochiDatabase";

const initialBoard = ["", "", "", "", "", "", "", "", ""];

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<string[]>(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [tamagochi, setTamagochi] = useState<TamagochiDatabase | null>(null);
  const tamagochiDatabase = useTamagochiDatabase();
  const route = useRoute();
  const { id } = route.params as { id: number };

  useEffect(() => {
    const fetchTamagochi = async () => {
      try {
        if (id !== undefined && id !== null) {
          console.log(`Buscando Tamagochi com ID: ´${id}`); // Verificação de id e interpolação com crases
          const fetchedTamagochi = await tamagochiDatabase.show(id);
          if (fetchedTamagochi) {
            setTamagochi(fetchedTamagochi);
          } else {
            console.error("Tamagochi não encontrado para o ID fornecido.");
          }
        } else {
          console.error("ID inválido ou indefinido.");
        }
      } catch (error) {
        console.error("Erro ao buscar o Tamagochi:", error);
      }
    };
    fetchTamagochi();
  }, [id]);

  const checkWinner = (board: string[]): string | null => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((square) => square !== "")) {
      return "draw";
    }

    return null;
  };

  const computerMove = (newBoard: string[], level: string) => {
    let availableMoves = newBoard
      .map((value, index) => (value === "" ? index : null))
      .filter((value) => value !== null) as number[];

    if (level === "hard") {
      for (let player of ["O", "X"]) {
        for (let move of availableMoves) {
          const testBoard = [...newBoard];
          testBoard[move] = player;
          if (checkWinner(testBoard)) {
            return move;
          }
        }
      }
    }

    if (level === "medium" && Math.random() > 0.5) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const handlePress = (index: number) => {
    if (board[index] !== "" || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      announceWinner(winner);
    } else {
      setTimeout(() => {
        const move = computerMove(newBoard, difficulty);
        if (move !== undefined) {
          newBoard[move] = "O";
          setBoard(newBoard);
        }
        const result = checkWinner(newBoard);
        if (result) {
          announceWinner(result);
        } else {
          setIsPlayerTurn(true);
        }
      }, 500);
    }
  };

  const updateTamagochi = async (newFun: number) => {
    if (tamagochi) {
      try {
        console.log(`Atualizando Tamagochi com ID: ${tamagochi.id}`); // Interpolação com crases
        await tamagochiDatabase.update({
          id: tamagochi.id,
          name: tamagochi.name,
          hunger: tamagochi.hunger,
          sleep: tamagochi.sleep,
          fun: newFun,
          image: tamagochi.image,
        });
        console.log("Tamagochi atualizado com sucesso com diversão:", newFun);
        setTamagochi({ ...tamagochi, fun: newFun });
      } catch (error) {
        console.error("Erro ao atualizar o Tamagochi:", error);
      }
    } else {
      console.error("Tamagochi não encontrado para atualização.");
    }
  };

  const announceWinner = async (winner: string) => {
    console.log("Anunciando vencedor:", winner);

    if (winner === "draw") {
      Alert.alert("Empate!", "A partida terminou em empate.");
    } else {
      Alert.alert("Fim de Jogo!", `${winner} venceu!`); // Interpolação correta com crases
      if (winner === "X") {
        try {
          if (tamagochi) {
            const newFun = Math.min(tamagochi.fun + 10, 100);
            console.log("Atualizando diversão para:", newFun);
            await updateTamagochi(newFun);
          } else {
            console.error("Tamagochi não encontrado para o ID fornecido.");
          }
        } catch (error) {
          console.error("Erro ao atualizar diversão:", error);
        }
      }
    }

    resetGame();
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Velha</Text>
      <View style={styles.difficultyContainer}>
        <Button
          title="Fácil"
          onPress={() => setDifficulty("easy")}
          color={difficulty === "easy" ? "#4CAF50" : "#2196F3"}
        />
        <Button
          title="Médio"
          onPress={() => setDifficulty("medium")}
          color={difficulty === "medium" ? "#4CAF50" : "#2196F3"}
        />
        <Button
          title="Difícil"
          onPress={() => setDifficulty("hard")}
          color={difficulty === "hard" ? "#4CAF50" : "#2196F3"}
        />
      </View>
      <View style={styles.board}>
        {board.map((square, index) => (
          <TouchableOpacity
            key={index}
            style={styles.square}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.squareText}>{square}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Reiniciar" onPress={resetGame} color="#f44336" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  difficultyContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    borderColor: "#333",
    borderWidth: 2,
  },
  square: {
    width: "33.33%",
    height: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#333",
    borderWidth: 1,
  },
  squareText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
});

export default TicTacToe;
