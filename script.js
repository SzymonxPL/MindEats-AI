'use strict';

/* ==================== MODERN GEOMETRIC ANIMATION ==================== */
function getThemeColors() {
    const isDark = document.body.classList.contains('dark');
    return isDark
        ? [
            'rgba(59, 130, 246, 0.15)',    // blue-500
            'rgba(99, 102, 241, 0.15)',    // indigo-500
            'rgba(124, 58, 237, 0.15)',    // violet-500
            'rgba(139, 92, 246, 0.15)'     // purple-500
        ]
        : [
            'rgba(59, 130, 246, 0.1)',     // blue-500 light
            'rgba(16, 185, 129, 0.1)',     // emerald-500 light
            'rgba(245, 158, 11, 0.1)',     // amber-500 light
            'rgba(236, 72, 153, 0.1)'      // pink-500 light
        ];
}

function updateAnimationColors() {
    const shapes = document.querySelectorAll('.shape');
    const colors = getThemeColors();

    shapes.forEach(shape => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        shape.style.background = randomColor;
        shape.style.boxShadow = `0 0 30px ${randomColor.replace('0.15', '0.3')}`;
    });
}

function initGeometricAnimation() {
    const container = document.createElement('div');
    container.className = 'geometric-bg';
    document.body.prepend(container);

    const shapes = [];
    const colors = getThemeColors();

    function createShape() {
        const shape = document.createElement('div');
        const size = Math.random() * 300 + 100; // 100px to 400px
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const rotation = Math.random() * 360;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 10 + 15; // 15s to 25s
        const delay = Math.random() * -20; // Stagger animations

        shape.className = 'shape';
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${posX}%`;
        shape.style.top = `${posY}%`;
        shape.style.background = color;
        shape.style.animationDuration = `${duration}s`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

        container.appendChild(shape);
        shapes.push(shape);

        // Remove some shapes if too many
        if (shapes.length > 15) {
            const oldShape = shapes.shift();
            if (oldShape && oldShape.parentNode) {
                oldShape.style.opacity = '0';
                setTimeout(() => oldShape.remove(), 1000);
            }
        }
    }

    // Create initial shapes
    for (let i = 0; i < 8; i++) {
        setTimeout(createShape, i * 1000);
    }

    // Add new shape periodically
    setInterval(createShape, 3000);

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            shapes.forEach(shape => shape.style.display = 'none');
            setTimeout(() => {
                shapes.forEach(shape => shape.style.display = '');
            }, 50);
        }, 250);
    });
}

// Start animation when the page loads
window.addEventListener('load', () => {
    initGeometricAnimation();

    // Update colors when theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateAnimationColors();
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
});

/* ==================== ELEMENTY DOM ==================== */
const sidebar = document.getElementById('sidebar'),
    overlay = document.getElementById('overlay');
const openBtn = document.getElementById('openSidebarBtn'),
    closeBtn = document.getElementById('closeSidebarBtn');
const navButtons = document.getElementsByClassName('nav-btn'),
    logoutBtn = document.getElementById('logoutBtn');
const pages = document.getElementsByClassName('page');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const analyzeBtn = document.getElementById('analyzeBtn'),
    resultEl = document.getElementById('result');
const saveProfileBtn = document.getElementById('saveProfileBtn'),
    editProfileBtn = document.getElementById('editProfileBtn');

/* ==================== GLOBALNE ZMIENNE ==================== */
let selectedTheme = localStorage.getItem('savedTheme') || 'light';
let selectedColor = localStorage.getItem('savedColor') || 'Pomarańczowy';

/* ==================== SIDEBAR ==================== */
function toggleSidebar(show) {
    const isOpen = show ?? !sidebar.classList.contains('active');
    document.body.classList.toggle('menu-open', isOpen);
    sidebar.classList.toggle('active', isOpen);
    overlay.classList.toggle('show', isOpen);
}

openBtn.addEventListener('click', e => { createRipple(e); toggleSidebar(true); });
closeBtn.addEventListener('click', () => toggleSidebar(false));
overlay.addEventListener('click', () => toggleSidebar(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && sidebar.classList.contains('active')) toggleSidebar(false); });

Array.from(navButtons).forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target)));
if (logoutBtn) logoutBtn.addEventListener('click', () => { localStorage.removeItem('profile'); alert('Wylogowano'); showPage('home'); });

/* Ripple effect */
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.getBoundingClientRect().left + radius)}px`;
    circle.style.top = `${event.clientY - (button.getBoundingClientRect().top + radius)}px`;
    circle.classList.add('ripple');
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
}

/* ==================== STRONY ==================== */
function showPage(id) {
    for (let p of pages) p.classList.remove('active');
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    sidebar.classList.remove('active'); overlay.classList.remove('show');
    if (id === 'profile') loadProfile();
    if (id === 'recipes') showRandomRecipes();
}

/* ==================== MOTYW ==================== */
toggleThemeBtn.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    selectedTheme = dark ? 'dark' : 'light';
    toggleThemeBtn.textContent = dark ? '☀️ Tryb jasny' : '🌙 Tryb ciemny';
    applyGradientByMode();
});

function selectColor(btn) {
    const btns = document.querySelectorAll('.color-btn');
    selectedColor = btn.getAttribute('data-tooltip');
    document.body.setAttribute('data-theme', selectedColor);
    applyGradientByMode();
}

function saveThemeSettings() {
    localStorage.setItem('savedTheme', selectedTheme);
    localStorage.setItem('savedColor', selectedColor);
}

function loadThemeSettings() {
    const savedTheme = localStorage.getItem('savedTheme');
    const savedColor = localStorage.getItem('savedColor');
    if (savedTheme) {
        document.body.classList.toggle('dark', savedTheme === 'dark');
        toggleThemeBtn.textContent = savedTheme === 'dark' ? '☀️ Tryb jasny' : '🌙 Tryb ciemny';
    }
    if (savedColor) {
        const colorBtn = document.querySelector(`.color-btn[data-tooltip="${savedColor}"]`);
        if (colorBtn) colorBtn.click();
    }
    applyGradientByMode();
}

function applyGradientByMode() {
    const isDark = document.body.classList.contains('dark');
    const btns = document.querySelectorAll('.color-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('data-tooltip') === selectedColor) {
            btn.classList.add('active');
            if (isDark && btn.dataset.dark) document.body.style.background = btn.dataset.dark;
            else if (!isDark && btn.dataset.light) document.body.style.background = btn.dataset.light;
        } else btn.classList.remove('active');
    });
    saveThemeSettings();
}

/* ==================== PROFIL ==================== */
function calculateBMI(weight, height) {
    if (!weight || !height) return "";
    const bmi = (weight / ((height / 100) * (height / 100)));
    const rounded = (Math.round(bmi * 10) / 10).toFixed(1);
    const category = bmi < 18.5 ? "niedowaga" : bmi < 25 ? "prawidłowa" : bmi < 30 ? "nadwaga" : "otyłość";
    return `${rounded} (${category})`;
}

// Mifflin - St Jeor BMR
function calculateBMR(gender, weight, height, age) {
    weight = Number(weight);
    height = Number(height);
    age = Number(age);
    if (!weight || !height || !age) return 0;
    const g = String(gender || '').toLowerCase();
    if (g.includes('m')) {
        // Mężczyzna
        return Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5);
    } else {
        // Kobieta (domyślnie)
        return Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161);
    }
}

function calculateCPM(bmr, pal) {
    bmr = Number(bmr) || 0;
    pal = Number(pal) || 0;
    if (!bmr || !pal) return 0;
    return Math.round(bmr * pal);
}

