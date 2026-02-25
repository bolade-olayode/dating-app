# MeetPie Dating App

> A values-driven dating app for intentional relationships, focused on the African market.

**Status:** In Development (Alpha)
**Platform:** iOS & Android (React Native + Expo)
**Target Launch:** Q1 2026

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
│   │       ├── cloudinaryService.ts  # Cloudinary unsigned upload
│   │       ├── matchingService.ts    # Discovery, swipes, matches, likes
│   │       ├── chatService.ts        # Conversations, messages, read receipts
│   │       ├── moderationService.ts  # Report, block/unblock users
│   │       ├── userService.ts        # Profile updates (post-onboarding)
│   │       └── notificationService.ts # Notifications, read/delete
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx   # Theme provider
│   │   └── UserContext.tsx    # Global user state (coins, profile, auth, unreadChatCount)
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

### Done (Wired to Backend) — 36 Endpoints
| Service | Endpoint | Description |
|---|---|---|
| **Auth** | `POST /api/onboarding/init` | Send signup OTP (email + phone) |
| | `POST /api/onboarding/verify` | Verify signup OTP, returns JWT |
| | `POST /api/auth/login/init` | Send login OTP |
| | `POST /api/auth/login/verify` | Verify login OTP |
| | `GET /api/auth/me` | Get current user profile (+ session restore) |
| | `POST /api/auth/logout` | Logout (invalidate token) |
| | `DELETE /api/auth/delete-account` | Delete account and all user data |
| **Onboarding** | `PATCH /api/onboarding/details` | Save profile details (name, DOB, gender, etc.) |
| | `GET /api/onboarding/interests` | Fetch interest categories from API |
| | `PATCH /api/onboarding/interests` | Save selected interests |
| | `PATCH /api/onboarding/photos` | Upload Cloudinary URLs, finalize onboarding |
| **Matching** | `POST /api/matching/location` | Update user location (lat, long, city) |
| | `GET /api/matching/discover` | Discover profiles (with distance/limit filters) |
| | `POST /api/matching/swipe` | Swipe like/pass (returns `isMatch` boolean) |
| | `GET /api/matching/matches` | Get all matches |
| | `GET /api/matching/likes` | Get users who liked you |
| | `DELETE /api/matching/unmatch/{matchId}` | Unmatch a user |
| | `GET /api/matching/stats` | Get matching statistics |
| **Chat** | `GET /api/chat/conversations` | Get all conversations |
| | `GET /api/chat/unread-count` | Get unread message count |
| | `GET /api/chat/{matchId}/messages` | Get messages for a conversation |
| | `POST /api/chat/{matchId}/messages` | Send a message |
| | `PATCH /api/chat/{matchId}/read` | Mark conversation as read |
| | `PATCH /api/chat/messages/{messageId}/read` | Mark single message as read |
| | `DELETE /api/chat/messages/{messageId}` | Delete a message |
| **Moderation** | `POST /api/moderation/report` | Report a user (with reason) |
| | `GET /api/moderation/reports` | Get submitted reports |
| | `POST /api/moderation/block` | Block a user |
| | `DELETE /api/moderation/block/{blockedUserId}` | Unblock a user |
| | `GET /api/moderation/blocked` | Get blocked users list |
| **User** | `PATCH /api/user/profile` | Update profile (post-onboarding edits) |
| **Notifications** | `GET /api/notifications` | Get notifications (paginated) |
| | `GET /api/notifications/unread-count` | Get unread notification count |
| | `PATCH /api/notifications/read-all` | Mark all notifications as read |
| | `PATCH /api/notifications/{id}/read` | Mark single notification as read |
| | `DELETE /api/notifications/{id}` | Delete a notification |

### Available but Not Yet Wired — 8 Endpoints
| Service | Endpoint | Description |
|---|---|---|
| **Wallet** | `GET /api/wallet/balance` | Get current coin balance |
| | `GET /api/wallet/packages` | Get available coin packages |
| | `GET /api/wallet/actions` | Get coin-gated action costs |
| | `GET /api/wallet/transactions` | Paginated transaction history |
| | `POST /api/wallet/purchase` | Verify IAP receipt → credit coins |
| | `POST /api/wallet/spend` | Spend coins on premium action |
| **Verification** | `POST /api/verification/initiate` | Start Smile Identity selfie check |
| | `GET /api/verification/status` | Get current verification status |

### Admin Endpoints (Backend Only — Not Used in Mobile App)
14 endpoints under `/api/admin/` for user management, analytics, interest CRUD, coin packages, and support reports. See `DEVELOPMENT_LOG.md`.

### Remaining Backend Endpoints Still Needed
See `DEVELOPMENT_LOG.md` for remaining requirements: WebSocket real-time chat, Discovery Settings API, Push Notifications.

### Known Backend Issues
See `BACKEND_FIXES.md` for priority-ranked issues (MongoDB timeouts, incorrect HTTP status codes, OTP delivery failures).

---

## Authentication Flow

