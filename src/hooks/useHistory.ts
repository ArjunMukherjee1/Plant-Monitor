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
