import { useState, useEffect } from 'react';
import { CITIES, fetchWeather, generatePlantAdvisories } from '../services/weather';
import './WeatherWidget.css';

export default function WeatherWidget({ outdoorPlants = [] }) {
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const city = CITIES[selectedCityIndex];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchWeather(city.lat, city.lon)
      .then(data => {
        if (isMounted) setWeather(data);
      })
      .catch(err => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedCityIndex, city.lat, city.lon]);

  const advisories = weather ? generatePlantAdvisories(weather, outdoorPlants) : [];

  return (
    <div className="weather-widget-card">
      <div className="weather-header">
        <div className="weather-header-left">
          <span className="weather-widget-badge">🌦️ Local Weather & Care Advisory</span>
          <h3 className="weather-city-title">Outdoor Care Weather Context</h3>
        </div>
        <div className="weather-city-selector">
          <label htmlFor="city-select" className="sr-only">Choose Location</label>
          <select
            id="city-select"
            value={selectedCityIndex}
            onChange={e => setSelectedCityIndex(Number(e.target.value))}
            className="weather-select"
          >
            {CITIES.map((c, idx) => (
              <option key={c.name} value={idx}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="weather-loading">Checking weather forecast...</div>
      ) : error ? (
        <div className="weather-error">
          <span>⚠️ Weather preview offline ({error}). Using default schedule rules.</span>
        </div>
      ) : weather && (
        <div className="weather-content">
          <div className="weather-stats-bar">
            <div className="weather-stat-primary">
              <span className="weather-icon">{weather.condition.icon}</span>
              <div>
                <span className="weather-temp">{weather.temp}°C</span>
                <span className="weather-desc">{weather.condition.label} (High {weather.maxTemp}° / Low {weather.minTemp}°)</span>
              </div>
            </div>
            <div className="weather-stat-pills">
              <span className="weather-pill">💧 {weather.humidity}% Humidity</span>
              <span className="weather-pill">🌧️ {weather.precipitation}mm Rain</span>
            </div>
          </div>

          {/* Plant Advisories */}
          {advisories.length > 0 && (
            <div className="weather-advisories">
              {advisories.map((adv, i) => (
                <div key={i} className={`advisory-item advisory--${adv.type}`}>
                  <span className="advisory-icon">{adv.icon}</span>
                  <div className="advisory-body">
                    <strong>{adv.title}</strong>
                    <p>{adv.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

