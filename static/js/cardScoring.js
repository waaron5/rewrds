// === cardScoring.js ===
// This version connects the quiz answers directly to your credit card schema fields
// and computes total card scores based on user inputs, category spend, goals, perks, etc.

// =============================================================
// 1. MAPPING BETWEEN QUIZ ANSWERS AND SCHEMA FIELDS
// =============================================================
const quizToSchemaMap = {
    creditScore: {
        schemaField: "min_credit_score",
        weight: 1.0,
        rule: (userScoreRange, cardMinScore) => {
            const range = {
                poor: 550,
                fair: 630,
                good: 700,
                very_good: 740,
                excellent: 800,
                none: 0
            };
            return range[userScoreRange] >= cardMinScore ? 1 : 0;
        }
    },
    goal: {
        schemaField: "recommended_goals",
        weight: 1.2,
        rule: (goal, goalsArray = []) =>
            goalsArray.includes(goal) ? 1 : 0.5
    },
    annualFee: {
        schemaField: ["annual_fee", "card_tier"],
        weight: 0.8,
        rule: (pref, fee, tier) => {
            if (pref === "no_fee") return fee === 0 ? 1 : 0;
            if (pref === "small_fee") return fee <= 100 ? 1 : 0;
            if (pref === "premium") return tier === "premium" ? 1 : 0.5;
            return 0.5;
        }
    },
    spend: {
        schemaField: "rewards",
        weight: 2.0,
        rule: (spendData, rewards, pointValue) => {
            let total = 0;
            for (const [category, amount] of Object.entries(spendData)) {
                const match = rewards?.find(r =>
                    r.category.toLowerCase().includes(category.toLowerCase())
                );
                const rate = match ? match.rate : 1;
                total += amount * rate * pointValue;
            }
            return total;
        }
    },
    travelFrequency: {
        schemaField: ["credits_and_benefits", "recommended_goals"],
        weight: 0.7,
        rule: (freq, benefits = [], goals = []) => {
            if (freq === "frequently" && (goals.includes("travel_perks") || benefits.some(b => b.category === "Travel")))
                return 1;
            if (freq === "occasionally" && goals.includes("travel_perks"))
                return 0.8;
            return 0.3;
        }
    },
    airline: {
        schemaField: "transfer_partners",
        weight: 0.7,
        rule: (selectedAirlines, partners = []) => {
            if (selectedAirlines.includes("none")) return 0.5;
            const matches = partners.filter(p =>
                selectedAirlines.some(a => p.toLowerCase().includes(a))
            );
            return matches.length > 0 ? 1 : 0;
        }
    },
    hotel: {
        schemaField: "transfer_partners",
        weight: 0.6,
        rule: (selectedHotels, partners = []) => {
            if (selectedHotels.includes("none")) return 0.5;
            const matches = partners.filter(p =>
                selectedHotels.some(h => p.toLowerCase().includes(h))
            );
            return matches.length > 0 ? 1 : 0;
        }
    },
    perks: {
        schemaField: "credits_and_benefits",
        weight: 1.0,
        rule: (selectedPerks, benefits = []) => {
            if (selectedPerks.includes("none")) return 0.5;
            const normalized = benefits.map(b => b.type.toLowerCase());
            const matches = selectedPerks.filter(p =>
                normalized.some(nb => nb.includes(p.replace("_", " ")))
            );
            return matches.length / selectedPerks.length;
        }
    },
    cardStrategy: {
        schemaField: "pairing_synergy",
        weight: 0.4,
        rule: (strategy, synergy = []) => {
            if (strategy === "minimalist") return synergy.length === 0 ? 1 : 0.6;
            if (strategy === "optimizer") return synergy.length > 0 ? 1 : 0.6;
            return 0.8;
        }
    },
    businessCards: {
        schemaField: "is_business",
        weight: 1.0,
        rule: (choice, isBusiness) => {
            if (choice === "yes") return isBusiness ? 1 : 0.5;
            if (choice === "no") return isBusiness ? 0 : 1;
            return 1;
        }
    },
    redemption_value: {
        schemaField: ["point_value_baseline", "point_value_max"],
        weight: 1.3,
        rule: (effort, base, max) => {
            if (effort === "yes") return max;
            if (effort === "average") return (base + max) / 2;
            return base;
        }
    },
    zip: {
        schemaField: "available_regions",
        weight: 0.3,
        rule: (zip, regions = []) =>
            !zip ? 1 : regions.some(r => r.toLowerCase().includes("us")) ? 1 : 0
    }
};

