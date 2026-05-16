# Plant Monitor App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React Native (Expo) plant monitoring app that reads ThirdReality soil sensor data from Home Assistant and displays health scores, trend charts, and watering predictions.

**Architecture:** The app communicates with Home Assistant's REST API for current state and history. TanStack Query handles polling (30s interval) and caching. All plant health inference (score, predictions, drying rate) happens on-device in pure utility functions. Push notifications are managed via Expo's push service, with HA automations calling the Expo push API when thresholds are crossed.

**Tech Stack:** React Native + Expo (managed), TypeScript, React Navigation (bottom tabs), TanStack Query, react-native-svg, react-native-chart-kit, expo-secure-store, expo-notifications, @react-native-async-storage/async-storage

---

## File Map

| File | Responsibility |
|---|---|
| `App.tsx` | Root: QueryClient provider + bottom tab navigator |
| `src/api/types.ts` | All shared TypeScript interfaces |
| `src/constants/theme.ts` | Colors, spacing, radius, font sizes |
| `src/utils/plantHealth.ts` | Health score, status, watering prediction, drying rate |
| `src/utils/formatting.ts` | Display strings: moisture %, temp, time, prediction |
| `src/api/homeAssistant.ts` | HA REST client factory (`getState`, `getHistory`, `callService`) |
| `src/hooks/useSettings.ts` | Load/save AppSettings from AsyncStorage + SecureStore |
| `src/hooks/useSensorData.ts` | TanStack Query hook — current moisture + temp readings |
| `src/hooks/useHistory.ts` | TanStack Query hook — historical HistoryPoint[] |
| `src/hooks/useNotifications.ts` | Expo push token registration |
| `src/components/StatusBadge.tsx` | Pill badge: color + dot + label |
| `src/components/SensorCard.tsx` | Metric tile: label / big value / subtitle |
| `src/components/HealthRing.tsx` | Animated SVG circle ring with score + status color |
| `src/components/SparkLine.tsx` | Compact SVG line + fill area chart |
| `src/screens/SettingsScreen.tsx` | HA credentials, entity IDs, thresholds form |
| `src/screens/DashboardScreen.tsx` | Health ring + sensor cards + sparkline + prediction |
| `src/screens/ChartsScreen.tsx` | Full react-native-chart-kit line charts + time range selector |

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `babel.config.js`
- Create: `App.tsx` (placeholder)

- [ ] **Step 1: Write package.json**

```json
{
  "name": "fan",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "test": "jest --watchAll=false"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "@expo/vector-icons": "^14.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-notifications": "~0.29.0",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "react-native-screens": "~3.34.0",
    "react-native-safe-area-context": "4.12.0",
    "@tanstack/react-query": "^5.59.0",
    "react-native-svg": "15.8.0",
    "react-native-chart-kit": "^6.12.0",
    "react": "18.3.2",
    "react-native": "0.76.5"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~18.3.12",
    "@testing-library/react-native": "^12.7.0",
    "@testing-library/jest-native": "^5.4.3",
    "jest": "^29.2.1",
    "jest-expo": "~52.0.0",
    "typescript": "^5.3.0"
  },
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-chart-kit)"
    ],
    "moduleNameMapper": {
      "^react-native-svg$": "<rootDir>/__mocks__/react-native-svg.js"
    }
  }
}
```

- [ ] **Step 2: Write app.json**

```json
{
  "expo": {
    "name": "FAN",
    "slug": "fan-plant-monitor",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "fan",
    "userInterfaceStyle": "dark",
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.fan.plantmonitor"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#0D1117"
      },
      "package": "com.fan.plantmonitor"
    },
    "plugins": [
      "expo-secure-store",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#4ADE80"
        }
      ]
    ]
  }
}
```

- [ ] **Step 3: Write tsconfig.json**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 4: Write babel.config.js**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

- [ ] **Step 5: Write placeholder App.tsx**

```tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0D1117', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#4ADE80' }}>FAN — Plant Monitor</Text>
    </View>
  );
}
```

- [ ] **Step 6: Create SVG mock for tests**

Create `__mocks__/react-native-svg.js`:

```js
const React = require('react');
const { View, Text } = require('react-native');

const Svg = ({ children, ...props }) => React.createElement(View, props, children);
const Circle = (props) => React.createElement(View, props);
const Polyline = (props) => React.createElement(View, props);
const Polygon = (props) => React.createElement(View, props);
const Path = (props) => React.createElement(View, props);

module.exports = { default: Svg, Svg, Circle, Polyline, Polygon, Path };
```

- [ ] **Step 7: Install dependencies**

```bash
cd /Users/arjun/FAN && npm install
```

Expected: `node_modules/` created, no errors (warnings OK).

- [ ] **Step 8: Verify test runner works**

```bash
cd /Users/arjun/FAN && npm test -- --passWithNoTests
```

Expected: `Ran 0 tests, passed.`

- [ ] **Step 9: Commit**

```bash
cd /Users/arjun/FAN && git init && git add -A && git commit -m "feat: initialize Expo React Native project"
```

---

## Task 2: Types and theme

**Files:**
- Create: `src/api/types.ts`
- Create: `src/constants/theme.ts`

- [ ] **Step 1: Create src/api/types.ts**

```typescript
export interface SensorState {
  entityId: string;
  value: number;
  unit: string;
  lastUpdated: Date;
}

export interface HistoryPoint {
  timestamp: Date;
  value: number;
}

export type PlantStatus =
  | 'good'
  | 'needs-water-soon'
  | 'water-now'
  | 'too-wet'
  | 'too-hot'
  | 'too-cold';

export interface PlantHealth {
  score: number;
  status: PlantStatus;
  label: string;
}

export interface WateringPrediction {
  hoursUntilDry: number | null;
  dryingRatePerHour: number;
}

export interface AppSettings {
  haUrl: string;
  haToken: string;
  moistureEntityId: string;
  temperatureEntityId: string;
  lightEntityId: string;
  optimalMoistureMin: number;
  optimalMoistureMax: number;
  optimalTempMin: number;
  optimalTempMax: number;
  notificationThreshold: number;
}
```

