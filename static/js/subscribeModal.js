(function () {
    // Track module/state to avoid duplicate bindings and race conditions
    let initialized = false;
    let isOpen = false;
    let hideTimer = null;

    function ensureModal() {
        let overlay = document.getElementById('subscribe-overlay');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'subscribe-overlay';
        overlay.className = 'modal-overlay';
        overlay.hidden = true;
        overlay.innerHTML = [
            '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-title" style="max-height:90vh; min-height:560px; overflow:auto;">',
            '  <button class="modal-close" aria-label="Close">×</button>',
            '  <h2 id="subscribe-title">Subscribe</h2>',
            '  <p id="subscribe-subtitle" class="modal-subtitle">Get updates on new cards, tools, and guides.</p>',
            '  <div class="tier-cards" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:stretch; margin-bottom:16px;">',
            '    <div class="tier-card step" style="display:block; padding:16px; border:1px solid var(--border); border-radius:12px; background:var(--surface);">',
            '      <h3 style="margin-top:0;">Free</h3>',
            '      <ul class="tier-features" style="margin:8px 0 14px 18px; padding:0; list-style:disc;">',
            '        <li>General credit card news</li>',
            '        <li>Occasional Utah‑specific updates</li>',
            '      </ul>',
            '      <button type="button" id="chooseFreeTier" class="btn primary" style="font-size:0.95rem; padding:8px 12px;">Choose Free</button>',
            '    </div>',
            '    <div class="tier-card step" style="display:block; padding:16px; border:1px solid var(--border); border-radius:12px; background:var(--surface);">',
            '      <h3 style="margin-top:0;">Optimal</h3>',
            '      <ul class="tier-features" style="margin:8px 0 14px 18px; padding:0; list-style:disc;">',
            '        <li>Personalized notifications</li>',
            '        <li>$2/month</li>',
            '      </ul>',
            '      <button type="button" id="chooseOptimalTier" class="btn primary" style="font-size:0.95rem; padding:8px 12px;">Choose Optimal</button>',
            '    </div>',
            '  </div>',
            '  <div id="almostThereMessage" class="almost-there hidden" hidden style="display:none; margin:0 0 16px 0; padding:16px; border:1px solid var(--border); border-radius:12px; background:var(--background-alt);">',
            '    <h3 style="margin-top:0;">You\'re almost there!</h3>',
            '    <p style="margin:8px 0 14px;">To personalize your updates, we need your profile. Take the quiz first.</p>',
            '    <div class="almost-actions" style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">',
            '       <button type="button" id="startQuizFromModal" class="btn primary" style="font-size:0.95rem; padding:8px 14px;">Take the Quiz</button>',
            '       <a href="#" id="continueWithoutProfile" class="continue-link" style="font-size:0.85rem; text-decoration:underline;">Continue without profile</a>',
            '    </div>',
            '  </div>',
            '  <form class="modal-form hidden" hidden style="display:none" action="#" method="post" onsubmit="return false;">',
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
        if (initialized) return; // prevent double-binding
        const overlay = ensureModal();
        const modal = overlay.querySelector('.modal');
        const closeBtn = overlay.querySelector('.modal-close');
        const emailInput = overlay.querySelector('#subscribe-email');
        const formEl = overlay.querySelector('.modal-form');
        const titleEl = overlay.querySelector('#subscribe-title');
        const subtitleEl = overlay.querySelector('#subscribe-subtitle');
        const chooseFreeBtn = overlay.querySelector('#chooseFreeTier');
        const chooseOptimalBtn = overlay.querySelector('#chooseOptimalTier');
        const almostMsg = overlay.querySelector('#almostThereMessage');
        const startQuizBtn = overlay.querySelector('#startQuizFromModal');
        const continueBtn = overlay.querySelector('#continueWithoutProfile');

        const openModal = () => {
            if (isOpen) return; // already open
            isOpen = true;
            // cancel any pending hide timers from a previous close
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
            overlay.hidden = false; // make it renderable first
            // next frame ensure transition runs
            requestAnimationFrame(() => {
                overlay.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                try { /* focus later when tier is chosen */ } catch (_) { }
            });
        };

        const closeModal = () => {
            if (!isOpen) return; // already closed
            isOpen = false;
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';

            const handleEnd = (e) => {
                // Only act when the overlay's own transition finishes and we haven't reopened
                if (e.target !== overlay) return;
                if (!isOpen) overlay.hidden = true;
            };
            // transitionend may not always fire, use once + fallback
            overlay.addEventListener('transitionend', handleEnd, { once: true });

            // Fallback in case transitionend doesn’t fire (Safari, reduced motion, fast nav)
            hideTimer = setTimeout(() => {
                if (!isOpen) overlay.hidden = true;
                hideTimer = null;
            }, 400);
        };

        // Open triggers
        document.querySelectorAll('.subscribe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            }, { passive: false });
        });

        // Tier choose behavior: reveal form and update texts
        function showForm() {
            if (!formEl) return;
            formEl.hidden = false;
            formEl.classList.remove('hidden');
            formEl.style.display = 'grid';
            try { emailInput && emailInput.focus(); } catch (_) { }
        }
        chooseFreeBtn && chooseFreeBtn.addEventListener('click', () => {
            if (titleEl) titleEl.textContent = 'Free';
            if (subtitleEl) subtitleEl.textContent = "You'll receive general Utah credit card news and updates.";
            showForm();
        });
        chooseOptimalBtn && chooseOptimalBtn.addEventListener('click', () => {
            if (titleEl) titleEl.textContent = 'Optimal Updates – $2/mo';
            if (subtitleEl) subtitleEl.textContent = "You'll receive personalized notifications based on your profile.";
            const hasProfile = !!localStorage.getItem('rewrdsQuizResults');
            if (hasProfile) {
                // show form immediately
                showForm();
            } else {
                // reveal inline guidance instead of form
                if (almostMsg) {
                    almostMsg.hidden = false;
                    almostMsg.classList.remove('hidden');
                    almostMsg.style.display = 'block';
                }
            }
        });

        // Additional listener so Free tier always proceeds & hides any guidance
        chooseFreeBtn && chooseFreeBtn.addEventListener('click', () => {
            if (almostMsg && !almostMsg.hidden) {
                almostMsg.hidden = true;
                almostMsg.classList.add('hidden');
                almostMsg.style.display = 'none';
            }
        });

        // Start quiz button: redirect user
        startQuizBtn && startQuizBtn.addEventListener('click', () => {
            window.location.href = 'cardmatch.html';
        });

        // Continue without profile: hide message and proceed to form
        continueBtn && continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (almostMsg) {
                almostMsg.hidden = true;
                almostMsg.classList.add('hidden');
                almostMsg.style.display = 'none';
            }
            showForm();
        });

        // Close triggers
        closeBtn && closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        modal && modal.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closeModal(); });

        // Expose for debugging if needed
        overlay.__open = openModal;
        overlay.__close = closeModal;

        initialized = true;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
