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
