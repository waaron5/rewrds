// === results.js ===
// use this link to preview results page without having to take the quiz:
//  https://rewrds.vercel.app/results.html?dev=1

// Category reference (optional — used for display or filtering)
const categories = [
  "Dining",
  "Groceries",
  "Travel",
  "Airfare",
  "Hotels",
  "Gas",
  "EV Charging",
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

// ==============================
// DEV MODE: auto-load dummy results
// ==============================
const params = new URLSearchParams(window.location.search);

if (params.get("dev") === "1") {
  console.warn("⚠ DEV MODE ENABLED — Loading dummy quiz answers and results");

  const dummyAnswers = {
    creditScore: "good",
    goal: "maximize_value",
    annualFee: "small_fee",
    state: "Utah",
    spendGroceries: 600,
    spendDining: 300,
    spendTravel: 400,
    spendGas: 150,
    spendOnline: 200,
    spendRent: 0,
    spendTransit: 0,
    perks: ["lounge_access"]
  };

  fetch(`${API_BASE_URL}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dummyAnswers)
  })
    .then(res => res.json())
    .then(results => {
      localStorage.setItem("quizAnswers", JSON.stringify(dummyAnswers));
      localStorage.setItem("cardResults", JSON.stringify(results));
      renderResults(results);
    })
    .catch(err => {
      console.error("DEV MODE ERROR:", err);
    });

  // Stop normal results.js execution
  return;
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
    const rank = index + 1;
    const cardEl = document.createElement("div");
    cardEl.classList.add("card-match");

    const bonusMain = card.sign_up_bonus?.value_estimate
      ? `$${card.sign_up_bonus.value_estimate}`
      : "—";
    const bonusInfo = card.sign_up_bonus?.description || "No sign-up bonus";

    const rewardGroups = {};
    (card.rewards || []).forEach(r => {
      const rateStr = r.rate >= 1 ? `${r.rate}x` : `${r.rate}%`;
      if (!rewardGroups[rateStr]) rewardGroups[rateStr] = [];
      rewardGroups[rateStr].push(r);
    });

    const bestCategories = (card.rewards || [])
      .filter(r => r.category !== "Catch_All")
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2);
    const bestFor = bestCategories.map(r => r.category.replace("_", " ")).join(" & ");

    const yearlyEstimateReason = (card.reasons || []).find(r =>
      r.toLowerCase().includes("estimated $")
    );
    const yearlyValue = yearlyEstimateReason
      ? yearlyEstimateReason.match(/\$(\d+)/)?.[1] || "—"
      : "—";

    const reasonsList = (card.reasons || []).map(r => `<li>${r}</li>`).join("");

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
          <span class="value-amount">${yearlyValue !== "—" ? `$${yearlyValue}` : "—"}</span>
        </div>
        <div class="card-reasons">
          <strong>Why this card fits you:</strong>
          <ul>
            ${reasonsList}
          </ul>
        </div>
      </div>
    `;

    resultsContainer.appendChild(cardEl);
  });
}

// === Initialize page ===
async function init() {
  console.log("Initializing results page...");

  const scoredResults = JSON.parse(localStorage.getItem("cardResults")) || [];
  console.log("Scored results:", scoredResults);

  const scores = {};
  scoredResults.forEach(c => {
    scores[c.id] = c.score;
  });

  renderCards(scoredResults, scores);
}

init();
