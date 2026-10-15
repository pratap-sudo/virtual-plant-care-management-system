import { Link } from 'react-router-dom';
import './PlantCard.css';

const PLANT_EMOJIS = {
  'money plant': '🪴',
  'aloe vera': '🌵',
  'snake plant': '🌿',
  'spider plant': '🕷️',
  'peace lily': '🌸',
  'rose': '🌹',
  'sunflower': '🌻',
  'cactus': '🌵',
  'orchid': '🌺',
  'fern': '🌿',
};

function getPlantEmoji(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, emoji] of Object.entries(PLANT_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🌱';
}

function getWateringStatus(plant) {
  if (plant.overdueForWatering) return { label: 'Overdue!', cls: 'status--overdue' };
  if (plant.dueForWateringToday) return { label: 'Due Today', cls: 'status--due' };
  return { label: 'On Schedule', cls: 'status--ok' };
}

export default function PlantCard({ plant, onWater, onDelete }) {
  const emoji = getPlantEmoji(plant.name);
  const status = getWateringStatus(plant);

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm(`Delete "${plant.name}"? This cannot be undone.`)) {
      onDelete(plant.id);
    }
  };

  const handleWater = (e) => {
    e.preventDefault();
    onWater(plant.id);
  };

  return (
    <div className={`plant-card ${plant.overdueForWatering ? 'plant-card--overdue' : ''}`}>
      <Link to={`/plants/${plant.id}`} className="plant-card-link">
        <div className="plant-card-emoji">{emoji}</div>
        <div className="plant-card-info">
          <h3 className="plant-card-name">{plant.name}</h3>
          <p className="plant-card-species">{plant.species}</p>
          <p className="plant-card-location">📍 {plant.location}</p>
          <div className="plant-card-meta">
            <span className={`plant-card-status ${status.cls}`}>
              {status.label}
            </span>
            <span className="plant-card-type">
              {plant.plantType === 'INDOOR' ? '🏠 Indoor' : '🌳 Outdoor'}
            </span>
          </div>
          {plant.nextWateringDate && (
            <p className="plant-card-next-water">
              💧 Next: {new Date(plant.nextWateringDate).toLocaleDateString()}
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
