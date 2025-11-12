(function () {
    function ensureModal() {
        let overlay = document.getElementById('subscribe-overlay');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'subscribe-overlay';
        overlay.className = 'modal-overlay';
        overlay.hidden = true;
        overlay.innerHTML = [
            '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-title">',
            '  <button class="modal-close" aria-label="Close">×</button>',
            '  <h2 id="subscribe-title">Subscribe</h2>',
            '  <p class="modal-subtitle">Get updates on new cards, tools, and guides.</p>',
            '  <form class="modal-form" action="#" method="post" onsubmit="return false;">',
            '    <input type="email" id="subscribe-email" placeholder="Your email" aria-label="Email address" autocomplete="email" required>',
            '    <button type="submit" class="btn primary">Subscribe</button>',
            '    <small class="modal-note">Placeholder — email feature coming soon.</small>',
            '  </form>',
            '</div>'
        ].join('');
        document.body.appendChild(overlay);
        return overlay;
    }

    function init() {
        const overlay = ensureModal();
        const modal = overlay.querySelector('.modal');
        const closeBtn = overlay.querySelector('.modal-close');
        const emailInput = overlay.querySelector('#subscribe-email');

        const openModal = () => {
            // make it renderable first
            overlay.hidden = false;
            // next frame ensure transition runs
            requestAnimationFrame(() => {
                overlay.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                setTimeout(() => emailInput && emailInput.focus(), 0);
            });
        };

        const closeModal = () => {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
            // after transition ends, hide for a11y and to remove from tab order
            const onEnd = (e) => {
                if (e.target !== overlay) return; // only once for overlay
                overlay.hidden = true;
                overlay.removeEventListener('transitionend', onEnd);
            };
            overlay.addEventListener('transitionend', onEnd);
            // Fallback in case transitionend doesn’t fire
            setTimeout(() => { if (!overlay.classList.contains('is-open')) overlay.hidden = true; }, 320);
        };

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.subscribe-btn');
            if (btn) { e.preventDefault(); openModal(); }
        });

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        modal.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeModal(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();