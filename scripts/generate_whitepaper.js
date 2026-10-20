const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_PATH = path.join(__dirname, '..', 'Cambria_Genesis_Prediction_Whitepaper.pdf');
const HOUSES_DIR = path.join(__dirname, '..', 'public', 'houses');

// Colors
const COLOR_PRIMARY = '#0f172a';      // Slate 900
const COLOR_SECONDARY = '#1e293b';    // Slate 800
const COLOR_GOLD = '#d97706';         // Amber 600
const COLOR_GOLD_LIGHT = '#f59e0b';   // Amber 500
const COLOR_GOLD_PALE = '#fef3c7';    // Amber 100
const COLOR_TEXT = '#1e293b';         // Dark body text
const COLOR_TEXT_MUTED = '#64748b';   // Muted slate
const COLOR_CYAN = '#0891b2';         // Cyan 600
const COLOR_ROSE = '#e11d48';         // Rose 600
const COLOR_EMERALD = '#059669';      // Emerald 600
const COLOR_BORDER = '#cbd5e1';       // Light gray border
const COLOR_BG_LIGHT = '#f8fafc';     // Light card bg

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 45, bottom: 45, left: 45, right: 45 },
  bufferPages: true,
  autoFirstPage: true,
});

const writeStream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(writeStream);

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_LEFT = 45;
const MARGIN_RIGHT = 45;
const PRINTABLE_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

// ==========================================
// HELPER DRAWING FUNCTIONS
// ==========================================

function drawSectionHeader(title, subtitle, tag = 'SECTION') {
  const currentY = doc.y;
  
  // Tag pill
  doc.rect(MARGIN_LEFT, currentY, 80, 14).fill(COLOR_GOLD_PALE);
  doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(8).text(tag, MARGIN_LEFT + 6, currentY + 3);
  
  // Main title
  doc.y = currentY + 18;
  doc.fillColor(COLOR_PRIMARY).font('Times-Bold').fontSize(18).text(title, MARGIN_LEFT, doc.y);
  
  if (subtitle) {
    doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(9.5).text(subtitle, MARGIN_LEFT, doc.y + 2);
  }
  
  // Decorative rule line
  const lineY = doc.y + 6;
  doc.moveTo(MARGIN_LEFT, lineY).lineTo(MARGIN_LEFT + PRINTABLE_WIDTH, lineY).strokeColor(COLOR_GOLD_LIGHT).lineWidth(1.2).stroke();
  doc.y = lineY + 12;
}

function drawSubheading(title) {
  doc.moveDown(0.4);
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(12).text(title);
  doc.moveDown(0.2);
}

function drawParagraph(text, options = {}) {
  doc.fillColor(options.color || COLOR_TEXT).font(options.font || 'Helvetica').fontSize(options.size || 9.5).text(text, {
    align: options.align || 'justify',
    lineGap: options.lineGap || 3.2,
    ...options,
  });
}

function drawCallout(x, y, width, height, title, text, borderColor = COLOR_GOLD, bgColor = COLOR_BG_LIGHT) {
  doc.rect(x, y, width, height).fillAndStroke(bgColor, borderColor);
  doc.rect(x, y, 4, height).fill(borderColor);
  
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(10).text(title, x + 12, y + 8);
  doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8.5).text(text, x + 12, y + 22, {
    width: width - 24,
    lineGap: 2.5,
  });
}

// ==========================================
// PAGE 1: TITLE & COVER PAGE
// ==========================================

// Top dark royal header frame
doc.rect(0, 0, PAGE_WIDTH, 260).fill(COLOR_PRIMARY);

// Gold border banner accent
doc.rect(0, 255, PAGE_WIDTH, 5).fill(COLOR_GOLD);

// Seal or Icon placeholder accent
doc.circle(PAGE_WIDTH / 2, 70, 32).fillAndStroke(COLOR_SECONDARY, COLOR_GOLD_LIGHT);
doc.fillColor(COLOR_GOLD_LIGHT).font('Times-Bold').fontSize(26).text('⚔', PAGE_WIDTH / 2 - 12, 54);

// Main Whitepaper Title
doc.fillColor('#ffffff').font('Times-Bold').fontSize(26).text('CAMBRIA GENESIS', 0, 115, { align: 'center' });
doc.fillColor(COLOR_GOLD_LIGHT).font('Times-Bold').fontSize(20).text('PREDICTION PROTOCOL', 0, 145, { align: 'center' });

doc.fillColor('#94a3b8').font('Helvetica').fontSize(11).text(
  'Multi-Chamber Decentralized Prediction Markets & Geopolitical Speculation Engine',
  0,
  175,
  { align: 'center' }
);

// Metadata badge inside dark area
doc.rect(PAGE_WIDTH / 2 - 140, 205, 280, 24).fillAndStroke(COLOR_SECONDARY, '#334155');
doc.fillColor('#e2e8f0').font('Helvetica-Bold').fontSize(8.5).text(
  'TECHNICAL WHITEPAPER v1.0 • GENESIS ARCHITECTURE • OCT 2026',
  PAGE_WIDTH / 2 - 140,
  212,
  { align: 'center', width: 280 }
);

// Body Section of Cover Page
doc.y = 285;

// Executive Teaser Box
doc.rect(MARGIN_LEFT, 285, PRINTABLE_WIDTH, 88).fillAndStroke(COLOR_BG_LIGHT, COLOR_GOLD);
doc.rect(MARGIN_LEFT, 285, 5, 88).fill(COLOR_GOLD);
doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(10).text('EXECUTIVE ABSTRACT', MARGIN_LEFT + 15, 297);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(9).text(
  'The Cambria Genesis Prediction Protocol bridges high-stakes on-chain prediction markets with the living territorial, economic, and martial dynamics of New Cambria. Rather than relying on static binary outcomes, the protocol introduces a multi-chamber architecture allowing players, guilds, and unaligned settlers to wager Silver across three synchronized fronts: The Imperial Crown Seat, 7 Regional City Turf Wars, and The Freeborn Disruption.',
  MARGIN_LEFT + 15,
  313,
  { width: PRINTABLE_WIDTH - 30, lineGap: 2.8 }
);

// Four Core Pillars Grid
doc.y = 390;
doc.fillColor(COLOR_PRIMARY).font('Times-Bold').fontSize(14).text('THE FOUR CORE PILLARS OF CONCEPT A', MARGIN_LEFT, doc.y);
doc.moveTo(MARGIN_LEFT, doc.y + 4).lineTo(MARGIN_LEFT + PRINTABLE_WIDTH, doc.y + 4).strokeColor(COLOR_BORDER).lineWidth(1).stroke();

const gridY = 415;
const colWidth = (PRINTABLE_WIDTH - 15) / 2;
const cardHeight = 85;