function palLabel(pal) {
    // Przyjmuje wartość number lub string
    const p = Number(pal);
    switch (p) {
        case 1.2: return 'Siedzący tryb życia (1.2)';
        case 1.375: return 'Niska aktywność (1.375)';
        case 1.55: return 'Umiarkowana aktywność (1.55)';
        case 1.725: return 'Wysoka aktywność (1.725)';
        case 1.9: return 'Bardzo wysoka aktywność (1.9)';
        default: return p ? `PAL: ${p}` : '-';
    }
}

function setProfileAvatar(gender) {
    const avatar = document.querySelector('.profile-avatar');
    if (!avatar) return;
    const maleImg = 'male.png', femaleImg = 'female.png', neutralImg = 'neutral.png';
    let img = neutralImg;
    if (gender) {
        const g = String(gender).toLowerCase();
        if (g.includes('m')) img = maleImg;
        else if (g.includes('k')) img = femaleImg;
    }
    avatar.style.backgroundImage = `url("${img}")`;
    avatar.style.backgroundSize = 'cover';
    avatar.style.backgroundPosition = 'center';
    avatar.style.backgroundRepeat = 'no-repeat';
}

function loadProfile() {
    const data = localStorage.getItem('profile');
    const view = document.getElementById('profileView');
    const edit = document.getElementById('profileEdit');

    // Hide/Show logic
    if (!view || !edit) return;

    if (data) {
        const p = JSON.parse(data);

        // Display view fields
        document.getElementById('profileName').innerText = p.name || '';
        document.getElementById('profileGender').innerText = p.gender || '-';
        document.getElementById('profileAge').innerText = p.age || '-';
        document.getElementById('profileHeight').innerText = p.height || '-';
        document.getElementById('profileWeight').innerText = p.weight || '-';
        document.getElementById('profileBMI').innerText = calculateBMI(Number(p.weight), Number(p.height));
        document.getElementById('profileAllergies').innerText = p.allergies || 'Brak';

        // BMR / CPM: jeśli zapisane w profilu – użyj; jeśli nie, oblicz dynamicznie
        const bmr = p.bmr || calculateBMR(p.gender, p.weight, p.height, p.age) || 0;
        const pal = p.activity || (p.activity === 0 ? 0 : undefined);
        const palLabelText = p.activityLabel || (pal ? palLabel(pal) : '-');
        const cpm = p.cpm || calculateCPM(bmr, pal || 0) || 0;

        const bmrEl = document.getElementById('profileBMR');
        const actEl = document.getElementById('profileActivity');
        const cpmEl = document.getElementById('profileCPM');

        if (bmrEl) bmrEl.innerText = bmr ? `${bmr} kcal` : '-';
        if (actEl) actEl.innerText = palLabelText || '-';
        if (cpmEl) cpmEl.innerText = cpm ? `${cpm} kcal` : '-';

        setProfileAvatar(p.gender);
        view.style.display = 'block';
        edit.style.display = 'none';
    } else {
        // No profile -> show edit form
        setProfileAvatar('');
        view.style.display = 'none';
        edit.style.display = 'block';
    }
}

saveProfileBtn?.addEventListener('click', () => {
    const name = document.getElementById('edit-name').value.trim();
    if (!name) { alert('Podaj swoje imię!'); return; }

    const gender = document.getElementById('edit-gender').value;
    const age = Number(document.getElementById('edit-age').value) || '';
    const height = Number(document.getElementById('edit-height').value) || '';
    const weight = Number(document.getElementById('edit-weight').value) || '';
    const allergies = document.getElementById('edit-allergies').value.trim();

    // Attempt to read activity (may not exist if HTML wasn't updated)
    const activityEl = document.getElementById('edit-activity');
    const activityVal = activityEl ? parseFloat(activityEl.value) : null;
    const activityLabelText = activityEl ? palLabel(activityVal) : undefined;

    // Build profile object and compute BMR/CPM
    const profile = {
        name,
        gender,
        age,
        height,
        weight,
        allergies
    };

    // Calculate BMR & CPM if we have enough data
    const bmr = calculateBMR(gender, weight, height, age) || 0;
    profile.bmr = bmr;

    if (activityVal) {
        profile.activity = activityVal;
        profile.activityLabel = activityLabelText;
        profile.cpm = calculateCPM(bmr, activityVal);
    } else {
        profile.activity = profile.activity || undefined;
        // don't overwrite existing cpm/activityLabel if activity not provided
        profile.cpm = profile.cpm || (profile.activity ? calculateCPM(bmr, profile.activity) : undefined);
    }

    localStorage.setItem('profile', JSON.stringify(profile));
    alert('Profil zapisany!');
    setProfileAvatar(profile.gender);
    loadProfile();
    showPage('profile');
});

editProfileBtn?.addEventListener('click', () => {
    const data = localStorage.getItem('profile');
    const edit = document.getElementById('profileEdit');
    const view = document.getElementById('profileView');
    if (!edit || !view) return;

    // Populate edit form from stored profile if present
    if (data) {
        const p = JSON.parse(data);
        document.getElementById('edit-name').value = p.name || '';
        document.getElementById('edit-gender').value = p.gender || '';
        document.getElementById('edit-age').value = p.age || '';
        document.getElementById('edit-height').value = p.height || '';
        document.getElementById('edit-weight').value = p.weight || '';
        document.getElementById('edit-allergies').value = p.allergies || '';

        // Set activity select if exists
        const activityEl = document.getElementById('edit-activity');
        if (activityEl && p.activity) {
            activityEl.value = p.activity;
        }
    }
    view.style.display = 'none';
    edit.style.display = 'block';
});

const editGenderSelect = document.getElementById('edit-gender');
if (editGenderSelect) {
    editGenderSelect.addEventListener('change', e => { setProfileAvatar(e.target.value); });
}

/* ==================== AI ==================== */
const WORKER_URL = 'https://projekt.kcos8110.workers.dev/';
async function sendMessage(prompt, outputEl) {
    if (!prompt) return;
    outputEl.style.display = 'block';
    outputEl.innerHTML = '<em>Ładowanie... 🤖</em>';
    try {
        const res = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'tngtech/deepseek-r1t2-chimera:free',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 3000,
                temperature: 0.5
            })
        });
        if (!res.ok) {
            const text = await res.text();
            outputEl.innerHTML = `<strong>Błąd serwera: ${res.status}</strong><br>${text}`;
            return;
        }
        const data = await res.json();
        let content = data.choices?.[0]?.message?.content || "Brak odpowiedzi";
        content = content.replace(/^### (.*)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.*)$/gm, '<li>$1</li>')
            .replace(/\n{2,}/g, '<br><br>');
        if (/<li>/.test(content)) content = '<ul>' + content + '</ul>';
        outputEl.innerHTML = content;
    } catch (err) {
        outputEl.innerHTML = `<strong>Błąd:</strong> ${err.message}`;
        console.error(err);
    }
}

/* -------------------
   ANALIZA (ANALYZE)
   ------------------- */
