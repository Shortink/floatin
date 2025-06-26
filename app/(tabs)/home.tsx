import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/welcome");
  };

  const resetOnboaring = async () => {
    await supabase.auth.updateUser({
      data: { has_completed_onboarding: false },
    });
    router.replace("/onboarding");
  };

  return (
    // <LinearGradient colors={["#FFF6F3", "#FFF6F3"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button title="Sign Out" onPress={handleSignOut} />
        <Button title="Onboard" onPress={resetOnboaring} />
      </View>
    // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF6F3",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
