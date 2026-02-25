// src/screens/Home/ProfileVerificationScreen.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';
import {
  verificationService,
  VerificationStatusValue,
} from '@services/api/verificationService';
import { walletService } from '@services/api/walletService';
import { devLog } from '@config/environment';

// ─── Fallback cost (coins) ────────────────────────────────────
const VERIFICATION_COST_DEFAULT = 250;

// ─── Status config ───────────────────────────────────────────

const STATUS_CONFIG: Record<
  VerificationStatusValue,
  { icon: string; iconColor: string; title: string; body: string }
> = {
  none: {
    icon: 'shield-outline',
    iconColor: '#888',
    title: 'Get Verified',
    body: 'A verified badge shows other members your identity has been confirmed, building trust and increasing your match rate.',
  },
  pending: {
    icon: 'time-outline',
    iconColor: '#FFD700',
    title: 'Under Review',
    body: "We've received your selfie and are processing your verification. This usually takes a few minutes.",
  },
  verified: {
    icon: 'checkmark-circle',
    iconColor: '#00FF7F',
    title: "You're Verified!",
    body: 'Your profile now shows a verified badge. Other members can see that your identity has been confirmed.',
  },
  failed: {
    icon: 'close-circle-outline',
    iconColor: '#FF4458',
    title: 'Verification Failed',
    body: "We couldn't confirm your identity. Please try again — make sure you're in good lighting and your face is clearly visible.",
  },
};

// ─── Profile completion (mirrors MeScreen logic exactly) ─────

const calcCompletion = (profile: any): { percentage: number; incomplete: string[] } => {
  const checks = [
    { label: 'Add at least 2 photos',       weight: 25, done: (profile?.photos?.length || 0) >= 2 },
    { label: 'Write your bio',               weight: 20, done: !!profile?.bio?.trim() },
    { label: 'Select at least 5 interests',  weight: 15, done: (profile?.interests?.length || 0) >= 5 },
    { label: 'Answer at least 2 prompts',    weight: 15, done: (profile?.prompts?.length || 0) >= 2 },
    { label: 'Set your relationship goal',   weight: 10, done: !!profile?.relationshipGoal },
    { label: 'Add height & weight',          weight: 10, done: !!profile?.basics?.height && !!profile?.basics?.weight },
    { label: 'Set your education level',     weight: 5,  done: !!profile?.basics?.education },
  ];
  const percentage = checks.reduce((sum, c) => sum + (c.done ? c.weight : 0), 0);
  const incomplete = checks.filter(c => !c.done).map(c => c.label);
  return { percentage, incomplete };
};

// ─── Component ───────────────────────────────────────────────

const ProfileVerificationScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile, coinBalance, setCoinBalance } = useUser();

  const [status, setStatus]                 = useState<VerificationStatusValue>(
    profile?.verified ? 'verified' : 'none',
  );
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isStarting, setIsStarting]           = useState(false);
  const [verificationCost, setVerificationCost] = useState(VERIFICATION_COST_DEFAULT);

  // ─── Derived gate checks ──────────────────────────────────

  const { percentage: completionPct, incomplete } = useMemo(
    () => calcCompletion(profile),
    [profile],
  );
  const isProfileComplete = completionPct === 100;
  const hasEnoughCoins    = coinBalance >= verificationCost;

  // ─── Load status + real cost on mount ────────────────────

  const loadData = useCallback(async () => {
    setIsLoadingStatus(true);

    const [statusResult, actionsResult] = await Promise.all([
      verificationService.getStatus(),
      walletService.getActions(),
    ]);

    // Status
    if (statusResult.success && statusResult.data) {
      const apiStatus: VerificationStatusValue =
        statusResult.data.status ?? (statusResult.data.verified ? 'verified' : 'none');
      devLog('🔐 Verification status:', apiStatus);
      setStatus(apiStatus);
      if (apiStatus === 'verified') {
        updateProfile({ verified: true });
      }
    } else {
      setStatus(profile?.verified ? 'verified' : 'none');
    }

    // Real cost from actions API
    if (actionsResult.success && Array.isArray(actionsResult.data)) {
      const action = actionsResult.data.find((a: any) => a.actionKey === 'verified_badge');
      if (action?.cost) {
        devLog('🔐 Verification cost from API:', action.cost);
        setVerificationCost(action.cost);
      }
    }

    setIsLoadingStatus(false);
  }, [profile, updateProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Start verification ───────────────────────────────────

  const handleStart = async () => {
    if (isStarting || !isProfileComplete || !hasEnoughCoins) return;
    setIsStarting(true);

    // Step 1: Spend coins
    devLog('💸 Verification: spending', verificationCost, 'coins');
    const spendResult = await walletService.spend('verified_badge');

    if (!spendResult.success) {
      Alert.alert(
        'Payment Failed',
        spendResult.message || 'Could not deduct coins. Please try again.',
      );
      setIsStarting(false);
      return;
    }

    // Update local balance after spend
    const newBalance = spendResult.data?.balance ?? spendResult.data?.newBalance;
    if (typeof newBalance === 'number') {
      setCoinBalance(newBalance);
    } else {
      setCoinBalance(Math.max(0, coinBalance - verificationCost));
    }

    // Step 2: Initiate selfie check
    const initResult = await verificationService.initiate();

    if (initResult.success) {
      devLog('🔐 Verification: initiate response', initResult.data);
      const verifyUrl: string | undefined =
        initResult.data?.url || initResult.data?.verificationUrl || initResult.data?.link;

      if (verifyUrl) {
        const canOpen = await Linking.canOpenURL(verifyUrl);
        if (canOpen) {
          await Linking.openURL(verifyUrl);
          setStatus('pending');
        } else {
          Alert.alert('Error', 'Unable to open the verification link. Please try again.');
        }
      } else {
        setStatus('pending');
        Alert.alert(
          'Verification Started',
          "Your verification request has been submitted. Tap the refresh icon to check for updates.",
        );
      }
    } else {
      Alert.alert(
        'Verification Error',
        'Coins were deducted but the verification process could not be started. Please contact support.',
      );
    }

    setIsStarting(false);
  };

  // ─── Render ───────────────────────────────────────────────

  const config     = STATUS_CONFIG[status];
  const canVerify  = isProfileComplete && hasEnoughCoins;
  const isVerified = status === 'verified';
  const isPending  = status === 'pending';

  // Which gate is the current blocker?
  const showCompletionGate = !isVerified && !isPending && !isProfileComplete;
  const showCoinGate       = !isVerified && !isPending && isProfileComplete && !hasEnoughCoins;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" />
      <Flare />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        {isLoadingStatus ? (
          <ActivityIndicator size="small" color="#FF007B" style={{ width: 40 }} />
        ) : (
          <TouchableOpacity onPress={loadData} style={styles.refreshBtn}>
            <Icon name="refresh-outline" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Status Icon */}
        <View style={[styles.iconRing, { borderColor: config.iconColor + '33' }]}>
          <Icon name={config.icon} size={52} color={config.iconColor} />
        </View>

        {/* Title + Body */}
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.bodyText}>{config.body}</Text>

        {/* ── GATE 1: Profile incomplete ─────────────────── */}
        {showCompletionGate && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="alert-circle-outline" size={18} color="#FF007B" />
              <Text style={styles.cardTitle}>Profile must be 100% complete</Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${completionPct}%` as any }]} />
            </View>
            <Text style={styles.progressLabel}>{completionPct}% complete</Text>

            {/* Incomplete items */}
            {incomplete.map((item, i) => (
              <View key={i} style={styles.checkRow}>
                <Icon name="close-circle-outline" size={16} color="#FF4458" />
                <Text style={styles.checkLabel}>{item}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Complete Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── GATE 2: Not enough coins ───────────────────── */}
        {showCoinGate && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="heart" size={18} color="#FF007B" />
              <Text style={styles.cardTitle}>Not enough coins</Text>
            </View>

            <View style={styles.coinRow}>
              <View style={styles.coinItem}>
                <Text style={styles.coinItemLabel}>Your balance</Text>
                <Text style={styles.coinItemValue}>{coinBalance.toLocaleString()}</Text>
              </View>
              <Icon name="arrow-forward" size={18} color="#444" />
              <View style={styles.coinItem}>
                <Text style={styles.coinItemLabel}>Required</Text>
                <Text style={[styles.coinItemValue, { color: '#FF007B' }]}>
                  {verificationCost.toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('TopUp')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Buy Coins</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Verified: badge active ─────────────────────── */}
        {isVerified && (
          <View style={styles.badgePreview}>
            <Icon name="checkmark-circle" size={20} color="#00FF7F" />
            <Text style={styles.badgePreviewText}>Verified badge active on your profile</Text>
          </View>
        )}

        {/* ── Pending: refresh tip ───────────────────────── */}
        {isPending && (
          <View style={styles.card}>
            <View style={styles.stepRow}>
              <Icon name="information-circle-outline" size={18} color="#FFD700" />
              <Text style={[styles.checkLabel, { marginLeft: 8 }]}>
                Tap the refresh icon at the top to check for updates.
              </Text>
            </View>
          </View>
        )}

        {/* ── How it works (only when eligible, not yet started) ── */}
        {canVerify && (status === 'none' || status === 'failed') && (
          <View style={styles.card}>
            <Text style={styles.stepsTitle}>How it works</Text>
            {[
              { icon: 'camera-outline',          label: 'Take a quick selfie' },
              { icon: 'shield-checkmark-outline', label: 'We verify your identity securely' },
              { icon: 'checkmark-circle-outline', label: 'Your verified badge goes live' },
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepIconWrap}>
                  <Icon name={step.icon} size={18} color="#FF007B" />
                </View>
                <Text style={styles.stepLabel}>{step.label}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* CTA: only shown when eligible + not yet verified/pending */}
      {(status === 'none' || status === 'failed') && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          {/* Cost pill */}
          <View style={styles.costPill}>
            <Icon name="heart" size={14} color="#FF007B" />
            <Text style={styles.costPillText}>
              {verificationCost.toLocaleString()} coins · one-time fee
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.ctaButton,
              (!canVerify || isStarting) && styles.ctaButtonDisabled,
            ]}
            onPress={handleStart}
            activeOpacity={0.8}
            disabled={!canVerify || isStarting}
          >
            {isStarting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.ctaButtonText}>
                {status === 'failed' ? 'Try Again' : 'Start Verification'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#202427',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.H2,
    fontSize: 20,
    color: '#FFF',
  },
  refreshBtn: {
    width: 40,
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  // Status icon
  iconRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: FONTS.Bold,
    fontSize: 26,
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  bodyText: {
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  // Generic card
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    padding: 20,
    gap: 14,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
  },
  // Completion progress
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF007B',
    borderRadius: 3,
  },
  progressLabel: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: '#FF007B',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkLabel: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#AAA',
  },
  secondaryBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FF007B',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#FF007B',
  },
  // Coin gate
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  coinItem: {
    alignItems: 'center',
    gap: 4,
  },
  coinItemLabel: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
  },
  coinItemValue: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
  },
  // Verified badge pill
  badgePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 127, 0.08)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 127, 0.2)',
  },
  badgePreviewText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    color: '#00FF7F',
  },
  // How it works steps
  stepsTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: '#666',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 0, 123, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#CCC',
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
  },
  costPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  costPillText: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#666',
  },
  ctaButton: {
    backgroundColor: '#FF007B',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    opacity: 0.4,
  },
  ctaButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
});

export default ProfileVerificationScreen;