// Pillar 1: Chamber I
doc.rect(MARGIN_LEFT, gridY, colWidth, cardHeight).fillAndStroke('#fffbeb', COLOR_GOLD);
doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(10).text('I. THE IMPERIAL CROWN (MAIN)', MARGIN_LEFT + 10, gridY + 10);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8.5).text(
  'Weekly macro-market deciding which of the 8 Noble Houses captures the sovereign Crown Seat in Capital City at epoch close. Features 20,000 to 1,000,000 Silver burn bounds with strict lock-in.',
  MARGIN_LEFT + 10,
  gridY + 25,
  { width: colWidth - 20, lineGap: 2 }
);

// Pillar 2: Chamber II
doc.rect(MARGIN_LEFT + colWidth + 15, gridY, colWidth, cardHeight).fillAndStroke('#ecfeff', COLOR_CYAN);
doc.fillColor(COLOR_CYAN).font('Helvetica-Bold').fontSize(10).text('II. REGIONAL TURF WARS (7 CITIES)', MARGIN_LEFT + colWidth + 25, gridY + 10);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8.5).text(
  'Concurrent territorial sub-markets for Dreadfort (T5 combat ring), Thorin\'s Peak (mining hub), Mirewick (swamps), and regional strongholds. Dynamic odds computed from local influence stakes.',
  MARGIN_LEFT + colWidth + 25,
  gridY + 25,
  { width: colWidth - 20, lineGap: 2 }
);

// Pillar 3: Chamber III
doc.rect(MARGIN_LEFT, gridY + cardHeight + 12, colWidth, cardHeight).fillAndStroke('#fff1f2', COLOR_ROSE);
doc.fillColor(COLOR_ROSE).font('Helvetica-Bold').fontSize(10).text('III. THE FREEBORN DISRUPTION', MARGIN_LEFT + 10, gridY + cardHeight + 22);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8.5).text(
  'Asymmetric high-multiplier upset pools (3.8x to 5.6x) backing unaligned settlers and outlaw guerrillas against noble monopolies, or backing ironclad noble hegemony retention.',
  MARGIN_LEFT + 10,
  gridY + cardHeight + 37,
  { width: colWidth - 20, lineGap: 2 }
);

// Pillar 4: Deflationary Sink
doc.rect(MARGIN_LEFT + colWidth + 15, gridY + cardHeight + 12, colWidth, cardHeight).fillAndStroke('#f0fdf4', COLOR_EMERALD);
doc.fillColor(COLOR_EMERALD).font('Helvetica-Bold').fontSize(10).text('IV. DEFLATIONARY SILVER SINK', MARGIN_LEFT + colWidth + 25, gridY + cardHeight + 22);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8.5).text(
  'A stabilizing macroeconomic engine that incinerates burned Silver, protecting New Cambria from hyperinflation while rewarding victorious faction backers and funding the sovereign treasury.',
  MARGIN_LEFT + colWidth + 25,
  gridY + cardHeight + 37,
  { width: colWidth - 20, lineGap: 2 }
);

// Author & Organization Footer Card
const authY = 635;
doc.rect(MARGIN_LEFT, authY, PRINTABLE_WIDTH, 120).fillAndStroke(COLOR_BG_LIGHT, COLOR_BORDER);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(10.5).text('DOCUMENT SPECIFICATIONS & RECIPIENTS', MARGIN_LEFT + 15, authY + 12);

doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(9).text('Author & Lead Architect:', MARGIN_LEFT + 15, authY + 32);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9).text('Antigravity Autonomous Engineering & Game Economics Team', MARGIN_LEFT + 160, authY + 32);

doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(9).text('Target Audience & Stakeholders:', MARGIN_LEFT + 15, authY + 50);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9).text('BEN.ZZZ, Cambria Core Contributors, Guild Leaders & Investors', MARGIN_LEFT + 160, authY + 50);

doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(9).text('Protocol Reference:', MARGIN_LEFT + 15, authY + 68);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9).text('Cambria Genesis Official Charters (https://docs.cambria.gg/genesis/charters)', MARGIN_LEFT + 160, authY + 68);

doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(9).text('Current Implementation Status:', MARGIN_LEFT + 15, authY + 86);
doc.fillColor(COLOR_EMERALD).font('Helvetica-Bold').fontSize(9).text('Prototype Online & Built (Next.js 14, TypeScript, Tailwind, Buffer State Machine)', MARGIN_LEFT + 160, authY + 86);

// ==========================================
// PAGE 2: TABLE OF CONTENTS & SECTION 1
// ==========================================
doc.addPage();

drawSectionHeader('TABLE OF CONTENTS & EXECUTIVE SUMMARY', 'Strategic roadmap, problem statement, and MMORPG speculation philosophy');

// TOC Box
doc.rect(MARGIN_LEFT, doc.y, PRINTABLE_WIDTH, 140).fillAndStroke(COLOR_BG_LIGHT, COLOR_BORDER);
const tocStartY = doc.y + 10;
doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(9.5).text('TABLE OF CONTENTS', MARGIN_LEFT + 15, tocStartY);

const tocItems = [
  { num: '1.0', title: 'Executive Summary & MMORPG Speculation Theory', page: 'Page 2' },
  { num: '2.0', title: 'Genesis Charters & The Nobility System (8 Houses)', page: 'Page 3' },
  { num: '2.1', title: 'Combat & Crafting Affinities: The Tactical Roster', page: 'Page 4' },
  { num: '3.1', title: 'Chamber I — The Imperial Crown (Capital City Seat)', page: 'Page 5' },
  { num: '3.2', title: 'Chamber II — Regional City Turf Wars (7 Sub-Markets)', page: 'Page 6' },
  { num: '3.3', title: 'Chamber III — The Freeborn Disruption (Upset Pools)', page: 'Page 7' },
  { num: '4.0', title: 'Macroeconomic Design & Deflationary Silver Sink', page: 'Page 8' },
  { num: '5.0', title: 'Technical Architecture & Admin Oversight Console', page: 'Page 9' },
  { num: '6.0', title: 'Genesis Launch Sequence, Roadmap & Conclusion', page: 'Page 10' },
];

let tocY = tocStartY + 18;
for (let i = 0; i < tocItems.length; i++) {
  const item = tocItems[i];
  const colX = i < 5 ? MARGIN_LEFT + 15 : MARGIN_LEFT + PRINTABLE_WIDTH / 2 + 10;
  const itemY = i < 5 ? tocY + i * 20 : tocY + (i - 5) * 20;
  
  doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(8.5).text(item.num, colX, itemY);
  doc.fillColor(COLOR_PRIMARY).font('Helvetica').fontSize(8.5).text(item.title, colX + 22, itemY);
  doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica-Bold').fontSize(8).text(item.page, colX + 195, itemY);
}

