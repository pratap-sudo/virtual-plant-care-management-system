import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { activityAPI, plantAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { exportActivitiesToCsv } from '../utils/exportCsv';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './CareHistory.css';

const ACTIVITY_ICONS = {
  WATERING: '💧',
  FERTILIZING: '🌿',
  PRUNING: '✂️',
  REPOTTING: '🪴',
  GROWTH_MILESTONE: '🌱',
  OTHER: '📝',
};

export default function CareHistory() {
  const [searchParams] = useSearchParams();
  const plantIdParam = searchParams.get('plantId');
  const toast = useToast();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // New activity form
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({
    plantId: plantIdParam || '',
    activityType: 'WATERING',
    activityDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const loadActivities = () => {
    const request = plantIdParam
      ? activityAPI.getByPlant(plantIdParam)
      : activityAPI.getAll();

    request
      .then(res => setActivities(res.data))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadActivities();
    plantAPI.getAll().then(res => setPlants(res.data)).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantIdParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.plantId) {
      toast.warning('Please select a plant to record care for.');
      return;
    }
    setSaving(true);
    try {
      await activityAPI.create({
        plantId: Number(form.plantId),
        activityType: form.activityType,
        activityDate: form.activityDate,
        notes: form.notes,
      });
      const selectedPlant = plants.find(p => p.id === Number(form.plantId));
      toast.success(
        selectedPlant
          ? `Recorded ${form.activityType.toLowerCase()} for "${selectedPlant.name}"! 🌿`
          : 'Care activity recorded successfully! 🌿'
      );
      setForm(prev => ({ ...prev, notes: '' }));
      loadActivities();
    } catch (err) {
      toast.error(err.message || 'Failed to record activity');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (activities.length === 0) {
      toast.info('No care history records to export.');
      return;
    }
    exportActivitiesToCsv(activities, `plant-care-history-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${activities.length} care record(s) to CSV! 📥`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Care History</h1>
          <p className="page-subtitle">Record and review plant care activities</p>
        </div>
        {activities.length > 0 && (
          <button className="btn-secondary" onClick={handleExport} title="Export as CSV">
            📥 Export CSV
          </button>
        )}
      </div>

      {/* Record activity form */}
      <div className="history-form-card">
        <h2 className="history-form-title">📝 Record New Activity</h2>
        <form className="history-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Plant</label>
            <select value={form.plantId} onChange={e => setForm(p => ({ ...p, plantId: e.target.value }))} required>
              <option value="">Select a plant...</option>
              {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Activity Type</label>
            <select value={form.activityType} onChange={e => setForm(p => ({ ...p, activityType: e.target.value }))}>
              <option value="WATERING">💧 Watering</option>
              <option value="FERTILIZING">🌿 Fertilizing</option>
              <option value="PRUNING">✂️ Pruning</option>
              <option value="REPOTTING">🪴 Repotting</option>
              <option value="GROWTH_MILESTONE">🌱 Growth Milestone / Note</option>
              <option value="OTHER">📝 Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.activityDate} onChange={e => setForm(p => ({ ...p, activityDate: e.target.value }))} />
          </div>
          <div className="form-group form-group--full">
            <label>Notes</label>
            <input placeholder="Optional notes..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? '⏳ Saving...' : '➕ Record Activity'}
          </button>
        </form>
      </div>

      {/* History list */}
      <div className="history-list-section">
        <h2 className="section-title">Activity History</h2>
        {loading ? (
          <LoadingSpinner />
        ) : activities.length === 0 ? (
          <EmptyState icon="📋" title="No activities yet" message="Record your first care activity above." />
        ) : (
          <div className="history-list">
            {activities.map(activity => (
              <div key={activity.id} className="history-item">
                <div className="history-item-icon">
                  {ACTIVITY_ICONS[activity.activityType] || '📝'}
                </div>
                <div className="history-item-info">
                  <span className="history-item-plant">{activity.plantName}</span>
                  <span className="history-item-type">{activity.activityType}</span>
                  {activity.notes && <span className="history-item-notes">{activity.notes}</span>}
                </div>
                <div className="history-item-date">
                  {new Date(activity.activityDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