analyzeBtn?.addEventListener('click', () => {
    const mood = document.getElementById('mood').value.trim();
    const meals = document.getElementById('meals').value.trim();
    const extra = document.getElementById('extra').value.trim();
    if (!mood || !meals) { alert('Wypełnij wymagane pola'); return; }

    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const name = profile.name || "Użytkownik";
    const age = profile.age || "-";
    const gender = profile.gender || "-";
    const height = profile.height || "-";
    const weight = profile.weight || "-";
    const allergies = profile.allergies || "-";
    const bmi = calculateBMI(Number(profile.weight), Number(profile.height)) || "-";
    const bmr = profile.bmr || calculateBMR(gender, weight, height, age) || "-";
    const cpm = profile.cpm || (profile.activity ? calculateCPM(bmr, profile.activity) : "-");

    // Pobierz aktualne nawodnienie i cel
    const todayWater = typeof waterAmount !== 'undefined' ? waterAmount : (parseInt(localStorage.getItem('waterAmount')) || 0);
    const waterGoal = typeof dailyGoal !== 'undefined' ? dailyGoal : (parseInt(localStorage.getItem('dailyGoal')) || 2000);

    // Opcjonalnie — drobne lokalne powiadomienie przed wysłaniem (nie zastępuje analizy AI)
    if (todayWater < 1000) {
        resultEl.style.display = 'block';
        resultEl.innerHTML = `<p style="color:#b91c1c; font-weight:600;">⚠️ Twoje nawodnienie jest niskie (${todayWater} ml). Analiza AI uwzględni ten fakt.</p>`;
    }

    const prompt = `
Jesteś ekspertem ds. zdrowia, dietetyki i regeneracji. Oceń na podstawie danych poniżej mój dzisiejszy stan fizyczny i psychiczny. Podaj też ilość kalorii.

=== PROFIL UŻYTKOWNIKA ===
- Imię: ${name}
- Wiek: ${age}
- Płeć: ${gender}
- Wzrost: ${height} cm
- Waga: ${weight} kg
- BMI: ${bmi}
- BMR: ${bmr} kcal
- CPM (oszacowanie): ${cpm} kcal
- Alergie/choroby: ${allergies}

=== DANE DZISIEJSZE ===
- Samopoczucie: ${mood}
- Zjedzone posiłki: ${meals}
- Dzisiejsze nawodnienie: ${todayWater} ml (cel dzienny: ${waterGoal} ml)
${extra ? "- Dodatkowe informacje: " + extra : ""}

=== ZADANIE ANALITYCZNE ===
Przeprowadź krótką, zwięzłą analizę. Uwzględnij wyraźnie:
1) Krótką ocenę samopoczucia i możliwych przyczyn.
2) Analizę jakości diety (plus / minus).
3) **Analizę nawodnienia**: ocena (wystarczające / niewystarczające / nadmierne), potencjalne konsekwencje i konkretne rekomendacje (ile dodatkowo pić dziś, co pić, kiedy).
4) Praktyczne rekomendacje na poprawę energii, snu i regeneracji (konkretne działania).`;

    sendMessage(prompt, resultEl);
});

/* ==================== NAWODNIENIE ==================== */
const waterEl = document.getElementById('waterAmount');
const waterProgressEl = document.getElementById('waterProgress');
const dailyGoalInput = document.getElementById('dailyGoal');
const waterBtns = document.querySelectorAll('.water-btn');
const resetWaterBtn = document.getElementById('resetWater');
const saveWaterBtn = document.getElementById('saveWater');

// Initialize water tracking variables
let waterAmount = parseInt(localStorage.getItem('waterAmount')) || 0;
let dailyGoal = parseInt(localStorage.getItem('dailyGoal')) || 2000;
let waterHistory = JSON.parse(localStorage.getItem('waterHistory')) || {};

// Set initial values in the UI
if (dailyGoalInput) {
    dailyGoalInput.value = dailyGoal;
}

// Update display on page load
if (waterEl && waterProgressEl) {
    updateWaterDisplay();
}

function updateWaterDisplay() {
    if (waterEl) waterEl.innerText = waterAmount;
    let percent = Math.min(100, Math.round((waterAmount / dailyGoal) * 100));
    if (waterProgressEl) waterProgressEl.innerText = percent + '%';

    // Update progress bar if it exists
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
}

// Save water intake to history
function saveWaterIntake() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    if (!waterHistory[today]) {
        waterHistory[today] = {
            total: 0,
            entries: []
        };
    }

    // Add entry with timestamp
    const entry = {
        amount: waterAmount,
        time: new Date().toLocaleTimeString(),
        timestamp: new Date().toISOString()
    };

    // Add to today's entries
    waterHistory[today].entries.push(entry);

    // Update today's total
    waterHistory[today].total = waterHistory[today].entries.reduce((sum, entry) => sum + entry.amount, 0);

    // Save to localStorage
    localStorage.setItem('waterHistory', JSON.stringify(waterHistory));

    // Show success message with the amount that was saved
    const savedAmount = waterAmount;

    // Reset the counter after saving
    waterAmount = 0;
    localStorage.setItem('waterAmount', waterAmount);
    updateWaterDisplay();

    // Show success message with the correct amount
    alert(`Zapisano ${savedAmount}ml wody do dzisiejszego bilansu!`);
}

// Display water history for a specific date
function displayWaterHistory(date) {
    const waterHistoryEl = document.getElementById('waterHistory');
    const history = waterHistory[date];

    if (!history || history.entries.length === 0) {
        if (waterHistoryEl) waterHistoryEl.innerHTML = '<p>Brak danych o piciu wody w tym dniu.</p>';
        return;
    }

    let html = `
        <div class="water-history">
            <p><strong>Łącznie wypito:</strong> ${history.total} ml</p>
            <h5>Szczegóły:</h5>
            <ul class="water-entries">
    `;

    history.entries.forEach(entry => {
        const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        html += `<li>${time} - ${entry.amount} ml</li>`;
    });

    html += `
            </ul>
        </div>
    `;

    if (waterHistoryEl) waterHistoryEl.innerHTML = html;
}

waterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const amt = parseInt(btn.dataset.amount);
        waterAmount = Math.max(0, waterAmount + amt);
        localStorage.setItem('waterAmount', waterAmount);
        updateWaterDisplay();
    });
});

// Save water button click handler
saveWaterBtn?.addEventListener('click', () => {
    if (waterAmount > 0) {
        saveWaterIntake();
    } else {
        alert('Dodaj wodę przed zapisaniem!');
    }
});

// Reset water button click handler
resetWaterBtn?.addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz zresetować licznik wody?')) {
        waterAmount = 0;
        localStorage.setItem('waterAmount', waterAmount);
        updateWaterDisplay();
    }
});

dailyGoalInput?.addEventListener('change', () => {
    dailyGoal = parseInt(dailyGoalInput.value) || 2000;
    localStorage.setItem('dailyGoal', dailyGoal);
    updateWaterDisplay();
});

/* ==================== KALENDARZ ==================== */
// Calendar functionality
let currentDate = new Date();
let selectedDate = null;

function updateCalendar() {
    const calendarTitle = document.getElementById('calendarTitle');
    const calendarContainer = document.getElementById('calendarContainer');

    if (!calendarTitle || !calendarContainer) return;

    // Set month and year in the title
    const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    calendarTitle.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Clear previous calendar
    calendarContainer.innerHTML = '';

    // Create day headers
    const dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarContainer.appendChild(dayHeader);
    });

    // Get first day of month and total days in month
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Add empty cells for days before the first day of the month
    for (let i = 1; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarContainer.appendChild(emptyCell);
    }

    // Add days of the month
    const today = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        const dayElement = document.createElement('button');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Highlight today
        if (dateString === today) {
            dayElement.classList.add('today');
        }

        // Add water indicator if there's data for this day
        if (waterHistory[dateString] && waterHistory[dateString].total > 0) {
            const waterIndicator = document.createElement('div');
            waterIndicator.className = 'water-indicator';
            waterIndicator.title = `Wypito ${waterHistory[dateString].total}ml wody`;
            dayElement.appendChild(waterIndicator);
        }

        // Add click handler
        dayElement.addEventListener('click', () => selectDate(date));

        calendarContainer.appendChild(dayElement);
    }
}

