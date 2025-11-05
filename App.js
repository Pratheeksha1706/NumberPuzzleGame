import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";



export default function App() {
  const [screen, setScreen] = useState("menu"); // menu or game
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);

  // Number of starting rows based on level
  const levelRows = {
    1: 3,
    2: 5,
    3: 7,
  };

  // Create initial grid based on level
  const generateNumbers = (rows) => {
    let arr = [];
    for (let i = 0; i < rows * 9; i++) {
      arr.push(Math.floor(Math.random() * 9) + 1);
    }
    return arr;
  };

  const [numbers, setNumbers] = useState(generateNumbers(levelRows[1]));
  

  const startGame = (level) => {
    setSelectedLevel(level);
    setNumbers(generateNumbers(levelRows[level]));
    setMatched([]);
    setTimeLeft(120);
    setSelected(null);
    setScreen("game");
  };

  const generateRow = () => {
    let row = [];
    for (let i = 0; i < 9; i++) row.push(Math.floor(Math.random() * 9) + 1);
    return row;
  };

  const addRow = () => {
    const newRow = generateRow();
    const updated = [...newRow, ...numbers];
    if (updated.length > 120) {
      alert("❌ Too many rows! Game over.");
      setScreen("menu");
      return;
    }
    setNumbers(updated);
  };

  // ---------------- Timer -----------------
useEffect(() => {
  if (screen !== "game") return;

  const timer = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        clearInterval(timer);
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [screen]);



  // ---------------- Matching -----------------
  const handlePress = (index) => {
    if (matched.includes(index)) return;

    if (selected === null) {
      setSelected(index);
    } else {
      if (
        numbers[selected] === numbers[index] ||
        numbers[selected] + numbers[index] === 10
      ) {
        setMatched([...matched, selected, index]);
      }
      setSelected(null);
    }
  };

  const goHome = () => {
    setScreen("menu");
  };

  // ---------------- UI -----------------
  if (screen === "menu") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Number Master Puzzle</Text>
        <Text style={styles.subtitle}>Select Level</Text>

        <TouchableOpacity style={styles.levelBtn} onPress={() => startGame(1)}>
          <Text style={styles.btnText}>Level 1 - Easy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.levelBtn} onPress={() => startGame(2)}>
          <Text style={styles.btnText}>Level 2 - Medium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.levelBtn} onPress={() => startGame(3)}>
          <Text style={styles.btnText}>Level 3 - Hard</Text>
        </TouchableOpacity>
      </View>
    );
  }


  // ---------- GAME OVER SCREEN ----------
  if (gameOver) {
    return (
      <View style={styles.container}>
        <Animatable.Text animation="fadeInDown" duration={800} style={styles.title}>
          ⏳ Time's Up!
        </Animatable.Text>
        <Text style={{ marginTop: 10, fontSize: 16 }}>Level {selectedLevel}</Text>

        <TouchableOpacity style={[styles.levelBtn, { marginTop: 20 }]} onPress={goHome}>
          <Text style={styles.btnText}>🏠 Back to Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.levelBtn, { backgroundColor: "green", marginTop: 12 }]}
          onPress={() => startGame(selectedLevel)}
        >
          <Text style={styles.btnText}>🔁 Retry Level {selectedLevel}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  

  // ---------------- Game Screen -----------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Level {selectedLevel}</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

      <TouchableOpacity style={styles.addRowBtn} onPress={addRow}>
        <Text style={styles.addRowText}>+ Add Row</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={goHome}>
        <Text style={styles.backText}>🏠 Exit</Text>
      </TouchableOpacity>

      <View style={styles.grid}>
        {numbers.map((num, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.cell,
              selected === i && !matched.includes(i) && styles.selectedCell,
              matched.includes(i) && styles.matchedCell
            ]}
            onPress={() => handlePress(i)}
          >
            <Text style={[styles.number, matched.includes(i) && styles.fadedNumber]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {timeLeft === 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.gameOverText}>⏳ Time's Up!</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={goHome}>
            <Text style={styles.resetText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 20, marginBottom: 15 },
  timer: { fontSize: 18, color: "red", marginBottom: 5 },
  grid: { flexDirection: "row", flexWrap: "wrap", width: 300 },
  cell: { width: 30, height: 40, backgroundColor: "#ddd", margin: 3, justifyContent: "center", alignItems: "center", borderRadius: 8 },
  selectedCell: { backgroundColor: "#6fa8dc" },
  matchedCell: { backgroundColor: "#bbb" },
  number: { fontSize: 18, fontWeight: "bold" },
  fadedNumber: { opacity: 0.3 },
  levelBtn: { backgroundColor: "#2e86c1", padding: 12, borderRadius: 8, margin: 8, width: 200 },
  btnText: { color: "#fff", fontSize: 18, textAlign: "center" },
  addRowBtn: { backgroundColor: "green", padding: 10, borderRadius: 8, marginBottom: 10 },
  addRowText: { color: "white", fontSize: 18 },
  backBtn: { backgroundColor: "black", padding: 8, borderRadius: 8, marginBottom: 10 },
  backText: { color: "white" },
  gameOverText: { fontSize: 22, fontWeight: "bold", color: "red" },
  resetBtn: { backgroundColor: "black", padding: 10, borderRadius: 8, marginTop: 10 },
  resetText: { color: "white", fontSize: 16 },
});
