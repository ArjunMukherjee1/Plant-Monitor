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

  it('returns a low score when moisture is far outside optimal range', () => {
    expect(calculateHealthScore(0, 70, defaultSettings)).toBe(40);
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
