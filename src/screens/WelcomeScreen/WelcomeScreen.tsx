import React from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './WelcomeScreen.styles';
import Button from '@components/common/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp; 
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  
  const handleGetStarted = () => {
    navigation.navigate('Signup'); 
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/opuehbckgdimg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        
        <View style={styles.contentContainer}>
          {/* Hero Text with Nested Styling */}
          <Text style={styles.title}>
            Everybody needs somebody,
          </Text>
          <Text style={styles.title}>
            so do <Text style={styles.highlight}>you.</Text>
          </Text>

          {/* Subtitle */}
          {/* <Text style={styles.subtitle}>
            Join the community and find your perfect match today.
          </Text> */}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Pink Primary Button */}
            <Button 
              onPress={handleGetStarted}
              size="lg"
              fullWidth
            >
              Get Started
            </Button>

            {/* Black Secondary Button */}
            {/* We override the style prop to force it Black */}
            <Button 
              onPress={handleLogin}
              size="lg"
              fullWidth
              style={styles.blackButton} 
            >
              Already have an account? Login Here
            </Button>
          </View>

          {/* Terms Text */}
          <Text style={styles.termsText}>
            By signing up, you agree to our terms. See how we use your data in our Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WelcomeScreen;