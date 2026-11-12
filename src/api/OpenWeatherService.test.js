import { fetchCities, fetchWeatherData } from './OpenWeatherService';
import { ALL_DESCRIPTIONS } from '../utilities/DateConstants';
import { getWeekForecastWeather } from '../utilities/DataUtils';

const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });

function respond(data, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({ ok, json: async () => data });
}

test('city searches encode names and preserve coordinates and country', async () => {
  respond({ results: [{ name: 'São Paulo', latitude: -23.55, longitude: -46.63, country_code: 'BR' }] });
  const result = await fetchCities(' São Paulo ');
  expect(new URL(global.fetch.mock.calls[0][0]).searchParams.get('name')).toBe('São Paulo');
  expect(result.data[0]).toMatchObject({ latitude: -23.55, longitude: -46.63, countryCode: 'BR' });
});

test('short and unmatched searches return empty results', async () => {
  respond({});
  expect(await fetchCities('a')).toEqual({ data: [] });
  expect(global.fetch).not.toHaveBeenCalled();
  expect(await fetchCities('nonexistentcity')).toEqual({ data: [] });
});

test('HTTP failures reject instead of passing invalid data to the UI', async () => {
  respond({}, false);
  await expect(fetchCities('London')).rejects.toThrow('temporarily unavailable');
  await expect(fetchWeatherData(51.5, -0.12)).rejects.toThrow('temporarily unavailable');
});

test('weather data works with existing components and weekly aggregation', async () => {
  const codes = [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];
  respond({
    current: { temperature_2m: 18, apparent_temperature: 17, relative_humidity_2m: 60, wind_speed_10m: 3, cloud_cover: 25, weather_code: 0, is_day: 1 },
    hourly: {
      time: codes.map((_, i) => `2026-11-${String(12 + Math.floor(i / 24)).padStart(2, '0')}T${String(i % 24).padStart(2, '0')}:00`),
      temperature_2m: codes.map(() => 18), relative_humidity_2m: codes.map(() => 60),
      wind_speed_10m: codes.map(() => 3), cloud_cover: codes.map(() => 25),
      weather_code: codes, is_day: codes.map(() => 1),
    },
  });
  const [weather, forecast] = await fetchWeatherData(51.5, -0.12);
  expect(weather.main).toEqual({ temp: 18, feels_like: 17, humidity: 60 });
  expect(weather.wind.speed).toBe(3);
  expect(forecast.list[0].dt).toBe(Date.parse('2026-11-12T00:00:00Z') / 1000);
  forecast.list.forEach(item => expect(ALL_DESCRIPTIONS.some(value => value.description === item.weather[0].description)).toBe(true));
  expect(getWeekForecastWeather(forecast, ALL_DESCRIPTIONS)).toHaveLength(2);
  const params = new URL(global.fetch.mock.calls[0][0]).searchParams;
  expect(params.get('wind_speed_unit')).toBe('ms');
  expect(params.get('forecast_days')).toBe('6');
});

test('missing weather data rejects with a recoverable error', async () => {
  respond({});
  await expect(fetchWeatherData(51.5, -0.12)).rejects.toThrow('No weather data');
});