doc.y = tocStartY + 155;

drawSubheading('1.0 Executive Summary: The Evolution of On-Chain Prediction');

drawParagraph(
  'Traditional decentralized prediction markets (such as Polymarket or Augur) suffer from a fundamental limitation: they exist as disconnected side-bets on external real-world events. Players wager, wait, and exit. There is no active agency, no in-world synergy, and zero feedback loop between the bettor and the outcome.'
);

doc.moveDown(0.3);

drawParagraph(
  'In New Cambria, the weekly epoch close is not an external arbitrary trigger; it is the living culmination of guild skirmishes, blast smelting furnace quotas, deep wilderness botanical harvesting, and high-stakes artifact cash-ins in lethal combat zones like Dreadfort. Prediction cannot be a one-dimensional binary vote—it must mirror the multi-layered factional war of the realm.'
);

doc.moveDown(0.4);

drawCallout(
  MARGIN_LEFT,
  doc.y,
  PRINTABLE_WIDTH,
  65,
  'THE THREE CORE ADVANTAGES OF MULTI-CHAMBER PREDICTION',
  '1. Agency Alignment: Guilds can actively fight to fulfill their wagers through in-game gameplay.\n2. Risk Diversification: Back low-volatility Crown candidates while hedging in high-multiplier Freeborn upsets.\n3. Deflationary Equilibrium: Removes millions of Silver from circulation every round, protecting the in-game economy.',
  COLOR_CYAN,
  '#f0fdfa'
);

doc.y += 75;

drawSubheading('1.1 The Geopolitical Landscape of New Cambria');

drawParagraph(
  'At the dawn of Genesis Voyage I, approximately 3,827 charters were revealed across 8 founding Noble Houses. Concurrently, 512 Viceroy bluebloods were bestowed with hereditary council seats. Yet, thousands of settlers remain unaligned—the Freeborn. When these three factions collide across 7 regional cities and the Crown Throne, a dynamic speculation engine emerges that engages every demographic of player—from casual spectators to hardcore PvP warlords.'
);

// ==========================================
// PAGE 3: GENESIS CHARTERS & 8 NOBLE HOUSES
// ==========================================
doc.addPage();

drawSectionHeader('GENESIS CHARTERS & THE NOBILITY SYSTEM', 'Detailed breakdown of Voyage I Charter supply, Viceroy distributions, and house archetypes', 'SECTION 2.0');

drawParagraph(
  'The bedrock of New Cambria\'s geopolitical power structure rests upon the official Voyage I Genesis Charters. Each House boasts distinct charter revealed counts, hereditary Viceroy blueblood seats (capped at 512 globally), and territorial home strongholds that define their initial influence footprint.'
);

doc.moveDown(0.4);

// Comprehensive Table of 8 Houses
const tableY = doc.y + 5;
const rowHeight = 38;
const cols = [
  { name: 'House', width: 85, align: 'left' },
  { name: 'Official Stronghold', width: 130, align: 'left' },
  { name: 'Charters', width: 55, align: 'center' },
  { name: 'Viceroys', width: 60, align: 'center' },
  { name: 'Dominant Affinity', width: 175, align: 'left' },
];

// Table Header
doc.rect(MARGIN_LEFT, tableY, PRINTABLE_WIDTH, 20).fill(COLOR_PRIMARY);
let headerX = MARGIN_LEFT;
for (const col of cols) {
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8).text(col.name, headerX + 5, tableY + 6, {
    width: col.width - 10,
    align: col.align,
  });
  headerX += col.width;
}

const housesData = [
  { id: 'warwick', name: 'Warwick', stronghold: 'Capital City (Crown Seat)', charters: '479', viceroys: '68 / 512', affinity: 'Martial: Swordsman & Crossbowman' },
  { id: 'montblanc', name: 'Montblanc', stronghold: 'Thorin\'s Peak (Mountain North)', charters: '487', viceroys: '64 / 512', affinity: 'Craft: Prospector & Mason' },
  { id: 'dover', name: 'Dover', stronghold: 'Driftmoor (Southwest Moors)', charters: '487', viceroys: '62 / 512', affinity: 'Craft & Martial: Fisher & Duelist' },
  { id: 'eyras', name: 'Eyras', stronghold: 'Mirewick (Southeast Swamps)', charters: '480', viceroys: '59 / 512', affinity: 'Craft: Alchemist & Forester' },
  { id: 'thornhill', name: 'Thornhill', stronghold: 'Dreadfort Outskirts (West T5)', charters: '510', viceroys: '74 / 512', affinity: 'Martial & Craft: Axeman & Tanner' },
  { id: 'bloodstone', name: 'Bloodstone', stronghold: 'Dreadfort Core (West T5)', charters: '472', viceroys: '66 / 512', affinity: 'Martial: Spearman & Magus' },
  { id: 'armagnac', name: 'Armagnac', stronghold: 'Archon\'s Rest (Archonlands)', charters: '436', viceroys: '61 / 512', affinity: 'Craft & Martial: Cartographer & Chaplain' },
  { id: 'blackfort', name: 'Blackfort', stronghold: 'New Mortis (The Barrens)', charters: '466', viceroys: '58 / 512', affinity: 'Martial: Duelist & Archer' },
];

let curY = tableY + 20;
for (let i = 0; i < housesData.length; i++) {
  const h = housesData[i];
  const isAlt = i % 2 === 1;
  doc.rect(MARGIN_LEFT, curY, PRINTABLE_WIDTH, rowHeight).fillAndStroke(isAlt ? COLOR_BG_LIGHT : '#ffffff', COLOR_BORDER);
  
  let colX = MARGIN_LEFT;
  
  // House Name with icon if available
  const imgPath = path.join(HOUSES_DIR, `${h.id}.png`);
  if (fs.existsSync(imgPath)) {
    try {
      doc.image(imgPath, colX + 4, curY + 4, { width: 28, height: 28 });
    } catch (e) {}
  }
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(8.5).text(h.name, colX + 35, curY + 13);
  colX += cols[0].width;
  
  // Stronghold
  doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8).text(h.stronghold, colX + 5, curY + 13, { width: cols[1].width - 10 });
  colX += cols[1].width;
  
  // Charters
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(8.5).text(h.charters, colX, curY + 13, { width: cols[2].width, align: 'center' });
  colX += cols[2].width;
  
  // Viceroys
  doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(8.5).text(h.viceroys, colX, curY + 13, { width: cols[3].width, align: 'center' });
  colX += cols[3].width;
  
  // Affinity
  doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(8).text(h.affinity, colX + 5, curY + 13, { width: cols[4].width - 10 });
  
  curY += rowHeight;
}

