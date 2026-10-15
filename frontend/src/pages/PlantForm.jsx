import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { plantAPI } from '../services/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import './PlantForm.css';

const initialForm = {
  name: '',
  species: '',
  plantType: 'INDOOR',
  location: '',
  wateringIntervalDays: 7,
  lastWateredDate: '',
  sunlightRequirement: 'Medium',
  generalNotes: '',
  // Indoor
  humidityPreference: '',
  potSize: '',
  repottingIntervalMonths: '',
  // Outdoor
  hardinessZone: '',
  isFrostTolerant: '',
  soilTypePreference: '',
  pruningSeasonNote: '',
};

export default function PlantForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Load existing plant data for edit mode
  useEffect(() => {
    if (!isEdit) return;
    plantAPI.getById(id)
      .then(res => {
        const p = res.data;
        setForm({
          name: p.name || '',
          species: p.species || '',
          plantType: p.plantType || 'INDOOR',
          location: p.location || '',
          wateringIntervalDays: p.wateringIntervalDays || 7,
          lastWateredDate: p.lastWateredDate || '',
          sunlightRequirement: p.sunlightRequirement || 'Medium',
          generalNotes: p.generalNotes || '',
          humidityPreference: p.humidityPreference || '',
          potSize: p.potSize || '',
          repottingIntervalMonths: p.repottingIntervalMonths || '',
          hardinessZone: p.hardinessZone || '',
          isFrostTolerant: p.isFrostTolerant != null ? String(p.isFrostTolerant) : '',
          soilTypePreference: p.soilTypePreference || '',
          pruningSeasonNote: p.pruningSeasonNote || '',
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Plant name is required';
    if (!form.species.trim()) errs.species = 'Species is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.wateringIntervalDays || form.wateringIntervalDays < 1)
      errs.wateringIntervalDays = 'Must be at least 1 day';
    if (!form.sunlightRequirement.trim()) errs.sunlightRequirement = 'Sunlight requirement is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    const payload = {
      ...form,
      wateringIntervalDays: Number(form.wateringIntervalDays),
      repottingIntervalMonths: form.repottingIntervalMonths ? Number(form.repottingIntervalMonths) : null,
      isFrostTolerant: form.isFrostTolerant === 'true' ? true : form.isFrostTolerant === 'false' ? false : null,
      lastWateredDate: form.lastWateredDate || null,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await plantAPI.update(id, payload);
      } else {
        await plantAPI.create(payload);
      }
      navigate('/plants');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading plant data..." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? '✏️ Edit Plant' : '➕ Add New Plant'}</h1>
        <p className="page-subtitle">{isEdit ? 'Update your plant details' : 'Add a new plant to your collection'}</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      <form className="plant-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="form-section-title">Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Plant Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Money Plant" />
              {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>Species *</label>
              <input name="species" value={form.species} onChange={handleChange} placeholder="e.g. Epipremnum aureum" />
              {fieldErrors.species && <span className="field-error">{fieldErrors.species}</span>}
            </div>
            <div className="form-group">
              <label>Plant Type *</label>
              <select name="plantType" value={form.plantType} onChange={handleChange}>
                <option value="INDOOR">🏠 Indoor</option>
                <option value="OUTDOOR">🌳 Outdoor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Living Room, Balcony" />
              {fieldErrors.location && <span className="field-error">{fieldErrors.location}</span>}
            </div>
            <div className="form-group">
              <label>Watering Every (days) *</label>
              <input
                type="number" name="wateringIntervalDays" min="1" max="365"
                value={form.wateringIntervalDays} onChange={handleChange}
              />
              {fieldErrors.wateringIntervalDays && <span className="field-error">{fieldErrors.wateringIntervalDays}</span>}
            </div>
            <div className="form-group">
              <label>Last Watered Date</label>
              <input type="date" name="lastWateredDate" value={form.lastWateredDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Sunlight Requirement *</label>
              <select name="sunlightRequirement" value={form.sunlightRequirement} onChange={handleChange}>
                <option value="Low">🌑 Low</option>
                <option value="Medium">🌤️ Medium</option>
                <option value="Bright Indirect">⛅ Bright Indirect</option>
                <option value="Full Sun">☀️ Full Sun</option>
              </select>
            </div>
            <div className="form-group form-group--full">
              <label>General Notes</label>
              <textarea name="generalNotes" value={form.generalNotes} onChange={handleChange}
                placeholder="Any notes about this plant..." rows={3} />
            </div>
          </div>
        </div>

        {/* Indoor-specific fields */}
        {form.plantType === 'INDOOR' && (
          <div className="form-section">
            <h2 className="form-section-title">🏠 Indoor Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Humidity Preference</label>
                <select name="humidityPreference" value={form.humidityPreference} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pot Size</label>
                <select name="potSize" value={form.potSize} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="Small">Small (under 15cm)</option>
                  <option value="Medium">Medium (15–25cm)</option>
                  <option value="Large">Large (over 25cm)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Repotting Interval (months)</label>
                <input type="number" name="repottingIntervalMonths" min="1" max="60"
                  value={form.repottingIntervalMonths} onChange={handleChange}
                  placeholder="e.g. 12" />
              </div>
            </div>
          </div>
        )}

        {/* Outdoor-specific fields */}
        {form.plantType === 'OUTDOOR' && (
          <div className="form-section">
            <h2 className="form-section-title">🌳 Outdoor Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Hardiness Zone</label>
                <input name="hardinessZone" value={form.hardinessZone} onChange={handleChange}
                  placeholder="e.g. Zone 9-11" />
              </div>
              <div className="form-group">
                <label>Frost Tolerant</label>
                <select name="isFrostTolerant" value={form.isFrostTolerant} onChange={handleChange}>
                  <option value="">Unknown</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Soil Type Preference</label>
                <select name="soilTypePreference" value={form.soilTypePreference} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="Well-drained">Well-drained</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Clay">Clay</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pruning Season Note</label>
                <input name="pruningSeasonNote" value={form.pruningSeasonNote} onChange={handleChange}
                  placeholder="e.g. Prune in spring" />
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            ← Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? '⏳ Saving...' : isEdit ? '💾 Save Changes' : '➕ Add Plant'}
          </button>
        </div>
      </form>
    </div>
  );
}
