# 🧬 Linear.app — Complete UI DNA
> Business DNA for full replication in Antigravity. Last scraped: Feb 2026.

---

## 0. BRAND ESSENCE

| Property | Value |
|---|---|
| **Voice** | Confident, terse, opinionated. No fluff. Engineering culture speaking. |
| **Philosophy** | "Designed for speed." Radical simplicity that respects the user's intelligence. |
| **Archetype** | Premium developer tool. Like a Swiss watch — every pixel justified. |
| **Competitors** | Jira (loud/bloated), Notion (soft/flexible), GitHub Issues (raw) — Linear is the anti-all-three. |
| **Brand promise** | Clarity, velocity, taste. |

---

## 1. COLOR SYSTEM

### 1.1 Core Palette — Dark Theme (Primary)

```css
/* Background layers (darkest → lightest) */
--bg-base:        #0f0f10;   /* App background, deepest */
--bg-surface:     #141415;   /* Sidebar, panel backgrounds */
--bg-elevated:    #1a1a1b;   /* Cards, modals, issue rows */
--bg-hover:       #202022;   /* Hover state on rows */
--bg-active:      #26262a;   /* Active/selected state */
--bg-overlay:     rgba(0,0,0,0.5); /* Modal scrim */

/* Borders */
--border-subtle:  rgba(255,255,255,0.06);  /* Hairline separators */
--border-default: rgba(255,255,255,0.10);  /* Panel/card edges */
--border-strong:  rgba(255,255,255,0.18);  /* Active inputs, focused */

/* Text */
--text-primary:   #e2e2e3;   /* Main content, headings */
--text-secondary: #8a8a8f;   /* Labels, meta, muted */
--text-tertiary:  #5a5a5f;   /* Placeholder, disabled */
--text-inverse:   #0f0f10;   /* Text on light surfaces */

/* Brand accent */
--accent-purple:  #5e6ad2;   /* Primary CTA, links, icons */
--accent-purple-hover: #6b76e0;
--accent-purple-subtle: rgba(94,106,210,0.15);

/* Semantic status colors */
--status-backlog:    #95a1b3;   /* Grey */
--status-todo:       #e2e2e3;   /* White/light */
--status-inprogress: #f2b84b;   /* Amber/yellow */
--status-done:       #4dac68;   /* Green */
--status-cancelled:  #5a5a5f;   /* Muted grey */

/* Priority colors */
--priority-urgent:  #e05d5d;   /* Red */
--priority-high:    #e07050;   /* Orange */
--priority-medium:  #f2b84b;   /* Amber */
--priority-low:     #8a8a8f;   /* Grey */
--priority-none:    #5a5a5f;   /* Dimmer grey */

/* Label chip colors */
--label-bug:        #e05d5d20;  /* Red subtle */
--label-feature:    #5e6ad220;  /* Purple subtle */
--label-design:     #b24fd420;  /* Violet subtle */
--label-performance:#f2b84b20;  /* Amber subtle */
--label-ai:         #4dac6820;  /* Green subtle */
```

### 1.2 Light Theme (Secondary / Marketing)

```css
--bg-base:        #ffffff;
--bg-surface:     #f7f7f8;
--bg-elevated:    #f0f0f2;
--border-default: rgba(0,0,0,0.08);
--text-primary:   #1a1a1b;
--text-secondary: #6b6b70;
--accent-purple:  #5e6ad2;
```

### 1.3 Marketing / Landing Page

- Deep near-black backgrounds: `#0a0a0b` with subtle purple-to-transparent gradients
- Hero uses a dark canvas with luminous UI screenshots floating above
- Gradient overlays: `radial-gradient(ellipse at top, rgba(94,106,210,0.12) 0%, transparent 70%)`
- Section backgrounds alternate between `#0a0a0b` and `#0d0d0e`

---

## 2. TYPOGRAPHY

### 2.1 Font Stack

```css
/* Primary — UI & marketing headings */
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Monospace — code diffs, issue IDs, changelogs */
font-family: "Geist Mono", "Fira Code", "SF Mono", ui-monospace, monospace;
```

> **Note:** Linear uses a custom-tuned version of Inter with tight letter-spacing applied at the CSS level. The feel is more condensed/premium than default Inter.

