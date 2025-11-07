// === results.js ===

// Category reference (optional — used for display or filtering)
const categories = [
  "Dining",
  "Groceries",
  "Travel",
  "Airfare",
  "Hotels",
  "Gas",
  "Transit",
  "Streaming",
  "Online Shopping",
  "Drugstores",
  "Entertainment",
  "Utilities",
  "Phone Bills",
  "Subscriptions",
  "Wholesale Clubs",
  "Rent",
  "Catch_All"
];

// Load cards from JSON
async function loadCards() {
  const response = await fetch("http://localhost:4000/cards"); // adjust path to live api
  const cards = await response.json();
  return cards;
}

// Load user answers from localStorage
function getQuizAnswers() {
  try {
    return JSON.parse(localStorage.getItem("quizAnswers")) || {};
  } catch {
    return {};
  }
}

// render top results //
function renderCards(cards, scores) {
  const resultsContainer = document.getElementById("results");
  const noResultsMessage = document.getElementById("no-results");

  resultsContainer.innerHTML = "";

  if (!cards || cards.length === 0) {
    noResultsMessage.style.display = "block";
    return;
  }

  noResultsMessage.style.display = "none";

  const sorted = cards.slice(0, 5); // Show top 5

  sorted.forEach((card, index) => {
    const rank = index + 1; // 1st, 2nd, 3rd, etc.
    const cardEl = document.createElement("div");
    cardEl.classList.add("card-match");

    const bonusMain = card.sign_up_bonus?.value_estimate
      ? `$${card.sign_up_bonus.value_estimate}`
      : "—";
    const bonusInfo = card.sign_up_bonus?.description || "No sign-up bonus";

    // Group rewards by rate
    const rewardGroups = {};
    card.rewards.forEach(r => {
      const rateStr = r.rate >= 1 ? `${r.rate}x` : `${r.rate}%`;
      if (!rewardGroups[rateStr]) rewardGroups[rateStr] = [];
      rewardGroups[rateStr].push(r);
    });

    // Identify best categories dynamically
    const bestCategories = card.rewards
      .filter(r => r.category !== "Catch_All")
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2);
    const bestFor = bestCategories.map(r => r.category.replace("_", " ")).join(" & ");

    // Estimated yearly value
    const yearlyEstimateReason = card.reasons?.find(r =>
      r.toLowerCase().includes("estimated $")
    );
    const yearlyValue = yearlyEstimateReason
      ? yearlyEstimateReason.match(/\$(\d+)/)?.[1] || "—"
      : "—";

    cardEl.innerHTML = `
        <div class="card-rank-badge">${rank}</div>
        <div class="card-main-content">
          <div class="card-img-section">
            <img src="${card.image}" alt="${card.name}" class="card-img" />
            <div class="card-title">${card.name}</div>
          </div>
  
          <div class="card-info-section">
            <div class="card-info-block">
              <div class="card-info-title">Sign-Up Bonus</div>
              <div class="card-info-value">
                <span class="info-bubble" tabindex="0">&#9432;
                  <span class="info-popup">${bonusInfo}</span>
                </span>
                ${bonusMain}
              </div>
            </div>
  
            <div class="card-info-block">
              <div class="card-info-title">Rewards Rates</div>
              <div class="card-info-value">
                <ul>
                  ${Object.entries(rewardGroups)
        .map(([rate, group]) => {
          const info = group
            .map(
              r =>
                `${r.rate >= 1 ? r.rate + "x" : r.rate + "%"} on ${r.category.replace(
                  "_",
                  " "
                )}${r.details ? " " + r.details : ""}`
            )
            .join(" and ");
          return `<li>
                        <span class='info-bubble' tabindex='0'>&#9432;
                          <span class='info-popup'>${info}</span>
                        </span>
                        ${rate}
                      </li>`;
        })
        .join("")}
                </ul>
              </div>
            </div>
  
            <div class="card-info-block">
              <div class="card-info-title">Annual Fee</div>
              <div class="card-info-value">
                ${card.annual_fee === 0 ? "No Fee" : `$${card.annual_fee}`}
              </div>
            </div>
          </div>
  
          <div class="card-actions-section">
            <a href="${card.apply_link}" target="_blank" class="apply-btn">Apply Now</a>
            <a href="${card.rates_and_fees_link}" target="_blank" class="terms-link">Rates & Fees</a>
          </div>
        </div>
  
        <div class="card-value-summary">
          <div class="best-for">
            <strong>Best For:</strong> ${bestFor || "General spending"}
          </div>
          <div class="estimated-value">
            <strong>Estimated Yearly Rewards Value:</strong>
            <span class="value-amount">$${yearlyValue}</span>
          </div>
        </div>
      `;

    resultsContainer.appendChild(cardEl);
  });
}

// === Initialize page ===
async function init() {
  console.log("Initializing results page...");

  const allCards = await loadCards();
  const answers = getQuizAnswers();

  console.log("Loaded cards:", allCards);
  console.log("User answers:", answers);

  // Calculate scores
  const scoredResults = cardScoring.scoreCards(allCards, answers);
  console.log("Scored results:", scoredResults);

  // Create score map
  const scores = {};
  scoredResults.forEach(c => {
    scores[c.id] = c.score;
  });

  // Render
  renderCards(scoredResults, scores);
}

// Run on page load
init();
