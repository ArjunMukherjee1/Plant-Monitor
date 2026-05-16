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
