import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';
import { PrimaryButton } from '@components/ui/Buttons';
import { FONTS } from '@config/fonts';

const { height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/images/opuehbckgdimg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,1)']}
          style={styles.gradient}
        />

        <View style={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
            paddingLeft: insets.left + 24,
            paddingRight: insets.right + 24,
          }
        ]}>
          <View style={styles.topSpace} />

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Everybody, needs{'\n'}
              somebody, so do{'\n'}
              <Text style={styles.highlight}>YOU!</Text>
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              text="Get started"
              variant={1}
              onPress={handleGetStarted}
            />
            <View style={{ height: 16 }} />
            <PrimaryButton
              text="Already have an account"
              variant={2}
              onPress={handleLogin}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By signing up, you agree to our{' '}
              <Text style={styles.link}>terms</Text>. See how we use your data in
              our <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.7,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topSpace: {
    flex: 1,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    fontFamily: FONTS.H1,
    fontSize: 32,
    lineHeight: 48,
    color: '#fff',
  },
  highlight: {
    color: '#FF007B',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FONTS.Body,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
  link: {
    fontFamily: FONTS.SemiBold,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
