import { Text, View, Image, StyleSheet } from "react-native";

type CommunityMeetupProps = {
  title: string;
  description: string;
  imageUrl: string;
};

export default function CommunityMeetupCard({
  title,
  description,
  imageUrl,
}: CommunityMeetupProps) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", gap: "7%" }}>
        <Image source={{ uri: imageUrl }} style={styles.circleImage} />
        <View style={{ flexShrink: 1, justifyContent: "center" }}>
          <Text style={styles.headerText}>{title}</Text>
          <Text style={styles.text}>{description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 16,
    color: "black",
  },
  text: {
    fontSize: 14,
    color: "black",
  },
  card: {
    backgroundColor: "#e9f5ec",
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  circleImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
});
