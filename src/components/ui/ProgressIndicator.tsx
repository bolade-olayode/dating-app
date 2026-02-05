import React from "react";
import { View, StyleSheet } from "react-native";
import Icons, { IconsType } from "./Icons";

interface ProgressIndicatorProps {
	step: number;
	totalSteps?: number;
}

const ProgressIndicator = ({ step, totalSteps = 5 }: ProgressIndicatorProps) => {
	const hearts = Array.from({ length: totalSteps }, (_, i) => i + 1);

	return (
		<View style={styles.progressContainer}>
			<View style={styles.progressTrack}>
				<View style={styles.innerLine} />
				<View style={styles.heartsRow}>
					{hearts.map((i) => {
						const isCompleted = i < step;
						const isActive = i === step;
						return (
							<View key={i} style={styles.heartItem}>
								<Icons
									type={IconsType.MaterialCommunityIcons}
									name="heart"
									size={isActive ? 32 : 18}
									color={isCompleted || isActive ? "#FF007B" : "#9B1B4B"}
									style={{ opacity: isCompleted || isActive ? 1 : 0.4 }}
								/>
							</View>
						);
					})}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	progressContainer: {
		alignItems: "center",
		width: "100%",
	},
	progressTrack: {
		width: "100%",
		height: 36,
		backgroundColor: "#3D021C",
		borderRadius: 100,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		overflow: "hidden",
	},
	innerLine: {
		position: "absolute",
		width: "90%",
		height: 1,
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		top: "50%",
	},
	heartsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
	},
	heartItem: {
		justifyContent: "center",
		alignItems: "center",
		width: 40,
	},
});

export default ProgressIndicator;
