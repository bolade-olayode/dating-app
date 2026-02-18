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
import { FONTS } from '@config/fonts';
import { STORAGE_KEYS } from '@utils/constant';
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
    image: require('../../assets/images/int1.png'),
  },
  {
    id: '2',
    title: 'Your Curated Circle',
    subtitle:
      'Beyond romance, expand your social horizon. Connect with like-minded individuals for high-level networking, shared passions, and genuine friendship.',
    image: require('../../assets/images/int2.jpg'),
  },
  {
    id: '3',
    title: 'Soft, Intentional Love',
    subtitle:
      'Meet partners who align with your lifestyle, values, and vision. We prioritize depth over distance, ensuring every match is a meaningful one.',
    image: require('../../assets/images/int3.png'),
  },
  {
    id: '4',
    title: 'Bespoke Access',
    subtitle:
      'Tailor your experience with our seamless token system. Unlock priority visibility, global travel modes, and advanced filters with the modern currency of connection.',
    image: require('../../assets/images/int4.png'),
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

      {/* Overlay UI (navigation) */}
      <View style={[styles.overlay, { paddingTop: insets.top + 12 }]} pointerEvents="box-none">
        {/* Spacer */}
        <View style={{ flex: 1 }} pointerEvents="none" />

        {/* Footer: Skip + Next */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 30 }]}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF007B', '#6366F1', '#00B4D8']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextText}>
                {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
              </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  nextText: {
    fontFamily: FONTS.H3,
    fontSize: 16,
    color: '#fff',
  },
});

export default IntroSlideshowScreen;
