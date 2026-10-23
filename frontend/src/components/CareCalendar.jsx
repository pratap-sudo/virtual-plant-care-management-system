import { useState, useMemo } from 'react';
import './CareCalendar.css';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CareCalendar({ plants = [], onWater, onFertilize }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState(null); // { dateStr, events: [] }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Pre-calculate all scheduled tasks for each day in the month
  const eventsByDate = useMemo(() => {
    const map = {}; // 'YYYY-MM-DD' => [{ plant, type: 'WATER' | 'FERTILIZE', label }]

    // First and last date of the view
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    plants.forEach(plant => {
      // 1. Project watering dates
      const interval = plant.wateringIntervalDays;
      if (interval && interval > 0) {
        // Base starting point
        let baseWaterDate = plant.lastWateredDate ? new Date(plant.lastWateredDate) : new Date();
        baseWaterDate.setHours(0, 0, 0, 0);

        // Project forward up to end of this month
        let projected = new Date(baseWaterDate);
        // Jump to near current month if last watered was long ago
        while (projected < startDate) {
          projected.setDate(projected.getDate() + interval);
        }

        while (projected <= endDate) {
          const dateKey = projected.toISOString().split('T')[0];
          if (!map[dateKey]) map[dateKey] = [];
          map[dateKey].push({
            id: `water-${plant.id}-${dateKey}`,
            plant,
            type: 'WATER',
            label: `💧 Water ${plant.name}`,
          });
          projected.setDate(projected.getDate() + interval);
        }
      }

      // 2. Project fertilizing dates
      const fertInterval = plant.fertilizingIntervalDays;
      if (fertInterval && fertInterval > 0) {
        let baseFertDate = plant.lastFertilizedDate ? new Date(plant.lastFertilizedDate) : new Date();
        baseFertDate.setHours(0, 0, 0, 0);

        let projected = new Date(baseFertDate);
        while (projected < startDate) {
          projected.setDate(projected.getDate() + fertInterval);
        }

        while (projected <= endDate) {
          const dateKey = projected.toISOString().split('T')[0];
          if (!map[dateKey]) map[dateKey] = [];
          map[dateKey].push({
            id: `fert-${plant.id}-${dateKey}`,
            plant,
            type: 'FERTILIZE',
            label: `🌿 Feed ${plant.name}`,
          });
          projected.setDate(projected.getDate() + fertInterval);
        }
      }
    });

    return map;
  }, [plants, year, month]);

  // Generate days array for calendar grid
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
    const adjustedFirstDay = (firstDayIndex + 6) % 7; // Convert to 0=Mon, 6=Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Padding from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push({
        dayNumber: prevMonthDays - i,
        isCurrentMonth: false,
        dateKey: null,
      });
    }

    // Days in current month
    const todayStr = new Date().toISOString().split('T')[0];
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateKey = dateObj.toISOString().split('T')[0];
      days.push({
        dayNumber: day,
        isCurrentMonth: true,
        dateKey,
        isToday: dateKey === todayStr,
        events: eventsByDate[dateKey] || [],
      });
    }

    // Padding for next month
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        dateKey: null,
      });
    }

    return days;
  }, [year, month, eventsByDate]);

  const handleCellClick = (day) => {
    if (!day.isCurrentMonth || !day.events || day.events.length === 0) return;
    setSelectedDayEvents({
      dateStr: day.dateKey,
      events: day.events,
    });
  };

  return (
    <div className="care-calendar-container">
      {/* Calendar Header Controls */}
      <div className="calendar-controls">
        <h2 className="calendar-month-title">📅 {monthName}</h2>
        <div className="calendar-nav-buttons">
          <button className="calendar-btn" onClick={handlePrevMonth} title="Previous Month">◀</button>
          <button className="calendar-btn calendar-btn--today" onClick={handleToday}>Today</button>
          <button className="calendar-btn" onClick={handleNextMonth} title="Next Month">▶</button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="calendar-grid-header">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="calendar-grid">
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className={`calendar-cell ${!day.isCurrentMonth ? 'calendar-cell--disabled' : ''} ${day.isToday ? 'calendar-cell--today' : ''} ${day.events?.length ? 'calendar-cell--has-events' : ''}`}
            onClick={() => handleCellClick(day)}
          >
            <div className="calendar-cell-top">
              <span className="calendar-day-number">{day.dayNumber}</span>
              {day.events?.length > 0 && (
                <span className="calendar-event-count">{day.events.length}</span>
              )}
            </div>

            <div className="calendar-events-list">
              {day.events?.slice(0, 3).map(ev => (
                <span
                  key={ev.id}
                  className={`calendar-event-pill pill--${ev.type.toLowerCase()}`}
                  title={ev.label}
                >
                  {ev.label}
                </span>
              ))}
              {day.events?.length > 3 && (
                <span className="calendar-more-pill">+{day.events.length - 3} more</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Day Event Drawer / Popup */}
      {selectedDayEvents && (
        <div className="calendar-modal-backdrop" onClick={() => setSelectedDayEvents(null)}>
          <div className="calendar-modal" onClick={e => e.stopPropagation()}>
            <div className="calendar-modal-header">
              <h3>Care Scheduled for {new Date(selectedDayEvents.dateStr).toLocaleDateString()}</h3>
              <button className="calendar-modal-close" onClick={() => setSelectedDayEvents(null)}>✕</button>
            </div>
            <div className="calendar-modal-body">
              {selectedDayEvents.events.map(ev => (
                <div key={ev.id} className="calendar-modal-item">
                  <div className="modal-item-info">
                    <strong>{ev.label}</strong>
                    <span>{ev.plant.species} · 📍 {ev.plant.location}</span>
                  </div>
                  <div className="modal-item-actions">
                    {ev.type === 'WATER' && (
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => {
                          onWater(ev.plant);
                          setSelectedDayEvents(null);
                        }}
                      >
                        💧 Water Now
                      </button>
                    )}
                    {ev.type === 'FERTILIZE' && (
                      <button
                        className="btn-primary btn-sm"
                        style={{ background: '#16a34a' }}
                        onClick={() => {
                          onFertilize(ev.plant);
                          setSelectedDayEvents(null);
                        }}
                      >
                        🌿 Feed Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

