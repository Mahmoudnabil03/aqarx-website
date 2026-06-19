// ===== AQARX – Property Detail JS =====

// PHOTO GALLERY — click thumbnails to change main image
function setMain(thumb, icon, label) {
  // Update main image
  const mainImg = document.getElementById('mainImg');
  mainImg.innerHTML = `<i class="fas ${icon}"></i><span>${label}</span>`;

  // Update active thumb
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

// READ MORE TOGGLE
function toggleReadMore() {
  const wrap = document.getElementById('readMoreWrap');
  const btn  = document.getElementById('readMoreBtn');
  wrap.classList.toggle('open');
  if (wrap.classList.contains('open')) {
    btn.innerHTML = 'Read Less <i class="fas fa-chevron-up"></i>';
  } else {
    btn.innerHTML = 'Read More <i class="fas fa-chevron-down"></i>';
  }
}

// EMAIL FORM TOGGLE
function toggleEmailForm() {
  const form = document.getElementById('emailForm');
  form.style.display = form.style.display === 'none' ? 'flex' : 'none';
  form.style.flexDirection = 'column';
}

// SAVE PROPERTY TOGGLE
function toggleSave() {
  const btn  = document.getElementById('saveBtn');
  const icon = document.getElementById('heartIcon');
  btn.classList.toggle('saved');
  if (btn.classList.contains('saved')) {
    icon.className = 'fas fa-heart';
    btn.innerHTML = '<i class="fas fa-heart" id="heartIcon"></i> Saved!';
  } else {
    btn.innerHTML = '<i class="far fa-heart" id="heartIcon"></i> Save Property';
  }
}

// SHARE PROPERTY
function shareProperty() {
  if (navigator.share) {
    navigator.share({
      title: 'Modern Apartment – New Cairo | AQARX',
      text: 'Check out this property on AQARX!',
      url: window.location.href
    });
  } else {
    // Fallback — copy link to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  }
}

// MESSAGE SEND FEEDBACK
const msgBtn = document.querySelector('.btn-submit-msg');
if (msgBtn) {
  msgBtn.addEventListener('click', () => {
    msgBtn.textContent = 'Message Sent ✓';
    msgBtn.style.background = '#22cc66';
    setTimeout(() => {
      msgBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      msgBtn.style.background = '';
      document.getElementById('emailForm').style.display = 'none';
    }, 2000);
  });
}
