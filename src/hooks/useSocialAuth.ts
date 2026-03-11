// src/hooks/useSocialAuth.ts
// Handles Google & Facebook OAuth via expo-auth-session.
// Returns handleGoogle() and handleFacebook() to call from button onPress.
// On success: stores token, sets user in context, navigates appropriately.

import { useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ENV, devLog } from '@config/environment';
import { socialAuth } from '@services/api/socialAuthService';
import { useUser } from '@context/UserContext';

// Required for OAuth redirect to work correctly in Expo
WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = '@opueh_auth_token';

export const useSocialAuth = (navigation: any) => {
  const { setProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // ─── Google ───────────────────────────────────────────────────
  const [, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    webClientId:     ENV.SOCIAL_AUTH.GOOGLE_WEB_CLIENT_ID,
    iosClientId:     ENV.SOCIAL_AUTH.GOOGLE_IOS_CLIENT_ID,
    androidClientId: ENV.SOCIAL_AUTH.GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const accessToken = googleResponse.authentication?.accessToken;
      if (accessToken) handleGoogleProfile(accessToken);
    } else if (googleResponse?.type === 'error') {
      setIsLoading(false);
      Alert.alert('Google Sign-In Failed', googleResponse.error?.message || 'Please try again.');
    }
  }, [googleResponse]);

  const handleGoogleProfile = async (accessToken: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await res.json();
      devLog('🔐 Google profile:', profile.email);
      await submitSocialAuth({
        socialId: profile.id,
        provider: 'google',
        email: profile.email || '',
        fullname: profile.name || '',
        profilePic: profile.picture || '',
      });
    } catch {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to fetch Google profile. Please try again.');
    }
  };

  // ─── Facebook ─────────────────────────────────────────────────
  const [, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: ENV.SOCIAL_AUTH.FACEBOOK_APP_ID,
  });

  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const accessToken = facebookResponse.authentication?.accessToken;
      if (accessToken) handleFacebookProfile(accessToken);
    } else if (facebookResponse?.type === 'error') {
      setIsLoading(false);
      Alert.alert('Facebook Sign-In Failed', facebookResponse.error?.message || 'Please try again.');
    }
  }, [facebookResponse]);

  const handleFacebookProfile = async (accessToken: string) => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`,
      );
      const profile = await res.json();
      devLog('🔐 Facebook profile:', profile.email);
      await submitSocialAuth({
        socialId: profile.id,
        provider: 'facebook',
        email: profile.email || '',
        fullname: profile.name || '',
        profilePic: profile.picture?.data?.url || '',
      });
    } catch {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to fetch Facebook profile. Please try again.');
    }
  };

  // ─── Shared: call backend + handle result ────────────────────
  const submitSocialAuth = async (payload: Parameters<typeof socialAuth>[0]) => {
    const result = await socialAuth(payload);
    setIsLoading(false);

    if (!result.success || !result.token) {
      Alert.alert('Sign-In Failed', result.message);
      return;
    }

    // Store token
    await AsyncStorage.setItem(TOKEN_KEY, result.token);

    // Set profile in context
    if (result.user) {
      const rawName = result.user.name || result.user.username || result.user.fullname || '';
      setProfile({
        ...result.user,
        name: rawName,
        photo: result.user.profilePic || result.user.photo || null,
      });
    }

    // Navigate — if new user, go through onboarding; otherwise HomeTabs
    if (result.isNewUser) {
      navigation.reset({ index: 0, routes: [{ name: 'OnboardingNavigator' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
    }
  };

  // ─── Public handlers ─────────────────────────────────────────
  const handleGoogle = () => {
    setIsLoading(true);
    googlePromptAsync();
  };

  const handleFacebook = () => {
    setIsLoading(true);
    facebookPromptAsync();
  };

  return { handleGoogle, handleFacebook, isLoading };
};
