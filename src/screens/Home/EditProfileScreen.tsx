// src/screens/Home/EditProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  TextInput,
  Dimensions,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { useUser } from '@context/UserContext';
import { userService } from '@services/api/userService';
import { devLog } from '@config/environment';
import {
  GENDER_OPTIONS,
  LOOKING_FOR_OPTIONS,
  RELATIONSHIP_GOALS,
  INTEREST_CATEGORIES,
  PROMPT_QUESTIONS,
} from '@utils/constant';

const { width } = Dimensions.get('window');
const MEDIA_GAP = 12;
const MEDIA_PADDING = 20;
const MEDIA_ITEM_SIZE = (width - MEDIA_PADDING * 2 - MEDIA_GAP) / 2;

const TABS = ['Personal info', 'About me', 'Media'] as const;
type TabType = typeof TABS[number];

const EDUCATION_OPTIONS = ['High school', 'Undergraduate', 'BsC degree', 'Masters', 'Doctorate', 'Other'];

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { profile: contextProfile, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('Personal info');

  // Fields that are locked once set during onboarding
  const genderLocked = !!contextProfile?.gender;
  const dobLocked = !!contextProfile?.dateOfBirth;

  // Initialize from context profile, fallback to defaults
  const [name, setName] = useState(contextProfile?.name || 'BaaleofUI');
  const [email, setEmail] = useState(contextProfile?.email || 'selenakumbaya@icloud.com');
  const [phone, setPhone] = useState(
    contextProfile?.phoneNumber?.replace(/^\+\d{1,3}/, '') || '7000000008',
  );
  const [countryCode] = useState('+234');
  const [gender, setGender] = useState(contextProfile?.gender || '');
  const [lookingFor, setLookingFor] = useState(contextProfile?.lookingFor || '');
  const [bio, setBio] = useState(contextProfile?.bio || '');
  const [weight, setWeight] = useState(contextProfile?.weight || '');
  const [height, setHeight] = useState(contextProfile?.height || '');
  const [relationshipGoal, setRelationshipGoal] = useState(contextProfile?.relationshipGoal || '');
  const [education, setEducation] = useState(contextProfile?.education || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    contextProfile?.interests || [],
  );
  const [prompts, setPrompts] = useState<Array<{ question: string; answer: string }>>(
    contextProfile?.prompts || [],
  );
  const [photos] = useState([
    require('../../assets/images/opuehbckgdimg2.png'),
    require('../../assets/images/opuehbckgdimg.jpg'),
    require('../../assets/images/opuehbckgdimg3.png'),
  ]);

  // Dropdown modal state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<Array<{ id: string; label: string }>>([]);
  const [dropdownSetter, setDropdownSetter] = useState<((val: string) => void) | null>(null);
  const [dropdownTitle, setDropdownTitle] = useState('');
  const [dropdownSelected, setDropdownSelected] = useState('');

  // Photo action sheet
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);

  // Prompt editor modal
  const [promptModalVisible, setPromptModalVisible] = useState(false);
  const [editingPromptIdx, setEditingPromptIdx] = useState<number | null>(null);
  const [promptQuestion, setPromptQuestion] = useState('');
  const [promptAnswer, setPromptAnswer] = useState('');

  const BIO_MAX = 250;

  const openDropdown = (
    title: string,
    options: Array<{ id: string; label: string }>,
    currentValue: string,
    setter: (val: string) => void,
  ) => {
    setDropdownTitle(title);
    setDropdownOptions(options);
    setDropdownSelected(currentValue);
    setDropdownSetter(() => setter);
    setDropdownVisible(true);
  };

  const toggleInterest = (label: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(label)) return prev.filter(i => i !== label);
      if (prev.length >= 15) return prev;
      return [...prev, label];
    });
  };

  const openPromptEditor = (idx?: number) => {
    if (idx !== undefined && prompts[idx]) {
      setEditingPromptIdx(idx);
      setPromptQuestion(prompts[idx].question);
      setPromptAnswer(prompts[idx].answer);
    } else {
      setEditingPromptIdx(null);
      setPromptQuestion('');
      setPromptAnswer('');
    }
    setPromptModalVisible(true);
  };

  const savePrompt = () => {
    if (!promptQuestion || !promptAnswer.trim()) return;
    setPrompts(prev => {
      const updated = [...prev];
      if (editingPromptIdx !== null) {
        updated[editingPromptIdx] = { question: promptQuestion, answer: promptAnswer.trim() };
      } else {
        updated.push({ question: promptQuestion, answer: promptAnswer.trim() });
      }
      return updated;
    });
    setPromptModalVisible(false);
  };

  const removePrompt = (idx: number) => {
    setPrompts(prev => prev.filter((_, i) => i !== idx));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    // Map frontend fields to backend API field names
    const lookingForMap: Record<string, string> = { men: 'male', women: 'female', both: 'both' };
    const apiPayload = {
      username: name,
      gender,
      interestedIn: lookingFor ? (lookingForMap[lookingFor.toLowerCase()] || lookingFor) : undefined,
      goal: relationshipGoal,
      interests: selectedInterests,
    };

    devLog('💾 EditProfile: Saving to API', Object.keys(apiPayload));
    const result = await userService.updateProfile(apiPayload);

    // Always update local context regardless of API result
    updateProfile({
      name,
      email,
      phoneNumber: `${countryCode}${phone}`,
      gender,
      lookingFor,
      bio,
      weight,
      height,
      education,
      relationshipGoal,
      interests: selectedInterests,
      prompts,
    });

    setIsSaving(false);

    if (result.success) {
      Alert.alert('Profile Updated', 'Your changes have been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Saved Locally', 'Changes saved on device but failed to sync with server. They will sync next time.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  // ─── Personal Info Tab ─────────────────────────────────

  const renderPersonalInfo = () => (
    <View style={styles.tabContent}>
      {/* Name */}
      <View style={styles.inputRow}>
        <Icon name="person-outline" size={18} color="#888" />
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#555"
        />
      </View>

      {/* Email */}
      <View style={styles.inputRow}>
        <Icon name="mail-outline" size={18} color="#888" />
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#555"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Phone */}
      <View style={styles.inputRow}>
        <Icon name="call-outline" size={18} color="#888" />
        <Text style={styles.countryFlag}>🇳🇬</Text>
        <Text style={styles.countryCode}>{countryCode}</Text>
        <Icon name="chevron-down" size={14} color="#888" />
        <View style={styles.phoneDivider} />
        <TextInput
          style={[styles.textInput, { flex: 1 }]}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          placeholderTextColor="#555"
          keyboardType="phone-pad"
        />
      </View>

      {/* Gender + Looking For (side by side) */}
      <View style={styles.dualRow}>
        {genderLocked ? (
          <View style={[styles.dropdownButton, styles.lockedField]}>
            <Icon name="male-female-outline" size={16} color="#888" />
            <Text style={[styles.dropdownText, styles.dropdownTextFilled]}>
              {gender}
            </Text>
            <Icon name="lock-closed" size={14} color="#555" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.7}
            onPress={() =>
              openDropdown(
                'Gender',
                GENDER_OPTIONS.map(g => ({ id: g.id, label: g.label })),
                gender,
                setGender,
              )
            }
          >
            <Icon name="male-female-outline" size={16} color="#888" />
            <Text style={[styles.dropdownText, gender ? styles.dropdownTextFilled : null]}>
              {gender || 'Gender'}
            </Text>
            <Icon name="chevron-down" size={14} color="#888" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.dropdownButton}
          activeOpacity={0.7}
          onPress={() =>
            openDropdown(
              'Interested in',
              LOOKING_FOR_OPTIONS.map(l => ({ id: l.id, label: l.label })),
              lookingFor,
              setLookingFor,
            )
          }
        >
          <Icon name="heart-outline" size={16} color="#888" />
          <Text style={[styles.dropdownText, lookingFor ? styles.dropdownTextFilled : null]}>
            {lookingFor || 'Interested in'}
          </Text>
          <Icon name="chevron-down" size={14} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Date of Birth (always locked after onboarding) */}
      <View style={[styles.inputRow, styles.lockedField]}>
        <Icon name="calendar-outline" size={18} color="#888" />
        <Text style={styles.textInputReadonly}>
          {contextProfile?.dateOfBirth || '02 - 02 - 1990'}
        </Text>
        <Icon name="lock-closed" size={14} color="#555" />
      </View>
      <Text style={styles.inputHint}>
        Date of birth and gender cannot be changed once set during sign-up.
      </Text>
    </View>
  );

  // ─── About Me Tab ──────────────────────────────────────

  const renderAboutMe = () => (
    <View style={styles.tabContent}>
      {/* Bio */}
      <View style={styles.bioContainer}>
        <View style={styles.bioHeader}>
          <Text style={styles.bioLabel}>Bio</Text>
          {bio.length > 0 && (
            <TouchableOpacity onPress={() => setBio('')}>
              <Icon name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={text => {
            const words = text.split(/\s+/).filter(w => w.length > 0);
            if (words.length <= BIO_MAX) setBio(text);
          }}
          placeholder="Tell people about yourself..."
          placeholderTextColor="#555"
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.bioCounter}>
          {bio.split(/\s+/).filter(w => w.length > 0).length}/{BIO_MAX} words
        </Text>
      </View>

      {/* Weight + Height (free text inputs) */}
      <View style={styles.dualRow}>
        <View style={[styles.inputRow, { flex: 1, marginBottom: 0 }]}>
          <Icon name="fitness-outline" size={16} color="#888" />
          <TextInput
            style={styles.textInput}
            value={weight}
            onChangeText={setWeight}
            placeholder="Weight (e.g. 75kg)"
            placeholderTextColor="#555"
            keyboardType="default"
          />
        </View>

        <View style={[styles.inputRow, { flex: 1, marginBottom: 0 }]}>
          <Icon name="resize-outline" size={16} color="#888" />
          <TextInput
            style={styles.textInput}
            value={height}
            onChangeText={setHeight}
            placeholder="Height (e.g. 170cm)"
            placeholderTextColor="#555"
            keyboardType="default"
          />
        </View>
      </View>

      {/* Relationship Goal */}
      <TouchableOpacity
        style={styles.sectionDropdown}
        activeOpacity={0.7}
        onPress={() =>
          openDropdown(
            'Relationship Goal',
            RELATIONSHIP_GOALS.map(r => ({ id: r.id, label: r.label })),
            relationshipGoal,
            setRelationshipGoal,
          )
        }
      >
        <Text style={styles.sectionDropdownTitle}>Relationship Goal</Text>
        <Icon name="chevron-down" size={16} color="#888" />
      </TouchableOpacity>
      {relationshipGoal ? (
        <View style={styles.selectedChipsRow}>
          <View style={styles.selectedChip}>
            <Text style={styles.selectedChipText}>{relationshipGoal}</Text>
          </View>
        </View>
      ) : null}

      {/* Education */}
      <TouchableOpacity
        style={styles.sectionDropdown}
        activeOpacity={0.7}
        onPress={() =>
          openDropdown(
            'Education',
            EDUCATION_OPTIONS.map(e => ({ id: e, label: e })),
            education,
            setEducation,
          )
        }
      >
        <Text style={styles.sectionDropdownTitle}>Education</Text>
        <Icon name="chevron-down" size={16} color="#888" />
      </TouchableOpacity>
      {education ? (
        <View style={styles.selectedChipsRow}>
          <View style={[styles.selectedChip, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
            <Text style={[styles.selectedChipText, { color: '#FFF' }]}>{education}</Text>
          </View>
        </View>
      ) : null}

      {/* Interests */}
      <Text style={styles.sectionDropdownTitle}>
        Interests ({selectedInterests.length}/15)
      </Text>
      <Text style={styles.interestsHint}>Select at least 5 interests</Text>
      {INTEREST_CATEGORIES.map(category => (
        <View key={category.title} style={styles.interestCategoryBlock}>
          <Text style={styles.interestCategoryTitle}>{category.title}</Text>
          <View style={styles.interestChipsRow}>
            {category.items.map(item => {
              const isSelected = selectedInterests.includes(item.label);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                  activeOpacity={0.7}
                  onPress={() => toggleInterest(item.label)}
                >
                  <Text style={styles.interestChipEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.interestChipText,
                      isSelected && styles.interestChipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* Prompts */}
      <View style={styles.promptsSection}>
        <Text style={styles.sectionDropdownTitle}>Prompts ({prompts.length}/3)</Text>
        <Text style={styles.interestsHint}>Answer at least 2 prompts to stand out</Text>
        {prompts.map((prompt, idx) => (
          <View key={idx} style={styles.promptCard}>
            <Text style={styles.promptCardQuestion}>{prompt.question}</Text>
            <Text style={styles.promptCardAnswer}>{prompt.answer}</Text>
            <View style={styles.promptCardActions}>
              <TouchableOpacity onPress={() => openPromptEditor(idx)}>
                <Icon name="pencil-outline" size={16} color="#FF007B" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removePrompt(idx)}>
                <Icon name="trash-outline" size={16} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {prompts.length < 3 && (
          <TouchableOpacity
            style={styles.addPromptButton}
            activeOpacity={0.7}
            onPress={() => openPromptEditor()}
          >
            <Icon name="add-circle-outline" size={20} color="#FF007B" />
            <Text style={styles.addPromptText}>Add a prompt</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // ─── Media Tab ─────────────────────────────────────────

  const renderMedia = () => (
    <View style={styles.tabContent}>
      <Text style={styles.mediaHint}>
        Add at least 3 photos. First photo is your main profile picture.
      </Text>
      <View style={styles.mediaGrid}>
        {photos.map((photo, idx) => (
          <View key={idx} style={styles.mediaItem}>
            <Image source={photo} style={styles.mediaImage} />
            {idx === photos.length - 1 && (
              <View style={styles.playOverlay}>
                <Icon name="play-circle" size={32} color="#FFF" />
              </View>
            )}
          </View>
        ))}
        {/* Add button (fills 4th slot) */}
        {photos.length < 4 && (
          <TouchableOpacity
            style={styles.addMediaButton}
            activeOpacity={0.7}
            onPress={() => setPhotoSheetVisible(true)}
          >
            <Icon name="add" size={28} color="#00D4FF" />
            <Text style={styles.addMediaLabel}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Flare />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 10 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <View style={styles.backButton}>
                <Icon name="chevron-back" size={22} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit profile</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Profile Photo + Info */}
          <View style={styles.profileSection}>
            <View style={styles.photoContainer}>
              <Image
                source={require('../../assets/images/opuehbckgdimg2.png')}
                style={styles.profilePhoto}
              />
              <TouchableOpacity style={styles.editPhotoIcon} activeOpacity={0.7}>
                <Icon name="pencil" size={12} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{name || 'Your Name'}</Text>
            <View style={styles.locationRow}>
              <Icon name="location-outline" size={14} color="#999" />
              <Text style={styles.locationText}>
                {contextProfile?.location || 'Ontario, Japan'}
              </Text>
            </View>
          </View>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'Personal info' && renderPersonalInfo()}
          {activeTab === 'About me' && renderAboutMe()}
          {activeTab === 'Media' && renderMedia()}
        </ScrollView>

        {/* Save Button (fixed at bottom) */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity activeOpacity={0.8} onPress={handleSave}>
            <LinearGradient
              colors={['#FF007B', '#00D4FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownModalTitle}>{dropdownTitle}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {dropdownOptions.map(option => {
                const isActive = dropdownSelected === option.label;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.dropdownOption, isActive && styles.dropdownOptionActive]}
                    activeOpacity={0.7}
                    onPress={() => {
                      dropdownSetter?.(option.label);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        isActive && styles.dropdownOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isActive && <Icon name="checkmark" size={18} color="#FF007B" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Prompt Editor Modal */}
      <Modal
        visible={promptModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPromptModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setPromptModalVisible(false)}
        >
          <View style={styles.promptEditorSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {editingPromptIdx !== null ? 'Edit Prompt' : 'Add Prompt'}
              </Text>
              <TouchableOpacity onPress={() => setPromptModalVisible(false)}>
                <Icon name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Question selector */}
            <Text style={styles.promptEditorLabel}>Choose a question</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptQuestionsScroll}>
              {PROMPT_QUESTIONS.map(q => (
                <TouchableOpacity
                  key={q}
                  style={[
                    styles.promptQuestionChip,
                    promptQuestion === q && styles.promptQuestionChipActive,
                  ]}
                  onPress={() => setPromptQuestion(q)}
                >
                  <Text
                    style={[
                      styles.promptQuestionChipText,
                      promptQuestion === q && styles.promptQuestionChipTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {q}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Answer input */}
            <Text style={styles.promptEditorLabel}>Your answer</Text>
            <TextInput
              style={styles.promptEditorInput}
              value={promptAnswer}
              onChangeText={setPromptAnswer}
              placeholder="Type your answer..."
              placeholderTextColor="#555"
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.promptSaveButton,
                (!promptQuestion || !promptAnswer.trim()) && styles.promptSaveButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={savePrompt}
              disabled={!promptQuestion || !promptAnswer.trim()}
            >
              <Text style={styles.promptSaveButtonText}>Save Prompt</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Photo Action Sheet */}
      <Modal
        visible={photoSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPhotoSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setPhotoSheetVisible(false)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add photos</Text>
              <TouchableOpacity onPress={() => setPhotoSheetVisible(false)}>
                <Icon name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {[
              { label: 'Create profile avatar', icon: 'happy-outline' },
              { label: 'Take photo', icon: 'camera-outline' },
              { label: 'Choose photo', icon: 'image-outline' },
            ].map(action => (
              <TouchableOpacity
                key={action.label}
                style={styles.sheetOption}
                activeOpacity={0.7}
                onPress={() => {
                  setPhotoSheetVisible(false);
                  // TODO: implement photo picker
                }}
              >
                <Text style={styles.sheetOptionText}>{action.label}</Text>
                <Icon name="checkmark-circle-outline" size={20} color="#FF007B" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.sheetOption}
              activeOpacity={0.7}
              onPress={() => setPhotoSheetVisible(false)}
            >
              <Text style={[styles.sheetOptionText, { color: '#FF3B30' }]}>Delete photo</Text>
              <Icon name="close-circle-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    color: '#FFF',
  },
  // Profile Section
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 0, 123, 0.3)',
  },
  editPhotoIcon: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF007B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileName: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#999',
  },
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  tabText: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    fontFamily: FONTS.SemiBold,
    color: '#FFF',
  },
  // Tab Content
  tabContent: {
    paddingHorizontal: 20,
  },
  // Input Rows
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  inputRowHighlight: {
    borderColor: 'rgba(0, 212, 255, 0.4)',
  },
  lockedField: {
    opacity: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#FFF',
    padding: 0,
  },
  textInputReadonly: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#999',
  },
  countryFlag: {
    fontSize: 16,
  },
  countryCode: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: '#FFF',
  },
  phoneDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  inputHint: {
    fontFamily: FONTS.Regular,
    fontSize: 11,
    color: '#666',
    marginTop: -4,
    marginBottom: 12,
    paddingHorizontal: 4,
    lineHeight: 16,
  },
  // Dual Row (side by side)
  dualRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  dropdownText: {
    flex: 1,
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#555',
  },
  dropdownTextFilled: {
    color: '#FFF',
  },
  // Bio
  bioContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.4)',
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bioLabel: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#888',
  },
  bioInput: {
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#FFF',
    minHeight: 100,
    padding: 0,
  },
  bioCounter: {
    fontFamily: FONTS.Regular,
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  // Section Dropdown
  sectionDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 8,
  },
  sectionDropdownTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
  },
  selectedChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedChip: {
    backgroundColor: '#FF007B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedChipText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FFF',
  },
  // Interests
  interestsHint: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 14,
  },
  interestCategoryBlock: {
    marginBottom: 16,
  },
  interestCategoryTitle: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  interestChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  interestChipSelected: {
    backgroundColor: 'rgba(255, 0, 123, 0.15)',
    borderColor: '#FF007B',
  },
  interestChipEmoji: {
    fontSize: 14,
  },
  interestChipText: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#AAA',
  },
  interestChipTextSelected: {
    color: '#FFF',
  },
  // Prompts
  promptsSection: {
    marginTop: 8,
  },
  promptCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  promptCardQuestion: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#FF007B',
    marginBottom: 6,
  },
  promptCardAnswer: {
    fontFamily: FONTS.Regular,
    fontSize: 14,
    color: '#DDD',
    lineHeight: 20,
  },
  promptCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 10,
  },
  addPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 4,
  },
  addPromptText: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: '#FF007B',
  },
  // Media Grid (2x2)
  mediaHint: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: '#666',
    marginBottom: 14,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MEDIA_GAP,
  },
  mediaItem: {
    width: MEDIA_ITEM_SIZE,
    height: MEDIA_ITEM_SIZE * 1.2,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  addMediaButton: {
    width: MEDIA_ITEM_SIZE,
    height: MEDIA_ITEM_SIZE * 1.2,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#FF007B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 123, 0.05)',
  },
  addMediaLabel: {
    fontFamily: FONTS.Medium,
    fontSize: 12,
    color: '#00D4FF',
    marginTop: 4,
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 16,
    color: '#FFF',
  },
  // Dropdown Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 340,
  },
  dropdownModalTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  dropdownOptionActive: {
    backgroundColor: 'rgba(255, 0, 123, 0.1)',
    borderRadius: 10,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  dropdownOptionText: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: '#FFF',
  },
  dropdownOptionTextActive: {
    color: '#FF007B',
  },
  // Prompt Editor Modal
  promptEditorSheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  promptEditorLabel: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
    marginTop: 12,
  },
  promptQuestionsScroll: {
    maxHeight: 44,
    marginBottom: 8,
  },
  promptQuestionChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptQuestionChipActive: {
    backgroundColor: 'rgba(255, 0, 123, 0.15)',
    borderColor: '#FF007B',
  },
  promptQuestionChipText: {
    fontFamily: FONTS.Regular,
    fontSize: 13,
    color: '#AAA',
  },
  promptQuestionChipTextActive: {
    color: '#FFF',
  },
  promptEditorInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 16,
    fontFamily: FONTS.Regular,
    fontSize: 15,
    color: '#FFF',
    minHeight: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  promptSaveButton: {
    backgroundColor: '#FF007B',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  promptSaveButtonDisabled: {
    opacity: 0.4,
  },
  promptSaveButtonText: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
  },
  // Photo Action Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 18,
    color: '#FFF',
  },
  sheetOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  sheetOptionText: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: '#FFF',
  },
});

export default EditProfileScreen;
