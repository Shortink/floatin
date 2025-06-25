import { useRouter } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PressableBubble from "../../components/ClickableBubble";
import { useEffect, useState } from "react";

type Interest = {
  id: number;
  name: string;
  category: string;
};

export default function SecondStepScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const [interest, setInterest] = useState();
  const categoryMessages = {
    general: "What are you into?",
    connection_style: "How do you prefer to connect with others?",
    event_type: "Which type of events would you join?",
  };

  useEffect(() => {
    fetchInterest();
  }, []);

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

  const fetchInterest = async () => {
    console.log("Fetching interest list...");
    const { data, error } = await supabase
      .from("interests")
      .select("id, name, category");
    if (error) console.error("Error fetching interest list:", error);

    const interests = data?.reduce(
      (acc: Record<string, Interest>, interest: Interest) => {
        const { category } = interest;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(interest);
        return acc;
      },
      {}
    );
    setInterest(interests);
  };
  if (!interest || Object.keys(interest).length === 0) {
    return <Text></Text>;
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Help us match your energy</Text>

        <View style={styles.textContainer}>
          <Text style={{ textAlign: "center" }}>
            Pick everything that matches your vibe!
          </Text>
        </View>
        {Object.entries(interest).map(([category, interestGroup]) => (
          <View key={category} style={styles.grid}>
            <Text style={{ width: "100%", textAlign: "center", fontSize: 20, marginBottom: 20, }}>
              {categoryMessages[category] || `What are you into?`}
            </Text>
            {interestGroup.map((option) => (
              <PressableBubble
                key={option.name}
                title={option.name}
                selected={selected.includes(option)}
                onPress={() => toggleOption(option)}
              />
            ))}
          </View>
        ))}
        <Button
        title="Next"
        onPress={() => router.push("/onboarding/step3")}
        style={{ marginBottom: 100 }}
      />
      </View>
      
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
    backgroundColor: "#f0eaff",
    borderRadius: 10,
    width: "100%",
    marginBottom: 30,
    paddingVertical: 10,
    borderColor: "#8f8b99",
    borderWidth: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    borderColor: "#8f8b99",
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    // backgroundColor: "#FFFFFF",
    // opacity: 0.5,
    backgroundColor: "#f0eaff",
    marginBottom: 50,
    width: "100%",
    paddingBottom:30,
    paddingTop: 20
  },
});
