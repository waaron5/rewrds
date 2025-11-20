document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cardmatch-form");
    const fieldsets = Array.from(form.querySelectorAll("fieldset.q"));
    const progressText = document.getElementById("quiz-progress");
    const progressBarFill = document.querySelector(".progress-bar-fill");
    let currentStep = 0;
    const totalSteps = fieldsets.length;
    const userAnswers = {};

    // Save answers for a given step
    function saveAnswer(step) {
        const fs = fieldsets[step];
        if (!fs) return;

        const radios = fs.querySelectorAll("input[type='radio']");
        if (radios.length) {
            const checked = Array.from(radios).find(r => r.checked);
            if (checked) userAnswers[checked.name] = checked.value;
        }

        const checkboxes = fs.querySelectorAll("input[type='checkbox']");
        if (checkboxes.length) {
            const checkedBoxes = Array.from(checkboxes).filter(c => c.checked);
            userAnswers[checkboxes[0].name] = checkedBoxes.map(c => c.value);
        }

        const select = fs.querySelector("select");
        if (select) userAnswers[select.name] = select.value;

        // Legacy / extra fields (safe to keep)
        const spend = fs.querySelector("input[name='monthlySpend']:checked");
        if (spend) userAnswers["monthlySpend"] = parseInt(spend.value);

        const strategy = fs.querySelector("input[name='cardStrategy']:checked");
        if (strategy) userAnswers["cardStrategy"] = strategy.value;

        // Save raw slider values (final annualization happens in showResults)
        const sliders = fs.querySelectorAll("input[type='range']");
        if (sliders.length) {
            sliders.forEach(sl => {
                userAnswers[sl.name] = parseInt(sl.value) || 0;
            });
        }
    }

    // === LIVE UPDATE SLIDER VALUES ===
    document.querySelectorAll("input[type='range']").forEach(slider => {
        const label = document.getElementById(`val-${slider.id.split('-')[1]}`);
        slider.addEventListener("input", () => {
            if (label) label.textContent = `$${slider.value}`;
        });
    });

    // === SLIDER <-> TEXTBOX SYNC LOGIC ===
    [
        ['groceries', 3000],
        ['dining', 3000],
        ['travel', 3000],
        ['gas', 3000],
        ['ev', 3000],
        ['transit', 3000],
        ['online', 3000],
        ['rent', 4000],
        ['other', 3000],
        ['entertainment', 1000],
        ['utilities', 3000]
    ].forEach(([cat, max]) => {
        const slider = document.getElementById(`spend-${cat}`);
        const input = document.getElementById(`input-${cat}`);
        if (slider && input) {
            // Slider -> Input
            slider.addEventListener('input', () => {
                input.value = slider.value;
            });
            // Input -> Slider
            input.addEventListener('input', () => {
                let val = parseInt(input.value, 10);
                if (isNaN(val)) val = 0;
                if (val < 0) val = 0;
                if (val > max) val = max;
                slider.value = val;
                input.value = val;
            });
        }
    });

    // === Month/Year toggle logic ===
    document.querySelectorAll('.slider-toggle').forEach(toggle => {
        toggle.querySelectorAll('.toggle-label').forEach(label => {
            label.addEventListener('click', () => {
                toggle.querySelectorAll('.toggle-label').forEach(l => l.classList.remove('active'));
                label.classList.add('active');
            });
        });
    });

    // Utility: inline error handling for quiz steps
    function renderErrorBefore(targetEl, message) {
        const fs = targetEl.closest('fieldset');
        const container = targetEl.parentElement || fs || document.body;
        let err = container.querySelector('.quiz-error');
        if (!err) {
            err = document.createElement('div');
            err.className = 'quiz-error';
            container.insertBefore(err, targetEl);
        }
        let icon = err.querySelector('.error-icon');
        if (!icon) {
            icon = document.createElement('span');
            icon.className = 'error-icon';
            err.prepend(icon);
        }
        let text = err.querySelector('.error-text');
        if (!text) {
            text = document.createElement('span');
            text.className = 'error-text';
            err.appendChild(text);
        }
        text.textContent = message;
        err.style.display = 'flex';
    }

    function clearFieldsetError(fs) {
        if (!fs) return;
        const errs = fs.querySelectorAll('.quiz-error');
        errs.forEach(e => e.remove());
    }

    // === Continue button for slider question ===
    const sliderContinue = document.getElementById("slider-continue");
    if (sliderContinue) {
        sliderContinue.addEventListener("click", () => {
            const fs = sliderContinue.closest('fieldset') || fieldsets[currentStep];

            const rows = fs ? fs.querySelectorAll('.slider-row') : document.querySelectorAll('.slider-row');
            const anyPositive = Array.from(rows).some(row => {
                const slider = row.querySelector('input[type="range"]');
                if (!slider) return false;
                const val = parseFloat(slider.value || '0');
                return val > 0;
            });
            if (!anyPositive) {
                renderErrorBefore(sliderContinue, 'Please enter a value in at least one category before continuing.');
                return;
            }
            if (fs) clearFieldsetError(fs);

            // Save all slider values with monthly/yearly taken into account
            rows.forEach(row => {
                const slider = row.querySelector('input[type="range"]');
                if (!slider) return;
                const activeToggle = row.querySelector('.toggle-label.active');
                let value = parseInt(slider.value, 10) || 0;
                if (activeToggle && activeToggle.dataset.unit === 'month') {
                    value = value * 12;
                }
                userAnswers[slider.name] = value;
            });

            saveAnswer(currentStep);
            localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
            currentStep++;
            showStep(currentStep);
        });

        const sliders = document.querySelectorAll("input[type='range']");
        sliders.forEach(sl => {
            sl.addEventListener("input", () => {
                const fs = sl.closest('fieldset') || fieldsets[currentStep];
                clearFieldsetError(fs);
            });
        });
    }

    // === Final submission: convert all spend to annual based on UI state & send to backend ===
    function showResults() {
        // Correct month/year conversion for ALL sliders based on current toggles
        document.querySelectorAll("fieldset.q").forEach(fs => {
            const slider = fs.querySelector("input[type='range']");
            if (!slider) return;

            const name = slider.name;
            if (!name || !name.startsWith("spend")) return;

            const input = fs.querySelector("input[type='number']");
            const rawValue = parseFloat(input?.value) || parseFloat(slider.value) || 0;

            const activeToggle = fs.querySelector(".toggle-label.active");
            const isMonthly = activeToggle && activeToggle.dataset.unit === "month";

            const annualValue = isMonthly ? (rawValue * 12) : rawValue;
            userAnswers[name] = annualValue;
        });

        fetch(`${API_BASE_URL}/score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userAnswers)
        })
            .then(res => res.json())
            .then(results => {
                localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
                localStorage.setItem("cardResults", JSON.stringify(results));
                window.location.href = "../results.html";
            })
            .catch(err => {
                console.error("Error getting scored results:", err);
                alert("There was an issue generating your results. Please try again.");
            });
    }

    function showStep(step) {
        if (step >= totalSteps) {
            showResults();
            return;
        }

        // Toggle active fieldset
        fieldsets.forEach((fs, i) => {
            fs.classList.toggle("active", i === step);
            const oldNav = fs.querySelector(".quiz-nav");
            if (oldNav) oldNav.remove();
        });

        const currentFs = fieldsets[step];
        const radios = currentFs.querySelectorAll("input[type='radio']");

        // Auto-advance for radios
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                saveAnswer(step);
                localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
                const next = step + 1;
                if (next < totalSteps) {
                    setTimeout(() => {
                        currentStep = next;
                        showStep(currentStep);
                    }, 250);
                } else {
                    setTimeout(() => {
                        showResults();
                    }, 250);
                }
            });
        });

        // Checkbox questions: add Continue buttons with auto-"none"
        fieldsets.forEach((fs, i) => {
            const checkboxes = fs.querySelectorAll("input[type='checkbox']");
            if (checkboxes.length) {
                let continueBtn = fs.querySelector('.checkbox-continue');
                if (!continueBtn) {
                    continueBtn = document.createElement('button');
                    continueBtn.type = 'button';
                    continueBtn.className = 'btn-secondary checkbox-continue';
                    continueBtn.textContent = 'Continue';
                    continueBtn.style.marginTop = '1.5rem';
                    continueBtn.onclick = () => {
                        let anyChecked = fs.querySelectorAll("input[type='checkbox']:checked").length > 0;

                        if (!anyChecked) {
                            const noneBox = Array.from(checkboxes).find(
                                cb => cb.value.toLowerCase() === "none"
                            );
                            if (noneBox) {
                                noneBox.checked = true;
                                anyChecked = true;
                            }
                        }

                        if (!anyChecked) {
                            renderErrorBefore(continueBtn, 'Please select at least one option before continuing.');
                            return;
                        }

                        clearFieldsetError(fs);
                        saveAnswer(i);
                        localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));

                        if (i < totalSteps - 1) {
                            currentStep = i + 1;
                            showStep(currentStep);
                        } else {
                            showResults();
                        }
                    };
                    fs.appendChild(continueBtn);
                }

                if (!fs.dataset.checkboxValidation) {
                    checkboxes.forEach(cb => {
                        cb.addEventListener('change', () => {
                            if (fs.querySelector("input[type='checkbox']:checked")) {
                                clearFieldsetError(fs);
                            }
                        });
                    });
                    fs.dataset.checkboxValidation = 'true';
                }
            }
        });

        // Progress bar (no skips now)
        progressText.textContent = `Step ${step + 1} of ${totalSteps}`;
        progressBarFill.style.width = `${((step + 1) / totalSteps) * 100}%`;
    }

    // Add "See Results" button on the last step for safety
    const lastFieldset = fieldsets[fieldsets.length - 1];
    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "btn-secondary";
    submitBtn.textContent = "See Results";
    submitBtn.style.marginTop = "2rem";
    submitBtn.onclick = () => {
        saveAnswer(totalSteps - 1);
        localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
        showResults();
    };
    lastFieldset.appendChild(submitBtn);

    showStep(currentStep);
});
