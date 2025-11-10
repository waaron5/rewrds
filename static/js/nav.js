// Simplified precise dropdown behavior with travel corridor from trigger to panel
(function () {
    const dropdowns = document.querySelectorAll('nav ul li.dropdown');
    if (!dropdowns.length) return;

    const openDropdown = (dd) => {
        dropdowns.forEach(d => { if (d !== dd) d.classList.remove('dropdown-open'); });
        dd.classList.add('dropdown-open');
    };

    const closeDropdown = (dd) => dd.classList.remove('dropdown-open');

    const isPointInside = (el, x, y) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };

    // Corridor: a slim vertical strip from the bottom of the trigger to the top of the panel,
    // horizontally limited to just around the trigger (±12px) so users can move straight down.
    const isInCorridor = (trigger, panel, x, y) => {
        if (!trigger || !panel) return false;
        const t = trigger.getBoundingClientRect();
        const p = panel.getBoundingClientRect();

        const left = t.left - 12;
        const right = t.right + 12;

        // Determine vertical span between trigger bottom and panel top (handles overlap or tiny gaps)
        const top = Math.min(t.bottom, p.top);
        const bottom = Math.max(t.bottom, p.top);
        const corridorTop = Math.min(top, bottom);
        const corridorBottom = Math.max(top, bottom);

        return x >= left && x <= right && y >= corridorTop && y <= corridorBottom;
    };

    dropdowns.forEach(dd => {
        const trigger = dd.querySelector('.dropbtn');
        const panel = dd.querySelector('.dropdown-content');
        if (!trigger || !panel) return;

        // OPEN on hover/focus or tap
        trigger.addEventListener('pointerenter', () => openDropdown(dd));
        panel.addEventListener('pointerenter', () => openDropdown(dd));

        // Remove immediate close on pointerleave to allow corridor travel; closure handled globally below
        // dd.addEventListener('pointerleave', () => closeDropdown(dd));

        dd.addEventListener('focusin', () => openDropdown(dd));
        dd.addEventListener('focusout', (e) => {
            if (!dd.contains(e.relatedTarget)) closeDropdown(dd);
        });

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            dd.classList.toggle('dropdown-open');
            // Close others if opening this one
            if (dd.classList.contains('dropdown-open')) {
                dropdowns.forEach(d => { if (d !== dd) d.classList.remove('dropdown-open'); });
            }
        });
    });

    // Close as soon as the pointer is NOT over trigger or panel or the travel corridor
    document.addEventListener('pointermove', (e) => {
        const x = e.clientX, y = e.clientY;
        dropdowns.forEach(dd => {
            if (!dd.classList.contains('dropdown-open')) return;
            const trigger = dd.querySelector('.dropbtn');
            const panel = dd.querySelector('.dropdown-content');
            const overTrigger = isPointInside(trigger, x, y);
            const overPanel = isPointInside(panel, x, y);
            const inCorridor = isInCorridor(trigger, panel, x, y);
            if (!overTrigger && !overPanel && !inCorridor) closeDropdown(dd);
        });
    });

    // Outside click closes immediately
    document.addEventListener('click', (e) => {
        if (![...dropdowns].some(d => d.contains(e.target))) {
            dropdowns.forEach(d => closeDropdown(d));
        }
    });
})();