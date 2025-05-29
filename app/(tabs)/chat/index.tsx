import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Button,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatPreview = {
  id: string;
  name: string | null;
  is_group: boolean;
  last_message?: string;
  last_sent_at?: string;
  avatar: string;
};

export default function ChatListScreen() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchChats(true); // first load shows spinner
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchChats(false); // background refetch, no spinner
    }, [])
  );

  const deleteGroupChat = async () => {
    const response = await supabase
      .from("chats")
      .delete()
      .eq("is_group", true)
  }

  const makeGroupChats = async () => {
    console.log("Creating group chat with all users...");
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user.id;
    if (!currentUserId) return; //if theres no signed in user for some reason

    const { data: allUsers } = await supabase.from("profiles").select("id");
    const { data: groupChat } = await supabase
      .from("chats")
      .insert({ is_group: true, name: "New Group Chat" })
      .select("*")
      .single();

    console.log("Created group chat:", groupChat);
    for (const user of allUsers ?? []) {
      console.log("Adding user to group chat:", user.id);
      if (!groupChat) return;

      await supabase
        .from("chat_members")
        .insert({ chat_id: groupChat.id, user_id: user.id });
    }

    fetchChats(false);
  };

  const fetchChats = async (showLoading = false) => {
    
    const chatPreviews: ChatPreview[] = [];
    if (showLoading) setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user.id;
    if (!currentUserId) return; //if theres no signed in user for some reason

    const { data: chatMemberships } = await supabase
      .from("chat_members")
      .select("chat_id")
      .eq("user_id", currentUserId);

    console.log("Chat memberships for user:", currentUserId, chatMemberships);

    const chatIds = chatMemberships?.map((m) => m.chat_id);
    if (!chatIds || chatIds.length === 0) {
      setChats([]);
      setLoading(false);
      return;
    }

    console.log("Fetching chats for user:", currentUserId);
    const { data: chatsData } = await supabase
      .from("chat_previews")
      .select("*")
      .in("id", chatIds)
      .order("last_sent_at", { ascending: false });
    console.log("Fetched chats:", chatsData);

    for (const chat of chatsData ?? []) {
      let title = chat.name || "Group Chat";
      let avatar_url: string =
        `https://api.dicebear.com/7.x/thumbs/png?seed=${chat.id}`;

      if (!chat.is_group) {
        //for direct messages only
        console.log("Fetching recipient for chat:");
        const { data: members } = await supabase
          .from("chat_members")
          .select("user_id")
          .eq("chat_id", chat.id);

        const recipientId = members?.find(
          (m) => m.user_id !== currentUserId
        )?.user_id;
        console.log("recipientId:", recipientId);
        if (recipientId) {
          
          const { data: profile } = await supabase
            .from("public_profiles")
            .select("display_name, avatar_url")
            .eq("id", recipientId)
            .single();
          title = profile?.display_name || "User";
          avatar_url =
            profile?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/png?seed=${recipientId}`;
        }
      }

      chatPreviews.push({
        id: chat.id,
        name: title,
        is_group: chat.is_group,
        avatar: avatar_url,
        last_message: chat.last_message ?? null,
        last_sent_at: chat.last_sent_at ?? null,
      });
    }
    setChats(chatPreviews);
    setLoading(false);
  };

  const openChat = (chatId: string) => {
    router.navigate(`/chat/${chatId}`);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openChat(item.id)}
            style={styles.chatItem}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatText}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.lastMessage}>
                {item.last_message || "No messages yet"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Button
        onPress={makeGroupChats}
        title="Add all users to a group chat (for testing)"
        color="green"
      />
      <Button
        onPress={deleteGroupChat}
        title="Delete all users to a group chat (for testing)"
        color="red"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  chatItem: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  chatText: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  lastMessage: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
