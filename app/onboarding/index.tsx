import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../../lib/supabase";

export default function OnboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [pronouns, setPronouns] = useState<String>("")
  const [quadrant, setQuadrant] = useState<String>("")

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

  const validatePage = async () => {
    const { error } = await supabase
          .from("profiles")
          .update({display_name: name, pronouns: pronouns, quadrant: quadrant, birthday: birthday.replace(/\//g, '-')})
          .eq('id', user.id)
    
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

        <View style={styles.card}>
          <Text style={{ marginBottom: 8, textAlign: "center" }}>
            what's your preferred name?
          </Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.card}>
          <Text style={{ marginBottom: 8, textAlign: "center" }}>
            when's your birthday?
          </Text>
          <TextInput
            placeholder="YYYY/MM/DD"
            style={styles.input}
            value={birthday}
            onChangeText={(text) => setBirthday(formatDate(text))}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.card}>
          <Text style={{ marginBottom: 8, textAlign: "center" }}>
            what are your pronouns?
          </Text>
          <View style={styles.picker}>
            <Picker onValueChange={(itemValue: String) => setPronouns(itemValue)}>
              <Picker.Item label="" value=""  enabled={false} />
              <Picker.Item label="He/Him" value="He/Him" />
              <Picker.Item label="She/Her" value="She/Her" />
              <Picker.Item label="They/Them" value="They/Them" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={{ marginBottom: 8, textAlign: "center" }}>
            which area of calgary do you live in?
          </Text>
          <View style={styles.picker}>
            <Picker onValueChange={(itemValue: String) => setQuadrant(itemValue)}>
              <Picker.Item label="" value="" enabled={false} />
              <Picker.Item label="Southeast" value="SE" />
              <Picker.Item label="Southwest" value="SW" />
              <Picker.Item label="Northeast" value="NE" />
              <Picker.Item label="Northwest" value="NW" />
            </Picker>
          </View>
        </View>

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
  card: {
    backgroundColor: "#f0eaff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    width: "90%",
  },
  title: {
    fontSize: 36,
    fontFamily: "Nunito",
    fontWeight: "800",
    color: "#000",
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 50,
    marginBottom: 12,
    fontSize: 16,
    paddingHorizontal: 20,
    elevation: 2, // for Android
  },
  picker: {
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    elevation: 2,
  },
});
