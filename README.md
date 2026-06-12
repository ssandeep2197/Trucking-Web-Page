# Web Page Templates

A multi-template showcase built with **Vite + React + TypeScript + Tailwind CSS**, with a tiny hash router that lets you jump between visually distinct page templates from a single home gallery. The two templates currently shipped are:

- **`#/logistics`** — a dark enterprise freight site with a navbar, eight content sections (Features, Fleet, Technology, Stats, Services, Testimonials, Contact, etc.), Lenis smooth scroll, and GSAP `ScrollTrigger` reveal animations.
- **`#/crypto`** — a surreal "DeFi as a journey" page where the camera rides a glowing road through a stylized Three.js mountain landscape and passes through an opening gate at the end of the scroll.

There's also an in-browser **admin** (`#/admin`) that edits the logistics template's brand name, logo, headlines, contact info, and social links — saved in `localStorage` so the changes survive reloads.

---

## Routes

| URL hash | Renders |
|---|---|
| `#/` or `/` | **Home** — template gallery |
| `#/logistics` | Full logistics enterprise template |
| `#/crypto` | Surreal 3D crypto journey |
| `#/admin` | Site config admin (writes to `localStorage`) |

Routing is plain hash-based — no React Router. Mapping lives in [`src/lib/router.ts`](src/lib/router.ts) and the page mounting happens in [`src/App.tsx`](src/App.tsx). Add a new template by:
1. Adding a route literal to the `Route` union
2. Adding a branch in `parseHash`
3. Creating a `src/pages/<YourTemplate>.tsx`
4. Mounting it in `App.tsx`
5. Adding a card to the `templates` array in [`src/pages/Home.tsx`](src/pages/Home.tsx)

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Open `http://localhost:5173/` for the template gallery, or jump straight into a template via `#/logistics`, `#/crypto`, or `#/admin`.

### Production build

```bash
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve dist/ locally
```

---

## Stack

| Concern | Library |
|---|---|
| Bundler / dev server | **Vite 5** |
| UI | **React 18** + TypeScript |
| Styles | **Tailwind CSS** (custom dark palette + utility classes) |
| 2D animation | **Framer Motion** |
| Scroll storytelling | **GSAP + ScrollTrigger** |
| Smooth scrolling (logistics page) | **Lenis** |
| 3D rendering (crypto page) | **Three.js + @react-three/fiber v8** |
| Icons | **lucide-react** |

`@react-three/fiber` is pinned to v8.x to keep the React-18 peer dep clean (v9 pulls in Expo).

---

## Project structure

```
src/
├── App.tsx                       # Route → page mounting
├── main.tsx                      # React root
├── styles/globals.css            # Tailwind layers + button/card utilities
│
├── lib/
│   ├── router.ts                 # parseHash + useRoute hook
│   └── siteConfig.tsx            # localStorage-backed config + context
│
├── pages/
│   ├── Home.tsx                  # template gallery
│   ├── Logistics.tsx             # logistics template (composes /sections)
│   ├── Crypto.tsx                # crypto template (chapter scroll + 3D)
│   └── Admin.tsx                 # editable site config UI
│
├── sections/                     # Logistics template body sections
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Fleet.tsx
│   ├── Technology.tsx
│   ├── Stats.tsx
│   ├── Services.tsx
│   ├── Testimonials.tsx
│   └── Contact.tsx
│
├── components/                   # Shared UI
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── BrandMark.tsx             # logo or fallback
│   ├── Counter.tsx               # animated number count-up
│   ├── ErrorBoundary.tsx         # site-wide & per-canvas
│   ├── PointerBackdrop.tsx       # cursor-following spotlight
│   ├── SmoothScroll.tsx          # Lenis + GSAP ticker hookup
│   └── SvgTruck.tsx              # logistics fleet preview
│
├── hooks/
│   └── useGsapReveal.tsx         # data-reveal="…" stagger reveals
│
└── three/
    └── crypto/                   # Crypto template's 3D scene modules
        ├── CryptoScene.tsx       # Canvas + camera rig + scroll → ride() mapping
        ├── Mountains.tsx         # 4-layer painted peaks
        ├── Road.tsx              # glowing asphalt ribbon + street lights
        ├── Trees.tsx             # low-poly conifers
        ├── Crystals.tsx          # floating glowing octahedrons
        ├── FloatingRocks.tsx     # whimsical floating platforms
        ├── Gate.tsx              # stone portal — opens at scroll ≈ 0.72
        └── Atmosphere.tsx        # sky + sun + dust
```

