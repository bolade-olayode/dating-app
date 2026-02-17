import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

interface HeartProgressBarProps {
  currentStep: number; // 0-indexed
  totalSteps: number;
}

const HeartProgressBar: React.FC<HeartProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.track}
      >
        {/* Fill bar up to current step */}
        <View
          style={[
            styles.fill,
            { width: `${((currentStep + 1) / totalSteps) * 100}%` },
          ]}
        >
          <LinearGradient
            colors={['#FF007B', '#FF4DA6']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.fillGradient}
          />
        </View>

        {/* Heart icons */}
        <View style={styles.heartsContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;
            return (
              <View key={index} style={styles.heartWrapper}>
                <Icon
                  name={isActive ? 'heart' : 'heart-outline'}
                  size={isCurrent ? 22 : 16}
                  color={isActive ? '#FF007B' : 'rgba(255, 255, 255, 0.5)'}
                />
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  track: {
    width: '100%',
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 18,
    overflow: 'hidden',
  },
  fillGradient: {
    flex: 1,
    opacity: 0.3,
  },
  heartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  heartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HeartProgressBar;
