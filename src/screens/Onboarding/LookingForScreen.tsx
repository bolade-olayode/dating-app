import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

// Components
import Icons, { IconsType } from "@components/ui/Icons";
import Flare from "@components/ui/Flare";
import ProgressIndicator from "@components/ui/ProgressIndicator";
import { PrimaryButton } from "@components/ui/Buttons";

// Config & Data
import { FONTS } from "@config/fonts";
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';
import { LOOKING_FOR_OPTIONS } from '../../utils/constant'; // <--- USING CONSTANTS

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type LookingForScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LookingFor'
>;

type LookingForScreenRouteProp = RouteProp<RootStackParamList, 'LookingFor'>;

interface Props {
  navigation: LookingForScreenNavigationProp;
  route: LookingForScreenRouteProp;
}

const LookingForScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    
    // Params
    const { name, dateOfBirth, age, gender } = route.params || {};
    
    // State
    const [preference, setPreference] = useState<string | null>(null);

    // Progress
    const CURRENT_STEP = ONBOARDING_STEPS.LOOKING_FOR || 6;
    const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync("#000000");
            NavigationBar.setButtonStyleAsync("light");
        }
    }, []);

    const handleContinue = () => {
        if (!preference) return;

        navigation.navigate('RelationshipGoals', {
            name,
            dateOfBirth,
            age,
            gender,
            lookingFor: preference,
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent backgroundColor="black" />
            <Flare />

            <View style={[styles.content, { paddingTop: insets.top + 50 }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Who are you looking for?</Text>
                    <Text style={styles.subtitle}>
                        We'll use this to show you people who match your orientation.
                    </Text>
                </View>

                {/* Options List (Mapped from Constants) */}
                <View style={styles.optionsContainer}>
                    {LOOKING_FOR_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            activeOpacity={0.9}
                            onPress={() => setPreference(option.id)}
                            style={styles.optionWrapper}
                        >
                            {preference === option.id ? (
                                // ACTIVE STATE (Gradient + Checkmark)
                                <LinearGradient
                                    colors={["#FF007B", "#6366F1", "#00B4D8"]}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                    style={styles.optionButton}
                                >
                                    {/* Text Left */}
                                    <Text style={styles.optionTextActive}>{option.label}</Text>
                                    
                                    {/* Icon Right */}
                                    <Icons
                                        type={IconsType.Ionicons}
                                        name="checkmark-circle"
                                        size={24}
                                        color="#fff"
                                    />
                                </LinearGradient>
                            ) : (
                                // INACTIVE STATE (Dark BG + Empty Circle)
                                <View style={styles.optionButtonInactive}>
                                    {/* Text Left */}
                                    <Text style={styles.optionTextInactive}>{option.label}</Text>
                                    
                                    {/* Circle Right */}
                                    <View style={styles.checkboxInactive} />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Progress Indicator */}
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
                </View>

                {/* Footer */}
                <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
                    <PrimaryButton
                        variant={1}
                        text="Continue"
                        disabled={!preference}
                        onPress={handleContinue}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontFamily: FONTS.H3,
        fontSize: 32,
        color: "#fff",
        lineHeight: 40,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: FONTS.Body,
        fontSize: 15,
        color: "#666",
        lineHeight: 22,
    },
    optionsContainer: {
        gap: 16,
        marginTop: 10,
    },
    optionWrapper: {
        width: "100%",
    },
    optionButton: {
        height: 64,
        borderRadius: 16, // Rounded Rectangle
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    optionButtonInactive: {
        height: 64,
        borderRadius: 16, // Rounded Rectangle
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#222",
        backgroundColor: "#0D0D0D",
    },
    optionTextActive: {
        fontFamily: FONTS.H3,
        fontSize: 18,
        color: "#fff",
    },
    optionTextInactive: {
        fontFamily: FONTS.H3,
        fontSize: 18,
        color: "#666",
    },
    checkboxInactive: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#222",
    },
    footer: {
        alignItems: "center",
    },
});

export default LookingForScreen;