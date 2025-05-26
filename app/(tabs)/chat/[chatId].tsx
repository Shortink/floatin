import { useEffect, useState, useRef,  useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { supabase } from '../../../lib/supabase';
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from 'dayjs';

type Message = {
  message_id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  profiles: {
    display_name: string ;
  };
};

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(`message_id, chat_id, sender_id, content, sent_at, profiles!sender_id(display_name)`)
      .eq("chat_id", chatId)
      .order("sent_at", { ascending: true });

    console.log(data)
    if (error) console.log(error);
    if (!error && data) setMessages(data as unknown as Message[]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    const { error } = await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: userId,
      content: input.trim(),
    });

    if (!error) {
      setInput("");
      fetchMessages();
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        400
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) =>
              item.id || item.message_id || item.created_at
            }
            renderItem={({ item }) => (
              <View style={styles.message}>
                <Text style={styles.sender}>{item.profiles.display_name} • {dayjs(item.sent_at).format('h:mm A')}</Text>
                <Text>{item.content}</Text>
              </View>
            )}
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Type a message..."
              style={styles.input}
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={{ color: "white" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "red" },
  keyboardContainer: { flex: 1, backgroundColor: "blue" },
  message: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  sender: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
