import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../../components/Button";
import { supabase } from "../../../lib/supabase";
import { router } from "expo-router";

export default function EventScreen() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/welcome");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Placeholder Settings Page</Text>
      <Button title="Sign out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});
