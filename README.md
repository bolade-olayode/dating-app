# MeetPie (Opueh) Dating App

> A values-driven dating app for intentional relationships, focused on the African market.

**Status:** In Development (Alpha)
**Platform:** iOS & Android (React Native + Expo)
**Target Launch:** Q2 2026

---

## About MeetPie

MeetPie is a modern dating application designed to help people find meaningful connections. Unlike typical swipe-based apps, MeetPie focuses on values, interests, and intentional relationship-building with a coin-based monetization model.

### Key Features
- **Phone/Email Verification** - Secure OTP-based signup & login
- **Rich Profiles** - Photos (Cloudinary), interests, relationship goals
- **Intent-Based Matching** - Friendship, Dating, Serious, Marriage, Casual
- **Curated Matches** - Gender-differentiated daily swipe limits (10 men / 15 women)
- **Explore** - Browse by interest categories and relationship type
- **In-App Messaging** - Connect with matches (real-time planned)
- **Coin Economy** - Token packages from ₦2,000 to ₦100,000 for premium features
- **Intro Slideshow** - 4-screen onboarding intro for new users

---

## Tech Stack

### Frontend
- **Framework:** React Native (Expo SDK 52)
- **Language:** TypeScript
- **State Management:** React Context API (UserContext)
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **Styling:** StyleSheet (custom dark theme, Sora font)
- **Image Upload:** Cloudinary (unsigned upload, no SDK)

### Backend (Live)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT + OTP (email/phone)
- **File Storage:** Cloudinary
- **Hosting:** Render
- **API Base:** `https://meetpie-backend.onrender.com`

### Backend (Planned)
- **Real-time:** Socket.io (messaging + notifications)
- **Payments:** Paystack / Stripe
- **Push Notifications:** FCM / APNs via Expo
- **Admin Dashboard:** React/Next.js on subdomain

---

## Project Structure

```
OpuehApp/
├── src/
│   ├── assets/
│   │   ├── images/          # App images & backgrounds
│   │   └── fonts/           # Sora font family (8 weights)
│   │
│   ├── components/
│   │   ├── common/          # Button, Input, OTPInput, CountryPicker
│   │   └── ui/              # CoinBalance, Flare, HeartProgressBar, ProgressIndicator
│   │
│   ├── screens/
│   │   ├── IntroSlideshow/  # 4-screen intro slideshow
│   │   ├── Onboarding/      # Signup, Login, Register, OTP, Name, DOB,
│   │   │                    # Gender, LookingFor, RelationshipGoals,
│   │   │                    # Interests, PhotoUpload
│   │   ├── Home/            # Discovery, Chats, ChatConversation, Wallet,
│   │   │                    # TopUp, Match, ProfileDetail, ProfileView,
│   │   │                    # EditProfile, Explore, ExploreCategory,
│   │   │                    # DiscoverySettings, PrivacySafety,
│   │   │                    # ProfilePerformance, AccountActions
│   │   └── WelcomeScreen.tsx
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx  # Stack navigator (25+ routes)
│   │   └── TabNavigator.tsx  # Bottom tabs (Home, Explore, Chats, Wallet, Me)
│   │
│   ├── services/
│   │   └── api/
│   │       ├── authService.ts        # Auto-switching mock/real service
│   │       ├── mockAuthService.ts    # Mock API (development)
│   │       ├── realAuthService.ts    # Real API (production)
│   │       ├── onboardingService.ts  # Onboarding API (details, interests, photos)
│   │       └── cloudinaryService.ts  # Cloudinary unsigned upload
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx   # Theme provider
│   │   └── UserContext.tsx    # Global user state (coins, profile, auth)
│   │
│   ├── config/
│   │   ├── environment.ts    # API URLs, feature flags, Cloudinary config
│   │   ├── fonts.ts          # Sora font family configuration
│   │   ├── theme.ts          # Design system (colors, typography, spacing)
│   │   └── onboardingFlow.ts # Onboarding step management
│   │
│   ├── utils/
│   │   ├── constant.ts       # App constants, interests, swipe limits, storage keys
│   │   ├── validators.ts     # Input validation
│   │   ├── formatters.ts     # Data formatting
│   │   └── bioPrompts.ts     # Bio prompt questions
│   │
│   ├── hooks/
│   │   └── UseFonts.ts       # Font loading hook
│   │
│   └── data/
│       └── CountryCodes.ts   # Country codes with flags
│
├── App.tsx                   # Root component (UserProvider + ThemeProvider)
├── app.json                  # Expo config (EAS project ID configured)
├── eas.json                  # EAS Build profiles (dev, preview, production)
├── package.json
└── tsconfig.json
```

---

## API Integration Status

### Done (Wired to Backend)
| Endpoint | Description |
|---|---|
| `POST /api/onboarding/init` | Send signup OTP (email + phone) |
| `POST /api/onboarding/verify` | Verify signup OTP, returns JWT |
| `PATCH /api/onboarding/details` | Save profile details (name, DOB, gender, etc.) |
| `GET /api/onboarding/interests` | Fetch interest categories from API |
| `PATCH /api/onboarding/interests` | Save selected interests |
| `PATCH /api/onboarding/photos` | Upload Cloudinary URLs, finalize onboarding |
| `POST /api/auth/login/init` | Send login OTP |
| `POST /api/auth/login/verify` | Verify login OTP |
| `GET /api/auth/me` | Get current user profile |

