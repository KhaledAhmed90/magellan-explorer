# Magellan Explorer

Build the Magellan interactive web prototype based on this authoritative specification. IMPORTANT: this is NOT a replacement for the production Android application. The production app is Expo + React Native. This web project is only a UX/UI prototype to visualize the latest approved Magellan functionality. Do not turn it into a generic GPS dashboard and do not invent native capabilities.

PRODUCT: Magellan.

CORE RULES:
- Preserve the existing Magellan product identity, information architecture, screens, terminology and existing functionality. Do not unnecessarily redesign or remove current features.
- Latest priorities: (1) fix QR generation, (2) reliable QR sharing/scanning, (3) real Android GnssStatus integration in production, (4) remove fake satellite counts, (5) real satellite list/C/N0, (6) real constellations, (7) real Sky View, (8) waypoint navigation, (9) real direction arrow, (10) distance/bearing/heading, (11) arrival detection, (12) transport abstraction, then additional GNSS/raw measurements where supported.
- Production GNSS uses Android LocationManager, GnssStatus and GnssStatus.Callback through an Expo Module or React Native native module. Real fields: satellitesVisible, satellitesUsedInFix, constellation, SVID, azimuth, elevation, C/N0, usedInFix, and where supported carrierFrequency, basebandCn0DbHz, almanac and ephemeris. Unsupported values must be unavailable, never fabricated.
- Satellite UI must support GPS, Galileo, GLONASS, BeiDou, QZSS, SBAS and other Android-returned constellations; show visible/used counts, SVID, elevation, azimuth, C/N0 and used-in-fix; group/filter by constellation.
- Sky View uses real azimuth/elevation in production with N/E/S/W; no fake satellite positions.
- Navigation is in-app. Show waypoint, distance, target bearing, current heading, relative bearing, accuracy, coordinates and navigation state. Arrow rotation is based on targetBearing-currentHeading normalized to -180..180. Use course bearing while moving and compass/magnetometer when appropriate while stationary. Never fabricate heading. Distance, bearing and arrival detection must update correctly.
- Waypoints support add/edit/delete/persist/open navigation; arrival detection considers distance and accuracy.
- QR uses one versioned payload format. Production QR must be actually scannable, safely reject malformed data, display received location, navigate to it, save it and share it again. Do not create a second incompatible payload format.
- Transport architecture: LocationPayload -> TransportManager -> QR / Bluetooth / Wi-Fi Direct / Local Network / future transports. UI must distinguish Supported, Available, Connected, Ready, Permission Required and Unavailable. Never fake native transport success.
- Offline-first: GNSS, satellites, waypoints, navigation, QR, history, settings and local sharing do not depend on cloud services.
- No fake GNSS, satellite counts, C/N0, heading, accuracy, altitude, coordinates, constellation or capability values in production. In this browser prototype, simulated data may be used only to visualize native-only screens and must be visibly labeled DEMO / SIMULATED.

UX/UI:
- Modern, premium, clean and technical, but recognizably Magellan rather than a new product.
- Mobile-first responsive design.
- English + Arabic RTL.
- Light + dark mode.
- Excellent accessibility and typography.
- Do not overuse gradients, gauges or decorative effects.

SCREENS:
Home/Dashboard; Satellites; Sky View; Signal/CN0; Share Location; Receive Location; QR presentation; QR scan flow; Transport/Nearby selection; Navigation; Waypoints; History; Settings; About; Privacy.

INTERACTIONS:
- Home shows location, accuracy, altitude, speed, bearing, GNSS status and visible/used satellite summary.
- Satellites list and satellite detail are interactive.
- Sky View is interactive and shows simulated demo satellite data only in the browser.
- QR share shows a real browser-generated QR for a versioned demo location payload; receive flow can simulate scanning but must label the native camera portion as simulated.
- Navigation demonstrates target selection, distance/bearing updates and arrow behavior using controlled demo data; label sensor-dependent heading as simulated.
- Waypoints can be created/edited/deleted in local browser storage for prototype purposes.
- Transport selection demonstrates state handling without pretending Bluetooth/Wi-Fi Direct actually connected.

ARCHITECTURE:
Keep native-only concerns conceptually separated from the web UI. Model a DemoGnssProvider for the browser so it can later be replaced by the Android native GnssStatus bridge. Model the sharing flow around a versioned LocationPayload and TransportManager abstraction. Do not add authentication, cloud database or unnecessary backend services.

IMPORTANT: the authoritative reference is the latest Magellan implementation specification: preserve existing functionality; do not rewrite the production app; do not leave fake satellite calculations; do not claim browser APIs are Android GNSS APIs; and do not claim native transports are functional in this web prototype.

Build the complete interactive prototype now. Do not leave major screens empty or as generic 'coming soon' placeholders.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f87b0af-a68c-43c5-8662-5798746c13b7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
