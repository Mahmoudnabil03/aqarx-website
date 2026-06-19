// ===================================================
// AQARX – Main JS (Final Day 8 Version)
// Runs on every page
// ===================================================

// ===================================================
// NAVBAR — LOGIN STATE
// ===================================================
function updateNavbar() {
  const user    = localStorage.getItem('aqarx_user');
  const navAuth = document.getElementById('navAuth');
  if (!navAuth) return;

  if (user) {
    navAuth.innerHTML = `
      <div class="nav-user-menu">
        <button class="nav-user-btn" onclick="toggleUserMenu()">
          <i class="fas fa-user-circle"></i>
          <span>${user}</span>
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
  } else {
    navAuth.innerHTML = `
      <a href="login.html" class="btn-outline">Login</a>
      <a href="register.html" class="btn-solid">Register</a>
    `;
  }
}

function toggleUserMenu() {
  document.getElementById('userDropdown')?.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-user-menu')) {
    document.getElementById('userDropdown')?.classList.remove('open');
  }
});

function logout() {
  localStorage.removeItem('aqarx_user');
  localStorage.removeItem('aqarx_email');
  localStorage.removeItem('aqarx_type');
  window.location.href = 'index.html';
}

// ===================================================
// NAVBAR SCROLL EFFECT
// ===================================================
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  navbar.style.background = window.scrollY > 50
    ? 'rgba(10,10,10,1)'
    : 'rgba(10,10,10,0.97)';
});

// ===================================================
// HAMBURGER MENU
// ===================================================
function setupHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    hamburger.querySelector('i').className =
      navLinks.classList.contains('mobile-open')
        ? 'fas fa-times'
        : 'fas fa-bars';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.querySelector('i').className = 'fas fa-bars';
    });
  });
}

// ===================================================
// SEARCH TABS
// ===================================================
function setupSearchTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// ===================================================
// ACTIVE NAV LINK
// ===================================================
function setActiveNavLink() {
  const path  = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && path.endsWith(href)) link.classList.add('active');
  });
}

// ===================================================
// SMOOTH SCROLL
// ===================================================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===================================================
// BACK TO TOP
// ===================================================
function setupBackToTop() {
  const btn = document.createElement('button');
  btn.id        = 'backToTop';
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.title     = 'Back to top';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===================================================
// PROPERTIES PAGE — show/hide upload banner
// ===================================================
function updatePropertiesBanner() {
  const user        = localStorage.getItem('aqarx_user');
  const bannerGuest = document.getElementById('bannerGuest');
  const bannerUser  = document.getElementById('bannerUser');
  const userNameEl  = document.getElementById('userName');

  if (!bannerGuest || !bannerUser) return;

  if (user) {
    bannerGuest.style.display = 'none';
    bannerUser.style.display  = 'flex';
    if (userNameEl) userNameEl.textContent = user;
  } else {
    bannerGuest.style.display = 'flex';
    bannerUser.style.display  = 'none';
  }
}

// ===================================================
// INIT
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  setupHamburger();
  setupSearchTabs();
  setActiveNavLink();
  setupSmoothScroll();
  setupBackToTop();
  updatePropertiesBanner();
});