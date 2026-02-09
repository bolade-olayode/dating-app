#  xxxxx Dating App

> A values-driven dating app for intentional relationships, focused on the African market.

**Status:**  In Development  
**Platform:** iOS & Android (React Native + Expo)  
**Target Launch:** Q1 2026

---

## About xxxxxxx

xxxxxxx is a modern dating application designed to help people find meaningful connections. Unlike typical swipe-based apps, Opueh focuses on values, interests, and intentional relationship-building.

### **Key Features**
- **Phone/Email Verification** - Secure OTP-based signup
- **Rich Profiles** - Photos, prompts, interests, and values
- **Intent-Based Matching** - Friendship, Dating, Serious, Marriage
- **Curated Matches** - Limited daily swipes for quality over quantity
- **In-App Messaging** - Connect with matches
- **Premium Features** - Advanced filters, unlimited likes, profile boost

---

## Tech Stack

### **Frontend**
- **Framework:** React Native (Expo SDK 52)
- **Language:** TypeScript
- **State Management:** React Context API
- **Navigation:** React Navigation (Stack + Tabs)
- **Styling:** StyleSheet (Theme-based design system)

### **Backend** (Planned)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT + OTP (Twilio/Termii)
- **File Storage:** AWS S3 / Cloudinary
- **Real-time:** Socket.io (for messaging)

---

## Project Structure

```
DatingApp/
├── src/
│   ├── assets/              # Images, fonts, icons
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   │
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Button, Input, Card, etc.
│   │   ├── forms/          # Form-specific components
│   │   ├── cards/          # ProfileCard, MatchCard, etc.
│   │   └── feedback/       # Loader, Toast, EmptyState
│   │
│   ├── screens/            # App screens
│   │   ├── Onboarding/     # Login, Signup, Profile setup flow
│   │   ├── Home/           # Discovery, Chats, Wallet, Profile, etc.
│   │   └── WelcomeScreen.tsx
│   │
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   │
│   ├── services/           # API & business logic
│   │   ├── api/            # API service layer
│   │   │   ├── mockAuthService.ts    # Mock API (development)
│   │   │   ├── realAuthService.ts    # Real API (production)
│   │   │   └── authService.ts        # Auto-switching service
│   │   ├── storage/        # AsyncStorage wrapper
│   │   └── notifications/  # Push notifications
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── UseFonts.ts
│   │
│   ├── context/            # React Context providers
│   │   └── ThemeContext.tsx
│   │
│   ├── utils/              # Utility functions
│   │   ├── constants.ts    # App constants
│   │   ├── validators.ts   # Input validation
│   │   └── formatters.ts   # Data formatting
│   │
│   ├── config/             # App configuration
│   │   ├── theme.ts        # Design system (colors, typography, spacing)
│   │   └── environment.ts  # Environment variables & feature flags
│   │
│   ├── types/              # TypeScript type definitions
│   └── data/               # Static data
│       └── CountryCodes.ts
│
├── App.tsx                 # Root component
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── app.json                # Expo config
```

---

## Design System

### **Theme Configuration**
All visual styling is centralized in `src/config/theme.ts`:

```typescript
// Colors
primary: '#EA276D'      // Pink (brand color)
black: '#000000'        // Backgrounds
white: '#FFFFFF'        // Text on dark
gray100-900: ...        // Gray scale

// Typography
Font: EB Garamond (Serif)
Sizes: 12px - 36px

// Spacing Scale
xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

// Components
Border Radius: 4px - 24px
Shadows: 5 elevation levels
Button Heights: 40px, 48px, 56px
```

### **Usage**
```typescript
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';

```

## Authentication Flow

