import React from "react";
import { Pressable, StyleSheet, Text, ImageBackground, ViewStyle } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  selected: boolean;
  style?: ViewStyle | ViewStyle[];
};

const PressableBubble = ({ title, onPress, selected, style }: Props) => {
  const image = selected
    ? require("../assets/BlueOutlineBubblev2.png") // selected state
    : require("../assets/BlueOutlineBubblev2.png"); // unselected state
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <ImageBackground
        source={image}
        style={styles.bubble}
        imageStyle={{ borderRadius: 50 }}
      >
        <Text style={[styles.text, selected && styles.selectedText]}>
          {title}
        </Text>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  text: {
    color: "#000",
    fontSize: 18,
  },
  selectedText: {
    color: "#fff",
  },
  bubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PressableBubble;
