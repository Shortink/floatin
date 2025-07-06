import React from "react";
import { View, StyleSheet, Dimensions, useWindowDimensions } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";

// const { width, height } = Dimensions.get("window");


export default function RadialGradientBackground({ children }: { children: React.ReactNode }) {
  const {height, width} = useWindowDimensions();
  return (
    <View style={styles.container}>
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%" cy="50%"
            r="80%" // approximate
            fx="50%" fy="50%"
          >
            <Stop offset="0%" stopColor="#D6BDFA" stopOpacity="1" />
            <Stop offset="81%" stopColor="#FFF6F3" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFF6F3" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
      </Svg>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
