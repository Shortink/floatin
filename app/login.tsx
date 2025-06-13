import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./../context/auth";
import Button from "../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    try {
      const user: any = await login(email, password);
      if (user?.user_metadata.has_completed_onboarding === "false") {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      // extraScrollHeight={40}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="Login"
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={!isFormValid}
          />
          <TouchableOpacity onPress={() => router.push("/reset")}>
            <Text style={styles.registerText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#000",
    marginBottom: 40,
    fontFamily: 'Nunito',
    fontWeight: '800'
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 22,
    marginBottom: 12,
    fontSize: 16,
    shadowColor: "#000",
    paddingHorizontal: 20,
    elevation: 2, // for Android
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: "black",
    textDecorationLine: "underline",
    marginBottom: 30,
  },
});
