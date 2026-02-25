// src/screens/Home/ExploreScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@config/fonts';
import Flare from '@components/ui/Flare';
import { INTEREST_CATEGORIES, IntentType, INTENT_LABELS } from '@utils/constant';

const { width } = Dimensions.get('window');
const CARD_PADDING = 20;

// ─── Interest category cards (mapped from INTEREST_CATEGORIES) ───

interface ExploreCategoryCard {
  id: string;
  title: string;
  memberCount: string;
  image: ImageSourcePropType;
}

// Static member counts — avoids re-rendering jitter from Math.random() on each mount
const INTEREST_CARD_MEMBERS = ['22K', '17K', '31K'];

const INTEREST_CARDS: ExploreCategoryCard[] = INTEREST_CATEGORIES.map((cat, i) => ({
  id: cat.title.toLowerCase().replace(/\s+/g, '_'),
  title: cat.title,
  memberCount: INTEREST_CARD_MEMBERS[i] ?? '10K',
  image: [
    require('../../assets/images/foodanddrinks.jpg'),
    require('../../assets/images/sport.jpg'),
    require('../../assets/images/goingout.jpg'),
  ][i % 3],
}));

// ─── Relationship intent cards (mapped from INTENT_LABELS) ───

interface RelationshipCard {
  id: IntentType;
  title: string;
  memberCount: string;
  image: ImageSourcePropType;
}

const RELATIONSHIP_CARDS: RelationshipCard[] = [
  {
    id: IntentType.SERIOUS_RELATIONSHIP,
    title: INTENT_LABELS[IntentType.SERIOUS_RELATIONSHIP],
    memberCount: '15K',
    image: require('../../assets/images/serious.jpg'),
  },
  {
    id: IntentType.FRIENDSHIP,
    title: INTENT_LABELS[IntentType.FRIENDSHIP],
    memberCount: '12K',
    image: require('../../assets/images/friends.jpg'),
  },
  {
    id: IntentType.CASUAL_FLING,
    title: INTENT_LABELS[IntentType.CASUAL_FLING],
    memberCount: '9K',
    image: require('../../assets/images/fling.jpg'),
  },
  {
    id: IntentType.MARRIAGE,
    title: INTENT_LABELS[IntentType.MARRIAGE],
    memberCount: '18K',
    image: require('../../assets/images/marriage.jpg'),
  },
  {
    id: IntentType.DATING,
    title: INTENT_LABELS[IntentType.DATING],
    memberCount: '14K',
    image: require('../../assets/images/dating.jpg'),
  },
];

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // ─── Interest Card (full-width, tall) ────────────────────

  const renderInterestCard = (card: ExploreCategoryCard) => (
    <TouchableOpacity
      key={card.id}
      style={styles.interestCard}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('ExploreCategory', {
          categoryId: card.id,
          categoryTitle: card.title,
          memberCount: card.memberCount,
          type: 'interest',
        })
      }
    >
      <Image source={card.image} style={styles.interestCardImage} />
      <LinearGradient
        colors={['rgba(255, 0, 123, 0.15)', 'rgba(0, 0, 0, 0.85)']}
        style={styles.interestCardOverlay}
      >
        <View style={styles.memberBadge}>
          <Icon name="people" size={14} color="#FFF" />
          <Text style={styles.memberCount}>{card.memberCount}</Text>
        </View>
        <Text style={styles.interestCardTitle}>{card.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  // ─── Relationship Bento Grid ─────────────────────────────

  const renderRelationshipSection = () => {
    const [hero, ...rest] = RELATIONSHIP_CARDS;
    // Split remaining into pairs for 2-col rows
    const pairs: RelationshipCard[][] = [];
    for (let i = 0; i < rest.length; i += 2) {
      pairs.push(rest.slice(i, i + 2));
    }

    return (
      <View style={styles.bentoContainer}>
        {/* Hero card (full width, taller) */}
        <TouchableOpacity
          style={styles.bentoHero}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('ExploreCategory', {
              categoryId: hero.id,
              categoryTitle: hero.title,
              memberCount: hero.memberCount,
              type: 'relationship',
            })
          }
        >
          <Image source={hero.image} style={styles.bentoHeroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.85)']}
            style={styles.bentoOverlay}
          >
            <View style={styles.memberBadge}>
              <Icon name="people" size={14} color="#FFF" />
              <Text style={styles.memberCount}>{hero.memberCount}</Text>
            </View>
            <Text style={styles.bentoHeroTitle}>{hero.title}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Smaller cards in 2-col rows */}
        {pairs.map((pair, rowIdx) => (
          <View key={rowIdx} style={styles.bentoRow}>
            {pair.map(card => (
              <TouchableOpacity
                key={card.id}
                style={styles.bentoSmall}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('ExploreCategory', {
                    categoryId: card.id,
                    categoryTitle: card.title,
                    memberCount: card.memberCount,
                    type: 'relationship',
                  })
                }
              >
                <Image source={card.image} style={styles.bentoSmallImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.85)']}
                  style={styles.bentoOverlay}
                >
                  <View style={styles.memberBadge}>
                    <Icon name="people" size={12} color="#FFF" />
                    <Text style={[styles.memberCount, { fontSize: 11 }]}>
                      {card.memberCount}
                    </Text>
                  </View>
                  <Text style={styles.bentoSmallTitle}>{card.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Flare />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10, paddingBottom: 140 },
        ]}
      >
        {/* ─── Section 1: Explore by Interest ──────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore by interest</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="search-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.interestList}>
          {INTEREST_CARDS.map(renderInterestCard)}
        </View>

        {/* ─── Section 2: Explore by Relationship ──────────── */}
        <View style={[styles.sectionHeader, { marginTop: 36 }]}>
          <Text style={styles.sectionTitle}>Explore by relationship</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="search-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {renderRelationshipSection()}
      </ScrollView>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────

const CARD_WIDTH = width - CARD_PADDING * 2;
const BENTO_GAP = 12;
const BENTO_SMALL_WIDTH = (CARD_WIDTH - BENTO_GAP) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingHorizontal: CARD_PADDING,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 24,
    color: '#FFF',
  },

  // ─── Interest cards (full-width tall cards) ────────────
  interestList: {
    gap: 16,
  },
  interestCard: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
  },
  interestCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  interestCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 18,
  },
  interestCardTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 20,
    color: '#FFF',
  },

  // ─── Member count badge ────────────────────────────────
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  memberCount: {
    fontFamily: FONTS.SemiBold,
    fontSize: 13,
    color: '#FFF',
  },

  // ─── Bento grid (relationship section) ─────────────────
  bentoContainer: {
    gap: BENTO_GAP,
  },
  bentoHero: {
    width: CARD_WIDTH,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bentoHeroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bentoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
  },
  bentoHeroTitle: {
    fontFamily: FONTS.Bold,
    fontSize: 22,
    color: '#FFF',
  },
  bentoRow: {
    flexDirection: 'row',
    gap: BENTO_GAP,
  },
  bentoSmall: {
    width: BENTO_SMALL_WIDTH,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bentoSmallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bentoSmallTitle: {
    fontFamily: FONTS.SemiBold,
    fontSize: 15,
    color: '#FFF',
  },
});

export default ExploreScreen;
