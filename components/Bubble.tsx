import React, { useEffect } from "react";
import { Image, useWindowDimensions, ImageSourcePropType } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type BubbleProps = {
  size: number;
  speed: number;
  source: ImageSourcePropType;
};

const MovingImage = ({ size, speed, source }: BubbleProps) => {
  const { height, width } = useWindowDimensions();
  const x = useSharedValue(Math.random() * (width - size));
  const y = useSharedValue(Math.random() * (height - size));
  const dx = useSharedValue(Math.random() < 0.5 ? 1 : -1);
  const dy = useSharedValue(Math.random() < 0.5 ? 1 : -1);

  const move = () => {
    const interval = setInterval(() => {
      x.value += dx.value * speed;
      y.value += dy.value * speed;

      // If bubble goes out of bounds, reset it
      const outOfBounds =
        x.value < -size * 2 ||
        x.value > width + size * 2 ||
        y.value < -size * 2 ||
        y.value > height + size * 2;

      //code to pick a random side the bubble will float in from after "despawning"
      if (outOfBounds) {
        const sides = ["left", "right", "top", "bottom"];
        const side = sides[Math.floor(Math.random() * sides.length)];
        switch (side) {
          case "left":
            x.value = -size * 2;
            y.value = Math.random() * (height - size);
            dx.value = Math.abs(Math.random() * 1.5 + 0.5); // right
            dy.value = (Math.random() - 0.5) * 1.5;
            break;
          case "right":
            x.value = width + size * 2;
            y.value = Math.random() * (height - size);
            dx.value = -Math.abs(Math.random() * 1.5 + 0.5); // left
            dy.value = (Math.random() - 0.5) * 1.5;
            break;
          case "top":
            x.value = Math.random() * (width - size);
            y.value = -size * 2;
            dy.value = Math.abs(Math.random() * 1.5 + 0.5); // down
            dx.value = (Math.random() - 0.5) * 1.5;
            break;
          case "bottom":
            x.value = Math.random() * (width - size);
            y.value = height + size * 2;
            dy.value = -Math.abs(Math.random() * 1.5 + 0.5); // up
            dx.value = (Math.random() - 0.5) * 1.5;
            break;
        }
      }
    }, 16);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const stop = move();
    return stop;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[
        { position: "absolute", width: size, height: size },
        animatedStyle,
      ]}
    >
      <Image
        source={source}
        style={{
          width: size,
          height: size,
        }}
      />
    </Animated.View>
  );
};

export default MovingImage;
