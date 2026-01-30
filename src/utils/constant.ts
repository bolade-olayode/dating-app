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
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
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

export interface Interest {
  id: string;
  label: string;
  icon: string;
  hashtag: string;
}

export const INTERESTS: Interest[] = [
  { id: 'sports', label: 'Sports', icon: '⚽', hashtag: '#sports' },
  { id: 'fashion', label: 'Fashion', icon: '👗', hashtag: '#fashion' },
  { id: 'influencer', label: 'Influencer', icon: '📱', hashtag: '#influencer' },
  { id: 'art', label: 'Art', icon: '🎨', hashtag: '#art' },
  { id: 'photography', label: 'Photography', icon: '📷', hashtag: '#photography' },
  { id: 'celebrities', label: 'Celebrities', icon: '⭐', hashtag: '#celebrities' },
  { id: 'travel', label: 'Travel', icon: '✈️', hashtag: '#travel' },
  { id: 'food', label: 'Food', icon: '🍕', hashtag: '#food' },
  { id: 'makeup', label: 'Makeup', icon: '💄', hashtag: '#makeup' },
  { id: 'fitness', label: 'Fitness', icon: '💪', hashtag: '#fitness' },
  { id: 'business', label: 'Business', icon: '💼', hashtag: '#business' },
  { id: 'marketing', label: 'Marketing', icon: '📊', hashtag: '#marketing' },
  { id: 'nature', label: 'Nature', icon: '🌿', hashtag: '#nature' },
  { id: 'model', label: 'Model', icon: '👠', hashtag: '#model' },
  { id: 'jobs', label: 'Jobs', icon: '💻', hashtag: '#jobs' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', hashtag: '#gaming' },
  { id: 'socialmedia', label: 'Social Media', icon: '📲', hashtag: '#socialmedia' },
  { id: 'competition', label: 'Competition', icon: '🏆', hashtag: '#competition' },
  { id: 'design', label: 'Design', icon: '✏️', hashtag: '#design' },
  { id: 'creativity', label: 'Creativity', icon: '🎭', hashtag: '#creativity' },
  { id: 'leadership', label: 'Leadership', icon: '👔', hashtag: '#leadership' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', icon: '🚀', hashtag: '#entrepreneurship' },
  { id: 'health', label: 'Health', icon: '🏥', hashtag: '#health' },
  { id: 'faith', label: 'Faith & Spirituality', icon: '🙏', hashtag: '#faith' },
  { id: 'music', label: 'Music', icon: '🎵', hashtag: '#music' },
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

export const PROFILE_REQUIREMENTS = {
  MIN_PHOTOS: 3,
  MAX_PHOTOS: 6,
  MIN_BIO_LENGTH: 50,
  MAX_BIO_LENGTH: 500,
  MIN_INTERESTS: 5,
  MAX_INTERESTS: 10,
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
  INTERESTS,
  SWIPE_LIMITS,
  REPORT_REASONS,
  PROMPT_QUESTIONS,
  COUNTRIES,
  AGE_RANGE,
  PROFILE_REQUIREMENTS,
  REGEX_PATTERNS,
  ANIMATION_DURATION,
  API_ENDPOINTS,
  STORAGE_KEYS,
};