import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PrimaryButton,
  FacebookButton,
  GoogleButton,
} from '@components/ui/Buttons';
import { FONTS } from '@config/fonts';
import MarqueeColumn from '@components/common/AnimatedBackground/MarqueeColumn';

const { height } = Dimensions.get('window');

const SLIDE_IMAGES = [
  require('../../assets/images/opuehbckgdimg.jpg'),
  require('../../assets/images/opuehbckgdimg2.png'),
  require('../../assets/images/opuehbckgdimg3.png'),
];

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Animated Background Grid */}
      <View style={styles.backgroundContainer}>
        <View style={styles.gridRow}>
          <MarqueeColumn images={SLIDE_IMAGES} direction="up" duration={20000} />
          <MarqueeColumn images={SLIDE_IMAGES} direction="down" duration={25000} />
          <MarqueeColumn images={SLIDE_IMAGES} direction="up" duration={22000} />
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,1)']}
          style={styles.gridOverlay}
        />
      </View>

      {/* Content Container */}
      <View
        style={[
          styles.content,
          {
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 24,
          },
        ]}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Log in to continue finding your meaningful connections.
        </Text>

        <View style={styles.buttonGroup}>
          <FacebookButton onPress={() => {}} />
          <View style={{ height: 12 }} />
          <GoogleButton onPress={() => {}} />
          <View style={{ height: 12 }} />
          <PrimaryButton
            text="Use Phone or Email"
            variant={1}
            onPress={() => navigation.navigate('Register', { mode: 'login' })}
          />
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
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.65,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gridOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.H1,
    fontSize: 32,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.Body,
    fontSize: 16,
    color: '#9A9A9A',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 30,
  },
});

export default LoginScreen;
