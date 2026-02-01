import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

// Import Data & Rules from Constants
import { INTERESTS, PROFILE_REQUIREMENTS } from '../../utils/constant';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Components
import Button from '../../components/common/Button/Button';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';

// Navigation Types
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
  const { name, dateOfBirth, age, gender, lookingFor, relationshipGoal } = route.params || {};
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Limits
  const MIN = PROFILE_REQUIREMENTS.MIN_INTERESTS;
  const MAX = PROFILE_REQUIREMENTS.MAX_INTERESTS;

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(prev => prev.filter(item => item !== id));
    } else {
      if (selectedInterests.length >= MAX) {
        Alert.alert('Limit Reached', `You can select up to ${MAX} interests.`);
        return;
      }
      setSelectedInterests(prev => [...prev, id]);
    }
  };

  const handleContinue = () => {
    if (selectedInterests.length < MIN) {
      Alert.alert('More Interests Needed', `Please select at least ${MIN} interests.`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to Photo Upload
      navigation.navigate('PhotoUpload', {
        name, dateOfBirth, age, gender, lookingFor, relationshipGoal, interests: selectedInterests,
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
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>Your Interests</Text>
              <Text style={styles.subtitle}>
                Pick between {MIN} and {MAX} topics you are passionate about.
              </Text>
            </View>

            {/* Chips Grid */}
            <View style={styles.gridContainer}>
              {INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <TouchableOpacity
                    key={interest.id}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleInterest(interest.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chipIcon}>{interest.icon}</Text>
                    <Text style={[styles.chipLabel, isSelected && styles.chipLabelActive]}>
                      {interest.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.counterWrapper}>
              <Text style={styles.counterText}>
                {selectedInterests.length}/{MAX} selected
              </Text>
            </View>
            
            <View style={styles.progressWrapper}>
              <OnboardingProgressBar currentStep={ONBOARDING_STEPS.INTERESTS} totalSteps={TOTAL_ONBOARDING_STEPS} />
            </View>
            
            <Button 
              onPress={handleContinue} 
              loading={loading} 
              disabled={selectedInterests.length < MIN}
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
  // --- LAYOUT ---
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: SPACING['3xl'],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },

  // --- HEADER ---
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

  // --- GRID & CHIPS ---
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'flex-start',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray900,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.gray900,
    borderColor: COLORS.primary,
  },
  chipIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  chipLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray400,
  },
  chipLabelActive: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },

  // --- FOOTER ---
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
});

export default InterestsSelectionScreen;