### 2.2 Type Scale

| Role | Size | Weight | Line Height | Letter Spacing | Color |
|---|---|---|---|---|---|
| **Hero H1** | 56–72px (responsive) | 600 | 1.05 | -0.04em | `--text-primary` |
| **Section H2** | 36–48px | 600 | 1.1 | -0.03em | `--text-primary` |
| **Card H3** | 20–24px | 600 | 1.2 | -0.02em | `--text-primary` |
| **Issue Title** | 14px | 500 | 1.4 | -0.01em | `--text-primary` |
| **Body / Description** | 14–15px | 400 | 1.6 | 0 | `--text-secondary` |
| **Label / Badge** | 11–12px | 500 | 1 | 0.02em | varies |
| **Issue ID** | 12px | 400 | 1 | 0 | `--text-tertiary` |
| **Navigation item** | 13px | 400 | 1 | 0 | `--text-secondary` |
| **CTA Button** | 13–14px | 500 | 1 | -0.01em | — |
| **Code / Diff** | 12–13px | 400 | 1.6 | 0 | `--text-primary` |

### 2.3 Marketing Headline Technique

Large headings animate word-by-word on the hero. The headline **stack-collapses** responsively:
```
Desktop: "The product development system for teams and agents"  
Tablet:  "The product development system"  
Mobile:  "The product development system"
```
Words are wrapped in `<span>` with staggered `opacity` + `translateY` animations.

---

## 3. SPACING & LAYOUT

### 3.1 Base Unit

```css
--space-unit: 4px;

/* Scale */
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### 3.2 Layout Grid

```css
/* App shell */
--sidebar-width:        220px;  /* Collapsed: 52px */
--sidebar-indent:       8px;    /* Left padding on nav items */
--header-height:        40px;   /* Compact top bar */
--issue-row-height:     36px;   /* Issue list rows */
--panel-gap:            1px;    /* Between panels — border-only separation */

/* Marketing page */
--marketing-max-width:  1200px;
--marketing-padding:    clamp(24px, 5vw, 80px);
--section-gap:          120–160px;
--card-padding:         24px;
```

### 3.3 Responsive Breakpoints

```css
--bp-sm:   640px;
--bp-md:   768px;
--bp-lg:   1024px;
--bp-xl:   1280px;
--bp-2xl:  1536px;
```

---

## 4. APP SHELL ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│  TOPBAR (40px)  [Workspace ▾]  [Search]  [Notif]    │
├──────────┬──────────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT AREA                       │
│ (220px)  │                                          │
│          │  ┌──────────────────┬─────────────────┐  │
│ Nav      │  │  LIST PANEL      │  DETAIL PANEL   │  │
│ Groups   │  │  (issue list,    │  (issue detail, │  │
│          │  │   board, etc.)   │   editor, etc.) │  │
│          │  └──────────────────┴─────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```

### Sidebar Structure
```
[Team/Workspace name + avatar]
  ─────
  Inbox           (unread count badge)
  My Issues
  Views
  ─────
  Favorites
    > [Project name]
    > [Project name]
  ─────
  Teams (collapsible)
    > Issues
    > Cycles
    > Projects
    > Documents
  ─────
  [+ New Issue]   (bottom CTA)
```

---

## 5. COMPONENT LIBRARY

### 5.1 Buttons

```css
/* Primary CTA */
.btn-primary {
  background: #5e6ad2;
  color: #fff;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  border: none;
  cursor: pointer;
  transition: background 120ms ease, opacity 120ms ease;
}
.btn-primary:hover { background: #6b76e0; }
.btn-primary:active { opacity: 0.85; transform: scale(0.98); }

/* Secondary */
.btn-secondary {
  background: transparent;
  color: --text-primary;
  border: 1px solid --border-default;
  /* same dimensions */
}
.btn-secondary:hover { background: --bg-hover; }

/* Ghost / Icon button */
.btn-ghost {
  background: transparent;
  border: none;
  color: --text-secondary;
  padding: 4px 6px;
  border-radius: 4px;
}
.btn-ghost:hover { background: --bg-hover; color: --text-primary; }

/* Marketing CTA (larger) */
.btn-marketing {
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  border-radius: 8px;
}
```

### 5.2 Issue Row

