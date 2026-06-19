// ===================================================
// HOW TO USE GOOGLE LOGIN IN YOUR APP
// ===================================================

// 1. CHECK IF USER IS LOGGED IN
const currentUser = isUserLoggedIn();

if (currentUser) {
  console.log('User logged in:', currentUser.email);
  console.log('User ID:', currentUser.uid);
  console.log('Display Name:', currentUser.displayName);
} else {
  console.log('User not logged in');
}

// ===================================================
// 2. USE USER DATA IN API CALLS
// ===================================================

// Get the stored auth token
const authToken = localStorage.getItem('authToken');
const user = isUserLoggedIn();

// Example: Send request to your Cloudflare Worker with user auth
async function sendAuthenticatedRequest() {
  const response = await fetch('https://your-worker.workers.dev/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,  // ← Send token
      'X-User-ID': user.uid                     // ← Send user ID
    },
    body: JSON.stringify({
      message: 'Hello from authenticated user',
      userEmail: user.email
    })
  });

  const data = await response.json();
  console.log('Response:', data);
}

// ===================================================
// 3. USE IN YOUR CHATBOT
// ===================================================

// Example: Send user context to chatbot worker
async function sendToChatbotAsAuthenticatedUser() {
  const user = isUserLoggedIn();
  
  const response = await fetch('https://aqarx-ai.mahmoudnabil03.workers.dev/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'X-User-Email': user?.email || 'guest'
    },
    body: JSON.stringify({
      message: 'I want to buy a property',
      userId: user?.uid,
      userName: user?.displayName
    })
  });

  const data = await response.json();
  console.log('Chatbot response:', data.reply);
}

// ===================================================
// 4. REDIRECT BASED ON LOGIN STATUS
// ===================================================

// Protect pages - redirect if not logged in
function requireLogin() {
  const user = isUserLoggedIn();
  if (!user) {
    window.location.href = 'login.html';
  }
}

// Example: On properties listing page
// requireLogin();  // Uncomment to require login

// ===================================================
// 5. ACCESS USER PHOTO & PROFILE
// ===================================================

const user = isUserLoggedIn();

if (user && user.photoURL) {
  // Display user profile photo
  document.getElementById('userPhoto').src = user.photoURL;
  document.getElementById('userName').textContent = user.displayName;
}

// ===================================================
// 6. CUSTOM USER DATA (Firebase Firestore - Optional)
// ===================================================

// To store additional user data (preferences, saved listings, etc.):
// 1. Enable Firestore in Firebase Console
// 2. Use Firestore SDK to save/retrieve custom data
// 
// Example:
// const db = firebase.firestore();
// 
// // Save custom user data
// db.collection('users').doc(user.uid).set({
//   email: user.email,
//   displayName: user.displayName,
//   savedProperties: [],
//   preferences: {}
// });
//
// // Retrieve custom user data
// db.collection('users').doc(user.uid).get().then(doc => {
//   if (doc.exists) {
//     console.log('User data:', doc.data());
//   }
// });

// ===================================================
// 7. AVAILABLE FUNCTIONS IN firebase-config.js
// ===================================================

/*
✅ loginWithGoogle()              → Trigger Google login popup
✅ logout()                         → Sign out user
✅ isUserLoggedIn()               → Get current user or null
✅ checkAuthState()                → Check if user is logged in on page load
✅ updateUIForLoggedInUser(user)  → Update UI when user logs in
✅ updateUIForLoggedOutUser()     → Update UI when user logs out
*/

// ===================================================
// 8. LOCAL STORAGE KEYS
// ===================================================

/*
localStorage.getItem('user')       → User object (JSON)
localStorage.getItem('authToken')  → Firebase auth token

Example usage:
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('authToken');
*/

// ===================================================
// 9. FIREBASE AUTH EVENTS
// ===================================================

// Listen for auth state changes
if (typeof auth !== 'undefined') {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      console.log('✅ User signed in:', user.email);
    } else {
      console.log('❌ User signed out');
    }
  });
}

// ===================================================
// THAT'S IT! Your Google login is fully integrated.
// ===================================================
