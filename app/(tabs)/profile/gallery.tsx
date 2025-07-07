import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { useAuth } from "../../../context/auth";
import { supabase } from "../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsIcon from "../../../assets/icons/settings.svg";
import { router } from "expo-router";

type UserProfile = {
  display_name: string;
  avatar_url: string;
  pronouns: string;
};

type Gallery = {
  image_url: string;
  caption: string;
}[];

export default function GalleryScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [images, setImages] = useState<Gallery>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchImages();
  }, []);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, pronouns")
      .eq("id", user.id)
      .single();
    if (error) console.error("Error fetching user profile:", error);
    setProfile(data);
  };

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("image_url, caption")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching user profile:", error);
    if (data) setImages(data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator />;
  if (!profile) return <ActivityIndicator />;
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
            source={require("../../../assets/shape.png")}
            style={styles.background}
          >
            <View style={styles.headerRow}>
              <Text style={styles.heading}>Gallery</Text>
              <Pressable onPress={() => router.push("(tabs)/profile/settings")}>
                <SettingsIcon width={30} height={30} fill="#66BFD2" />
              </Pressable>
            </View>
            <View style={styles.centered}>
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 32, marginRight: 10 }}>
                  {profile.display_name}
                </Text>
              </View>
              {profile.pronouns && (
                <Text style={{ color: "#716C6C" }}>{profile.pronouns}</Text>
              )}
            </View>
          </ImageBackground>
        </View>

        <View style={{ width: "100%" }}>
          <FlatList
            data={images}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ gap: 24 }}
            renderItem={({ item, index }) => {
              const isEven = index % 2 === 0;
              return (
                <View
                  style={[
                    styles.galleryRow,
                    { flexDirection: isEven ? "row" : "row-reverse" },
                  ]}
                >
                  <View
                    style={[
                      styles.textBubble,
                      {
                        paddingHorizontal: isEven ? 20 : 40,
                      },
                    ]}
                  >
                    <Text style={styles.imageText}>{item.caption}</Text>
                  </View>
                  <Image
                    source={{ uri: item.image_url }}
                    style={[
                      styles.circleImage,
                      {
                        marginLeft: isEven ? -30 : 0,
                        marginRight: isEven ? 0 : -30,
                      },
                    ]}
                  />
                </View>
              );
            }}
            scrollEnabled={false}
          />
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
  text: {
    fontSize: 18,
    color: "#333",
  },
  background: {
    width: "100%",
    height: 210,
    marginTop: 30,
  },
  headerRow: {
    marginTop: 30,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  centered: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF6F3",
  },
  galleryRow: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  textBubble: {
    backgroundColor: "#F2E5F5",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: "100%",
    flexShrink: 1,
  },
  circleImage: {
    width: 150,
    height: 150,
    borderRadius: 85,
    marginLeft: -30, // overlap into the bubble (for row layout)
    zIndex: 1,
  },

  imageText: {
    fontSize: 16,
    fontFamily: "Nunito",
    fontWeight: "800",
    color: "#000",
  },
});
