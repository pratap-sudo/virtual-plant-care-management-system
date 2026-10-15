import { useState } from 'react';
import { Link } from 'react-router-dom';
import { plantAPI } from '../services/api';
import { usePlants } from '../hooks/usePlants';
import PlantCard from '../components/PlantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import './MyPlants.css';

export default function MyPlants() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const params = {};
  if (search) params.search = search;
  if (typeFilter) params.type = typeFilter;

  const { plants, loading, error, refetch } = usePlants(params);

  const handleDelete = async (id) => {
    try {
      await plantAPI.delete(id);
      setSuccessMsg('Plant deleted successfully.');
      setErrorMsg('');
      refetch();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleWater = async (id) => {
    try {
      await plantAPI.water(id);
      setSuccessMsg('Watering recorded! 💧');
      setErrorMsg('');
      refetch();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🌿 My Plants</h1>
          <p className="page-subtitle">{plants.length} plant(s) in your collection</p>
        </div>
        <Link to="/plants/new" className="btn-primary">➕ Add Plant</Link>
      </div>

      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />
      {error && <Alert type="error" message={`Failed to load plants: ${error}`} />}

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search by plant name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="filter-input"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="INDOOR">🏠 Indoor</option>
          <option value="OUTDOOR">🌳 Outdoor</option>
        </select>
        {(search || typeFilter) && (
          <button onClick={() => { setSearch(''); setTypeFilter(''); }} className="filter-clear">
            ✕ Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading your plants..." />
      ) : plants.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="No plants found"
          message={search || typeFilter ? 'No plants match your search. Try clearing the filters.' : 'Your plant collection is empty. Add your first plant!'}
          action={<Link to="/plants/new" className="btn-primary">➕ Add Your First Plant</Link>}
        />
      ) : (
        <div className="plants-grid">
          {plants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onDelete={handleDelete}
              onWater={handleWater}
            />
          ))}
        </div>
      )}
    </div>
  );
}
