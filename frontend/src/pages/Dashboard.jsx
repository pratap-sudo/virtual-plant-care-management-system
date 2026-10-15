import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardAPI.getStats()
      .then(res => setStats(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🏠 Dashboard</h1>
        <p className="page-subtitle">Your plant care overview at a glance</p>
      </div>

      {error && (
        <Alert type="error" message={`Cannot connect to backend: ${error}. Make sure Spring Boot is running on port 8080.`} />
      )}

      {stats ? (
        <>
          {/* Stat Cards */}
          <div className="stats-grid">
            <StatCard icon="🌿" label="Total Plants" value={stats.totalPlants} color="green" />
            <StatCard icon="🏠" label="Indoor Plants" value={stats.indoorPlants} color="blue" />
            <StatCard icon="🌳" label="Outdoor Plants" value={stats.outdoorPlants} color="green" />
            <StatCard icon="💧" label="Due for Watering" value={stats.plantsNeedingWateringToday} color="blue" sub="today" />
            <StatCard icon="⚠️" label="Overdue Watering" value={stats.overdueWateringCount} color="red" />
          </div>

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
            {/* Plants needing attention */}
            {stats.plantsNeedingWatering?.length > 0 && (
              <section className="dashboard-section">
                <h2 className="section-title">💧 Needs Watering Today</h2>
                <div className="dashboard-plant-list">
                  {stats.plantsNeedingWatering.map(plant => (
                    <Link to={`/plants/${plant.id}`} key={plant.id} className="dashboard-plant-item">
                      <span className="dashboard-plant-emoji">🌱</span>
                      <div>
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
                      <span className="dashboard-plant-emoji">🌱</span>
                      <div>
                        <strong>{plant.name}</strong>
                        <span className="dashboard-plant-meta"> — last watered: {plant.lastWateredDate ? new Date(plant.lastWateredDate).toLocaleDateString() : 'Never'}</span>
                      </div>
                      <span className="dashboard-plant-badge badge--overdue">Overdue!</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Recent activity */}
            <section className="dashboard-section">
              <h2 className="section-title">📋 Recent Activity</h2>
              {stats.recentActivities?.length > 0 ? (
                <div className="dashboard-activity-list">
                  {stats.recentActivities.map(activity => (
                    <div key={activity.id} className="dashboard-activity-item">
                      <span className="activity-type-badge">
                        {activity.activityType === 'WATERING' ? '💧' : activity.activityType === 'FERTILIZING' ? '🌿' : '✂️'}
                        {activity.activityType}
                      </span>
                      <span className="activity-plant-name">{activity.plantName}</span>
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
            <Link to="/schedule" className="quick-action-btn">💧 View Schedule</Link>
            <Link to="/history" className="quick-action-btn">📋 Care History</Link>
            <Link to="/guide" className="quick-action-btn">📖 Plant Guide</Link>
          </div>
        </>
      ) : !error ? (
        <div className="empty-text">No data available.</div>
      ) : null}
    </div>
  );
}
