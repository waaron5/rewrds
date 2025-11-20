// compare.js

const API_URL = window.API_BASE_URL + "/cards";
const RECENT_KEY = "rewrds_compare_recent_cards";

let allCards = [];
let selectedCards = {}; // slot -> card object
let selectedCount = 0;
let recentCardIds = [];

let fuse; // Fuse.js instance
let activeIndex = -1; // keyboard selection index

// DOM references
const searchInput = document.getElementById("compare-search-input");
const resultsBox = document.getElementById("compare-search-results");
const countDisplay = document.getElementById("selected-count");

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", async () => {
    loadRecentFromStorage();
    await loadCards();
    setupSearchBehavior();
    updateCount();
});

// ================================
// LOAD CARDS FROM API
// ================================
async function loadCards() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // Only visible cards
        allCards = data.filter(c => c.visibility !== false);

        // Build Fuse.js search index
        fuse = new Fuse(allCards, {
            keys: ["name", "issuer", "id"],
            threshold: 0.3
        });
    } catch (err) {
        console.error("Failed to load cards:", err);
    }
}

// ================================
// RECENT COMPARISONS (LOCAL STORAGE)
// ================================
function loadRecentFromStorage() {
    try {
        const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
        if (Array.isArray(stored)) {
            recentCardIds = stored;
        }
    } catch {
        recentCardIds = [];
    }
}

function saveRecentToStorage() {
    try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(recentCardIds));
    } catch {
        // ignore
    }
}

function recordRecentCard(cardId) {
    // Move to front, de-dup, cap at 5
    recentCardIds = [cardId, ...recentCardIds.filter(id => id !== cardId)].slice(0, 5);
    saveRecentToStorage();
}

function getRecentCards() {
    if (!allCards || allCards.length === 0) return [];
    const map = new Map(allCards.map(c => [c.id, c]));
    return recentCardIds
        .map(id => map.get(id))
        .filter(Boolean)
        .filter(c => c.visibility !== false);
}

// ================================
// SEARCH INPUT BEHAVIOR
// ================================
function setupSearchBehavior() {
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const term = searchInput.value.trim();

        if (!term) {
            // Show recent cards when empty
            const recents = getRecentCards();
            if (recents.length > 0) {
                renderSearchResults(recents, "");
            } else {
                resultsBox.style.display = "none";
            }
            return;
        }

        const results = fuse.search(term).slice(0, 10).map(r => r.item);
        renderSearchResults(results, term);
    });

    // Show recent comparisons when focusing an empty input
    searchInput.addEventListener("focus", () => {
        const term = searchInput.value.trim();
        if (!term) {
            const recents = getRecentCards();
            if (recents.length > 0) {
                renderSearchResults(recents, "");
            }
        }
    });

    // Keyboard navigation: ↑ / ↓ / Enter / Esc
    searchInput.addEventListener("keydown", (e) => {
        const items = Array.from(resultsBox.querySelectorAll(".compare-search-item"));
        if (resultsBox.style.display === "none" || items.length === 0) {
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            updateActiveResult(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            updateActiveResult(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < items.length) {
                const el = items[activeIndex];
                if (el.dataset.disabled === "true") return;
                el.click();
            }
        } else if (e.key === "Escape") {
            resultsBox.style.display = "none";
            activeIndex = -1;
        }
    });

    // Close search results when clicking outside
    document.addEventListener("click", (e) => {
        if (e.target !== searchInput && !resultsBox.contains(e.target)) {
            resultsBox.style.display = "none";
            activeIndex = -1;
        }
    });
}

// Highlight active result for keyboard nav
function updateActiveResult(items) {
    items.forEach((item, idx) => {
        if (idx === activeIndex) {
            item.classList.add("is-active");
            item.scrollIntoView({ block: "nearest" });
        } else {
            item.classList.remove("is-active");
        }
    });
}

// ================================
// RENDER SEARCH RESULTS
// ================================
function renderSearchResults(cards, term) {
    if (!cards || cards.length === 0) {
        resultsBox.innerHTML = `<div class="compare-search-item">No results</div>`;
        resultsBox.style.display = "block";
        activeIndex = -1;
        return;
    }

    const lowerTerm = term.toLowerCase();
    const html = cards.map(card => {
        const isSelected = isCardSelected(card.id);
        const disabledClass = isSelected ? " compare-search-item--disabled" : "";
        const disabledAttr = isSelected ? ' data-disabled="true"' : "";

        const nameHtml = highlightMatch(card.name, lowerTerm);
        const issuerHtml = highlightMatch(card.issuer || "", lowerTerm);

        const subline = isSelected
            ? `<small>Already in comparison</small>`
            : `<small>${issuerHtml}</small>`;

        return `
            <div class="compare-search-item${disabledClass}" data-card-id="${card.id}"${disabledAttr}>
                <strong>${nameHtml}</strong>
                ${subline}
            </div>
        `;
    }).join("");

    resultsBox.innerHTML = html;
    resultsBox.style.display = "block";
    activeIndex = -1;

    // Click selection
    Array.from(resultsBox.querySelectorAll(".compare-search-item")).forEach(item => {
        const disabled = item.dataset.disabled === "true";
        if (disabled) return; // don't attach click handler

        item.addEventListener("click", () => {
            const cardId = item.getAttribute("data-card-id");
            addCardToCompare(cardId);
            searchInput.value = "";
            resultsBox.style.display = "none";
            activeIndex = -1;
        });
    });
}

// ================================
// UTILS: selection & highlighting
// ================================
function isCardSelected(cardId) {
    return Object.values(selectedCards).some(c => c.id === cardId);
}

