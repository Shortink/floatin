import { Link, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";
import Bubble from "../components/Bubble";

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <LinearGradient colors={["#f7f0ff", "#b9a5ec"]} style={styles.container}>
      {[...Array(5)].map((_, i) => (
        <Bubble
          key={i}
          size={Math.random() < 0.5 ? 100 : 200}  //50% chance for size to either be 200 or 100
          speed={Math.random() * 0.5 + 0.5} //random speed between 0.5 and 1
          source={require("../assets/Gradient_Bubble_1.png")}
        />
      ))}
      {/* TODO: Add animated bubbles here */}
      <Image
        source={require("../assets/Full_Logo_Dark.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Button
        title="Sign Up"
        onPress={() => router.push("/signup")}
        style={styles.signupButton}
      />

      <Button
        title="Log In"
        onPress={() => router.push("/login")}
        style={styles.signupButton}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  signupButton: {
    marginTop: 20,
    width: 150
  },
  loginButton: {},
  value: {
    fontSize: 16,
    color: "#333",
  },
  logo: {
    // width: 700,
    height: 170,
    marginBottom: 40,
  },
});