### Remaining Backend Endpoints
See `DEVELOPMENT_LOG.md` for the full requirements list covering Discovery, Explore, Messaging, Wallet/Payments, Safety, Notifications, and Admin Dashboard.

---

## Monetization (Coin Economy)

### Token Packages
| Package | Coins | Bonus | Price |
|---|---|---|---|
| Starter | 150 | - | ₦2,000 |
| Silver | 450 | +50 | ₦5,000 |
| Gold | 1,000 | +200 | ₦10,000 |
| Platinum | 2,300 | +500 | ₦20,000 |
| Elite | 6,500 | +700 | ₦50,000 |
| Odogwu | 10,000 | +1,000 | ₦100,000 |

### Feature Costs
- Extra swipe: 5 coins
- Swipe Pass (24hr unlimited): 120 coins
- Super Like: 50 coins
- Profile Boost: 50 coins
- Priority Message: 80 coins
- Rewind: 30 coins
- Read Receipts: 40 coins
- See Who Likes You: 25 coins
- Profile Visitors: 100 coins
- Spotlight: 200 coins
- Verified Badge: 250 coins

### Swipe Limits
- Free men: 10 swipes/day
- Free women: 15 swipes/day

---

## Authentication Flow

```
Intro Slideshow (4 screens, first launch only)
    ↓
Welcome Screen
    ↓
┌─ Signup ──────────────────┐   ┌─ Login ─────────────────┐
│ Register (phone + email)  │   │ Register (phone OR email)│
│        ↓                  │   │        ↓                 │
│ OTP Verification          │   │ OTP Verification         │
│        ↓                  │   │        ↓                 │
│ Name → DOB → Gender →    │   │ GET /api/auth/me         │
│ LookingFor →              │   │        ↓                 │
│ RelationshipGoals (API) → │   │ HomeTabs                 │
│ Interests (API) →         │   └──────────────────────────┘
│ Photos (Cloudinary→API) → │
│ HomeTabs                  │
└───────────────────────────┘
```

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app (for testing on phone)
- Git

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

### Environment
The app auto-switches between mock and real API via `src/config/environment.ts`:
```typescript
USE_MOCK_API: false  // Set to true for offline development
```

---

## Build & Distribution

### EAS Build Profiles
```bash
# Android APK (for testers)
eas build --platform android --profile preview

# iOS Internal Distribution (ad-hoc, requires Apple Dev account)
eas build --platform ios --profile preview

# Register iOS test devices
eas device:create

# Production builds
eas build --platform android --profile production
eas build --platform ios --profile production
```

---

## Current Progress

### Completed (As of Feb 11, 2026)

**Foundation:**
- [x] Project setup (Expo SDK 52 + TypeScript)
- [x] Theme system (colors, typography, spacing)
- [x] Custom fonts (Sora — 8 weights)
- [x] Navigation structure (Stack + Tab Navigator, 25+ routes)
- [x] Environment configuration with feature flags
- [x] Mock API service layer (Auth + Photo)
- [x] Real API service layer (Auth + Onboarding)
- [x] Cloudinary image upload service
- [x] Onboarding flow config (centralized step management)
- [x] UserContext (global state: coins, profile, auth, matches)
- [x] EAS Build configured (Android APK + iOS ad-hoc)

**Screens Built (25+):**
- [x] Intro Slideshow (4 slides, HeartProgressBar, skip/next)
- [x] Welcome, Signup, Login, Register (dual-mode: login/signup)
- [x] OTP Verification (real API, countdown, resend)
- [x] Name, DOB, Gender, LookingFor, RelationshipGoals (API batch save)
- [x] Interests (fetches from API, local fallback)
- [x] Photo Upload (Cloudinary upload, finalizes onboarding via API)
- [x] Discovery (swipe cards, coin-aware, tap-to-view, match trigger)
- [x] Profile Detail, Profile View, Edit Profile
- [x] Match Screen (animated portraits, floating hearts)
- [x] Chats, Chat Conversation (bubbles, media, icebreakers, simulated replies)
- [x] Wallet, Top Up (6 coin packages, Naira pricing)
- [x] Explore (browse by interest + relationship type)
- [x] Explore Category (profile grid, top profiles)
- [x] Discovery Settings, Privacy & Safety
- [x] Profile Performance (boost options)
- [x] Account Actions

### In Progress / Next
- [ ] Session restore on startup (token → getMe → HomeTabs)
- [ ] Login flow completion (existing users)
- [ ] Wire Discovery, Explore, Messaging to real API
- [ ] Real-time chat (WebSocket)
- [ ] Payment integration (Paystack)
- [ ] Admin dashboard (subdomain)

---

## Known Issues
- [x] ~~PanResponder stale closure~~ (fixed with useRef)
- [x] ~~Keyboard not switching Phone/Email~~ (fixed with key prop)
- [x] ~~Interest screen local data flash~~ (fixed with loading state)
- [x] ~~OTP 500 errors~~ (fixed with backend wake-up ping + retry)
- [ ] All Discovery/Explore/Chat data is placeholder (pending backend)
- [ ] No error boundary (add global error handler)
- [ ] Geolocation hardcoded to Lagos
- [ ] No offline handling

---

## Support & Contact

**Developer:** Olayode Bolade
**Email:** olayodeb6@gmail.com
**GitHub:** github.com/bolade-olayode/dating-app

---

## License

Proprietary - All Rights Reserved

**Last Updated:** February 11, 2026
**Version:** 0.3.0 (Alpha)
