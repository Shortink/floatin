import {
  Pressable,
  Text,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
} from "react-native";

type Props = {
  name: string;
  interests: string[];
  birthday: string;
  onPress: () => void;
};

const ProfileBubble = ({ name, interests, birthday, onPress }: Props) => {
  const { width } = useWindowDimensions();
  const size = Math.min(width * 0.6, 280);

  const getAge = () => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthday =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasHadBirthday) {
      age--;
    }
    return age;
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
      }}
    >
      <ImageBackground
        source={require("../assets/ProfileBubbleV2.png")}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: "center",
          alignItems: "center",
          padding: 30,
        }}
        resizeMode="cover"
      >
        <Text style={styles.name}>
          {name} | {getAge()}
        </Text>
        <Text style={styles.interests}>Interests: {interests.join(", ")}</Text>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  interests: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default ProfileBubble;
