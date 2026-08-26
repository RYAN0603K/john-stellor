// Frater Thanatos - Main JS

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// --- 1. Particles Background ---
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let w, h;

function initParticles() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = [];
    
    // Create particles
    const numParticles = Math.floor((w * h) / 15000); // adjust density
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5,
            dx: (Math.random() - 0.5) * 0.2, // very slow
            dy: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    
    particles.forEach(p => {
        // Move
        p.x += p.dx;
        p.y += p.dy;
        
        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        
        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
    });
    
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();


// --- 2. GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero Entrance Animation
const tl = gsap.timeline();

// Initial state (black screen)
// 2. Subtle atmospheric particles appear (handled by canvas)
// 3. Logo slowly emerges
tl.to('.hero-content', {
    opacity: 1,
    duration: 3,
    ease: "power2.inOut"
})
// 7. Typography fades in & stabilizes
.fromTo('.hero-content h1', 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 2, ease: "power3.out" },
    "-=1.5"
)
.fromTo('.hero-content p', 
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
    "-=1.5"
)
.fromTo('.hero-content a', 
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" },
    "-=1"
)
.to('.hero-scroll', {
    opacity: 1,
    duration: 1,
    ease: "power2.inOut"
}, "-=0.5");


// Scroll Animations for sections
// Reveal Text blocks
gsap.utils.toArray('.reveal-text').forEach(elem => {
    gsap.fromTo(elem,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

// Reveal Cards/Blocks
gsap.utils.toArray('.reveal-card').forEach((elem, i) => {
    gsap.fromTo(elem,
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

gsap.utils.toArray('.reveal-block').forEach(elem => {
    gsap.fromTo(elem,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

// Immersive Section Geometry Parallax
gsap.to('.geometry-anim', {
    yPercent: -30,
    ease: "none",
    scrollTrigger: {
        trigger: '#imersivo',
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 100) {
        nav.classList.remove('py-6');
        nav.classList.add('py-4', 'bg-black/80', 'backdrop-blur-md', 'mix-blend-normal', 'border-b', 'border-white/10');
    } else {
        nav.classList.add('py-6');
        nav.classList.remove('py-4', 'bg-black/80', 'backdrop-blur-md', 'mix-blend-normal', 'border-b', 'border-white/10');
    }
});

// --- Mobile Menu Logic ---
const openMenuBtn = document.getElementById('open-menu');
const closeMenuBtn = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (openMenuBtn && closeMenuBtn && mobileMenu) {
    openMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('translate-x-full');
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
        });
    });
}

// --- Fake 24h Countdown Timer ---
function initFakeTimer() {
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;

    // 24 hours in milliseconds
    // Horas quebradas para parecer super verídico (ex: 7 horas, 34 minutos e 15 segundos)
    const duration = (7 * 60 * 60 * 1000) + (34 * 60 * 1000) + (15 * 1000); 
    let endTime = localStorage.getItem('offerEndTimeV2');

    if (!endTime || Date.now() > endTime) {
        endTime = Date.now() + duration;
        localStorage.setItem('offerEndTimeV2', endTime);
    }

    function updateTimer() {
        let remaining = endTime - Date.now();
        if (remaining <= 0) {
            endTime = Date.now() + duration;
            localStorage.setItem('offerEndTimeV2', endTime);
            remaining = duration;
        }

        const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
        const m = Math.floor((remaining / 1000 / 60) % 60);
        const s = Math.floor((remaining / 1000) % 60);

        hoursEl.textContent = h.toString().padStart(2, '0');
        minutesEl.textContent = m.toString().padStart(2, '0');
        secondsEl.textContent = s.toString().padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}
document.addEventListener('DOMContentLoaded', initFakeTimer);
