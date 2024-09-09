import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert } from "react-native";

const initialBoard = ["", "", "", "", "", "", "", "", ""];

export default function TicTacToe() {
  const [board, setBoard] = useState<string[]>(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );

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
      // Computador joga aleatório às vezes no nível "medium"
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

  const announceWinner = (winner: string) => {
    if (winner === "draw") {
      Alert.alert("Empate!", "A partida terminou em empate.");
    } else {
      Alert.alert("Fim de Jogo!", `${winner} venceu!`);
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
}

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
