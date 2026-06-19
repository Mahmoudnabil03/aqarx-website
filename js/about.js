// ===== AQARX – About Page JS =====

// ANIMATED COUNTERS — numbers count up when scrolled into view
function animateCounters() {
  const numbers = document.querySelectorAll('.number');
  numbers.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString() + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  });
}

// Trigger counters when numbers section is visible
const numbersSection = document.querySelector('.numbers-section');
if (numbersSection) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(numbersSection);
}
