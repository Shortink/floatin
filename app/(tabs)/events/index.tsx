import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlusIcon from "../../../assets/icons/plus.svg";
import EventCard from "../../../components/UpcomingEventCard";
import CommunityMeetupCard from "../../../components/CommunityMeetupCard";
import { router, useFocusEffect, useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/auth";

type UpcomingEvent = {
  id: string;
  title: string;
  location: string;
  datetime: string;
  image_url: string;
  created_by: string | null;
  created_at: string;
  description: string;
};

export default function EventScreen() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchUpcomingEvents();
    }, [])
  );

  //   useEffect(() => {
  //     fetchUpcomingEvents();
  //   }, []);
  const fetchUpcomingEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("created_by", user.id);

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: "#FFF6F3" }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFF6F3" }}
        contentContainerStyle={styles.container}
      >
        <View style={styles.headerRow}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
            Upcoming Events
          </Text>
          <Pressable onPress={() => router.push("(tabs)/events/planevent")}>
            <PlusIcon width={30} height={30} />
          </Pressable>
        </View>
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            location={event.location}
            datetime={event.datetime}
            image_url="https://www.caffesociety.co.uk/assets/recipe-images/latte-small.jpg"
          />
        ))}
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 30 }}>
          Suggestions
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 30 }}>
          Community Meetups
        </Text>
        <CommunityMeetupCard
          imageUrl="https://instagram.fyyc8-1.fna.fbcdn.net/v/t51.2885-19/428913202_3643316795884885_5452409531511378268_n.jpg?stp=dst-jpg_s320x320_tt6&_nc_ht=instagram.fyyc8-1.fna.fbcdn.net&_nc_cat=101&_nc_oc=Q6cZ2QE3bVwa_B44qAkRIQMK2TKAadpGmf_7Ursxsa7QLCyXg1FQx5swNwT9VZyyaFjpEucPXhvNegbiwPfROCUwl7OR&_nc_ohc=9GSnhar9jIkQ7kNvwGh_JPb&_nc_gid=hK2BZB6-O-WqUl-RcFizNA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfQ_DBunBcvAY_RwsipukzPlTK9W1bVtD0fR8-pdVy_7OA&oe=687FEED1&_nc_sid=8b3546"
          title="Calgary Blend"
          description="Calgary Local & International gathering"
        />
        <CommunityMeetupCard
          imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_uTyltrhQ-dYT3u6ukrJG2zj4A-s9Cep29w&s"
          title="Korean Conversation Community"
          description="Multi-cultural community building organization"
        />
        <CommunityMeetupCard
          imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnyvaN_6F558TDkF550prplp7gmIvn0ivV6w&s"
          title="The Social Hub YYC"
          description="Calgary’s communityfor young  adults (20-35)"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerRow: {
    marginTop: 20,
    // paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor:"red"
  },
  text: {
    fontSize: 14,
    color: "black",
  },
});
