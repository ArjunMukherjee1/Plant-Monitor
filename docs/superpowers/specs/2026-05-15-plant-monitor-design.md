# Plant Monitor App — Design Spec
_2026-05-15_

## Overview

A cross-platform mobile app (iOS + Android) built with React Native + Expo that connects to a ThirdReality soil moisture sensor via Home Assistant's API. The app displays real-time sensor readings, inferred plant health data, and trend charts. Push notifications alert the user when soil conditions fall outside healthy ranges.

## Data Pipeline

```
ThirdReality Sensor → Zigbee → Home Assistant
  → REST API (current state, history)
  → WebSocket API (real-time updates)
  → React Native App (Expo)

Push Notifications:
  Phone registers Expo push token (stored in HA input_text helper)
  HA automation detects low moisture → calls Expo Push API → phone notification
```

## Sensors

- **Soil Moisture** — percentage (0–100%)
- **Soil Temperature** — °F
- **Light** — future, entity ID placeholder in settings

## Screens

### 1. Dashboard
- Large circular health score ring (0–100, animated)
- Sensor reading cards: moisture % + soil temp
- Watering prediction ("Water in ~8 hours" or "Water now")
- 24h moisture sparkline
- Color-coded status: green (good), amber (caution), red (critical)

### 2. Charts
- Full-size line charts for moisture and temperature
- Time range selector: 6h / 24h / 7d
- Drying rate annotation (% per hour)
- Optimal range band overlay (shaded region)

### 3. Settings
- Home Assistant URL + long-lived access token
- Entity IDs for each sensor (moisture, temp, future: light)
- Optimal range configuration (moisture min/max, temp min/max)
- Notification threshold (moisture % to trigger alert)
- Expo push token registration

## Inferred Data

| Signal | Method |
|---|---|
| Health score | Weighted deviation from optimal: moisture 60%, temp 40% |
| Watering prediction | Linear regression on moisture history → time to hit low threshold |
| Drying rate | Moisture Δ per hour (rolling 3h average) |
| Status label | Good / Needs Water Soon / Water Now / Too Wet / Too Hot |

Optimal defaults (user-configurable): moisture 40–80%, temp 60–80°F.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (Expo managed workflow) |
| Language | TypeScript |
| Navigation | React Navigation (bottom tabs) |
| Data fetching | TanStack Query (react-query) |
| Charts | react-native-chart-kit |
| Storage | expo-secure-store (HA token), AsyncStorage (settings) |
| Notifications | expo-notifications |
| HA WebSocket | `home-assistant-js-websocket` |

## Design Aesthetic

- Dark theme — deep slate/forest palette
- Accent colors: emerald green (good), amber (caution), rose (critical)
- Rounded cards, generous padding
- Health ring as hero element
- Minimal text — let numbers and color communicate status

## File Structure

```
FAN/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
└── src/
    ├── api/
    │   ├── homeAssistant.ts    # REST + WebSocket client
    │   └── types.ts
    ├── components/
    │   ├── HealthRing.tsx
    │   ├── SensorCard.tsx
    │   ├── SparkLine.tsx
    │   └── StatusBadge.tsx
    ├── screens/
    │   ├── DashboardScreen.tsx
    │   ├── ChartsScreen.tsx
    │   └── SettingsScreen.tsx
    ├── hooks/
    │   ├── useSensorData.ts
    │   ├── useHistory.ts
    │   └── useNotifications.ts
    ├── utils/
    │   ├── plantHealth.ts      # score, predictions, drying rate
    │   └── formatting.ts
    └── constants/
        └── theme.ts
```

## Future: Irrigation Control

Settings screen has a placeholder "Irrigation" section (disabled, labeled "Coming Soon"). The HA API client will include a stub `callService()` method ready to trigger HA switch/script entities.

## Out of Scope (this version)

- Multiple plants / zones
- Light sensor (entity ID slot exists but UI hidden until sensor is added)
- Cloud sync or user accounts
- Web version
