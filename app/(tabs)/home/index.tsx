import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import Button from "../../../components/Button";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const router = useRouter();

  const openProfile = () => {
    router.navigate('/home/profile');
  };

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
    <LinearGradient colors={["#FFF6F3", "#D6BDFA"]} style={{flex: 1, }}>
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Go to Profile" onPress={openProfile} />
      <Button title="Onboard" onPress={resetOnboaring} />
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    // backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
