import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileBubble from "../../components/ProfileBubble";
import { useAuth } from "../../context/auth";
import LeftArrow from "../../assets/icons/LeftArrow.svg";
import RightArrow from "../../assets/icons/RightArrow.svg";
import RadialGradientBackground from "../../components/RadialGradient";
import { Calendar } from "react-native-calendars";

type UserProfile = {
  id: string;
  display_name: string;
  birthday: string;
  interests: string[];
};

export default function HomeScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<UserProfile[]>();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("en-CA"); // format: YYYY-MM-DD

  useEffect(() => {
    if (user.id) {
      fetchUserProfiles();
    }
  }, [user]);

  const fetchUserProfiles = async () => {
    const { data, error } = await supabase
      .from("public_profiles")
      .select(
        `
        id,
        display_name,
        birthday,
        user_interests (
        interest_id,
        interests (
        id,
        name)
        )
      `
      )
      .neq("id", user.id);
    if (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
      return;
    }
    const flattened = data?.map((user) => ({
      id: user.id,
      display_name: user.display_name,
      birthday: user.birthday,
      interests: user.user_interests
        .map((user_interest: any) => user_interest.interests?.name)
        .filter(Boolean),
    }));
    if (flattened) setProfiles(flattened);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator />;

  if (!profiles || profiles.length === 0) return <ActivityIndicator />;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? profiles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === profiles.length - 1 ? 0 : prev + 1));
  };
  const currentProfile = profiles[currentIndex];

  return (
    <RadialGradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.title}>Meet{"\n"} new people</Text>
          <View style={styles.profileWrapper}>
            <TouchableOpacity onPress={handlePrev}>
              <View>
                <LeftArrow width={37} height={71} />
              </View>
            </TouchableOpacity>

            <ProfileBubble
              name={currentProfile.display_name}
              interests={currentProfile.interests}
              birthday={currentProfile.birthday}
              onPress={() => router.navigate(`(tabs)/${currentProfile.id}`)}
            />
            <TouchableOpacity onPress={handleNext}>
              <RightArrow width={37} height={71} />
            </TouchableOpacity>
          </View>

          <Text style={styles.text}>My Calendar</Text>
          <View style={styles.calendarWrapper}>
            <Calendar
              hideExtraDays={true}
              style={{ borderRadius: 15 }}
              theme={{
                calendarBackground: "#f3ebe8",
                monthTextColor: 'rgba(74, 86, 96, 0.8)',
                textMonthFontSize: 20,
                textMonthFontWeight: "800",
                textMonthFontFamily: "Nunito",
              }}
              markedDates={{
                [today]: { selected: true, selectedColor: "#9b98f7" },
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </RadialGradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  profileWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 20,
    marginTop: 60,
  },
  calendarWrapper: {
    borderRadius: 15,
    margin: 15,
    overflow: "hidden",
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android Shadow
    elevation: 6,
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Nunito",
    fontWeight: "800",
    color: "#000",
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontFamily: "Nunito",
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginTop: 100,
  },
});
