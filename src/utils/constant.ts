// src/utils/constants.ts

export enum IntentType {
  FRIENDSHIP = 'FRIENDSHIP',
  DATING = 'DATING',
  SERIOUS_RELATIONSHIP = 'SERIOUS_RELATIONSHIP',
  MARRIAGE = 'MARRIAGE',
  CASUAL_FLING= 'CASUAL_FLING',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',

}

export const INTENT_LABELS: Record<IntentType, string> = {
  [IntentType.FRIENDSHIP]: 'Friendship',
  [IntentType.DATING]: 'Casual Dating',
  [IntentType.SERIOUS_RELATIONSHIP]: 'Serious Relationship',
  [IntentType.MARRIAGE]: 'Marriage',
  [IntentType.CASUAL_FLING]: 'Casual Fling',
};

export const INTENT_COLORS: Record<IntentType, string> = {
  [IntentType.FRIENDSHIP]: '#9C27B0',
  [IntentType.DATING]: '#FF6B9D',
  [IntentType.SERIOUS_RELATIONSHIP]: '#3F51B5',
  [IntentType.MARRIAGE]: '#E91E63',
  [IntentType.CASUAL_FLING]: '#FF9800',
};

export interface InterestItem {
  id: string;
  label: string;
  emoji: string;
}

export interface InterestCategory {
  title: string;
  items: InterestItem[];
}

export const INTEREST_CATEGORIES: InterestCategory[] = [
  {
    title: "Food and drink",
    items: [
      { id: "sushi", label: "Sushi", emoji: "🍣" },
      { id: "vegan", label: "Vegan", emoji: "🌱" },
      { id: "coffee", label: "Coffee", emoji: "☕" },
      { id: "pizza", label: "Pizza", emoji: "🍕" },
      { id: "wine", label: "Wine", emoji: "🍷" },
      { id: "home_food", label: "Home food", emoji: "🥘" },
      { id: "tacos", label: "Tacos", emoji: "🌮" },
      { id: "burger", label: "Burger", emoji: "🍔" },
    ],
  },
  {
    title: "Sport",
    items: [
      { id: "athletics", label: "Athletics", emoji: "🏃" },
      { id: "basketball", label: "Basketball", emoji: "🏀" },
      { id: "swimming", label: "Swimming", emoji: "🏊" },
      { id: "pilates", label: "Pilates", emoji: "🧘" },
      { id: "gymnastics", label: "Gymnastics", emoji: "🤸" },
      { id: "fencing", label: "Fencing", emoji: "🤺" },
      { id: "football", label: "Football", emoji: "⚽" },
      { id: "tennis", label: "Tennis", emoji: "🎾" },
    ],
  },
  {
    title: "Going out",
    items: [
      { id: "galleries", label: "Galleries", emoji: "🖼️" },
      { id: "theatres", label: "Theatres", emoji: "🎭" },
      { id: "museums", label: "Museums", emoji: "🏛️" },
      { id: "cafes", label: "Cafes", emoji: "☕" },
      { id: "karaoke", label: "Karaoke", emoji: "🎤" },
      { id: "restaurants", label: "Restaurants", emoji: "🍲" },
      { id: "bars", label: "Bars", emoji: "🍸" },
      { id: "concerts", label: "Concerts", emoji: "🎸" },
    ],
  },
];

export const SWIPE_LIMITS = {
  FREE_MALE: 5,
  FREE_FEMALE: 20,
  PREMIUM_MALE: 8,
  PREMIUM_FEMALE: 25,
} as const;

export interface ReportReason {
  id: string;
  label: string;
}

export const REPORT_REASONS: ReportReason[] = [
  { id: 'inappropriate_photos', label: 'Inappropriate Photos' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'fake_profile', label: 'Fake Profile' },
  { id: 'spam', label: 'Spam or Scam' },
  { id: 'underage', label: 'Appears to be underage' },
  { id: 'offensive_content', label: 'Offensive Content' },
  { id: 'other', label: 'Other' },
];

export const PROMPT_QUESTIONS: string[] = [
  "My ideal weekend involves...",
  "I'm passionate about...",
  "You should message me if...",
  "My love language is...",
  "I'm looking for someone who...",
  "The way to my heart is...",
  "I geek out on...",
  "A life goal of mine is...",
  "I value...",
  "My perfect date would be...",
];

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
];

