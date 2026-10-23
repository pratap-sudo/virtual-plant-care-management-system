import './PlantGuide.css';

const GUIDE_PLANTS = [
  {
    name: 'Money Plant',
    emoji: '🪴',
    species: 'Epipremnum aureum',
    type: 'Indoor',
    difficulty: 'Very Easy',
    sunlight: 'Low to Bright Indirect',
    watering: 'Every 7–10 days (let top inch of soil dry out)',
    humidity: 'Medium to High',
    temperature: '15–30°C',
    tips: [
      'Thrives in most indoor conditions — great for beginners.',
      'Can tolerate low light, but grows faster in bright indirect light.',
      'Toxic to pets — keep out of reach of cats and dogs.',
      'Wipe leaves monthly to keep them dust-free.',
      'Avoid overwatering — root rot is the most common issue.',
    ],
    note: 'Water requirements depend on pot size, season, and indoor conditions.'
  },
  {
    name: 'Aloe Vera',
    emoji: '🌵',
    species: 'Aloe barbadensis miller',
    type: 'Indoor',
    difficulty: 'Easy',
    sunlight: 'Bright Indirect to Full Sun',
    watering: 'Every 14–21 days (allow soil to fully dry between waterings)',
    humidity: 'Low',
    temperature: '13–27°C',
    tips: [
      'Use well-draining cactus or succulent soil.',
      'Never let the plant sit in standing water.',
      'The gel inside leaves has soothing properties for minor burns.',
      'Repot when roots outgrow the container.',
      'Goes dormant in winter — water even less during this period.',
    ],
    note: 'One of the most drought-tolerant houseplants available.'
  },
  {
    name: 'Snake Plant',
    emoji: '🌿',
    species: 'Dracaena trifasciata',
    type: 'Indoor',
    difficulty: 'Very Easy',
    sunlight: 'Low to Full Sun',
    watering: 'Every 14–21 days (extremely drought tolerant)',
    humidity: 'Low to Medium',
    temperature: '15–29°C',
    tips: [
      'One of the most forgiving houseplants — nearly impossible to kill.',
      'Survives in low light, though it grows faster in brighter conditions.',
      'Do not overwater — this is the primary cause of death for snake plants.',
      'Excellent air purifier according to NASA studies.',
      'Toxic to pets — keep away from animals.',
    ],
    note: 'Perfect for college dorms, offices, and beginners.'
  },
  {
    name: 'Spider Plant',
    emoji: '🕷️',
    species: 'Chlorophytum comosum',
    type: 'Indoor',
    difficulty: 'Easy',
    sunlight: 'Medium to Bright Indirect',
    watering: 'Every 5–7 days (keep soil evenly moist)',
    humidity: 'Medium to High',
    temperature: '15–25°C',
    tips: [
      'Produces "baby" spider plants (spiderettes) that can be propagated.',
      'Non-toxic to pets and children.',
      'Tolerates some direct morning sun.',
      'Water less in winter.',
      'Great hanging basket plant.',
    ],
    note: 'Easy to propagate — ideal for sharing with friends and classmates.'
  },
  {
    name: 'Peace Lily',
    emoji: '🌸',
    species: 'Spathiphyllum wallisii',
    type: 'Indoor',
    difficulty: 'Easy',
    sunlight: 'Low to Medium Indirect',
    watering: 'Every 7 days (droops when thirsty — a good watering indicator)',
    humidity: 'High',
    temperature: '18–27°C',
    tips: [
      'Will visibly droop when it needs water — a reliable indicator.',
      'Avoid cold drafts and temperatures below 10°C.',
      'Toxic to pets and children — handle with care.',
      'Blooms in spring and sometimes in autumn.',
      'Prefers humidity — mist leaves or place near a humidifier.',
    ],
    note: 'The drooping behavior makes it easy to know when to water.'
  },
];

const DIFFICULTY_COLORS = {
  'Very Easy': '#e8f5e9',
  'Easy': '#f1f8e9',
  'Medium': '#fff3e0',
  'Hard': '#ffebee',
};

export default function PlantGuide() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📖 Plant Guide</h1>
        <p className="page-subtitle">Care profiles for common houseplants</p>
      </div>

      <div className="guide-disclaimer">
        ℹ️ <strong>Note:</strong> The watering intervals shown here are general guidelines.
        Actual water needs depend on your pot, soil, climate, season, and sunlight.
        Always check the soil before watering.
      </div>

      <div className="guide-grid">
        {GUIDE_PLANTS.map(plant => (
          <div key={plant.name} className="guide-card">
            <div className="guide-card-header">
              <span className="guide-emoji">{plant.emoji}</span>
              <div>
                <h2 className="guide-plant-name">{plant.name}</h2>
                <p className="guide-species">{plant.species}</p>
              </div>
            </div>

            <div className="guide-badges">
              <span className="guide-badge" style={{background: DIFFICULTY_COLORS[plant.difficulty]}}>
                ⭐ {plant.difficulty}
              </span>
              <span className="guide-badge">🏠 {plant.type}</span>
            </div>

            <div className="guide-specs">
              <div className="guide-spec">
                <span className="guide-spec-label">Sunlight</span>
                <span className="guide-spec-value">{plant.sunlight}</span>
              </div>
              <div className="guide-spec">
                <span className="guide-spec-label">Watering</span>
                <span className="guide-spec-value">{plant.watering}</span>
              </div>
              <div className="guide-spec">
                <span className="guide-spec-label">Humidity</span>
                <span className="guide-spec-value">{plant.humidity}</span>
              </div>
              <div className="guide-spec">
                <span className="guide-spec-label">Temperature</span>
                <span className="guide-spec-value">{plant.temperature}</span>
              </div>
            </div>

            <div className="guide-tips">
              <h3 className="guide-tips-title">💡 Care Tips</h3>
              <ul>
                {plant.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>

            <div className="guide-note">
              📌 {plant.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

