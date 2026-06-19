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
    alert('Facebook login coming soon! Please use Google or email for now.');
  } else {
    alert(`${provider} login coming soon! Please use email for now.`);
  }
}

// ===================================================
// LOGIN
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

  // Simulate login — in future connects to real backend
  setTimeout(() => {
    // Save user to localStorage so properties page shows upload button
    const userName = email.split('@')[0];
    localStorage.setItem('aqarx_user', userName);
    localStorage.setItem('aqarx_email', email);

    // Show success
    btn.style.display    = 'none';
    if (success) success.style.display = 'flex';

    // Redirect to homepage after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }, 1200);
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

  // Simulate registration — in future connects to real backend
  setTimeout(() => {
    // Save user to localStorage
    localStorage.setItem('aqarx_user', firstName);
    localStorage.setItem('aqarx_email', email);
    localStorage.setItem('aqarx_type', selectedAccountType);

    // Show success
    btn.style.display   = 'none';
    success.style.display = 'flex';

    // Redirect to homepage after 2 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }, 1400);
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
// AUTO-LOGIN CHECK
// If user is already logged in, redirect to homepage
// ===================================================
const currentPage = window.location.pathname;
const loggedIn    = localStorage.getItem('aqarx_user');

if (loggedIn && (currentPage.includes('login') || currentPage.includes('register'))) {
  // Already logged in — redirect to homepage
  // Uncomment the line below when you're ready to enforce this
  // window.location.href = 'index.html';
}
