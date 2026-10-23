import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { plantAPI } from '../services/api';
import { usePlant } from '../hooks/usePlants';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './PlantDetail.css';

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plant, loading, error, refetch } = usePlant(id);
  const [successMsg, setSuccessMsg] = useState('');
  const [actionError, setActionError] = useState('');
  const [watering, setWatering] = useState(false);
  const [waterNote, setWaterNote] = useState('');

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${plant.name}"? All care history will also be deleted.`)) return;
    try {
      await plantAPI.delete(id);
      navigate('/plants');
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleWater = async () => {
    try {
      await plantAPI.water(id, waterNote);
      setSuccessMsg('Watering recorded! 💧');
      setWaterNote('');
      setWatering(false);
      refetch();
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading plant details..." />;
  if (error) return <Alert type="error" message={error} />;
  if (!plant) return null;

  const statusBadge = plant.overdueForWatering ? 'badge--overdue' :
    plant.dueForWateringToday ? 'badge--due' : 'badge--ok';
  const statusLabel = plant.overdueForWatering ? 'Overdue!' :
    plant.dueForWateringToday ? 'Due Today' : 'On Schedule';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{plant.name}</h1>
          <p className="page-subtitle">{plant.species}</p>
        </div>
        <div className="detail-actions">
          <Link to={`/plants/${id}/edit`} className="btn-secondary">✏️ Edit</Link>
          <button onClick={handleDelete} className="btn-danger">🗑️ Delete</button>
        </div>
      </div>

      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      <Alert type="error" message={actionError} onClose={() => setActionError('')} />

      <div className="detail-grid">
        {/* Left column: plant info */}
        <div className="detail-card">
          <h2 className="detail-card-title">🌿 Plant Information</h2>
          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-label">Type</span>
              <span className="detail-value">{plant.plantType === 'INDOOR' ? '🏠 Indoor' : '🌳 Outdoor'}</span>
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
              <span className="detail-label">Watering</span>
              <span className="detail-value">Every {plant.wateringIntervalDays} day(s)</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Watering Status</span>
              <span className={`plant-badge ${statusBadge}`}>{statusLabel}</span>
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
              <h3 className="detail-sub-title">🏠 Indoor Details</h3>
              <div className="detail-rows">
                {plant.humidityPreference && <div className="detail-row"><span className="detail-label">Humidity</span><span className="detail-value">{plant.humidityPreference}</span></div>}
                {plant.potSize && <div className="detail-row"><span className="detail-label">Pot Size</span><span className="detail-value">{plant.potSize}</span></div>}
                {plant.repottingIntervalMonths && <div className="detail-row"><span className="detail-label">Repot Every</span><span className="detail-value">{plant.repottingIntervalMonths} months</span></div>}
              </div>
            </>
          )}

          {plant.plantType === 'OUTDOOR' && (
            <>
              <h3 className="detail-sub-title">🌳 Outdoor Details</h3>
              <div className="detail-rows">
                {plant.hardinessZone && <div className="detail-row"><span className="detail-label">Zone</span><span className="detail-value">{plant.hardinessZone}</span></div>}
                {plant.soilTypePreference && <div className="detail-row"><span className="detail-label">Soil</span><span className="detail-value">{plant.soilTypePreference}</span></div>}
                {plant.isFrostTolerant != null && <div className="detail-row"><span className="detail-label">Frost Tolerant</span><span className="detail-value">{plant.isFrostTolerant ? 'Yes' : 'No'}</span></div>}
                {plant.pruningSeasonNote && <div className="detail-row"><span className="detail-label">Pruning</span><span className="detail-value">{plant.pruningSeasonNote}</span></div>}
              </div>
            </>
          )}
        </div>

        {/* Right column: care instructions + watering */}
        <div>
          <div className="detail-card">
            <h2 className="detail-card-title">💧 Quick Water</h2>
            {watering ? (
              <div className="water-form">
                <textarea
                  placeholder="Optional note (e.g. 'Soil was very dry')"
                  value={waterNote}
                  onChange={e => setWaterNote(e.target.value)}
                  rows={2}
                  className="water-note"
                />
                <div className="water-form-actions">
                  <button className="btn-primary" onClick={handleWater}>💧 Record Watering</button>
                  <button className="btn-secondary" onClick={() => setWatering(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="btn-primary" onClick={() => setWatering(true)} style={{width:'100%',justifyContent:'center'}}>
                💧 Record Watering
              </button>
            )}
          </div>

          <div className="detail-card" style={{marginTop: 16}}>
            <h2 className="detail-card-title">📋 Care Instructions</h2>
            <pre className="care-instructions">{plant.careInstructions}</pre>
          </div>
        </div>
      </div>

      <div style={{marginTop: 16}}>
        <Link to={`/history?plantId=${id}`} className="btn-secondary">📋 View Care History</Link>
      </div>
    </div>
  );
}

