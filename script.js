
document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------
  // 1.1 — Particles.js
  // -------------------------------
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60 },
        size: { value: 3 },
        color: { value: ["#7c3aed", "#0f4bd6", "#61dafb"] },
        line_linked: { enable: true, distance: 120, opacity: 0.06 }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      }
    });
  }

  // -------------------------------
  // 1.2 — GSAP Main Intro Timeline
  // -------------------------------
  const tl = gsap.timeline();

  tl.from('.topbar', { y: -30, opacity: 0, duration: 0.6, ease: 'power3.out' });
  tl.from('.hero-content .kicker', { y: 8, opacity: 0, duration: 0.4 }, '-=0.4');
  tl.from('.headline', { y: 12, opacity: 0, duration: 0.6, ease: 'power4.out' }, '-=0.3');
  tl.from('.lead', { y: 8, opacity: 0, duration: 0.5 }, '-=0.35');
  tl.from('.avatar-wrap', { scale: 0.86, opacity: 0, duration: 0.7, ease: 'elastic.out(1,0.6)' }, '-=0.45');
  tl.from('.skill-bubbles span', { y: 10, opacity: 0, stagger: 0.05, duration: 0.45 }, '-=0.5');

  // -------------------------------
  // 1.3 — Subtle Hover Parallax
  // -------------------------------
  const avatar = document.querySelector('.avatar-card');
  if (avatar) {
    avatar.addEventListener('mousemove', (e) => {
      const rX = (e.offsetY - avatar.offsetHeight / 2) / 18;
      const rY = (e.offsetX - avatar.offsetWidth / 2) / -18;
      avatar.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(6px)`;
    });
    avatar.addEventListener('mouseleave', () => { avatar.style.transform = 'none'; });
  }

  // -------------------------------
  // 1.4 — Scroll Reveal (No GSAP ScrollTrigger)
  // -------------------------------
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('reveal');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .project, .skill').forEach(el => obs.observe(el));

});

// ===============================
// 2) Backend Contact Form Handler
// ===============================
(function () {
  const CONTACT_API_URL = window.__CONTACT_API_URL__ || '';
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type=submit]');
    const original = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = 'Sending...';

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };

    // Backend Active
    if (CONTACT_API_URL) {
      try {
        const res = await fetch(CONTACT_API_URL.replace(/\/$/, '') + '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          btn.innerHTML = 'Sent ✓';
          form.reset();
          setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
          }, 1800);
        } else {
          alert('Server error: ' + (await res.text()));
          btn.innerHTML = original;
          btn.disabled = false;
        }

      } catch (err) {
        alert('Network/API Error — using mail fallback.');
        window.location.href =
          `mailto:${data.email}?subject=Contact from ${data.name}&body=${encodeURIComponent(data.message)}`;
        btn.innerHTML = original;
        btn.disabled = false;
      }

    } else {
      // No Backend → mailto
      window.location.href =
        `mailto:${data.email}?subject=Contact from ${data.name}&body=${encodeURIComponent(data.message)}`;
      btn.innerHTML = original;
      btn.disabled = false;
    }
  });
})();
