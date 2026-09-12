# Umrah Companion — mobile app

Expo (React Native + TypeScript) app for pilgrims. Implements the 16-screen design from
`project/Umrah Companion.dc.html`: Home, Guide hub, First-time Umrah, Duas, Packing,
Vaccines, News, Nusuk, FAQ, Packages, Package detail, Customize, Services, More,
Settings, Gallery.

The visual language is a custom **"elegant heritage"** redesign on top of that content
structure — deep emerald + gold-foil accents, a serif display typeface for headings,
soft-rounded cards with shadows, replacing the original handoff's flat zero-radius
"Modernist" system (kept in `project/`) with something more premium-feeling for a
travel/hospitality brand. See "Design system" below.

## Setup

Start the `server` app first (this app reads all its content from that API).

```sh
npm install
cp .env.example .env      # EXPO_PUBLIC_API_URL, defaults to http://localhost:4000/api
npx expo start
```

- On a physical device / simulator, point `EXPO_PUBLIC_API_URL` at your machine's LAN IP
  instead of `localhost`.
- `npx expo start --web` also works for a quick check in a desktop browser via
  react-native-web, though it's not a substitute for testing an actual iOS/Android build.

## Design system

- **Palette** (`src/theme/tokens.ts`): deep emerald (`accent`/`accentLight`/`accentDeep`,
  used as a gradient on primary CTAs and hero banners) + gold-foil (`gold`/`goldLight`/
  `goldDeep`, used for prices, premium badges, and dua "when" labels) on a warm ivory
  ground (`bg`/`surface`/`surfaceAlt`). Full dark-mode equivalents included.
- **Shape**: soft-rounded throughout (`radius.sm/md/lg/pill` = 8/14/20/999px) — a
  deliberate departure from the original handoff's zero-radius "Modernist" look.
- **Cards, not flat dividers** (`components/Card.tsx`, `CardStack`): the handoff's
  edge-to-edge sections separated by 2px rules are replaced with floating rounded cards
  with soft shadows (`theme/tokens.ts`'s `shadow()` helper) and consistent spacing —
  every screen is built from `<ScreenScaffold><CardStack><Card>…`.
- **Typography**: Playfair Display (serif, `weight="display"`/`"displayBlack"` on
  `AppText`) for English headings and hero numbers; Hindi/Urdu headings fall back to
  their own boldest native weight since Playfair carries no Devanagari/Arabic glyphs.
- **Icon badges** (`components/IconBadge.tsx`): icons sit in a soft tinted circle rather
  than bare on the page — used in quick-access tiles and list rows.
- **Bottom nav** (`navigation/BottomTabBar.tsx`): a floating rounded pill bar; only the
  active tab shows its label (expanding pill), inactive tabs are icon-only.

## Architecture notes

- **Theming** (`src/theme`): see "Design system" above for the palette itself.
- **Language** (`src/i18n`): EN/HI/UR. UI chrome strings live in `src/i18n/strings.ts`;
  actual content (packages, duas, FAQ, etc.) comes from the API with `En`/`Hi`/`Ur`
  fields per row, picked via `useLanguage().field(...)`.
- **Direction** (`src/direction/DirectionContext.tsx`): a **custom** RTL implementation,
  not React Native's `I18nManager.forceRTL` — that requires a full app reload to take
  effect, which would break the Settings screen's live RTL↔LTR toggle for Urdu. Every
  screen instead reads `useDirection()` for `row` (flexDirection), `textAlign`, and
  `writingDirection`, updated instantly on toggle.
- **Fonts**: bundled via `@expo-google-fonts/*` packages (Archivo, Noto Sans Devanagari,
  Noto Nastaliq Urdu, Noto Naskh Arabic) rather than a Google Fonts network fetch.
- **Navigation** (`src/navigation`): a single native-stack holding all 16 screens (so the
  back button works uniformly regardless of which bottom-tab section you drilled in
  from — matching the design's single global screen stack) plus a custom persistent
  `BottomTabBar` that highlights by section, not by which stack you're nested in.
- **Local vs. server state**: checklist ticks (guide steps, packing, vaccines) and
  theme/language/RTL preference are device-local (`AsyncStorage`, via
  `usePersistentState`) — everything else comes from the API via TanStack Query.
- **Images**: the design ships grayscale placeholder blocks (no real photography yet);
  `components/PlaceholderImage.tsx` reproduces that.
