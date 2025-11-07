// === quizToSchemaMap.js ===
// This file defines how each quiz question connects to fields in your credit card schema
// and how each answer affects scoring weight and logic.

export const quizToSchemaMap = {
    // 1. CREDIT SCORE
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

    // 2. MAIN GOAL
    goal: {
        schemaField: "recommended_goals",
        weight: 1.2,
        rule: (goal, goalsArray = []) =>
            goalsArray.includes(goal) ? 1 : 0.5
    },

    // 3. ANNUAL FEE TOLERANCE
    annualFee: {
        schemaField: ["annual_fee", "card_tier"],
        weight: 0.8,
        rule: (preference, fee, tier) => {
            if (preference === "no_fee") return fee === 0 ? 1 : 0;
            if (preference === "small_fee") return fee <= 100 ? 1 : 0;
            if (preference === "premium") return tier === "premium" ? 1 : 0.5;
            return 0.5;
        }
    },

    // 4. SPENDING HABITS
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

    // 5. TRAVEL FREQUENCY
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

    // 6. AIRLINES
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

    // 7. HOTELS
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

    // 8. PERKS / BENEFITS
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

    // 9–11. STORE / MERCHANT CHOICES
    grocery: {
        schemaField: "rewards",
        weight: 0.5,
        rule: (choices, rewards) =>
            rewards.some(r => r.category.toLowerCase().includes("grocery")) ? 1 : 0
    },
    gas: {
        schemaField: "rewards",
        weight: 0.5,
        rule: (choices, rewards) =>
            rewards.some(r => r.category.toLowerCase().includes("gas")) ? 1 : 0
    },
    onlineShopping: {
        schemaField: "rewards",
        weight: 0.5,
        rule: (choices, rewards) =>
            rewards.some(r =>
                ["online", "e-commerce", "amazon"].some(k =>
                    r.category.toLowerCase().includes(k)
                )
            )
                ? 1
                : 0
    },

    // 12. CARD STRATEGY (simplicity vs optimization)
    cardStrategy: {
        schemaField: "pairing_synergy",
        weight: 0.4,
        rule: (strategy, synergy = []) => {
            if (strategy === "minimalist") return synergy.length === 0 ? 1 : 0.6;
            if (strategy === "optimizer") return synergy.length > 0 ? 1 : 0.6;
            return 0.8;
        }
    },

    // 13. BUSINESS CARDS
    businessCards: {
        schemaField: "is_business",
        weight: 1.0,
        rule: (choice, isBusiness) => {
            if (choice === "yes") return isBusiness ? 1 : 0.5;
            if (choice === "no") return isBusiness ? 0 : 1;
            return 1;
        }
    },

    // 14. REDEMPTION EFFORT (willingness to find best value)
    redemption_value: {
        schemaField: ["point_value_baseline", "point_value_max"],
        weight: 1.3,
        rule: (effort, baseValue, maxValue) => {
            if (effort === "yes") return maxValue;
            if (effort === "average") return (baseValue + maxValue) / 2;
            return baseValue;
        }
    },

    // 15. REGION / ZIP CODE
    zip: {
        schemaField: "available_regions",
        weight: 0.3,
        rule: (zip, regions = []) =>
            !zip ? 1 : regions.some(r => r.toLowerCase().includes("us")) ? 1 : 0
    }
};
