import { useState, useMemo } from 'react'

/* ──────────────────────────────────────────────────────
   MENTOR SELECTION CRITERIA
   ────────────────────────────────────────────────────── */
const MENTOR_CRITERIA = [
  { key: 'christian',    label: 'Mature Christian (Honest feedback)',            weight: 1, icon: '✝' },
  { key: 'values',       label: 'Demonstrates Core Values in life',             weight: 1, icon: '💎' },
  { key: 'breakthrough', label: 'Has executed personal breakthrough (Crucial)',  weight: 2, icon: '🚀' },
  { key: 'leadership',   label: 'Proven leadership qualities',                  weight: 1, icon: '👑' },
  { key: 'willing',      label: 'Willing to meet monthly & attend orientation', weight: 1, icon: '🤝' },
]

const MAX_WEIGHTED_SCORE = MENTOR_CRITERIA.reduce((sum, c) => sum + c.weight * 4, 0) // 24

function getRecommendation(score) {
  const pct = score / MAX_WEIGHTED_SCORE
  if (pct >= 0.8)  return { level: 'strong', label: 'Strong Match',     color: '#16a34a', bg: '#dcfce7', icon: '🟢' }
  if (pct >= 0.55) return { level: 'potential', label: 'Potential',      color: '#d97706', bg: '#fef3c7', icon: '🟡' }
  return                   { level: 'gaps', label: 'Gaps to Address',    color: '#dc2626', bg: '#fee2e2', icon: '🔴' }
}

function calcWeightedScore(ratings) {
  return MENTOR_CRITERIA.reduce((sum, c) => sum + (ratings[c.key] || 0) * c.weight, 0)
}

/* ──────────────────────────────────────────────────────
   GROWTH STAGE COMPUTATION
   ────────────────────────────────────────────────────── */
function getGrowthStage(roots, trunk, branches) {
  const hasRoots    = Boolean(roots.why || roots.how)
  const hasTrunk    = Boolean(trunk.name)
  const hasBranches = Boolean(branches.disc)
  const allComplete = roots.why && roots.how && trunk.name && branches.disc && branches.character

  if (allComplete)   return 4 // Flourishing
  if (hasBranches)   return 3 // Growing
  if (hasTrunk)      return 2 // Sapling
  if (hasRoots)      return 1 // Sprouting
  return 0                     // Seed
}

const STAGE_LABELS = ['Seed', 'Sprouting', 'Sapling', 'Growing', 'Flourishing']
const STAGE_COLORS = ['#94a3b8', '#d97706', '#b45309', '#16a34a', '#059669']

/* ──────────────────────────────────────────────────────
   SVG TREE COMPONENT — Botanical Illustration Style
   ────────────────────────────────────────────────────── */
