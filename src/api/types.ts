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
  plantTypeId: string;       // plant id from database, '' if none
  plantingDate: string;      // ISO date string, '' if not set
  currentStageIndex: number; // index into plant.growthStages
}
