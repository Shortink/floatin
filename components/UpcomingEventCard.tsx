import { Text, View, Image, StyleSheet } from "react-native";
type EventCardProps = {
  title: string;
  location: string;
  datetime: string;
  imageUrl: string;
};

export default function EventCard({
  title,
  location,
  datetime,
  imageUrl,
}: EventCardProps) {
  const eventDate = new Date(datetime);
  const formattedDate = eventDate.toLocaleDateString("en-Can", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("en-Can", {
    hour: "numeric",
    minute: "numeric",
  });
  return (
    <View style={styles.card}>
      <Text style={styles.headerText}>{title}</Text>
      <View style={{ flexDirection: "row", marginTop: 10, gap: "7%" }}>
        <Image source={{ uri: imageUrl }} style={styles.circleImage} />
        <View>
          <Text style={styles.headerText}>Location:</Text>
          <Text style={styles.text}>{location}</Text>
          <Text style={styles.headerText}>Date:</Text>
          <Text style={styles.text}>{formattedDate}{"\n"}{formattedTime}</Text>
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
    marginBottom: 10,
  },
  circleImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});