function selectDate(date) {
    selectedDate = date;
    const dateString = date.toISOString().split('T')[0];
    const detailsEl = document.getElementById('calendarDayDetails');
    const titleEl = document.getElementById('selectedDateTitle');

    if (!detailsEl || !titleEl) return;

    // Update title with selected date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    titleEl.textContent = date.toLocaleDateString('pl-PL', options);

    // Display water history for selected date
    displayWaterHistory(dateString);

    // Show details section
    detailsEl.style.display = 'block';
}

// Initialize calendar navigation
function initCalendar() {
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');

    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
    }

    // Initial calendar render
    updateCalendar();
}

/* ==================== INICJALIZACJA ==================== */
function initializeApp() {
    loadThemeSettings();
    initCalendar();

    // Check if it's the first visit
    if (!localStorage.getItem('hasVisited')) {
        localStorage.setItem('hasVisited', 'true');
        window.location.href = 'intro.html';
        return;
    }

    // Load profile if exists
    const profileExists = localStorage.getItem('profile');
    if (!profileExists) {
        showPage('profile');
        const profileView = document.getElementById('profileView');
        const profileEdit = document.getElementById('profileEdit');
        if (profileView && profileEdit) {
            profileView.style.display = 'none';
            profileEdit.style.display = 'block';
        }
        setProfileAvatar('');
    } else {
        showPage('home');
        const p = JSON.parse(profileExists);
        setProfileAvatar(p.gender);
    }

    // Initialize water tracking
    updateWaterDisplay();

    // Load recipe of the day
    loadRecipeOfTheDay();
}

// Initialize the particle network when the page loads
function initParticleNetwork() {
    // Remove existing particle network if it exists
    const existing = document.querySelector('.particle-network');
    if (existing) {
        existing.remove();
    }

    const container = document.createElement('div');
    container.className = 'particle-network';
    document.body.prepend(container);

    // Start the particle network
    return new ParticleNetwork(container);
}

// Store particle network instance
let particleNetworkInstance = null;

// Initialize everything when the page loads
function initializeAll() {
    // Initialize particle network
    particleNetworkInstance = initParticleNetwork();

    // Initialize the app
    initializeApp();
}

// Add event listener for page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (particleNetworkInstance && typeof particleNetworkInstance.destroy === 'function') {
        particleNetworkInstance.destroy();
    }
});
/* ==================== PRZEPISY (6 propozycji: 2 śniadania, 2 obiady, 2 kolacje) ==================== */
/* ==================== PRZEPISY (6 propozycji: 2 śniadania, 2 obiady, 2 kolacje) ==================== */
const recipes = [
    {
        id: 'b1',
        title: "Owsianka proteinowa z orzechami i jabłkiem",
        type: "breakfast",
        category: "highProtein",  // ⭐ wysoka zawartość białka dla osób z niedowagą / wysoką aktywnością
        desc: "Syte śniadanie z dużą ilością białka i błonnika.",
        kcal: "380 kcal",
        time: "10 minut",
        ingredients: [
            "60 g płatków owsianych",
            "200 ml mleka (lub napój roślinny)",
            "1 miarka białka serwatkowego lub roślinnego (~25 g białka)",
            "1 małe jabłko – pokrojone",
            "15 g orzechów włoskich (źródło tłuszczu)",
            "cynamon do smaku"
        ],
        steps: "Gotuj płatki na mleku przez ~5 min, dodaj białko po zdjęciu z ognia, wymieszaj z jabłkiem i orzechami. Posyp cynamonem.",
        plateRule: "Połowa porcji: dodatkowe białko (białko w proszku + mleko), 1/4 węglowodany: płatki i jabłko, 1/4 tłuszcze: orzechy.",
        note: "Dobre na dłuższe uczucie sytości."
    },
    {
        id: 'b2',
        title: "Jajecznica z awokado i pomidorem",
        type: "breakfast",
        category: "highProtein", // ⭐ również wysoka zawartość białka
        desc: "Szybkie śniadanie o wysokiej zawartości białka i zdrowych tłuszczów.",
        kcal: "420 kcal",
        time: "8 minut",
        ingredients: [
            "3 jajka (lub 2 całe + 1 białko)",
            "1/2 awokado (źródło tłuszczu)",
            "1 pomidor",
            "1 kromka pełnoziarnistego chleba",
            "Sól, pieprz, zioła"
        ],
        steps: "Usmaż jajecznicę, pokrój awokado i pomidora, podaj z kromką chleba. Awokado dostarcza zdrowych tłuszczów; chleb – węglowodany.",
        plateRule: "Połowa: jajka (białko), 1/4: kromka pełnoziarnista (węglowodany), 1/4: awokado (tłuszcze).",
        note: "Idealne dla osób, które potrzebują szybkiego, sycącego śniadania."
    },
    {
        id: 'l1',
        title: "Kurczak pieczony z komosą i warzywami",
        type: "lunch",
        category: "balanced", // ⚖️ dla osób ze zdrową wagą
        desc: "Zbilansowany obiad z chudym białkiem i złożonymi węglowodanami.",
        kcal: "560 kcal",
        time: "35 minut",
        ingredients: [
            "150 g piersi z kurczaka",
            "60 g suchej komosy ryżowej (quinoa)",
            "mix warzyw (brokuł, marchew, papryka) ~200 g",
            "1 łyżka oliwy z oliwek (do warzyw)",
            "Przyprawy: sól, pieprz, papryka"
        ],
        steps: "Piecz kurczaka 20–25 min w 180°C (przyprawiony). Ugotuj komosę zgodnie z opakowaniem. Podsmaż lub blanszuj warzywa, dodaj oliwę i przyprawy. Podawaj wszystko razem.",
        plateRule: "Połowa talerza: warzywa (dużo objętości), połowa białko: kurczak, 1/4 węglowodany: komosa, 1/4 tłuszcze: łyżka oliwy/oliwki.",
        note: "Świetne dla regeneracji po treningu."
    },
    {
        id: 'l2',
        title: "Łosoś z puree z batatów i sałatką",
        type: "lunch",
        category: "highProtein", // ⭐ wysokokaloryczne dla osób o dużej aktywności
        desc: "Tłuste ryby (omega-3) + złożone węglowodany.",
        kcal: "600 kcal",
        time: "30 minut",
        ingredients: [
            "150 g filetu z łososia",
            "200 g batatów",
            "Garść rukoli i liści sałaty",
            "1 łyżka oliwy/masła klarowanego",
            "Cytryna, sól, pieprz"
        ],
        steps: "Ugotuj bataty i zrób puree z odrobiną oliwy. Usmaż łososia krótko na patelni (skórą do dołu). Podaj z sałatką z rukoli skropioną cytryną.",
        plateRule: "Połowa: łosoś (białko + część tłuszczu), 1/4: bataty (węglowodany), 1/4: oliwa i tłuszcz z ryby (tłuszcze).",
        note: "Bardzo dobre źródło kwasów omega-3."
    },
    {
        id: 'd1',
        title: "Sałatka z tuńczykiem i jajkiem",
        type: "dinner",
        category: "light", // 🌿 lekka kolacja dla osób z nadwagą i niską aktywnością
        desc: "Lekka kolacja bogata w białko, niska w węglowodany.",
        kcal: "360 kcal",
        time: "12 minut",
        ingredients: [
            "1 puszka tuńczyka w wodzie (~120 g odsączony)",
            "2 jajka ugotowane na twardo",
            "Mix sałat, ogórek, pomidorki",
            "1 łyżka oliwy z oliwek",
            "Sól, pieprz, sok z cytryny"
        ],
        steps: "Połącz sałaty i warzywa, dodaj rozdrobnionego tuńczyka i pokrojone jajka. Skrop oliwą i sokiem z cytryny.",
        plateRule: "Połowa talerza: sałatka & warzywa (objętość), połowa białko: tuńczyk + jajka, 1/4 tłuszcze: oliwa, 1/4 węglowodany: niewielka porcja (opcjonalnie kromka chleba).",
        note: "Lekka kolacja sprzyjająca trawieniu przed snem."
    },
    {
        id: 'd2',
        title: "Pełnoziarnista tortilla z indykiem i guacamole",
        type: "dinner",
        category: "balanced", // ⚖️ posiłek uniwersalny
        desc: "Kolacja zbalansowana: chude białko + zdrowe tłuszcze.",
        kcal: "450 kcal",
        time: "15 minut",
        ingredients: [
            "1 pełnoziarnista tortilla",
            "100 g pieczonego indyka lub cienko krojonej piersi z kurczaka",
            "1/2 awokado (guacamole)",
            "Sałata, ogórek, papryka",
            "Sos jogurtowy (opcjonalnie)"
        ],
        steps: "Rozgrzej tortillę, ułóż indyka, warzywa i guacamole. Zwiń i podawaj. Guacamole to źródło zdrowych tłuszczów.",
        plateRule: "Połowa białko: indyk, 1/4 węglowodany: tortilla pełnoziarnista, 1/4 tłuszcze: awokado/guacamole.",
        note: "Dobre rozwiązanie do zabrania na wynos."
    }, {
        id: 'l3',
        title: "Krem z brokuła z pestkami dyni",
        type: "lunch",
        category: "light",
        desc: "Lekki krem z brokuła z dodatkiem zdrowych tłuszczów.",
        kcal: "210 kcal",
        time: "15 minut",
        ingredients: [
            "250 g brokuła",
            "1 szklanka bulionu warzywnego",
            "1 łyżka pestek dyni",
            "1 łyżka jogurtu naturalnego",
            "Sól, pieprz, czosnek"
        ],
        steps: "Ugotuj brokuła w bulionie, zmiksuj na gładki krem. Dodaj jogurt, przyprawy oraz uprażone pestki dyni.",
        plateRule: "Warzywa to większość talerza, jogurt to białko, pestki dyni to zdrowe tłuszcze.",
        note: "Idealne na redukcję."
    },
    {
        id: 'l4',
        title: "Zupa pomidorowa fit z ryżem brązowym",
        type: "lunch",
        category: "light",
        desc: "Lekkostrawna pomidorowa z niewielką porcją ryżu.",
        kcal: "280 kcal",
        time: "25 minut",
        ingredients: [
            "1 szklanka przecieru pomidorowego",
            "300 ml bulionu warzywnego",
            "30 g ryżu brązowego",
            "Bazylia, oregano, sól",
            "Łyżeczka oliwy"
        ],
        steps: "Ugotuj ryż, dodaj do zupy na koniec wraz z przyprawami, skrop oliwą.",
        plateRule: "Warzywa dominują, ryż to węglowodany, oliwa to tłuszcz.",
        note: "Dobra na kolację i obiad."
    },
    {
        id: 'd3',
        title: "Chłodnik ogórkowy z jajkiem",
        type: "dinner",
        category: "light",
        desc: "Orzeźwiający, niskokaloryczny posiłek kolacyjny.",
        kcal: "190 kcal",
        time: "10 minut",
        ingredients: [
            "1 ogórek",
            "200 g kefiru lub maślanki",
            "1 jajko ugotowane na twardo",
            "Koperek, sól, pieprz",
            "Łyżeczka soku z cytryny"
        ],
        steps: "Zetrzyj ogórka, wymieszaj z kefirem i przyprawami. Podaj z jajkiem.",
        plateRule: "Warzywa dominujące, kefir + jajko dostarcza białka.",
        note: "Bardzo lekkostrawne na noc."
    },
    {
        id: 'd4',
        title: "Sałatka z tofu i mango",
        type: "dinner",
        category: "light",
        desc: "Kolacja roślinna z przewagą warzyw i lekkim dressingiem.",
        kcal: "250 kcal",
        time: "12 minut",
        ingredients: [
            "80 g tofu",
            "1/2 mango",
            "Mix sałat",
            "1 łyżeczka sezamu",
            "Sól, cytryna, pieprz"
        ],
        steps: "Pokrój tofu i mango, wymieszaj z sałatą. Posyp sezamem i dopraw cytryną.",
        plateRule: "Warzywa + lekkie białko + minimalny tłuszcz.",
        note: "Roślinne i lekkostrawne."
    },
    {
        id: 'b3',
        title: "Jogurt naturalny z owocami i miodem",
        type: "breakfast",
        category: "light",
        desc: "Proste śniadanie redukcyjne.",
        kcal: "240 kcal",
        time: "4 minuty",
        ingredients: [
            "150 g jogurtu naturalnego",
            "Garść borówek lub jabłko",
            "Łyżeczka miodu",
            "Łyżka płatków migdałowych"
        ],
        steps: "Wymieszaj składniki, posyp migdałami.",
        plateRule: "Jogurt to białko, owoce to węglowodany, migdały dodają tłuszczu.",
        note: "Dobre na słodkie zachcianki."
    }

];

