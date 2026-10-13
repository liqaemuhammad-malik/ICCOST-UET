# UI Component Inventory & Design System

Platform: **ICOSST 2026 Registration, Fees, Payment & Confirmation Platform**  
Host Institution: **Al-Khawarizmi Institute of Computer Science (KICS), UET Lahore**

## 1. Unified Design Tokens

All components strictly honor the unified CSS tokens defined in `client/src/index.css` and `client/tailwind.config.js`:
- **Primary Brand Color:** UET Emerald Green (`#0b4f35` / `hsl(158, 76%, 18%)`)
- **Secondary Slate:** Institutional Navy/Slate (`#0f172a` / `hsl(222, 47%, 11%)`)
- **Accent Bronze/Amber:** Warning & Sample disclaimers (`#d97706`)
- **Backgrounds:** Clean academic off-white in light mode (`hsl(210, 40%, 98%)`), deep obsidian in dark mode (`hsl(222, 47%, 7%)`)
- **Typography:** Outfit (Display & Headings) + Inter (Interface & Body text)

## 2. Component Inventory

| Library | Component | Role | File Path |
|---|---|---|---|
| **shadcn/ui** | `Button` | Accessible button with variants (`default`, `outline`, `uet`, `amber`, `destructive`, `ghost`) | `client/src/components/ui/button.jsx` |
| **shadcn/ui** | `Card` | Card container, header, content, footer | `client/src/components/ui/card.jsx` |
| **shadcn/ui** | `Input` | Styled text, email, number input with focus ring | `client/src/components/ui/input.jsx` |
| **shadcn/ui** | `Label` | Accessible form label | `client/src/components/ui/label.jsx` |
| **shadcn/ui** | `Badge` | Status badges including `sample` fee tag, `uet` badge, and `success` indicator | `client/src/components/ui/badge.jsx` |
| **Aceternity UI** | `Spotlight` | Subtle academic hero spotlight highlight themed to UET emerald green | `client/src/components/aceternity/Spotlight.jsx` |
| **Magic UI** | `NumberTicker` | Smooth numeric increment animation for conference edition, attendees, and workshops | `client/src/components/magic/NumberTicker.jsx` |
| **Magic UI** | `Marquee` | Infinite loop ticker for conference sponsors, academic patrons, and IEEE sections | `client/src/components/magic/Marquee.jsx` |
| **React Bits** | `SplitText` | Staggered character reveal animation for conference titles | `client/src/components/reactbits/SplitText.jsx` |
| **Project Wrappers** | `HeroSection` | Authoritative conference hero with dates, venue, countdown, and pass CTA | `client/src/components/shared/HeroSection.jsx` |
| **Project Wrappers** | `StatTicker` | Four-metric grid highlighting key conference achievements | `client/src/components/shared/StatTicker.jsx` |
| **Project Wrappers** | `SampleNoticeBanner`| Prominent banner explaining that official ICOSST fees are SAMPLE amounts | `client/src/components/shared/SampleNoticeBanner.jsx` |

## 3. Surface Guidelines

1. **Public Site (`/`, `/catalog`, `/schedule`, `/tracks`):**
   - High-impact visual experience using Aceternity, Magic UI, and React Bits wrappers.
   - Clean, authentic academic styling without generic AI templates or placeholder fluff.
2. **Participant Portal (`/dashboard`):**
   - Clean, distraction-free shadcn/ui layout. Fast form inputs, status cards, and personal timetable.
3. **Admin Back-Office (`/admin`):**
   - High-density data tables and KPI cards. Zero decorative animation for maximum operational speed.
4. **Staff Scanner (`/scan`):**
   - Mobile-first, high-contrast feedback cards (Green/Red) designed for outdoor daylight scanning at gates and meal counters.
