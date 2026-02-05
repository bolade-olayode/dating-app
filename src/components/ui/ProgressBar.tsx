import { View, ViewStyle } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export interface ProgressProps {
  progress?: number;
  width?: any;
}

export const ProgressBar = ({ progress, width }: ProgressProps) => {
	const styles: ViewStyle = {
    width: typeof progress === "number" ? `${progress}%` : undefined,
    height: "100%",
  };

  return (
    <View
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: 24,
        height: 8,
        overflow: "hidden",
        width: width,
      }}
    >
      <LinearGradient
        colors={["#FE4664", "#FB6320"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles}
      />
    </View>
  );
};

export default ProgressBar;
