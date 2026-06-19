// ===== AQARX – Properties Page JS =====

// ------------------------------------------
// SIMULATE LOGIN STATE
// In the future this will connect to a real backend
// For now we use localStorage to remember if user is "logged in"
// ------------------------------------------

// TO TEST LOGGED IN: open browser console and type:
//   localStorage.setItem('aqarx_user', 'Mohamed')
//   then refresh the page
//
// TO TEST LOGGED OUT: open browser console and type:
//   localStorage.removeItem('aqarx_user')
//   then refresh the page

const loggedInUser = localStorage.getItem('aqarx_user');

const bannerGuest = document.getElementById('bannerGuest');
const bannerUser  = document.getElementById('bannerUser');
const userNameEl  = document.getElementById('userName');

if (loggedInUser) {
  // User is logged in — show the upload button
  bannerGuest.style.display = 'none';
  bannerUser.style.display  = 'flex';
  if (userNameEl) userNameEl.textContent = loggedInUser;
} else {
  // User is NOT logged in — show register prompt
  bannerGuest.style.display = 'flex';
  bannerUser.style.display  = 'none';
}

// ------------------------------------------
// UPLOAD MODAL
// ------------------------------------------
const openUploadBtn = document.getElementById('openUploadBtn');
const uploadModal   = document.getElementById('uploadModal');
const closeModal    = document.getElementById('closeModal');
const photoUpload   = document.getElementById('photoUpload');
const photoInput    = document.getElementById('photoInput');

if (openUploadBtn) {
  openUploadBtn.addEventListener('click', () => {
    uploadModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  });
}

if (closeModal) {
  closeModal.addEventListener('click', () => {
    uploadModal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close modal when clicking outside
if (uploadModal) {
  uploadModal.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
      uploadModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Photo upload click trigger
if (photoUpload && photoInput) {
  photoUpload.addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', () => {
    const files = photoInput.files;
    if (files.length > 0) {
      photoUpload.querySelector('p').textContent = `${files.length} photo(s) selected ✓`;
      photoUpload.style.borderColor = '#22cc66';
    }
  });
}

// Submit button feedback
const submitBtn = document.querySelector('.btn-submit');
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Listing Submitted!';
    submitBtn.style.background = '#22cc66';
    setTimeout(() => {
      uploadModal.classList.remove('active');
      document.body.style.overflow = '';
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Listing';
      submitBtn.style.background = '';
    }, 2000);
  });
}

// ------------------------------------------
// BED FILTER BUTTONS
// ------------------------------------------
const bedBtns = document.querySelectorAll('.bed-btn');
bedBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    bedBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ------------------------------------------
// GRID / LIST VIEW TOGGLE
// ------------------------------------------
const gridViewBtn     = document.getElementById('gridViewBtn');
const listViewBtn     = document.getElementById('listViewBtn');
const propertiesGrid  = document.getElementById('propertiesGrid');

if (gridViewBtn && listViewBtn) {
  gridViewBtn.addEventListener('click', () => {
    propertiesGrid.style.gridTemplateColumns = '';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
  });

  listViewBtn.addEventListener('click', () => {
    propertiesGrid.style.gridTemplateColumns = '1fr';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
  });
}