import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
};

const Button = ({ title, onPress, style, textStyle, disabled }: Props) => {
  return (
    <Pressable
      onPress={!disabled ? onPress : undefined}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFF7F3",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  text: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Button;
