import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/auth";

type Friendship = {
  id: string;
  user_id: string;
  friend_id: string;
  requested_by: string;
};

type Chat = {
  id: string;
};

export default function LikesScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Friendship[]>();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from("friendship")
      .select("id, user_id, friend_id, requested_by")
      .eq("status", "pending")
      .neq("requested_by", user.id);
    if (error) {
      console.log(error);
    } else if (Array.isArray(data) && data.length === 0) {
      console.log("Returned array is empty!");
    } else {
      setRequests(data);
    }
  };

  //TODO move to supabase function to integrate transaction
  const handleAccept = async (friend: Friendship) => {
    //This is important to ensure users always gets added to chats table in the same order
    //Makes sure duplicate chats wont get created between the same users (Check constraint(userA, userB) )
    const [userA, userB] = [friend.user_id, friend.friend_id].sort();
    const { error } = await supabase
      .from("friendship")
      .update({ status: "accepted" })
      .eq("id", friend.id);
    if (error) {
      console.log(error);
      return;
    }

    //check if chat already exists
    const { data: existingChats } = await supabase
      .from("chats")
      .select("id")
      .eq("is_group", false)
      .eq("participant_1", userA)
      .eq("participant_2", userB);
    if (!existingChats) return;

    if (existingChats.length === 0) {
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert({ is_group: false, participant_1: userA, participant_2: userB })
        .select("id")
        .single();
      const chat = newChat as Chat;

      if (chatError || !newChat) {
        console.log(chatError);
        return;
      }

      const { error: membersError } = await supabase
        .from("chat_members")
        .insert([
          { chat_id: chat.id, user_id: friend.user_id },
          { chat_id: chat.id, user_id: friend.friend_id },
        ]);
      if (membersError) {
        console.log(membersError);
        return;
      }
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("friendship").delete().eq("id", id);
    if (error) console.log(error);
    else fetchMatches();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF6F3" }}>
      <LinearGradient colors={["#FFF6F3", "#D6BDFA"]} style={styles.topView}>
        <View style={styles.headerRow}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Your Matches</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No pending requests.</Text>}
        renderItem={({ item }: { item: Friendship }) => (
          <View style={styles.requestItem}>
            <Text>{item.user_id}</Text>
            <View style={styles.buttons}>
              <Button title="Accept" onPress={() => handleAccept(item)} />
              <Button title="Reject" onPress={() => handleReject(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  topView: {
    height: 100,
    borderRadius: 20,
    padding: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  requestItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  buttons: { flexDirection: "row", marginTop: 10, gap: 10 },
});
