import { useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useAuth } from "../../../context/auth";
import { supabase } from "../../../lib/supabase";

type UserProfile = {
  display_name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
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
      .select("display_name, email, bio, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) console.error("Error fetching user profile:", error);
    if (data) {
        data.avatar_url ??= `https://api.dicebear.com/7.x/avataaars/png?seed=${user.id}`;
    }
    setProfile(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Image
        source={{ uri: profile?.avatar_url! }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <Text style={styles.label}>Display Name:</Text>
      <Text style={styles.value}>{profile?.display_name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
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
    marginBottom: 20,
    backgroundColor: "#eee",
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