doc.y = curY + 15;

drawSubheading('2.1 Viceroy Hegemony & Voting Weight');
drawParagraph(
  'Viceroys represent the highest echelon of noble bloodlines, possessing disproportionate voting leverage during high court disputes and municipal tax ordinances. With only 512 Viceroys spanning the globe, House Thornhill holds the numerical lead (74 Viceroys), closely followed by Warwick (68) and Bloodstone (66). This concentration of bluebloods directly informs their base treasury inflows and makes them formidable contenders for the Imperial Crown.'
);

// ==========================================
// PAGE 4: FACTION SPECIALIZATIONS
// ==========================================
doc.addPage();

drawSectionHeader('TACTICAL ROSTER & FACTION ARTIFACTS', 'How martial combat, crafting pipelines, and geographic positioning influence predictions', 'SECTION 2.2');

drawParagraph(
  'Each House\'s primary affinity determines how its players generate localized Influence in the world. Bettors who understand these mechanics gain a massive analytical edge over casual predictors.'
);

doc.moveDown(0.3);

// 4 Grid cards for factions
const fColWidth = (PRINTABLE_WIDTH - 12) / 2;
const fCardH = 92;
let fY = doc.y + 6;

const factionHighlights = [
  {
    name: 'HOUSE WARWICK & HOUSE BLOODSTONE',
    type: 'The Martial Juggernauts',
    color: COLOR_GOLD,
    desc: 'Warwick excels in disciplined legion formations (Swordsmen & Crossbowmen) defending central highways, while Bloodstone dominates ruthless gladiatorial rings (Spearmen & Magi). Their players turn in combat bounty heads and raid artifacts, driving massive points in Dreadfort and Capital City.',
  },
  {
    name: 'HOUSE MONTBLANC & HOUSE THORNHILL',
    type: 'Industrial Forge & Borderland Defense',
    color: COLOR_CYAN,
    desc: 'Montblanc controls deep mithril veins and blast smelting furnaces (Prospectors & Masons), submitting massive raw ore quotas in Thorin\'s Peak. Thornhill provides fortified leather defense (Axemen & Tanners), holding the outer rings between civilized lands and Tier-5 wilderness.',
  },
  {
    name: 'HOUSE EYRAS & HOUSE DOVER',
    type: 'Wilderness Alchemy & Naval Armada',
    color: COLOR_EMERALD,
    desc: 'Eyras dominates botanical foraging and toxic potion synthesis (Alchemists & Foresters) in Mirewick\'s treacherous swamps. Dover controls open-sea fishing trawlers and naval duelists, generating huge maritime tariffs in Driftmoor and Archon\'s Rest.',
  },
  {
    name: 'HOUSE ARMAGNAC & HOUSE BLACKFORT',
    type: 'Court Diplomacy & Covert Shadows',
    color: COLOR_ROSE,
    desc: 'Armagnac leverages ancestral gold reserves and holy diplomacy (Cartographers & Chaplains) to win municipal votes. Blackfort operates clandestine intelligence syndicates and assassin contracts from New Mortis, thriving on covert sabotage and black-market contraband.',
  },
];

for (let i = 0; i < factionHighlights.length; i++) {
  const item = factionHighlights[i];
  const colIndex = i % 2;
  const rowIndex = Math.floor(i / 2);
  const x = MARGIN_LEFT + colIndex * (fColWidth + 12);
  const y = fY + rowIndex * (fCardH + 12);
  
  doc.rect(x, y, fColWidth, fCardH).fillAndStroke(COLOR_BG_LIGHT, item.color);
  doc.rect(x, y, 4, fCardH).fill(item.color);
  
  doc.fillColor(item.color).font('Helvetica-Bold').fontSize(8.5).text(item.type.toUpperCase(), x + 10, y + 8);
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9.5).text(item.name, x + 10, y + 19);
  doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8).text(item.desc, x + 10, y + 33, {
    width: fColWidth - 18,
    lineGap: 2.2,
  });
}

doc.y = fY + 2 * (fCardH + 12) + 15;

drawSubheading('2.3 Geographic Positioning as a Strategic Moat');
drawParagraph(
  'Because travel time, danger zones, and resource density vary across New Cambria, houses with home strongholds adjacent to high-risk hubs enjoy strategic advantages. Bloodstone\'s proximity to the Dreadfort core allows immediate respawn and reinforcement during T5 combat clashes. Conversely, Montblanc\'s mountain fortress provides uncontested control over the realm\'s only Tier-4 smelting blast furnaces.'
);

doc.moveDown(0.3);
drawCallout(
  MARGIN_LEFT,
  doc.y,
  PRINTABLE_WIDTH,
  55,
  'ANALYTICAL TAKEAWAY FOR PREDICTORS',
  'Predictions should not merely reflect house popularity. Smart bettors evaluate active world events: during high-PvP combat weekends, Bloodstone and Warwick surge; during crafting supply events, Montblanc and Dover dominate.',
  COLOR_GOLD,
  '#fffbeb'
);

// ==========================================
// PAGE 5: CHAMBER I — THE IMPERIAL CROWN
// ==========================================
doc.addPage();

drawSectionHeader('CHAMBER I: THE IMPERIAL CROWN', 'The sovereign macro-market: Which of the 8 Noble Houses captures the Throne?', 'SECTION 3.1');

drawParagraph(
  'Chamber I represents the primary sovereign prediction pool. At the start of each weekly epoch, players inspect the macroeconomic indicators of all 8 Noble Houses and burn Silver to back the house they believe will claim the Crown Seat in Capital City.'
);

doc.moveDown(0.4);

// Protocol Parameters Box
doc.rect(MARGIN_LEFT, doc.y, PRINTABLE_WIDTH, 115).fillAndStroke(COLOR_BG_LIGHT, COLOR_BORDER);
const paramStartY = doc.y + 10;
doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(10).text('CHAMBER I: OFFICIAL PROTOCOL PARAMETERS', MARGIN_LEFT + 15, paramStartY);

const params = [
  { label: 'Minimum Stake:', val: '20,000 Silver per prediction (prevents dust spam & ensures skin-in-the-game)' },
  { label: 'Maximum Stake:', val: '1,000,000 Silver per prediction (whales cannot unilaterally distort market pools)' },
  { label: 'Lock-In Rule:', val: '1 House selection per player round. Permanently locked upon confirmation.' },
  { label: 'Epoch Resolution:', val: 'Weekly cycle synced directly with in-game on-chain municipal ledger.' },
  { label: 'Payout Allocation:', val: '85% Victorious Backers, 10% Crown Treasury, 5% Deflationary Burn.' },
];

