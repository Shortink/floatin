import { router, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Pressable,
} from "react-native";
import { useAuth } from "../../context/auth";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsIcon from "../../assets/icons/settings.svg";
import GalleryIcon from "../../assets/icons/gallery.svg";

type UserProfile = {
  display_name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  pronouns?: string | null;
  quadrant: string;
  birthday: String;
};

type Interest = {
  id: number;
  name: string;
  category: string;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const [interest, setInterest] = useState<Record<string, Interest[]>>();
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "display_name, email, bio, avatar_url, pronouns, quadrant, birthday"
      )
      .eq("id", user.id)
      .single();

    if (error) console.error("Error fetching user profile:", error);
    if (data) {
      data.avatar_url ??= `https://api.dicebear.com/7.x/thumbs/png?seed=${user.id}`;
    }
    setProfile(data);

    const { data: interests, error: interesterror } = await supabase
      .from("user_interests")
      .select(
        `interests:interest_id (id, name, category:interest_categories(name))`
      )
      .eq(`user_id`, user.id);
    if (interesterror) console.error(interesterror);
    console.log(interests);

    if (interests) {
      const flattened = interests.map((item) => ({
        id: item.interests.id,
        name: item.interests.name,
        category: item.interests.category?.name ?? null,
      }));

      const sorted_interests = flattened?.reduce(
        (acc: Record<string, Interest[]>, interest: Interest) => {
          const { category } = interest;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(interest);
          return acc;
        },
        {}
      );
      setInterest(sorted_interests);
    }
  };
  if (!interest || Object.keys(interest).length === 0) {
    return <Text></Text>;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFF6F3" }}
      edges={["top"]}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFF6F3" }}
        contentContainerStyle={styles.container}
      >
        <View style={{ width: "100%", height: 330 }}>
          <ImageBackground
            source={require("../../assets/shape.png")}
            style={styles.background}
          >
            <View
              style={{
                marginTop: 30,
                paddingHorizontal: 24,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.heading}>My profile</Text>
              <Pressable onPress={() => router.push("(tabs)/profile/settings")}>
                <SettingsIcon width={30} height={30} fill="#66BFD2" />
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Image
                source={{ uri: profile?.avatar_url! }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <Text style={{ fontSize: 32, marginRight: 10 }}>
                  {profile?.display_name}
                </Text>
                <Pressable onPress={() => router.push("(tabs)/profile/gallery")}>
                  <GalleryIcon width={30} height={30} fill="#66BFD2" />
                </Pressable>
              </View>
              <Text style={{ color: "#716C6C" }}>{profile?.pronouns}</Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardtext}>Birthday      {profile?.birthday} </Text>
          <Text style={styles.cardtext}>MBTI</Text>
          <Text style={styles.cardtext}>Quadrant      {profile?.quadrant}</Text>
        </View>

        <View style={styles.about}>
          {Object.entries(interest).map(([category, interestGroup]) => (
            <View key={category} style={styles.aboutsection}>
              <Text
                style={{
                  width: "100%",
                  fontSize: 24,
                  marginBottom: 5,
                }}
              >
                {category || ``}
              </Text>
              {interestGroup.map((option) => (
                <View key={option.name} style={styles.interestbox}>
                  <Text
                    style={{ textAlign: "center", fontSize: 13 }}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {option.name}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFF6F3",
  },
  cardtext: {
    fontWeight: "bold",
    fontSize: 16,
    margin: 3,
  },
  interestbox: {
    width: 81,
    height: 50,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    marginBottom: 15,
    padding: 10,
  },
  about: {
    backgroundColor: "#f2e5f5",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 30,
  },
  aboutsection: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#f2e5f5",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  background: {
    width: "100%",
    height: 200,
    marginTop: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF6F3",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
});