```
[Status icon] [ENG-XXXX] [Issue Title]  [Labels...] [Assignee] [Priority]
```

```css
.issue-row {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  gap: 8px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}
.issue-row:hover { background: var(--bg-hover); }
.issue-row.selected { background: var(--bg-active); }

.issue-id {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: monospace;
  min-width: 60px;
  letter-spacing: 0;
}

.issue-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
  font-weight: 400;
}
```

### 5.3 Status Icons

Small 14×14px filled/stroked icons:
- **Backlog** — dashed circle, `#95a1b3`
- **Todo** — empty circle, `#e2e2e3`
- **In Progress** — half-filled circle (animates), `#f2b84b`
- **Done** — filled circle with checkmark, `#4dac68`
- **Cancelled** — circle with X, `#5a5a5f`

### 5.4 Priority Icons

4×14px vertical bars (like signal strength):
- Urgent: 3 bars, `#e05d5d`
- High: 3 bars, `#e07050`
- Medium: 2 bars, `#f2b84b`
- Low: 1 bar, `#8a8a8f`
- No priority: dots, `#5a5a5f`

### 5.5 Label / Tag Chips

```css
.label-chip {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  gap: 4px;
  background: rgba(var(--label-color-rgb), 0.15);
  color: var(--label-color);
}
/* dot indicator */
.label-chip::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}
```

### 5.6 Avatar

```css
.avatar {
  width: 20px; height: 20px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
/* Size variants */
.avatar-sm { width: 16px; height: 16px; }
.avatar-md { width: 24px; height: 24px; }
.avatar-lg { width: 32px; height: 32px; }
```

### 5.7 Command Menu (⌘K)

```css
.command-menu {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 560px;
  max-height: 400px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
  overflow: hidden;
}

.command-input {
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 15px;
  color: var(--text-primary);
  outline: none;
}

.command-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
}
.command-item:hover, .command-item.focused {
  background: var(--bg-hover);
}
```

### 5.8 Sidebar Navigation Item

```css
.nav-item {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 8px;
  border-radius: 4px;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}
.nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.nav-item.active {
  background: var(--bg-active);
  color: var(--text-primary);
}
.nav-item-icon { width: 16px; height: 16px; opacity: 0.7; }
.nav-item-count {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}
```

### 5.9 Section Group Header (Sidebar)

```css
.section-header {
  display: flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  margin-top: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
}
```

### 5.10 Issue Detail Panel

```css
.issue-detail {
  display: grid;
  grid-template-columns: 1fr 200px;  /* content | metadata sidebar */
  gap: 0;
  height: 100%;
  overflow-y: auto;
}

.issue-detail-main {
  padding: 32px 40px;
  border-right: 1px solid var(--border-subtle);
}

.issue-title-input {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.issue-metadata {
  padding: 16px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metadata-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  color: var(--text-secondary);
}
```

### 5.11 Progress / Cycle Bar

```css
.cycle-bar {
  height: 2px;
  background: var(--border-default);
  border-radius: 1px;
  overflow: hidden;
}
.cycle-bar-fill {
  height: 100%;
  background: var(--accent-purple);
  border-radius: 1px;
  transition: width 300ms ease;
}
```

### 5.12 Code Diff Block

```css
.diff-block {
  font-family: "Geist Mono", monospace;
  font-size: 12px;
  line-height: 1.6;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  overflow: hidden;
}

.diff-line { padding: 0 12px; }
.diff-line.added {
  background: rgba(77,172,104,0.12);
  color: #4dac68;
}
.diff-line.added::before { content: '+'; margin-right: 8px; color: #4dac68; }
.diff-line.removed {
  background: rgba(224,93,93,0.12);
  color: #e05d5d;
  text-decoration: line-through;
}
.diff-line.removed::before { content: '-'; margin-right: 8px; color: #e05d5d; }
```

### 5.13 Roadmap / Timeline Bar

```css
.timeline-row {
  display: flex;
  align-items: center;
  height: 32px;
  position: relative;
}

.timeline-bar {
  height: 20px;
  border-radius: 4px;
  background: var(--accent-purple);
  opacity: 0.8;
  position: absolute;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 11px;
  color: white;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}

/* Phase bars use different opacity */
.timeline-bar.phase-alpha { background: #5e6ad2; opacity: 0.5; }
.timeline-bar.phase-beta  { background: #5e6ad2; opacity: 0.75; }
.timeline-bar.phase-ga    { background: #5e6ad2; opacity: 1; }
```

