import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { plantAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import './CareSchedule.css';

export default function CareSchedule() {
  const [dueToday, setDueToday] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      plantAPI.getDueToday(),
      plantAPI.getOverdue(),
    ])
      .then(([dueRes, overdueRes]) => {
        setDueToday(dueRes.data);
        setOverdue(overdueRes.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleWater = async (plant) => {
    try {
      await plantAPI.water(plant.id);
      setSuccessMsg(`${plant.name} watered! 💧`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading care schedule..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">💧 Care Schedule</h1>
        <p className="page-subtitle">Plants that need your attention right now</p>
      </div>

      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      {/* Overdue Section */}
      <section className="schedule-section">
        <h2 className="schedule-section-title">🔴 Overdue ({overdue.length})</h2>
        {overdue.length === 0 ? (
          <EmptyState icon="✅" title="No overdue plants!" message="Great job keeping up with your plant care." />
        ) : (
          <div className="schedule-list">
            {overdue.map(plant => (
              <div key={plant.id} className="schedule-item schedule-item--overdue">
                <div className="schedule-item-info">
                  <Link to={`/plants/${plant.id}`} className="schedule-item-name">{plant.name}</Link>
                  <span className="schedule-item-meta">{plant.species} · {plant.location}</span>
                  <span className="schedule-item-date">
                    Last watered: {plant.lastWateredDate ? new Date(plant.lastWateredDate).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <button className="water-btn" onClick={() => handleWater(plant)}>💧 Water Now</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Due Today Section */}
      <section className="schedule-section">
        <h2 className="schedule-section-title">💧 Due Today ({dueToday.length})</h2>
        {dueToday.length === 0 ? (
          <EmptyState icon="🌿" title="No plants due today" message="All plants are watered for today." />
        ) : (
          <div className="schedule-list">
            {dueToday.map(plant => (
              <div key={plant.id} className="schedule-item schedule-item--due">
                <div className="schedule-item-info">
                  <Link to={`/plants/${plant.id}`} className="schedule-item-name">{plant.name}</Link>
                  <span className="schedule-item-meta">{plant.species} · {plant.location}</span>
                  <span className="schedule-item-date">
                    Due today · watering every {plant.wateringIntervalDays} day(s)
                  </span>
                </div>
                <button className="water-btn" onClick={() => handleWater(plant)}>💧 Water Now</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
