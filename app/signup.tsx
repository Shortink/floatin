"use client";
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
import { supabase } from "../lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignupScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, user } = useAuth();

  const isFormValid =
    userName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  const checkUsernameAvailable = async (userName: string) => {
    const { data, error } = await supabase
      .from("public_profiles")
      .select("id")
      .eq("user_name", userName)
      .maybeSingle();
    if (error) {
      throw new Error("Failed to check username.");
    }
    return !data; // true if available
  };

  const handleSignup = async () => {
    const isAvailable = await checkUsernameAvailable(userName);
    if (!isAvailable) {
      Alert.alert("Username Taken", "Please choose another username.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    if (password != confirmPassword) {
      Alert.alert("Invalid Password", "Password must be the same");
      return;
    }
    try {
      await signup("", "", userName, email, password);
      Alert.alert("Success", "Account created successfully!");
      console.log(user?.user_metadata.has_completed_onboarding);
      if (!user?.user_metadata.has_completed_onboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      Alert.alert("Signup Error", error?.message ?? "Something went wrong.");
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
        <Text style={styles.title}>Let's Get Started</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="grey"
            value={userName}
            onChangeText={setUserName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="grey"
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Button
            title="Sign Up"
            onPress={handleSignup}
            style={styles.loginButton}
            disabled={!isFormValid}
          />

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.registerText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
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
    marginTop: 20,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  registerText: {
    fontSize: 14,
    color: "black",
    textDecorationLine: "underline",
    marginBottom: 30,
  },
});
