// Utility to export plant care history and plant records to CSV

export function exportActivitiesToCsv(activities, filename = 'plant-care-history.csv') {
  if (!activities || activities.length === 0) {
    throw new Error('No care activities to export.');
  }

  const headers = ['Activity ID', 'Plant ID', 'Plant Name', 'Activity Type', 'Date', 'Notes'];
  const rows = activities.map(act => [
    act.id,
    act.plantId || '',
    `"${(act.plantName || '').replace(/"/g, '""')}"`,
    act.activityType,
    act.activityDate,
    `"${(act.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPlantsToCsv(plants, filename = 'my-plants-collection.csv') {
  if (!plants || plants.length === 0) {
    throw new Error('No plants to export.');
  }

  const headers = ['ID', 'Name', 'Species', 'Type', 'Location', 'Water Interval (Days)', 'Health', 'Last Watered', 'Next Water'];
  const rows = plants.map(p => [
    p.id,
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${(p.species || '').replace(/"/g, '""')}"`,
    p.plantType,
    `"${(p.location || '').replace(/"/g, '""')}"`,
    p.wateringIntervalDays,
    p.healthStatus || 'HEALTHY',
    p.lastWateredDate || '',
    p.nextWateringDate || '',
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

