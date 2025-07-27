import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCard from "../../components/ProfileCard";

type UserProfile = {
  display_name: string;
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

export default function OtherProfile() {
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [interest, setInterest] = useState<Record<string, Interest[]>>();

  useEffect(() => {
    if (userId) {
      setProfile(null);
      setInterest(undefined);
      setLoading(true);
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from("public_profiles")
      .select("display_name, bio, avatar_url, pronouns, quadrant, birthday")
      .eq("id", userId)
      .single();

    if (error) console.error("Error fetching user profile:", error);
    if (data) {
      data.avatar_url ??= `https://api.dicebear.com/7.x/thumbs/png?seed=${userId}`;
    }
    setProfile(data);

    const { data: interests, error: interesterror } = await supabase
      .from("user_interests")
      .select(
        `interests:interest_id (id, name, category:interest_categories(name))`
      )
      .eq(`user_id`, userId);
    if (interesterror) console.error(interesterror);
    if (interests) {
      const flattened = interests.map((item: any) => ({
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
      setLoading(false);
    }
  };

  const handleMatch = () => {
    console.log("Match button pressed");
  }
  const matched = true; // Placeholder for match check logic

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
        <ProfileCard
          ownProfile={false}
          displayName={profile.display_name}
          avatarUrl={profile.avatar_url!}
          pronouns={profile.pronouns}
          quadrant={profile.quadrant}
          birthday={profile.birthday}
          interests={interest}
          onGalleryPress={() => router.navigate(`(tabs)/gallery/${userId}`)}
          onSettingsPress={() => router.push("(tabs)/profile/settings")}
          onMatchPress={handleMatch}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFF6F3",
  },
});
