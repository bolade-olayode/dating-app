import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    Alert,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/Ionicons";

// Config & Data
import { FONTS } from "@config/fonts";
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';
import { MockPhotoService } from '../../services/api/mockPhotoService';
import { onboardingService } from '@services/api/onboardingService';

// Components
import Flare from "@components/ui/Flare";
import ProgressIndicator from "@components/ui/ProgressIndicator";
import { PrimaryButton } from "@components/ui/Buttons";

// Navigation
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type PhotoUploadScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PhotoUpload'>;
type PhotoUploadScreenRouteProp = RouteProp<RootStackParamList, 'PhotoUpload'>;

interface Props {
  navigation: PhotoUploadScreenNavigationProp;
  route: PhotoUploadScreenRouteProp;
}

interface Photo {
  id: string;
  uri: string;
  isUploading: boolean;
  error?: boolean;
}

const PhotoUploadScreen: React.FC<Props> = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { name, dateOfBirth, age, gender, lookingFor, relationshipGoal, interests } = route.params || {};
    
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [mainLoading, setMainLoading] = useState(false);

    // Limits (Your Requirements: Min 2, Max 4)
    const MIN_PHOTOS = 2;
    const MAX_PHOTOS = 4;

    const CURRENT_STEP = ONBOARDING_STEPS.PHOTOS || 9;
    const TOTAL_STEPS = TOTAL_ONBOARDING_STEPS;

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync("#000000");
            NavigationBar.setButtonStyleAsync("light");
        }
    }, []);

    const handleAddPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Needed', 'We need access to your photos to upload your profile pictures.');
            return;
        }

        const remainingSlots = MAX_PHOTOS - photos.length;
        if (remainingSlots <= 0) {
            Alert.alert('Maximum Reached', `You can only upload ${MAX_PHOTOS} photos.`);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: remainingSlots,
            quality: 0.8,
            aspect: [4, 5],
        });

        if (!result.canceled && result.assets.length > 0) {
            for (const asset of result.assets) {
                if (photos.length >= MAX_PHOTOS) break; // Double check limit loop

                const localUri = asset.uri;
                const tempId = Math.random().toString();
                const newPhoto: Photo = { id: tempId, uri: localUri, isUploading: true };
                
                // Add to state immediately
                setPhotos(prev => [...prev, newPhoto]);

                // Simulate Upload
                try {
                    await MockPhotoService.uploadPhoto(localUri);
                    setPhotos(prev => prev.map(p => 
                        p.id === tempId ? { ...p, isUploading: false } : p
                    ));
                } catch (error) {
                    Alert.alert('Upload Failed', 'Could not upload one of the photos.');
                    setPhotos(prev => prev.filter(p => p.id !== tempId));
                }
            }
        }
    };

    const handleRemovePhoto = (id: string) => {
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const handleContinue = async () => {
        const uploadedPhotos = photos.filter(p => !p.isUploading && !p.error);

        if (uploadedPhotos.length < MIN_PHOTOS) {
            Alert.alert('Photos Required', `Please upload at least ${MIN_PHOTOS} photos to continue.`);
            return;
        }

        setMainLoading(true);
        try {
            // Send photo URIs to API (these would be Cloudinary URLs in production)
            const photoUrls = uploadedPhotos.map(p => p.uri);
            const result = await onboardingService.uploadPhotos(photoUrls);

            if (!result.success) {
                Alert.alert('Error', result.message);
                setMainLoading(false);
                return;
            }

            // Onboarding complete!
            navigation.replace('InitializingScreen');
        } catch (err) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setMainLoading(false);
        }
    };

    // Render a single slot based on index (0-3)
    const renderSlot = (index: number) => {
        const photo = photos[index]; // Can be undefined if empty

        return (
            <View key={index} style={styles.slotContainer}>
                <LinearGradient
                    colors={["#FF007B", "#00B4D8"]} // Pink to Blue Gradient Border
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBorder}
                >
                    <TouchableOpacity
                        style={styles.slot}
                        onPress={!photo ? handleAddPhoto : undefined}
                        activeOpacity={0.7}
                        disabled={!!photo}
                    >
                        {photo ? (
                            <>
                                <Image source={{ uri: photo.uri }} style={styles.image} />
                                
                                {photo.isUploading && (
                                    <View style={styles.loadingOverlay}>
                                        <ActivityIndicator size="small" color="#fff" />
                                    </View>
                                )}

                                {!photo.isUploading && (
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => handleRemovePhoto(photo.id)}
                                    >
                                        <Icon name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <Icon name="add" size={32} color="#00B4D8" />
                        )}
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent backgroundColor="black" />
            <Flare />

            <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
                {/* Back Button */}
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Well done <Text style={styles.nameHighlight}>{name}</Text>, now add some photos!
                    </Text>
                    <Text style={styles.subtitle}>
                        Upload at least {MIN_PHOTOS} photos to show a bit of your life, personality and what you're passionate about.
                    </Text>
                </View>

                {/* Grid Layout (2 Rows of 2) */}
                <View style={styles.gridContainer}>
                    <View style={styles.row}>
                        {renderSlot(0)}
                        {renderSlot(1)}
                    </View>
                    <View style={styles.row}>
                        {renderSlot(2)}
                        {renderSlot(3)}
                    </View>
                </View>

                {/* Progress Indicator */}
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <ProgressIndicator step={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
                </View>

                {/* Footer Button */}
                <View style={[styles.footer, { marginBottom: insets.bottom + 20 }]}>
                    <PrimaryButton
                        variant={1}
                        text="Next"
                        disabled={photos.length < MIN_PHOTOS || mainLoading}
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#1A1A1A",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontFamily: FONTS.H3,
        fontSize: 28,
        color: "#fff",
        lineHeight: 36,
        marginBottom: 12,
    },
    nameHighlight: {
        color: "#FF007B",
    },
    subtitle: {
        fontFamily: FONTS.Body,
        fontSize: 15,
        color: "#666",
        lineHeight: 22,
    },
    // --- Grid Styling ---
    gridContainer: {
        gap: 16,
    },
    row: {
        flexDirection: "row",
        gap: 16,
    },
    slotContainer: {
        flex: 1,
        aspectRatio: 0.8, // 4:5 Aspect Ratio approx
    },
    gradientBorder: {
        padding: 1.5, // Thickness of the border
        borderRadius: 20,
        height: "100%",
    },
    slot: {
        flex: 1,
        borderRadius: 18.5, // Slightly less than outer to fit
        overflow: "hidden",
        backgroundColor: "#0D0D0D", // Dark fill
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    footer: {
        alignItems: "center",
    },
});

export default PhotoUploadScreen;