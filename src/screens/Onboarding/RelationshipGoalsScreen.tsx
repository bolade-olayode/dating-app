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

// Import Data from Constants
import { RELATIONSHIP_GOALS } from '../../utils/constant';
import { ONBOARDING_STEPS, TOTAL_ONBOARDING_STEPS } from '@config/onboardingFlow';

// Components
import Button from '../../components/common/Button/Button';
import OnboardingProgressBar from '../../components/common/OnboardingProgressBar';

// Navigation Types
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
  const { name, dateOfBirth, age, gender, lookingFor } = route.params || {};
  const [goal, setGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!goal) {
      Alert.alert('Required', 'Please select a relationship goal.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('InterestsSelection', {
        name, dateOfBirth, age, gender, lookingFor, relationshipGoal: goal,
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
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>What is your goal?</Text>
              <Text style={styles.subtitle}>
                Select what you are looking for. This helps us match you with people on the same page.
              </Text>
            </View>

            {/* Options List */}
            <View style={styles.optionsContainer}>
              {RELATIONSHIP_GOALS.map((option) => {
                const isSelected = goal === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.card, isSelected && styles.cardActive]}
                    onPress={() => setGoal(option.id)}
                    activeOpacity={0.9}
                  >
                    <View style={[styles.cardIcon, isSelected && styles.cardIconActive]}>
                      <Icon name={option.icon} size={24} color={isSelected ? COLORS.white : COLORS.gray500} />
                    </View>
                    
                    <View style={styles.cardTextContainer}>
                      <Text style={[styles.cardTitle, isSelected && styles.cardTitleActive]}>
                        {option.label}
                      </Text>
                      <Text style={styles.cardDescription}>
                        {option.description}
                      </Text>
                    </View>
                    
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {/* Spacer for Scrolling */}
            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.progressWrapper}>
              <OnboardingProgressBar currentStep={ONBOARDING_STEPS.RELATIONSHIP_GOALS} totalSteps={TOTAL_ONBOARDING_STEPS} />
            </View>
            <Button onPress={handleContinue} loading={loading} disabled={!goal}>
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
    paddingHorizontal: SPACING.lg,
  },

  // --- HEADER ---
  header: {
    marginBottom: SPACING.xl,
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

  // --- CARDS ---
  optionsContainer: {
    gap: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray900,
    borderRadius: 16,
    padding: SPACING.md,
    minHeight: 80,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  cardIconActive: {
    backgroundColor: COLORS.primary,
  },
  
  // --- CARD TEXT ---
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.gray300,
    marginBottom: 2,
  },
  cardTitleActive: {
    color: COLORS.white,
  },
  cardDescription: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.gray600,
  },

  // --- RADIO BUTTON ---
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray600,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  radioCircleActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
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
    paddingTop: SPACING.md,
  },
  progressWrapper: {
    marginBottom: SPACING.md,
  },
});

export default RelationshipGoalsScreen;