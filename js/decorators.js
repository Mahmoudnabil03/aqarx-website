// ===== AQARX – Decorators Page JS =====

// FILTER TABS
function filterTab(btn, category) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // In future — filter cards by category
  console.log('Filtering by:', category);
}

// CONTACT MODAL
function openContactModal(companyName) {
  document.getElementById('modalCompanyName').textContent = companyName;
  document.getElementById('contactModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeContactModal() {
  document.getElementById('contactModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal when clicking outside
document.getElementById('contactModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'contactModal') closeContactModal();
});

// SUBMIT CONTACT
function submitContact() {
  const btn = document.getElementById('decSubmitBtn');
  btn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
  btn.style.background = '#22cc66';
  setTimeout(() => {
    closeContactModal();
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Request';
    btn.style.background = '';
  }, 2000);
}
