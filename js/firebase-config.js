// ===================================================
// FIREBASE CONFIGURATION
// Get your credentials from: https://console.firebase.google.com
// ===================================================

const firebaseConfig = {
  apiKey:            "AIzaSyDvzpg8YrdwuLUHYsZnr_SDCWKbq8n3zDY",
  authDomain:        "gen-lang-client-0802654985.firebaseapp.com",
  projectId:         "gen-lang-client-0802654985",
  storageBucket:     "gen-lang-client-0802654985.firebasestorage.app",
  messagingSenderId: "1071758547354",
  appId:             "1:1071758547354:web:c6bdbab98d689247f20223"
};

// Initialize Firebase
let auth;
let googleProvider;

// Wait for Firebase to load, then initialize
document.addEventListener('DOMContentLoaded', function() {
  if (typeof firebase !== 'undefined') {
    // Initialize Firebase app
    firebase.initializeApp(firebaseConfig);
    
    // Get auth instance
    auth = firebase.auth();
    
    // Set up Google provider
    googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.setCustomParameters({ 'prompt': 'select_account' });
    
    console.log('✅ Firebase initialized successfully');
  } else {
    console.error('❌ Firebase SDK not loaded');
  }
});

// ===================================================
// GOOGLE LOGIN
// ===================================================
async function loginWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    
    // Successfully logged in
    handleGoogleLoginSuccess(user);
  } catch (error) {
    console.error('Google login error:', error);
    handleGoogleLoginError(error);
  }
}

// ===================================================
// HANDLE SUCCESSFUL GOOGLE LOGIN
// ===================================================
function handleGoogleLoginSuccess(user) {
  const userData = {
    uid:        user.uid,
    email:      user.email,
    displayName: user.displayName,
    photoURL:   user.photoURL,
    loginMethod: 'google'
  };
  
  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('authToken', user.accessToken);
  
  console.log('✅ Logged in as:', user.email);
  
  // Redirect to dashboard or properties page
  window.location.href = 'properties.html';
}

// ===================================================
// HANDLE GOOGLE LOGIN ERROR
// ===================================================
function handleGoogleLoginError(error) {
  let errorMsg = 'Google login failed. Please try again.';
  
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      errorMsg = 'Login popup was closed.';
      break;
    case 'auth/popup-blocked':
      errorMsg = 'Popup was blocked. Please allow popups for this site.';
      break;
    case 'auth/account-exists-with-different-credential':
      errorMsg = 'An account already exists with this email.';
      break;
    case 'auth/invalid-credential':
      errorMsg = 'Invalid credentials. Please try again.';
      break;
  }
  
  showAuthError('loginError', 'loginErrorMsg', errorMsg);
}

// ===================================================
// CHECK AUTH STATE (on page load)
// ===================================================
function checkAuthState() {
  if (auth) {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is logged in
        console.log('User logged in:', user.email);
        updateUIForLoggedInUser(user);
      } else {
        // User is not logged in
        console.log('User logged out');
        updateUIForLoggedOutUser();
      }
    });
  }
}

// ===================================================
// UPDATE UI FOR LOGGED IN USER
// ===================================================
function updateUIForLoggedInUser(user) {
  const userData = {
    uid:        user.uid,
    email:      user.email,
    displayName: user.displayName,
    photoURL:   user.photoURL,
    loginMethod: 'google'
  };
  
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Hide login/register buttons, show profile menu
  const navAuth = document.getElementById('navAuth');
  if (navAuth) {
    navAuth.innerHTML = `
      <div class="user-profile-dropdown">
        <button class="user-profile-btn">
          <img src="${user.photoURL || 'https://via.placeholder.com/40'}" alt="Profile" class="profile-pic"/>
          ${user.displayName || user.email.split('@')[0]}
          <i class="fas fa-chevron-down" style="font-size:10px"></i>
        </button>
        <div class="user-dropdown" id="userDropdown">
          <a href="properties.html"><i class="fas fa-home"></i> My Listings</a>
          <a href="properties.html"><i class="fas fa-heart"></i> Saved Properties</a>
          <div class="dropdown-divider"></div>
          <button onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      </div>
    `;
  }
}

// ===================================================
// UPDATE UI FOR LOGGED OUT USER
// ===================================================
function updateUIForLoggedOutUser() {
  const navAuth = document.getElementById('navAuth');
  if (navAuth) {
    navAuth.innerHTML = `
      <a href="login.html" class="btn-outline">Login</a>
      <a href="register.html" class="btn-solid">Register</a>
    `;
  }
}

// ===================================================
// LOGOUT
// ===================================================
function logout() {
  if (auth) {
    auth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      console.log('Logged out');
      window.location.href = 'index.html';
    }).catch(error => {
      console.error('Logout error:', error);
    });
  }
}

// ===================================================
// CHECK IF USER IS LOGGED IN
// ===================================================
function isUserLoggedIn() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAuthState);
} else {
  checkAuthState();
}
