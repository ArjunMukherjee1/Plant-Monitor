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
