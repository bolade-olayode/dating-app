# Backend Fixes Required Before Production

> **Last Updated:** February 11, 2026
> **Frontend Version:** 0.3.0 (Alpha)
> **Backend:** https://meetpie-backend.onrender.com
> **Priority:** P0 = Launch blocker, P1 = Should fix before launch, P2 = Can ship but fix soon

---

## P0 — Launch Blockers

### 1. MongoDB Connection Timeout
**Status:** Active bug
**Error:** `Operation 'users.findOne()' buffering timed out after 10000ms`
**Affected:** ALL endpoints — signup, login, getMe, etc.
**HTTP Status Returned:** 403 (incorrect — see #2)

**Root Cause:** Mongoose cannot connect to MongoDB when requests arrive. Connection pool is either not established, exhausted, or Atlas cluster is unreachable.

**Fix Options:**
- Ensure `mongoose.connect()` completes **before** Express starts accepting requests
- Set proper connection pool options in the MongoDB URI:
  ```
  ?maxPoolSize=20&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000
  ```
- Check MongoDB Atlas IP whitelist — must include Render's outbound IPs (or `0.0.0.0/0` during dev)
- If using Atlas free tier (M0): max 500 connections — keep `maxPoolSize` at 10-20
- Add a health check endpoint (`GET /health`) that verifies DB connectivity

**Impact:** Users cannot sign up, log in, or restore sessions when this occurs.

---

### 2. Incorrect HTTP Status Codes for Server Errors
**Status:** Active bug
**Problem:** Database timeouts and internal errors return `403 Forbidden` instead of proper status codes.

**Expected behavior:**
| Scenario | Correct Status |
|----------|---------------|
| DB timeout / connection error | `503 Service Unavailable` |
| Unhandled server error | `500 Internal Server Error` |
| Invalid/expired token | `401 Unauthorized` |
| Missing permissions | `403 Forbidden` |
| Validation error | `400 Bad Request` |

**Why it matters:** The frontend uses HTTP status codes to decide whether to log users out (401) or retry/fallback (500/503). Returning 403 for DB errors causes the app to incorrectly interpret server issues as auth failures.

**Fix:** Add global error handling middleware in Express:
```js
app.use((err, req, res, next) => {
  if (err.name === 'MongooseError' || err.name === 'MongoServerError') {
    return res.status(503).json({ message: 'Service temporarily unavailable' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});
```

---

## P1 — Should Fix Before Launch

### 3. OTP Email/SMS Delivery Reliability
**Status:** Needs verification
**Problem:** `POST /api/onboarding/init` returns 500 when attempting to send OTP.

**Check:**
- Is the email service (SendGrid/Nodemailer/etc.) configured and active?
- Are SMTP credentials valid and not rate-limited?
- Is the SMS provider (if used) configured for Nigerian phone numbers (+234)?
- Add error logging in the OTP send handler to capture the actual failure reason

---

### 4. Token Expiration & Refresh Strategy
**Status:** Not implemented
**Problem:** No clear token expiration or refresh mechanism.

**Needed:**
- Set JWT `expiresIn` to a reasonable duration (e.g., 7 days for mobile)
- Return expiration timestamp in login/verify responses
- Consider refresh tokens for seamless session extension
- `POST /api/auth/logout` should invalidate the token server-side (blacklist or delete)

---

### 5. Rate Limiting on Auth Endpoints
**Status:** Not implemented
**Endpoints:** `/api/onboarding/init`, `/api/auth/login/init`, `/api/onboarding/verify`, `/api/auth/login/verify`

**Needed:**
- Limit OTP requests to ~3 per phone/email per 10 minutes
- Limit OTP verify attempts to ~5 per session (prevent brute force)
- Return `429 Too Many Requests` with `Retry-After` header

---

### 6. Input Validation on All Endpoints
**Status:** Needs review
**Problem:** Backend should validate all inputs and return `400` with clear error messages.

**Check these:**
- Phone number format validation (E.164: `+234XXXXXXXXXX`)
- Email format validation
- OTP code format (6 digits)
- `PATCH /api/onboarding/details` — validate required fields (name, DOB, gender, etc.)
- `PATCH /api/onboarding/interests` — validate interest IDs exist
- `PATCH /api/onboarding/photos` — validate URLs are Cloudinary URLs, minimum 3 photos

---

## P2 — Fix Soon After Launch

### 7. Consistent API Response Format
**Status:** Inconsistent
**Problem:** Some endpoints wrap data in `{ status, message, data: { ... } }`, others return flat objects.

**Recommended standard:**
```json
{
  "status": "success",
  "message": "User fetched successfully",
  "data": { ... }
}
```
Error responses:
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "code": "VALIDATION_ERROR"
}
```

---

### 8. `DELETE /api/auth/delete-account` — Data Cleanup
**Status:** Needs verification
**Problem:** Account deletion should cascade-delete all user data.

**Checklist:**
- [ ] Delete user document
- [ ] Delete all matches involving the user
- [ ] Delete all chat messages
- [ ] Delete all swipe records (likes/passes)
- [ ] Remove photos from Cloudinary
- [ ] Invalidate all active tokens
- [ ] Return `200` on success, `404` if user not found

---

### 9. `POST /api/auth/logout` — Token Invalidation
**Status:** Needs verification
**Problem:** Logout should invalidate the JWT server-side, not just acknowledge the request.

**Options:**
- Maintain a token blacklist (Redis or in-memory with TTL matching token expiry)
- Use short-lived tokens + refresh token rotation
- At minimum: delete the session record if using session-based auth

---

### 10. CORS & Security Headers
**Status:** Needs review

**Checklist:**
- [ ] CORS configured for production domains only (not `*`)
- [ ] `helmet` middleware enabled
- [ ] Request body size limits set (prevent large payload attacks)
- [ ] MongoDB injection protection (use `express-mongo-sanitize`)

---

## API Endpoints — Current Status

### Working (Verified from Frontend)
| Endpoint | Notes |
|----------|-------|
| `POST /api/onboarding/init` | Works when DB is connected, 500 when DB times out |
| `POST /api/onboarding/verify` | Works |
| `PATCH /api/onboarding/details` | Works |
| `GET /api/onboarding/interests` | Works |
| `PATCH /api/onboarding/interests` | Works |
| `PATCH /api/onboarding/photos` | Works |
| `POST /api/auth/login/init` | Not yet tested (blocked by DB issue) |
| `POST /api/auth/login/verify` | Not yet tested |
| `GET /api/auth/me` | Returns 403 with DB timeout error |
| `POST /api/auth/logout` | Not yet tested |
| `DELETE /api/auth/delete-account` | Not yet tested |

### Not Yet Wired (Frontend Ready When Backend Is)
| Endpoint | Frontend Screen |
|----------|----------------|
| `POST /api/matching/location` | DiscoveryScreen |
| `GET /api/matching/discover` | DiscoveryScreen |
| `POST /api/matching/swipe` | DiscoveryScreen |
| `GET /api/matching/matches` | ChatsScreen |
| `GET /api/matching/likes` | DiscoveryScreen |
| `GET /api/chat/conversations` | ChatsScreen |
| `POST /api/chat/:id/messages` | ChatConversationScreen |
| `POST /api/moderation/report` | ProfileDetailScreen |
| `POST /api/moderation/block` | ProfileDetailScreen |

---

## How to Test

Once fixes are applied, the frontend can verify by:
1. **Fresh signup:** Welcome → Signup → Register → OTP → Onboarding → HomeTabs
2. **Login:** Welcome → Login → Register → OTP → HomeTabs (profile loaded)
3. **Session restore:** Close app → Reopen → Should go straight to HomeTabs
4. **Logout:** Account Actions → Logout → Welcome (token cleared)
5. **DB resilience:** If DB hiccups, logged-in users should still see cached data (not get kicked out)
