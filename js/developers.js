// ===== AQARX – Developers Page JS =====

// CONSULTATION FORM SUBMIT
function submitDevForm() {
  const btn = document.getElementById('devFormBtn');
  btn.innerHTML = '<i class="fas fa-check"></i> Request Received!';
  btn.style.background = '#22cc66';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Request Consultation';
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
}

// SMOOTH SCROLL for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
