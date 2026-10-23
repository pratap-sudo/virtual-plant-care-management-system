import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { plantAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import './PlantForm.css';

const PRESET_IMAGES = [
  { label: 'Monstera 🪴', url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&auto=format&fit=crop&q=80' },
  { label: 'Snake Plant 🌿', url: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=600&auto=format&fit=crop&q=80' },
  { label: 'Money Plant 🍀', url: 'https://images.unsplash.com/photo-1596724817791-9070b4c20b8f?w=600&auto=format&fit=crop&q=80' },
  { label: 'Aloe Vera 🌵', url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80' },
  { label: 'Peace Lily 🌸', url: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=600&auto=format&fit=crop&q=80' },
  { label: 'Fiddle Leaf 🌳', url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80' },
  { label: 'Lavender 🪻', url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Succulent 🪴', url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&auto=format&fit=crop&q=80' },
];

const initialForm = {
  name: '',
  species: '',
  plantType: 'INDOOR',
  location: '',
  wateringIntervalDays: 7,
  lastWateredDate: '',
  sunlightRequirement: 'Medium',
  imageUrl: '',
  healthStatus: 'HEALTHY',
  fertilizingIntervalDays: 30,
  lastFertilizedDate: '',
  generalNotes: '',
  // Indoor
  humidityPreference: '',
  potSize: '',
  repottingIntervalMonths: '',
  lastRepottedDate: '',
  // Outdoor
  hardinessZone: '',
  isFrostTolerant: '',
  soilTypePreference: '',
  pruningSeasonNote: '',
};

export default function PlantForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const isEdit = Boolean(id);
  const prefill = location.state?.prefill;

  const [form, setForm] = useState(() => {
    if (prefill) {
      return { ...initialForm, ...prefill };
    }
    return initialForm;
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [prefillAlert, setPrefillAlert] = useState(Boolean(prefill));

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
          imageUrl: p.imageUrl || '',
          healthStatus: p.healthStatus || 'HEALTHY',
          fertilizingIntervalDays: p.fertilizingIntervalDays || 30,
          lastFertilizedDate: p.lastFertilizedDate || '',
          generalNotes: p.generalNotes || '',
          humidityPreference: p.humidityPreference || '',
          potSize: p.potSize || '',
          repottingIntervalMonths: p.repottingIntervalMonths || '',
          lastRepottedDate: p.lastRepottedDate || '',
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

  const handleApplyPreset = (url) => {
    setForm(prev => ({ ...prev, imageUrl: url }));
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
      toast.warning('Please complete the highlighted required fields.');
      return;
    }

    const payload = {
      ...form,
      wateringIntervalDays: Number(form.wateringIntervalDays),
      fertilizingIntervalDays: form.fertilizingIntervalDays ? Number(form.fertilizingIntervalDays) : null,
      repottingIntervalMonths: form.repottingIntervalMonths ? Number(form.repottingIntervalMonths) : null,
      isFrostTolerant: form.isFrostTolerant === 'true' ? true : form.isFrostTolerant === 'false' ? false : null,
      lastWateredDate: form.lastWateredDate || null,
      lastFertilizedDate: form.lastFertilizedDate || null,
      lastRepottedDate: form.lastRepottedDate || null,
      imageUrl: form.imageUrl?.trim() || null,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await plantAPI.update(id, payload);
        toast.success(`"${payload.name}" updated successfully! 🌿`);
      } else {
        await plantAPI.create(payload);
        toast.success(`"${payload.name}" added to your garden! 🌱`);
      }
      navigate('/plants');
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to save plant');
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

      {prefillAlert && (
        <Alert
          type="info"
          message={`✨ Pre-filled with standard care specifications from the Plant Guide for "${form.name}". Customize any field and save!`}
          onClose={() => setPrefillAlert(false)}
        />
      )}

      <Alert type="error" message={error} onClose={() => setError('')} />

      <form className="plant-form" onSubmit={handleSubmit}>
        {/* Photo & Visuals Section */}
        <div className="form-section">
          <h2 className="form-section-title">📸 Plant Photo</h2>
          <div className="form-grid">
            <div className="form-group form-group--full">
              <label>Image URL</label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
              />
              <span className="field-hint">Paste an image URL or choose one of our curated plant presets below:</span>
            </div>

            <div className="form-group form-group--full">
              <div className="preset-buttons">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`preset-btn ${form.imageUrl === preset.url ? 'preset-btn--active' : ''}`}
                    onClick={() => handleApplyPreset(preset.url)}
                  >
                    {preset.label}
                  </button>
                ))}
                {form.imageUrl && (
                  <button
                    type="button"
                    className="preset-btn preset-btn--clear"
                    onClick={() => handleApplyPreset('')}
                  >
                    ✕ Clear Photo
                  </button>
                )}
              </div>
            </div>

            {form.imageUrl && (
              <div className="form-group form-group--full">
                <div className="image-preview-container">
                  <span className="image-preview-label">Live Photo Preview:</span>
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="image-preview"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
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
              <label>Health Status</label>
              <select name="healthStatus" value={form.healthStatus} onChange={handleChange}>
                <option value="THRIVING">🌟 Thriving (Active growth, vigorous)</option>
                <option value="HEALTHY">💚 Healthy (Normal, good shape)</option>
                <option value="NEEDS_ATTENTION">⚠️ Needs Attention (Drooping / dry / yellowing)</option>
                <option value="SICK">🥀 Sick / Unwell (Pests / leaf damage)</option>
                <option value="DORMANT">💤 Dormant (Winter rest period)</option>
              </select>
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
                placeholder="Any notes about this plant..." rows={2} />
            </div>
          </div>
        </div>

        {/* Care Schedules */}
        <div className="form-section">
          <h2 className="form-section-title">💧 Care Schedules</h2>
          <div className="form-grid">
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
              <label>Fertilizing Every (days)</label>
              <input
                type="number" name="fertilizingIntervalDays" min="1" max="365"
                value={form.fertilizingIntervalDays} onChange={handleChange}
                placeholder="e.g. 30 (monthly)"
              />
            </div>
            <div className="form-group">
              <label>Last Fertilized Date</label>
              <input type="date" name="lastFertilizedDate" value={form.lastFertilizedDate} onChange={handleChange} />
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
              <div className="form-group">
                <label>Last Repotted Date</label>
                <input type="date" name="lastRepottedDate" value={form.lastRepottedDate} onChange={handleChange} />
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
