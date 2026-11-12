// Adapt Open-Meteo's public data to the format used by the weather components.
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('Weather service is temporarily unavailable.');
    const data = await response.json();
    if (data.error) throw new Error('Weather service could not complete the request.');
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function weatherCondition(code, isDay) {
  let description = 'overcast clouds';
  let icon = '04';
  if (code === 0) [description, icon] = ['clear sky', '01'];
  else if (code === 1) [description, icon] = ['few clouds', '02'];
  else if (code === 2) [description, icon] = ['scattered clouds', '03'];
  else if ([45, 48].includes(code)) [description, icon] = ['fog', '50'];
  else if (code >= 51 && code <= 57) [description, icon] = ['drizzle', '09'];
  else if (code >= 61 && code <= 67) [description, icon] = ['rain', '10'];
  else if ((code >= 71 && code <= 77) || [85, 86].includes(code)) [description, icon] = ['snow', '13'];
  else if (code >= 80 && code <= 82) [description, icon] = ['shower rain', '09'];
  else if (code >= 95) [description, icon] = ['thunderstorm', '11'];
  return [{ description, icon: `${icon}${isDay ? 'd' : 'n'}` }];
}

export async function fetchWeatherData(lat, lon) {
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) {
    throw new Error('Please select a valid city.');
  }
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,cloud_cover,wind_speed_10m',
    hourly: 'temperature_2m,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m,is_day',
    wind_speed_unit: 'ms',
    timezone: 'GMT',
    forecast_days: '6',
  });
  const { current, hourly } = await fetchJson(`${WEATHER_API_URL}?${params}`);
  if (!current || !hourly?.time?.length) {
    throw new Error('No weather data is available for this city.');
  }
  const weather = {
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
    },
    wind: { speed: current.wind_speed_10m },
    clouds: { all: current.cloud_cover },
    weather: weatherCondition(current.weather_code, current.is_day),
  };
  const forecast = {
    list: hourly.time.map((time, index) => ({
      dt: Date.parse(`${time}Z`) / 1000,
      dt_txt: time.replace('T', ' ') + ':00',
      main: { temp: hourly.temperature_2m[index], humidity: hourly.relative_humidity_2m[index] },
      wind: { speed: hourly.wind_speed_10m[index] },
      clouds: { all: hourly.cloud_cover[index] },
      weather: weatherCondition(hourly.weather_code[index], hourly.is_day[index]),
    })),
  };
  return [weather, forecast];
}

export async function fetchCities(input) {
  const name = input.trim();
  if (name.length < 2) return { data: [] };
  const params = new URLSearchParams({ name, count: '10', language: 'en', format: 'json' });
  const result = await fetchJson(`${GEO_API_URL}?${params}`);
  return {
    data: (result.results || []).map((city) => ({
      ...city,
      countryCode: city.country_code,
    })),
  };
}
