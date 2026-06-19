// ===== AQARX – Contact Page JS =====

// SET SUBJECT from inquiry type shortcuts
function setSubject(subject) {
  const subjectInput = document.getElementById('subject');
  const helpType     = document.getElementById('helpType');
  if (subjectInput) subjectInput.value = subject;
  if (helpType) {
    for (let opt of helpType.options) {
      if (opt.text === subject) { opt.selected = true; break; }
    }
  }
  // Scroll to form
  document.querySelector('.contact-form-wrap')?.scrollIntoView({ behavior: 'smooth' });
}

// SEND MESSAGE
function sendMessage() {
  const firstName = document.getElementById('firstName')?.value.trim();
  const email     = document.getElementById('email')?.value.trim();
  const message   = document.getElementById('message')?.value.trim();
  const agree     = document.getElementById('agreeCheck')?.checked;

  // Basic validation
  if (!firstName || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  if (!agree) {
    alert('Please agree to the Privacy Policy and Terms of Use.');
    return;
  }

  const btn = document.getElementById('sendBtn');
  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Simulate sending
  setTimeout(() => {
    btn.style.display = 'none';
    document.getElementById('sendSuccess').style.display = 'block';
  }, 1500);
}

// FAQ ACCORDION
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  // Open clicked if it was closed
  if (!isOpen) item.classList.add('open');
}