```
Welcome Screen
    ↓
Signup (Phone/Email)
    ↓
OTP Verification (6-digit code) → Step 1 (11%)
    ↓
Name Input → Step 2 (22%)
    ↓
Date of Birth → Step 3 (33%)
    ↓
Gender Selection → Step 4 (44%)
    ↓
Looking For → Step 5 (55%)
    ↓
Relationship Goals → Step 6 (66%)
    ↓
Interests (min 5, max 10) → Step 7 (77%)
    ↓
Photo Upload (min 3, max 6) → Step 8 (88%)
    ↓
Bio & Prompts → Step 9 (100%)
    ↓
Home (Discovery Feed)
```

### **Progress Bar**
A thin animated progress indicator shows users completion percentage (11% → 100%) across the 9-step onboarding flow.

---

## Development Setup

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Expo Go app (for testing on phone)
- Git

```

---

## Testing

### **Manual Testing**
```bash
# Test on Android
npm run android

# Test on iOS (Mac only)
npm run ios

# Test on Web
npm run web
```


---

## Deployment

### **Build for Production**

```bash
# Android APK
eas build --platform android --profile preview

# iOS IPA (requires Apple Developer account)
eas build --platform ios --profile preview

# Submit to stores
eas submit --platform android
eas submit --platform ios
```
---

## Current Progress

### Completed (As of Feb 9, 2026)

**Foundation:**
- [x] Project setup (Expo + TypeScript)
- [x] Theme system (colors, typography, spacing)
- [x] Custom fonts (EB Garamond)
- [x] Navigation structure (Stack + Tab Navigator, 20+ routes)
- [x] Environment configuration
- [x] Mock API service layer (Auth + Photo services)
- [x] Onboarding flow configuration (9-step centralized config)

**Components:**
- [x] Button (5 variants, 3 sizes, loading states)
- [x] Input (validation, error states, password toggle)
- [x] OTPInput (6-digit, auto-focus, paste support)
- [x] OnboardingProgressBar (animated, 9-step support)
- [x] MarqueeColumn (animated background)
- [x] CountryPickerModal (searchable)
- [x] CoinBalance (compact + banner variants, low-balance pulse animation)
- [x] Flare (gradient background effect)

**Onboarding Screens (12):**
- [x] Welcome Screen (hero image, CTA buttons)
- [x] Signup Screen (phone/email, social login, animated background)
- [x] Login Screen (animated background, matching signup design)
- [x] OTP Verification (6-digit input, timer, resend, mock API)
- [x] Name Input (validation, character limits)
- [x] Date of Birth Screen (date picker, 18+ validation, age display)
- [x] Gender Selection Screen (Male/Female cards)
- [x] Looking For Screen (Men/Women/Everyone options)
- [x] Relationship Goals Screen (5 options)
- [x] Interests Selection Screen (multi-select, min 5, max 10)
- [x] Photo Upload Screen (2x3 grid, multi-select, min 3, max 6)
- [x] Bio Screen (About Me + 3 prompts, skip option)

**Home/Core Screens (10):**
- [x] Initializing Screen (loading/transition)
- [x] Nearby Matches Screen
- [x] Discovery Screen (swipe cards, PanResponder, coin-aware swiping, tap-to-view)
- [x] Profile Detail Screen (full photo, bio, basics, interests, action buttons)
- [x] Match Screen ("It's a Match!" with animated portrait photos, floating hearts)
- [x] Chats Screen (active matches row, filter tabs, conversation list, dropdown menu)
- [x] Chat Conversation Screen (message bubbles, media, hearts, icebreaker prompts, simulated replies)
- [x] Wallet Screen (token packages, premium features list)
- [x] Top Up Screen (token purchase grid, Naira pricing)
- [x] Explore Screen (placeholder)
- [x] Profile Screen (placeholder)

**Navigation:**
- [x] Stack Navigator (20+ screens)
- [x] Bottom Tab Navigator (Home, Explore, Chats, Wallet, Me)
- [x] Match screen with opacity transition + gesture disabled

**Services:**
- [x] Mock Authentication Service (sendOTP, verifyOTP, resendOTP)
- [x] Mock Photo Service (upload simulation with 10% failure rate)
- [x] Theme Context Provider
- [x] Font Loading Service
- [x] Country Codes Data (10 countries)

**Utils & Config:**
- [x] Bio Prompts (12 curated prompts, 3 defaults)
- [x] Constants (Gender, Looking For, Relationship Goals, Interests)
- [x] Validators (email, phone, password, age)
- [x] Formatters (phone, date, distance, currency)
- [x] Onboarding Flow Config (centralized step management)

### In Progress

- [ ] Backend API Integration
- [ ] Profile/Me Screen (full implementation)
- [ ] Explore Screen (full implementation)
- [ ] Settings Screen

### Upcoming

- [ ] Real-time messaging (Socket.io)
- [ ] Push Notifications
- [ ] Photo reordering (drag-and-drop)
- [ ] Video messages in chat
- [ ] Profile editing
- [ ] Advanced filters
- [ ] Analytics

---

## Onboarding Flow Details

### **Steps & Progress (9 Total):**

| Step | Screen | Progress | Status |
|------|--------|----------|--------|
| 1 | OTP Verification | 11% | ✅ Done |
| 2 | Name Input | 22% | ✅ Done |
| 3 | Date of Birth | 33% | ✅ Done |
| 4 | Gender Selection | 44% | ✅ Done |
| 5 | Looking For | 55% | ✅ Done |
| 6 | Relationship Goals | 66% | ✅ Done |
| 7 | Interests | 77% | ✅ Done |
| 8 | Photos | 88% | ✅ Done |
| 9 | Bio/Completion | 100% | ✅ Done |

### **Data Flow:**
Each screen passes accumulated user data to the next:
```
OTP → Name → DOB/Age → Gender → LookingFor → RelationshipGoal → Interests[] → Photos[] → Bio/Prompts
```


## 🔧 Configuration Files

### **Environment Variables**
```typescript
// src/config/environment.ts
- Controls dev/prod mode
- Test credentials
- Feature flags
- API endpoints
```

### **Theme System**
```typescript
// src/config/theme.ts
- Brand colors
- Typography (fonts, sizes)
- Spacing scale
- Component sizes
- Shadows & elevations
```

### **Constants**
```typescript
// src/utils/constants.ts
- Intent types
- Interests list
- Swipe limits
- Report reasons
- Regex patterns
```

---

## 🤝 Contributing

### **Coding Standards**

1. **Use Theme System:**
   ```typescript
   // ✅ Good
   backgroundColor: COLORS.primary
   
   // ❌ Bad
   backgroundColor: '#EA276D'
   ```

2. **Comment Your Code:**
   ```typescript
   /**
    * FUNCTION NAME
    * 
    * What it does and why.
    * 
    * @param param1 - Description
    * @returns Description
    */
   ```

3. **TypeScript Types:**
   ```typescript
   // Always define prop types
   interface ButtonProps {
     onPress: () => void;
     children: React.ReactNode;
   }
   ```

4. **File Naming:**
   - Components: `PascalCase.tsx`
   - Utilities: `camelCase.ts`
   - Styles: `ComponentName.styles.ts`

---

## Known Issues

- [x] ~~OTP doesn't expire~~ (10-min expiration implemented)
- [x] ~~Swipe shows only 2 profiles~~ (PanResponder stale closure fixed with refs)
- [x] ~~Keyboard doesn't switch Phone/Email~~ (fixed with key prop forcing remount)
- [x] ~~Tap shows wrong profile~~ (stale closure in handleViewProfile fixed)
- [ ] Back button doesn't save draft (implement draft service)
- [ ] No error boundary (add global error handler)
- [ ] Images not optimized (add compression)
- [ ] No photo reordering (drag-and-drop planned)
- [ ] All data is placeholder (pending backend API integration)

---

## Support & Contact

**Developer:** Olayode Bolade
**Email:** olayodeb6@gmail.com.com  
**GitHub:** github.com/bolade-olayode/dating-app

---

## License

Proprietary - All Rights Reserved


**Last Updated:** February 9, 2026
**Version:** 0.2.0 (Alpha)