- [ ] **Step 2: Create src/constants/theme.ts**

```typescript
export const colors = {
  bg: '#0D1117',
  surface: '#161B22',
  surfaceAlt: '#1C2128',
  border: '#30363D',

  good: '#4ADE80',
  caution: '#FBBF24',
  critical: '#F87171',
  moisture: '#60A5FA',
  temp: '#FB923C',

  text: '#E6EDF3',
  textMuted: '#8B949E',
  textFaint: '#484F58',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  hero: 48,
};
```

- [ ] **Step 3: Commit**

```bash
git add src/api/types.ts src/constants/theme.ts && git commit -m "feat: add types and theme constants"
```

---

## Task 3: Plant health utilities (TDD)

**Files:**
- Create: `src/utils/__tests__/plantHealth.test.ts`
- Create: `src/utils/plantHealth.ts`

- [ ] **Step 1: Write failing tests**

Create `src/utils/__tests__/plantHealth.test.ts`:

```typescript
import {
  calculateHealthScore,
  getPlantStatus,
  statusToLabel,
  statusToColor,
  getPlantHealth,
  calculateWateringPrediction,
} from '../plantHealth';
import { colors } from '../../constants/theme';

const defaultSettings = {
  optimalMoistureMin: 40,
  optimalMoistureMax: 80,
  optimalTempMin: 60,
  optimalTempMax: 80,
  notificationThreshold: 25,
};

describe('calculateHealthScore', () => {
  it('returns 100 when both moisture and temp are in optimal range', () => {
    expect(calculateHealthScore(60, 70, defaultSettings)).toBe(100);
  });

  it('decreases score when moisture is below optimal', () => {
    const score = calculateHealthScore(20, 70, defaultSettings);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('returns 0 when moisture is far outside optimal range', () => {
    expect(calculateHealthScore(0, 70, defaultSettings)).toBe(28);
  });

  it('weights moisture 60% and temp 40%', () => {
    const moistureOnly = calculateHealthScore(0, 70, defaultSettings);
    const tempOnly = calculateHealthScore(60, 0, defaultSettings);
    expect(moistureOnly).toBeLessThan(tempOnly);
  });
});

describe('getPlantStatus', () => {
  it('returns good when in optimal range', () => {
    expect(getPlantStatus(60, 70, defaultSettings)).toBe('good');
  });

  it('returns water-now when moisture at or below threshold', () => {
    expect(getPlantStatus(25, 70, defaultSettings)).toBe('water-now');
    expect(getPlantStatus(10, 70, defaultSettings)).toBe('water-now');
  });

  it('returns needs-water-soon when below optimal but above threshold', () => {
    expect(getPlantStatus(30, 70, defaultSettings)).toBe('needs-water-soon');
  });

  it('returns too-wet when above optimal max', () => {
    expect(getPlantStatus(90, 70, defaultSettings)).toBe('too-wet');
  });

  it('returns too-hot when temp above optimal max', () => {
    expect(getPlantStatus(60, 90, defaultSettings)).toBe('too-hot');
  });

  it('returns too-cold when temp below optimal min', () => {
    expect(getPlantStatus(60, 50, defaultSettings)).toBe('too-cold');
  });
});

describe('statusToLabel', () => {
  it('maps statuses to human-readable labels', () => {
    expect(statusToLabel('good')).toBe('Good');
    expect(statusToLabel('water-now')).toBe('Water Now');
    expect(statusToLabel('needs-water-soon')).toBe('Needs Water Soon');
    expect(statusToLabel('too-wet')).toBe('Too Wet');
    expect(statusToLabel('too-hot')).toBe('Too Hot');
    expect(statusToLabel('too-cold')).toBe('Too Cold');
  });
});

describe('statusToColor', () => {
  it('returns good color for good status', () => {
    expect(statusToColor('good')).toBe(colors.good);
  });

  it('returns critical color for water-now', () => {
    expect(statusToColor('water-now')).toBe(colors.critical);
  });

  it('returns caution for other statuses', () => {
    expect(statusToColor('needs-water-soon')).toBe(colors.caution);
    expect(statusToColor('too-hot')).toBe(colors.caution);
  });
});

describe('calculateWateringPrediction', () => {
  const now = Date.now();

  it('returns null hours when fewer than 2 history points', () => {
    const result = calculateWateringPrediction([], 25);
    expect(result.hoursUntilDry).toBeNull();
    expect(result.dryingRatePerHour).toBe(0);
  });

  it('calculates hours until dry based on linear drying trend', () => {
    const history = [
      { timestamp: new Date(now - 2 * 3600_000), value: 70 },
      { timestamp: new Date(now - 1 * 3600_000), value: 60 },
      { timestamp: new Date(now), value: 50 },
    ];
    const result = calculateWateringPrediction(history, 25);
    expect(result.dryingRatePerHour).toBeCloseTo(-10, 0);
    expect(result.hoursUntilDry).toBeCloseTo(2.5, 0);
  });

  it('returns null hours when moisture is increasing', () => {
    const history = [
      { timestamp: new Date(now - 3600_000), value: 50 },
      { timestamp: new Date(now), value: 70 },
    ];
    const result = calculateWateringPrediction(history, 25);
    expect(result.hoursUntilDry).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
cd /Users/arjun/FAN && npm test -- src/utils/__tests__/plantHealth.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '../plantHealth'`

- [ ] **Step 3: Implement src/utils/plantHealth.ts**