let pY = paramStartY + 18;
for (const p of params) {
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(8.5).text(p.label, MARGIN_LEFT + 15, pY);
  doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8.5).text(p.val, MARGIN_LEFT + 125, pY, { width: PRINTABLE_WIDTH - 140 });
  pY += 18;
}

doc.y = paramStartY + 125;

drawSubheading('3.1.1 Dividend Share Calculation Formula');
drawParagraph(
  'Predictors who correctly identify the victorious Crown House receive a pro-rata distribution of the net prize pool based on their proportion of burned Silver:'
);

doc.moveDown(0.3);

// Formula Box
const fBoxY = doc.y;
doc.rect(MARGIN_LEFT, fBoxY, PRINTABLE_WIDTH, 48).fillAndStroke('#f8fafc', COLOR_GOLD);
doc.fillColor(COLOR_PRIMARY).font('Times-Bold').fontSize(11).text(
  'Player Payout = ( Player Burned Silver / Total Victorious House Silver ) × Net Prize Pool',
  MARGIN_LEFT,
  fBoxY + 12,
  { align: 'center', width: PRINTABLE_WIDTH }
);
doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(8).text(
  'Where Net Prize Pool = Total Chamber 1 Burned Silver × 0.85 (after 10% Treasury allocation & 5% Burn)',
  MARGIN_LEFT,
  fBoxY + 30,
  { align: 'center', width: PRINTABLE_WIDTH }
);

doc.y = fBoxY + 62;

drawSubheading('3.1.2 Capital City Office Perks');
drawParagraph(
  'The Noble House that captures the Capital City Crown Seat unlocks immense in-game privileges for its members: a 15% discount on sovereign mint fees, priority registration for land office charters, and exclusive rights to dispatch royal peacekeepers along trade highways. This creates massive incentives for noble guild alliances to mobilize in-game assets to validate player predictions.'
);

// ==========================================
// PAGE 6: CHAMBER II — REGIONAL TURF WARS
// ==========================================
doc.addPage();

drawSectionHeader('CHAMBER II: REGIONAL CITY TURF WARS', '7 concurrent sub-markets: Tactical city offices, risk tiers, and dynamic odds', 'SECTION 3.2');

drawParagraph(
  'Beyond the Capital, New Cambria features seven distinct regional cities. Each city possesses its own autonomous City Office, granting localized tax collection, crafting discounts, and territory control. In Chamber II, players can place separate bets on which House will seize each specific stronghold.'
);

doc.moveDown(0.3);

// Regional Cities Table
const cityCols = [
  { name: 'City', width: 90 },
  { name: 'Region & Risk Tier', width: 110 },
  { name: 'Contending Lineages', width: 140 },
  { name: 'Leading House', width: 85 },
  { name: 'Est. Multiplier', width: 80 },
];

const cTableY = doc.y;
doc.rect(MARGIN_LEFT, cTableY, PRINTABLE_WIDTH, 18).fill(COLOR_CYAN);
let cHeadX = MARGIN_LEFT;
for (const col of cityCols) {
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8).text(col.name, cHeadX + 5, cTableY + 5, { width: col.width - 10 });
  cHeadX += col.width;
}

const cityData = [
  { name: 'Dreadfort', tier: 'West · T5 High-Risk Ring', contenders: 'Bloodstone (38%), Warwick (29%)', lead: 'Bloodstone', mult: '2.37x' },
  { name: 'Thorin\'s Peak', tier: 'North · Tier 4 Wilderness', contenders: 'Montblanc (44%), Thornhill (26%)', lead: 'Montblanc', mult: '2.05x' },
  { name: 'Mirewick', tier: 'Southeast · Tier 4 Wilderness', contenders: 'Eyras (41%), Blackfort (31%)', lead: 'Eyras', mult: '2.20x' },
  { name: 'Capital City', tier: 'East · Crown Protected', contenders: 'Warwick (36%), Armagnac (30%)', lead: 'Warwick', mult: '2.50x' },
  { name: 'New Mortis', tier: 'Northeast · The Barrens', contenders: 'Blackfort (43%), Bloodstone (32%)', lead: 'Blackfort', mult: '2.09x' },
  { name: 'Driftmoor', tier: 'Southwest · Moors & Coasts', contenders: 'Dover (47%), Warwick (25%)', lead: 'Dover', mult: '1.91x' },
  { name: 'Archon\'s Rest', tier: 'South · Crown Protected', contenders: 'Armagnac (45%), Dover (25%)', lead: 'Armagnac', mult: '2.00x' },
];

let curCY = cTableY + 18;
for (let i = 0; i < cityData.length; i++) {
  const c = cityData[i];
  const isAlt = i % 2 === 1;
  doc.rect(MARGIN_LEFT, curCY, PRINTABLE_WIDTH, 22).fillAndStroke(isAlt ? COLOR_BG_LIGHT : '#ffffff', COLOR_BORDER);
  
  let colX = MARGIN_LEFT;
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(8).text(c.name, colX + 5, curCY + 6);
  colX += cityCols[0].width;
  
  doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(7.5).text(c.tier, colX + 5, curCY + 6);
  colX += cityCols[1].width;
  
  doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(7.5).text(c.contenders, colX + 5, curCY + 6);
  colX += cityCols[2].width;
  
  doc.fillColor(COLOR_CYAN).font('Helvetica-Bold').fontSize(8).text(c.lead, colX + 5, curCY + 6);
  colX += cityCols[3].width;
  
  doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(8).text(c.mult, colX + 5, curCY + 6);
  
  curCY += 22;
}

doc.y = curCY + 15;

drawSubheading('3.2.1 Dynamic Odds Multiplier Algorithm');
drawParagraph(
  'Unlike traditional fixed-odds sportsbooks, Chamber II odds update in real time as players stake Silver and Houses deposit regional influence:'
);

doc.moveDown(0.3);

const dynBoxY = doc.y;
doc.rect(MARGIN_LEFT, dynBoxY, PRINTABLE_WIDTH, 42).fillAndStroke('#ecfeff', COLOR_CYAN);
doc.fillColor(COLOR_PRIMARY).font('Times-Bold').fontSize(11).text(
  'Dynamic Odds Multiplier = Max( 1.40, Min( 6.00, ( 100 / Local Influence % ) × 0.90 ) )',
  MARGIN_LEFT,
  dynBoxY + 14,
  { align: 'center', width: PRINTABLE_WIDTH }
);

doc.y = dynBoxY + 52;

drawParagraph(
  'This formula guarantees that heavy front-runners (e.g. 50% influence) yield safe, reliable returns (1.8x), while volatile underdogs (e.g. 15% influence) offer thrilling speculative returns (up to 5.4x–6.0x), attracting risk-tolerant capital.'
);

