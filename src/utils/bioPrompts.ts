// src/utils/bioPrompts.ts

/**
 * BIO PROMPTS
 * 
 * Curated questions to help users showcase their personality.
 * Based on proven prompts from Hinge, Bumble, and other dating apps.
 * 
 * USAGE:
 * - Display 3 prompts in BioScreen
 * - Users answer to show personality
 * - More engaging than blank bio field
 */

export interface BioPrompt {
  id: string;
  emoji: string;
  question: string;
  placeholder: string;
}

export const BIO_PROMPTS: BioPrompt[] = [
  {
    id: 'ideal_sunday',
    emoji: '💭',
    question: 'My ideal Sunday is...',
    placeholder: 'Brunch with friends, then a long walk in the park'
  },
  {
    id: 'looking_for',
    emoji: '🎯',
    question: "I'm looking for someone who...",
    placeholder: 'Can make me laugh and loves adventure'
  },
  {
    id: 'best_cooking',
    emoji: '🍳',
    question: 'The best thing I cooked recently...',
    placeholder: 'Jollof rice that made my Nigerian mom proud'
  },
  {
    id: 'favorite_spot',
    emoji: '📍',
    question: 'My go-to spot in Lagos is...',
    placeholder: 'Lekki Arts & Crafts Market on weekends'
  },
  {
    id: 'current_song',
    emoji: '🎵',
    question: 'My favorite song right now is...',
    placeholder: 'Anything by Wizkid or Tems'
  },
  {
    id: 'random_fact',
    emoji: '⚡',
    question: 'A random fact about me...',
    placeholder: "I can speak 3 languages fluently"
  },
  {
    id: 'simple_pleasures',
    emoji: '🌟',
    question: 'My simple pleasures...',
    placeholder: 'Good coffee, sunset views, and deep conversations'
  },
  {
    id: 'geek_out',
    emoji: '🎨',
    question: 'I geek out on...',
    placeholder: 'African history and fashion design'
  },
  {
    id: 'green_flag',
    emoji: '💚',
    question: 'A green flag for me is...',
    placeholder: 'Someone who tips well and treats servers kindly'
  },
  {
    id: 'travel_dream',
    emoji: '✈️',
    question: 'My travel bucket list...',
    placeholder: 'Cape Town, Zanzibar, and the Maldives'
  },
  {
    id: 'unpopular_opinion',
    emoji: '🔥',
    question: 'My unpopular opinion...',
    placeholder: 'Pineapple belongs on pizza (fight me)'
  },
  {
    id: 'love_language',
    emoji: '💖',
    question: 'My love language is...',
    placeholder: 'Quality time and acts of service'
  },
];

/**
 * DEFAULT PROMPTS FOR BIO SCREEN
 * 
 * Pre-selected prompts that work well together.
 * Shows variety: weekend plans, dating preference, personal trait.
 */
export const DEFAULT_BIO_PROMPTS = [
  BIO_PROMPTS[0], // My ideal Sunday is...
  BIO_PROMPTS[1], // I'm looking for someone who...
  BIO_PROMPTS[6], // My simple pleasures...
];

/**
 * CHARACTER LIMITS
 */
export const BIO_LIMITS = {
  BIO_MAX: 300,           // Main bio field
  PROMPT_MAX: 150,        // Each prompt answer
  MIN_LENGTH: 20,         // Minimum to be considered "filled"
};

export default {
  BIO_PROMPTS,
  DEFAULT_BIO_PROMPTS,
  BIO_LIMITS,
};