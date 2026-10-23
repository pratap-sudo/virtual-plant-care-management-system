import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { plantAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import WeatherWidget from '../components/WeatherWidget';
import CareCalendar from '../components/CareCalendar';
import './CareSchedule.css';

export default function CareSchedule() {
  const toast = useToast();
  const [viewMode, setViewMode] = useState('LIST'); // 'LIST' or 'CALENDAR'
  const [activeTab, setActiveTab] = useState('WATERING'); // 'WATERING', 'FERTILIZING', 'REPOTTING'
  const [dueToday, setDueToday] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [dueFertilizing, setDueFertilizing] = useState([]);
  const [dueRepotting, setDueRepotting] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      plantAPI.getDueToday(),
      plantAPI.getOverdue(),
      plantAPI.getDueFertilizing(),
      plantAPI.getDueRepotting(),
      plantAPI.getAll(),
    ])
      .then(([dueRes, overdueRes, fertRes, repotRes, allRes]) => {
        setDueToday(dueRes.data || []);
        setOverdue(overdueRes.data || []);
        setDueFertilizing(fertRes.data || []);
        setDueRepotting(repotRes.data || []);
        setAllPlants(allRes.data || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleWater = async (plant) => {
    try {
      await plantAPI.water(plant.id);
      toast.success(`${plant.name} watered! 💧`);
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFertilize = async (plant) => {
    try {
      await plantAPI.fertilize(plant.id);
      toast.success(`${plant.name} fed with fertilizer! 🌿`);
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRepot = async (plant) => {
    try {
      await plantAPI.repot(plant.id);
      toast.success(`${plant.name} repotted to fresh soil! 🪴`);
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading care schedule..." />;

  const outdoorPlants = allPlants.filter(p => p.plantType === 'OUTDOOR');

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">💧 Care Schedule & Reminders</h1>
          <p className="page-subtitle">Track and complete daily plant care routines</p>
        </div>

        {/* View Toggle (List vs Calendar) */}
        <div className="view-toggle-bar">
          <button
            className={`view-toggle-btn ${viewMode === 'LIST' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => setViewMode('LIST')}
          >
            📋 List View
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'CALENDAR' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => setViewMode('CALENDAR')}
          >
            📅 Calendar View
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Weather context advisory */}
      <WeatherWidget outdoorPlants={outdoorPlants} />

      {/* CALENDAR VIEW */}
      {viewMode === 'CALENDAR' ? (
        <CareCalendar
          plants={allPlants}
          onWater={handleWater}
          onFertilize={handleFertilize}
        />
      ) : (
        /* LIST VIEW */
        <>
          {/* Tabs */}
          <div className="schedule-tabs">
            <button
              className={`schedule-tab ${activeTab === 'WATERING' ? 'schedule-tab--active' : ''}`}
              onClick={() => setActiveTab('WATERING')}
            >
              💧 Watering ({overdue.length + dueToday.length})
            </button>
            <button
              className={`schedule-tab ${activeTab === 'FERTILIZING' ? 'schedule-tab--active' : ''}`}
              onClick={() => setActiveTab('FERTILIZING')}
            >
              🌿 Fertilizing ({dueFertilizing.length})
            </button>
            <button
              className={`schedule-tab ${activeTab === 'REPOTTING' ? 'schedule-tab--active' : ''}`}
              onClick={() => setActiveTab('REPOTTING')}
            >
              🪴 Repotting ({dueRepotting.length})
            </button>
          </div>

          {/* TAB 1: WATERING */}
          {activeTab === 'WATERING' && (
            <>
              {/* Overdue Section */}
              <section className="schedule-section">
                <h2 className="schedule-section-title">🔴 Overdue Watering ({overdue.length})</h2>
                {overdue.length === 0 ? (
                  <EmptyState icon="✅" title="No overdue plants!" message="Great job keeping up with your plant care." />
                ) : (
                  <div className="schedule-list">
                    {overdue.map(plant => (
                      <div key={plant.id} className="schedule-item schedule-item--overdue">
                        <div className="schedule-item-media">
                          {plant.imageUrl ? (
                            <img src={plant.imageUrl} alt={plant.name} className="schedule-item-img" />
                          ) : (
                            <span className="schedule-item-emoji">🌱</span>
                          )}
                        </div>
                        <div className="schedule-item-info">
                          <Link to={`/plants/${plant.id}`} className="schedule-item-name">{plant.name}</Link>
                          <span className="schedule-item-meta">{plant.species} · 📍 {plant.location}</span>
                          <span className="schedule-item-date">
                            Last watered: {plant.lastWateredDate ? new Date(plant.lastWateredDate).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                        <button className="water-btn btn--water-action" onClick={() => handleWater(plant)}>
                          💧 Water Now
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Due Today Section */}
              <section className="schedule-section">
                <h2 className="schedule-section-title">💧 Due Today ({dueToday.length})</h2>
                {dueToday.length === 0 ? (
                  <EmptyState icon="🌿" title="No plants due today" message="All plants are hydrated for today." />
                ) : (
                  <div className="schedule-list">
                    {dueToday.map(plant => (
                      <div key={plant.id} className="schedule-item schedule-item--due">
                        <div className="schedule-item-media">
                          {plant.imageUrl ? (
                            <img src={plant.imageUrl} alt={plant.name} className="schedule-item-img" />
                          ) : (
                            <span className="schedule-item-emoji">🌱</span>
                          )}
                        </div>
                        <div className="schedule-item-info">
                          <Link to={`/plants/${plant.id}`} className="schedule-item-name">{plant.name}</Link>
                          <span className="schedule-item-meta">{plant.species} · 📍 {plant.location}</span>
                          <span className="schedule-item-date">
                            Due today · watering every {plant.wateringIntervalDays} day(s)
                          </span>
                        </div>
                        <button className="water-btn btn--water-action" onClick={() => handleWater(plant)}>
                          💧 Water Now
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* TAB 2: FERTILIZING */}
          {activeTab === 'FERTILIZING' && (
            <section className="schedule-section">
              <h2 className="schedule-section-title">🌿 Feeding & Fertilizer Due ({dueFertilizing.length})</h2>
              {dueFertilizing.length === 0 ? (
                <EmptyState icon="💚" title="No fertilizer due" message="All plants have been fertilized recently according to their cycle." />
              ) : (
                <div className="schedule-list">
                  {dueFertilizing.map(plant => (
                    <div key={plant.id} className="schedule-item schedule-item--fert">
                      <div className="schedule-item-media">
                        {plant.imageUrl ? (
                          <img src={plant.imageUrl} alt={plant.name} className="schedule-item-img" />
                        ) : (
                          <span className="schedule-item-emoji">🌿</span>
                        )}
                      </div>
                      <div className="schedule-item-info">
                        <Link to={`/plants/${plant.id}`} className="schedule-item-name">{plant.name}</Link>
                        <span className="schedule-item-meta">{plant.species} · 📍 {plant.location}</span>
                        <span className="schedule-item-date">
                          Interval: every {plant.fertilizingIntervalDays || 30} days · Last fertilized: {plant.lastFertilizedDate ? new Date(plant.lastFertilizedDate).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                      <button className="water-btn btn--fert-action" onClick={() => handleFertilize(plant)}>
                        🌿 Fertilize Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 3: REPOTTING */}
          {activeTab === 'REPOTTING' && (
            <section className="schedule-section">
              <h2 className="schedule-section-title">🪴 Indoor Repotting Due ({dueRepotting.length})</h2>
              {dueRepotting.length === 0 ? (
                <EmptyState icon="🪴" title="No repotting needed" message="All indoor pots and root systems have ample room to grow." />
              ) : (
                <div className="schedule-list">
                  {dueRepotting.map(plant => (
                    <div key={plant.id} className="schedule-item schedule-item--repot">
                      <div className="schedule-item-media">
                        {plant.imageUrl ? (
                          <img src={plant.imageUrl} alt={plant.name} className="schedule-item-img" />
                        ) : (
                          <span className="schedule-item-emoji">🪴</span>
                        )}
                      </div>
                      <div className="schedule-item-info">
                        <Link to={`/plants/${plant.id}`} className="schedule-item-name">{plant.name}</Link>
                        <span className="schedule-item-meta">{plant.species} · Pot: {plant.potSize || 'Standard'}</span>
                        <span className="schedule-item-date">
                          Cycle: every {plant.repottingIntervalMonths || 12} months · Last repotted: {plant.lastRepottedDate ? new Date(plant.lastRepottedDate).toLocaleDateString() : 'Never logged'}
                        </span>
                      </div>
                      <button className="water-btn btn--repot-action" onClick={() => handleRepot(plant)}>
                        🪴 Repot Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
