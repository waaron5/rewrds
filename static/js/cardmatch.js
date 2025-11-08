document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cardmatch-form");
    const fieldsets = Array.from(form.querySelectorAll("fieldset.q"));
    const progressText = document.getElementById("quiz-progress");
    const progressBarFill = document.querySelector(".progress-bar-fill");
    let currentStep = 0;
    const totalSteps = fieldsets.length;
    const userAnswers = {};

    function saveAnswer(step) {
        const fs = fieldsets[step];
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
        const text = fs.querySelector("input[type='text']");
        if (text) userAnswers[text.name] = text.value;

        const spend = fs.querySelector("input[name='monthlySpend']:checked");
        if (spend) userAnswers["monthlySpend"] = parseInt(spend.value);

        const strategy = fs.querySelector("input[name='cardStrategy']:checked");
        if (strategy) userAnswers["cardStrategy"] = strategy.value;

        // === Save slider inputs ===
        const sliders = fs.querySelectorAll("input[type='range']");
        if (sliders.length) {
            sliders.forEach(sl => {
                userAnswers[sl.name] = parseInt(sl.value);
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
        ['transit', 3000],
        ['online', 3000],
        ['rent', 4000],
        ['other', 3000],
        ['entertainment', 1000],   // newly added category
        ['utilities', 3000]        // newly added category
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
            // insert directly above the button within the same container to avoid DOMHierarchy errors
            container.insertBefore(err, targetEl);
        }
        // Ensure icon + text structure (use span for CSS mask coloring)
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
            // Use the button's own fieldset to avoid step index issues
            const fs = sliderContinue.closest('fieldset') || fieldsets[currentStep];
            // Validate: at least one slider in this fieldset has a value > 0
            const rows = fs ? fs.querySelectorAll('.slider-row') : document.querySelectorAll('.slider-row');
            const anyPositive = Array.from(rows).some(row => {
                const slider = row.querySelector('input[type="range"]');
                if (!slider) return false;
                const val = parseFloat(slider.value || '0');
                return val > 0;
            });
            if (!anyPositive) {
                renderErrorBefore(sliderContinue, 'Please enter a value in at least one category before continuing.');
                return; // block advance
            }
            if (fs) clearFieldsetError(fs);

            // Save all slider values (existing logic)
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
            currentStep++;
            showStep(currentStep);
        });
    }
    // Clear error when user interacts with sliders
    if (sliderContinue) {
        const sliders = document.querySelectorAll("input[type='range']");
        sliders.forEach(sl => {
            sl.addEventListener("input", () => {
                const fs = sl.closest('fieldset') || fieldsets[currentStep];
                clearFieldsetError(fs);
            });
        });
    }

    function showResults() {
        fetch(`${API_BASE_URL}/cards`)
            .then(res => res.json())
            .then(cards => {
                const scores = cardScoring.scoreCards(cards, userAnswers);
                localStorage.setItem("quizAnswers", JSON.stringify(userAnswers));
                localStorage.setItem("cardScores", JSON.stringify(scores));
                window.location.href = "../templates/results.html";
            });
    }

    function showStep(step) {
        fieldsets.forEach((fs, i) => {
            fs.classList.toggle("active", i === step);
            const oldNav = fs.querySelector(".quiz-nav");
            if (oldNav) oldNav.remove();
        });

        const currentFs = fieldsets[step];
        const radios = currentFs.querySelectorAll("input[type='radio']");
        const checkboxes = currentFs.querySelectorAll("input[type='checkbox']");

        // Auto-advance for radios only (but stop before the last question)
        radios.forEach(radio => {
            radio.addEventListener("change", () => {
                saveAnswer(step);
                if (step < totalSteps - 1) {
                    setTimeout(() => {
                        currentStep++;
                        showStep(currentStep);
                    }, 250);
                }
                // ❌ No auto showResults() here — handled by button
            });
        });

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
                        const anyChecked = fs.querySelectorAll("input[type='checkbox']:checked").length > 0;
                        if (!anyChecked) {
                            renderErrorBefore(continueBtn, 'Please select at least one option before continuing.');
                            return;
                        }
                        clearFieldsetError(fs);
                        saveAnswer(i);
                        if (i < totalSteps - 1) {
                            currentStep++;
                            showStep(currentStep);
                        } else {
                            showResults();
                        }
                    };
                    fs.appendChild(continueBtn);
                }
                // Add change listener once to clear errors when user checks something
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

        progressText.textContent = `Step ${step + 1} of ${totalSteps}`;
        progressBarFill.style.width = `${((step + 1) / totalSteps) * 100}%`;
    }

    // Add "See Results" button on the last step
    const lastFieldset = fieldsets[fieldsets.length - 1];
    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "btn-secondary";
    submitBtn.textContent = "See Results";
    submitBtn.style.marginTop = "2rem";
    submitBtn.onclick = () => {
        saveAnswer(totalSteps - 1);
        showResults();
    };
    lastFieldset.appendChild(submitBtn);

    showStep(currentStep);
});
