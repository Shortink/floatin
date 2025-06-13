import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function OnboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");

  //prevent user from going back to this screen once onboarding is done
  useEffect(() => {
    if (user?.user_metadata?.has_completed_onboarding) {
      router.replace("/home");
    }
  }, [user]);

  const isFormValid = name.trim() !== "" && birthday.length == 10;

  const formatDate = (text: string) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, "");
    // Format: YYYY/MM/DD
    let formatted = "";
    if (cleaned.length <= 4) {
      formatted = cleaned;
    } else if (cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 4)}/${cleaned.slice(4)}`;
    } else {
      formatted = `${cleaned.slice(0, 4)}/${cleaned.slice(
        4,
        6
      )}/${cleaned.slice(6, 8)}`;
    }
    return formatted;
  };

  const validatePage = () => {
    router.push("/onboarding/step2");
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Let's get to know you</Text>
        <TextInput
          placeholder="What's your preferred name?"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="YYYY/MM/DD"
          style={styles.input}
          value={birthday}
          onChangeText={(text) => setBirthday(formatDate(text))}
          keyboardType="numeric"
          maxLength={10}
        />
        <Button title="Next" onPress={validatePage} disabled={!isFormValid} />
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
    fontSize: 36,
    fontFamily: "Nunito",
    fontWeight: "800",
    color: "#000",
    marginBottom: 40,
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
});