function TreeVisualization({ stage, roots, trunk, branches, activeTab, onTabChange }) {
  return (
    <div className="lt-tree-container">
      <svg viewBox="0 0 340 440" className="lt-tree-svg">
        <defs>
          {/* Bark gradients */}
          <linearGradient id="barkMain" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B6914" />
            <stop offset="30%" stopColor="#6B4226" />
            <stop offset="60%" stopColor="#5C3317" />
            <stop offset="100%" stopColor="#3E2110" />
          </linearGradient>
          <linearGradient id="barkLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A0764A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6B4226" stopOpacity="0.1" />
          </linearGradient>
          {/* Canopy gradients */}
          <radialGradient id="leafDark" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#2D6A2E" />
            <stop offset="100%" stopColor="#1B4D1E" stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id="leafMid" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#388E3C" stopOpacity="0.7" />
          </radialGradient>
          <radialGradient id="leafBright" cx="60%" cy="30%">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.6" />
          </radialGradient>
          {/* Soil gradients */}
          <linearGradient id="topsoilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C3A1E" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8B6B47" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="subsoilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B6B47" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#C4A77D" stopOpacity="0.06" />
          </linearGradient>
          {/* Root gradient */}
          <linearGradient id="rootGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C3317" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3E2110" stopOpacity="0.5" />
          </linearGradient>
          {/* Glow filters */}
          <filter id="glowSoft"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="fruitGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        {/* ── SOIL LAYERS (always visible) ── */}
        <g className="lt-soil">
          {/* Ground line */}
          <path d="M10,310 Q80,306 170,308 Q260,310 330,306" fill="none" stroke="#5C3A1E" strokeWidth="1.5" opacity="0.3" />
          {/* Topsoil */}
          <rect x="10" y="308" width="320" height="50" rx="3" fill="url(#topsoilGrad)" />
          {/* Subsoil */}
          <rect x="10" y="358" width="320" height="72" rx="3" fill="url(#subsoilGrad)" />
          {/* Soil texture dots */}
          {[35,85,135,195,255,305, 55,120,175,230,285, 70,150,210,270].map((x, i) => (
            <circle key={`soil-${i}`} cx={x} cy={320 + (i % 5) * 18 + Math.sin(i * 2.7) * 8} r={0.8 + (i % 3) * 0.4}
              fill="#5C3A1E" opacity={0.08 + (i % 4) * 0.03} />
          ))}
          {/* Small pebbles */}
          <ellipse cx="80" cy="340" rx="4" ry="2.5" fill="#8B7355" opacity="0.12" />
          <ellipse cx="240" cy="355" rx="3" ry="2" fill="#8B7355" opacity="0.1" />
          <ellipse cx="140" cy="370" rx="3.5" ry="2" fill="#8B7355" opacity="0.08" />
        </g>

        {/* ── ROOTS (stage ≥ 1) ── */}
        <g
          className={`lt-tree-zone ${activeTab === 'roots' ? 'active' : ''} ${stage >= 1 ? 'grown' : 'dormant'}`}
          onClick={() => onTabChange('roots')}
          style={{ cursor: 'pointer' }}
        >
          {stage >= 1 ? (
            <>
              {/* Main left root — thick, organic curve */}
              <path d="M155,310 C140,318 110,325 85,335 C65,343 50,355 40,370 C35,378 42,385 55,380 C68,375 78,360 92,345 C105,332 120,322 145,315 Z"
                fill="url(#rootGrad)" className="lt-root-draw lt-root-a" />
              {/* Main right root */}
              <path d="M185,310 C200,318 230,325 255,335 C275,343 290,355 300,370 C305,378 298,385 285,380 C272,375 262,360 248,345 C235,332 220,322 195,315 Z"
                fill="url(#rootGrad)" className="lt-root-draw lt-root-b" />
              {/* Center taproot */}
              <path d="M162,312 C158,330 155,355 150,385 C148,395 165,395 168,385 C172,355 175,330 178,312 Z"
                fill="url(#rootGrad)" className="lt-root-draw lt-root-c" />
              {/* Thin root tendrils */}
              <path d="M65,358 C55,365 42,375 35,390" stroke="#5C3317" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" className="lt-root-tendril" />
              <path d="M275,358 C285,365 298,375 305,390" stroke="#5C3317" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" className="lt-root-tendril" />
              <path d="M100,365 C90,375 78,382 70,400" stroke="#5C3317" strokeWidth="1" fill="none" opacity="0.25" strokeLinecap="round" className="lt-root-tendril" />
              <path d="M240,365 C250,375 262,382 270,400" stroke="#5C3317" strokeWidth="1" fill="none" opacity="0.25" strokeLinecap="round" className="lt-root-tendril" />
              <path d="M130,380 C120,392 112,402 108,418" stroke="#5C3317" strokeWidth="0.8" fill="none" opacity="0.2" strokeLinecap="round" className="lt-root-tendril" />
              <path d="M210,380 C220,392 228,402 232,418" stroke="#5C3317" strokeWidth="0.8" fill="none" opacity="0.2" strokeLinecap="round" className="lt-root-tendril" />

              {/* Root data labels — wooden sign style */}
              {roots.why && (
                <g className="lt-sign lt-sign-left">
                  <rect x="18" y="388" width={Math.min(roots.why.length * 5.5 + 16, 120)} height="20" rx="3" fill="rgba(92,51,23,0.12)" stroke="#5C3317" strokeWidth="0.5" opacity="0.7" />
                  <text x="26" y="402" className="lt-sign-text">{roots.why.slice(0, 18)}{roots.why.length > 18 ? '…' : ''}</text>
                </g>
              )}
              {roots.how && (
                <g className="lt-sign lt-sign-right">
                  <rect x={322 - Math.min(roots.how.length * 5.5 + 16, 120)} y="388" width={Math.min(roots.how.length * 5.5 + 16, 120)} height="20" rx="3" fill="rgba(92,51,23,0.12)" stroke="#5C3317" strokeWidth="0.5" opacity="0.7" />
                  <text x={330 - Math.min(roots.how.length * 5.5 + 16, 120) + 8} y="402" className="lt-sign-text">{roots.how.slice(0, 18)}{roots.how.length > 18 ? '…' : ''}</text>
                </g>
              )}
            </>
          ) : (
            /* Seed state — detailed seed shape */
            <g className="lt-seed-group">
              <ellipse cx="170" cy="340" rx="14" ry="9" fill="#5C3317" opacity="0.2" className="lt-seed" />
              <path d="M163,340 C165,335 170,332 175,335 C178,337 176,343 172,344 C168,345 164,343 163,340 Z"
                fill="#3E2110" opacity="0.3" className="lt-seed" />
              <line x1="168" y1="336" x2="170" y2="341" stroke="#2A1508" strokeWidth="0.5" opacity="0.2" />
            </g>
          )}

          {/* Hotspot highlight */}
          {activeTab === 'roots' && (
            <rect x="15" y="305" width="310" height="125" rx="12" fill="rgba(0,85,140,0.04)" stroke="var(--navy)" strokeWidth="1.5" strokeDasharray="6 4" className="lt-zone-highlight" />
          )}
        </g>

        {/* ── TRUNK (stage ≥ 2) ── */}
        <g
          className={`lt-tree-zone ${activeTab === 'trunk' ? 'active' : ''} ${stage >= 2 ? 'grown' : 'dormant'}`}
          onClick={() => onTabChange('trunk')}
          style={{ cursor: 'pointer' }}
        >
          {stage >= 2 ? (
            <>
              {/* Main trunk — tapered, organic shape */}
              <path d="M145,310 C140,290 135,260 133,230 C131,205 134,185 140,170 C144,160 148,155 155,150 L185,150 C192,155 196,160 200,170 C206,185 209,205 207,230 C205,260 200,290 195,310 Z"
                fill="url(#barkMain)" className="lt-trunk-grow" />
              {/* Bark highlight layer */}
              <path d="M150,305 C148,280 145,250 144,225 C143,200 146,182 152,168 L162,158 L170,158 C168,170 164,190 163,215 C162,245 160,280 158,305 Z"
                fill="url(#barkLight)" className="lt-trunk-grow" />
              {/* Bark texture — grain lines */}
              <path d="M152,300 C150,275 148,250 150,225 C151,210 153,195 155,185" stroke="#3E2110" strokeWidth="0.7" fill="none" opacity="0.25" />
              <path d="M165,295 C163,270 161,240 163,215 C164,195 166,180 170,168" stroke="#3E2110" strokeWidth="0.5" fill="none" opacity="0.2" />
              <path d="M180,298 C182,275 184,248 183,222 C182,200 179,182 176,170" stroke="#3E2110" strokeWidth="0.6" fill="none" opacity="0.18" />
              <path d="M190,290 C192,268 193,245 191,225 C190,208 187,192 184,178" stroke="#3E2110" strokeWidth="0.4" fill="none" opacity="0.15" />
              {/* Knot detail */}
              <ellipse cx="165" cy="250" rx="4" ry="6" fill="none" stroke="#3E2110" strokeWidth="0.8" opacity="0.2" />
              <ellipse cx="178" cy="220" rx="3" ry="4" fill="none" stroke="#3E2110" strokeWidth="0.6" opacity="0.15" />

              {/* Trunk data label — wooden sign */}
              {trunk.name && (
                <g className="lt-sign lt-trunk-sign">
                  <rect x="112" y="255" width="116" height="24" rx="4" fill="rgba(92,51,23,0.18)" stroke="#6B4226" strokeWidth="0.8" />
                  <line x1="105" y1="267" x2="112" y2="267" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  <text x="170" y="271" textAnchor="middle" className="lt-sign-text lt-sign-trunk">{trunk.name.slice(0, 16)}</text>
                </g>
              )}
            </>
          ) : stage >= 1 ? (
            /* Sprouting — thin stem with two tiny leaves */
            <g className="lt-sprout">
              <rect x="167" y="285" width="6" height="28" rx="3" fill="#5C3317" opacity="0.45" className="lt-sprout-stem" />
              <path d="M167,287 C160,280 155,275 158,270 C161,265 167,272 167,280 Z" fill="#81C784" opacity="0.5" className="lt-sprout-leaf lt-sprout-leaf-l" />
              <path d="M173,290 C180,283 185,278 182,273 C179,268 173,275 173,283 Z" fill="#81C784" opacity="0.4" className="lt-sprout-leaf lt-sprout-leaf-r" />
            </g>
          ) : null}

          {activeTab === 'trunk' && stage >= 2 && (
            <rect x="120" y="145" width="100" height="170" rx="12" fill="rgba(180,83,9,0.04)" stroke="#b45309" strokeWidth="1.5" strokeDasharray="6 4" className="lt-zone-highlight" />
          )}
        </g>

        {/* ── BRANCHES (stage ≥ 3) ── */}
        <g className={`lt-tree-zone ${stage >= 3 ? 'grown' : 'dormant'}`}>
          {stage >= 3 && (
            <>
              {/* Main branch left */}
              <path d="M140,195 C125,185 105,178 85,175 C72,173 62,178 60,185"
                stroke="#6B4226" strokeWidth="6" strokeLinecap="round" fill="none" className="lt-branch-draw lt-branch-1" />
              {/* Main branch right */}
              <path d="M200,195 C215,185 235,178 255,175 C268,173 278,178 280,185"
                stroke="#6B4226" strokeWidth="6" strokeLinecap="round" fill="none" className="lt-branch-draw lt-branch-2" />
              {/* Upper left branch */}
              <path d="M143,178 C128,168 108,160 90,155 C78,152 70,158 70,165"
                stroke="#6B4226" strokeWidth="4.5" strokeLinecap="round" fill="none" className="lt-branch-draw lt-branch-3" />
              {/* Upper right branch */}
              <path d="M197,178 C212,168 232,160 250,155 C262,152 270,158 270,165"
                stroke="#6B4226" strokeWidth="4.5" strokeLinecap="round" fill="none" className="lt-branch-draw lt-branch-4" />
              {/* Top branches */}
              <path d="M150,165 C140,152 125,140 110,135 C100,132 95,138 98,145"
                stroke="#6B4226" strokeWidth="3.5" strokeLinecap="round" fill="none" className="lt-branch-draw lt-branch-5" />
              <path d="M190,165 C200,152 215,140 230,135 C240,132 245,138 242,145"
                stroke="#6B4226" strokeWidth="3.5" strokeLinecap="round" fill="none" className="lt-branch-draw lt-branch-6" />
              {/* Crown branch */}
              <path d="M163,155 C160,140 158,125 160,110 C162,100 168,95 175,100 C180,105 180,120 178,140"
                stroke="#6B4226" strokeWidth="3" strokeLinecap="round" fill="none" className="lt-branch-draw lt-branch-7" />
            </>
          )}
        </g>

        {/* ── CANOPY / LEAVES (stage ≥ 3) ── */}
        <g
          className={`lt-tree-zone ${activeTab === 'branches' ? 'active' : ''} ${stage >= 3 ? 'grown' : 'dormant'}`}
          onClick={() => onTabChange('branches')}
          style={{ cursor: 'pointer' }}
        >
          {stage >= 3 && (
            <>
              {/* Back leaf clusters (darker, creates depth) */}
              <g className="lt-leaf-cluster lt-cluster-back">
                <path d="M55,178 C48,170 42,160 48,152 C54,144 65,148 68,158 C71,168 65,178 55,178 Z" fill="url(#leafDark)" opacity="0.5" />
                <path d="M85,148 C78,140 72,128 78,120 C84,112 95,118 98,128 C101,138 93,150 85,148 Z" fill="url(#leafDark)" opacity="0.45" />
                <path d="M255,148 C262,140 268,128 262,120 C256,112 245,118 242,128 C239,138 247,150 255,148 Z" fill="url(#leafDark)" opacity="0.45" />
                <path d="M285,178 C292,170 298,160 292,152 C286,144 275,148 272,158 C269,168 275,178 285,178 Z" fill="url(#leafDark)" opacity="0.5" />
              </g>

              {/* Mid leaf clusters */}
              <g className="lt-leaf-cluster lt-cluster-mid">
                {/* Left cluster */}
                <path d="M60,185 C50,175 45,162 52,152 C59,142 72,150 75,162 C78,174 68,188 60,185 Z" fill="url(#leafMid)" className="lt-leaf-shape lt-ls-1" />
                <path d="M75,160 C68,148 65,135 72,128 C79,121 90,130 92,142 C94,154 82,165 75,160 Z" fill="url(#leafMid)" className="lt-leaf-shape lt-ls-2" />
                <path d="M95,140 C90,128 88,115 95,108 C102,101 112,112 112,125 C112,138 102,145 95,140 Z" fill="url(#leafMid)" className="lt-leaf-shape lt-ls-3" />
                {/* Right cluster */}
                <path d="M280,185 C290,175 295,162 288,152 C281,142 268,150 265,162 C262,174 272,188 280,185 Z" fill="url(#leafMid)" className="lt-leaf-shape lt-ls-4" />
                <path d="M265,160 C272,148 275,135 268,128 C261,121 250,130 248,142 C246,154 258,165 265,160 Z" fill="url(#leafMid)" className="lt-leaf-shape lt-ls-5" />
                <path d="M245,140 C250,128 252,115 245,108 C238,101 228,112 228,125 C228,138 238,145 245,140 Z" fill="url(#leafMid)" className="lt-leaf-shape lt-ls-6" />
                {/* Center top cluster */}
                <path d="M150,115 C142,102 140,85 148,78 C156,71 168,80 170,95 C172,110 158,120 150,115 Z" fill="url(#leafMid)" className="lt-leaf-shape lt-ls-7" />
                <path d="M190,115 C198,102 200,85 192,78 C184,71 172,80 170,95 C168,110 182,120 190,115 Z" fill="url(#leafMid)" className="lt-leaf-shape lt-ls-8" />
              </g>

              {/* Front leaf clusters (brightest, top layer) */}
              <g className="lt-leaf-cluster lt-cluster-front">
                <path d="M108,155 C100,145 98,130 105,122 C112,114 122,125 122,138 C122,151 115,160 108,155 Z" fill="url(#leafBright)" className="lt-leaf-shape lt-ls-9" />
                <path d="M130,128 C124,116 124,100 132,92 C140,84 148,96 146,112 C144,128 136,135 130,128 Z" fill="url(#leafBright)" className="lt-leaf-shape lt-ls-10" />
                <path d="M170,88 C165,75 166,58 174,52 C182,46 188,60 186,76 C184,92 176,96 170,88 Z" fill="url(#leafBright)" className="lt-leaf-shape lt-ls-11" />
                <path d="M210,128 C216,116 216,100 208,92 C200,84 192,96 194,112 C196,128 204,135 210,128 Z" fill="url(#leafBright)" className="lt-leaf-shape lt-ls-12" />
                <path d="M232,155 C240,145 242,130 235,122 C228,114 218,125 218,138 C218,151 225,160 232,155 Z" fill="url(#leafBright)" className="lt-leaf-shape lt-ls-13" />
              </g>

              {/* Leaf vein details */}
              <g opacity="0.12" strokeWidth="0.5" stroke="#1B4D1E" fill="none">
                <line x1="65" y1="168" x2="58" y2="158" />
                <line x1="82" y1="145" x2="78" y2="132" />
                <line x1="260" y1="145" x2="262" y2="132" />
                <line x1="170" y1="95" x2="170" y2="78" />
              </g>

              {/* ── FLOURISHING: animated leaves & fruit (stage 4) ── */}
              {stage >= 4 && (
                <g className="lt-flourish">
                  {/* Animated individual swaying leaves */}
                  <path d="M92,120 C88,112 90,102 96,100 C102,98 104,108 100,116 Z" fill="#66BB6A" opacity="0.7" className="lt-sway-leaf lt-sl-1" />
                  <path d="M248,120 C252,112 250,102 244,100 C238,98 236,108 240,116 Z" fill="#66BB6A" opacity="0.7" className="lt-sway-leaf lt-sl-2" />
                  <path d="M155,68 C150,60 152,50 158,48 C164,46 166,56 162,64 Z" fill="#A5D6A7" opacity="0.6" className="lt-sway-leaf lt-sl-3" />
                  <path d="M200,98 C206,90 210,80 204,76 C198,72 194,82 196,92 Z" fill="#81C784" opacity="0.55" className="lt-sway-leaf lt-sl-4" />
                  <path d="M115,165 C108,158 106,148 112,144 C118,140 122,150 118,160 Z" fill="#A5D6A7" opacity="0.5" className="lt-sway-leaf lt-sl-5" />

                  {/* Fruit — small pear/apple shapes */}
                  <g filter="url(#fruitGlow)">
                    <path d="M105,130 C102,124 104,118 108,116 C112,114 115,118 114,124 C113,128 108,132 105,130 Z" fill="#F9A825" opacity="0.85" className="lt-fruit lt-fruit-1" />
                    <line x1="108" y1="116" x2="110" y2="112" stroke="#795548" strokeWidth="0.8" />
                    <path d="M238,130 C241,124 239,118 235,116 C231,114 228,118 229,124 C230,128 235,132 238,130 Z" fill="#F9A825" opacity="0.85" className="lt-fruit lt-fruit-2" />
                    <line x1="235" y1="116" x2="233" y2="112" stroke="#795548" strokeWidth="0.8" />
                    <path d="M170,65 C167,60 169,54 173,52 C177,50 179,54 178,60 C177,64 173,67 170,65 Z" fill="#FF8F00" opacity="0.8" className="lt-fruit lt-fruit-3" />
                    <line x1="173" y1="52" x2="174" y2="48" stroke="#795548" strokeWidth="0.7" />
                  </g>

                  {/* Tiny flower buds */}
                  <g className="lt-flowers">
                    <circle cx="78" cy="142" r="3" fill="#FFAB91" opacity="0.6" />
                    <circle cx="78" cy="142" r="1.2" fill="#FF7043" opacity="0.5" />
                    <circle cx="262" cy="142" r="3" fill="#FFAB91" opacity="0.6" />
                    <circle cx="262" cy="142" r="1.2" fill="#FF7043" opacity="0.5" />
                    <circle cx="148" cy="78" r="2.5" fill="#F8BBD0" opacity="0.5" />
                    <circle cx="148" cy="78" r="1" fill="#E91E63" opacity="0.3" />
                  </g>
                </g>
              )}

              {/* Canopy data labels */}
              {branches.disc && (
                <g className="lt-sign lt-canopy-sign">
                  <rect x="130" y="108" width="80" height="22" rx="6" fill="rgba(255,255,255,0.85)" stroke="rgba(22,163,74,0.25)" strokeWidth="1" />
                  <text x="170" y="123" textAnchor="middle" className="lt-sign-text lt-sign-canopy">DISC: {branches.disc}</text>
                </g>
              )}
              {branches.character && (
                <g className="lt-sign lt-char-sign">
                  <rect x="123" y="133" width="94" height="18" rx="5" fill="rgba(255,255,255,0.7)" stroke="rgba(22,163,74,0.15)" strokeWidth="0.8" />
                  <text x="170" y="146" textAnchor="middle" className="lt-sign-text lt-sign-char">{branches.character}</text>
                </g>
              )}
            </>
          )}

          {activeTab === 'branches' && stage >= 3 && (
            <rect x="40" y="42" width="260" height="155" rx="16" fill="rgba(22,163,74,0.04)" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="6 4" className="lt-zone-highlight" />
          )}
        </g>

        {/* ── STAGE BADGE ── */}
        <g className="lt-stage-badge">
          <rect x="120" y="4" width="100" height="26" rx="13" fill={STAGE_COLORS[stage]} opacity="0.12" />
          <text x="170" y="21" textAnchor="middle" fill={STAGE_COLORS[stage]} fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.1em">
            {STAGE_LABELS[stage].toUpperCase()}
          </text>
        </g>
      </svg>

      {/* Growth progress dots */}
      <div className="lt-growth-dots">
        {STAGE_LABELS.map((label, i) => (
          <div key={label} className={`lt-growth-dot ${i <= stage ? 'filled' : ''}`} title={label}>
            <div className="lt-growth-dot-inner" style={{ background: i <= stage ? STAGE_COLORS[i] : undefined }} />
            <span className="lt-growth-dot-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────────── */
export default function LeadershipTree({ blockId, config }) {
  const isTree = blockId?.includes('widget-0') || config?.description?.toLowerCase().includes('tree')

  const [activeTab, setActiveTab] = useState('roots')

  // 1. LEADERSHIP TREE STATE
  const [roots, setRoots] = useState({ why: '', how: '' })
  const [trunk, setTrunk] = useState({ name: '', willing: 'yes', valuesMatch: 'high' })
  const [branches, setBranches] = useState({ disc: '', character: '', lsa: 'Developing' })

  // 2. MENTOR EVALUATOR STATE
  const [candidates, setCandidates] = useState([
    { name: 'Candidate A', ratings: { christian: 3, values: 3, breakthrough: 3, leadership: 3, willing: 3 } },
    { name: 'Candidate B', ratings: { christian: 3, values: 3, breakthrough: 1, leadership: 3, willing: 3 } },
  ])
  const [newCandidateName, setNewCandidateName] = useState('')
  const [showComparison, setShowComparison] = useState(false)

  function handleRateCandidate(cIdx, critKey, rating) {
    setCandidates(prev => prev.map((c, i) =>
      i === cIdx
        ? { ...c, ratings: { ...c.ratings, [critKey]: rating } }
        : c
    ))
  }

  function addCandidate() {
    if (!newCandidateName.trim()) return
    setCandidates(prev => [...prev, {
      name: newCandidateName.trim(),
      ratings: { christian: 3, values: 3, breakthrough: 3, leadership: 3, willing: 3 },
    }])
    setNewCandidateName('')
  }

  function removeCandidate(idx) {
    setCandidates(prev => prev.filter((_, i) => i !== idx))
  }

  function resetAll() {
    setRoots({ why: '', how: '' })
    setTrunk({ name: '', willing: 'yes', valuesMatch: 'high' })
    setBranches({ disc: '', character: '', lsa: 'Developing' })
  }

  const stage = getGrowthStage(roots, trunk, branches)

  // ─── MODE A: LEADERSHIP TREE BUILDER ──────────────
  if (isTree) {
    return (
      <div className="lt-wrapper">
        <p className="lt-instruction">
          Build your Leadership Tree by clicking the <strong>Roots</strong>, <strong>Trunk</strong>, or <strong>Branches</strong> of the tree — or use the tabs below.
          Watch your tree grow as you define your leadership identity.
        </p>

        <div className="lt-main-grid">
          {/* SVG Tree */}
          <TreeVisualization
            stage={stage}
            roots={roots}
            trunk={trunk}
            branches={branches}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Form Area */}
          <div className="lt-form-area">
            <div className="lt-tabs">
              {[
                { key: 'roots', icon: '🌱', label: 'Roots', color: 'var(--navy)' },
                { key: 'trunk', icon: '🪵', label: 'Trunk', color: '#b45309' },
                { key: 'branches', icon: '🌿', label: 'Branches', color: 'var(--green)' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  className={`lt-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                  style={{ '--tab-color': tab.color }}
                >
                  <span className="lt-tab-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Roots inputs */}
            {activeTab === 'roots' && (
              <div className="lt-form-section lt-fade-in">
                <div className="lt-form-header">
                  <div className="lt-form-header-icon" style={{ background: 'rgba(0,85,140,0.1)', color: 'var(--navy)' }}>🌱</div>
                  <div>
                    <div className="lt-form-header-title">Purpose Roots</div>
                    <div className="lt-form-header-desc">Your calling anchors everything above ground.</div>
                  </div>
                </div>
                <div className="lt-field">
                  <label className="lt-label">Why — Personal Core Vocation</label>
                  <input
                    className="widget-input"
                    placeholder="e.g. To restore hope to marginalized youth"
                    value={roots.why}
                    onChange={e => setRoots({ ...roots, why: e.target.value })}
                  />
                </div>
                <div className="lt-field">
                  <label className="lt-label">How — Primary Ministry Approach</label>
                  <input
                    className="widget-input"
                    placeholder="e.g. Relational mentoring and skills building"
                    value={roots.how}
                    onChange={e => setRoots({ ...roots, how: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Trunk inputs */}
            {activeTab === 'trunk' && (
              <div className="lt-form-section lt-fade-in">
                <div className="lt-form-header">
                  <div className="lt-form-header-icon" style={{ background: 'rgba(180,83,9,0.1)', color: '#b45309' }}>🪵</div>
                  <div>
                    <div className="lt-form-header-title">Mentoring Support</div>
                    <div className="lt-form-header-desc">Your trunk provides structural stability through mentorship.</div>
                  </div>
                </div>
                <div className="lt-field">
                  <label className="lt-label">Mentor Candidate Name</label>
                  <input
                    className="widget-input"
                    placeholder="e.g. Pastor John Davis"
                    value={trunk.name}
                    onChange={e => setTrunk({ ...trunk, name: e.target.value })}
                  />
                </div>
                <div className="lt-inline-field">
                  <label className="lt-label">Willing to meet monthly?</label>
                  <select className="widget-input lt-select" value={trunk.willing} onChange={e => setTrunk({ ...trunk, willing: e.target.value })}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unsure">Unsure</option>
                  </select>
                </div>
                <div className="lt-inline-field">
                  <label className="lt-label">Values Alignment</label>
                  <select className="widget-input lt-select" value={trunk.valuesMatch} onChange={e => setTrunk({ ...trunk, valuesMatch: e.target.value })}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            )}

            {/* Branches inputs */}
            {activeTab === 'branches' && (
              <div className="lt-form-section lt-fade-in">
                <div className="lt-form-header">
                  <div className="lt-form-header-icon" style={{ background: 'rgba(22,163,74,0.1)', color: 'var(--green)' }}>🌿</div>
                  <div>
                    <div className="lt-form-header-title">Leadership Blueprints</div>
                    <div className="lt-form-header-desc">Your visible leadership expression and growth strategies.</div>
                  </div>
                </div>
                <div className="lt-inline-field">
                  <label className="lt-label">DISC Dominant Style</label>
                  <select className="widget-input lt-select" value={branches.disc} onChange={e => setBranches({ ...branches, disc: e.target.value })}>
                    <option value="">Select…</option>
                    <option value="D">D — Dominance</option>
                    <option value="I">I — Influence</option>
                    <option value="S">S — Steadiness</option>
                    <option value="C">C — Conscientiousness</option>
                  </select>
                </div>
                <div className="lt-field">
                  <label className="lt-label">Biblical Character Model</label>
                  <input
                    className="widget-input"
                    placeholder="e.g. David, Nehemiah, Deborah…"
                    value={branches.character}
                    onChange={e => setBranches({ ...branches, character: e.target.value })}
                  />
                </div>
                <div className="lt-inline-field">
                  <label className="lt-label">LSA Core Skill</label>
                  <select className="widget-input lt-select" value={branches.lsa} onChange={e => setBranches({ ...branches, lsa: e.target.value })}>
                    <option value="Instructing">Instructing</option>
                    <option value="Developing">Developing</option>
                    <option value="Mentoring">Mentoring</option>
                    <option value="Commissioning">Commissioning</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion banner */}
        {stage === 4 && (
          <div className="lt-complete-banner lt-fade-in">
            <div className="lt-complete-icon">🌳</div>
            <div>
              <div className="lt-complete-title">Leadership Tree Flourishing!</div>
              <p className="lt-complete-desc">
                Your tree is fully grown — nourished by your purpose roots (<em>{roots.why.slice(0, 30)}</em>),
                supported by {trunk.name}'s mentoring trunk, and bearing {branches.disc}-style leadership branches
                modeled after {branches.character}.
              </p>
            </div>
          </div>
        )}

        <div className="lt-footer-actions">
          <button type="button" className="widget-reset-btn" onClick={resetAll}>↺ Reset Tree</button>
        </div>
      </div>
    )
  }

  // ─── MODE B: MENTOR EVALUATOR MATRIX ──────────────
  const scoredCandidates = candidates.map(c => ({
    ...c,
    weightedScore: calcWeightedScore(c.ratings),
    recommendation: getRecommendation(calcWeightedScore(c.ratings)),
  }))

  return (
    <div className="lt-wrapper">
      <p className="lt-instruction">
        Mentor Selection Matrix — Rate each candidate across the 5 critical selection parameters.
        The <strong>Breakthrough</strong> criterion carries <strong>2× weight</strong>.
      </p>

      {/* Candidate cards */}
      <div className="lt-mentor-cards">
        {scoredCandidates.map((c, cIdx) => {
          const pct = Math.round((c.weightedScore / MAX_WEIGHTED_SCORE) * 100)
          const rec = c.recommendation

          return (
            <div key={cIdx} className="lt-mentor-card">
              <div className="lt-mentor-card-header">
                <div className="lt-mentor-name">
                  <span className="lt-mentor-avatar">{c.name.charAt(0)}</span>
                  {c.name}
                </div>
                <div className="lt-mentor-actions">
                  <span className="lt-rec-badge" style={{ background: rec.bg, color: rec.color }}>
                    {rec.icon} {rec.label}
                  </span>
                  {candidates.length > 1 && (
                    <button type="button" className="lt-remove-btn" onClick={() => removeCandidate(cIdx)} title="Remove candidate">×</button>
                  )}
                </div>
              </div>

              {/* Score bar */}
              <div className="lt-score-bar-container">
                <div className="lt-score-bar">
                  <div className="lt-score-bar-fill" style={{ width: `${pct}%`, background: rec.color }} />
                </div>
                <span className="lt-score-value" style={{ color: rec.color }}>{c.weightedScore}/{MAX_WEIGHTED_SCORE}</span>
              </div>

              {/* Criteria ratings */}
              <div className="lt-criteria-grid">
                {MENTOR_CRITERIA.map(crit => {
                  const val = c.ratings[crit.key]
                  const isWeighted = crit.weight > 1
                  return (
                    <div key={crit.key} className={`lt-criterion ${isWeighted ? 'weighted' : ''}`}>
                      <div className="lt-criterion-label">
                        <span className="lt-criterion-icon">{crit.icon}</span>
                        <span>{crit.label}</span>
                        {isWeighted && <span className="lt-weight-badge">2×</span>}
                      </div>
                      <div className="lt-rating-btns">
                        {[1, 2, 3, 4].map(score => (
                          <button
                            key={score}
                            type="button"
                            className={`lt-rating-btn ${val === score ? 'active' : ''}`}
                            onClick={() => handleRateCandidate(cIdx, crit.key, score)}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add candidate */}
      <div className="lt-add-candidate">
        <input
          className="widget-input"
          placeholder="New candidate name…"
          value={newCandidateName}
          onChange={e => setNewCandidateName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCandidate()}
        />
        <button type="button" className="widget-save-btn" onClick={addCandidate}>+ Add Candidate</button>
      </div>

      {/* Comparison toggle */}
      {candidates.length >= 2 && (
        <button
          type="button"
          className={`lt-compare-toggle ${showComparison ? 'active' : ''}`}
          onClick={() => setShowComparison(v => !v)}
        >
          {showComparison ? '▾ Hide Comparison' : '▸ Compare Candidates Side-by-Side'}
        </button>
      )}

      {/* Comparison view */}
      {showComparison && candidates.length >= 2 && (
        <div className="lt-comparison lt-fade-in" style={{ '--cols': scoredCandidates.length }}>
          <div className="lt-comparison-header" style={{ gridTemplateColumns: `1.5fr repeat(${scoredCandidates.length}, 1fr)` }}>
            <div className="lt-comparison-label">Criteria</div>
            {scoredCandidates.map((c, i) => (
              <div key={i} className="lt-comparison-name">{c.name}</div>
            ))}
          </div>
          {MENTOR_CRITERIA.map(crit => (
            <div key={crit.key} className="lt-comparison-row" style={{ gridTemplateColumns: `1.5fr repeat(${scoredCandidates.length}, 1fr)` }}>
              <div className="lt-comparison-label">{crit.icon} {crit.label.split('(')[0].trim()}</div>
              {scoredCandidates.map((c, i) => {
                const val = c.ratings[crit.key]
                const best = Math.max(...scoredCandidates.map(sc => sc.ratings[crit.key]))
                return (
                  <div key={i} className={`lt-comparison-cell ${val === best && candidates.length > 1 ? 'best' : ''}`}>
                    <div className="lt-comparison-bar" style={{ width: `${(val / 4) * 100}%` }} />
                    <span>{val}/4</span>
                  </div>
                )
              })}
            </div>
          ))}
          <div className="lt-comparison-row lt-comparison-total" style={{ gridTemplateColumns: `1.5fr repeat(${scoredCandidates.length}, 1fr)` }}>
            <div className="lt-comparison-label"><strong>Total (Weighted)</strong></div>
            {scoredCandidates.map((c, i) => (
              <div key={i} className="lt-comparison-cell" style={{ color: c.recommendation.color, fontWeight: 700 }}>
                {c.recommendation.icon} {c.weightedScore}/{MAX_WEIGHTED_SCORE}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="lt-footer-actions">
        <button type="button" className="widget-reset-btn" onClick={() => {
          setCandidates([
            { name: 'Candidate A', ratings: { christian: 3, values: 3, breakthrough: 3, leadership: 3, willing: 3 } },
            { name: 'Candidate B', ratings: { christian: 3, values: 3, breakthrough: 1, leadership: 3, willing: 3 } },
          ])
          setShowComparison(false)
        }}>↺ Clear Ratings</button>
      </div>
    </div>
  )
}