### 5.14 Notification / Activity Item

```css
.activity-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.activity-avatar { flex-shrink: 0; margin-top: 2px; }

.activity-text strong { color: var(--text-primary); font-weight: 500; }
.activity-time {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-left: 4px;
}
```

---

## 6. MOTION & ANIMATION

### 6.1 Core Timing Functions

```css
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);   /* Standard */
--ease-out:     cubic-bezier(0, 0, 0.2, 1);      /* Enter */
--ease-in:      cubic-bezier(0.4, 0, 1, 1);      /* Exit */
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy/playful */
```

### 6.2 Duration Scale

```css
--duration-instant: 80ms;    /* Immediate feedback (hover icons) */
--duration-fast:    120ms;   /* Button states, chip hover */
--duration-normal:  200ms;   /* Panel transitions, dropdowns */
--duration-slow:    300ms;   /* Modal opens, page transitions */
--duration-xslow:   500ms;   /* Hero animations */
```

### 6.3 Key Animations

```css
/* Row hover highlight — NO translate, just background change */
transition: background var(--duration-fast) var(--ease-in-out);

/* Sidebar collapse */
transition: width var(--duration-normal) var(--ease-in-out);

/* Dropdown / popover mount */
@keyframes popover-in {
  from { opacity: 0; transform: translateY(-4px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
animation: popover-in var(--duration-normal) var(--ease-out);

/* Command menu mount */
@keyframes command-in {
  from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(0.96); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
}

/* Marketing hero word reveal */
@keyframes word-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Each word: animation-delay: calc(index * 60ms) */

/* In-progress status icon spin */
@keyframes status-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
/* Applied only on the "In Progress" half-arc */

/* Agent thinking / loading pulse */
@keyframes thinking-pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 1; }
}
```

### 6.4 Micro-interactions

- **Issue row hover** → instant bg change (80–120ms), no movement
- **Button press** → `scale(0.97)` + slight dim (120ms)
- **Checkbox complete** → status icon morphs circle→checkmark with 200ms ease
- **New issue creation** → row slides in from top with `translateY(-8px)→0` (200ms)
- **Sidebar item click** → active state instant, no animation
- **Modal backdrop** → fade in `opacity 0→0.5` (200ms)
- **Drag-and-drop** → dragged item gets `opacity: 0.5` + `box-shadow`, target highlights `--accent-purple-subtle`

---

## 7. ICONOGRAPHY

- **Style**: Custom minimal line icons, 16×16px default, 1.5px stroke, rounded caps
- **Color**: Inherits `currentColor` — adapts to context automatically
- **Active/selected icons** get full `--text-primary` color
- **Inactive icons** at `opacity: 0.6` or `--text-tertiary`
- **Status icons** are FILLED shapes (not outlined) for instant readability
- **Navigation icons**: Home, Inbox, Issues (grid), Cycles (arrows), Projects (layer), Documents (doc), Settings (gear), Team (people)
- No emoji in navigation. No decorative icons. Every icon is functional.

---

## 8. MARKETING PAGE PATTERNS

### 8.1 Section Anatomy

```
[Section number label — e.g. "1.0 Intake →"]
[Large H2 headline — 2-3 words, punchy]
[1-line descriptor paragraph]
[Product screenshot / UI mockup — floating, shadowed]
[Sub-feature grid — 4 labeled items e.g. "1.1 Linear Agent +"]
```

### 8.2 Feature Screenshot Treatment

```css
.product-screenshot {
  border-radius: 10px;
  border: 1px solid var(--border-default);
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04),   /* inner rim */
    0 40px 100px rgba(0,0,0,0.6),       /* deep shadow */
    0 8px 32px rgba(0,0,0,0.4);         /* close shadow */
  overflow: hidden;
  /* Slight perspective tilt for depth */
  transform: perspective(1200px) rotateX(2deg);
}
```

### 8.3 Section Numbering System