---

## How the crypto template works

A single CatmullRom curve (`getRoadCurve()` in `Road.tsx`) is the spine of the whole scene:

1. **Road geometry** is a manual flat ribbon stitched along the curve sample-by-sample, with horizontal perpendiculars so it never banks.
2. **Mountains and trees** sample that same curve and reject placements that would intersect it — the road never disappears behind a mountain.
3. **Street lights** are placed at evenly-spaced points along the curve, with their poles rotated to face the road.
4. **The camera** rides the same curve via a single continuous `rideAt(scrollProgress)` function. For scroll `0 → 0.94` the camera follows the road; for `0.94 → 1.0` it drifts forward up to 10 units past the road's end so it physically passes through the open gate.
5. **The gate** sits at the curve's terminus, oriented along the final tangent. Its doors open as `scrollProgress` crosses `0.72 → 0.94`, and an "ENTER THE WORLD" canvas-textured banner pulses above.

All page scroll → 3D position coupling goes through one GSAP `ScrollTrigger` with `scrub: 0.15`, writing to a mutable ref so React doesn't re-render the scene per frame.

---

## How the logistics template works

Standard composition: `Navbar` + 8 sections + `Footer`, all reading content from a single config context (`src/lib/siteConfig.tsx`). The config is loaded from / written to `localStorage` under the key `site_config_v1`, so anything you edit in `#/admin` persists across reloads.

Reveal animations use a `useGsapReveal` hook + `data-reveal="title|block|card|words"` attributes — that keeps each section's JSX clean of GSAP boilerplate.

Lenis is mounted once in the logistics page (via `SmoothScroll`) and registers with GSAP's ticker so `ScrollTrigger` updates fire against the smoothed scroll position, not the raw one.

---

## Customizing the logistics template

1. Visit `http://localhost:5173/#/admin`
2. Use the sidebar to edit:
   - **Brand** — company name, short brand mark, tagline, logo upload, accent color
   - **Hero** — eyebrow, multi-line headline, gradient highlight, subhead, CTAs
   - **Section Titles** — kicker + title + accent highlight for all eight sections
   - **Contact Info** — email, phone, address
   - **Footer** — tagline + legal line
   - **Social Links** — Twitter / LinkedIn / GitHub / Facebook / Instagram / YouTube
3. **Import / Export** tab can download the current config as JSON or paste one back in (handy for setting up a new install).

Logos under 2 MB are stored as base64 inside the JSON.

---

## Performance notes

- The crypto template's `@react-three/fiber` Canvas adapts at mount:
  - **Mobile / coarse pointer** → `dpr: [0.9, 1.1]`, antialias off
  - **Desktop** → `dpr: [1, 1.5]`, antialias on
- An `IntersectionObserver` sets the Canvas `frameloop` to `"never"` whenever the scene scrolls off-screen — zero GPU cost on the rest of the page.
- Three.js is lazy-loaded only on `#/crypto` (split into its own Vite chunk).
- Hero scene uses ~16 point lights total (street lights + sun + portal); crystals and rocks glow via emissive material rather than per-instance lights.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b && vite build` → static bundle in `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint (config not committed; placeholder) |

---

## Browser support

Modern evergreens (Chrome, Firefox, Safari, Edge). The crypto template needs WebGL 2; if it fails the page falls back to a static painted gradient via the per-Canvas `ErrorBoundary`.
