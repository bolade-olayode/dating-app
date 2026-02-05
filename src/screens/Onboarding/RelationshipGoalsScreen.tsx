import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

// 1. REVERTED: Using standard Ionicons instead of custom Icons component
import Icon from 'react-native-vector-icons/Ionicons'; 

// Components
import Flare from "@components/ui/Flare";
import ProgressIndicator from "@components/ui/ProgressIndicator";
import { PrimaryButton } from "@components/ui/Buttons";

// Config
import { FONTS } from "@config/fonts";
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';
import { RELATIONSHIP_GOALS } from '../../utils/constant';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type RelationshipGoalsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RelationshipGoals'>;
type RelationshipGoalsScreenRouteProp = RouteProp<RootStackParamList, 'RelationshipGoals'>;

interface Props {
  navigation: RelationshipGoalsScreenNavigationProp;
  route: RelationshipGoalsScreenRouteProp;
}

const RelationshipGoalsScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    
    const { name, dateOfBirth, age, gender, lookingFor } = route.params || {};
    
    const [goal, setGoal] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const CURRENT_STEP = ONBOARDING_STEPS.RELATIONSHIP_GOALS || 7;
    const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync("#000000");
            NavigationBar.setButtonStyleAsync("light");
        }
    }, []);

    const handleContinue = () => {
        if (!goal) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('InterestsSelection', {
                name,
                dateOfBirth,
                age,
                gender,
                lookingFor,
                relationshipGoal: goal,
            });
        }, 500);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent backgroundColor="black" />
            <Flare />

            <View style={[styles.content, { paddingTop: insets.top + 50 }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>What are you looking for?</Text>
                    <Text style={styles.subtitle}>
                        This helps us show you people who share similar intentions.
                    </Text>
                </View>

                {/* Content List */}
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.optionsContainer}>
                        {RELATIONSHIP_GOALS.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.9}
                                onPress={() => setGoal(option.id)}
                                style={styles.optionWrapper}
                            >
                                {goal === option.id ? (
                                    // ACTIVE STATE (Gradient)
                                    <LinearGradient
                                        colors={["#FF007B", "#6366F1", "#00B4D8"]}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        style={styles.optionButton}
                                    >
                                        <View style={styles.optionLeft}>
                                            {/* 2. REVERTED: Using standard Icon component */}
                                            <Icon
                                                name={option.icon}
                                                size={24}
                                                color="#fff"
                                                style={{ marginRight: 12 }}
                                            />
                                            <View>
                                                <Text style={styles.optionTextActive}>{option.label}</Text>
                                            </View>
                                        </View>
                                        
                                        {/* Checkmark Icon */}
                                        <Icon
                                            name="checkmark-circle"
                                            size={24}
                                            color="#fff"
                                        />
                                    </LinearGradient>
                                ) : (
                                    // INACTIVE STATE (Dark BG)
                                    <View style={styles.optionButtonInactive}>
                                        <View style={styles.optionLeft}>
                                            {/* 3. REVERTED: Using standard Icon component */}
                                            <Icon
                                                name={option.icon}
                                                size={24}
                                                color="#666"
                                                style={{ marginRight: 12 }}
                                            />
                                            <View>
                                                <Text style={styles.optionTextInactive}>{option.label}</Text>
                                            </View>
                                        </View>
                                        
                                        {/* Empty Circle */}
                                        <View style={styles.checkboxInactive} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Progress & Footer */}
                <View style={styles.bottomSection}>
                    <View style={{ marginBottom: 20, alignItems: 'center' }}>
                        <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
                    </View>

                    <PrimaryButton
                        variant={1}
                        text="Continue"
                        disabled={!goal || loading}
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
        paddingBottom: 20,
    },
    header: {
        marginBottom: 30,
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
    scrollContent: {
        flexGrow: 0, 
    },
    optionsContainer: {
        gap: 16,
        marginTop: 10,
        paddingBottom: 20, 
    },
    optionWrapper: {
        width: "100%",
    },
    optionButton: {
        height: 64,
        borderRadius: 16, 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    optionButtonInactive: {
        height: 64,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#222",
        backgroundColor: "#0D0D0D",
    },
    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
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
    bottomSection: {
        marginTop: 'auto',
        paddingBottom: 20,
    },
});

export default RelationshipGoalsScreen;