import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";

export default function HomeScreen() {
  const router = useRouter();

  const openProfile = () => {
    router.navigate('/home/profile');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/welcome");
  };

  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Go to Profile" onPress={openProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
