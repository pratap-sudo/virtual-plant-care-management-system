// Weather service for plant care insights using Open-Meteo (free, no API key required)

export const CITIES = [
  { name: 'New York, USA', lat: 40.7128, lon: -74.006 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'San Francisco, USA', lat: 37.7749, lon: -122.4194 },
  { name: 'Seattle, USA', lat: 47.6062, lon: -122.3321 },
  { name: 'Chicago, USA', lat: 41.8781, lon: -87.6298 },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Mumbai, India', lat: 19.076, lon: 72.8777 },
  { name: 'Berlin, Germany', lat: 52.52, lon: 13.405 },
];

export async function fetchWeather(lat = 40.7128, lon = -74.006) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather service error (${res.status})`);
  }
  const data = await res.json();

  const current = data.current || {};
  const daily = data.daily || {};

  const temp = Math.round(current.temperature_2m ?? 20);
  const humidity = Math.round(current.relative_humidity_2m ?? 50);
  const precipitation = current.precipitation ?? 0;
  const weatherCode = current.weather_code ?? 0;
  const maxTemp = Math.round(daily.temperature_2m_max?.[0] ?? temp);
  const minTemp = Math.round(daily.temperature_2m_min?.[0] ?? temp);
  const dailyPrecip = daily.precipitation_sum?.[0] ?? 0;

  return {
    temp,
    humidity,
    precipitation,
    dailyPrecip,
    maxTemp,
    minTemp,
    condition: getWeatherCondition(weatherCode),
  };
}

function getWeatherCondition(code) {
  if (code === 0) return { label: 'Clear Sky', icon: '☀️' };
  if (code <= 3) return { label: 'Partly Cloudy', icon: '⛅' };
  if (code <= 48) return { label: 'Foggy', icon: '🌫️' };
  if (code <= 67 || (code >= 80 && code <= 82)) return { label: 'Rainy', icon: '🌧️' };
  if (code <= 77 || (code >= 85 && code <= 86)) return { label: 'Snowy', icon: '❄️' };
  if (code >= 95) return { label: 'Thunderstorm', icon: '⛈️' };
  return { label: 'Mild', icon: '🌤️' };
}

export function generatePlantAdvisories(weather, outdoorPlants = []) {
  if (!weather) return [];
  const advisories = [];

  // Frost alert check for outdoor plants
  if (weather.minTemp <= 2) {
    const vulnerablePlants = outdoorPlants.filter(p => p.isFrostTolerant === false);
    if (vulnerablePlants.length > 0) {
      const names = vulnerablePlants.map(p => p.name).join(', ');
      advisories.push({
        type: 'warning',
        icon: '❄️',
        title: `Frost Warning (${weather.minTemp}°C)`,
        message: `${names} cannot tolerate frost! Move them indoors or provide frost fleece protection tonight.`,
      });
    } else {
      advisories.push({
        type: 'info',
        icon: '❄️',
        title: `Cold Night Ahead (${weather.minTemp}°C)`,
        message: 'Freezing or near-freezing temperatures expected. Check all delicate outdoor greenery.',
      });
    }
  }

  // Rain delay advisory
  if (weather.precipitation > 2 || weather.dailyPrecip > 3) {
    advisories.push({
      type: 'success',
      icon: '🌧️',
      title: 'Rain Expected / Detected',
      message: `Natural rainfall (~${Math.round(weather.dailyPrecip || weather.precipitation)}mm) detected. You can safely delay manual watering for outdoor plants.`,
    });
  }

  // Heatwave check
  if (weather.maxTemp >= 32) {
    advisories.push({
      type: 'warning',
      icon: '☀️',
      title: `High Heat Advisory (${weather.maxTemp}°C)`,
      message: 'High evaporation rates today. Deeply water your potted plants in early morning or late evening.',
    });
  }

  return advisories;
}

