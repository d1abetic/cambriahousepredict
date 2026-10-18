# Cambria Genesis Prediction - Royal House

A modular, high-performance Web3 prediction portal for **Cambria Genesis**, built with Next.js, TypeScript, and Tailwind CSS. Players inspect 8 noble houses of New Cambria, burn Silver to back their chosen faction, and share the victorious reward pool when the bi-weekly epoch resolves.

---

## 🏛️ Directory Structure

```
anti-gravity-software/
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── favicon.ico
│   └── images/
│       ├── houses/
│       │   ├── warwick.png
│       │   ├── montblanc.png
│       │   ├── dover.png
│       │   ├── eyras.png
│       │   ├── thornhill.png
│       │   ├── bloodstone.png
│       │   ├── armagnac.png
│       │   └── blackfort.png
│       └── bg-pattern.png
└── src/
    ├── types/
    │   └── index.ts
    ├── data/
    │   └── mockHouses.ts
    ├── context/
    │   └── WalletContext.tsx
    ├── components/
    │   ├── Header.tsx
    │   ├── OverviewSection.tsx
    │   ├── HouseGrid.tsx
    │   ├── HouseModal.tsx
    │   ├── SilverBurnPanel.tsx
    │   ├── HowItWorksSection.tsx
    │   └── AdminOverview.tsx
    └── pages/
        ├── _app.tsx
        ├── index.tsx
        └── admin/
            └── dashboard.tsx
```

---

## ⚙️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Cambria palette
- **Typography**: Cinzel (Medieval headers) & Inter (Modern UI)
- **Icons**: FontAwesome 6 (Medieval sigils and game icons)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## ⚔️ The Eight Noble Houses

| House | Capital City | Sigil | Top Guild Contributor | Lore Focus |
|---|---|---|---|---|
| **Warwick** | Oakhaven | Rook / Keep | Order of the Lion | Military legions & trade dominance |
| **Montblanc** | Frostpeak | Mountain / Peak | Frostguard Elite | Arcane vaults & mining nodes |
| **Dover** | Port Sable | Anchor | Tideborn Armada | Maritime commerce & naval warfare |
| **Eyras** | Verdant Reach | Feather | Greenwood Rangers | Deep wilderness & alchemy |
| **Thornhill** | Briarwood | Shield / Briar | Briar Knights | Borderland redoubts & defence |
| **Bloodstone** | Crimson Citadel | Flame | Crimson Legion | Gladiatorial combat & conquest |
| **Armagnac** | Sunspire | Solar Crest | Sunspire Clerics | Golden reserves & diplomacy |
| **Blackfort** | Shadowfen | Dark Keep | Shadow Syndicate | Covert ops & shadow intelligence |

---

## 📜 Prediction Protocol Rules

1. **Burn Limits**: Between **20,000** and **1,000,000 Silver** per prediction.
2. **Lock-In**: Exactly 1 House selection per round. Predictions cannot be modified once confirmed.
3. **Resolution**: Bi-weekly recurring epochs determine the reigning house based on treasury strength, guild influence, and asset net worth.
4. **Reward Distribution**: Winning predictors divide the prize pool in proportion to their burned Silver share.
