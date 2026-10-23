import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { plantAPI, activityAPI } from '../services/api';
import { usePlant } from '../hooks/usePlants';
import { useToast } from '../context/ToastContext';
import { exportActivitiesToCsv } from '../utils/exportCsv';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import PlantPotTagModal from '../components/PlantPotTagModal';
import './PlantDetail.css';

const HEALTH_OPTIONS = [
  { value: 'THRIVING', label: '🌟 Thriving' },
  { value: 'HEALTHY', label: '💚 Healthy' },
  { value: 'NEEDS_ATTENTION', label: '⚠️ Needs Attention' },
  { value: 'SICK', label: '🥀 Sick / Unwell' },
  { value: 'DORMANT', label: '💤 Dormant' },
];

const ACTIVITY_ICONS = {
  WATERING: '💧',
  FERTILIZING: '🌿',
  PRUNING: '✂️',
  REPOTTING: '🪴',
  GROWTH_MILESTONE: '🌱',
  OTHER: '📝',
};

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { plant, loading, error, refetch } = usePlant(id);

  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPotTagModal, setShowPotTagModal] = useState(false);

  // Care actions
  const [activeAction, setActiveAction] = useState(null); // 'WATER', 'FERTILIZE', 'REPOT', 'MILESTONE'
  const [actionNote, setActionNote] = useState('');
  const [savingAction, setSavingAction] = useState(false);

  // Health status changer
  const [changingHealth, setChangingHealth] = useState(false);
  const [selectedHealth, setSelectedHealth] = useState('');

  const loadActivities = () => {
    setLoadingActivities(true);
    activityAPI.getByPlant(id)
      .then(res => setActivities(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingActivities(false));
  };

  useEffect(() => {
    if (id) loadActivities();
  }, [id]);

  useEffect(() => {
    if (plant) setSelectedHealth(plant.healthStatus || 'HEALTHY');
  }, [plant]);

  const handleConfirmDelete = async () => {
    try {
      await plantAPI.delete(id);
      toast.success(`"${plant.name}" deleted successfully.`);
      navigate('/plants');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleExecuteCareAction = async () => {
    setSavingAction(true);
    try {
      if (activeAction === 'WATER') {
        await plantAPI.water(id, actionNote);
        toast.success('Watering recorded! 💧');
      } else if (activeAction === 'FERTILIZE') {
        await plantAPI.fertilize(id, actionNote);
        toast.success('Fertilizing recorded! 🌿');
      } else if (activeAction === 'REPOT') {
        await plantAPI.repot(id, actionNote);
        toast.success('Repotting recorded! 🪴');
      } else if (activeAction === 'MILESTONE') {
        await activityAPI.create({
          plantId: Number(id),
          activityType: 'GROWTH_MILESTONE',
          activityDate: new Date().toISOString().split('T')[0],
          notes: actionNote || 'Growth milestone recorded',
        });
        toast.success('Growth milestone saved! 🌱');
      }
      setActiveAction(null);
      setActionNote('');
      refetch();
      loadActivities();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingAction(false);
    }
  };

  const handleUpdateHealth = async (newHealth) => {
    try {
      await plantAPI.updateHealth(id, newHealth, `Status changed to ${newHealth}`);
      toast.success(`Health status updated to ${newHealth} 💚`);
      setChangingHealth(false);
      refetch();
      loadActivities();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleExportCsv = () => {
    try {
      exportActivitiesToCsv(activities, `${plant.name.toLowerCase().replace(/\s+/g, '-')}-care-history.csv`);
      toast.success('Care history exported as CSV! 📥');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading plant details..." />;
  if (error) return <div className="page"><p className="empty-subtext">{error}</p></div>;
  if (!plant) return null;

  const waterBadge = plant.overdueForWatering ? 'badge--overdue' :
    plant.dueForWateringToday ? 'badge--due' : 'badge--ok';
  const waterLabel = plant.overdueForWatering ? 'Water Overdue!' :
    plant.dueForWateringToday ? 'Water Due Today' : 'Water On Schedule';

  return (
    <div className="page">
      {/* Hero Banner */}
      <div className="detail-hero">
        {plant.imageUrl ? (
          <img src={plant.imageUrl} alt={plant.name} className="detail-hero-img" />
        ) : (
          <div className="detail-hero-placeholder">🌿</div>
        )}
        <div className="detail-hero-overlay">
          <div className="detail-hero-title-group">
            <h1 className="detail-hero-title">{plant.name}</h1>
            <p className="detail-hero-species">{plant.species}</p>
          </div>
          <div className="detail-actions">
            <button
              onClick={() => setShowPotTagModal(true)}
              className="btn-secondary btn-hero"
              title="Printable QR Code Tag for Pot"
            >
              🏷️ Print Pot Tag
            </button>
            <Link to={`/plants/${id}/edit`} className="btn-secondary btn-hero">✏️ Edit</Link>
            <button onClick={() => setShowDeleteModal(true)} className="btn-danger btn-hero">🗑️ Delete</button>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="detail-action-bar">
        <button
          className={`action-btn action-btn--water ${activeAction === 'WATER' ? 'action-btn--active' : ''}`}
          onClick={() => { setActiveAction(activeAction === 'WATER' ? null : 'WATER'); setActionNote(''); }}
        >
          💧 Water Plant
        </button>
        <button
          className={`action-btn action-btn--fertilize ${activeAction === 'FERTILIZE' ? 'action-btn--active' : ''}`}
          onClick={() => { setActiveAction(activeAction === 'FERTILIZE' ? null : 'FERTILIZE'); setActionNote(''); }}
        >
          🌿 Feed / Fertilize
        </button>
        {plant.plantType === 'INDOOR' && (
          <button
            className={`action-btn action-btn--repot ${activeAction === 'REPOT' ? 'action-btn--active' : ''}`}
            onClick={() => { setActiveAction(activeAction === 'REPOT' ? null : 'REPOT'); setActionNote(''); }}
          >
            🪴 Repot
          </button>
        )}
        <button
          className={`action-btn action-btn--milestone ${activeAction === 'MILESTONE' ? 'action-btn--active' : ''}`}
          onClick={() => { setActiveAction(activeAction === 'MILESTONE' ? null : 'MILESTONE'); setActionNote(''); }}
        >
          🌱 Log Milestone
        </button>
      </div>

      {/* Action Input Box */}
      {activeAction && (
        <div className="action-input-card">
          <h3 className="action-input-title">
            {activeAction === 'WATER' && '💧 Record Watering'}
            {activeAction === 'FERTILIZE' && '🌿 Record Fertilizing'}
            {activeAction === 'REPOT' && '🪴 Record Repotting'}
            {activeAction === 'MILESTONE' && '🌱 Log Growth Milestone'}
          </h3>
          <textarea
            placeholder={
              activeAction === 'MILESTONE'
                ? "Describe growth (e.g. 'New leaf sprouted!', 'Height measured 30cm', 'First flower open!')"
                : "Optional note (e.g. 'Liquid fertilizer half strength', 'Upgraded to 10-inch terracotta')"
            }
            value={actionNote}
            onChange={e => setActionNote(e.target.value)}
            rows={2}
            className="action-textarea"
          />
          <div className="action-card-buttons">
            <button
              className="btn-primary"
              onClick={handleExecuteCareAction}
              disabled={savingAction || (activeAction === 'MILESTONE' && !actionNote.trim())}
            >
              {savingAction ? 'Saving...' : 'Confirm & Log Entry'}
            </button>
            <button className="btn-secondary" onClick={() => setActiveAction(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="detail-grid">
        {/* Plant Information Card */}
        <div className="detail-card">
          <div className="card-header-with-badge">
            <h2 className="detail-card-title">🌿 Plant Information</h2>
            <div className="health-badge-container">
              <span className={`plant-health-tag health--${(plant.healthStatus || 'HEALTHY').toLowerCase()}`}>
                {HEALTH_OPTIONS.find(h => h.value === plant.healthStatus)?.label || '💚 Healthy'}
              </span>
              <button
                className="btn-health-toggle"
                onClick={() => setChangingHealth(!changingHealth)}
                title="Update Health Status"
              >
                ✏️
              </button>
            </div>
          </div>

          {changingHealth && (
            <div className="health-change-box">
              <label className="health-change-label">Change Health Rating:</label>
              <div className="health-options-row">
                {HEALTH_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`btn-health-choice ${selectedHealth === opt.value ? 'btn-health-choice--active' : ''}`}
                    onClick={() => handleUpdateHealth(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-label">Type</span>
              <span className="detail-value">{plant.plantType === 'INDOOR' ? '🏠 Indoor Plant' : '🌳 Outdoor Plant'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Location</span>
              <span className="detail-value">📍 {plant.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Sunlight</span>
              <span className="detail-value">{plant.sunlightRequirement}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Watering Schedule</span>
              <span className="detail-value">Every {plant.wateringIntervalDays} day(s)</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Watering Status</span>
              <span className={`plant-badge ${waterBadge}`}>{waterLabel}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Last Watered</span>
              <span className="detail-value">
                {plant.lastWateredDate ? new Date(plant.lastWateredDate).toLocaleDateString() : 'Not yet recorded'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Next Watering</span>
              <span className="detail-value">
                {plant.nextWateringDate ? new Date(plant.nextWateringDate).toLocaleDateString() : '—'}
              </span>
            </div>

            {/* Fertilizing Schedule */}
            {plant.fertilizingIntervalDays && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Fertilizer Interval</span>
                  <span className="detail-value">Every {plant.fertilizingIntervalDays} day(s)</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Fertilized</span>
                  <span className="detail-value">
                    {plant.lastFertilizedDate ? new Date(plant.lastFertilizedDate).toLocaleDateString() : 'Not yet recorded'}
                  </span>
                </div>
                {plant.nextFertilizingDate && (
                  <div className="detail-row">
                    <span className="detail-label">Next Fertilizer</span>
                    <span className="detail-value">
                      {new Date(plant.nextFertilizingDate).toLocaleDateString()}
                      {(plant.dueForFertilizingToday || plant.overdueForFertilizing) && (
                        <span className="pill--fertilize" style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem' }}>
                          Due!
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </>
            )}

            {plant.generalNotes && (
              <div className="detail-row detail-row--full">
                <span className="detail-label">Notes</span>
                <span className="detail-value">{plant.generalNotes}</span>
              </div>
            )}
          </div>

          {/* Type-specific details */}
          {plant.plantType === 'INDOOR' && (
            <>
              <h3 className="detail-sub-title">🏠 Indoor Care Profile</h3>
              <div className="detail-rows">
                {plant.humidityPreference && (
                  <div className="detail-row"><span className="detail-label">Humidity</span><span className="detail-value">{plant.humidityPreference}</span></div>
                )}
                {plant.potSize && (
                  <div className="detail-row"><span className="detail-label">Pot Size</span><span className="detail-value">{plant.potSize}</span></div>
                )}
                {plant.repottingIntervalMonths && (
                  <div className="detail-row"><span className="detail-label">Repot Every</span><span className="detail-value">{plant.repottingIntervalMonths} months</span></div>
                )}
                {plant.lastRepottedDate && (
                  <div className="detail-row"><span className="detail-label">Last Repotted</span><span className="detail-value">{new Date(plant.lastRepottedDate).toLocaleDateString()}</span></div>
                )}
                {plant.dueForRepotting && (
                  <div className="detail-row">
                    <span className="detail-label">Repotting Status</span>
                    <span className="pill--repot" style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem' }}>
                      🪴 Repotting Due
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {plant.plantType === 'OUTDOOR' && (
            <>
              <h3 className="detail-sub-title">🌳 Outdoor Care Profile</h3>
              <div className="detail-rows">
                {plant.hardinessZone && (
                  <div className="detail-row"><span className="detail-label">Zone</span><span className="detail-value">{plant.hardinessZone}</span></div>
                )}
                {plant.soilTypePreference && (
                  <div className="detail-row"><span className="detail-label">Soil</span><span className="detail-value">{plant.soilTypePreference}</span></div>
                )}
                {plant.isFrostTolerant != null && (
                  <div className="detail-row">
                    <span className="detail-label">Frost Tolerant</span>
                    <span className="detail-value">
                      {plant.isFrostTolerant ? '✅ Yes (Can winter outdoors)' : '⚠️ No (Requires frost protection or shelter)'}
                    </span>
                  </div>
                )}
                {plant.pruningSeasonNote && (
                  <div className="detail-row"><span className="detail-label">Pruning</span><span className="detail-value">{plant.pruningSeasonNote}</span></div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right column: Polymorphic Care Guide & Growth Diary */}
        <div className="detail-right-col">
          <div className="detail-card">
            <h2 className="detail-card-title">📋 Polymorphic Care Instructions</h2>
            <pre className="care-instructions">{plant.careInstructions}</pre>
          </div>

          <div className="detail-card" style={{ marginTop: 20 }}>
            <div className="card-header-with-badge">
              <h2 className="detail-card-title">🌱 Growth Diary & Activity Log</h2>
              <div style={{ display: 'flex', gap: 6 }}>
                {activities.length > 0 && (
                  <button className="btn-subtle" onClick={handleExportCsv} title="Export to CSV">
                    📥 CSV
                  </button>
                )}
                <button
                  className="btn-subtle"
                  onClick={() => { setActiveAction('MILESTONE'); setActionNote(''); }}
                >
                  ➕ Add Entry
                </button>
              </div>
            </div>

            {loadingActivities ? (
              <p className="loading-text">Loading history...</p>
            ) : activities.length === 0 ? (
              <p className="empty-subtext">No care activities or growth milestones logged yet. Click any button above to log an entry!</p>
            ) : (
              <div className="timeline-list">
                {activities.slice(0, 8).map(act => (
                  <div key={act.id} className="timeline-item">
                    <div className="timeline-icon">
                      {ACTIVITY_ICONS[act.activityType] || '📝'}
                    </div>
                    <div className="timeline-body">
                      <div className="timeline-header">
                        <span className="timeline-type">{act.activityType.replace('_', ' ')}</span>
                        <span className="timeline-date">{new Date(act.activityDate).toLocaleDateString()}</span>
                      </div>
                      {act.notes && <p className="timeline-notes">{act.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title={`Delete "${plant.name}"?`}
        message="Are you sure you want to delete this plant? All care activity records and growth milestones will be permanently removed."
        confirmText="Yes, Delete Plant"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Printable Pot Tag Modal with QR code */}
      <PlantPotTagModal
        isOpen={showPotTagModal}
        plant={plant}
        onClose={() => setShowPotTagModal(false)}
      />
    </div>
  );
}
