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

// Config
import { FONTS } from "@config/fonts";
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type GenderSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GenderSelection'
>;

type GenderSelectionScreenRouteProp = RouteProp<RootStackParamList, 'GenderSelection'>;

interface Props {
  navigation: GenderSelectionScreenNavigationProp;
  route: GenderSelectionScreenRouteProp;
}

const GenderSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    
    // Params from previous screen
    const { name, dateOfBirth, age } = route.params || {};
    
    const [gender, setGender] = useState<"male" | "female" | null>(null);

    // Onboarding progress
    const CURRENT_STEP = ONBOARDING_STEPS.GENDER_SELECTION || 5;
    const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync("#000000");
            NavigationBar.setButtonStyleAsync("light");
        }
    }, []);

    const handleContinue = () => {
        if (!gender) return;

        // Navigate to Next Screen (LookingFor) passing all data
        navigation.navigate('LookingFor', {
            name,
            dateOfBirth,
            age,
            gender,
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent backgroundColor="black" />
            <Flare />

            <View style={[styles.content, { paddingTop: insets.top + 50 }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>How may we refer to you?</Text>
                </View>

                <View style={styles.genderRow}>
                    {/* MALE BUTTON */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setGender("male")}
                        style={styles.genderButtonWrapper}
                    >
                        {gender === "male" ? (
                            <LinearGradient
                                colors={["#FF007B", "#6366F1", "#00B4D8"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.genderButton}
                            >
                                <Icons
                                    type={IconsType.Ionicons}
                                    name="male"
                                    size={24}
                                    color="#fff"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={styles.genderTextActive}>Male</Text>
                            </LinearGradient>
                        ) : (
                            <View style={styles.genderButtonInactive}>
                                <Icons
                                    type={IconsType.Ionicons}
                                    name="male"
                                    size={24}
                                    color="#666"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={styles.genderTextInactive}>Male</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* FEMALE BUTTON */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setGender("female")}
                        style={styles.genderButtonWrapper}
                    >
                        {gender === "female" ? (
                            <LinearGradient
                                colors={["#FF007B", "#6366F1", "#00B4D8"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.genderButton}
                            >
                                <Icons
                                    type={IconsType.Ionicons}
                                    name="female"
                                    size={24}
                                    color="#fff"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={styles.genderTextActive}>Female</Text>
                            </LinearGradient>
                        ) : (
                            <View style={styles.genderButtonInactive}>
                                <Icons
                                    type={IconsType.Ionicons}
                                    name="female"
                                    size={24}
                                    color="#666"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={styles.genderTextInactive}>Female</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Spacer & Progress */}
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
                </View>

                {/* Footer Button */}
                <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
                    <PrimaryButton
                        variant={1}
                        text="Continue"
                        disabled={!gender}
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
    },
    genderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 10,
    },
    genderButtonWrapper: {
        flex: 1,
    },
    genderButton: {
        height: 60,
        borderRadius: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    genderButtonInactive: {
        height: 60,
        borderRadius: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#222",
        backgroundColor: "transparent",
    },
    genderTextActive: {
        fontFamily: FONTS.H3,
        fontSize: 18,
        color: "#fff",
    },
    genderTextInactive: {
        fontFamily: FONTS.H3,
        fontSize: 18,
        color: "#666",
    },
    footer: {
        alignItems: "center",
    },
});

export default GenderSelectionScreen;