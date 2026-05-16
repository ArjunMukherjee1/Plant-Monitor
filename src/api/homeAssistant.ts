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
