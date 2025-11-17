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
    });
})();