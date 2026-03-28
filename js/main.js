document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    const heroGlow = document.querySelector('.hero-bg-glow');
    const heroOrb = document.querySelector('.ai-orb');
    const heroCardOne = document.querySelector('.card-1');
    const heroCardTwo = document.querySelector('.card-2');
    const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.fade-in-up').forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
        observer.observe(el);
    });

    // Active section highlight
    if (sectionLinks.length) {
        const sections = sectionLinks
            .map((link) => {
                const target = document.querySelector(link.getAttribute('href'));
                return target ? { link, target } : null;
            })
            .filter(Boolean);

        let activeId = '';

        const setActiveLink = (id) => {
            if (!id || id === activeId) return;
            activeId = id;
            sections.forEach(({ link, target }) => {
                link.classList.toggle('is-active', target.id === id);
            });
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visibleEntries.length) {
                setActiveLink(visibleEntries[0].target.id);
            }
        }, {
            threshold: [0.2, 0.35, 0.55],
            rootMargin: '-18% 0px -55% 0px'
        });

        sections.forEach(({ target }) => sectionObserver.observe(target));
    }

    // Smooth scrolling for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });

    // Navbar state + hero parallax
    let ticking = false;

    const updateScrollEffects = () => {
        const scrollY = window.scrollY || window.pageYOffset;

        if (navbar) {
            navbar.classList.toggle('is-scrolled', scrollY > 18);
        }

        if (!prefersReducedMotion && hero) {
            const heroHeight = Math.max(hero.offsetHeight, 1);
            const progress = Math.min(scrollY / heroHeight, 1);

            if (heroGlow) {
                heroGlow.style.transform = `translate3d(-50%, ${progress * 26}px, 0) scale(${1 - progress * 0.06})`;
                heroGlow.style.opacity = `${0.95 - progress * 0.28}`;
            }

            if (heroOrb) {
                heroOrb.style.transform = `translate3d(0, ${progress * -18}px, 0)`;
            }

            if (heroCardOne) {
                heroCardOne.style.transform = `translate3d(0, ${progress * -10}px, 0)`;
            }

            if (heroCardTwo) {
                heroCardTwo.style.transform = `translate3d(0, ${progress * 12}px, 0)`;
            }
        }

        ticking = false;
    };

    const requestScrollUpdate = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateScrollEffects);
    };

    updateScrollEffects();
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate, { passive: true });

    // Hero cursor glow + orb parallax
    if (!prefersReducedMotion && hasFinePointer && hero) {
        let pointerX = 0.5;
        let pointerY = 0.45;
        let currentX = 0.5;
        let currentY = 0.45;
        let heroRafId = 0;

        const renderHeroPointer = () => {
            currentX += (pointerX - currentX) * 0.12;
            currentY += (pointerY - currentY) * 0.12;

            hero.style.setProperty('--hero-glow-x', `${currentX * 100}%`);
            hero.style.setProperty('--hero-glow-y', `${currentY * 100}%`);

            const offsetX = (currentX - 0.5) * 18;
            const offsetY = (currentY - 0.5) * 14;

            if (heroOrb) {
                heroOrb.style.transform = `translate3d(${offsetX * 0.35}px, ${offsetY * -0.55}px, 0)`;
            }

            heroRafId = window.requestAnimationFrame(renderHeroPointer);
        };

        hero.addEventListener('pointermove', (event) => {
            const rect = hero.getBoundingClientRect();
            pointerX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
            pointerY = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
            hero.classList.add('is-pointer-active');
        });

        hero.addEventListener('pointerleave', () => {
            pointerX = 0.5;
            pointerY = 0.45;
            hero.classList.remove('is-pointer-active');
        });

        heroRafId = window.requestAnimationFrame(renderHeroPointer);

        window.addEventListener('beforeunload', () => {
            if (heroRafId) {
                window.cancelAnimationFrame(heroRafId);
            }
        });
    }

    // Lightweight pointer depth for cards
    if (!prefersReducedMotion && hasFinePointer) {
        document.querySelectorAll('.glass-card').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateY = (x - 0.5) * 6;
                const rotateX = (0.5 - y) * 6;

                card.style.setProperty('--card-tilt-x', `${rotateX}deg`);
                card.style.setProperty('--card-tilt-y', `${rotateY}deg`);
                card.style.setProperty('--card-glow-x', `${x * 100}%`);
                card.style.setProperty('--card-glow-y', `${y * 100}%`);
            });

            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--card-tilt-x', '0deg');
                card.style.setProperty('--card-tilt-y', '0deg');
                card.style.setProperty('--card-glow-x', '50%');
                card.style.setProperty('--card-glow-y', '50%');
            });
        });
    }
});
