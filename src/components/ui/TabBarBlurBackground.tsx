import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/ThemeContext';

export default function TabBarBlurBackground() {
	const { theme } = useTheme();
	const isDarkMode = theme === 'dark';

	return (
		<View style={StyleSheet.absoluteFill}>
			<BlurView
				intensity={80}
				tint={isDarkMode ? "dark" : "light"}
				style={StyleSheet.absoluteFill}
			/>
			<View
				style={[
					StyleSheet.absoluteFill,
					{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)' }
				]}
			/>
		</View>
	);
}
