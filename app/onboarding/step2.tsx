import { useRouter } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PressableBubble from "../../components/ClickableBubble";
import { useState } from "react";

export default function SecondStepScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const options = ["Music", "Food", "Movies", "Sports", "Nature", "Gaming", "Arts"];
  
  const toggleOption = (option: string) => {
    setSelected((prev) => {
      // Check if the item is already in the array
      const isSelected = prev.includes(option);
      if (isSelected) {
        // Remove it
        return prev.filter((i) => i !== option);
      } else {
        // Add it
        return [...prev, option];
      }
    });
  };

  const fetchIntrest = async () => {
    const { data, error } = await supabase
      .from("interests")
      .select("id, name, category");
    if (error) console.error("Error fetching intrest list:", error);
    console.log(data);

    
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Help us match your energy</Text>
        
        <View style={styles.textContainer}>
          <Text style={{textAlign: "center"}}>Pick everything that matches your vibe!</Text>
        </View>
        <View style={styles.grid}>
          <Text style={{ width: "100%", textAlign: "center" }}>
            What are you into?
          </Text>
          {options.map((option, index) => (
            <PressableBubble
              key={option}
              title={option}
              selected={selected.includes(option)}
              onPress={() => toggleOption(option)}
            />
          ))}
        </View>

        <View style={styles.grid}>
          <PressableBubble
            selected={false}
            title={"hello"}
            onPress={() => fetchIntrest()}
          />
        </View>

        <View style={styles.grid}>
          {options.map((option) => (
            <PressableBubble
              key={option}
              title={option}
              selected={selected.includes(option)}
              onPress={() => toggleOption(option)}
            />
          ))}
        </View>
      </View>
      <Button title="Next" onPress={()=> router.push("/onboarding/step3")} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: "Nunito",
    fontWeight: "800",
    color: "#000",
    marginBottom: 40,
    marginTop: 100,
    textAlign: "center",
  },
  textContainer: {
    backgroundColor: "#f7f0ff",
    borderRadius: 10,
    width: "100%",
    marginBottom: 30,
    paddingVertical: 10
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    // backgroundColor: "#f7f0ff",
    marginBottom: 50,
    width: "100%",
  },
});
