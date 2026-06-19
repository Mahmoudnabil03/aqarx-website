// ===== AQARX – Auth JS (login + register) =====

// ===================================================
// SHARED HELPERS
// ===================================================

// Toggle password visibility
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon  = btn.querySelector('i');
  if (input.type === 'password') {
    input.type   = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type   = 'password';
    icon.className = 'fas fa-eye';
  }
}

// Social login handler
function socialLogin(provider) {
  if (provider === 'Google') {
    loginWithGoogle();
  } else if (provider === 'Facebook') {
    loginWithFacebook();
  } else {
    alert(`${provider} login coming soon!`);
  }
}

// ===================================================
// LOGIN WITH EMAIL & PASSWORD (Firebase)
// ===================================================
function handleLogin() {
  const email    = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value;
  const errorDiv = document.getElementById('loginError');
  const errorMsg = document.getElementById('loginErrorMsg');
  const success  = document.getElementById('loginSuccess');
  const btn      = document.getElementById('loginBtn');

  // Hide previous messages
  if (errorDiv) errorDiv.style.display = 'none';
  if (success)  success.style.display  = 'none';

  // Validate
  if (!email || !password) {
    showAuthError('loginError', 'loginErrorMsg', 'Please enter your email and password.');
    return;
  }

  if (!isValidEmail(email)) {
    showAuthError('loginError', 'loginErrorMsg', 'Please enter a valid email address.');
    return;
  }

  if (password.length < 6) {
    showAuthError('loginError', 'loginErrorMsg', 'Password must be at least 6 characters.');
    return;
  }

  // Show loading
  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

  // Firebase email/password login
  if (typeof auth !== 'undefined') {
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        handleFirebaseLoginSuccess(user, 'email');
        
        // Show success
        btn.style.display    = 'none';
        if (success) success.style.display = 'flex';
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          window.location.href = 'properties.html';
        }, 1500);
      })
      .catch(error => {
        btn.disabled  = false;
        btn.innerHTML = 'Login';
        
        let errorText = 'Login failed. Please try again.';
        if (error.code === 'auth/user-not-found') {
          errorText = 'No account found with this email. Please register first.';
        } else if (error.code === 'auth/wrong-password') {
          errorText = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/invalid-email') {
          errorText = 'Invalid email address.';
        } else if (error.code === 'auth/too-many-requests') {
          errorText = 'Too many failed attempts. Please try again later.';
        }
        
        showAuthError('loginError', 'loginErrorMsg', errorText);
        console.error('Login error:', error);
      });
  } else {
    btn.disabled  = false;
    btn.innerHTML = 'Login';
    showAuthError('loginError', 'loginErrorMsg', '❌ Firebase not initialized. Please refresh the page.');
  }
}

// ===================================================
// REGISTER
// ===================================================

let selectedAccountType = 'buyer';

function selectType(btn, type) {
  selectedAccountType = type;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show company field for developer/decorator
  const companyGroup = document.getElementById('companyGroup');
  if (companyGroup) {
    companyGroup.style.display = (type === 'developer' || type === 'decorator') ? 'block' : 'none';
  }
}

// ===================================================
// REGISTER WITH EMAIL & PASSWORD (Firebase)
// ===================================================
function handleRegister() {
  const firstName = document.getElementById('regFirstName')?.value.trim();
  const lastName  = document.getElementById('regLastName')?.value.trim();
  const email     = document.getElementById('regEmail')?.value.trim();
  const phone     = document.getElementById('regPhone')?.value.trim();
  const password  = document.getElementById('regPassword')?.value;
  const confirm   = document.getElementById('regConfirm')?.value;
  const agree     = document.getElementById('agreeTerms')?.checked;
  const btn       = document.getElementById('registerBtn');
  const success   = document.getElementById('regSuccess');

  // Hide previous errors
  document.getElementById('regError').style.display = 'none';

  // Validate
  if (!firstName || !lastName) {
    showAuthError('regError', 'regErrorMsg', 'Please enter your first and last name.');
    return;
  }

  if (!email || !isValidEmail(email)) {
    showAuthError('regError', 'regErrorMsg', 'Please enter a valid email address.');
    return;
  }

  if (!phone) {
    showAuthError('regError', 'regErrorMsg', 'Please enter your phone number.');
    return;
  }

  if (!password || password.length < 8) {
    showAuthError('regError', 'regErrorMsg', 'Password must be at least 8 characters.');
    return;
  }

  if (password !== confirm) {
    showAuthError('regError', 'regErrorMsg', 'Passwords do not match.');
    return;
  }

  if (!agree) {
    showAuthError('regError', 'regErrorMsg', 'Please agree to the Terms of Use and Privacy Policy.');
    return;
  }

  // Show loading
  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

  // Firebase user creation
  if (typeof auth !== 'undefined') {
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        
        // Update profile with name
        user.updateProfile({
          displayName: `${firstName} ${lastName}`
        }).then(() => {
          // Save additional data
          const userData = {
            uid:         user.uid,
            email:       user.email,
            displayName: `${firstName} ${lastName}`,
            phone:       phone,
            accountType: selectedAccountType,
            photoURL:    user.photoURL || 'https://via.placeholder.com/40',
            loginMethod: 'email'
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('authToken', user.accessToken);
          localStorage.setItem('aqarx_user', firstName);
          localStorage.setItem('aqarx_email', email);
          localStorage.setItem('aqarx_type', selectedAccountType);
          
          // Show success
          btn.style.display   = 'none';
          success.style.display = 'flex';
          
          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = 'properties.html';
          }, 2000);
        });
      })
      .catch(error => {
        btn.disabled  = false;
        btn.innerHTML = 'Create Account';
        
        let errorText = 'Registration failed. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
          errorText = 'This email is already registered. Please login instead.';
        } else if (error.code === 'auth/weak-password') {
          errorText = 'Password is too weak. Use 8+ characters with letters, numbers, and symbols.';
        } else if (error.code === 'auth/invalid-email') {
          errorText = 'Invalid email address.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorText = 'Email/password registration is not enabled.';
        }
        
        showAuthError('regError', 'regErrorMsg', errorText);
        console.error('Registration error:', error);
      });
  } else {
    btn.disabled  = false;
    btn.innerHTML = 'Create Account';
    showAuthError('regError', 'regErrorMsg', '❌ Firebase not initialized. Please refresh the page.');
  }
}