```typescript
import { AppSettings, HistoryPoint, PlantHealth, PlantStatus, WateringPrediction } from '../api/types';
import { colors } from '../constants/theme';

function scoreInRange(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 100;
  const buffer = (max - min) / 2;
  const deviation = value < min ? min - value : value - max;
  return Math.max(0, Math.round(100 - (deviation / buffer) * 100));
}

type HealthSettings = Pick<
  AppSettings,
  'optimalMoistureMin' | 'optimalMoistureMax' | 'optimalTempMin' | 'optimalTempMax'
>;

type StatusSettings = HealthSettings & Pick<AppSettings, 'notificationThreshold'>;

export function calculateHealthScore(moisture: number, temp: number, settings: HealthSettings): number {
  const moistureScore = scoreInRange(moisture, settings.optimalMoistureMin, settings.optimalMoistureMax);
  const tempScore = scoreInRange(temp, settings.optimalTempMin, settings.optimalTempMax);
  return Math.round(moistureScore * 0.6 + tempScore * 0.4);
}

export function getPlantStatus(moisture: number, temp: number, settings: StatusSettings): PlantStatus {
  if (moisture <= settings.notificationThreshold) return 'water-now';
  if (moisture < settings.optimalMoistureMin) return 'needs-water-soon';
  if (moisture > settings.optimalMoistureMax) return 'too-wet';
  if (temp > settings.optimalTempMax) return 'too-hot';
  if (temp < settings.optimalTempMin) return 'too-cold';
  return 'good';
}

export function statusToLabel(status: PlantStatus): string {
  const labels: Record<PlantStatus, string> = {
    good: 'Good',
    'needs-water-soon': 'Needs Water Soon',
    'water-now': 'Water Now',
    'too-wet': 'Too Wet',
    'too-hot': 'Too Hot',
    'too-cold': 'Too Cold',
  };
  return labels[status];
}

export function statusToColor(status: PlantStatus): string {
  if (status === 'good') return colors.good;
  if (status === 'water-now') return colors.critical;
  return colors.caution;
}

export function getPlantHealth(moisture: number, temp: number, settings: StatusSettings): PlantHealth {
  const score = calculateHealthScore(moisture, temp, settings);
  const status = getPlantStatus(moisture, temp, settings);
  return { score, status, label: statusToLabel(status) };
}

export function calculateWateringPrediction(
  history: HistoryPoint[],
  lowThreshold: number
): WateringPrediction {
  if (history.length < 2) return { hoursUntilDry: null, dryingRatePerHour: 0 };

  const threeHoursAgo = Date.now() - 3 * 3_600_000;
  let recent = history.filter((p) => p.timestamp.getTime() >= threeHoursAgo);
  if (recent.length < 2) recent = history.slice(-2);

  const first = recent[0];
  const last = recent[recent.length - 1];
  const timeDeltaHours = (last.timestamp.getTime() - first.timestamp.getTime()) / 3_600_000;

  if (timeDeltaHours === 0) return { hoursUntilDry: null, dryingRatePerHour: 0 };

  const dryingRatePerHour = (last.value - first.value) / timeDeltaHours;

  if (dryingRatePerHour >= 0) return { hoursUntilDry: null, dryingRatePerHour };

  const hoursUntilDry = (last.value - lowThreshold) / Math.abs(dryingRatePerHour);
  return { hoursUntilDry: Math.max(0, hoursUntilDry), dryingRatePerHour };
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
cd /Users/arjun/FAN && npm test -- src/utils/__tests__/plantHealth.test.ts --no-coverage
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/ && git commit -m "feat: add plant health utility functions with tests"
```

---

## Task 4: Formatting utilities (TDD)

**Files:**
- Create: `src/utils/__tests__/formatting.test.ts`
- Create: `src/utils/formatting.ts`

- [ ] **Step 1: Write failing tests**

Create `src/utils/__tests__/formatting.test.ts`:

```typescript
import {
  formatMoisture,
  formatTemp,
  formatDryingRate,
  formatWateringPrediction,
  formatLastUpdated,
} from '../formatting';

describe('formatMoisture', () => {
  it('rounds and appends %', () => {
    expect(formatMoisture(58.7)).toBe('59%');
    expect(formatMoisture(40)).toBe('40%');
  });
});

describe('formatTemp', () => {
  it('rounds and appends °F', () => {
    expect(formatTemp(72.4)).toBe('72°F');
    expect(formatTemp(60)).toBe('60°F');
  });
});

describe('formatDryingRate', () => {
  it('returns Stable when rate is positive or zero', () => {
    expect(formatDryingRate(0)).toBe('Stable');
    expect(formatDryingRate(2)).toBe('Stable');
  });

  it('shows downward rate when negative', () => {
    expect(formatDryingRate(-3.5)).toBe('▼ 3.5%/hr');
    expect(formatDryingRate(-10)).toBe('▼ 10.0%/hr');
  });
});

describe('formatWateringPrediction', () => {
  it('returns Stable when null', () => {
    expect(formatWateringPrediction(null)).toBe('Stable');
  });

  it('returns Water now when 0 or negative', () => {
    expect(formatWateringPrediction(0)).toBe('Water now');
  });

  it('returns less-than-1h message for small values', () => {
    expect(formatWateringPrediction(0.5)).toBe('Water in < 1 hour');
  });

  it('rounds hours and formats message', () => {
    expect(formatWateringPrediction(8.3)).toBe('Water in ~8h');
    expect(formatWateringPrediction(2)).toBe('Water in ~2h');
  });
});

describe('formatLastUpdated', () => {
  it('returns Just now for recent updates', () => {
    expect(formatLastUpdated(new Date(Date.now() - 30_000))).toBe('Just now');
  });

  it('returns 1 min ago', () => {
    expect(formatLastUpdated(new Date(Date.now() - 90_000))).toBe('1 min ago');
  });

  it('returns N min ago', () => {
    expect(formatLastUpdated(new Date(Date.now() - 5 * 60_000))).toBe('5 min ago');
  });

  it('returns hours for older updates', () => {
    expect(formatLastUpdated(new Date(Date.now() - 2 * 3_600_000))).toBe('2h ago');
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
cd /Users/arjun/FAN && npm test -- src/utils/__tests__/formatting.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '../formatting'`

