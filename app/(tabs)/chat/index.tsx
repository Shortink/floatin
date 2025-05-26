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

    const chatIds = chatMemberships?.map((m) => m.chat_id);
    if (!chatIds || chatIds.length === 0) {
      setChats([]);
      setLoading(false);
      return;
    }

    const { data: chatsData } = await supabase
      .from("chat_previews")
      .select("*")
      .in("id", chatIds)
      .order('last_sent_at', { ascending: false }); 

    for (const chat of chatsData ?? []) {
      let title = chat.name || "Chat";
      let avatar_url: string ="https://api.dicebear.com/7.x/thumbs/png?seed=guest";

      if (!chat.is_group) {
        //for direct messages only
        const { data: members } = await supabase
          .from("chat_members")
          .select("user_id")
          .eq("chat_id", chat.id);

        const recipientId = members?.find((m) => m.user_id !== currentUserId)?.user_id;
        if (recipientId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("id", recipientId)
            .single();
          title = profile?.display_name || "User";
          avatar_url = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${recipientId}`;
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
