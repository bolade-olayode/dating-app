import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageSourcePropType,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import { FONTS } from '@config/fonts';
import { STORAGE_KEYS } from '@utils/constant';
import HeartProgressBar from '@components/ui/HeartProgressBar';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type IntroSlideshowNavigationProp = StackNavigationProp<RootStackParamList, 'IntroSlideshow'>;

interface Props {
  navigation: IntroSlideshowNavigationProp;
}

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
}

const SLIDES: SlideData[] = [
  {
    id: '1',
    title: 'Effortless Discovery',
    subtitle:
      'Navigating our community is seamless. A simple gesture reveals a world of possibilities; when the interest is mutual, the conversation begins.',
    image: require('../../assets/images/dating.jpg'),
  },
  {
    id: '2',
    title: 'Your Curated Circle',
    subtitle:
      'Beyond romance, expand your social horizon. Connect with like-minded individuals for high-level networking, shared passions, and genuine friendship.',
    image: require('../../assets/images/fling.jpg'),
  },
  {
    id: '3',
    title: 'Soft, Intentional Love',
    subtitle:
      'Meet partners who align with your lifestyle, values, and vision. We prioritize depth over distance, ensuring every match is a meaningful one.',
    image: require('../../assets/images/sport.jpg'),
  },
  {
    id: '4',
    title: 'Bespoke Access',
    subtitle:
      'Tailor your experience with our seamless token system. Unlock priority visibility, global travel modes, and advanced filters with the modern currency of connection.',
    image: require('../../assets/images/opuehbckgdimg2.png'),
  },
];

const IntroSlideshowScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<SlideData>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#000000');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      finishIntro();
    }
  };

  const handleSkip = () => {
    finishIntro();
  };

  const finishIntro = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_INTRO, 'true');
    navigation.replace('Welcome');
  };

  const renderSlide = ({ item }: { item: SlideData }) => (
    <View style={styles.slide}>
      <ImageBackground source={item.image} style={styles.backgroundImage} resizeMode="cover">
        {/* Pink gradient overlay from bottom */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(200, 0, 80, 0.3)',
            'rgba(180, 0, 70, 0.6)',
            'rgba(140, 0, 60, 0.85)',
            'rgba(100, 0, 50, 0.95)',
          ]}
          locations={[0, 0.4, 0.55, 0.7, 0.85]}
          style={styles.gradient}
        >
          {/* Text content at the bottom */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Slide content */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Overlay UI (progress bar + navigation) */}
      <View style={[styles.overlay, { paddingTop: insets.top + 12 }]} pointerEvents="box-none">
        {/* Heart Progress Bar */}
        <HeartProgressBar currentStep={currentIndex} totalSteps={SLIDES.length} />

        {/* Spacer */}
        <View style={{ flex: 1 }} pointerEvents="none" />

        {/* Footer: Skip + Next Arrow */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF007B', '#C2185B']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.nextButton}
            >
              <Icon name="chevron-forward" size={18} color="#fff" />
              <Icon name="chevron-forward" size={18} color="#fff" style={{ marginLeft: -8 }} />
              <Icon name="chevron-forward" size={18} color="#fff" style={{ marginLeft: -8 }} />
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
    backgroundColor: '#000',
  },
  slide: {
    width,
    height,
  },
  backgroundImage: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textContainer: {
    paddingHorizontal: 28,
    paddingBottom: 140, // Room for footer
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: 34,
    color: '#fff',
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  skipText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#fff',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});

export default IntroSlideshowScreen;
