import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import GalleryIcon from "../assets/icons/gallery.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import MatchIcon from "../assets/icons/match-icon.svg";
type Interest = {
  id: number;
  name: string;
  category: string;
};

type Props = {
  displayName: string;
  avatarUrl: string;
  pronouns?: string | null;
  quadrant?: string;
  birthday?: String;
  interests?: Record<string, Interest[]>;
  onGalleryPress?: () => void;
  onMatchPress?: () => void;
  onSettingsPress?: () => void;
  ownProfile: boolean;
};

export default function ProfileCard({
  displayName,
  avatarUrl,
  pronouns,
  quadrant,
  birthday,
  interests = {},
  onGalleryPress,
  onMatchPress,
  onSettingsPress,
  ownProfile,
}: Props) {
  return (
    <>
      <View style={{ width: "100%", height: 330 }}>
        <ImageBackground
          source={require("../assets/shape.png")}
          style={styles.background}
        >
          <View style={styles.headerRow}>
            {ownProfile ? (
              <Text style={styles.heading}>My profile</Text>
            ) : (
              <Text style={styles.heading}>Profile</Text>
            )}
            <Pressable onPress={onSettingsPress}>
              <SettingsIcon width={30} height={30} fill="#66BFD2" />
            </Pressable>
          </View>
          <View style={styles.centered}>
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
              {onMatchPress ? (
                <Pressable
                  onPress={onMatchPress}
                  style={{ position: "absolute", top: 0, right: 0 }}
                >
                  <MatchIcon width={30} height={30}  />
                </Pressable>
              ) : null}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 32, marginRight: 10 }}>
                {displayName}
              </Text>
              <Pressable onPress={onGalleryPress}>
                <GalleryIcon width={30} height={30} fill="#66BFD2" />
              </Pressable>
            </View>
            {pronouns && <Text style={{ color: "#716C6C" }}>{pronouns}</Text>}
          </View>
        </ImageBackground>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardtext}>Birthday {birthday}</Text>
        <Text style={styles.cardtext}>MBTI</Text>
        <Text style={styles.cardtext}>Quadrant {quadrant}</Text>
      </View>

      <View style={styles.about}>
        {Object.entries(interests).map(([category, group]) => (
          <View key={category} style={styles.aboutsection}>
            <Text style={{ width: "100%", fontSize: 24, marginBottom: 5 }}>
              {category || ``}
            </Text>
            {group.map((item) => (
              <View key={item.name} style={styles.interestbox}>
                <Text
                  style={{ textAlign: "center", fontSize: 13 }}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                >
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cardtext: {
    fontWeight: "bold",
    fontSize: 16,
    margin: 3,
  },
  spotifyEmbed: {},
  centered: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  headerRow: {
    marginTop: 30,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  interestbox: {
    width: 81,
    height: 50,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    marginBottom: 15,
    padding: 10,
  },
  about: {
    backgroundColor: "#f2e5f5",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 30,
  },
  aboutsection: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#f2e5f5",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  background: {
    width: "100%",
    height: 210,
    marginTop: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF6F3",
  },
});