export const AGE_RANGE = {
  MIN: 18,
  MAX: 100,
} as const;

// --- GENDER OPTIONS (For Gender Selection Screen) ---
export interface GenderOption {
  id: string;
  label: string;
  icon: string;
}

export const GENDER_OPTIONS: GenderOption[] = [
  { id: 'male', label: 'Male', icon: 'man-outline' },
  { id: 'female', label: 'Female', icon: 'woman-outline' },
];

// --- LOOKING FOR OPTIONS (For Dating Preference Screen) ---
export interface LookingForOption {
  id: string;
  label: string;
  icon: string;
}

export const LOOKING_FOR_OPTIONS: LookingForOption[] = [
  { id: 'men', label: 'Men', icon: 'man-outline' },
  { id: 'women', label: 'Women', icon: 'woman-outline' },
  { id: 'both', label: 'Both', icon: 'people-outline' }, 
];

// --- RELATIONSHIP GOALS (For Relationship Goals Screen) ---
export interface RelationshipGoal {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const RELATIONSHIP_GOALS: RelationshipGoal[] = [
  {
    id: 'Get married',
    label: 'Get Married',
    description: 'Looking for a life partner',
    icon: 'diamond-outline',
  },
  {
    id: 'Find a relationship',
    label: 'Find a Relationship',
    description: 'Looking for something serious',
    icon: 'heart-outline',
  },
  {
    id: 'Chat and meet friends',
    label: 'Chat & Meet Friends',
    description: 'Expanding my social circle',
    icon: 'people-outline',
  },
  {
    id: 'Learn other cultures',
    label: 'Learn Other Cultures',
    description: 'Discover and connect across cultures',
    icon: 'globe-outline',
  },
  {
    id: 'Travel the world',
    label: 'Travel the World',
    description: 'Find travel companions',
    icon: 'airplane-outline',
  },
];

export const PROFILE_REQUIREMENTS = {
  MIN_PHOTOS: 3,
  MAX_PHOTOS: 6,
  MIN_INTERESTS: 5,
  MAX_INTERESTS: 15,
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /(https?:\/\/[^\s]+)/g,
  PHONE_IN_TEXT: /\b\d{10,}\b/g,
  EMAIL_IN_TEXT: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
} as const;

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  VERIFY_OTP: '/auth/verify-otp',
  SEND_OTP: '/auth/send-otp',
  LOGOUT: '/auth/logout',
  
  // Profile
  GET_PROFILE: '/profile',
  UPDATE_PROFILE: '/profile/update',
  UPLOAD_PHOTO: '/profile/upload-photo',
  DELETE_PHOTO: '/profile/photo',
  
  // Discovery
  GET_RECOMMENDATIONS: '/discovery/recommendations',
  SWIPE: '/discovery/swipe',
  UNDO_SWIPE: '/discovery/undo',
  
  // Matches
  GET_MATCHES: '/matches',
  UNMATCH: '/matches/unmatch',
  
  // Messages
  GET_CONVERSATIONS: '/messages/conversations',
  GET_MESSAGES: '/messages',
  SEND_MESSAGE: '/messages/send',
  
  // Premium
  GET_CREDITS: '/premium/credits',
  PURCHASE_CREDITS: '/premium/purchase',
  UNLOCK_FEATURE: '/premium/unlock',
  
  // Safety
  REPORT_USER: '/safety/report',
  BLOCK_USER: '/safety/block',
  UNBLOCK_USER: '/safety/unblock',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@opueh_auth_token',
  USER_DATA: '@opueh_user_data',
  ONBOARDING_COMPLETE: '@opueh_onboarding_complete',
  DEVICE_TOKEN: '@opueh_device_token',
} as const;

export default {
  IntentType,
  Gender,
  INTENT_LABELS,
  INTENT_COLORS,
  INTEREST_CATEGORIES,
  SWIPE_LIMITS,
  REPORT_REASONS,
  PROMPT_QUESTIONS,
  COUNTRIES,
  AGE_RANGE,
  GENDER_OPTIONS,
  LOOKING_FOR_OPTIONS,
  RELATIONSHIP_GOALS,
  PROFILE_REQUIREMENTS,
  REGEX_PATTERNS,
  ANIMATION_DURATION,
  API_ENDPOINTS,
  STORAGE_KEYS,
};