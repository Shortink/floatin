import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import Bubble from "../../components/Bubble";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";

export default function SecondStepScreen() {
  const router = useRouter();

  const finishOnboaring = async () => {
    await supabase.auth.updateUser({
      data: { has_completed_onboarding: true },
    });
    router.dismissTo("/(tabs)/home");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/welcome");
  };

  return (
    <View style={styles.container}>
      <Button title="Finish" onPress={finishOnboaring} />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
  },
});
