# ancora. — Milan-Born Fashion Exchange

> **"Wear. Swap. Repeat."**  
> A full-stack, mobile-first peer-to-peer fashion exchange built for students and young professionals across Italy with zero cash required.

---

## ✦ Features & Architecture

### 1. 105+ Seeded High-Fashion Items
A rich catalog curated across 6 categories with authentic Italian provenance, condition grades, measurements, and credit valuations:
- **Women (35 pieces):** Oversized virgin wool blazers, bias slip dresses, cashmere mocknecks, trench coats, pleated palazzo trousers, mohair cardigans, etc.
- **Men (25 pieces):** Heavyweight chore jackets, wide-leg cargos, shaggy dog sweaters, selvedge denim, flight bombers, etc.
- **Accessories (15 pieces):** Calfskin shoulder bags, silk scarves, tortoiseshell sunglasses, gold signet rings, leather loafers.
- **Kids (10 pieces):** Organic merino rompers, miniature trench coats, cable cardigans, corduroy dungarees.
- **Books (10 pieces):** Margiela retrospective, Milanese brutalism, Roland Barthes, Castiglioni monographs.
- **Household (10 pieces):** Murano swirl glass vases, terracotta lamps, Deruta ceramics, linen blankets.

### 2. Multi-Actor Engine (1-Click Switcher)
Instantly test the application from any perspective using the actor switcher in the profile modal:
- **Chiara Moretti (`@chiara_brera`):** Milan fashion student (140 credits, 24 completed swaps, 4.9 ★ rating).
- **Matteo Rossi (`@matteo_navigli`):** Product design researcher (65 credits, 12 completed swaps, 5.0 ★ rating).
- **Sofia Vismara (`@sofia_isola`):** Freelance stylist (90 credits, 19 completed swaps, 4.8 ★ rating).
- **Ancora Admin Studio (`@ancora_hq`):** Operations lead with full administrative access.

### 3. Swap Bag & Credit Engine
- **Algorithmic Credit Valuation Model:** Allotted credits are calculated using a 3-tier fair market index (€1 = 1 CR):
  - **35%** Original Retail Price
  - **45%** Resale Market Value
  - **10%** Seller Proposed Ask
- **Asynchronous Credit Flow:** Solves the 1-to-1 barter dilemma. Users earn credits when their garments find a home and spend credits to claim new fits.
- **Live Credit Ledger:** Tracks every transaction (earned rewards, listing bonuses, spent claims).
- **Interactive Bag Drawer:** Real-time credit deduction, delivery/locker input, and order confirmation.
- **"List a Piece" Wardrobe Studio:** Client-side photo processing and live valuation calculation granting **+10 provisional credits** immediately upon submission.

### 4. Admin Management Dashboard (`/admin` or via top bar)
- **KPI Metrics:** Total inventory, active listings, circulating credits, active swaps, completed claims.
- **Inventory Control:** Search, filter, toggle status (`available` / `reserved` / `swapped`), or delete any of the 105+ items.
- **Credit Ledger & Adjustment:** Direct credit grant/slash tool with audit logging for promotional bonuses or dispute resolutions.
- **Swap Orders Pipeline:** Advance orders across fulfillment stages (`Requested` → `Approved` → `Dispatched` → `Delivered` → `Completed`).
- **User & Review Moderation:** Manage members, reputation scores, and community feedback.

---

## ✦ Deployment to GitHub & Vercel (Using `haniahshariff02@gmail.com`)

The application is fully prepared for zero-config Vercel deployment with Next.js 14 App Router.

### Step 1: Create a New GitHub Repository
In your browser tab (signed in as `haniahshariff02@gmail.com`):
1. Go to **https://github.com/new**
2. Name the repository: `ancora`
3. Leave it Public (or Private) and **do not** check "Add a README" or ".gitignore" (these are already configured in the project).
4. Click **Create repository**.

### Step 2: Push Your Code
In your terminal, run:
```bash
# Add your GitHub repository as remote (replace YOUR_GITHUB_USERNAME with your GitHub handle)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ancora.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
In your Vercel tab (signed in with `haniahshariff02@gmail.com`):
1. Go to **https://vercel.com/new**
2. Click **Import** next to the `ancora` repository.
3. Keep the default settings (Framework: Next.js).
4. Click **Deploy**.
5. In ~45 seconds, your app will be live at `https://ancora-*.vercel.app`!

---

## ✦ Local Development

To run the Next.js app locally:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to view the Admin Studio.
