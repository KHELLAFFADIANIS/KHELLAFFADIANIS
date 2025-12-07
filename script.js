
// script.js v3 — Glassmorphism 2.0 enhancements
document.addEventListener('DOMContentLoaded', ()=>{
  // Loader hide after load
  const loader = document.getElementById('loader');
  window.setTimeout(()=>{ if(loader){ loader.classList.add('hidden'); } }, 700);

  // Initialize particles.js (soft, subtle)
  if(window.particlesJS){
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 28, "density": { "enable": true, "value_area": 800 } },
        "size": { "value": 3 },
        "color": { "value": ["#7c3aed","#0f4bd6"] },
        "line_linked": { "enable": true, "distance": 140, "opacity": 0.06, "color":"#7c3aed" },
        "move": { "speed": 1.2, "straight": false, "out_mode":"out" },
        "opacity": { "value": 0.65 }
      },
      "interactivity": {
        "events": {
          "onhover": { "enable": true, "mode": "repulse" },
          "onclick": { "enable": false, "mode": "push" }
        }
      }
    });
  }

  // GSAP timeline for intro
  try {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();
    tl.from('.topbar', {y:-24, opacity:0, duration:0.6, ease:'power3.out'});
    tl.from('.kicker', {y:8, opacity:0, duration:0.4}, '-=0.4');
    tl.from('.headline', {y:18, opacity:0, duration:0.7, ease:'power4.out'}, '-=0.25');
    tl.from('.lead', {y:8, opacity:0, duration:0.5}, '-=0.35');
    tl.from('.avatar-wrap', {scale:0.86, opacity:0, duration:0.9, ease:'elastic.out(1,0.6)'}, '-=0.45');
    tl.from('.skill-bubbles span', {y:10, opacity:0, stagger:0.05, duration:0.45}, '-=0.5');

    // Scroll reveals
    gsap.utils.toArray('.card, .project, .skill, .avatar-card').forEach(el=>{
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        y: 24, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
    });
  } catch(e){
    // Fallback: IntersectionObserver reveal
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('reveal'); }
      });
    }, {threshold:0.12});
    document.querySelectorAll('.card, .project, .skill, .avatar-card').forEach(el=>obs.observe(el));
  }

  // Avatar hover parallax subtle
  const avatar = document.querySelector('.avatar-card');
  if(avatar){
    avatar.addEventListener('mousemove', (e)=>{
      const rect = avatar.getBoundingClientRect();
      const rX = (e.clientY - rect.top - rect.height/2) / 24;
      const rY = (e.clientX - rect.left - rect.width/2) / -24;
      avatar.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(6px)`;
    });
    avatar.addEventListener('mouseleave', ()=>{ avatar.style.transform = 'none'; });
  }

  // Project card subtle tilt on mousemove
  document.querySelectorAll('.project').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / (r.width/2);
      const y = (e.clientY - r.top - r.height/2) / (r.height/2);
      card.style.transform = `rotateX(${y*4}deg) rotateY(${x*6}deg) translateZ(0) scale(1.01)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
  });

  // Contact form improved behavior (client-side demo)
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      if(!btn) return;
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      setTimeout(()=>{
        btn.innerHTML = 'Sent ✓';
        btn.classList.remove('primary');
        setTimeout(()=>{ btn.innerHTML = original; btn.disabled = false; btn.classList.add('primary'); }, 1700);
      }, 1000);
    });
  }
});

// Floating icons animation
document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".f-icon");
    icons.forEach((icon) => {
        const floatY = 20 + Math.random() * 30;
        const floatX = 10 + Math.random() * 20;
        const rotate = (Math.random() - 0.5) * 20;
        gsap.to(icon, {
            y: `+=${floatY}`,
            x: `+=${floatX}`,
            rotation: rotate,
            duration: 6 + Math.random() * 4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    });
});
