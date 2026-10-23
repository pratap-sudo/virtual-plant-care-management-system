import { Link } from 'react-router-dom';
import './PlantCard.css';

const PLANT_EMOJIS = {
  'money plant': '🪴',
  'aloe vera': '🌵',
  'snake plant': '🌿',
  'spider plant': '🕷️',
  'peace lily': '🌸',
  'monstera': '🪴',
  'rose': '🌹',
  'sunflower': '🌻',
  'cactus': '🌵',
  'orchid': '🌺',
  'fern': '🌿',
};

const HEALTH_INFO = {
  THRIVING: { label: '🌟 Thriving', cls: 'health--thriving' },
  HEALTHY: { label: '💚 Healthy', cls: 'health--healthy' },
  NEEDS_ATTENTION: { label: '⚠️ Needs Care', cls: 'health--warning' },
  SICK: { label: '🥀 Unwell', cls: 'health--sick' },
  DORMANT: { label: '💤 Dormant', cls: 'health--dormant' },
};

function getPlantEmoji(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, emoji] of Object.entries(PLANT_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🌱';
}

function getWateringStatus(plant) {
  if (plant.overdueForWatering) return { label: 'Water Overdue!', cls: 'status--overdue' };
  if (plant.dueForWateringToday) return { label: 'Water Due Today', cls: 'status--due' };
  return { label: 'Water On Schedule', cls: 'status--ok' };
}

export default function PlantCard({ plant, onWater, onDelete }) {
  const emoji = getPlantEmoji(plant.name);
  const waterStatus = getWateringStatus(plant);
  const health = HEALTH_INFO[plant.healthStatus] || HEALTH_INFO.HEALTHY;

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(plant);
  };

  const handleWater = (e) => {
    e.preventDefault();
    onWater(plant.id);
  };

  return (
    <div className={`plant-card ${plant.overdueForWatering ? 'plant-card--overdue' : ''}`}>
      <Link to={`/plants/${plant.id}`} className="plant-card-link">
        <div className="plant-card-media">
          {plant.imageUrl ? (
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="plant-card-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="plant-card-emoji-fallback"
            style={{ display: plant.imageUrl ? 'none' : 'flex' }}
          >
            {emoji}
          </div>
        </div>

        <div className="plant-card-info">
          <div className="plant-card-top-row">
            <h3 className="plant-card-name">{plant.name}</h3>
            <span className={`plant-card-health ${health.cls}`}>{health.label}</span>
          </div>

          <p className="plant-card-species">{plant.species}</p>
          <p className="plant-card-location">📍 {plant.location}</p>

          <div className="plant-card-meta">
            <span className={`plant-card-status ${waterStatus.cls}`}>
              {waterStatus.label}
            </span>
            <span className="plant-card-type">
              {plant.plantType === 'INDOOR' ? '🏠 Indoor' : '🌳 Outdoor'}
            </span>
            {plant.dueForFertilizingToday || plant.overdueForFertilizing ? (
              <span className="plant-card-pill pill--fertilize">🌿 Fert Due</span>
            ) : null}
            {plant.dueForRepotting ? (
              <span className="plant-card-pill pill--repot">🪴 Repot Due</span>
            ) : null}
          </div>

          {plant.nextWateringDate && (
            <p className="plant-card-next-water">
              💧 Next water: {new Date(plant.nextWateringDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </Link>

      <div className="plant-card-actions">
        <button className="btn btn-water" onClick={handleWater} title="Record Watering">
          💧 Water
        </button>
        <Link to={`/plants/${plant.id}/edit`} className="btn btn-edit">
          ✏️ Edit
        </Link>
        <button className="btn btn-delete" onClick={handleDelete} title="Delete Plant">
          🗑️
        </button>
      </div>
    </div>
  );
}