// =============================================================
// 2. HELPER FUNCTIONS
// =============================================================
function getRewardRate(card, category) {
    const match = card.rewards?.find(r =>
        r.category.toLowerCase().includes(category.toLowerCase())
    );
    return match ? match.rate : (card.rewards?.find(r => r.category === "Catch_All")?.rate || 0);
}

// =============================================================
// 3. MAIN SCORING FUNCTION
// =============================================================
function scoreCards(cards, answers) {
    const results = [];

    cards.forEach(card => {
        let score = 0;
        let reasons = [];

        // === CREDIT SCORE QUALIFICATION ===
        const creditRangeMap = { poor: 580, fair: 670, good: 740, very_good: 800, excellent: 850 };
        const userScore = creditRangeMap[answers.creditScore] || 0;
        if (card.min_credit_score && userScore < card.min_credit_score) return;

        // === SPENDING VALUE ===
        const spendMap = {
            Dining: answers.spendDining || 0,
            Groceries: answers.spendGroceries || 0,
            Travel: answers.spendTravel || 0,
            Gas: answers.spendGas || 0,
            Transit: answers.spendTransit || 0,
            "Online Shopping": answers.spendOnline || 0,
            Rent: answers.spendRent || 0,
            Entertainment: answers.spendEntertainment || 0,
            Utilities: answers.spendUtilities || 0
        };

        const pointValue = quizToSchemaMap.redemption_value.rule(
            answers.redemption_value || "no",
            card.point_value_baseline || 0.01,
            card.point_value_max || 0.02
        );

        const spendValue = quizToSchemaMap.spend.rule(spendMap, card.rewards, pointValue);
        score += spendValue / 100;
        if (spendValue > 0) reasons.push(`Estimated ~$${Math.round(spendValue)} in yearly rewards`);

        // === SIGN-UP BONUS AND CREDITS ===
        const bonusValue = card.sign_up_bonus?.value_estimate || 0;
        const creditsValue = card.credits_and_benefits?.reduce((sum, b) => sum + (b.value || 0), 0) || 0;
        const annualFee = card.annual_fee || 0;
        const netValue = spendValue + bonusValue + creditsValue - annualFee;
        score += netValue / 100;
        if (bonusValue > 0) reasons.push(`Sign-up bonus worth ~$${bonusValue}`);
        if (creditsValue > 0) reasons.push(`Up to $${creditsValue} in credits`);
        if (annualFee > 0) reasons.push(`Annual fee: $${annualFee}`);

        // === GOAL ALIGNMENT ===
        if (answers.goal && card.recommended_goals?.includes(answers.goal)) {
            score += quizToSchemaMap.goal.weight;
            reasons.push("Matches your main goal");
        }

        // === PERKS, TRAVEL, BUSINESS, ETC. ===
        for (const [qKey, config] of Object.entries(quizToSchemaMap)) {
            const answer = answers[qKey];
            if (answer === undefined || qKey === "spend" || qKey === "creditScore" || qKey === "goal" || qKey === "redemption_value") continue;

            const fields = Array.isArray(config.schemaField)
                ? config.schemaField.map(f => card[f])
                : [card[config.schemaField]];

            try {
                const value = config.rule(answer, ...fields);
                score += (value || 0) * config.weight;
            } catch (err) {
                console.warn(`Rule error in ${qKey}:`, err);
            }
        }

        // === FINALIZE ===
        results.push({
            ...card,
            score: parseFloat(score.toFixed(2)),
            reasons: reasons.slice(0, 6)
        });
    });

    // sort high to low
    return results.sort((a, b) => b.score - a.score);
}

// Expose globally for quiz integration
window.cardScoring = { scoreCards };
