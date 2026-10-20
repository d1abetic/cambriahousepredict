# Cambria Genesis Prediction — Multi-Chamber Markets (Concept)

A modular, high-performance Web3 prediction portal engineered for **Cambria Genesis**, built with Next.js, TypeScript, and Tailwind CSS. The protocol implements **Concept: Multi-Chamber Prediction Markets**, drawing directly from the official [Cambria Genesis Charters & Territorial Lore](https://docs.cambria.gg/genesis/charters) to bring player speculation into every layer of New Cambria's geopolitical and factional conflict.

---

## 📖 Table of Contents

1. [Concept Overview & Architecture](#-concept-overview--architecture)
2. [Detailed Walkthrough of the Three Chambers](#-detailed-walkthrough-of-the-three-chambers)
   - [Chamber I: The Imperial Crown (Main Royalty Market)](#chamber-i--the-imperial-crown-main-royalty-market)
   - [Chamber II: Regional City Turf Wars (7 Concurrent Sub-Markets)](#chamber-ii--regional-city-turf-wars-7-concurrent-sub-markets)
   - [Chamber III: The Freeborn Disruption (High-Multiplier Upset Pool)](#chamber-iii--the-freeborn-disruption-high-multiplier-upset-pool)
3. [User Experience & Telemetry HUD](#-user-experience--telemetry-hud)
   - [Multi-Chamber Navigation Tabs](#multi-chamber-navigation-tabs)
   - [Active Predictions Floating Drawer](#active-predictions-floating-drawer)
   - [Restricted Admin Nobility Console](#restricted-admin-nobility-console)
4. [Official Charter Traits & Lore Integration](#-official-charter-traits--lore-integration)
5. [Directory Structure](#-directory-structure)
6. [Tech Stack](#-tech-stack)
7. [Getting Started & Local Testing](#-getting-started--local-testing)
8. [Prediction Protocol Rules & Math](#-prediction-protocol-rules--math)

---

## 🏛️ Concept Overview & Architecture

In New Cambria, the weekly epoch resolution isn't simply a one-dimensional coin toss; it is the culmination of raw economic output, guild combat dominance, high-tier artifact extraction, and regional city tax harvesting. 

**Concept** expands prediction from a single-choice vote into a **three-tier ecosystem** operating concurrently:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CAMBRIA GENESIS PREDICTION HUB                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│   CHAMBER I      │          │   CHAMBER II     │          │   CHAMBER III    │
│  Imperial Crown  │          │Regional Turf Wars│          │Freeborn Upset    │
│                  │          │                  │          │                  │
│ • 8 Noble Houses │          │ • 7 Tactical     │          │ • Non-Noble      │
│ • Capital City   │          │   City Offices   │          │   Settlers vs    │
│   Crown Seat     │          │ • Dreadfort (T5) │          │   Nobility       │
│ • Weekly Epoch   │          │ • Thorin's Peak  │          │ • High Odds      │
│   Resolution     │          │ • Mirewick Swamp │          │   (3.8x - 5.6x)  │
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

Players can diversify their Silver across all three chambers simultaneously, hedge house bets with regional city outcomes, or seek exponential multipliers in the Freeborn upset pool.

---

## ⚔️ Detailed Walkthrough of the Three Chambers

### Chamber I — The Imperial Crown (Main Royalty Market)

* **The Core Question**: *Which of the 8 Noble Houses claims the Crown Throne in Capital City at weekly epoch close?*
* **Game Mechanics**:
  * Capital City is the sovereign seat of power. The House that finishes the epoch with the highest aggregate treasury deposits, Viceroy tax revenues, and guild charter prestige claims the Imperial Crown.
  * Players back their house by **burning between 20,000 and 1,000,000 Silver**.
  * Silver burned in Chamber 1 is locked for the duration of the weekly round.
  * Backers of the victorious Crown House receive a pro-rata share of the Chamber 1 prize pool at epoch close.
* **Integrated Charter Traits**:
  * **House Warwick**: Dominant martial affinity (Swordsman & Crossbowman); controls central trade highways and holds the historical Capital City Crown claim (68 Viceroys).
  * **House Montblanc**: Crafting behemoth (Prospector & Mason) leveraging mountain mines and ancient arcane vaults (64 Viceroys).
  * **House Dover**: Naval armada and maritime syndicates (Fisher & Duelist) dominating coastal waters (62 Viceroys).
  * **House Eyras**: Wilderness herbalists and alchemists (Alchemist & Forester) harvesting rare swamp flora (59 Viceroys).
  * **House Thornhill**: Fortified borderland guardians (Axeman & Tanner) with high Viceroy representation (74 Viceroys).
  * **House Bloodstone**: Aggressive combat juggernauts (Spearman & Magus) dominating the ruthless gladiatorial rings (66 Viceroys).
  * **House Armagnac**: Opulent diplomats and cartographers (Cartographer & Chaplain) commanding golden reserves (61 Viceroys).
  * **House Blackfort**: Shadow-brokers and assassins (Duelist & Archer) thriving in the mist-laden Barrens (58 Viceroys).

---

### Chamber II — Regional City Turf Wars (7 Concurrent Sub-Markets)

* **The Core Question**: *Which House captures each specific regional City Office at epoch close?*
* **Game Mechanics**:
  * While the Imperial Crown is decided in Capital City, seven regional cities throughout New Cambria feature independent **City Offices**.
  * Houses generate local Influence by cashing in high-tier artifacts, fulfilling regional craft quotas, and maintaining garrison defense.
  * Players can select each individual city, inspect the real-time **Influence Breakdown**, and back contenders under dynamically adjusted odds.
* **Spotlight on Tactical Cities**:
  1. **Dreadfort (West · Inside the T5 Ring)**:
     * *Theme*: T5 High-Risk Combat Hub.
     * *Lore*: Situated within the lethal Tier-5 outer ring, Dreadfort is an ultra-hostile PvP zone where artifact extraction and combat cash-ins decide city control. Contested heavily by House Bloodstone and House Warwick.
  2. **Thorin's Peak (North · Mountain City)**:
     * *Theme*: Mining & Prospecting Hub (Tier 4 Wilderness).
     * *Lore*: Perched on frozen granite cliffs, Thorin's Peak controls the realm's deep mithril veins and blast smelting furnaces. Craft-heavy houses (Montblanc, Thornhill) compete via raw metal delivery quotas.
  3. **Mirewick (Southeast · The Swamps)**:
     * *Theme*: Alchemy & Swamp Wilderness (Tier 4 Wilderness).
     * *Lore*: A murky swamp outpost harboring dangerous botanical reagents. House Eyras and House Blackfort battle for harvest pipelines through botanical harvests and herbal bounties.
  4. **Capital City (East · Crown Seat)**: The imperial metropolitan center and high courts.
  5. **New Mortis (Northeast · The Barrens)**: Harbors Darken lineages, black-market contraband, and covert intelligence contracts.
  6. **Driftmoor (Southwest · Moors & Coasts)**: Open-sea shipping lanes, naval shipwrights, and coastal fishing fleets.
  7. **Archon's Rest (South · Archonlands)**: Pre-settlement archaeological ruins, sun-sanctuaries, and high diplomatic assemblies.
* **Dynamic Regional Odds Calculation**:
  * The odds multiplier for backing a House in a regional city is dynamically calculated based on its localized influence share:
    $$\text{Multiplier} = \max\left(1.40, \min\left(6.00, \frac{100}{\text{Influence \%}} \times 0.90\right)\right)$$
  * Dominant front-runners offer lower, safer payouts (e.g., 1.9x), while dark-horse houses trailing in influence offer massive multipliers (up to 6.0x).

---

### Chamber III — The Freeborn Disruption (High-Multiplier Upset Pool)

* **The Core Question**: *Will the non-chartered Freeborn faction disrupt noble house monopolies in regional hubs?*
* **Game Mechanics**:
  * In the official Crown Ledger, settlers without Noble Voyage I Charters are designated as **Freeborn**.
  * Freeborn settlers produce vital raw commodities and form outlaw coalitions to counter noble taxation and resource cartels.
  * Chamber 3 provides an **Asymmetric High-Multiplier Market** where players wager on insurgent disruptions or bet on the Nobility retaining ironclad hegemony:
* **Upset Pool Scenarios**:
  * **Freeborn Sovereign Insurgency (3.85x Multiplier)**: The unaligned Freeborn mobilize en masse to generate superior localized Influence, capturing at least one Regional City Office away from the 8 Noble Houses.
  * **Dreadfort Outlaw Hijack (5.60x Multiplier)**: Renegade mercenaries and unchartered outlaws storm the West T5 Dreadfort, completely unseating Bloodstone and Warwick from the combat hub.
  * **Mirewick Alchemical Blockade (4.75x Multiplier)**: Freeborn swamp raiders cut off reagent harvest routes, denying House Eyras and Blackfort their traditional monopoly.
  * **Ironclad Noble Hegemony Retained (1.32x Multiplier)**: The 8 Noble Houses suppress all insurgent activity and retain 100% control over all 7 City Offices and the Imperial Crown.

---

## 🖥️ User Experience & Telemetry HUD

### Multi-Chamber Navigation Tabs
* Located below the main banner on [`/predict`](http://localhost:3000/predict).
* Provides tabs for **Chamber I (Imperial Crown)**, **Chamber II (Regional Turf Wars)**, and **Chamber III (Freeborn Disruption)**.
* Displays real-time accumulated Silver metrics per chamber, distinctive factional badges, and triggers a fluid visual buffer screen during chamber switches.

### Active Predictions Floating Drawer
* Pinned to the bottom-left corner of the player view (`ActivePredictionsDrawer.tsx`).
* Appears automatically once any wager is placed in any chamber.
* Expandable accordion reveals:
  * Chamber classification tag (`crown`, `regional`, or `freeborn`).
  * Target house, city, or disruption scenario name.
  * Locked Silver amount.
  * Applied multiplier and total calculated estimated payout.
  * Aggregate portfolio estimated returns.

### Restricted Admin Nobility Console
* Accessible at [`/predict/admin`](http://localhost:3000/predict/admin).
* Protected by an interactive profile authentication modal:
  * Profile icon: `@cyberpunk` (`/ben.jpg`).
  * Secure 6-digit passcode authentication (`123456`).
* Once authenticated, administrators access:
  * **Multi-Chamber Metrics Cards**: Total Silver pools per chamber and aggregated protocol burns.
  * **Chamber II Tactical Telemetry Table**: Real-time status of all 7 regional cities, current leading house, and influence bar graphs.
  * **Chamber I Noble House Table**: Full breakdown of each House's Viceroy counts, revealed charter supply, dominant affinities, and home strongholds.
  * **Inspect Modal**: Deep economic inspection of individual house treasuries, registered guilds, and net worth.

---

## 📜 Official Charter Traits & Lore Integration

All house attributes in [`src/data/mockHouses.ts`](file:///c:/Users/22h2/Desktop/cambriahousepredict-main/src/data/mockHouses.ts) mirror the verified [Cambria Genesis Documentation](https://docs.cambria.gg/genesis/charters):

| House | Official Stronghold | Revealed Charters | Viceroy Bluebloods | Dominant Affinity |
| :--- | :--- | :---: | :---: | :--- |
| **Warwick** | Capital City (Crown Seat) | 479 | 68 / 512 | Martial: Swordsman & Crossbowman |
| **Montblanc** | Thorin's Peak (Mountain North) | 487 | 64 / 512 | Craft: Prospector & Mason |
| **Dover** | Driftmoor (Southwest Moors) | 487 | 62 / 512 | Craft & Martial: Fisher & Duelist |
| **Eyras** | Mirewick (Southeast Swamps) | 480 | 59 / 512 | Craft: Alchemist & Forester |
| **Thornhill** | Dreadfort Outskirts (West T5) | 510 | 74 / 512 | Martial & Craft: Axeman & Tanner |
| **Bloodstone** | Dreadfort Core (West T5) | 472 | 66 / 512 | Martial: Spearman & Magus |
| **Armagnac** | Archon's Rest (Archonlands) | 436 | 61 / 512 | Craft & Martial: Cartographer & Chaplain |
| **Blackfort** | New Mortis (The Barrens) | 466 | 58 / 512 | Martial: Duelist & Archer |

---

## 🏛️ Directory Structure

```
cambriahousepredict/
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
│   ├── ben.jpg                  # Admin profile avatar (@cyberpunk)
│   └── houses/                  # Official 8 Noble House pixel crests
│       ├── warwick.png
│       ├── montblanc.png
│       ├── dover.png
│       ├── eyras.png
│       ├── thornhill.png
│       ├── bloodstone.png
│       ├── armagnac.png
│       └── blackfort.png
└── src/
    ├── types/
    │   └── index.ts             # TypeScript definitions for Chambers, Cities, Upset Options
    ├── data/
    │   └── mockHouses.ts        # Official charter data, regional cities, and upset pools
    ├── context/
    │   ├── BufferContext.tsx    # Interactive buffer/loader state manager
    │   └── WalletContext.tsx    # Multi-chamber prediction engine, balances, and toasts
    ├── components/
    │   ├── Header.tsx           # Global header with wallet connect & route switching
    │   ├── OverviewSection.tsx  # Dynamic multi-chamber overview & epoch counters
    │   ├── ChamberTabs.tsx      # Multi-chamber switcher with ambient glow
    │   ├── HouseGrid.tsx        # Chamber I: 8 Noble Houses grid
    │   ├── RegionalWarsView.tsx # Chamber II: 7 Regional City Turf Wars
    │   ├── FreebornDisruptionView.tsx # Chamber III: High-multiplier upset pool
    │   ├── ActivePredictionsDrawer.tsx # Floating collapsible wagers HUD
    │   ├── HouseModal.tsx       # House detailed stats & Crown wager dialog
    │   ├── SilverBurnPanel.tsx  # Silver slider & preset burn submission
    │   ├── HowItWorksSection.tsx# Protocol mechanics, rules & FAQ
    │   ├── AdminLoginModal.tsx  # Restricted admin passcode login modal
    │   └── AdminOverview.tsx    # Administrative multi-chamber telemetry console
    └── pages/
        ├── _app.tsx             # Root application wrapper with context providers
        ├── index.tsx            # Root redirect to /predict
        ├── predict/
        │   ├── index.tsx        # Main Player Multi-Chamber prediction page
        │   └── admin.tsx        # Administrator restricted console page
        └── admin/
            └── dashboard.tsx    # Admin dashboard redirect to /predict/admin
```

---

## ⚙️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing across all chambers)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with bespoke New Cambria dark/gold palette
- **Typography**: Cinzel (Medieval serif headers) & Inter (Clean legible UI font)
- **Icons**: FontAwesome 6 Free (Sigils, combat icons, shields, and telemetry markers)

---

## 🚀 Getting Started & Local Testing

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

### 4. Access Live Portals
* **Player Multi-Chamber Portal**: [http://localhost:3000/predict](http://localhost:3000/predict)
  * Test switching between **Chamber I (Imperial Crown)**, **Chamber II (Regional Turf Wars)**, and **Chamber III (Freeborn Disruption)**.
  * Try burning Silver (between 20,000 and 1,000,000) on a noble house, a tactical city, or a Freeborn upset.
  * Check the **Locked Wagers Drawer** appearing in the bottom-left corner with real-time payout calculations.
* **Admin Nobility Console**: [http://localhost:3000/predict/admin](http://localhost:3000/predict/admin)
  * Click the `@cyberpunk` profile icon.
  * Enter the passcode: `123456`.
  * Review the cross-chamber telemetry cards, regional city influence rankings, and inspect individual house treasuries.

---

## 📜 Prediction Protocol Rules & Math

1. **Multi-Chamber Freedom**: Players may distribute their Silver balance across all three chambers in the same epoch.
2. **Burn Limits**: Minimum **20,000 Silver**, maximum **1,000,000 Silver** per prediction. This ensures significant skin-in-the-game while protecting market pools from total single-whale monopolization.
3. **Lock-In Rule**: Once Silver is pledged to a House or Upset scenario, it is permanently locked until epoch resolution.
4. **Resolution Schedule**: Epochs resolve in recurring weekly cycles based on on-chain game telemetry.
5. **Deflationary Burn**: All Silver burned within the prediction protocol is permanently removed from circulation, maintaining healthy economic balance within the New Cambria game economy.