- [ ] **Step 3: Implement src/utils/formatting.ts**

```typescript
export function formatMoisture(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatTemp(value: number): string {
  return `${Math.round(value)}°F`;
}

export function formatDryingRate(ratePerHour: number): string {
  if (ratePerHour >= 0) return 'Stable';
  return `▼ ${Math.abs(ratePerHour).toFixed(1)}%/hr`;
}

export function formatWateringPrediction(hoursUntilDry: number | null): string {
  if (hoursUntilDry === null) return 'Stable';
  if (hoursUntilDry <= 0) return 'Water now';
  if (hoursUntilDry < 1) return 'Water in < 1 hour';
  return `Water in ~${Math.round(hoursUntilDry)}h`;
}

export function formatLastUpdated(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Just now';
  if (diffMin === 1) return '1 min ago';
  if (diffMin < 60) return `${diffMin} min ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
cd /Users/arjun/FAN && npm test -- src/utils/__tests__/formatting.test.ts --no-coverage
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/formatting.ts src/utils/__tests__/formatting.test.ts && git commit -m "feat: add formatting utilities with tests"
```

---

## Task 5: Home Assistant API client (TDD)

**Files:**
- Create: `src/api/__tests__/homeAssistant.test.ts`
- Create: `src/api/homeAssistant.ts`

- [ ] **Step 1: Write failing tests**

Create `src/api/__tests__/homeAssistant.test.ts`:

```typescript
import { createHAClient } from '../homeAssistant';

const config = { baseUrl: 'http://homeassistant.local:8123', token: 'test-token' };

global.fetch = jest.fn();

const mockFetch = (body: unknown, ok = true) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 401,
    json: async () => body,
  });
};

afterEach(() => jest.clearAllMocks());

describe('createHAClient.getState', () => {
  it('fetches state and parses to SensorState', async () => {
    mockFetch({
      entity_id: 'sensor.soil_moisture',
      state: '58.3',
      attributes: { unit_of_measurement: '%' },
      last_updated: '2024-01-15T10:30:00.000Z',
    });

    const client = createHAClient(config);
    const result = await client.getState('sensor.soil_moisture');

    expect(result.entityId).toBe('sensor.soil_moisture');
    expect(result.value).toBeCloseTo(58.3);
    expect(result.unit).toBe('%');
    expect(result.lastUpdated).toBeInstanceOf(Date);
  });

  it('sends Authorization header', async () => {
    mockFetch({ entity_id: 'x', state: '0', attributes: {}, last_updated: new Date().toISOString() });
    await createHAClient(config).getState('x');
    const call = (global.fetch as jest.Mock).mock.calls[0];
    expect(call[1].headers.Authorization).toBe('Bearer test-token');
  });

  it('throws on non-ok response', async () => {
    mockFetch({}, false);
    await expect(createHAClient(config).getState('x')).rejects.toThrow('HA API error: 401');
  });

  it('throws when state is non-numeric', async () => {
    mockFetch({ entity_id: 'x', state: 'unavailable', attributes: {}, last_updated: new Date().toISOString() });
    await expect(createHAClient(config).getState('x')).rejects.toThrow('Non-numeric state');
  });
});

