// Home page client-side behavior
(function () {
    function initBestCards() {
        document.querySelectorAll('.best-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('button')) return;
                const slug = card.getAttribute('data-card-slug');
                if (slug) window.location.href = `card.html?card=${encodeURIComponent(slug)}`;
            });
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const slug = card.getAttribute('data-card-slug');
                    if (slug) window.location.href = `card.html?card=${encodeURIComponent(slug)}`;
                }
            });
        });
    }

    function initTierButtons() {
        function openTier(tier) {
            const triggerChoose = () => {
                const overlay = document.getElementById('subscribe-overlay');
                const btn = overlay && overlay.querySelector(tier === 'free' ? '#chooseFreeTier' : '#chooseOptimalTier');
                if (btn) btn.click();
            };
            const overlay = document.getElementById('subscribe-overlay');
            if (overlay && typeof overlay.__open === 'function') {
                overlay.__open();
                setTimeout(triggerChoose, 0);
            } else {
                const navBtn = document.querySelector('.subscribe-btn');
                if (navBtn) {
                    navBtn.click();
                    setTimeout(triggerChoose, 50);
                }
            }
        }

        document.querySelectorAll('.choose-free-tier').forEach(el => {
            el.addEventListener('click', (e) => { e.preventDefault(); openTier('free'); });
        });
        document.querySelectorAll('.choose-optimal-tier').forEach(el => {
            el.addEventListener('click', (e) => { e.preventDefault(); openTier('optimal'); });
        });
    }

    function initHeroCardNav() {
        const nav = document.querySelector('.hero-card-nav');
        if (!nav) {
            console.log('Hero card nav not found');
            return;
        }

        const track = nav.querySelector('.hero-card-nav-track');
        const viewport = nav.querySelector('.hero-card-nav-viewport');
        const prevBtn = nav.querySelector('.hero-card-nav-btn--prev');
        const nextBtn = nav.querySelector('.hero-card-nav-btn--next');
        const cardItems = Array.from(track ? track.querySelectorAll('.hero-card-item') : []);

        if (!track || !viewport || !prevBtn || !nextBtn || cardItems.length === 0) {
            console.log('Hero card nav missing elements', { track, viewport, prevBtn, nextBtn, cardsCount: cardItems.length });
            return;
        }

        console.log('Hero card nav initialized with', cardItems.length, 'cards');

        let currentIndex = 0;

        function getStep() {
            const first = cardItems[0];
            return first ? first.offsetWidth : 0;
        }

        function maxIndex() {
            return Math.max(cardItems.length - 1, 0);
        }

        function clampIndex() {
            const max = maxIndex();
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > max) currentIndex = max;
        }

        function updatePosition() {
            clampIndex();
            const step = getStep();
            const offset = -currentIndex * step;
            console.log('Updating position:', { currentIndex, step, offset });
            track.style.transform = `translateX(${offset}px)`;
        }

        function updateButtons() {
            const max = maxIndex();
            prevBtn.disabled = currentIndex <= 0;
            nextBtn.disabled = currentIndex >= max;
            prevBtn.classList.toggle('is-disabled', prevBtn.disabled);
            nextBtn.classList.toggle('is-disabled', nextBtn.disabled);
        }

        function go(delta) {
            console.log('Go called with delta:', delta);
            currentIndex += delta;
            updatePosition();
            updateButtons();
        }

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Prev button clicked');
            go(-1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            go(1);
        });

        window.addEventListener('resize', () => {
            updatePosition();
            updateButtons();
        });

        // initial
        updatePosition();
        updateButtons();
    }

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(() => {
        initBestCards();
        initTierButtons();
        initHeroCardNav();
    });
})();