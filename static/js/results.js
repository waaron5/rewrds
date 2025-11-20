// === results.js ===
// Development preview:
// https://rewrds.vercel.app/results.html?dev=1

const categories = [
  "Dining", "Groceries", "Travel", "Airfare", "Hotels", "Gas", "EV Charging",
  "Transit", "Streaming", "Online Shopping", "Drugstores", "Entertainment",
  "Utilities", "Phone Bills", "Subscriptions", "Wholesale Clubs", "Rent", "Catch_All"
];

(async function initResults() {
  const params = new URLSearchParams(window.location.search);

  // =====================
  // DEV MODE BLOCK
  // =====================
  if (params.get("dev") === "1") {
    console.warn("⚠ DEV MODE — Loading dummy answers");

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

    try {
      const response = await fetch(`${API_BASE_URL}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dummyAnswers)
      });

      const results = await response.json();

      localStorage.setItem("quizAnswers", JSON.stringify(dummyAnswers));
      localStorage.setItem("cardResults", JSON.stringify(results));

      renderCards(results);
    } catch (err) {
      console.error("DEV MODE ERROR:", err);
    }

    return;
  }

  // =====================
  // NORMAL MODE
  // =====================

  let scoredResults = [];
  try {
    scoredResults = JSON.parse(localStorage.getItem("cardResults")) || [];
  } catch {
    scoredResults = [];
  }

  console.log("Loaded scored results:", scoredResults);

  renderCards(scoredResults);
})();
