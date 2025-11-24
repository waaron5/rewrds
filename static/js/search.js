// search.js — simple site page search (Fuse.js)

// 3) Static pages list
const pages = [
    { title: "Home", url: "/" },
    { title: "Login / Sign up", url: "/login.html" },
    { title: "Credit Card Quiz", url: "/cardmatch.html" },
    { title: "Best Cards 2025", url: "/bestcardsof2025.html" },
    { title: "Results", url: "/results.html" },
    { title: "About Us", url: "/about.html" },
    { title: "Subscribe", url: "/subscribe.html" }
];

(function () {
    let fuse; // Fuse instance

    function ensureSearchModal() {
        let overlay = document.getElementById('search-overlay');
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.id = 'search-overlay';
        overlay.className = 'search-overlay';
        overlay.hidden = true;
        overlay.innerHTML = [
            '<div class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title">',
            '  <div class="search-modal-header">',
            '    <input id="search-input" class="search-input" type="search" placeholder="Search pages..." aria-label="Search pages" />',
            '    <button class="search-close" aria-label="Close">×</button>',
            '  </div>',
            '  <div id="search-results"></div>',
            '</div>'
        ].join('');
        document.body.appendChild(overlay);
        return overlay;
    }

    function openModal(overlay) {
        overlay.hidden = false;
        requestAnimationFrame(() => {
            overlay.classList.add('is-open');
            const input = overlay.querySelector('#search-input');
            input && input.focus();
        });
    }

    function closeModal(overlay) {
        overlay.classList.remove('is-open');
        const onEnd = (e) => {
            if (e.target !== overlay) return;
            overlay.hidden = true;
            overlay.removeEventListener('transitionend', onEnd);
        };
        overlay.addEventListener('transitionend', onEnd);
        setTimeout(() => { if (!overlay.classList.contains('is-open')) overlay.hidden = true; }, 260);
    }

    function renderResults(container, items) {
        container.innerHTML = '';
        if (!items || !items.length) {
            const empty = document.createElement('div');
            empty.className = 'search-no-results';
            empty.textContent = 'No results found';
            container.appendChild(empty);
            return;
        }
        items.forEach(res => {
            const { item } = res; // Fuse result
            const a = document.createElement('a');
            a.className = 'search-result-item';
            a.href = item.url;
            a.textContent = item.title;
            container.appendChild(a);
        });
    }

    function wireSearch(overlay) {
        // 5) Init Fuse
        fuse = new Fuse(pages, { keys: ['title'], threshold: 0.3, ignoreLocation: true });

        const input = overlay.querySelector('#search-input');
        const results = overlay.querySelector('#search-results');
        const closeBtn = overlay.querySelector('.search-close');

        input.addEventListener('input', () => {
            const q = input.value.trim();
            if (!q) { results.innerHTML = ''; return; }
            const matches = fuse.search(q);
            renderResults(results, matches);
        });

        // Close interactions
        closeBtn.addEventListener('click', () => closeModal(overlay));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeModal(overlay); });
    }

    // 8) Expose init
    function initSearch() {
        const overlay = ensureSearchModal();
        wireSearch(overlay);
        // Hook navbar button
        const btn = document.querySelector('.nav-search-btn');
        if (btn) btn.addEventListener('click', () => openModal(overlay));
    }

    window.initSearch = initSearch;
})();
