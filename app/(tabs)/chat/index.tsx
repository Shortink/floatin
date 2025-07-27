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
  Pressable,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";

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
  const [friend, setFriend] = useState("");
  useEffect(() => {
    fetchChats(true); // first load shows spinner
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchChats(false); // background refetch, no spinner
    }, [])
  );

  const deleteGroupChat = async () => {
    const response = await supabase.from("chats").delete().eq("is_group", true);
  };

  const makeGroupChats = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user.id;
    if (!currentUserId) return; //if theres no signed in user for some reason

    const { data: allUsers } = await supabase
      .from("public_profiles")
      .select("id");
    const { data: groupChat } = await supabase
      .from("chats")
      .insert({ is_group: true, name: "New Group Chat" })
      .select("*")
      .single();

    for (const user of allUsers ?? []) {
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
      .order("last_sent_at", { ascending: false });

    for (const chat of chatsData ?? []) {
      let title = chat.name || "Group Chat";
      let avatar_url: string = `https://api.dicebear.com/7.x/thumbs/png?seed=${chat.id}`;

      if (!chat.is_group) {
        //for direct messages only
        const { data: members } = await supabase
          .from("chat_members")
          .select("user_id")
          .eq("chat_id", chat.id);

        const recipientId = members?.find(
          (m) => m.user_id !== currentUserId
        )?.user_id;
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
    // router.navigate(`/chat/${chatId}`);
    router.navigate({
      pathname: `/chat/${chatId}`,
      params: {
        displayName: chats.find((c) => c.id === chatId)?.name || "Chat",
        avatarUrl: chats.find((c) => c.id === chatId)?.avatar || "",
      },
    });
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF6F3" }}>
      <LinearGradient colors={["#FFF6F3", "#D6BDFA"]} style={styles.topView}>
        <View style={styles.headerRow}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Chats</Text>
        </View>
      </LinearGradient>
      <View style={{ padding: 10, paddingHorizontal: 20 }}>
        <TextInput
          style={styles.input}
          placeholder="Search friends"
          placeholderTextColor="#949494"
          value={friend}
          onChangeText={setFriend}
        />
      </View>
      <View>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            gap: 30,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openChat(item.id)}>
              <Image source={{ uri: item.avatar }} style={styles.pinAvatar} />
              <Text
                style={styles.pinName}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                {item.name}{" "}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 25 }}
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
      {/* <Button
        onPress={makeGroupChats}
        title="Add all users to a group chat (for testing)"
        color="green"
      />
      <Button
        onPress={deleteGroupChat}
        title="Delete all users from group chat (for testing)"
        color="red"
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  topView: {
    height: 100,
    // borderBottomLeftRadius: 38,
    borderRadius: 20,
    padding: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  chatItem: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "lavender",
  },
  pinName: {
    textAlign: "center",
    width: 70,
    fontSize: 14,
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
  pinAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    color: "grey",
    marginTop: 2,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D6BDFA",
    height: 50,
    borderRadius: 50,
    marginBottom: 12,
    fontSize: 15,
    paddingHorizontal: 20,
  },
});