// ==========================================
// PAGE 7: CHAMBER III — FREEBORN DISRUPTION
// ==========================================
doc.addPage();

drawSectionHeader('CHAMBER III: THE FREEBORN DISRUPTION', 'Asymmetric high-multiplier upset pools: Outlaw insurgencies vs. noble hegemony', 'SECTION 3.3');

drawParagraph(
  'The Freeborn represent the unchartered majority of New Cambria. Excluded from noble charters and hereditary Viceroy privileges, the Freeborn organize underground cartels and outlaw militias to disrupt noble monopolies. Chamber III offers asymmetric high-multiplier wagers on these insurgencies.'
);

doc.moveDown(0.4);

// 4 Upset Cards
const upsetScenarios = [
  {
    title: 'FREEBORN SOVEREIGN INSURGENCY',
    subtitle: 'Freeborn Faction Captures ≥1 Regional City Office',
    mult: '3.85x Multiplier',
    color: COLOR_ROSE,
    desc: 'Unchartered settlers coordinate mass commodity donations and artifact cash-ins, out-influencing the 8 Noble Houses to seize at least one city council away from the aristocracy.',
  },
  {
    title: 'DREADFORT OUTLAW HIJACK',
    subtitle: 'Freeborn Guerrillas Strip T5 Control in Dreadfort',
    mult: '5.60x Multiplier',
    color: '#be123c',
    desc: 'Renegade outlaw bands overwhelm House Bloodstone and Warwick in the lethal West T5 combat hub, cashing in stolen high-tier relics to steal the Dreadfort City Office.',
  },
  {
    title: 'MIREWICK ALCHEMICAL BLOCKADE',
    subtitle: 'Freeborn Raiders Choke Swamp Harvest Pipelines',
    mult: '4.75x Multiplier',
    color: '#9f1239',
    desc: 'Insurgent foragers ambush trade caravans and extract rare botanical reagents, severing House Eyras and Blackfort from their traditional swamp monopoly.',
  },
  {
    title: 'IRONCLAD NOBLE HEGEMONY RETAINED',
    subtitle: 'The 8 Houses Maintain 100% Monopoly on All Offices',
    mult: '1.32x Multiplier',
    color: COLOR_GOLD,
    desc: 'The 8 Noble Houses successfully crush all dissident disruptions, retaining unbroken possession of all 7 City Offices and the Imperial Crown.',
  },
];

let uY = doc.y;
for (const u of upsetScenarios) {
  doc.rect(MARGIN_LEFT, uY, PRINTABLE_WIDTH, 58).fillAndStroke(COLOR_BG_LIGHT, u.color);
  doc.rect(MARGIN_LEFT, uY, 5, 58).fill(u.color);
  
  // Title & Multiplier
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(10).text(u.title, MARGIN_LEFT + 15, uY + 8);
  doc.fillColor(u.color).font('Helvetica-Bold').fontSize(10).text(u.mult, MARGIN_LEFT + PRINTABLE_WIDTH - 120, uY + 8, { width: 105, align: 'right' });
  
  doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica-Bold').fontSize(8).text(u.subtitle, MARGIN_LEFT + 15, uY + 21);
  doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8).text(u.desc, MARGIN_LEFT + 15, uY + 33, { width: PRINTABLE_WIDTH - 30, lineGap: 1.8 });
  
  uY += 66;
}

doc.y = uY + 8;

drawSubheading('3.3.1 Game-Theoretic Hedging for Noble Guilds');
drawParagraph(
  'Chamber III creates fascinating financial hedging dynamics. A noble guild heavily invested in defending House Eyras in Mirewick can hedge its treasury by placing a side-wager on the "Mirewick Alchemical Blockade". If they successfully defend the city, they win in-game tax rights; if they are ambushed and lose, their 4.75x payout cushions the economic blow.'
);

// ==========================================
// PAGE 8: MACROECONOMICS & SILVER SINK
// ==========================================
doc.addPage();

drawSectionHeader('MACROECONOMIC MODEL & SILVER SINK', 'Combating MMORPG inflation through permanent token incineration', 'SECTION 4.0');

drawParagraph(
  'Every MMORPG economy faces an existential challenge: runaway currency hyperinflation caused by player monster grinding, gold farming, and resource stockpiling. The Cambria Genesis Prediction Protocol operates as a premier **Macroeconomic Deflationary Sink**, turning speculative greed into permanent currency incineration.'
);

doc.moveDown(0.4);

// Tokenomics Split Graphic Box
const sBoxY = doc.y;
doc.rect(MARGIN_LEFT, sBoxY, PRINTABLE_WIDTH, 120).fillAndStroke(COLOR_BG_LIGHT, COLOR_BORDER);
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(11).text('CAPITAL DISTRIBUTION ARCHITECTURE PER EPOCH', MARGIN_LEFT + 15, sBoxY + 12);

// 3 visual bars
const barTotalW = PRINTABLE_WIDTH - 30;
const barY = sBoxY + 34;

// 85% bar
const w85 = barTotalW * 0.85;
doc.rect(MARGIN_LEFT + 15, barY, w85, 22).fill(COLOR_EMERALD);
doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('85% Victorious Predictor Dividend Pool', MARGIN_LEFT + 25, barY + 6);

// 10% bar
const w10 = barTotalW * 0.10;
doc.rect(MARGIN_LEFT + 15 + w85, barY, w10, 22).fill(COLOR_GOLD);
doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8).text('10% Treasury', MARGIN_LEFT + 20 + w85, barY + 6);

// 5% bar
const w5 = barTotalW * 0.05;
doc.rect(MARGIN_LEFT + 15 + w85 + w10, barY, w5, 22).fill(COLOR_ROSE);

// Legend & Explanations
doc.fillColor(COLOR_EMERALD).font('Helvetica-Bold').fontSize(8.5).text('• 85% Victorious Dividend:', MARGIN_LEFT + 15, sBoxY + 66);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8).text('Distributed pro-rata to players who correctly backed winning houses or upset outcomes.', MARGIN_LEFT + 140, sBoxY + 66);

doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(8.5).text('• 10% Sovereign Treasury:', MARGIN_LEFT + 15, sBoxY + 82);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8).text('Funds realm-wide public events, world boss bounty bounties, and server tournament prizes.', MARGIN_LEFT + 140, sBoxY + 82);

doc.fillColor(COLOR_ROSE).font('Helvetica-Bold').fontSize(8.5).text('• 5% Deflationary Burn:', MARGIN_LEFT + 15, sBoxY + 98);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8).text('Permanently incinerated from the smart contract, increasing the purchasing power of remaining Silver.', MARGIN_LEFT + 140, sBoxY + 98);

doc.y = sBoxY + 135;

drawSubheading('4.1 Quantitative Comparison with Web3 Prediction Norms');