Linear uses a hierarchical numbering for feature sections visible on the marketing page:
```
1.0 Intake
  1.1 Linear Agent
  1.2 Triage
  1.3 Customer Requests
  1.4 Linear Asks
2.0 Plan
  2.1 Projects
  2.2 Documents
  ...
```
This numbering is visual — displayed as grey monospace labels.

### 8.4 Testimonial Strip

```css
.testimonial-strip {
  display: flex;
  gap: 1px;        /* hairline between quotes */
  background: var(--border-subtle);  /* gap acts as border */
}

.testimonial-card {
  flex: 1;
  padding: 32px;
  background: var(--bg-surface);
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.testimonial-quote { font-style: normal; }  /* NO italic */
.testimonial-card::before { content: '"'; }  /* just a quote mark */

.testimonial-author {
  margin-top: 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}
.testimonial-company { color: var(--text-tertiary); }
```

### 8.5 Hero Section

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 24px 80px;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(94,106,210,0.15), transparent),
    #0a0a0b;
}

.hero-badge {           /* "New — Linear Reviews (Beta) →" */
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid var(--border-default);
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  background: var(--bg-elevated);
}

.hero-h1 {
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.05;
  max-width: 800px;
  color: var(--text-primary);
}

.hero-tagline {
  font-size: 16–18px;
  color: var(--text-secondary);
  max-width: 480px;
  margin: 16px auto 32px;
  line-height: 1.6;
}

.hero-cta-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
```

### 8.6 Navigation Bar (Marketing)

```css
.marketing-nav {
  position: fixed;
  top: 0;
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: rgba(10,10,11,0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 100;
}

.nav-logo { margin-right: 32px; }

.nav-links {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-link {
  padding: 4px 10px;
  font-size: 13px;
  color: var(--text-secondary);
  border-radius: 4px;
}
.nav-link:hover { color: var(--text-primary); background: var(--bg-hover); }

.nav-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
```

---

## 9. COPYWRITING PATTERNS

### Headline Formula
- Short + punchy + product-centric
- Avoid: fluff, adjectives, "revolutionary", "powerful"
- ✓ "The product development system for teams and agents"
- ✓ "Make product operations self-driving"
- ✓ "Define the product direction"
- ✓ "Move work forward across teams and agents"
- ✓ "Review PRs and agent output"
- ✓ "Understand progress at scale"

### Body Copy Formula
- One sentence. Direct benefit statement.
- ✓ "Plan and navigate from idea to launch."
- ✓ "Understand code changes at a glance..."
- ✓ "Take the guesswork out of product development..."

### UI Labels
- All lowercase in UI: "backlog", "in progress", "done"
- Issue IDs in ALL-CAPS prefix: `ENG-`, `MKT-`, `DSG-`
- Timestamps: relative ("2min ago", "just now", "3 hours ago")
- CTAs: verb-first — "Get started", "Open app", "Contact sales", "See all releases"

---

## 10. DATA VISUALIZATION

### Burndown / Issue Count Charts

```css
.chart-line {
  stroke: var(--accent-purple);
  stroke-width: 1.5;
  fill: none;
}
.chart-area {
  fill: url(#chart-gradient);  /* purple→transparent top-to-bottom */
}
.chart-axis {
  stroke: var(--border-subtle);
  stroke-dasharray: 2 4;
}
.chart-label {
  font-size: 10px;
  fill: var(--text-tertiary);
  font-family: monospace;
}
```

### Cycle Progress

- Number fraction: `02/145` — large current, `/` divider, total smaller, all monospace
- Thin horizontal progress bar below

### Roadmap Grid

- Column headers: abbreviated month names, monospace, `--text-tertiary`
- Today line: vertical `1px` line, `--accent-purple`, slight glow
- Initiative bars: semi-transparent purple with rounded ends

---

## 11. KEYBOARD-FIRST DESIGN

All major actions have keyboard shortcuts displayed inline:
```
[C]  Create issue
[K]  Command menu
[/]  Search
[G then I]  Go to Inbox
[G then M]  Go to My Issues
```

Keyboard hint display:
```css
.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  min-width: 16px;
  padding: 0 3px;
  border-radius: 3px;
  border: 1px solid var(--border-default);
  background: var(--bg-elevated);
  font-size: 10px;
  font-family: monospace;
  color: var(--text-tertiary);
}
```

---

## 12. BOARD / KANBAN VIEW

```css
.board-column {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.board-column-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.board-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: 10px 12px;
  cursor: grab;
  font-size: 13px;
}
.board-card:hover { border-color: var(--border-strong); }
.board-card:active { cursor: grabbing; }
```

---

## 13. ELEVATION & SHADOWS

```css
/* Level 1 — Cards on surface */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);

/* Level 2 — Dropdowns, popovers */
--shadow-md: 0 4px 16px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3);

