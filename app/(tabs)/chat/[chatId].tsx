import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import {
  Actions,
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { useAuth } from "../../../context/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BlurView } from "expo-blur";

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { chatId, displayName, avatarUrl } = useLocalSearchParams<{
    chatId: string;
    displayName: string;
    avatarUrl: string;
  }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const msg = payload.new;
          const formatted = {
            _id: msg.message_id,
            text: msg.content,
            createdAt: new Date(msg.sent_at),
            user: {
              _id: msg.sender_id,
              name: "",
              avatar: `https://api.dicebear.com/7.x/thumbs/png?seed=${msg.sender_id}`,
            },
          };
          setMessages((prev) => GiftedChat.append(prev, [formatted]));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `message_id, chat_id, sender_id, content, sent_at, public_profiles!sender_id(display_name, avatar_url)`
      )
      .eq("chat_id", chatId)
      .order("sent_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      const formattedMessages = data.map((msg: any) => ({
        _id: msg.message_id,
        text: msg.content,
        createdAt: dayjs(msg.sent_at).toDate(),
        user: {
          _id: msg.sender_id,
          name: msg.public_profiles.display_name || "Unknown",
          avatar:
            msg.public_profiles.avatar_url ||
            `https://api.dicebear.com/7.x/thumbs/png?seed=${msg.sender_id}`,
        },
      }));
      setMessages(formattedMessages);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        400
      );
    }
  };

  const onSend = useCallback(
    async (message: IMessage[] = []) => {
      if (message.length === 0) return;

      const msgToSend = message[0];
      const { error } = await supabase.from("messages").insert({
        chat_id: chatId,
        sender_id: user.id,
        content: msgToSend.text.trim(),
      });
      if (error) console.error("Error sending message:", error);
    },
    [chatId, user.id]
  );

  const handleOption = (screen: string) => {
    setVisible(false);
    router.push(screen);
  };

  return (
    <LinearGradient colors={["#FFF6F3", "#D6BDFA"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Entypo name="chevron-left" size={50} color="black" />
          </Pressable>
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Pressable onPress={() => setVisible(true)}>
            <FontAwesome6 name="ellipsis" size={50} color="black" />
          </Pressable>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <BlurView
            intensity={10}
            style={styles.backdrop}
            experimentalBlurMethod="dimezisBlurView"
          >
            <TouchableOpacity
              style={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={1}
              onPress={() => setVisible(false)}
            >
              <View style={styles.overlay}>
                <Pressable
                  style={styles.option}
                  onPress={() => handleOption("(tabs)/events/planevent")}
                >
                  <Text style={styles.optionText}>Plan Event</Text>
                  <Entypo name="plus" size={30} color="black" />
                </Pressable>
                <Pressable
                  style={styles.option}
                  onPress={() => handleOption("PlanEvent")}
                >
                  <Text style={styles.optionText}>Icebreakers</Text>
                  <Entypo name="plus" size={30} color="black" />
                </Pressable>
                <Pressable
                  style={styles.option}
                  onPress={() => handleOption("PlanEvent")}
                >
                  <Text style={styles.optionText}>Invite a friend</Text>
                  <Entypo name="plus" size={30} color="black" />
                </Pressable>
              </View>
            </TouchableOpacity>
          </BlurView>
        </Modal>
        <View style={styles.chatBox}>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{ _id: user.id }}
            renderAvatar={null}
            showAvatarForEveryMessage={true}
            listViewProps={{ showsVerticalScrollIndicator: false }}
            renderBubble={(props) => (
              <Bubble
                {...props}
                wrapperStyle={{
                  left: {
                    backgroundColor: "#D6BDFA",
                    borderRadius: 20,
                    padding: 4,
                    paddingVertical: 8,
                  },
                  right: {
                    backgroundColor: "#D6BDFA",
                    borderRadius: 20,
                    padding: 4,
                    paddingVertical: 8,
                  },
                }}
                textStyle={{
                  left: { color: "black" },
                  right: { color: "black" },
                }}
                renderTime={() => null}
              />
            )}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                containerStyle={{
                  backgroundColor: "#FFF6F3",
                  borderTopWidth: 1,
                  borderWidth: 1,
                  borderColor: "#D6BDFA",
                  borderRadius: 30,
                  marginBottom: 10,
                  marginHorizontal: 10,
                }}
              />
            )}
            renderComposer={(props) => (
              <Composer
                {...props}
                textInputStyle={{
                  backgroundColor: "#FFF6F3",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginLeft: 0,
                  color: "black",
                }}
              />
            )}
            renderActions={(props) => (
              <Actions
                {...props}
                containerStyle={{}}
                icon={() => <Feather name="camera" size={24} color="grey" />}
              />
            )}
            renderSend={(props) => {
              if (props.text!.trim().length === 0) {
                return (
                  <Pressable style={{ padding: 10 }}>
                    <Feather name="mic" size={24} color="grey" />
                  </Pressable>
                );
              }

              return (
                <Send
                  {...props}
                  containerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Feather name="send" size={24} color="black" />
                </Send>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
    height: 80,
    paddingRight: 20,
  },
  chatBox: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFF6F3",
    elevation: 5, // shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: "#FFF6F3",
    marginTop: 80,
    zIndex: 1,
  },
  backdrop: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.4)",
    // backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(214, 189, 250, 0.90)",
    padding: 20,
    borderRadius: 20,
    width: "70%",
  },
  option: {
    textAlign: "center",
    borderWidth: 2,
    margin: 10,
    borderColor: "#A791C7",
    padding: 15,
    borderRadius: 26,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: {
    color: "black",
    fontSize: 18,
    fontFamily: "Poppins",
    marginRight: 10,
    textAlign: "center",
  },
});
