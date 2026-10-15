import './StatCard.css';

export default function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className={`stat-card stat-card--${color || 'green'}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <div className="stat-card-value">{value ?? '—'}</div>
        <div className="stat-card-label">{label}</div>
        {sub && <div className="stat-card-sub">{sub}</div>}
      </div>
    </div>
  );
}
