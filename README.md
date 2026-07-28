# Weddingfolio — Wedding Celebration Landing Page

An interactive, high-performance wedding invitation & celebration website built with Vite, GSAP, and Lenis Smooth Scroll.

## 📁 Project Structure

```text
Wedingfolio/
├── public/                 # Static assets (images, backgrounds, audio)
│   ├── cosmos/             # Swirling image gallery assets
│   ├── gallery/            # Gallery photos
│   ├── haldi-bg/           # Event section backgrounds
│   ├── mehendi-bg/
│   ├── reception-bg/
│   ├── sangeet-bg/
│   ├── transitionstory/
│   └── wedding-bg/
├── src/                    # Application source code
│   ├── script.js           # GSAP animations, Lenis scroll, interactive logic
│   └── styles.css          # Design system & component styles
├── index.html              # Main HTML markup
├── package.json            # Project dependencies & scripts
├── vite.config.js          # Vite build configuration
└── vercel.json             # Vercel deployment configuration
```

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview build locally**:
   ```bash
   npm run preview
   ```

## 🌐 Hosting on Vercel

### Option 1: Vercel Dashboard (GitHub Integration)
1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." > "Project"**.
3. Import the `Wedingfolio` repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**.

### Option 2: Vercel CLI
1. Install Vercel CLI globally (if not installed):
   ```bash
   npm i -g vercel
   ```
2. Run `vercel` in the project root directory and follow the prompts:
   ```bash
   vercel
   ```
3. Deploy to production:
   ```bash
   vercel --prod
   ```