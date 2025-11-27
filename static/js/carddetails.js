(() => {
    const cards = {
        "platinum-rewards": {
            id: "platinum-rewards",
            name: "Platinum Rewards Card",
            issuer: "Chase",
            image: "https://placehold.co/420x260/2563eb/ffffff?text=Platinum",
            tagline: "Premium rewards for travel and dining with elevated protections.",
            annualFee: "$95",
            aprRange: "21.24% – 28.24% variable APR",
            creditScoreNeeded: "Good–Excellent",
            highlights: [
                { label: "Welcome Offer", value: "60,000 pts", subtext: "After $4,000 in 3 months" },
                { label: "Travel Perks", value: "Lounge access", subtext: "Plus trip protection" },
                { label: "FX Fees", value: "None", subtext: "Worldwide acceptance" }
            ],
            benefits: [
                { title: "No foreign transaction fees", description: "Use your card abroad without extra fees." },
                { title: "Trip delay & baggage insurance", description: "Coverage for common travel issues." },
                { title: "Purchase protection", description: "Extended warranty and purchase protections." },
                { title: "Partner transfer options", description: "Move points to airline and hotel partners." }
            ],
            rewardsDetails: {
                earnRate: [
                    { category: "Travel & Dining", rate: "3X points" },
                    { category: "All Other Purchases", rate: "1X points" }
                ],
                redemption: "Redeem for travel through partners, statement credits, or transfer to airlines/hotels."
            },
            feesAndRates: [
                { item: "Annual Fee", amount: "$95" },
                { item: "Purchase APR", amount: "21.24% – 28.24% variable" },
                { item: "Balance Transfer Fee", amount: "5% ($5 min)" },
                { item: "Cash Advance Fee", amount: "5% ($10 min)" }
            ],
            requirements: [
                "Good to excellent credit score recommended",
                "Proof of income and U.S. residency",
                "Must be 18 or older to apply"
            ]
        },
        "freedom-unlimited": {
            id: "freedom-unlimited",
            name: "Freedom Unlimited",
            issuer: "Chase",
            image: "https://placehold.co/420x260/0ea5e9/ffffff?text=Freedom",
            tagline: "A simple cash back workhorse for every purchase.",
            annualFee: "$0",
            aprRange: "20.24% – 28.99% variable APR",
            creditScoreNeeded: "Good",
            highlights: [
                { label: "Welcome Offer", value: "$200", subtext: "After $500 in 3 months" },
                { label: "Cash Back", value: "1.5%", subtext: "On everything" },
                { label: "Annual Fee", value: "$0", subtext: "Keep your rewards" }
            ],
            benefits: [
                { title: "No annual fee", description: "Earn on every purchase with no ongoing cost." },
                { title: "Intro 0% APR", description: "On purchases for the first 15 months (then variable APR)." },
                { title: "Purchase protection", description: "Coverage on eligible new purchases." },
                { title: "Simple cash back", description: "No rotating categories to track." }
            ],
            rewardsDetails: {
                earnRate: [
                    { category: "All Purchases", rate: "1.5% cash back" }
                ],
                redemption: "Redeem for statement credits, direct deposit, or combine with travel partners."
            },
            feesAndRates: [
                { item: "Annual Fee", amount: "$0" },
                { item: "Purchase APR", amount: "20.24% – 28.99% variable" },
                { item: "Balance Transfer Fee", amount: "5% ($5 min)" }
            ],
            requirements: [
                "Good credit score recommended",
                "Proof of income and U.S. residency",
                "Must be 18 or older to apply"
            ]
        },
        "amex-gold": {
            id: "amex-gold",
            name: "American Express Gold",
            issuer: "American Express",
            image: "https://placehold.co/420x260/fbbf24/1f2937?text=Amex+Gold",
            tagline: "Elevated earnings on dining and groceries with premium service.",
            annualFee: "$250",
            aprRange: "See Pay Over Time APR (variable)",
            creditScoreNeeded: "Good–Excellent",
            highlights: [
                { label: "Welcome Offer", value: "75,000 pts", subtext: "After $6,000 in 6 months" },
                { label: "Dining Credit", value: "$120", subtext: "Monthly $10 credits" },
                { label: "Groceries", value: "4X points", subtext: "U.S. supermarkets (cap applies)" }
            ],
            benefits: [
                { title: "4X on dining & groceries", description: "Earn rapidly on everyday food spending." },
                { title: "Hotel collection perks", description: "Eligible benefits on select stays." },
                { title: "Purchase protection", description: "Coverage for eligible purchases." },
                { title: "Amex Offers", description: "Targeted statement credit offers." }
            ],
            rewardsDetails: {
                earnRate: [
                    { category: "Dining worldwide", rate: "4X points" },
                    { category: "U.S. supermarkets", rate: "4X points" },
                    { category: "Flights booked via Amex/airlines", rate: "3X points" },
                    { category: "Other purchases", rate: "1X point" }
                ],
                redemption: "Use points for travel, transfers to airline/hotel partners, or statement credits."
            },
            feesAndRates: [
                { item: "Annual Fee", amount: "$250" },
                { item: "Foreign Transaction Fees", amount: "None" },
                { item: "Balance Transfer / Cash Advance", amount: "See issuer terms" }
            ],
            requirements: [
                "Good to excellent credit score recommended",
                "Proof of income and U.S. residency",
                "Must be 18 or older to apply"
            ]
        }
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function populateCard(card) {
        byId("detail-name").textContent = card.name;
        byId("detail-issuer").textContent = card.issuer;
        byId("detail-tagline").textContent = card.tagline;
        byId("detail-fee").textContent = card.annualFee;
        byId("detail-apr").textContent = card.aprRange;
        byId("detail-score").textContent = card.creditScoreNeeded;
        byId("detail-image").src = card.image;
        byId("detail-image").alt = card.name;
        byId("detail-bottom-title").textContent = `Don't Miss Out on ${card.name}`;
        byId("detail-bottom-copy").textContent = "Limited time welcome bonus. Apply today and start earning rewards on every purchase.";

        const highlightsWrap = document.querySelector(".carddetail-highlight-grid");
        highlightsWrap.innerHTML = "";
        card.highlights.forEach(h => {
            const div = document.createElement("div");
            div.className = "carddetail-highlight";
            div.innerHTML = `<div class="label">${h.label}</div><div class="value">${h.value}</div><div class="subtext">${h.subtext}</div>`;
            highlightsWrap.appendChild(div);
        });

        const benefitsWrap = byId("detail-benefits");
        benefitsWrap.innerHTML = "";
        card.benefits.forEach(b => {
            const item = document.createElement("div");
            item.className = "benefit-card";
            item.innerHTML = `<div class="benefit-title">${b.title}</div><p>${b.description}</p>`;
            benefitsWrap.appendChild(item);
        });

        const earnWrap = byId("detail-earn");
        earnWrap.innerHTML = "";
        card.rewardsDetails.earnRate.forEach(rate => {
            const row = document.createElement("div");
            row.className = "earn-row";
            row.innerHTML = `<span>${rate.category}</span><span class="earn-pill">${rate.rate}</span>`;
            earnWrap.appendChild(row);
        });

        const redemptionBox = byId("detail-redemption");
        redemptionBox.textContent = card.rewardsDetails.redemption;

        const feesWrap = byId("detail-fees");
        feesWrap.innerHTML = "";
        card.feesAndRates.forEach(fee => {
            const row = document.createElement("div");
            row.className = "fee-row";
            row.innerHTML = `<span>${fee.item}</span><span>${fee.amount}</span>`;
            feesWrap.appendChild(row);
        });

        const reqWrap = byId("detail-reqs");
        reqWrap.innerHTML = "";
        card.requirements.forEach(req => {
            const li = document.createElement("li");
            li.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${req}</span>`;
            reqWrap.appendChild(li);
        });

        const applyLinks = [byId("apply-hero"), byId("apply-sidebar"), byId("apply-bottom")].filter(Boolean);
        applyLinks.forEach(btn => {
            btn.onclick = () => {
                const target = "#";
                window.location.href = target;
            };
        });
    }

    function init() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id") || "platinum-rewards";
        const card = cards[id] || cards["platinum-rewards"];
        populateCard(card);
    }

    document.addEventListener("DOMContentLoaded", init);
})();
