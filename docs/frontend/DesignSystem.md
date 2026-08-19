# Frontend Design System

The product UI should prioritize financial readability, trust, clear transaction states, responsive layouts, and low cognitive load.

## Visual Language

FinLedger uses a playful-fintech direction: friendly rounded surfaces and tactile interactions, balanced by restrained typography and clear financial hierarchy. It is a business application, not a game.

| Token | Value | Use |
| --- | --- | --- |
| Primary Teal | `#2BA8A2` | navigation, primary actions, positive emphasis |
| Primary Light | `#3CC4BD` | supporting brand accents |
| Primary Dark | `#1E8C86` | navigation depth and hover states |
| Primary Background | `#E8F6F5` | soft teal surfaces |
| Accent Gold | `#FFD23F` | important calls to action |
| Accent Gold Dark | `#E6B800` | gold hover state |
| Coral | `#EF6C4A` | warnings and attention states |
| Cream | `#FFF8E7` | inputs, reminders, gentle highlights |
| Surface Base | `#EFF8F7` | application background |
| Surface Card | `#FFFFFF` | content cards |
| Surface Dark | `#173B3A` | dark action banners and deep surfaces |
| Success | `#27AE60` | successful financial state |
| Error | `#E74C3C` | failed or destructive state |
| Warning Foreground | `#8C762F` | readable text on cream warning surfaces |
| Danger Background | `#FFF0EC` | error and attention surfaces |
| Danger Foreground | `#9F432F` | readable text on danger surfaces |

### Dark Mode

Dark mode uses near-black surfaces with green brand accents while preserving coral and warning colors for financial status meaning.

| Token | Value | Use |
| --- | --- | --- |
| Dark Background | `#050807` | application background |
| Dark Card | `#0B1410` | cards and elevated surfaces |
| Dark Primary | `#32C978` | primary actions and positive emphasis |
| Dark Primary Background | `#0D2B1B` | selected and positive surfaces |
| Dark Accent | `#B8F36B` | important action in dark mode |
| Dark Border | `#1B3A29` | borders and dividers |
| Dark Input | `#0E1E15` | form inputs |

## Components

- Cards use generous rounded corners, theme-aware surfaces, thin borders, and subtle teal shadow.
- Primary buttons are pill-shaped and tactile. Gold is reserved for the most important action; teal is used for standard actions.
- Inputs use the cream surface in light mode and dark green surfaces in dark mode, both with a clear teal-green focus ring.
- Financial metrics are bold, use tabular numerals, and are never obscured by decoration.
- Colored glow is subtle and supports hierarchy; avoid large gradients and neon effects.
- Status colors must not be the sole way to communicate meaning. Pair them with text or icons.
- Use semantic tokens instead of page-level hex values. New colors require an update to this table and `app/globals.css`.
- `GROCERY` and `PULSE` use the same visual theme. Business type changes content and fields, not the color system.

## Rules for AI-assisted UI work

- Preserve the established design language rather than introducing arbitrary styles.
- Make loading, empty, error, pending, succeeded, and failed states explicit.
- Pair status color with a label, icon, or supporting text.
- Use semantic HTML, keyboard-accessible controls, visible focus states, and useful labels.
- Keep financial amounts visually distinct and format them consistently.
- Ensure core workflows work on desktop, tablet, and mobile.
- Simulated payment screens must display `Simulation Only`.
- Do not use generic blue SaaS styling, excessive gradients, glassmorphism, confetti, rankings, winner cards, sunbursts, or game-like decorative animation.