describe('createHAClient.getHistory', () => {
  it('returns array of HistoryPoints filtered to numeric values', async () => {
    mockFetch([[
      { state: '60', last_updated: '2024-01-15T08:00:00.000Z' },
      { state: 'unavailable', last_updated: '2024-01-15T09:00:00.000Z' },
      { state: '55', last_updated: '2024-01-15T10:00:00.000Z' },
    ]]);

    const client = createHAClient(config);
    const result = await client.getHistory('sensor.soil_moisture', 24);

    expect(result).toHaveLength(2);
    expect(result[0].value).toBe(60);
    expect(result[1].value).toBe(55);
    expect(result[0].timestamp).toBeInstanceOf(Date);
  });

  it('returns empty array when history is empty', async () => {
    mockFetch([[]]);
    const result = await createHAClient(config).getHistory('sensor.soil_moisture', 24);
    expect(result).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests — expect failure**

```bash
cd /Users/arjun/FAN && npm test -- src/api/__tests__/homeAssistant.test.ts --no-coverage
```

Expected: FAIL — `Cannot find module '../homeAssistant'`

- [ ] **Step 3: Implement src/api/homeAssistant.ts**

```typescript
import { HistoryPoint, SensorState } from './types';

export interface HAClientConfig {
  baseUrl: string;
  token: string;
}

interface HAStateResponse {
  entity_id: string;
  state: string;
  attributes: { unit_of_measurement?: string };
  last_updated: string;
}

interface HAHistoryEntry {
  state: string;
  last_updated: string;
}

export function createHAClient(config: HAClientConfig) {
  const headers = {
    Authorization: `Bearer ${config.token}`,
    'Content-Type': 'application/json',
  };

  async function getState(entityId: string): Promise<SensorState> {
    const res = await fetch(`${config.baseUrl}/api/states/${entityId}`, { headers });
    if (!res.ok) throw new Error(`HA API error: ${res.status}`);
    const data: HAStateResponse = await res.json();
    const value = parseFloat(data.state);
    if (isNaN(value)) throw new Error(`Non-numeric state: ${data.state}`);
    return {
      entityId: data.entity_id,
      value,
      unit: data.attributes.unit_of_measurement ?? '',
      lastUpdated: new Date(data.last_updated),
    };
  }

  async function getHistory(entityId: string, hoursBack: number): Promise<HistoryPoint[]> {
    const start = new Date(Date.now() - hoursBack * 3_600_000).toISOString();
    const url = `${config.baseUrl}/api/history/period/${start}?filter_entity_id=${entityId}&minimal_response=true`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HA history error: ${res.status}`);
    const data: HAHistoryEntry[][] = await res.json();
    const entries = data[0] ?? [];
    return entries
      .map((e) => ({ timestamp: new Date(e.last_updated), value: parseFloat(e.state) }))
      .filter((p) => !isNaN(p.value));
  }

  async function callService(
    domain: string,
    service: string,
    serviceData: Record<string, unknown>
  ): Promise<void> {
    const res = await fetch(`${config.baseUrl}/api/services/${domain}/${service}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error(`HA service error: ${res.status}`);
  }

  return { getState, getHistory, callService };
}

export type HAClient = ReturnType<typeof createHAClient>;
```

- [ ] **Step 4: Run tests — expect pass**

```bash
cd /Users/arjun/FAN && npm test -- src/api/__tests__/homeAssistant.test.ts --no-coverage
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/api/ && git commit -m "feat: add Home Assistant API client with tests"
```

---

## Task 6: Settings hook

**Files:**
- Create: `src/hooks/useSettings.ts`

- [ ] **Step 1: Add mocks for storage modules**

Create `__mocks__/@react-native-async-storage/async-storage.js`:

```js
const store = {};
module.exports = {
  getItem: jest.fn(async (key) => store[key] ?? null),
  setItem: jest.fn(async (key, val) => { store[key] = val; }),
  removeItem: jest.fn(async (key) => { delete store[key]; }),
};
```

Create `__mocks__/expo-secure-store.js`:

```js
const store = {};
module.exports = {
  getItemAsync: jest.fn(async (key) => store[key] ?? null),
  setItemAsync: jest.fn(async (key, val) => { store[key] = val; }),
  deleteItemAsync: jest.fn(async (key) => { delete store[key]; }),
};
```

- [ ] **Step 2: Implement src/hooks/useSettings.ts**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { AppSettings } from '../api/types';

const SETTINGS_KEY = 'plant_app_settings';
const TOKEN_KEY = 'ha_token';

export const DEFAULT_SETTINGS: AppSettings = {
  haUrl: '',
  haToken: '',
  moistureEntityId: '',
  temperatureEntityId: '',
  lightEntityId: '',
  optimalMoistureMin: 40,
  optimalMoistureMax: 80,
  optimalTempMin: 60,
  optimalTempMax: 80,
  notificationThreshold: 25,
};

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [stored, token] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEY),
          SecureStore.getItemAsync(TOKEN_KEY),
        ]);
        const parsed: Partial<AppSettings> = stored ? JSON.parse(stored) : {};
        setSettingsState({ ...DEFAULT_SETTINGS, ...parsed, haToken: token ?? '' });
      } catch {
        // fall through to defaults
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const saveSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      const next = { ...settings, ...updates };
      const { haToken, ...rest } = next;
      await Promise.all([
        AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(rest)),
        haToken ? SecureStore.setItemAsync(TOKEN_KEY, haToken) : Promise.resolve(),
      ]);
      setSettingsState(next);
    },
    [settings]
  );

  return { settings, saveSettings, loaded };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSettings.ts __mocks__/ && git commit -m "feat: add settings hook with secure token storage"
```

---

## Task 7: Sensor data and history hooks

**Files:**
- Create: `src/hooks/useSensorData.ts`
- Create: `src/hooks/useHistory.ts`

- [ ] **Step 1: Implement src/hooks/useSensorData.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { createHAClient } from '../api/homeAssistant';
import { AppSettings, SensorState } from '../api/types';

interface SensorData {
  moisture: SensorState | null;
  temperature: SensorState | null;
}

export function useSensorData(settings: AppSettings) {
  const enabled = Boolean(settings.haUrl && settings.haToken && settings.moistureEntityId);

  return useQuery<SensorData, Error>({
    queryKey: ['sensorData', settings.haUrl, settings.moistureEntityId, settings.temperatureEntityId],
    queryFn: async () => {
      const client = createHAClient({ baseUrl: settings.haUrl, token: settings.haToken });
      const [moisture, temperature] = await Promise.all([
        settings.moistureEntityId ? client.getState(settings.moistureEntityId) : Promise.resolve(null),
        settings.temperatureEntityId
          ? client.getState(settings.temperatureEntityId)
          : Promise.resolve(null),
      ]);
      return { moisture, temperature };
    },
    enabled,
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}
```

- [ ] **Step 2: Implement src/hooks/useHistory.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { createHAClient } from '../api/homeAssistant';
import { AppSettings, HistoryPoint } from '../api/types';

