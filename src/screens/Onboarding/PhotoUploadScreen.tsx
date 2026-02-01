/**
 * PHOTO UPLOAD SCREEN
 * * Step 8 of Onboarding.
 * * FEATURES:
 * - 2x3 Grid Layout
 * - Image Picker integration
 * - MOCK Upload simulation
 * - Enforces Min/Max photo limits
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

// Config & Services
import { PROFILE_REQUIREMENTS } from '../../utils/constant';
import { MockPhotoService } from '../../services/api/mockPhotoService';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Components
import Button from '../../components/common/Button/Button';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';

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

// Interface for our local photo state
interface Photo {
  id: string;
  uri: string;
  isUploading: boolean;
  error?: boolean;
}

const PhotoUploadScreen: React.FC<Props> = ({ navigation, route }) => {
  const { name, dateOfBirth, age, gender, lookingFor, relationshipGoal, interests } = route.params || {};
  
  // State
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [mainLoading, setMainLoading] = useState(false);

  // Limits
  const MIN_PHOTOS = PROFILE_REQUIREMENTS.MIN_PHOTOS; // 3
  const MAX_PHOTOS = PROFILE_REQUIREMENTS.MAX_PHOTOS; // 6

  // Slots for the 2x3 grid (We always render 6 slots, some filled, some empty)
  const photoSlots = Array.from({ length: MAX_PHOTOS });

  /**
   * PICK AND "UPLOAD" MULTIPLE IMAGES
   */
  const handleAddPhoto = async () => {
    // 1. Check Permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'We need access to your photos to upload your profile pictures.');
      return;
    }

    // 2. Calculate remaining slots
    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      Alert.alert('Maximum Reached', `You can only upload ${MAX_PHOTOS} photos.`);
      return;
    }

    // 3. Pick Multiple Images
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      // 4. Process each selected image
      for (const asset of result.assets) {
        const localUri = asset.uri;
        const tempId = Math.random().toString();

        // Add to state as "Uploading"
        const newPhoto: Photo = { id: tempId, uri: localUri, isUploading: true };
        setPhotos(prev => [...prev, newPhoto]);

        // Simulate Upload API Call
        try {
          await MockPhotoService.uploadPhoto(localUri);

          // Mark as uploaded
          setPhotos(prev => prev.map(p =>
            p.id === tempId ? { ...p, isUploading: false } : p
          ));
        } catch (error) {
          // Handle Error (Simulated 10% failure)
          Alert.alert('Upload Failed', 'Could not upload one of the photos. Please try again.');
          setPhotos(prev => prev.filter(p => p.id !== tempId)); // Remove failed photo
        }
      }
    }
  };

  /**
   * REMOVE PHOTO
   */
  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  /**
   * FINISH STEP
   */
  const handleContinue = () => {
    // Validate
    const uploadedCount = photos.filter(p => !p.isUploading && !p.error).length;
    
    if (uploadedCount < MIN_PHOTOS) {
      Alert.alert('Photos Required', `Please upload at least ${MIN_PHOTOS} photos to continue.`);
      return;
    }

    setMainLoading(true);
    setTimeout(() => {
      setMainLoading(false);
      
      console.log('Final Profile Data Block:', {
        name, age, gender, lookingFor, relationshipGoal, interests,
        photos: photos.map(p => p.uri)
      });

      // Navigate to Bio (Final Step) - You'll create 'BioScreen' next
      navigation.navigate('BioScreen', {
        name, dateOfBirth, age, gender, lookingFor, relationshipGoal, interests,
        photos: photos.map(p => p.uri)
      });
    }, 500);
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.container}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add your photos</Text>
              <Text style={styles.subtitle}>
                Add at least {MIN_PHOTOS} photos to continue. The first photo will be your main profile picture.
              </Text>
            </View>

            {/* Photo Grid */}
            <View style={styles.gridContainer}>
              {photoSlots.map((_, index) => {
                const photo = photos[index]; // Get photo at this slot index

                return (
                  <View key={index} style={styles.slotContainer}>
                    {photo ? (
                      // --- FILLED SLOT ---
                      <View style={styles.photoWrapper}>
                        <Image source={{ uri: photo.uri }} style={styles.photoImage} />

                        {/* Loading Overlay */}
                        {photo.isUploading && (
                          <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="small" color={COLORS.white} />
                          </View>
                        )}

                        {/* Remove Button (X) */}
                        {!photo.isUploading && (
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemovePhoto(photo.id)}
                          >
                            <Icon name="close" size={16} color={COLORS.white} />
                          </TouchableOpacity>
                        )}

                        {/* "Main" Label for first photo */}
                        {index === 0 && !photo.isUploading && (
                          <View style={styles.mainLabel}>
                            <Text style={styles.mainLabelText}>Main</Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      // --- EMPTY SLOT ---
                      <TouchableOpacity
                        style={styles.emptySlot}
                        onPress={handleAddPhoto}
                        activeOpacity={0.7}
                        // Disable only when max photos reached
                        disabled={photos.length >= MAX_PHOTOS}
                      >
                        <Icon name="add" size={32} color={COLORS.gray600} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Tip for reordering */}
            <View style={styles.tipContainer}>
              <Icon name="bulb-outline" size={16} color={COLORS.gray500} />
              <Text style={styles.tipText}>
                First photo = Main profile picture. Remove and re-add to change order.
              </Text>
            </View>

          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
             <View style={styles.counterWrapper}>
              <Text style={styles.counterText}>
                {photos.length}/{MAX_PHOTOS} photos added
              </Text>
            </View>

            <View style={styles.progressWrapper}>
              <OnboardingProgressBar currentStep={ONBOARDING_STEPS.PHOTOS} totalSteps={TOTAL_ONBOARDING_STEPS} />
            </View>

            <Button 
              onPress={handleContinue} 
              loading={mainLoading} 
              disabled={photos.length < MIN_PHOTOS}
            >
              Continue
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.xl,
    left: SPACING.md,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: SPACING['3xl'],
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  
  // Header
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 32,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.gray500,
    lineHeight: 24,
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // Gap between rows/cols
  },
  slotContainer: {
    width: '31%', // Fits 3 items with gaps
    aspectRatio: 0.75, // Portrait Aspect Ratio (3:4)
    marginBottom: 12,
  },
  
  // Empty State
  emptySlot: {
    flex: 1,
    backgroundColor: COLORS.gray900,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray800,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Filled State
  photoWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.gray800,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  mainLabelText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textTransform: 'uppercase',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.black,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray900,
    paddingTop: SPACING.sm,
  },
  counterWrapper: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  counterText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray500,
  },
  progressWrapper: {
    marginBottom: SPACING.md,
  },

  // Tip
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray500,
    lineHeight: 20,
  },
});

export default PhotoUploadScreen;