```
App Launch
    ↓
Token exists? ──yes──→ GET /api/auth/me ──success──→ HomeTabs (session restore)
    │                         │
    no                     fail (401) → Welcome Screen
    ↓
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

Logout / Delete Account → Clear token + context → Welcome Screen
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

### Completed (As of Feb 2026)

**Foundation:**
- [x] Project setup (Expo SDK 52 + TypeScript)
- [x] Theme system (colors, typography, spacing)
- [x] Custom fonts (Sora — 8 weights)
- [x] Navigation structure (Stack + Tab Navigator, 25+ routes)
- [x] Environment configuration with feature flags
- [x] Mock API service layer (Auth + Photo)
- [x] Real API service layer (Auth + Onboarding + Matching + Chat + Moderation + User + Notifications)
- [x] Cloudinary image upload service
- [x] Onboarding flow config (centralized step management)
- [x] UserContext (global state: coins, profile, auth, matches, unreadChatCount)
- [x] EAS Build configured (Android APK + iOS ad-hoc)

**API Services (12 total):**
- [x] Auth Service (mock/real auto-switch)
- [x] Onboarding Service (details, interests, photos)
- [x] Cloudinary Service (unsigned upload)
- [x] Matching Service (location, discover, swipe, matches, likes, unmatch, stats)
- [x] Chat Service (conversations, messages, send, read, unread count, delete)
- [x] Moderation Service (report, block, unblock, blocked list)
- [x] User Service (profile update)
- [x] Notification Service (list, unread count, mark read, delete)

**Screens Built (25+):**
- [x] Intro Slideshow (4 slides, skip/next, gradient buttons)
- [x] Welcome, Signup, Login, Register (dual-mode: login/signup)
- [x] OTP Verification (real API, countdown, resend)
- [x] Name, DOB, Gender, LookingFor, RelationshipGoals (API batch save)
- [x] Interests (fetches from API, local fallback)
- [x] Photo Upload (Cloudinary upload, finalizes onboarding via API)
- [x] Discovery (real API profiles, real swipe actions, real isMatch detection)
- [x] Profile Detail (like/swipe API, report, block)
- [x] Profile View, Edit Profile (save to API via userService)
- [x] Match Screen (animated portraits, floating hearts)
- [x] Chats (API conversations + matches, unread count)
- [x] Chat Conversation (API messages, optimistic send, 10s polling, mark read)
- [x] Wallet, Top Up (6 coin packages, Naira pricing)
- [x] Explore (browse by interest + relationship type)
- [x] Explore Category (API profile fetch per category)
- [x] Discovery Settings
- [x] Privacy & Safety (blocked users list from API, unblock)
- [x] Profile Performance (boost options)
- [x] Account Actions (logout + delete account wired)
- [x] Notifications (full screen, pull-to-refresh, mark-all-read, delete)

### In Progress / Next
- [x] Session restore on startup (token → getMe → HomeTabs)
- [x] Login flow completion (verify → getMe → store profile → HomeTabs)
- [x] Logout wired to backend API + context clear
- [x] Delete account wired to backend API + context clear
- [x] Wire Discovery, Explore to real matching API
- [x] Wire Chat screens to real chat API
- [x] Wire Moderation (report, block) to real API
- [x] Wire Edit Profile to real user API
- [x] Wire Notifications screen to real API
- [x] Dynamic chat badge on tab bar (real unread count)
- [x] ProfileDetailScreen shows real bio, basics (height/weight/zodiac/education), interests
- [x] Edit Profile saves bio, height, weight, education to backend (HEIC photo fix, goal ID mapping)
- [x] Profile completion banner — 7 weighted checks totalling 100%
- [ ] Wallet screen wired to real balance + packages API (walletService)
- [ ] TopUp screen wired to real purchase flow (/api/wallet/purchase)
- [ ] Profile verification flow (Smile Identity selfie — /api/verification/initiate)
- [ ] Real-time chat (WebSocket — currently using 10s REST polling)
- [ ] Payment integration (Paystack)
- [ ] Push notifications (FCM/APNs via Expo)
- [ ] Admin dashboard (subdomain)

---

## Known Issues
- [x] ~~PanResponder stale closure~~ (fixed with useRef)
- [x] ~~Keyboard not switching Phone/Email~~ (fixed with key prop)
- [x] ~~Interest screen local data flash~~ (fixed with loading state)
- [x] ~~OTP 500 errors~~ (retry logic, backend still has intermittent issues — see BACKEND_FIXES.md)
- [x] ~~Session restore logging out on DB timeout~~ (fixed: only 401 clears session, other errors fall back to cached data)
- [x] ~~All Discovery/Explore/Chat data is placeholder~~ (all wired to real API with mock fallback)
- [ ] Backend OTP sending broken (500 HTML error) — backend dev fixing
- [ ] Chat uses REST polling (10s interval) — replace with WebSocket later
- [ ] No error boundary (add global error handler)
- [ ] Geolocation hardcoded to Lagos (calls updateLocation with static coords)
- [ ] No offline handling
- [ ] No push notifications yet

---

## Support & Contact

**Developer:** Olayode Bolade
**Email:** olayodeb6@gmail.com
**GitHub:** github.com/bolade-olayode/dating-app

---

## License

Proprietary - All Rights Reserved

**Last Updated:** February 24, 2026
**Version:** 0.5.0 (Alpha — Profile Polish + New Backend Endpoints Discovered)