/* Level 3 — Modals, command palette */
--shadow-lg: 0 24px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3);

/* Level 4 — Product screenshots on marketing */
--shadow-hero: 0 40px 100px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4);

/* All shadows are dark (no colored shadows) */
/* Exception: accent glow for agent/AI elements */
--shadow-agent: 0 0 20px rgba(94,106,210,0.3);
```

---

## 14. BORDER RADIUS SYSTEM

```css
--radius-sm:   3px;   /* Small chips, kbd */
--radius-md:   6px;   /* Buttons, cards, inputs */
--radius-lg:   8px;   /* Modals, panels */
--radius-xl:   10px;  /* Large modals, screenshots */
--radius-full: 9999px; /* Pills, badges */
```

---

## 15. FORM INPUTS

```css
.input {
  height: 32px;
  padding: 0 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--duration-fast) ease;
}
.input::placeholder { color: var(--text-tertiary); }
.input:focus {
  border-color: var(--border-strong);
  box-shadow: 0 0 0 3px rgba(94,106,210,0.12);
}
```

---

## 16. AI / AGENT SPECIFIC PATTERNS

### Agent Avatar Badge

Agents have distinct avatars with subtle purple glows:
```css
.agent-avatar {
  width: 20px; height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(94,106,210,0.4);
}
```

### Agent Activity Feed

Agents log terminal-style output inline in issue activity:
```css
.agent-terminal {
  background: var(--bg-base);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: 10px 12px;
  font-family: monospace;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 8px 0;
}
.agent-terminal .command { color: #4dac68; }
.agent-terminal .path    { color: var(--accent-purple); }
.agent-terminal .thinking { color: var(--text-tertiary); font-style: italic; }
```

### "Thinking" Indicator

Three animated dots:
```css
.thinking-dots span {
  animation: thinking-pulse 1.2s ease infinite;
}
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
```

---

## 17. SCROLLBARS

```css
/* Thin, invisible-until-hover scrollbars */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }
```

---

## 18. BREAKPOINT BEHAVIOR

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Sidebar | Fixed 220px | Icon-only 52px | Hidden (drawer) |
| Issue detail | Split panel | Full width | Full screen modal |
| Marketing hero | Side-by-side text + screenshot | Stacked | Stacked, screenshot hidden |
| Navigation | Full labels | Icon-only | Hamburger |
| Roadmap | Full timeline | Scrollable | Card view |

---

## 19. CHANGELOG / RELEASE NOTES PATTERN

```css
.changelog-entry {
  padding: 24px 0;
  border-bottom: 1px solid var(--border-subtle);
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 24px;
}

.changelog-date {
  font-size: 12px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
  padding-top: 2px;
}

.changelog-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.changelog-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

---

## 20. SUMMARY: LINEAR DESIGN PRINCIPLES

1. **Density over decoration** — Every pixel serves function. No decorative elements.
2. **Dark-first** — The app is designed for dark mode. Light mode is secondary.
3. **Speed is a feature** — Interactions respond in <120ms. No loading spinners in core flows.
4. **Monospace for data** — Issue IDs, timestamps, code, numbers = monospace always.
5. **Purple is the only accent** — One brand color, used sparingly and precisely.
6. **Hairline borders** — Separations are 1px lines at 6–10% white opacity, never solid blocks.
7. **No rounded pill buttons in the app** — Only the marketing page uses pill shapes for CTAs.
8. **Labels = 11px caps** — All category/section labels use small uppercase monospace.
9. **Opacity as hierarchy** — Text hierarchy is expressed through opacity, not size alone.
10. **Keyboard native** — UI is designed as if mouse doesn't exist. Keyboard shortcuts displayed everywhere.

---

*Generated from live analysis of linear.app — Feb 2026*
