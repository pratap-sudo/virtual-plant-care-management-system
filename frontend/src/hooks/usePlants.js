import { useState, useEffect, useCallback } from 'react';
import { plantAPI } from '../services/api';

/**
 * Custom hook for fetching and managing plants list.
 * Encapsulates loading, error, and data state.
 */
export function usePlants(params = {}) {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await plantAPI.getAll(params);
      setPlants(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  return { plants, loading, error, refetch: fetchPlants };
}

/**
 * Custom hook for fetching a single plant by ID.
 */
export function usePlant(id) {
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlant = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await plantAPI.getById(id);
      setPlant(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlant();
  }, [fetchPlant]);

  return { plant, loading, error, refetch: fetchPlant };
}