/* ==================== RENDEROWANIE I OBSŁUGA STRONY PRZEPISÓW ==================== */

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card card';
    card.innerHTML = `
  <h3 style="margin-top:0">${recipe.title} ${getCategoryIcon(recipe.category)}</h3>
  <p class="muted">${recipe.desc}</p>
  <p><strong>Kalorie:</strong> ${recipe.kcal} • <strong>Czas:</strong> ${recipe.time}</p>
  <p style="font-size:13px;color:var(--text-muted)"><em>${recipe.plateRule}</em></p>
  <button class="primary open-recipe" data-id="${recipe.id}" style="margin-top:10px;">Zobacz przepis</button>
`;

    return card;
}
function getCategoryIcon(category) {
    switch (category) {
        case "light": return "🌿";
        case "highProtein": return "🥩";
        case "balanced": return "⚖️";
        default: return "";
    }
}

function renderRecipes(filterType = 'all') {
    const container = document.getElementById('recipesContainer');
    if (!container) return;
    container.innerHTML = '';
    const list = (filterType === 'all') ? recipes : recipes.filter(r => r.type === filterType);
    list.forEach(r => container.appendChild(createRecipeCard(r)));
    // podczep przyciski
    container.querySelectorAll('.open-recipe').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const recipe = recipes.find(x => x.id === id);
            if (recipe) openRecipeModalDetailed(recipe);
        });
    });
}

