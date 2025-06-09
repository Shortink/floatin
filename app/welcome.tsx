import { useRouter } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import Button from "../components/Button";
import Bubble from "../components/Bubble";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, i) => (
        <Bubble
          key={i}
          size={Math.random() < 0.5 ? 100 : 200} //50% chance for size to either be 200 or 100
          speed={Math.random() * 0.5 + 0.5} //random speed between 0.5 and 1
          source={require("../assets/Gradient_Bubble_1.png")}
        />
      ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButton: {
    marginTop: 20,
    width: 150,
  },
  logo: {
    height: 170,
    marginBottom: 40,
  },
});
