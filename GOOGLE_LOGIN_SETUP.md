## 🔐 Google Login Setup Guide - AQARX

Your website now has Google authentication ready! Follow these steps to activate it.

---

## ✅ **STEP 1: Get Firebase Credentials**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select an existing one
3. Click **⚙️ Project Settings** (bottom left)
4. Copy your Firebase configuration:
   ```
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
   ```

---

## ✅ **STEP 2: Enable Google Sign-In**

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Sign-in method** tab
3. Click **Google**
4. Toggle it **ON**
5. Set Project Support Email
6. Click **Save**

---

## ✅ **STEP 3: Configure Firebase Credentials**

Open `js/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY_HERE",           // ← Replace
  authDomain:        "your_project_id.firebaseapp.com",
  projectId:         "your_project_id",             // ← Replace
  storageBucket:     "your_project_id.firebasestorage.app",
  messagingSenderId: "your_sender_id",              // ← Replace
  appId:             "your_app_id"                  // ← Replace
};
```

---

## ✅ **STEP 4: Add Authorized JavaScript Origins** (IMPORTANT!)

1. In Firebase Console, go to **Settings** → **Authorized domains**
2. Add your domain(s):
   - `localhost:3000` (for local testing)
   - `localhost` (if running locally)
   - Your deployed domain (e.g., `aqarx.com`)

---

## ✅ **STEP 5: Test Google Login**

1. Open `login.html` or `register.html`
2. Click **"Continue with Google"** button
3. You should see Google's login popup
4. After successful login:
   - User is stored in localStorage
   - UI updates to show user profile
   - Redirect happens to `properties.html`

---

## 📝 **What Happens After Google Login?**

✅ User data saved to `localStorage`:
```javascript
{
  uid:         "firebase_user_id",
  email:       "user@gmail.com",
  displayName: "User Name",
  photoURL:    "profile_picture_url",
  loginMethod: "google"
}
```

✅ Access token saved for API requests

✅ User profile shows in navigation (top right)

✅ Logout button appears in dropdown menu

---

## 🔗 **File Locations**

- **Firebase Config**: `js/firebase-config.js`
- **Auth Logic**: `js/auth.js`
- **Login Page**: `login.html`
- **Register Page**: `register.html`
- **Environment vars** (reference): `.env`

---

## 🚨 **Troubleshooting**

### ❌ "Firebase SDK not loaded"
- Check that Firebase CDN URLs are loading (no typos)
- Check browser console for errors (F12)

### ❌ "Popup blocked"
- User needs to allow popups for your domain
- Check browser popup blocker settings

### ❌ "Invalid credentials"
- Double-check Firebase config values in `firebase-config.js`
- Make sure Project ID matches exactly

### ❌ "Not in authorized domain list"
- Add your domain to Firebase Settings → Authorized domains
- For localhost, use `localhost` or `localhost:3000`

---

## 🎯 **Next Steps**

1. ✅ Update `js/firebase-config.js` with your credentials
2. ✅ Enable Google Sign-In in Firebase Console
3. ✅ Add authorized domains in Firebase Settings
4. ✅ Test Google login on login.html
5. ✅ Deploy to production when ready

---

**All files are ready to go!** Just add your Firebase credentials and you're done. 🎉
