# 🧭 WanderForge — Travel Plan & Experience Engine

> A React app that turns travel inspiration into a fully-budgeted day-by-day itinerary.

WanderForge curates destinations and experiences, ranks them against your
selected interests (adventure, food, culture, wellness, …), and lets you
build, save and edit multi-day itineraries with a live budget.

---

## ✨ Features

- 🌍 **Destination explorer** — 8 hand-picked destinations with hero
  gradients, key facts, highlights and local tips.
- 🎯 **Interest-based recommendation engine** — pick a few vibes; the app
  scores destinations and experiences by how well they match.
- 🗓 **Day-by-day trip planner** — drop activities into days,
  drag-and-drop between days, or use the “move to day” chips.
- 💵 **Live budget widget** — auto-totals activity cost, food + lodging
  estimate (based on destination’s avg daily budget × travellers × days).
- 💾 **Multi-trip persistence** — save, edit and delete unlimited trips,
  stored in `localStorage` (no backend needed).
- 🔎 **Search, filter & sort** — by region, vibe and budget.
- 📱 **Responsive design** — clean, modern UI with a custom mini design
  system and Google Fonts (Plus Jakarta Sans + Fraunces).
- ♿ **Accessible** — semantic HTML, keyboard-friendly buttons, ARIA where
  helpful.

---

## 🏗 Tech stack

| Concern             | Choice                                                |
|---------------------|-------------------------------------------------------|
| Framework           | **React 18** with hooks                               |
| Build tool          | **Vite 5** — fast dev server + tiny prod build        |
| Routing             | **react-router-dom** v6                                |
| State               | **Context API + custom `useLocalStorage` hook**       |
| Styling             | Custom CSS with CSS variables (no UI lib, no Tailwind) |
| Persistence         | `localStorage`                                        |

---

## 🚀 Quick start

Requires **Node 18+** and npm.

```bash
# 1. install dependencies
npm install

# 2. start the dev server (opens http://localhost:5173)
npm run dev

# 3. production build
npm run build

# 4. preview the built bundle
npm run preview
```

---

## 🗂 Project structure

```
.
├── index.html                # Vite entry HTML
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              # ReactDOM root + providers
    ├── App.jsx               # Routes
    ├── styles/
    │   └── index.css         # Global design system
    ├── data/
    │   ├── destinations.js   # 8 curated destinations
    │   ├── experiences.js    # 35+ curated experiences + scoring fn
    │   └── interests.js      # 10 interest categories
    ├── hooks/
    │   └── useLocalStorage.js
    ├── context/
    │   └── TripContext.jsx   # Interests, draft trip, saved trips
    ├── components/
    │   ├── Layout/{Navbar,Footer}.jsx
    │   ├── DestinationCard.jsx
    │   ├── ExperienceCard.jsx
    │   ├── InterestSelector.jsx
    │   ├── BudgetWidget.jsx
    │   ├── ItineraryDay.jsx
    │   └── EmptyState.jsx
    └── pages/
        ├── Home.jsx
        ├── Explore.jsx
        ├── DestinationDetail.jsx
        ├── Recommendations.jsx
        ├── TripPlanner.jsx
        ├── MyTrips.jsx
        └── NotFound.jsx
```

---

## 🧠 How the recommendation engine works

A **simple, transparent scoring function** lives in
`src/data/experiences.js`:

```js
function scoreExperience(experience, interestIds) {
  // primary category match → +3
  // each tag match         → +1
}
```

Destinations on the **Recommendations** page are ranked by:

- `+2` for every interest tag the destination explicitly lists;
- `+0.5` for every experience belonging to it that scores `≥ 3`.

This is intentionally lightweight, fully client-side, and easy to swap for
a real ML/LLM-backed service later (see Roadmap below).

---

## 🛣 Roadmap / nice next steps

If you want to take WanderForge further, great follow-ups:

1. **Real images** — swap emoji/gradient hero blocks for Unsplash photos
   (per-destination + per-experience).
2. **Map view** — drop pins for each experience on a Leaflet/Mapbox map
   and draw the day’s route.
3. **Currency switcher** — show every cost in the user’s preferred
   currency via an FX rates API.
4. **Smarter recommendations** — call an LLM (e.g. Claude / OpenAI) with
   the user’s interests + constraints (dates, budget cap, dietary needs)
   to generate a custom itinerary draft.
5. **Sharing & PDF export** — copy-link sharing, plus printable PDF of an
   itinerary.
6. **Backend + auth** — promote `localStorage` to Supabase / Firebase so
   trips sync across devices and travel companions can collaborate.
7. **Real bookings** — integrate Viator / GetYourGuide affiliate APIs to
   actually book experiences from inside the planner.
8. **Pack list & checklist** — auto-generate a packing list based on
   destination, season, and selected experiences.
9. **Weather + best-day suggester** — use a forecast API to suggest which
   day to schedule outdoor activities.
10. **i18n** — translate the UI (the codebase is English-only today).

---

## 📝 License

MIT — feel free to fork and remix. Made for the Promptwars Hyderabad demo.
