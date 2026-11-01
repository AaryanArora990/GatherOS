# ✨ GatherOS — The Celebration Operating System
> **Big Moments Deserve Intelligent Planning.**  
> *Built for Google for Developers × Hack2Skill PromptWars Virtual*

GatherOS is a production-grade, AI-powered Event Intelligence Platform designed to transform chaotic event planning into an intelligent, structured, and joyful experience. Supporting **Weddings**, **Milestone Birthdays**, and **Community Festivals**, GatherOS moves users seamlessly from a natural-language vision to a mathematically verified budget, risk-aware timeline, and emotional guest journey.

---

## 🔗 Live Deployment & Demo
- **🌐 Live Application:** [Insert Your Vercel Link Here]
- **🎬 Product Walkthrough Reel:** [Insert Your Instagram Reel Link Here]

---

## 🛠️ AI Tool Usage & Selection (Submission Essentials)

### 1. Which AI Tools Were Used?
- **Google AI Studio:** Used as the primary prompt engineering workbench, schema designer, and multi-turn context sandbox.
- **Google Gemini Models (via Gemini API):** Core reasoning engine powering the Gather AI Copilot, Blueprint Generator, Budget Reality Check, Moment Map, and Scenario Simulator.

### 2. Why Were They Selected?
- **Strict JSON Schema Enforcement:** Event planning requires structured state updates across 10+ financial categories and timeline milestones. Gemini's reliable structured JSON generation ensured zero broken UI states.
- **Low-Latency Contextual Reasoning:** When users simulate sudden changes (e.g., *"Guest count increased from 180 to 220"*), Gemini computes cascading effects across catering, venue capacity, and emergency reserves in real time.
- **Cultural & Regional Nuance:** Gemini accurately understands regional event intricacies (e.g., multi-function Indian heritage weddings in Jaipur vs. neighborhood community festivals) without generic Western-only assumptions.

---

## 📈 Prompt Engineering Evolution

Our prompt architecture evolved across three distinct phases to reach production quality:

### Phase 1: Unstructured Conversational Prompting (Initial Failure)
- *Approach:* Simple role prompting asking the LLM to "help plan an event and suggest a budget."
- *Limitation:* Produced long, unstructured markdown paragraphs that could not dynamically populate interactive charts, financial ledgers, or task lists.

### Phase 2: Multi-Persona Role Decomposition
- *Approach:* Engineered a unified multidisciplinary system prompt combining the perspectives of an Event Operations Consultant, Behavioral UX Researcher, and Financial Planner.
- *Improvement:* Resulting recommendations became grounded in real operational constraints (vendor lead times, weather contingencies, hidden costs).

### Phase 3: Deterministic State-Bound Schema Contracts (Final Architecture)
- *Approach:* Bound natural-language inputs to strict TypeScript interfaces and JSON schemas. Every AI output is validated before state mutation, enabling actionable one-click triggers (`Apply Suggestion`, `Add to Budget`, `Add to Timeline`).
- *Honest Fallback Architecture:* Implemented transparent credential checks—when running without an API key, GatherOS clearly labels estimates and demo states without faking live AI responses.

---

## ⚖️ Division of Labor: What GenAI Handled vs. Human Engineering

| Layer | Handled by Generative AI (Gemini) | Handled by Human Design & Engineering |
| :--- | :--- | :--- |
| **Event Blueprinting** | Synthesizing bespoke themes, color palettes, cultural menus, and contingency plans from natural language. | Progressive disclosure onboarding UI adapting fields dynamically to Weddings, Birthdays, or Community events. |
| **Financial Intelligence** | Identifying overspending bottlenecks, suggesting realistic vendor trade-offs, and estimating per-head cost scaling. | Deterministic financial engine (`Total = Sum of Allocations`, `Remaining = Total - Actual`) ensuring 100% mathematical accuracy. |
| **Experience Design** | Generating emotional stage descriptions, backup plans, and guest flow recommendations in the **Moment Map**. | Interactive 8-stage visual journey architecture (Arrival → Welcome → Main Celebration → Farewell). |
| **Trust & Privacy** | Generating personalized RSVP invitation drafts on demand. | Strict privacy boundaries preventing PII guest data from leaking to external LLM calls without explicit authorization. |

---

## 🌟 Signature Modules

1. **Gather AI Copilot:** Context-aware celebration assistant that remembers active event constraints, budget caps, and cultural preferences.
2. **Smart Budget Intelligence & Reality Check:** 10-category live ledger tracking Allocated, Quoted, Committed, Paid, and Outstanding balances with instant recalculation and AI trade-off analysis.
3. **The Moment Map:** Industry-first emotional journey planner dividing celebrations into 8 experiential stages with preparation requirements and risk backups.
4. **Event Scenario Simulator ("What-If" Engine):** Sandbox to test guest spikes, budget cuts, or weather disruptions without overwriting the master plan until confirmed.
5. **Transparent Vendor Studio:** Side-by-side quotation comparison matrix that explicitly flags missing details and never fabricates fake businesses.
6. **Guided Demo & Presentation Mode:** Pre-loaded with three rich sample datasets (*Aarav & Meera’s Heritage Jaipur Wedding*, *Creative Milestone Birthday*, and *Neighborhood Community Festival*) with a one-click reset.

---

## Local Setup

1. Install Node.js 20.19+ (or 22.12+) and npm.
2. From the project directory, install dependencies:
   ```bash
   npm install
   ```
3. To enable Gemini features, copy `.env.example` to `.env` and set `GEMINI_API_KEY` to a valid key. The app runs in demo/fallback mode without a key. Keep keys server-side; do not use `VITE_*` variables for secrets.
4. Start the app:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000. The Express server serves both the Vite client and `/api` endpoints.

For production, run `npm run build` and then `npm start`. The build creates the client in `dist/` and the serverless API entry point in `api/index.js` for Vercel. Set `PORT` to change the local port.