// Comparison Table
const compCols = [
  { name: 'Feature Metric', width: 140 },
  { name: 'Standard AMM Prediction (Polymarket)', width: 180 },
  { name: 'Cambria Multi-Chamber Engine', width: 185 },
];

const compTableY = doc.y;
doc.rect(MARGIN_LEFT, compTableY, PRINTABLE_WIDTH, 18).fill(COLOR_PRIMARY);
let compHeadX = MARGIN_LEFT;
for (const col of compCols) {
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8).text(col.name, compHeadX + 5, compTableY + 5, { width: col.width - 10 });
  compHeadX += col.width;
}

const compRows = [
  { metric: 'Player In-Game Agency', standard: 'None (Passive observer)', cambria: 'High (Players fight to fulfill wagers)' },
  { metric: 'Game Token Deflation', standard: 'Zero (Stablecoins circulate)', cambria: 'High (5% burned forever, Silver sink)' },
  { metric: 'Market Granularity', standard: 'Single binary YES/NO questions', cambria: 'Concurrent (Crown, 7 Cities, Freeborn)' },
  { metric: 'Sovereign Treasury Funding', standard: 'Operator platform fee', cambria: 'Funds MMORPG world boss events & rewards' },
];

let curCompY = compTableY + 18;
for (let i = 0; i < compRows.length; i++) {
  const r = compRows[i];
  const isAlt = i % 2 === 1;
  doc.rect(MARGIN_LEFT, curCompY, PRINTABLE_WIDTH, 22).fillAndStroke(isAlt ? COLOR_BG_LIGHT : '#ffffff', COLOR_BORDER);
  
  let colX = MARGIN_LEFT;
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(8).text(r.metric, colX + 5, curCompY + 6);
  colX += compCols[0].width;
  
  doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(7.5).text(r.standard, colX + 5, curCompY + 6);
  colX += compCols[1].width;
  
  doc.fillColor(COLOR_EMERALD).font('Helvetica-Bold').fontSize(7.5).text(r.cambria, colX + 5, curCompY + 6);
  
  curCompY += 22;
}

// ==========================================
// PAGE 9: TECHNICAL ARCHITECTURE & ADMIN
// ==========================================
doc.addPage();

drawSectionHeader('TECHNICAL ARCHITECTURE & ADMIN CONSOLE', 'Production-ready software stack, telemetry state, and governance security', 'SECTION 5.0');

drawParagraph(
  'The prototype is built with modern, enterprise-grade web and Web3 technologies. Designed for seamless embedding into the Cambria game launcher or standalone browser portals.'
);

doc.moveDown(0.3);

// 3 Architecture Tiers
const tY = doc.y;
const tWidth = (PRINTABLE_WIDTH - 16) / 3;
const tHeight = 110;

// Tier 1: Frontend
doc.rect(MARGIN_LEFT, tY, tWidth, tHeight).fillAndStroke(COLOR_BG_LIGHT, COLOR_CYAN);
doc.rect(MARGIN_LEFT, tY, tWidth, 4).fill(COLOR_CYAN);
doc.fillColor(COLOR_CYAN).font('Helvetica-Bold').fontSize(9).text('TIER 1: CLIENT HUD', MARGIN_LEFT + 8, tY + 12);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(7.5).text(
  '• Next.js 14 Pages Router\n• Tailwind CSS medieval theme\n• BufferContext state machine (loading transitions)\n• ActivePredictionsDrawer persistent bottom-left HUD',
  MARGIN_LEFT + 8,
  tY + 28,
  { width: tWidth - 16, lineGap: 3 }
);

// Tier 2: State & Storage
doc.rect(MARGIN_LEFT + tWidth + 8, tY, tWidth, tHeight).fillAndStroke(COLOR_BG_LIGHT, COLOR_GOLD);
doc.rect(MARGIN_LEFT + tWidth + 8, tY, tWidth, 4).fill(COLOR_GOLD);
doc.fillColor(COLOR_GOLD).font('Helvetica-Bold').fontSize(9).text('TIER 2: WALLET CONTEXT', MARGIN_LEFT + tWidth + 16, tY + 12);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(7.5).text(
  '• Real-time Silver balance updates\n• Multi-chamber wagers dispatcher\n• Dynamic regional odds calculator\n• Mock adapter ready for on-chain contract swap',
  MARGIN_LEFT + tWidth + 16,
  tY + 28,
  { width: tWidth - 16, lineGap: 3 }
);

// Tier 3: Settlement
doc.rect(MARGIN_LEFT + 2 * (tWidth + 8), tY, tWidth, tHeight).fillAndStroke(COLOR_BG_LIGHT, COLOR_EMERALD);
doc.rect(MARGIN_LEFT + 2 * (tWidth + 8), tY, tWidth, 4).fill(COLOR_EMERALD);
doc.fillColor(COLOR_EMERALD).font('Helvetica-Bold').fontSize(9).text('TIER 3: ORACLE SETTLEMENT', MARGIN_LEFT + 2 * (tWidth + 8) + 8, tY + 12);
doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(7.5).text(
  '• Syncs weekly epoch block height\n• Reads in-game city office registries\n• Automated dividend payouts\n• Immutable audit trail logging',
  MARGIN_LEFT + 2 * (tWidth + 8) + 8,
  tY + 28,
  { width: tWidth - 16, lineGap: 3 }
);

doc.y = tY + tHeight + 15;

drawSubheading('5.1 Restricted Admin Nobility Oversight Console');
drawParagraph(
  'Administrators and core contributors access a dedicated command center at `/predict/admin` designed to monitor protocol solvency and prevent market manipulation:'
);

doc.moveDown(0.3);

// Admin Features List Box
doc.rect(MARGIN_LEFT, doc.y, PRINTABLE_WIDTH, 110).fillAndStroke(COLOR_BG_LIGHT, COLOR_BORDER);
const admStartY = doc.y + 10;
doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(10).text('KEY ADMINISTRATIVE CAPABILITIES', MARGIN_LEFT + 15, admStartY);

const admFeatures = [
  '• Profile Security: 6-digit passcode authentication modal tied to custom admin avatars (e.g. @cyberpunk).',
  '• Cross-Chamber Telemetry: Real-time aggregated pool counters for Chamber 1, Chamber 2, and Chamber 3.',
  '• Regional Sub-Market Inspection: Real-time influence progress bars and leading house tracking across all 7 cities.',
  '• Deep House Audit: Live treasury holdings, registered guild stakes, and net worth ($RSGP) evaluation.',
  '• Emergency Circuit Breaker: Ability to freeze wagers during unexpected server maintenance or rollbacks.',
];