export function useHistory(settings: AppSettings, entityId: string, hoursBack: number) {
  const enabled = Boolean(settings.haUrl && settings.haToken && entityId);

  return useQuery<HistoryPoint[], Error>({
    queryKey: ['history', settings.haUrl, entityId, hoursBack],
    queryFn: () => {
      const client = createHAClient({ baseUrl: settings.haUrl, token: settings.haToken });
      return client.getHistory(entityId, hoursBack);
    },
    enabled,
    staleTime: 5 * 60_000,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSensorData.ts src/hooks/useHistory.ts && git commit -m "feat: add sensor data and history hooks"
```

---

## Task 8: Notifications hook

**Files:**
- Create: `src/hooks/useNotifications.ts`

- [ ] **Step 1: Add expo-notifications mock**

Create `__mocks__/expo-notifications.js`:

```js
module.exports = {
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(async () => ({ data: 'ExponentPushToken[test]' })),
  setNotificationHandler: jest.fn(),
  AndroidImportance: { MAX: 5 },
  setNotificationChannelAsync: jest.fn(),
};
```

- [ ] **Step 2: Implement src/hooks/useNotifications.ts**

```typescript
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    async function register() {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('plant-alerts', {
          name: 'Plant Alerts',
          importance: Notifications.AndroidImportance.MAX,
          sound: 'default',
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      if (status !== 'granted') return;

      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
    }
    register();
  }, []);

  return { expoPushToken, permissionGranted };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useNotifications.ts __mocks__/expo-notifications.js && git commit -m "feat: add notifications hook for Expo push token registration"
```

---

## Task 9: StatusBadge component

**Files:**
- Create: `src/components/StatusBadge.tsx`

- [ ] **Step 1: Implement src/components/StatusBadge.tsx**

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PlantStatus } from '../api/types';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { statusToColor, statusToLabel } from '../utils/plantHealth';

interface Props {
  status: PlantStatus;
}

export function StatusBadge({ status }: Props) {
  const color = statusToColor(status);
  const label = statusToLabel(status);
  return (
    <View style={[styles.badge, { borderColor: color + '44', backgroundColor: color + '22' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatusBadge.tsx && git commit -m "feat: add StatusBadge component"
```

---

## Task 10: SensorCard component

**Files:**
- Create: `src/components/SensorCard.tsx`

- [ ] **Step 1: Implement src/components/SensorCard.tsx**

```tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../constants/theme';

interface Props {
  label: string;
  value: string;
  subtitle: string;
  accentColor: string;
}

export function SensorCard({ label, value, subtitle, accentColor }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textFaint,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SensorCard.tsx && git commit -m "feat: add SensorCard component"
```

---

## Task 11: HealthRing component

**Files:**
- Create: `src/components/HealthRing.tsx`

- [ ] **Step 1: Implement src/components/HealthRing.tsx**

```tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PlantStatus } from '../api/types';
import { colors, fontSize } from '../constants/theme';
import { statusToColor } from '../utils/plantHealth';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  score: number;
  status: PlantStatus;
  size?: number;
}

export function HealthRing({ score, status, size = 180 }: Props) {
  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const color = statusToColor(status);

  const animatedScore = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const strokeDashoffset = animatedScore.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={styles.label}>Health</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  score: {
    fontSize: fontSize.hero,
    fontWeight: '800',
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HealthRing.tsx && git commit -m "feat: add animated HealthRing SVG component"
```

---

## Task 12: SparkLine component

**Files:**
- Create: `src/components/SparkLine.tsx`

- [ ] **Step 1: Implement src/components/SparkLine.tsx**

```tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import { HistoryPoint } from '../api/types';

interface Props {
  data: HistoryPoint[];
  color: string;
  height?: number;
}

const W = 300;

export function SparkLine({ data, color, height = 44 }: Props) {
  if (data.length < 2) return <View style={{ height }} />;

  const values = data.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const pts = data.map((p, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = height - ((p.value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const fillPts = [...pts, `${W},${height}`, `0,${height}`].join(' ');

  return (
    <View style={{ height }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
        <Polygon points={fillPts} fill={color + '33'} />
        <Polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" />
      </Svg>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SparkLine.tsx && git commit -m "feat: add SparkLine SVG component"
```

---

## Task 13: SettingsScreen

**Files:**
- Create: `src/screens/SettingsScreen.tsx`

- [ ] **Step 1: Implement src/screens/SettingsScreen.tsx**

```tsx
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppSettings } from '../api/types';
import { colors, fontSize, radius, spacing } from '../constants/theme';

interface Props {
  settings: AppSettings;
  onSave: (updates: Partial<AppSettings>) => Promise<void>;
  expoPushToken: string | null;
}

export function SettingsScreen({ settings, onSave, expoPushToken }: Props) {
  const [form, setForm] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof AppSettings, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    await onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.section}>Home Assistant</Text>

        <Field label="HA URL">
          <TextInput
            style={styles.input}
            value={form.haUrl}
            onChangeText={(v) => update('haUrl', v)}
            placeholder="http://homeassistant.local:8123"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>

        <Field label="Long-Lived Access Token">
          <TextInput
            style={styles.input}
            value={form.haToken}
            onChangeText={(v) => update('haToken', v)}
            placeholder="eyJ0eXAiOiJKV1Q..."
            placeholderTextColor={colors.textFaint}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>

        <Text style={styles.section}>Entity IDs</Text>

        <Field label="Moisture Entity">
          <TextInput
            style={styles.input}
            value={form.moistureEntityId}
            onChangeText={(v) => update('moistureEntityId', v)}
            placeholder="sensor.soil_moisture"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>

        <Field label="Temperature Entity">
          <TextInput
            style={styles.input}
            value={form.temperatureEntityId}
            onChangeText={(v) => update('temperatureEntityId', v)}
            placeholder="sensor.soil_temperature"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>

        <Text style={styles.section}>Optimal Ranges</Text>

        <View style={styles.row}>
          <Field label="Moisture Min %" style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={String(form.optimalMoistureMin)}
              onChangeText={(v) => update('optimalMoistureMin', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
          </Field>
          <View style={{ width: spacing.sm }} />
          <Field label="Moisture Max %" style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={String(form.optimalMoistureMax)}
              onChangeText={(v) => update('optimalMoistureMax', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
          </Field>
        </View>

        <View style={styles.row}>
          <Field label="Temp Min °F" style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={String(form.optimalTempMin)}
              onChangeText={(v) => update('optimalTempMin', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
          </Field>
          <View style={{ width: spacing.sm }} />
          <Field label="Temp Max °F" style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={String(form.optimalTempMax)}
              onChangeText={(v) => update('optimalTempMax', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
          </Field>
        </View>

        <Field label="Alert Threshold — Water Now at % moisture">
          <TextInput
            style={styles.input}
            value={String(form.notificationThreshold)}
            onChangeText={(v) => update('notificationThreshold', parseFloat(v) || 0)}
            keyboardType="numeric"
          />
        </Field>

        <Text style={styles.section}>Notifications</Text>

        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>Expo Push Token</Text>
          <Text style={styles.tokenValue} selectable>
            {expoPushToken ?? 'Requesting permission…'}
          </Text>
          {expoPushToken && (
            <Text style={styles.tokenHint}>
              Store this in a Home Assistant input_text helper and use it in an automation
              to call the Expo push API when moisture falls below your threshold.
            </Text>
          )}
        </View>

        <Text style={[styles.section, { opacity: 0.4 }]}>Irrigation — Coming Soon</Text>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{saved ? 'Saved ✓' : 'Save Settings'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      <Text style={fieldStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  label: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  section: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
  },
  tokenBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  tokenLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  tokenValue: {
    fontSize: fontSize.sm,
    color: colors.moisture,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tokenHint: {
    fontSize: fontSize.xs,
    color: colors.textFaint,
    marginTop: spacing.sm,
    lineHeight: 16,
  },
  saveBtn: {
    backgroundColor: colors.good,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  saveBtnText: {
    color: '#0D1117',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SettingsScreen.tsx && git commit -m "feat: add SettingsScreen"
```

---

## Task 14: DashboardScreen

**Files:**
- Create: `src/screens/DashboardScreen.tsx`

- [ ] **Step 1: Implement src/screens/DashboardScreen.tsx**

```tsx
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppSettings } from '../api/types';
import { HealthRing } from '../components/HealthRing';
import { SensorCard } from '../components/SensorCard';
import { SparkLine } from '../components/SparkLine';
import { StatusBadge } from '../components/StatusBadge';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { useHistory } from '../hooks/useHistory';
import { useSensorData } from '../hooks/useSensorData';
import { getPlantHealth, calculateWateringPrediction } from '../utils/plantHealth';
import { formatDryingRate, formatLastUpdated, formatMoisture, formatTemp, formatWateringPrediction } from '../utils/formatting';

interface Props {
  settings: AppSettings;
}

export function DashboardScreen({ settings }: Props) {
  const { data: sensorData, isLoading, error, refetch, isRefetching } = useSensorData(settings);
  const { data: moistureHistory = [] } = useHistory(settings, settings.moistureEntityId, 24);

  const isConfigured = Boolean(settings.haUrl && settings.haToken && settings.moistureEntityId);

  if (!isConfigured) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🌱</Text>
        <Text style={styles.emptyTitle}>Connect your sensor</Text>
        <Text style={styles.emptySubtitle}>Go to Settings to enter your Home Assistant details.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.good} size="large" />
        <Text style={[styles.emptySubtitle, { marginTop: spacing.md }]}>Connecting to Home Assistant…</Text>
      </View>
    );
  }

  if (error || !sensorData) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.emptyTitle}>Connection error</Text>
        <Text style={styles.emptySubtitle}>{error?.message ?? 'Could not reach Home Assistant.'}</Text>
      </View>
    );
  }

  const moisture = sensorData.moisture?.value ?? 0;
  const temp = sensorData.temperature?.value ?? 70;
  const health = getPlantHealth(moisture, temp, settings);
  const prediction = calculateWateringPrediction(moistureHistory, settings.notificationThreshold);
  const lastUpdated = sensorData.moisture?.lastUpdated ?? new Date();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.good} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Plant</Text>
        <Text style={styles.subtitle}>Updated {formatLastUpdated(lastUpdated)}</Text>
      </View>

      {/* Health ring */}
      <View style={styles.ringContainer}>
        <HealthRing score={health.score} status={health.status} size={200} />
        <View style={styles.badgeRow}>
          <StatusBadge status={health.status} />
        </View>
        <Text style={styles.prediction}>{formatWateringPrediction(prediction.hoursUntilDry)}</Text>
      </View>

      {/* Sensor cards */}
      <View style={styles.cardRow}>
        <SensorCard
          label="Moisture"
          value={formatMoisture(moisture)}
          subtitle={formatDryingRate(prediction.dryingRatePerHour)}
          accentColor={colors.moisture}
        />
        <View style={{ width: spacing.sm }} />
        {sensorData.temperature ? (
          <SensorCard
            label="Soil Temp"
            value={formatTemp(temp)}
            subtitle="Soil temperature"
            accentColor={colors.temp}
          />
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>

      {/* Sparkline */}
      {moistureHistory.length > 1 && (
        <View style={styles.sparkCard}>
          <Text style={styles.sparkLabel}>Moisture — Last 24h</Text>
          <SparkLine data={moistureHistory} color={colors.moisture} height={52} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    color: colors.text,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textFaint,
    marginTop: 2,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  badgeRow: {
    marginTop: spacing.md,
  },
  prediction: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  sparkCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sparkLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/DashboardScreen.tsx && git commit -m "feat: add DashboardScreen"
```

---

## Task 15: ChartsScreen

**Files:**
- Create: `src/screens/ChartsScreen.tsx`

- [ ] **Step 1: Implement src/screens/ChartsScreen.tsx**

```tsx
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AppSettings, HistoryPoint } from '../api/types';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { useHistory } from '../hooks/useHistory';
import { formatMoisture, formatTemp } from '../utils/formatting';

const RANGE_OPTIONS = [
  { label: '6h', hours: 6 },
  { label: '24h', hours: 24 },
  { label: '7d', hours: 168 },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  settings: AppSettings;
}

function toChartData(history: HistoryPoint[]) {
  const n = history.length;
  const showAt = new Set([0, Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4), n - 1]);
  const labels = history.map((p, i) => {
    if (!showAt.has(i)) return '';
    const h = p.timestamp.getHours();
    return `${h}h`;
  });
  return {
    labels,
    datasets: [{ data: history.map((p) => p.value) }],
  };
}

function OptimalBand({ min, max, data, color }: { min: number; max: number; data: HistoryPoint[]; color: string }) {
  if (data.length === 0) return null;
  return (
    <View style={[styles.band, { backgroundColor: color + '18' }]}>
      <Text style={[styles.bandLabel, { color }]}>
        Optimal: {min}–{max}
      </Text>
    </View>
  );
}

export function ChartsScreen({ settings }: Props) {
  const [hoursBack, setHoursBack] = useState(24);

  const { data: moistureHistory = [], isLoading: mLoading } = useHistory(
    settings,
    settings.moistureEntityId,
    hoursBack
  );
  const { data: tempHistory = [], isLoading: tLoading } = useHistory(
    settings,
    settings.temperatureEntityId,
    hoursBack
  );

  const isConfigured = Boolean(settings.haUrl && settings.haToken && settings.moistureEntityId);

  if (!isConfigured) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Configure your sensor in Settings to see charts.</Text>
      </View>
    );
  }

  const chartWidth = SCREEN_WIDTH - spacing.lg * 2;
  const moistureChartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: () => colors.moisture,
    labelColor: () => colors.textFaint,
    strokeWidth: 2,
    propsForDots: { r: '0' },
    decimalPlaces: 0,
  };
  const tempChartConfig = { ...moistureChartConfig, color: () => colors.temp };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Range selector */}
      <View style={styles.rangeRow}>
        {RANGE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.hours}
            style={[styles.rangeBtn, hoursBack === opt.hours && styles.rangeBtnActive]}
            onPress={() => setHoursBack(opt.hours)}
          >
            <Text style={[styles.rangeBtnText, hoursBack === opt.hours && styles.rangeBtnTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Moisture chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Soil Moisture</Text>
        <OptimalBand
          min={settings.optimalMoistureMin}
          max={settings.optimalMoistureMax}
          data={moistureHistory}
          color={colors.moisture}
        />
        {moistureHistory.length > 1 ? (
          <LineChart
            data={toChartData(moistureHistory)}
            width={chartWidth}
            height={160}
            chartConfig={moistureChartConfig}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            formatYLabel={(v) => formatMoisture(parseFloat(v))}
            style={{ marginLeft: -spacing.md }}
          />
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>{mLoading ? 'Loading…' : 'No data yet'}</Text>
          </View>
        )}
      </View>

      {/* Temperature chart */}
      {settings.temperatureEntityId ? (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Soil Temperature</Text>
          <OptimalBand
            min={settings.optimalTempMin}
            max={settings.optimalTempMax}
            data={tempHistory}
            color={colors.temp}
          />
          {tempHistory.length > 1 ? (
            <LineChart
              data={toChartData(tempHistory)}
              width={chartWidth}
              height={160}
              chartConfig={tempChartConfig}
              bezier
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
              formatYLabel={(v) => formatTemp(parseFloat(v))}
              style={{ marginLeft: -spacing.md }}
            />
          ) : (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>{tLoading ? 'Loading…' : 'No data yet'}</Text>
            </View>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  rangeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rangeBtnActive: {
    backgroundColor: colors.good + '22',
    borderColor: colors.good,
  },
  rangeBtnText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '600',
  },
  rangeBtnTextActive: {
    color: colors.good,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  band: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  bandLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  noData: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.textFaint,
    fontSize: fontSize.sm,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/ChartsScreen.tsx && git commit -m "feat: add ChartsScreen with victory-native line charts"
```

---

## Task 16: Navigation wiring (App.tsx)

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Rewrite App.tsx with navigation and providers**

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/constants/theme';
import { useNotifications } from './src/hooks/useNotifications';
import { useSettings } from './src/hooks/useSettings';
import { ChartsScreen } from './src/screens/ChartsScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: '🌿',
    Charts: '📈',
    Settings: '⚙️',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{icons[name]}</Text>
  );
}

function AppInner() {
  const { settings, saveSettings, loaded } = useSettings();
  const { expoPushToken } = useNotifications();

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
          tabBarActiveTintColor: colors.good,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        })}
      >
        <Tab.Screen name="Dashboard">
          {() => <DashboardScreen settings={settings} />}
        </Tab.Screen>
        <Tab.Screen name="Charts">
          {() => <ChartsScreen settings={settings} />}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {() => (
            <SettingsScreen
              settings={settings}
              onSave={saveSettings}
              expoPushToken={expoPushToken}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppInner />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
```

- [ ] **Step 2: Run full test suite to verify nothing broke**

```bash
cd /Users/arjun/FAN && npm test -- --no-coverage --passWithNoTests
```

Expected: All previously passing tests still PASS.

- [ ] **Step 3: Commit**

```bash
git add App.tsx && git commit -m "feat: wire up navigation, providers, and root App"
```

---

## Task 17: Smoke test and final check

- [ ] **Step 1: Run full test suite**

```bash
cd /Users/arjun/FAN && npm test -- --no-coverage
```

Expected: All tests pass.

- [ ] **Step 2: Type-check the project**

```bash
cd /Users/arjun/FAN && npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Start the dev server**

```bash
cd /Users/arjun/FAN && npx expo start --no-dev
```

Expected: Expo dev server starts, QR code displayed. Open Expo Go on your phone to preview.

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A && git commit -m "chore: final smoke test and type check"
```

---

## Setup note: HA push notification automation

After the app is running on your phone, copy the Expo Push Token from the Settings screen.
In Home Assistant:

1. Create an `input_text.expo_push_token` helper and paste the token there.
2. Create an automation with trigger: `numeric_state` on your moisture entity below `notificationThreshold`, action:

```yaml
action: rest_command.send_expo_notification
data:
  token: "{{ states('input_text.expo_push_token') }}"
  title: "🌱 Water your plant!"
  body: "Moisture is at {{ states('sensor.soil_moisture') }}%"
```

3. Add a `rest_command` to `configuration.yaml`:

```yaml
rest_command:
  send_expo_notification:
    url: "https://exp.host/--/api/v2/push/send"
    method: POST
    content_type: application/json
    payload: '{"to":"{{ token }}","title":"{{ title }}","body":"{{ body }}"}'
```
