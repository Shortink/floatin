import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  selected: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
};

const PressableBubble = ({
  title,
  onPress,
  selected,
  style,
}: Props) => {
  const background = selected
    ? ["#fff7f3", "#ffd2ec"] // selected state
    : ["#fff7f3", "##020630"]; // unselected state
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <LinearGradient
        colors={["#fff7f3", "#ffd2ec"]}
        style={styles.gradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.text, selected && styles.selectedText]}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 81,
    height: 50,
    margin: 15,
    borderRadius: 10,
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center'
  },
  text: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
  },
});

export default PressableBubble;