let afY = admStartY + 18;
for (const af of admFeatures) {
  doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8).text(af, MARGIN_LEFT + 15, afY, { width: PRINTABLE_WIDTH - 30 });
  afY += 16;
}

// ==========================================
// PAGE 10: ROADMAP & CONCLUSION
// ==========================================
doc.addPage();

drawSectionHeader('GENESIS LAUNCH SEQUENCE & CONCLUSION', 'Production deployment phases, governance roadmap, and closing vision', 'SECTION 6.0');

drawParagraph(
  'The implementation of Concept A represents an immediate value multiplier for the Cambria Genesis ecosystem. Below is the structured roadmap for advancing from current prototype to full mainnet deployment.'
);

doc.moveDown(0.4);

// 3 Roadmap Milestones
const rY = doc.y;
const rCardH = 68;

const milestones = [
  {
    phase: 'PHASE 1: PROTOTYPE & TELEMETRY VALIDATION (CURRENT - COMPLETED)',
    badge: 'DELIVERED',
    badgeColor: COLOR_EMERALD,
    desc: 'Full Next.js responsive UI, Multi-Chamber Tabs, 8 Noble Houses grid, 7 Regional Cities view, Freeborn Disruption pool, Active Predictions HUD drawer, and Admin console with mock game adapters.',
  },
  {
    phase: 'PHASE 2: TESTNET SMART CONTRACTS & AUDITING (Q4 2026)',
    badge: 'NEXT PHASE',
    badgeColor: COLOR_CYAN,
    desc: 'Deployment of Solidity / Arbitrum Nova prediction vault contracts, ERC-20 Silver burn routers, automated Chainlink oracles for epoch close timestamps, and independent security audits.',
  },
  {
    phase: 'PHASE 3: MAINNET EPOCH SYNC & FACTION GOVERNANCE (GENESIS LAUNCH)',
    badge: 'PRODUCTION',
    badgeColor: COLOR_GOLD,
    desc: 'Full synchronization with New Cambria live game servers. In-game terminals in Capital City, Dreadfort, and Thorin\'s Peak directly opening the prediction HUD, with weekly automated Silver dividend payouts.',
  },
];

let curRY = rY;
for (const m of milestones) {
  doc.rect(MARGIN_LEFT, curRY, PRINTABLE_WIDTH, rCardH).fillAndStroke(COLOR_BG_LIGHT, m.badgeColor);
  doc.rect(MARGIN_LEFT, curRY, 5, rCardH).fill(m.badgeColor);
  
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(9).text(m.phase, MARGIN_LEFT + 15, curRY + 10);
  doc.rect(MARGIN_LEFT + PRINTABLE_WIDTH - 75, curRY + 8, 65, 14).fill(m.badgeColor);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(7).text(m.badge, MARGIN_LEFT + PRINTABLE_WIDTH - 75, curRY + 11, { width: 65, align: 'center' });
  
  doc.fillColor(COLOR_TEXT).font('Helvetica').fontSize(8).text(m.desc, MARGIN_LEFT + 15, curRY + 26, { width: PRINTABLE_WIDTH - 30, lineGap: 2 });
  
  curRY += rCardH + 10;
}

doc.y = curRY + 10;

drawSubheading('6.1 Concluding Vision');
drawParagraph(
  'By fusing the deep lore of New Cambria with an interactive, multi-tiered prediction economy, the Cambria Genesis Prediction Protocol elevates player immersion to unprecedented heights. Every artifact looted in Dreadfort, every ingot smelted in Thorin\'s Peak, and every potion brewed in Mirewick now carries tangible economic resonance across the prediction pools.'
);

doc.moveDown(0.3);

// Final Signature Card
doc.rect(MARGIN_LEFT, doc.y, PRINTABLE_WIDTH, 80).fillAndStroke(COLOR_PRIMARY, COLOR_GOLD);
const signY = doc.y + 12;

doc.fillColor(COLOR_GOLD_LIGHT).font('Times-Bold').fontSize(12).text('NEW CAMBRIA GENESIS • PREPARED EXCLUSIVELY FOR BEN.ZZZ', MARGIN_LEFT, signY, { align: 'center', width: PRINTABLE_WIDTH });
doc.fillColor('#94a3b8').font('Helvetica').fontSize(8.5).text('Prototype codebase, interactive components, and mock adapters are live on localhost:3000.', MARGIN_LEFT, signY + 20, { align: 'center', width: PRINTABLE_WIDTH });
doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('Ready for smart contract integration and mainnet deployment.', MARGIN_LEFT, signY + 36, { align: 'center', width: PRINTABLE_WIDTH });
doc.fillColor('#64748b').font('Helvetica').fontSize(7.5).text('© 2026 New Cambria Foundation & Protocol Architects. All rights reserved.', MARGIN_LEFT, signY + 54, { align: 'center', width: PRINTABLE_WIDTH });

// ==========================================
// RUNNING HEADERS & FOOTERS ON ALL PAGES
// ==========================================
const totalPages = doc.bufferedPageRange().count;

for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  
  // Skip header on cover page
  if (i > 0) {
    // Header
    doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica-Bold').fontSize(7.5).text(
      'CAMBRIA GENESIS PREDICTION PROTOCOL • CONCEPT WHITEPAPER',
      MARGIN_LEFT,
      25
    );
    doc.fillColor(COLOR_GOLD).font('Helvetica').fontSize(7.5).text(
      'MULTI-CHAMBER MARKETS',
      MARGIN_LEFT + PRINTABLE_WIDTH - 150,
      25,
      { width: 150, align: 'right' }
    );
    doc.moveTo(MARGIN_LEFT, 35).lineTo(MARGIN_LEFT + PRINTABLE_WIDTH, 35).strokeColor(COLOR_BORDER).lineWidth(0.6).stroke();
  }
  
  // Footer on all pages
  const footY = PAGE_HEIGHT - 35;
  doc.moveTo(MARGIN_LEFT, footY - 8).lineTo(MARGIN_LEFT + PRINTABLE_WIDTH, footY - 8).strokeColor(COLOR_BORDER).lineWidth(0.6).stroke();
  
  doc.fillColor(COLOR_TEXT_MUTED).font('Helvetica').fontSize(7.5).text(
    'CONFIDENTIAL • PREPARED FOR BEN.ZZZ & THE CAMBRIA COMMUNITY',
    MARGIN_LEFT,
    footY
  );
  
  doc.fillColor(COLOR_PRIMARY).font('Helvetica-Bold').fontSize(8).text(
    `Page ${i + 1} of ${totalPages}`,
    MARGIN_LEFT + PRINTABLE_WIDTH - 80,
    footY,
    { width: 80, align: 'right' }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log(`Whitepaper PDF successfully generated at: ${OUTPUT_PATH}`);
});
