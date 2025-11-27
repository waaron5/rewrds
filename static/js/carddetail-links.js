// Attach card detail links to any element with data-card-id
(function () {
    function getCardId(el) {
        if (!el) return null;
        if (el.dataset && el.dataset.cardId) return el.dataset.cardId;
        return null;
    }

    document.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        const clickable = target.closest("[data-card-id]");
        if (!clickable) return;

        const id = getCardId(clickable);
        if (!id) return;

        // If the element is already an anchor with href, let it proceed
        if (clickable.tagName === "A" && clickable.getAttribute("href")) return;

        e.preventDefault();
        window.location.href = `/carddetails.html?id=${encodeURIComponent(id)}`;
    });
})();
