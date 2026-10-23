import { useState } from 'react';
import { Link } from 'react-router-dom';
import { plantAPI } from '../services/api';
import { usePlants } from '../hooks/usePlants';
import { useToast } from '../context/ToastContext';
import { exportPlantsToCsv } from '../utils/exportCsv';
import PlantCard from '../components/PlantCard';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './MyPlants.css';

export default function MyPlants() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const params = {};
  if (search) params.search = search;
  if (typeFilter) params.type = typeFilter;

  const { plants, loading, error, refetch } = usePlants(params);

  const handleDeleteRequest = (plant) => {
    setPlantToDelete(plant);
  };

  const handleConfirmDelete = async () => {
    if (!plantToDelete) return;
    setIsDeleting(true);
    try {
      await plantAPI.delete(plantToDelete.id);
      toast.success(`"${plantToDelete.name}" deleted successfully.`);
      setPlantToDelete(null);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete plant');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWater = async (id) => {
    try {
      await plantAPI.water(id);
      const wateredPlant = plants.find(p => p.id === id);
      toast.success(wateredPlant ? `Watered "${wateredPlant.name}"! 💧` : 'Watering recorded! 💧');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to record watering');
    }
  };

  const handleExport = () => {
    if (plants.length === 0) {
      toast.info('No plants in collection to export.');
      return;
    }
    exportPlantsToCsv(plants, `plant-collection-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${plants.length} plant(s) to CSV! 📥`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🌿 My Plants</h1>
          <p className="page-subtitle">{plants.length} plant(s) in your collection</p>
        </div>
        <div className="myplants-header-actions">
          {plants.length > 0 && (
            <button className="btn-secondary" onClick={handleExport} title="Export collection to CSV">
              📥 Export CSV
            </button>
          )}
          <Link to="/plants/new" className="btn-primary">➕ Add Plant</Link>
        </div>
      </div>

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
      ) : error ? (
        <EmptyState
          icon="⚠️"
          title="Failed to load plants"
          message={error}
          action={<button className="btn-secondary" onClick={refetch}>🔄 Try Again</button>}
        />
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
              onDelete={handleDeleteRequest}
              onWater={handleWater}
            />
          ))}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(plantToDelete)}
        title="Delete Plant"
        message={`Are you sure you want to delete "${plantToDelete?.name}"? All associated care history, milestones, and reminders will be permanently removed.`}
        confirmText="Delete Plant"
        isDanger={true}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPlantToDelete(null)}
      />
    </div>
  );
}
