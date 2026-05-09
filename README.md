# 🗺️ TripSketch 2.0 – AI-Powered Travel Discovery

TripSketch is a **next-generation trip-planning web app** that uses Artificial Intelligence to help travelers find **authentic, offbeat spots** that match their vibe. Instead of generic "Top 10" lists, TripSketch acts as your **digital AI travel sketchbook**, generating personalized journeys in real-time.

---

## 🚀 Live Features (Milestone 2 - AI Integration)

This project has evolved beyond simple mockups into a fully functional AI travel engine:

- **✨ AI Spot Discovery**: Uses **Groq LLM (Llama 3.1)** to generate 6 authentic, non-touristy travel spots for any destination in seconds.
- **🖼️ Real-Time Visuals**: Automatically fetches live photos of generated spots using the **Wikipedia API** for a rich visual experience.
- **📅 AI Trip Itinerary**: Generates a complete day-by-day travel plan with a single click, including offbeat stays and local food suggestions.
- **🌡️ Live Weather & Vibe**: Connects to weather logic to provide real-time conditions and destination atmosphere.
- **💬 Ask AI Interactive Cards**: Chat directly with each spot's card to ask specific questions like "Is this good for solo travelers?" or "What's the best time to visit?".
- **🏔️ Immersive UI**: High-performance scroll-based background animation and a premium glassmorphic dashboard.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite)
- **AI Engine**: Groq Cloud API (Llama 3.1 8B)
- **Data APIs**: Wikipedia API (Images), MediaWiki API (Search)
- **Markdown**: React-Markdown for beautiful itinerary rendering
- **Styling**: Vanilla CSS (Custom Design System)
- **Icons**: Lucide-React

---

## 📁 Folder Structure

```text
tripsketch2.0/
├── public/               # Static assets
│   └── frames/           # Image frames
├── scripts/              # Utility scripts
│   └── run-groq-tests.mjs# Groq API test script
├── src/                  # Main source code
│   ├── components/       # React components
│   │   ├── Dashboard.jsx # Main dashboard view
│   │   └── TripCard.jsx  # Individual trip spot cards
│   ├── lib/              # Utility and API functions
│   │   ├── askPlace.js   # Interactive AI questions
│   │   ├── groq.js       # Groq LLM integration
│   │   ├── index.js      # Library exports
│   │   ├── itinerary.js  # Itinerary generation logic
│   │   ├── search.js     # Search functionality
│   │   ├── spots.js      # AI spot generation
│   │   ├── weather.js    # Weather API logic
│   │   └── wikipedia.js  # Wikipedia Image fetching
│   ├── App.css           # App specific styles
│   ├── App.jsx           # Main App component
│   ├── index.css         # Global styles & design system
│   └── main.jsx          # React entry point
├── index.html            # Vite entry point
├── package.json          # Project dependencies
└── vite.config.js        # Vite configuration
```

---

## 🧑‍🤝‍🧑 Team Members

- **Aryan Mudgal**  
- **Kanika Prajapati**  
- **Ayesha Khan**

---

## 🚀 How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aryanm25096-dotcom/tripsketch2.0.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file in the root and add your Groq API Key:
   ```env
   VITE_GROQ_API_KEY=your_key_here
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## 🙌 Acknowledgements

Powered by **Groq Cloud** for lightning-fast AI inference and **Wikipedia** for crowdsourced travel data.

Made with ❤️ by the TripSketch team.