function highlightMatch(text, term) {
    if (!term) return text;
    const safeTerm = escapeRegExp(term);
    const regex = new RegExp(`(${safeTerm})`, "ig");
    return text.replace(regex, "<mark>$1</mark>");
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ================================
// ADD CARD TO COMPARISON GRID
// ================================
function addCardToCompare(cardId) {
    if (selectedCount >= 3) return;
    if (isCardSelected(cardId)) return;

    const card = allCards.find(c => c.id === cardId);
    if (!card) return;

    // Find open slot
    const slot = [1, 2, 3].find(s => !selectedCards[s]);
    if (!slot) return;

    selectedCards[slot] = card;
    selectedCount++;

    renderSlotHeader(slot, card);
    renderAllFields(slot, card);
    updateCount();

    // Track in recents
    recordRecentCard(cardId);
}

// ================================
// REMOVE CARD
// ================================
function removeCard(slot) {
    if (!selectedCards[slot]) return;

    delete selectedCards[slot];
    selectedCount--;

    // Reset header
    const header = document.querySelector(`.compare-col-header[data-slot="${slot}"]`);
    header.classList.add("empty");
    header.innerHTML = `<div class="slot-hint">Empty Slot</div>`;

    // Clear cells
    document.querySelectorAll(`.compare-cell[data-slot="${slot}"]`).forEach(cell => {
        cell.innerHTML = "";
    });

    updateCount();
}

function updateCount() {
    countDisplay.textContent = `${selectedCount} of 3 selected`;
}

// ================================
// RENDER HEADER SLOT
// ================================
function renderSlotHeader(slot, card) {
    const header = document.querySelector(`.compare-col-header[data-slot="${slot}"]`);
    header.classList.remove("empty");

    const imgSrc = card.image || "/static/images/card-placeholder.png";

    header.innerHTML = `
        <div class="compare-header-content">
            <img src="${imgSrc}" alt="${card.name}" class="compare-card-image" />
            <div class="compare-card-title">
                <strong>${card.name}</strong><br/>
                <span>${card.issuer}</span>
            </div>
            <button class="remove-card-btn" data-remove-slot="${slot}">✕</button>
        </div>
    `;

    header.querySelector(".remove-card-btn").addEventListener("click", () => {
        removeCard(slot);
    });
}

// ================================
// RENDER ALL FIELDS FOR ONE CARD
// ================================
function renderAllFields(slot, card) {
    renderField("annual_fee", slot, formatAnnualFee(card));
    renderField("welcome_offer", slot, formatWelcomeOffer(card));
    renderField("rewards", slot, formatRewards(card));
    renderField("perks", slot, formatPerks(card));
    renderField("intro_apr", slot, fallback(card.intro_apr));
    renderField("ongoing_apr", slot, fallback(card.ongoing_apr));
    renderField("foreign_fees", slot, fallback(card.foreign_fees));
    renderField("point_value", slot, formatPointValue(card));
    renderField("credit_score", slot, fallback(card.min_credit_score));
    renderField("card_tier", slot, fallback(card.card_tier));
    renderField("regions", slot, (card.available_regions || []).join(", "));
    renderField("eligibility", slot, fallback(card.eligibility));
    renderField("transfer_partners", slot, formatList(card.transfer_partners));
    renderField("pairing_synergy", slot, formatList(card.pairing_synergy));
    renderField("apply_link", slot, formatApplyLink(card));
}

// ================================
// RENDER FIELD CONTENT
// ================================
function renderField(field, slot, html) {
    const cell = document.querySelector(
        `.compare-cell[data-field="${field}"][data-slot="${slot}"]`
    );
    if (!cell) return;
    cell.innerHTML = html || "—";
}

// ================================
// FORMATTERS
// ================================
function fallback(value) {
    if (value === null || value === undefined || value === "" || value === "null") {
        return "—";
    }
    return value;
}

function formatAnnualFee(card) {
    return card.annual_fee === 0 ? "$0" : `$${card.annual_fee}`;
}

function formatWelcomeOffer(card) {
    const b = card.sign_up_bonus;

    if (!b || (!b.description && !b.value_estimate)) return "—";

    const parts = [];

    if (b.description) parts.push(b.description);
    if (b.value_estimate) parts.push(`<strong>Value:</strong> ~$${b.value_estimate}`);
    if (b.spend_requirement) parts.push(`<strong>Spend:</strong> $${b.spend_requirement}`);
    if (b.timeframe_months) parts.push(`<strong>Timeline:</strong> ${b.timeframe_months} months`);

    return parts.join("<br/>");
}

function formatRewards(card) {
    if (!card.rewards || card.rewards.length === 0) return "—";

    const list = card.rewards
        .map(r => `<li><strong>${r.rate}×</strong> — ${r.description}</li>`)
        .join("");

    return `<ul class="compare-list">${list}</ul>`;
}

function formatPerks(card) {
    if (!card.credits_and_benefits || card.credits_and_benefits.length === 0) return "—";

    const list = card.credits_and_benefits
        .map(p => `<li>${p}</li>`)
        .join("");

    return `<ul class="compare-list">${list}</ul>`;
}

function formatPointValue(card) {
    const base = card.point_value_baseline;
    const max = card.point_value_max;

    if (!base && !max) return "—";

    return `
        Baseline: ${base ? (base * 100).toFixed(1) + "¢" : "—"}<br/>
        Max: ${max ? (max * 100).toFixed(1) + "¢" : "—"}
    `;
}

function formatList(arr) {
    if (!arr || arr.length === 0) return "—";

    const html = arr.map(i => `<li>${i}</li>`).join("");
    return `<ul class="compare-list">${html}</ul>`;
}

function formatApplyLink(card) {
    if (!card.apply_link) return "—";

    return `<a class="apply-btn" href="${card.apply_link}" target="_blank" rel="noopener noreferrer">Apply</a>`;
}