function openRecipeModalDetailed(recipe) {
    // usuń ewentualne stare modal
    const existing = document.querySelector('.recipe-detail-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal recipe-detail-modal';
    modal.style.display = 'flex';

    // Pobierz aktualny motyw
    const isDarkMode = document.body.classList.contains('dark-theme');
    const bgColor = isDarkMode ? '#2d3748' : '#f0f0f0';
    const hoverColor = isDarkMode ? '#4a5568' : '#e0e0e0';
    const textColor = isDarkMode ? '#e2e8f0' : '#1a202c';
    const borderColor = isDarkMode ? '#4a5568' : '#cbd5e0';

    modal.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-${recipe.id}" style="width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; background: var(--card-bg); border-radius: 12px; padding: 20px; position: relative;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 15px;">
        <button class="close-btn" aria-label="Zamknij" style="background: ${bgColor}; color: ${textColor}; border: 1px solid ${borderColor}; padding: 5px 12px; font-size: 16px; cursor: pointer; transition: all 0.2s; border-radius: 4px;" onmouseover="this.style.background='${hoverColor}'" onmouseout="this.style.background='${bgColor}'">Zamknij</button>
      </div>
      <div style="padding: 0 10px;">
        <h2 id="modal-${recipe.id}" style="margin-top: 0;">${recipe.title}</h2>
      <p class="muted">${recipe.desc}</p>
      <div class="recipe-info" style="margin:10px 0;">
        <p><strong>Kalorie:</strong> ${recipe.kcal}</p>
        <p><strong>Czas przygotowania:</strong> ${recipe.time}</p>
      </div>
      <h3>Składniki</h3>
      <ul>
        ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
      </ul>
      <h3>Sposób przygotowania</h3>
      <p style="white-space:pre-line;">${recipe.steps}</p>
      <h4>Dlaczego to zgodne z prawem talerza?</h4>
      <p class="muted" style="font-size:14px;">${recipe.plateRule}</p>
      <div style="display:flex;gap:8px;margin-top:16px;">
        ${recipe.youtube ? `<button class="primary" onclick="window.open('${recipe.youtube}', '_blank')">▶️ Film</button>` : ''}
      </div>
    </div>
  `;
    document.body.appendChild(modal);

    // Obsługa zamykania
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = () => modal.remove();

    // Zamykanie po kliknięciu poza zawartością
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // focus na przycisku zamknięcia dla dostępności
    closeBtn.focus();
}

function initRecipesPage() {
    // filtry
    document.getElementById('filterBreakfast')?.addEventListener('click', () => renderRecipes('breakfast'));
    document.getElementById('filterLunch')?.addEventListener('click', () => renderRecipes('lunch'));
    document.getElementById('filterDinner')?.addEventListener('click', () => renderRecipes('dinner'));
    document.getElementById('filterAll')?.addEventListener('click', () => renderRecipes('all'));

    // render all by default
    renderRecipes('all');
}

// ensure page shows recipes when menu clicked
function showPage(id) {
    for (let p of pages) p.classList.remove('active');
    document.getElementById(id).classList.add('active');
    sidebar.classList.remove('active'); overlay.classList.remove('show');
    if (id === 'profile') loadProfile();
    if (id === 'recipes') initRecipesPage(); // <-- now initujemy stronę przepisów
}

/* ==================== PRZEPIS DNIA ==================== */

// Tablica przepisów dla przepisu dnia
const recipes1 = [
    {
        title: "Sałatka z kurczakiem i awokado",
        desc: "Lekka i pożywna sałatka bogata w białko i zdrowe tłuszcze",
        kcal: "450 kcal",
        time: "20 min",
        difficulty: "Łatwy",
        ingredients: [
            "1 pierś z kurczaka",
            "1 dojrzałe awokado",
            "Mix sałat",
            "10 pomidorków koktajlowych",
            "2 łyżki oliwy z oliwek",
            "Sok z cytryny",
            "Sól i pieprz do smaku"
        ],
        steps: "1. Kurczaka pokrój w paski i przypraw solą i pieprzem. 2. Usmaż na patelni na złoty kolor. 3. Awokado obierz i pokrój w kostkę. 4. Pomidorki przekrój na pół. 5. Wymieszaj sałatę z pozostałymi składnikami. 6. Skrop sokiem z cytryny i oliwą. Smacznego!",
        youtube: "https://youtu.be/XJiUJNEa5RU"
    },
    {
        title: "Owsianka z owocami i orzechami",
        desc: "Pożywne śniadanie bogate w błonnik i zdrowe tłuszcze",
        kcal: "380 kcal",
        time: "10 min",
        difficulty: "Bardzo łatwy",
        ingredients: [
            "5 łyżek płatków owsianych",
            "1 banan",
            "Garść jagód",
            "1 łyżka orzechów włoskich",
            "1 łyżeczka miodu",
            "Szczypta cynamonu"
        ],
        steps: "1. Płatki zalej wrzątkiem lub mlekiem i odstaw na 5 minut. 2. Banana pokrój w plasterki. 3. Ugotowane płatki przełóż do miski, dodaj owoce i orzechy. 4. Polej miodem i posyp cynamonem.",
        youtube: "https://youtu.be/XJiUJNEa5RU"
    },
    {
        title: "Makaron pełnoziarnisty z warzywami",
        desc: "Szybki i zdrowy obiad bogaty w błonnik",
        kcal: "520 kcal",
        time: "25 min",
        difficulty: "Średni",
        ingredients: [
            "100g makaronu pełnoziarnistego",
            "1 cukinia",
            "1 papryka",
            "Puszka pomidorów krojonych",
            "2 ząbki czosnku",
            "Oliwa z oliwek",
            "Przyprawy: bazylia, oregano, sól, pieprz"
        ],
        steps: "1. Makaron ugotuj al dente. 2. Warzywa pokrój w kostkę, czosnek posiekaj. 3. Na patelni rozgrzej oliwę i zeszklij czosnek. 4. Dodaj warzywa i duś 10 minut. 5. Wlej pomidory i duś kolejne 5 minut. 6. Połącz z makaronem i wymieszaj.",
        youtube: "https://youtu.be/XJiUJNEa5RU"
    },
    {
        title: "Koktajl białkowy z owocami",
        desc: "Idealny posiłek po treningu",
        kcal: "320 kcal",
        time: "5 min",
        difficulty: "Bardzo łatwy",
        ingredients: [
            "1 banan",
            "Garść truskawek",
            "1 łyżka masła orzechowego",
            "1 miarka białka waniliowego",
            "200ml mleka migdałowego",
            "Kostki lodu"
        ],
        steps: "Wszystkie składki wrzuć do blendera i zmiksuj na gładki koktajl. Podawaj od razu po przygotowaniu.",
        youtube: "https://youtu.be/XJiUJNEa5RU"
    },
    {
        title: "Kanapki z łososiem i awokado",
        desc: "Proste i zdrowe śniadanie bogate w kwasy omega-3",
        kcal: "480 kcal",
        time: "10 min",
        difficulty: "Łatwy",
        ingredients: [
            "2 kromki chleba żytniego",
            "100g wędzonego łososia",
            "1/2 dojrzałego awokado",
            "2 plastry pomidora",
            "Rukola",
            "Sok z cytryny",
            "Sól i pieprz"
        ],
        steps: "1. Chleb opiecz w tosterze. 2. Awokado rozgnieć widelcem, dodaj sok z cytryny, sól i pieprz. 3. Na pieczywo nałóż pastę z awokado, następnie ułóż rukolę, łososia i pomidory.",
        youtube: "https://youtu.be/XJiUJNEa5RU"
    }
];

function loadRecipeOfTheDay() {
    const saved = localStorage.getItem("recipeOfTheDay");
    let recipe;

    // Sprawdź czy mamy zapisany przepis z dzisiaj
    if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();

        if (data.date === today) {
            recipe = data.recipe; // używamy tego samego przepisu przez cały dzień
        }
    }

    // Jeśli nie ma przepisu z dzisiaj → losujemy nowy
    if (!recipe) {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        recipe = recipes[randomIndex];

        localStorage.setItem("recipeOfTheDay", JSON.stringify({
            date: new Date().toDateString(),
            recipe: recipe
        }));
    }

    // Aktualizujemy widok przepisu dnia
    const dayTitle = document.getElementById("dayRecipeTitle");
    const dayDesc = document.getElementById("dayRecipeDesc");
    const openBtn = document.getElementById("openDayRecipe");

    if (dayTitle) dayTitle.textContent = recipe.title;
    if (dayDesc) dayDesc.textContent = recipe.desc;

    // Obsługa kliknięcia przycisku
    if (openBtn) {
        openBtn.onclick = () => {
            // Tworzymy i pokazujemy modal z przepisem
            const modal = document.createElement('div');
            modal.className = 'recipe-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                padding: 20px;
                box-sizing: border-box;
            `;

            const modalContent = document.createElement('div');
            modalContent.className = 'recipe-modal-content';
            modalContent.style.cssText = `
                padding: 20px;
                border-radius: 10px;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            `;

            // Nagłówek
            const titleEl = document.createElement('h2');
            titleEl.textContent = recipe.title;
            titleEl.style.margin = '0 0 20px 0';
            titleEl.style.paddingRight = '30px'; // Zostawiamy miejsce na przycisk zamknięcia

            // Przycisk zamknięcia - większy i bardziej widoczny
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: #f0f0f0;
                border: none;
                font-size: 32px;
                font-weight: 300;
                cursor: pointer;
                color: #555;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
                line-height: 1;
                padding: 0;
            `;
            closeBtn.onmouseover = () => {
                closeBtn.style.backgroundColor = '#e0e0e0';
                closeBtn.style.transform = 'scale(1.1)';
                closeBtn.style.color = '#333';
            };
            closeBtn.onmouseout = () => {
                closeBtn.style.backgroundColor = '#f0f0f0';
                closeBtn.style.transform = 'scale(1)';
                closeBtn.style.color = '#555';
            };
            closeBtn.onclick = () => modal.remove();

            // Opis
            const descEl = document.createElement('p');
            descEl.textContent = recipe.desc;
            descEl.style.fontStyle = 'italic';
            descEl.style.color = '#666';

            // Informacje o przepisie
            const infoEl = document.createElement('div');
            infoEl.style.margin = '15px 0';
            infoEl.innerHTML = `
                <p><strong>Kalorie:</strong> ${recipe.kcal}</p>
                <p><strong>Czas przygotowania:</strong> ${recipe.time}</p>
                <p><strong>Poziom trudności:</strong> ${recipe.difficulty}</p>
            `;

            // Składniki
            const ingredientsTitle = document.createElement('h3');
            ingredientsTitle.textContent = 'Składniki:';
            ingredientsTitle.style.marginBottom = '10px';

            const ingredientsList = document.createElement('ul');
            ingredientsList.style.paddingLeft = '20px';
            recipe.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                li.style.marginBottom = '5px';
                ingredientsList.appendChild(li);
            });

            // Sposób przygotowania
            const stepsTitle = document.createElement('h3');
            stepsTitle.textContent = 'Sposób przygotowania:';
            stepsTitle.style.margin = '20px 0 10px 0';

            const stepsEl = document.createElement('p');
            stepsEl.textContent = recipe.steps;
            stepsEl.style.whiteSpace = 'pre-line';
            stepsEl.style.lineHeight = '1.5';

            // Składanie modala
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(titleEl);
            modalContent.appendChild(descEl);
            modalContent.appendChild(infoEl);
            modalContent.appendChild(ingredientsTitle);
            modalContent.appendChild(ingredientsList);
            modalContent.appendChild(stepsTitle);
            modalContent.appendChild(stepsEl);

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Zamykanie modala po kliknięciu poza zawartością
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };
        };
    }
}

// Uruchamiamy przy starcie strony
window.addEventListener("DOMContentLoaded", loadRecipeOfTheDay);

// Remove unused event listeners since we're not using the recipes page anymore

/* ==================== INTERACTIVE PARTICLE NETWORK ==================== */
class ParticleNetwork {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeTimer = null; // For debouncing resize events
        this.mouse = {
            x: null,
            y: null,
            radius: 100,
            active: false
        };

        // Get computed styles for theme colors
        const style = getComputedStyle(document.documentElement);
        this.particleColor = style.getPropertyValue('--particle-color') || 'rgba(99, 102, 241, 0.7)';
        this.lineColor = style.getPropertyValue('--line-color') || 'rgba(99, 102, 241, 0.3)';

        this.container.appendChild(this.canvas);
        this.setupCanvas();
        this.init();

        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.animate = this.animate.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);

        // Event listeners
        window.addEventListener('resize', this.handleResize);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseout', this.handleMouseOut);

        // Watch for theme changes
        this.observer = new MutationObserver(this.handleThemeChange);
        this.observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Start animation
        this.animate();
    }

    handleThemeChange() {
        const style = getComputedStyle(document.documentElement);
        this.particleColor = style.getPropertyValue('--particle-color') || 'rgba(99, 102, 241, 0.7)';
        this.lineColor = style.getPropertyValue('--line-color') || 'rgba(99, 102, 241, 0.3)';
    }

    setupCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    init() {
        // Calculate particle count based on screen size
        const screenArea = window.innerWidth * window.innerHeight;
        let particleCount, maxDistance;

        if (window.innerWidth <= 768) { // Mobile devices
            particleCount = Math.floor(screenArea / 30000); // Mniej cząstek na telefonach
            maxDistance = 80; // Mniejszy zasięg połączeń na telefonach
        } else if (window.innerWidth <= 1024) { // Tablets
            particleCount = Math.floor(screenArea / 25000);
            maxDistance = 100;
        } else { // Desktops
            particleCount = Math.floor(screenArea / 15000);
            maxDistance = 120;
        }

        // Store maxDistance for connection drawing
        this.maxDistance = maxDistance;

        // Clear existing particles
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2 + 1;
            const directionX = (Math.random() * 2) - 1;
            const directionY = (Math.random() * 2) - 1;

            this.particles.push({
                x, y, size,
                directionX, directionY,
                speed: 0.3 + Math.random() * 0.7,
                opacity: 0.3 + Math.random() * 0.7
            });
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections between particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Use dynamic max distance based on screen size
                const maxDistance = this.maxDistance;

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.8;
                    // try to use rgba with dynamic opacity
                    const lineColor = this.lineColor.includes('rgba') ? this.lineColor.replace(/[\d\.]+\)$/, '') : this.lineColor;
                    this.ctx.strokeStyle = this.lineColor.replace('0.2', opacity.toFixed(2));
                    this.ctx.lineWidth = 0.8;

                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw particles with glow effect
        this.particles.forEach(particle => {
            // Glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, this.particleColor);
            gradient.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Particle core
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.particleColor.replace('0.7', '0.9');
            this.ctx.fill();
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Add some organic movement with sine wave
            const time = Date.now() * 0.001;
            particle.x += Math.sin(time + particle.x * 0.01) * 0.1;
            particle.y += Math.cos(time + particle.y * 0.01) * 0.1;

            // Normal movement
            particle.x += particle.directionX * particle.speed;
            particle.y += particle.directionY * particle.speed;

            // Bounce off edges with slight randomization
            if (particle.x > this.canvas.width || particle.x < 0) {
                particle.directionX = -particle.directionX * (0.9 + Math.random() * 0.2);
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y > this.canvas.height || particle.y < 0) {
                particle.directionY = -particle.directionY * (0.9 + Math.random() * 0.2);
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // Original mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = this.mouse.radius * 1.5;

                if (distance < maxDistance) {
                    const angle = Math.atan2(dy, dx);
                    const force = Math.pow((maxDistance - distance) / maxDistance, 2);

                    // Move particles away from mouse
                    particle.x -= Math.cos(angle) * force * 4;
                    particle.y -= Math.sin(angle) * force * 4;

                    // Change direction based on mouse position
                    particle.directionX = Math.cos(angle + Math.PI) * 0.1;
                    particle.directionY = Math.sin(angle + Math.PI) * 0.1;
                }
            }

            // Random directional changes for more organic movement
            if (Math.random() < 0.005) {
                particle.directionX += (Math.random() - 0.5) * 0.2;
                particle.directionY += (Math.random() - 0.5) * 0.2;

                // Normalize direction vector
                const length = Math.sqrt(particle.directionX * particle.directionX + particle.directionY * particle.directionY);
                if (length > 0) {
                    particle.directionX = particle.directionX / length;
                    particle.directionY = particle.directionY / length;
                }
            }
        });
    }

    handleResize() {
        // Debounce resize events for better performance
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.setupCanvas();
            this.init();
        }, 100);
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
        this.mouse.active = true;
    }

    handleMouseOut() {
        this.mouse.x = null;
        this.mouse.y = null;
        this.mouse.active = false;
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        this.updateParticles();
        this.drawParticles();
    }

    // Clean up method to prevent memory leaks
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.observer) {
            this.observer.disconnect();
        }
        window.removeEventListener('resize', this.handleResize);
        if (this.canvas) {
            this.canvas.removeEventListener('mousemove', this.handleMouseMove);
            this.canvas.removeEventListener('mouseout', this.handleMouseOut);
        }
        if (this.container && this.canvas) {
            this.container.removeChild(this.canvas);
        }
    }
}

/* ------------------------------- */
/*         KALENDARZ              */
/* ------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.getElementById("calendarContainer");
    const calendarDetails = document.getElementById("calendarDayDetails");
    const savedDataBox = document.getElementById("calendarSavedData");
    const selectedDateTitle = document.getElementById("selectedDateTitle");
    const calendarTitle = document.getElementById("calendarTitle");

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    if (!calendarContainer) return;

    const monthNames = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    /* === GENEROWANIE KALENDARZA === */
    function generateCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        let html = `
            <div class="calendar-grid">
                <div>Pn</div><div>Wt</div><div>Śr</div>
                <div>Cz</div><div>Pt</div><div>Sob</div><div>Ndz</div>
        `;

        let blanks = (firstDay + 6) % 7;
        for (let i = 0; i < blanks; i++) html += `<div class="blank"></div>`;

        for (let d = 1; d <= daysInMonth; d++) {
            html += `<button class="calendar-day" data-day="${d}">${d}</button>`;
        }

        html += "</div>";
        calendarContainer.innerHTML = html;

        document.querySelectorAll(".calendar-day").forEach(btn => {
            btn.addEventListener("click", () =>
                openDay(btn.dataset.day)
            );
        });
    }

    /* === Otwieranie dnia === */
    function openDay(day) {
        const keyBase = getDateKey(currentYear, currentMonth + 1, day);
        selectedDateTitle.textContent = `Dzień ${day} – ${monthNames[currentMonth]} ${currentYear}`;

        loadDayEntries(keyBase);

        calendarDetails.style.display = "block";
    }

    /* === Klucz zapisu === */
    function getDateKey(yyyy, mm, dd) {
        return `calendar-${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    }

    /* === Wczytywanie zapisanych danych dnia === */
    function loadDayEntries(baseKey) {
        let all = [];

        for (let h = 0; h < 24; h++) {
            const hour = String(h).padStart(2, "0") + ":00";
            const fullKey = `${baseKey}-${hour}`;
            const saved = localStorage.getItem(fullKey);
            if (!saved) continue;

            // Jeśli wcześniej zapisane jako JSON — sformatuj czytelnie.
            let entryText = saved;
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.analysis !== undefined) {
                    // użyj timestamp z obiektu jeśli jest
                    const ts = parsed.timestamp || '';
                    entryText = `⏰ ${hour}\nSamopoczucie: ${parsed.mood}\nPosiłki: ${parsed.meals}\nDodatkowe: ${parsed.extra || '-'}\nNawodnienie: ${parsed.water || '-'}\nAnaliza AI:\n${parsed.analysis}\n[Zapisano: ${ts}]`;
                } else {
                    // jeżeli JSON, ale nie w oczekiwanym kształcie, pozostaw surowy tekst
                    entryText = String(saved);
                }
            } catch (e) {
                // saved jest już tekstem — zostaw jak jest
                entryText = String(saved);
            }

            all.push(entryText);
        }

        savedDataBox.textContent = all.length ? all.join("\n\n---\n\n") : "(brak danych)";
    }

    /* === ZAPIS AUTOMATYCZNY PO ANALIZIE AI (TERAZ: ZAPIS JAKO CZYTELNY TEKST) === */
    function autoSaveAfterAI() {
        const mood = document.getElementById("mood").value || "-";
        const meals = document.getElementById("meals").value || "-";
        const extra = document.getElementById("extra").value || "";
        const analysis = document.getElementById("result").textContent || "";

        if (!analysis.trim()) return; // bezpieczeństwo — nic nie zapisujemy jeśli brak treści

        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = now.getMonth() + 1;
        const dd = now.getDate();

        // Klucz w localStorage grupuje wg godziny (HH:00) — zgodnie z wcześniejszym zamierzeniem
        const hourKey = String(now.getHours()).padStart(2, "0") + ":00";
        const keyBase = getDateKey(yyyy, mm, dd);
        const fullKey = `${keyBase}-${hourKey}`;

        // Dokładna godzina (minuty) w treści zapisu dla większej precyzji
        const timeExact = now.toTimeString().slice(0, 5);
        const timestamp = now.toLocaleString();

        // ==== Poprawione: oblicz prawdziwe dzienne nawodnienie (z waterHistory + bieżący licznik) ====
        const storedHistory = JSON.parse(localStorage.getItem('waterHistory') || '{}');
        const todayKey = new Date().toISOString().split('T')[0];
        const savedTotal = (storedHistory[todayKey] && Number(storedHistory[todayKey].total)) ? Number(storedHistory[todayKey].total) : 0;
        const unsaved = Number(localStorage.getItem('waterAmount')) || waterAmount || 0;
        const currentWaterTotal = savedTotal + unsaved;

        const currentGoal = Number(localStorage.getItem('dailyGoal')) || dailyGoal || 2000;

        // Zapisujemy jako JSON — loadDayEntries już potrafi parsować i wyświetli pole `water`.
        const payload = {
            mood: mood,
            meals: meals,
            extra: extra || '',
            analysis: analysis,
            water: currentWaterTotal,
            goal: currentGoal,
            timestamp: now.toISOString()
        };

        localStorage.setItem(fullKey, JSON.stringify(payload));

        // Jeśli w widoku jest właśnie wybrany ten dzień, odśwież listę
        const selected = selectedDateTitle.textContent;
        if (selected && selected.includes(String(dd))) {
            loadDayEntries(keyBase);
        }

        console.log("Zapisano automatycznie (tekst):", fullKey);
    }

    /* === PODPINAMY ZAPIS DO FUNKCJI ANALIZY AI (z odłączeniem observera po pierwszym zapisie) === */
    if (analyzeBtn) {
        analyzeBtn.addEventListener("click", () => {
            const resultNode = document.getElementById("result");
            if (!resultNode) return;

            const observer = new MutationObserver((mutations, obs) => {
                // zapisz tylko gdy pojawiła się jakaś treść
                if (resultNode.textContent && resultNode.textContent.trim()) {
                    autoSaveAfterAI();
                    obs.disconnect(); // zapobiega wielokrotnym zapisom
                }
            });

            observer.observe(resultNode, { childList: true, subtree: true, characterData: true });
        });
    }

    /* === Nawigacja miesięcy === */
    const prevBtn = document.getElementById("prevMonthBtn");
    const nextBtn = document.getElementById("nextMonthBtn");
    if (prevBtn) prevBtn.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar();
    });
    if (nextBtn) nextBtn.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar();
    });

    generateCalendar();
});

function clearAllData() {
    localStorage.clear();
    alert('Wylogowano i wyczyszczono wszystkie dane.');
    location.reload();
}
