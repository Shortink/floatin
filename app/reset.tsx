import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Button from "../components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ResetScreen() {
  const router = useRouter();

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      // extraScrollHeight={40}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Placeholder Screen</Text>
        <View style={styles.formContainer}>
          <Button
            title="Go Back"
            onPress={() => router.dismissTo("/welcome")}
            style={styles.loginButton}
          />
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
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 20,
  },
});
