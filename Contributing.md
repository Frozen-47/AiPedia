# Contributing to AiVerse 🌌

Thank you for taking the time to contribute to **AiVerse**! Whether you are a student, an open-source enthusiast, or a professional developer, your contributions help build the ultimate centralized encyclopedia of AI models, frameworks, datasets, and tools.

We welcome all forms of contribution, including UI/UX enhancements, new database entries, backend optimizations, documentation, and [bug reports](https://github.com/Frozen-47/AiVerse/issues).

---

## 🗺️ Areas You Can Help With

### 🎨 Frontend Development
* **Modern UI Components**: Expanding the catalog grid, cards, sidebars, and onboarding screens.
* **Premium Styling & Animations**: Building fluid hover states, micro-interactions, and glassmorphism themes using **Tailwind CSS v4** and **Lenis**.
* **Responsive Layouts**: Optimizing accessibility and responsive screens for mobile, tablet, and high-DPI desktop viewports.

### ⚙️ Backend & API Integration
* **Database Management**: Building and optimizing Supabase tables, views, and index queries.
* **Row-Level Security (RLS)**: Writing secure database policies to protect user accounts and bookmark collections.
* **Groq Integration**: Enhancing the contextual system instructions, logic, and response caching for our custom AI Chat Widget assistant.

### 📝 Content & AI Curation
* **AI Tool Research**: Verifying and adding new AI tools, developer packages, datasets, and platforms.
* **Accuracy Checks**: Spotting outdated citations, broken official links, or incorrect licensing tags on existing database entries (open an [Issue](https://github.com/Frozen-47/AiVerse/issues)).

---

## 🛠️ Setting Up Your Local Environment

Follow these steps to run the AiVerse project on your local machine:

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **Git**

### 2. Fork and Clone
First, [fork the repository](https://github.com/Frozen-47/AiVerse) to your own GitHub account, then clone it locally:
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/AiVerse.git

# Move into the project directory
cd AiVerse
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of the project. You can copy the following template and replace the values with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
```
> [!NOTE]
> If you are working on the backend AI Chat Widget (`api/chat.ts`), you will also need a **Groq API Key** configured in your local environment as `GROQ_API_KEY`.

### 5. Start the Development Server
Run the local Vite server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 🚀 Git Workflow

Please follow this structured process to submit changes:

1. **Keep Synced**: Ensure your `main` branch is up to date with the upstream repository:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Branch Names**: Create a clean feature branch with a descriptive name:
   ```bash
   # For new features
   git checkout -b feature/your-feature-name
   
   # For bug fixes
   git checkout -b bugfix/your-bugfix-name
   ```
3. **Commit Guidelines**: Write clear, descriptive commit messages following the conventional format:
   - `feat: add compare arena page title and layout divider`
   - `fix: resolve command-k shortcut input blur issue`
   - `docs: update setup steps in contributing guide`
4. **Push & PR**: Push your changes to your fork and submit a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Request Review**: Open a [Pull Request](https://github.com/Frozen-47/AiVerse/pulls) against the `main` branch of the official repository. Provide a description of the changes and any visual previews (screenshots/GIFs) if you altered UI elements.

---

## 📏 Code Style Guidelines

- **TypeScript Strictness**: Always write explicit types and interfaces. Do not use `any` unless absolutely necessary.
- **Tailwind CSS v4 Style Utility**: Maintain clean inline classes using Tailwind CSS v4 styling rules. Leverage utility combinations in `index.css` for recurrent complex components (e.g. `.glass-search`, `.glow-card`).
- **Code Linters**: Run `npm run lint` before committing to catch any static analysis issues. Ensure your changes compile clean by running `npm run build` locally.

---

## 🤝 Code of Conduct

- **Be Respectful**: Encourage and support other contributors. Code reviews should be constructive and polite.
- **Accurate Submissions**: Ensure all new encyclopedia entries include correct citations and factual summaries. Do not submit spam or promotional placeholders.

Thank you for helping us make AI more accessible and understandable for everyone! 🚀✨
