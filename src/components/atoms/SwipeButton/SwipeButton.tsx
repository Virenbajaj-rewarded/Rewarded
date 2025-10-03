import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { styles } from "./styles";
import { scheduleOnRN } from "react-native-worklets";

const { width } = Dimensions.get("screen");
const SLIDER_WIDTH = width - 40;
const BUTTON_SIZE = 45;
const PADDING = 3;

type SliderButtonProperties = {
  disabled: boolean;
  buttonWidth: number;
  onConfirm: () => Promise<void>;
};
const SliderButton = ({
  disabled,
  buttonWidth,
  onConfirm,
}: SliderButtonProperties) => {
  const position = useSharedValue(PADDING);
  const completed = useSharedValue(false);

  const END_POSITION = useMemo(
    () => buttonWidth - BUTTON_SIZE - PADDING,
    [buttonWidth],
  );

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((e) => {
      position.value = Math.min(
        Math.max(
          PADDING,
          e.translationX + (completed.value ? END_POSITION : PADDING),
        ),
        END_POSITION,
      );
    })
    .onEnd(() => {
      if (position.value > SLIDER_WIDTH / 2) {
        position.value = withSpring(END_POSITION);
        completed.value = true;
        scheduleOnRN(onConfirm);
      } else {
        position.value = withSpring(PADDING);
        completed.value = false;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      position.value,
      [PADDING, SLIDER_WIDTH / 2, END_POSITION],
      ["#6ba7ff", "#3c83f6", "#1a4fb3"],
    );
    return { backgroundColor: bgColor };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: withTiming(completed.value ? 0 : 1, { duration: 200 }),
  }));

  const animatedCompletedTextStyle = useAnimatedStyle(() => ({
    opacity: withTiming(completed.value ? 1 : 0, { duration: 200 }),
  }));

  return (
    <Animated.View
      style={[
        styles.sliderContainer,
        { width: buttonWidth },
        animatedContainerStyle,
      ]}
    >
      <Animated.Text style={[styles.sliderText, animatedTextStyle]}>
        Confirm
      </Animated.Text>
      <Animated.Text style={[styles.sliderText, animatedCompletedTextStyle]}>
        Done
      </Animated.Text>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.swipeBtn,
            {
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              left: PADDING,
            },
            animatedStyle,
          ]}
        >
          <MaterialIcons name={"arrow-left"} size={28} color={"#000"} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default SliderButton;
