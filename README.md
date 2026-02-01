#  xxxxx Dating App

> A values-driven dating app for intentional relationships, focused on the African market.

**Status:**  In Development  
**Platform:** iOS & Android (React Native + Expo)  
**Target Launch:** Q2 2026

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
│   │   ├── Auth/           # Login, Signup
│   │   ├── Onboarding/     # Profile setup flow
│   │   ├── Discovery/      # Swipe feed
│   │   ├── Matches/        # Matched users
│   │   ├── Messages/       # Chat
│   │   └── Profile/        # User profile
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
OTP Verification (6-digit code)
    ↓
Name Input
    ↓
Date of Birth
    ↓
Gender Selection
    ↓
Interests (min 5)
    ↓
Photo Upload (min 3)
    ↓
Bio & Prompts
    ↓
Home (Discovery Feed)
```

### **Progress Bar**
A thin progress indicator shows users completion percentage (14% → 100%) across onboarding.

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

## 📋 Current Progress

### Completed (As of Feb 2026)

**Foundation:**
- [x] Project setup (Expo + TypeScript)
- [x] Theme system (colors, typography, spacing)
- [x] Custom fonts (EB Garamond)
- [x] Navigation structure
- [x] Environment configuration
- [x] Mock API service layer

**Components:**
- [x] Button (5 variants, 3 sizes, loading states)
- [x] Input (validation, error states, password toggle)
- [x] OTPInput (6-digit, auto-focus, paste support)
- [x] OnboardingProgressBar (animated)
- [x] MarqueeColumn (animated background)
- [x] CountryPickerModal (searchable)

**Screens:**
- [x] Welcome Screen (hero image, CTA buttons)
- [x] Signup Screen (phone/email, social login, animated background)
- [x] Login Screen (email/password, social login)
- [x] OTP Verification (6-digit input, timer, resend)
- [x] Name Input (validation, character limits)

**Services:**
- [x] Mock Authentication Service
- [x] Theme Context Provider
- [x] Font Loading Service
- [x] Country Codes Data

### In Progress

- [ ] Date of Birth Screen
- [ ] Gender Selection Screen
- [ ] Interests Picker (multi-select, min 5)
- [ ] Photo Upload (min 3, max 6)
- [ ] Bio & Prompts

### Upcoming

- [ ] Discovery Feed (swipe cards)
- [ ] Matching Algorithm
- [ ] Chat/Messaging
- [ ] Profile Screen
- [ ] Settings
- [ ] Premium Features
- [ ] Backend Integration
- [ ] Push Notifications
- [ ] Analytics

---

## Onboarding Flow Details

### **Steps & Progress:**

| Step | Screen | Progress | Status |
|------|--------|----------|--------|
| 1 | OTP Verification | 14% | ✅ Done |
| 2 | Name Input | 28% | ✅ Done |
| 3 | Date of Birth | 42% | 🚧 Building |
| 4 | Gender Selection | 57% | 📅 Next |
| 5 | Interests | 71% | 📅 Planned |
| 6 | Photos | 85% | 📅 Planned |
| 7 | Bio/Completion | 100% | 📅 Planned |


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

- [ ] OTP doesn't expire (add 10-min expiration)
- [ ] Back button doesn't save draft (implement draft service)
- [ ] No error boundary (add global error handler)
- [ ] Images not optimized (add compression)

---

## Support & Contact

**Developer:** Olayode Bolade
**Email:** olayodeb6@gmail.com.com  
**GitHub:** github.com/bolade-olayode/dating-app

---

## License

Proprietary - All Rights Reserved


**Last Updated:** February 1, 2026  
**Version:** 0.1.0 (Alpha)
