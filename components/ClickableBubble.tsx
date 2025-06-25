import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  selected: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
};

const PressableBubble = ({ title, onPress, selected, style }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        selected && styles.selectedContainer,
        style,
      ]}
    >
      <View>
        <Text
          style={[styles.text, selected && styles.selectedText]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 99,
    height: 50,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#9b98f7",
    justifyContent: "center",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    opacity: 1,
    padding: 10,
  },
  selectedContainer: {
    backgroundColor: "cornflowerblue",
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
  },
  text: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
  },
});

export default PressableBubble;
