import React from "react";
import { View, StyleSheet, Platform, ViewStyle } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";

interface FlareProps {
	size?: number;
	color?: string;
	style?: ViewStyle;
}

const Flare = ({
	size = Platform.OS === "ios" ? 300 : 200,
	color = "#FF007B",
	style
}: FlareProps) => {
	return (
		<View style={[styles.flareWrapper, { width: size, height: size }, style]} pointerEvents="none">
			<Svg height={size} width={size}>
				<Defs>
					<RadialGradient
						id="grad"
						cx="100%"
						cy="0%"
						rx="100%"
						ry="100%"
						fx="100%"
						fy="0%"
						gradientUnits="userSpaceOnUse"
					>
						<Stop offset="0%" stopColor={color} stopOpacity="0.4" />
						<Stop offset="100%" stopColor="#000000" stopOpacity="0" />
					</RadialGradient>
				</Defs>
				<Rect x="0" y="0" width={size} height={size} fill="url(#grad)" />
			</Svg>
		</View>
	);
};

const styles = StyleSheet.create({
	flareWrapper: {
		position: "absolute",
		top: 0,
		right: 0,
	},
});

export default Flare;
