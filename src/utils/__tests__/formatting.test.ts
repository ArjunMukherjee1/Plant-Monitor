import {
  formatMoisture,
  formatTemp,
  formatDryingRate,
  formatWateringPrediction,
  formatLastUpdated,
} from '../formatting';

describe('formatMoisture', () => {
  it('formats to one decimal place and appends %', () => {
    expect(formatMoisture(58.7)).toBe('58.7%');
    expect(formatMoisture(40)).toBe('40.0%');
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
