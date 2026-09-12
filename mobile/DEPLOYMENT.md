# Publishing to the App Store & Play Store

This app builds through **EAS** (Expo Application Services) — Expo's cloud build/submit
pipeline. It handles the Xcode/Android Studio toolchains for you, so you don't need a Mac
to build the iOS app. `eas.json` (build profiles) and `app.json` (bundle identifiers,
version, icon) are already configured — `com.alzakwaantours.umrahcompanion` on both
platforms.

## What only you can do (accounts + payment)

Nobody else can create these — they tie to your identity/business and require payment:

1. **Expo account** — free. Sign up at expo.dev, then from `mobile/`: `npx eas login`.
2. **Apple Developer Program** — $99/year, needs an Apple ID and (for a company account)
   a D-U-N-S number for Alzakwaan Tours & Travels Pvt Ltd. Enroll at
   developer.apple.com/programs/enroll. Apple's review of a new account can take a day
   or two.
3. **Google Play Console** — $25 one-time. Sign up at play.google.com/console/signup.
   Usually approved instantly, sometimes needs identity verification (1-2 days).
4. **A privacy policy page**, publicly hosted (both stores require the URL in the store
   listing). A draft matching what this app actually does is in
   `mobile/PRIVACY_POLICY.md` — publish it at e.g. `alzakwaantour.com/privacy` and use
   that URL in both listings.

## What I can do once those exist

```sh
cd mobile
npx eas login                          # once you have an Expo account
npx eas init                           # links this project to an EAS project (writes extra.eas.projectId to app.json)
```

**Test on a real device first, before spending any store fees:**

```sh
npx eas build --platform android --profile preview
```

This produces a downloadable, installable `.apk` — no Play Console account needed for
this step. Install it on any Android phone and click through the whole app for real.
(An equivalent iOS "preview" build needs a device UDID registered to your Apple account,
so that one's easiest to skip until the Apple account exists — TestFlight, below, covers
iOS testing instead.)

**When you're ready to submit:**

```sh
npx eas build --platform all --profile production
npx eas submit --platform android      # needs a Google Play service-account JSON key
npx eas submit --platform ios          # needs your Apple ID / App Store Connect API key
```

`eas submit` will prompt for exactly what it needs (interactively) the first time —
for Android it's a service-account JSON downloaded from Play Console
(Setup → API access); for iOS it's your Apple ID (with an app-specific password) or an
App Store Connect API key.

## Store listing checklist (both platforms ask for these)

- App name: "Umrah Companion"
- Short + full description (English; Hindi/Urdu optional but the app itself supports
  those languages, worth mentioning)
- Screenshots — I can generate these from the app once we've done a preview build; both
  stores have specific required sizes per device class
- Privacy policy URL (see above)
- Content rating questionnaire — this app has no user-generated content, no ads, no
  in-app purchases; should land in the lowest-friction rating tier on both stores
- Google Play's "Data safety" form — this app collects: nothing account-related (no
  login), and the Customize-package form's inputs (city/travellers/nights/month/hotel/
  notes) are sent to your own server and opened in WhatsApp; no third-party analytics or
  ad SDKs are in the app currently, which keeps this form simple

## Current placeholder status

The app icon is a placeholder (a simple mosque-dome/crescent mark in the app's palette)
— not your real Al Zakwaan Tours logo. Swap it any time before submitting: replace
`mobile/assets/icon.png`, `android-icon-foreground.png`, `android-icon-monochrome.png`,
`favicon.png`, and `splash-icon.png`, matching the sizes/transparency the current files
use, then rebuild. No code changes needed elsewhere — `app.json` already points at these
filenames.
