# Brand profile — KHDA / Dubai Knowledge

Extracted from [web.khda.gov.ae/en](https://web.khda.gov.ae/en/) on 2026-05-01. Used to re-skin this dashboard.

## Logo

Two government-issue marks live in [`src/assets/`](src/assets/):

| Asset | Use |
|---|---|
| [`khda-logo.png`](src/assets/khda-logo.png) (231×121) | Primary KHDA "Dubai Knowledge / المعرفة" mark — header lockup |
| [`dubai-gov-logo.png`](src/assets/dubai-gov-logo.png) (273×110) | "Government of Dubai" emblem — secondary, footer or compliance contexts |

Source URLs:
- `https://web.khda.gov.ae/KHDA/media/KHDA/KHDA-Proud-of-UAE-Logo2.png`
- `https://web.khda.gov.ae/KHDA/media/KHDA/Logos/Gov-of-Dubai-New.png`

## Color tokens

KHDA's site exposes a Material-style 6-token palette (`khda-primary`, `khda-secondary`, `khda-info`, `khda-action`, `khda-error`, `khda-success`). Each has a 50–900 ramp; `500` is the headline shade.

| Token | Hex (500) | Role | Notes |
|---|---|---|---|
| **primary** | `#51548a` | Brand indigo — links, key CTAs | Soft cool blue with grey undertone |
| **secondary** | `#615e6c` | Charcoal grey — body text, neutral UI | |
| **info** | `#215b83` | Deep teal-blue — informational accents | Used for the help/chat trigger |
| **action** | `#8b2555` | Wine/burgundy — featured callouts | Strong contrast with primary |
| **error** | `#c72324` | Red — destructive / off-track | |
| **success** | `#86a33a` | Olive green — on-track / positive | UAE-flag adjacent |

### Full ramps (500 highlighted)

**Primary**

| 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|
| `#bfc0d9` | `#9b9dc4` | `#6e71aa` | `#5c609d` | **`#51548a`** | `#464877` | `#3a3d63` | `#2f3150` | `#24253d` |

**Secondary**

| 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 |
|---|---|---|---|---|---|---|---|
| `#e9e8eb` | `#c1bfc7` | `#a4a1ad` | `#7f7b8c` | `#706c7c` | **`#615e6c`** | `#52505c` | `#44424b` |

### Background / surface

- Page background: `#ffffff`
- Subtle surface: `#f5f5f6` (secondary-25)
- Divider / muted: `#e9e8eb` (secondary-50)
- Body text: `#52505c` (secondary-600)

## Typography

KHDA uses **two type families** — bilingual by design.

### Dubai W23 (the official UAE government typeface)

Used for headings and brand voice. Carries the Dubai government identity. Self-hosted weights:

| Weight | Use |
|---|---|
| 300 (Light) | Display / lead-in copy |
| 400 (Regular) | Default Latin |
| 500 (Medium) | UI labels, table headers |
| 700 (Bold) | Headings |

Not on Google Fonts. Available via [Dubai Font](https://www.dubaifont.com/) (free for any use, per Dubai government licence) or self-host the `DubaiW23-*.woff2` files KHDA uses directly.

### Noto Sans

Body / running copy. Loaded from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

Weights used: 400, 500, 700 (regular + italic).

## Applied stack for this dashboard

Tailwind config maps the KHDA palette onto our existing `primary`, `secondary`, `accent`, status (green/amber/red) tokens:

| Existing | KHDA target |
|---|---|
| `--primary` | `#51548a` (khda-primary 500) |
| `--secondary` | `#615e6c` (khda-secondary 500) |
| `--accent` | `#8b2555` (khda-action 500) |
| `--info` | `#215b83` (khda-info 500) |
| `--success` / status-green | `#86a33a` (khda-success 500) |
| `--destructive` / status-red | `#c72324` (khda-error 500) |
| Body text | `#52505c` (secondary-600) |
| Background | `#ffffff` |
| Muted bg | `#f5f5f6` |

Fonts:
- `font-sans` → `Noto Sans, system-ui, sans-serif`
- `font-display` → `Dubai W23, Noto Sans, sans-serif` (used for h1/h2)

## Voice & tone (observed)

- **Authoritative, plain English** — short, formal sentences. No marketing puff.
- **Bilingual presence** — Arabic and English, often paired in lockup.
- **Civic framing** — references to Dubai, UAE, Government of Dubai are surfaced; "Knowledge" / "المعرفة" is the central brand promise.

If you write CTAs or announcements in this app, mirror that register: "View inspection outcomes" rather than "Check it out".
