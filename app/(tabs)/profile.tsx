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
import SettingsIcon from "../../../assets/icons/settings.svg";
import GalleryIcon from "../../../assets/icons/gallery.svg";

type UserProfile = {
  display_name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  pronouns?: string | null;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, email, bio, avatar_url, pronouns, user_interests()")
      .eq("id", user.id)
      .single();

    if (error) console.error("Error fetching user profile:", error);
    if (data) {
      data.avatar_url ??= `https://api.dicebear.com/7.x/avataaars/png?seed=${user.id}`;
    }
    setProfile(data);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF6F3" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFF6F3" }}
        contentContainerStyle={styles.container}
      >
        <ImageBackground
          source={require("../../../assets/shape.png")}
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
              <SettingsIcon
                width={30}
                height={30}
                fill="#66BFD2"
                // onPress={() => navigation.navigate("settings")}
              />
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
                <GalleryIcon
                  width={30}
                  height={30}
                  fill="#66BFD2"
                  // onPress={() => navigation.navigate("gallery")}
                />
              </Pressable>
            </View>
            <Text style={{color:"#716C6C"}}>{profile?.pronouns}</Text>
          </View>

          <View style={styles.card}>
            <Text>Birthday</Text>
            <Text>MBTI</Text>
            <Text>Quadrant</Text>
          </View>

          <View>
            
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFF6F3",
  },
  card: {
    backgroundColor: "#D6BDFA",
    width: "100%",
    padding: 20,
    borderRadius: 7,
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
