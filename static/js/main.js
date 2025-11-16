// main.js — site bootstrap
(function () {
    function init() {
        if (typeof window.initSearch === 'function') {
            window.initSearch();
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();