// ===================================================
// PASSWORD STRENGTH CHECKER
// ===================================================
function checkPasswordStrength(password) {
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  if (!fill || !label) return;

  let score = 0;
  if (password.length >= 8)                    score++;
  if (/[A-Z]/.test(password))                  score++;
  if (/[0-9]/.test(password))                  score++;
  if (/[^A-Za-z0-9]/.test(password))           score++;
  if (password.length >= 12)                   score++;

  const levels = [
    { pct: '0%',   color: '#333',     text: 'Enter a password' },
    { pct: '25%',  color: '#cc0000',  text: 'Weak' },
    { pct: '50%',  color: '#ff6600',  text: 'Fair' },
    { pct: '75%',  color: '#ffaa00',  text: 'Good' },
    { pct: '100%', color: '#22cc66',  text: 'Strong ✓' },
  ];

  const level = levels[Math.min(score, 4)];
  fill.style.width      = level.pct;
  fill.style.background = level.color;
  label.style.color     = level.color;
  label.textContent     = level.text;
}

// ===================================================
// HELPERS
// ===================================================
function showAuthError(divId, msgId, message) {
  const div = document.getElementById(divId);
  const msg = document.getElementById(msgId);
  if (msg) msg.textContent = message;
  if (div) div.style.display = 'flex';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===================================================
// HANDLE SUCCESSFUL FIREBASE LOGIN
// ===================================================
function handleFirebaseLoginSuccess(user, method) {
  const userData = {
    uid:         user.uid,
    email:       user.email,
    displayName: user.displayName || user.email.split('@')[0],
    photoURL:    user.photoURL || 'https://via.placeholder.com/40',
    loginMethod: method
  };
  
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('authToken', user.accessToken);
  localStorage.setItem('aqarx_user', user.displayName || user.email.split('@')[0]);
  localStorage.setItem('aqarx_email', user.email);
  
  console.log('✅ User logged in:', user.email);
}

// ===================================================
// LOGIN WITH FACEBOOK (Firebase OAuth)
// ===================================================
function loginWithFacebook() {
  if (typeof auth === 'undefined') {
    alert('❌ Firebase not initialized. Please refresh the page.');
    return;
  }
  
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  facebookProvider.setCustomParameters({ 'display': 'popup' });
  
  auth.signInWithPopup(facebookProvider)
    .then(result => {
      const user = result.user;
      handleFirebaseLoginSuccess(user, 'facebook');
      window.location.href = 'properties.html';
    })
    .catch(error => {
      console.error('Facebook login error:', error);

      let errorMsg = 'Facebook login failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Login popup was closed.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMsg = 'Popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMsg = 'An account already exists with this email.';
      }

      // Use whichever error div is present (login vs register page)
      const errorDivId = document.getElementById('loginError') ? 'loginError' : 'regError';
      const errorMsgId = document.getElementById('loginErrorMsg') ? 'loginErrorMsg' : 'regErrorMsg';
      showAuthError(errorDivId, errorMsgId, errorMsg);
    });
}

// ===================================================
// AUTO-LOGIN CHECK
// If user is already logged in, redirect to properties page
// ===================================================
const currentPage = window.location.pathname;
const loggedIn    = localStorage.getItem('user');

if (loggedIn && (currentPage.includes('login') || currentPage.includes('register'))) {
  // Already logged in — redirect to properties page
  // Uncomment the line below to enforce this
  // window.location.href = 'properties.html';
}
