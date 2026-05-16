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
