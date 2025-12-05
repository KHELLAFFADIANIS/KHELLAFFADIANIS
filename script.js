
document.addEventListener('DOMContentLoaded', ()=>{

  /* ----------- Particles (with star-like sparkle) ----------- */
  if(window.particlesJS){
    particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable:true, value_area: 800 } },
        color: { value: ["#7c3aed","#0f4bd6","#61dafb","#ffffff"] },
        shape: { type: "circle" },
        opacity: { value: 0.6, random: true },
        size: { value: 2, random: true },
        line_linked: { enable: false }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" }
        }
      },
      retina_detect: true
    });
  }

  /* ----------- Floating icons initial positions (random) ----------- */
  (function placeFloatingIcons(){
    const container = document.getElementById('floating-icons');
    if(!container) return;
    const icons = Array.from(container.children);
    const w = window.innerWidth, h = window.innerHeight;
    icons.forEach((el, idx)=>{
      // randomized positions with some safe margins
      const left = Math.random() * (w - 120);
      const top = Math.random() * (h - 120);
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      // slight random rotation and speed delay
      const rot = (Math.random()*40)-20;
      el.style.transform = `rotate(${rot}deg)`;
      // different animation offsets
      el.style.animationDelay = `${Math.random()*3}s`;
      // set z-index to vary depth
      el.style.zIndex = `${2 + Math.floor(Math.random()*6)}`;
    });
    // re-place on resize
    window.addEventListener('resize', ()=> {
      icons.forEach((el)=>{
        const left = Math.random() * (window.innerWidth - 120);
        const top = Math.random() * (window.innerHeight - 120);
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      });
    });
  })();

  /* ----------- GSAP merged timeline (hero + avatar) ----------- */
  const tl = gsap.timeline();
  tl.from('.topbar', { y:-30, opacity:0, duration:0.6, ease:'power3.out' })
    .from('.hero-inner .hero-content .kicker', { y:10, opacity:0, duration:0.45 }, '-=0.4')
    .from('.headline', { opacity:0, y:30, duration:0.9, ease:'power4.out', stagger:0.05 }, '-=0.2')
    .from('.accent', { opacity:0, filter:'blur(8px)', duration:1.0 }, '-=0.8')
    .from('.lead', { y:8, opacity:0, duration:0.5 }, '-=0.6')
    .from('.avatar-card', { scale:0.88, opacity:0, duration:0.9, ease:'elastic.out(1,0.6)' }, '-=0.6')
    .from('.skill-bubbles span', { y:12, opacity:0, stagger:0.06, duration:0.45 }, '-=0.6');

  /* ----------- Avatar 3D tilt (strong) ----------- */
  const avatar = document.querySelector('.avatar-card');
  if(avatar){
    avatar.addEventListener('mousemove', (e)=>{
      const r = avatar.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rY = (px - 0.5) * 18; // rotateY
      const rX = (py - 0.5) * -18; // rotateX
      avatar.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.01)`;
      // give inner image a slight parallax
      const img = avatar.querySelector('.avatar-wrap img');
      if(img) img.style.transform = `translateZ(10px) rotateY(${rY/6}deg) rotateX(${rX/6}deg) scale(1.02)`;
    });
    avatar.addEventListener('mouseleave', ()=>{
      avatar.style.transform = 'none';
      const img = avatar.querySelector('.avatar-wrap img');
      if(img) img.style.transform = 'none';
    });
  }

  /* ----------- Scroll reveal (IntersectionObserver) ----------- */
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('reveal');
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.card, .project, .skill, .avatar-card').forEach(el=>obs.observe(el));

  /* ----------- Contact form handler (backend-ready) ----------- */
  (function contactHandler(){
    const CONTACT_API_URL = window.__CONTACT_API_URL__ || '';
    const form = document.getElementById('contactForm');
    if(!form) return;
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const original = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = 'Sending...';
      const data = { name: form.name.value, email: form.email.value, message: form.message.value };

      if(CONTACT_API_URL){
        try {
          const res = await fetch(CONTACT_API_URL.replace(/\/$/,'') + '/api/contact', {
            method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
          });
          if(res.ok){
            btn.innerHTML = 'Sent ✓'; form.reset();
            setTimeout(()=>{ btn.innerHTML = original; btn.disabled = false; }, 1600);
          } else {
            const text = await res.text().catch(()=>res.statusText); alert('Server: '+text);
            btn.innerHTML = original; btn.disabled = false;
          }
        } catch(err){
          alert('Network error — fallback to mail client.');
          window.location.href = `mailto:${data.email}?subject=${encodeURIComponent('Contact from '+data.name)}&body=${encodeURIComponent(data.message)}`;
          btn.innerHTML = original; btn.disabled = false;
        }
      } else {
        window.location.href = `mailto:${data.email}?subject=${encodeURIComponent('Contact from '+data.name)}&body=${encodeURIComponent(data.message)}`;
        btn.innerHTML = original; btn.disabled = false;
      }
    });
  })();

}); // DOMContentLoaded end
