# MindEats AI 🍎
**Projekt konkursowy — HackHeroes 2025**

MindEats AI to lekka, nowoczesna aplikacja webowa, która wspiera zdrowe nawyki: monitoruje nawodnienie, analizuje posiłki, pomaga organizować dzień i generuje spersonalizowane porady dzięki sztucznej inteligencji. Wszystko działa w przeglądarce — bez instalacji, bez konta, w pełni prywatnie.

---
## 🔗 Link do aplikacji

- Aby uruchomić aplikację wystarczy kliknąć w ten link - [aplikcja MindEats AI](https://szymonxpl.github.io/MindEats-AI)

---

## 📌 Funkcje

- **Profil użytkownika** z pełnymi parametrami zdrowotnymi.  
- Automatyczne obliczenia: **BMI**, **BMR**, **CPM**.  
- **Śledzenie nawodnienia** z animowanym wskaźnikiem i dziennym celem.  
- **Kalendarz**, który zapisuje i wyświetla historię każdego dnia.  
- **Propozycje posiłków** + **Przepis dnia**.  
- Moduł **Analiza z AI** — wpisujesz co zjadłeś i jak się czujesz → AI zwraca analizę oraz sugestie.  
- **Personalizacja kolorów** i tryb **ciemny/jasny**.  
- Nowoczesne animacje: **geometric shapes** i **particle network**.  
- Pełna responsywność + wsparcie dla dostępności.

---

## 🛠 Technologie

- **HTML5**, **CSS3**, **JavaScript**
- localStorage — profil, woda, motywy, historia
- Canvas — efekt „particle network”
- Model AI: [tngtech/deepseek-r1t2-chimera:free](https://openrouter.ai/tngtech/deepseek-r1t-chimera:free)
- Integracja z zewnętrznym modelem AI (przez proxy Cloudflare Worker)

---

## 🤖 Integracja AI i prywatność

- W pliku `script.js` używany jest endpoint `WORKER_URL`

- Aplikacja wysyła do AI tylko dane wpisane w formularzu analizy.
- **Profil użytkownika, motywy, historia wody** przechowywane są wyłącznie lokalnie w `localStorage` → nie opuszczają urządzenia użytkownika. Jeżeli użytkownik się wyloguje dane są usuwane.

---

## ♿ Dostępność i UX

- Wsparcie dla `aria-label`, `aria-hidden`, `focus-visible`.  
- Czytelny tryb jasny i ciemny.  
- Poprawna obsługa klawiatury.  
- Layout dostosowany do urządzeń mobilnych.  
- Duże, intuicyjne przyciski.

---

## 📁 Najważniejsze pliki

### **index.html**
- Struktura aplikacji  
- Sidebar, sekcje stron, odtwarzacz muzyki, formularze

### **style.css**
- Motywy kolorów  
- Tryb ciemny / jasny  
- Animacje, layout, responsywność  
- Style dla kart, modali, sidebaru i kalendarza

### **script.js**
- Logika profilu i obliczeń BMI/BMR/CPM  
- System motywów i zapisywanie ustawień  
- Nawodnienie + historia  
- Kalendarz  
- Obsługa AI (fetch do WORKER_URL)  
- Particle network & animacje geometryczne

---

## ⚠ Ograniczenia

- Autoodtwarzanie muzyki może być blokowane (wymaga kliknięcia).  
- Animacje canvas mogą być cięższe dla słabszych telefonów.  
- Brak synchronizacji między urządzeniami (tylko localStorage).
- Czasami trzeba trochę poczekać na wygenerowanie analizy.

---
