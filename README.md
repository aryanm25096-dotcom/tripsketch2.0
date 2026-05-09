# 🗺️ TripSketch – First Milestone (Frontend‑Only)

TripSketch is a **trip‑planning web app** that helps you and your friends find **offbeat, budget‑friendly spots** that match your vibe — instead of the same crowded, over‑priced tourist traps.  

Think of it like a **digital travel sketchbook**: instead of scrolling through boring lists, you flip through hand‑picked, local‑vibe places for your next trip.  

This is **Milestone 1** of the project, where we build a **purely frontend app** with mock data and interactive filtering.

---

## 🙋‍♂️ Problem We’re Solving

When planning trips, everyone ends up seeing the same “Top 10 hill stations / cafes / routes” articles. These are usually:
- Too crowded.
- Over‑priced.
- Not really matching your vibe.

TripSketch solves this by:
- Suggesting **less‑crowded, budget‑friendly spots** (mock data).
- Presenting places in a **visual, sketchbook‑style layout**.
- Letting users filter by **vibe (chill, adventure, food, etc.)** and **budget**.

---

## 🎯 Project Vision (Milestone 1)

In this first milestone, we focus on:

- Building a **React‑based frontend** with **no backend**.
- Creating a **UI that feels like a travel sketchbook**.
- Implementing:
  - Search by destination and trip type.
  - Filters by vibe, budget, and crowd level.
  - Sort options (“Most Local”, “Cheapest”, “Best for Friends”).
- Mocking **all data in the frontend** (no API calls).
- Preparing the structure so the project feels complete and demo‑ready as a college project.

---

## 🛠️ Tech Stack (Frontend‑Only)

### Core Tech
- **Framework:** React
- **Language:** JavaScript (ES6+)
- **Styling:** CSS (or Tailwind CSS, if you prefer)
- **State management:** React hooks (`useState`, `useEffect`)
- **Routing (optional):** React Router for `/`, `/results` (strictly frontend)

### Data (Milestone 1)
- **Mock data only:**  
  - A JavaScript array storing “offbeat spots” directly in the code.
  - Example fields: `name`, `location`, `vibe`, `budget`, `description`, `crowdLevel`.
- **Local persistence (optional):**  
  - `localStorage` to remember liked places across page reloads (UI‑only, no backend involved).

---

## 🧑‍🤝‍🧑 Team Members

- Aryan Mudgal  
- Kanika Prajapati  
- Ayesha Khan

---

## 🧩 Milestone 1 Features

In this version, the app includes:

### 🔍 SearchForm
- Where to go (city / region / hill station).
- Type of trip (chill, adventure, local‑food, solo, friends, couple).
- Budget range selector (low, medium, high).

### 🖼️ ResultsGrid
- Grid of cards showing “offbeat spots”.
- Each card contains:
  - Name and location.
  - Vibe tag (e.g., “Chill”, “Adventure”, “Local Food”).
  - Budget tag (e.g., “Under ₹1000”).
  - Short description.
  - “Like” heart icon (stored in React state or `localStorage`).

### 🎯 FilterBar
- Filter by vibe (chill, adventure, local, etc.).
- Filter by budget (low, medium, high).
- Filter by “Crowd Level” (low, medium, high).
- Sort by:
  - “Most Local”.
  - “Cheapest”.
  - “Best for Friends”.

### 🎨 Visual Style
- **Sketchbook‑style layout:**
  - Soft background colors.
  - Minimal borders with a slightly hand‑drawn feel.
  - Illustration‑style or SVG icons.
  - Card‑based UI that feels like flipping pages.

---

## 📁 Project Structure (Suggested – React)

```text
trip-sketch/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SearchForm.jsx
│   │   ├── FilterBar.jsx
│   │   ├── TripCard.jsx
│   │   └── ResultsGrid.jsx
│   ├── data/
│   │   └── mockSpots.js    // Mock array of offbeat spots
│   ├── App.jsx             // Main component
│   └── index.js
└── README.md
```

---

## 🚀 How to Run (Milestone 1)

1. Open your project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` in your browser.

**All data lives in the frontend; there is no backend or API in this version.**

---

## 📝 Future Ideas (Conceptual)

Although this is a frontend‑only project, conceptually it could be extended in the future (not for this college milestone):
- Adding a backend and user accounts to save favorites.
- Connecting to travel/location APIs for real‑time data.
- Improving filters and recommendation logic.

---

## 🙌 Acknowledgements

Thanks to our friends and classmates for testing early versions and giving feedback on:
- Usability of filters and sorting.
- Visual style and “sketchbook” feel.
- Clarity of the vibe‑based recommendations.

---

Made with ❤️ by the TripSketch team:  
**Aryan Mudgal, Kanika Prajapati, Ayesha Khan**