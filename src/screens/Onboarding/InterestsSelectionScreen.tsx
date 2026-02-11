import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

// Components
import Flare from "@components/ui/Flare";
import ProgressIndicator from "@components/ui/ProgressIndicator";

// Config & Data
import { FONTS } from "@config/fonts";
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';
import { INTEREST_CATEGORIES, PROFILE_REQUIREMENTS, InterestCategory } from '../../utils/constant';
import { onboardingService } from '@services/api/onboardingService';
import { devLog } from '@config/environment';

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type InterestsSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InterestsSelection'>;
type InterestsSelectionScreenRouteProp = RouteProp<RootStackParamList, 'InterestsSelection'>;

interface Props {
  navigation: InterestsSelectionScreenNavigationProp;
  route: InterestsSelectionScreenRouteProp;
}

const InterestsSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    
    // Params
    const { name, dateOfBirth, age, gender, lookingFor, relationshipGoal } = route.params || {};
    
    // State
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<InterestCategory[]>(INTEREST_CATEGORIES);

    // Limits
    const MAX_SELECTION = PROFILE_REQUIREMENTS.MAX_INTERESTS; // 15

    // Progress
    const CURRENT_STEP = ONBOARDING_STEPS.INTERESTS || 8;
    const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync("#000000");
            NavigationBar.setButtonStyleAsync("light");
        }

        // Fetch interests from API, fall back to local constants
        const fetchInterests = async () => {
            try {
                const result = await onboardingService.getInterests();
                devLog('🎯 Interests API result keys:', result.success ? Object.keys(result.data || {}) : 'failed');
                if (result.success && result.data && typeof result.data === 'object') {
                    // Backend returns { "General": [...], "Food": [...], ... }
                    // Convert object-keyed format to our array-of-categories format
                    const dataObj = result.data;
                    const categoryKeys = Object.keys(dataObj).filter(
                        k => Array.isArray(dataObj[k]) && dataObj[k].length > 0
                    );

                    if (categoryKeys.length > 0) {
                        const mapped = categoryKeys.map(key => ({
                            title: key,
                            items: dataObj[key].map((item: any) => {
                                // Name includes emoji e.g. "Travel ✈️" — split into label + emoji
                                const name: string = item.name || '';
                                const emojiMatch = name.match(/([\p{Emoji_Presentation}\p{Extended_Pictographic}])/u);
                                const emoji = emojiMatch ? emojiMatch[0] : '';
                                const label = emoji ? name.replace(emoji, '').trim() : name;
                                return {
                                    id: item._id,
                                    label,
                                    emoji,
                                };
                            }),
                        }));
                        devLog('🎯 Mapped', mapped.length, 'categories from API');
                        setCategories(mapped);
                    }
                }
            } catch (err) {
                devLog('⚠️ Interests fetch failed, using local fallback');
            }
        };
        fetchInterests();
    }, []);

    const toggleItem = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((i) => i !== id));
        } else if (selected.length < MAX_SELECTION) {
            setSelected([...selected, id]);
        } else {
            Alert.alert("Limit Reached", `You can select up to ${MAX_SELECTION} interests.`);
        }
    };

    const handleContinue = async (isSkip = false) => {
        setLoading(true);

        const interestsToSend = isSkip ? [] : selected;

        try {
            // Attempt to save interests to API; continue even if it fails
            if (interestsToSend.length > 0) {
                const result = await onboardingService.saveInterests(interestsToSend);
                if (result.success) {
                    devLog('✅ Interests saved to backend:', interestsToSend.length, 'items');
                } else {
                    devLog('⚠️ saveInterests failed, continuing anyway:', result.message);
                }
            }
        } catch (err) {
            devLog('⚠️ saveInterests error, continuing anyway:', err);
        } finally {
            setLoading(false);
            navigation.navigate('PhotoUpload', {
                name,
                dateOfBirth,
                age,
                gender,
                lookingFor,
                relationshipGoal,
                interests: interestsToSend,
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent backgroundColor="black" />
            <Flare />

            <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Your Interests</Text>
                    <Text style={styles.subtitle}>
                        Pick up to {MAX_SELECTION} things you love. It'll help you match with people who love them too.
                    </Text>
                </View>

                {/* Categories List */}
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {categories.map((category) => (
                        <View key={category.title} style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <View style={styles.itemsWrapper}>
                                {category.items.map((item) => {
                                    const isSelected = selected.includes(item.id);
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => toggleItem(item.id)}
                                            activeOpacity={0.7}
                                            style={styles.itemWrapper}
                                        >
                                            {isSelected ? (
                                                // Active State: Gradient Border/Background
                                                <LinearGradient
                                                    colors={["#FF007B", "#6366F1", "#00B4D8"]}
                                                    start={{ x: 0, y: 0.5 }}
                                                    end={{ x: 1, y: 0.5 }}
                                                    style={styles.itemSelected}
                                                >
                                                    <Text style={styles.emoji}>{item.emoji}</Text>
                                                    <Text style={styles.itemLabelSelected}>{item.label}</Text>
                                                </LinearGradient>
                                            ) : (
                                                // Inactive State: Dark Pill
                                                <View style={styles.itemInactive}>
                                                    <Text style={styles.emoji}>{item.emoji}</Text>
                                                    <Text style={styles.itemLabelInactive}>{item.label}</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Progress Indicator */}
                <View style={{ paddingVertical: 20 }}>
                    <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
                </View>

                {/* Footer (Skip & Save) */}
                <View style={[styles.footer, { marginBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity
                        onPress={() => handleContinue(true)} // Skip logic
                        style={styles.skipButton}
                        disabled={loading}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleContinue(false)}
                        disabled={selected.length === 0 || loading}
                        style={[styles.saveButton, selected.length === 0 && { opacity: 0.5 }]}
                    >
                        <LinearGradient
                            colors={["#FF007B", "#6366F1", "#00B4D8"]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.saveGradient}
                        >
                            <Text style={styles.saveText}>Save {selected.length}/{MAX_SELECTION}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
        marginBottom: 20,
    },
    title: {
        fontFamily: FONTS.H3,
        fontSize: 32,
        color: "#fff",
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: FONTS.Body,
        fontSize: 15,
        color: "#666",
        lineHeight: 22,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    categorySection: {
        marginTop: 24,
    },
    categoryTitle: {
        fontFamily: FONTS.H2, // Assuming H2 is slightly smaller/bolder than body
        fontSize: 18,
        color: "#fff",
        marginBottom: 16,
    },
    itemsWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    itemWrapper: {
        marginBottom: 2,
    },
    itemInactive: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#333",
    },
    itemSelected: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 100,
    },
    emoji: {
        fontSize: 16,
        marginRight: 6,
    },
    itemLabelInactive: {
        fontFamily: FONTS.Body,
        fontSize: 14,
        color: "#666",
    },
    itemLabelSelected: {
        fontFamily: FONTS.Body,
        fontSize: 14,
        color: "#fff",
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    skipText: {
        fontFamily: FONTS.Body,
        fontSize: 16,
        color: "#666",
    },
    saveButton: {
        marginLeft: 20,
    },
    saveGradient: {
        height: 56,
        paddingHorizontal: 30,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    saveText: {
        fontFamily: FONTS.H3,
        fontSize: 18,
        color: "#fff",
    },
});

export default InterestsSelectionScreen;