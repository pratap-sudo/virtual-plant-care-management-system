import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, plantAPI } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import WeatherWidget from '../components/WeatherWidget';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [outdoorPlants, setOutdoorPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      dashboardAPI.getStats(),
      plantAPI.getAll({ type: 'OUTDOOR' }).catch(() => ({ data: [] })),
    ])
      .then(([statsRes, outdoorRes]) => {
        setStats(statsRes.data);
        setOutdoorPlants(outdoorRes.data || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🏠 Garden Dashboard</h1>
          <p className="page-subtitle">Your plant health, schedule, and environment overview</p>
        </div>
      </div>

      {error && (
        <Alert type="error" message={`Cannot connect to backend: ${error}. Make sure Spring Boot is running on port 8080.`} />
      )}

      {/* Local Weather & Plant Care Advisory */}
      <WeatherWidget outdoorPlants={outdoorPlants} />

      {stats ? (
        <>
          {/* Stat Cards Grid */}
          <div className="stats-grid">
            <StatCard icon="🌿" label="Total Plants" value={stats.totalPlants} color="green" />
            <StatCard icon="🏠" label="Indoor Plants" value={stats.indoorPlants} color="blue" />
            <StatCard icon="🌳" label="Outdoor Plants" value={stats.outdoorPlants} color="green" />
            <StatCard icon="💧" label="Watering Due" value={stats.plantsNeedingWateringToday} color="blue" sub="today" />
            <StatCard icon="⚠️" label="Overdue Watering" value={stats.overdueWateringCount} color="red" />
            <StatCard icon="🌿" label="Fertilizer Due" value={stats.plantsNeedingFertilizingCount || 0} color="green" />
            <StatCard icon="🪴" label="Repotting Due" value={stats.plantsNeedingRepottingCount || 0} color="blue" />
          </div>

          {/* Plant Health Status Breakdown */}
          {stats.totalPlants > 0 && (
            <div className="health-overview-card">
              <h3 className="health-overview-title">💚 Collection Health Breakdown</h3>
              <div className="health-badges-row">
                <span className="health-badge-pill pill--thriving">
                  🌟 Thriving: <strong>{stats.thrivingCount || 0}</strong>
                </span>
                <span className="health-badge-pill pill--healthy">
                  💚 Healthy: <strong>{stats.healthyCount || 0}</strong>
                </span>
                <span className="health-badge-pill pill--warning">
                  ⚠️ Needs Care: <strong>{stats.needsAttentionCount || 0}</strong>
                </span>
                <span className="health-badge-pill pill--sick">
                  🥀 Unwell: <strong>{stats.sickCount || 0}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Overdue Alert */}
          {stats.overdueWateringCount > 0 && (
            <div className="dashboard-alert">
              <span>⚠️</span>
              <div>
                <strong>{stats.overdueWateringCount} plant(s) are overdue for watering!</strong>
                <Link to="/schedule" className="dashboard-alert-link"> View Care Schedule →</Link>
              </div>
            </div>
          )}

          <div className="dashboard-sections">
            {/* Plants needing watering today */}
            {stats.plantsNeedingWatering?.length > 0 && (
              <section className="dashboard-section">
                <h2 className="section-title">💧 Needs Watering Today</h2>
                <div className="dashboard-plant-list">
                  {stats.plantsNeedingWatering.map(plant => (
                    <Link to={`/plants/${plant.id}`} key={plant.id} className="dashboard-plant-item">
                      {plant.imageUrl ? (
                        <img src={plant.imageUrl} alt={plant.name} className="dashboard-plant-thumb" />
                      ) : (
                        <span className="dashboard-plant-emoji">🌱</span>
                      )}
                      <div className="dashboard-plant-item-content">
                        <strong>{plant.name}</strong>
                        <span className="dashboard-plant-meta"> — {plant.location}</span>
                      </div>
                      <span className="dashboard-plant-badge badge--due">Due Today</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Overdue plants */}
            {stats.overduePlants?.length > 0 && (
              <section className="dashboard-section">
                <h2 className="section-title">🔴 Overdue Plants</h2>
                <div className="dashboard-plant-list">
                  {stats.overduePlants.map(plant => (
                    <Link to={`/plants/${plant.id}`} key={plant.id} className="dashboard-plant-item">
                      {plant.imageUrl ? (
                        <img src={plant.imageUrl} alt={plant.name} className="dashboard-plant-thumb" />
                      ) : (
                        <span className="dashboard-plant-emoji">🌱</span>
                      )}
                      <div className="dashboard-plant-item-content">
                        <strong>{plant.name}</strong>
                        <span className="dashboard-plant-meta">
                          {' '}— last watered: {plant.lastWateredDate ? new Date(plant.lastWateredDate).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                      <span className="dashboard-plant-badge badge--overdue">Overdue!</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Plants Needing Fertilizer */}
            {stats.plantsNeedingFertilizing?.length > 0 && (
              <section className="dashboard-section">
                <h2 className="section-title">🌿 Feeding & Fertilizer Due</h2>
                <div className="dashboard-plant-list">
                  {stats.plantsNeedingFertilizing.map(plant => (
                    <Link to={`/plants/${plant.id}`} key={plant.id} className="dashboard-plant-item">
                      {plant.imageUrl ? (
                        <img src={plant.imageUrl} alt={plant.name} className="dashboard-plant-thumb" />
                      ) : (
                        <span className="dashboard-plant-emoji">🌿</span>
                      )}
                      <div className="dashboard-plant-item-content">
                        <strong>{plant.name}</strong>
                        <span className="dashboard-plant-meta"> — {plant.species}</span>
                      </div>
                      <span className="dashboard-plant-badge badge--fert">Fertilize</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Recent activity */}
            <section className="dashboard-section">
              <h2 className="section-title">📋 Recent Activity & Growth Milestones</h2>
              {stats.recentActivities?.length > 0 ? (
                <div className="dashboard-activity-list">
                  {stats.recentActivities.map(activity => (
                    <div key={activity.id} className="dashboard-activity-item">
                      <span className="activity-type-badge">
                        {activity.activityType === 'WATERING' ? '💧 ' :
                         activity.activityType === 'FERTILIZING' ? '🌿 ' :
                         activity.activityType === 'REPOTTING' ? '🪴 ' :
                         activity.activityType === 'GROWTH_MILESTONE' ? '🌱 ' : '✂️ '}
                        {activity.activityType.replace('_', ' ')}
                      </span>
                      <span className="activity-plant-name">{activity.plantName}</span>
                      {activity.notes && <span className="activity-notes"> — {activity.notes}</span>}
                      <span className="activity-date">{new Date(activity.activityDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No care activities recorded yet. <Link to="/plants">Start by adding a plant!</Link></p>
              )}
            </section>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <Link to="/plants/new" className="quick-action-btn quick-action-btn--primary">➕ Add New Plant</Link>
            <Link to="/schedule" className="quick-action-btn">💧 View Care Schedule</Link>
            <Link to="/history" className="quick-action-btn">📋 Full Care History</Link>
            <Link to="/guide" className="quick-action-btn">📖 Plant Guide (Quick Add)</Link>
          </div>
        </>
      ) : !error ? (
        <div className="empty-text">No data available.</div>
      ) : null}
    </div>
  );
}
