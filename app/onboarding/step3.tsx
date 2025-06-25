import { useRouter } from "expo-router";
import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import { supabase } from "../../lib/supabase";

export default function ThirdStepScreen() {
  const router = useRouter();

  const finishOnboaring = async () => {
    await supabase.auth.updateUser({
      data: { has_completed_onboarding: true },
    });
    router.dismissTo("/(tabs)/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Image
        source={require("../../assets/Full_Logo_Dark.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Pressable onPress={finishOnboaring}>
        <Text style={styles.start}>tap to start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 48,
    fontFamily: "Nunito",
    fontWeight: "800",
    color: "#000",
    // marginBottom: 20,
  },
  start: {
    fontSize: 24,
    fontWeight: "600",
    color: "#9B98F7",
    marginTop: 20,
  },
  logo: {
    width: "90%",
    height: 170,
    marginBottom: 20,
  },
});
