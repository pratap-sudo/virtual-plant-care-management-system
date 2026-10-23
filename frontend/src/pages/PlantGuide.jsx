import { useNavigate } from 'react-router-dom';
import './PlantGuide.css';

const GUIDE_PLANTS = [
  {
    name: 'Money Plant',
    emoji: '🪴',
    imageUrl: 'https://images.unsplash.com/photo-1596724817791-9070b4c20b8f?w=600&auto=format&fit=crop&q=80',
    species: 'Epipremnum aureum',
    type: 'INDOOR',
    difficulty: 'Very Easy',
    sunlight: 'Low to Bright Indirect',
    wateringIntervalDays: 7,
    watering: 'Every 7–10 days (let top inch of soil dry out)',
    humidityPreference: 'Medium',
    potSize: 'Medium',
    repottingIntervalMonths: 12,
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
    imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80',
    species: 'Aloe barbadensis miller',
    type: 'INDOOR',
    difficulty: 'Easy',
    sunlight: 'Bright Indirect to Full Sun',
    wateringIntervalDays: 14,
    watering: 'Every 14–21 days (allow soil to fully dry between waterings)',
    humidityPreference: 'Low',
    potSize: 'Medium',
    repottingIntervalMonths: 24,
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
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=600&auto=format&fit=crop&q=80',
    species: 'Dracaena trifasciata',
    type: 'INDOOR',
    difficulty: 'Very Easy',
    sunlight: 'Low to Full Sun',
    wateringIntervalDays: 14,
    watering: 'Every 14–21 days (extremely drought tolerant)',
    humidityPreference: 'Low',
    potSize: 'Small',
    repottingIntervalMonths: 24,
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
    imageUrl: 'https://images.unsplash.com/photo-1572688484437-25826da81404?w=600&auto=format&fit=crop&q=80',
    species: 'Chlorophytum comosum',
    type: 'INDOOR',
    difficulty: 'Easy',
    sunlight: 'Medium to Bright Indirect',
    wateringIntervalDays: 6,
    watering: 'Every 5–7 days (keep soil evenly moist)',
    humidityPreference: 'Medium',
    potSize: 'Medium',
    repottingIntervalMonths: 12,
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
    imageUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?w=600&auto=format&fit=crop&q=80',
    species: 'Spathiphyllum wallisii',
    type: 'INDOOR',
    difficulty: 'Easy',
    sunlight: 'Low to Medium Indirect',
    wateringIntervalDays: 7,
    watering: 'Every 7 days (droops when thirsty — a good watering indicator)',
    humidityPreference: 'High',
    potSize: 'Medium',
    repottingIntervalMonths: 12,
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
  {
    name: 'English Lavender',
    emoji: '🪻',
    imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=600&auto=format&fit=crop&q=80',
    species: 'Lavandula angustifolia',
    type: 'OUTDOOR',
    difficulty: 'Medium',
    sunlight: 'Full Sun',
    wateringIntervalDays: 4,
    watering: 'Every 3–5 days in summer; sparingly in cool months',
    hardinessZone: 'Zone 5–9',
    isFrostTolerant: true,
    soilTypePreference: 'Well-drained sandy loam',
    pruningSeasonNote: 'Prune lightly in late summer after flowering',
    temperature: '10–28°C',
    tips: [
      'Requires at least 6–8 hours of direct sunshine daily.',
      'Excellent pollinator attractor for bees and butterflies.',
      'Never allow soggy root zone — ensure gravel/sand in the soil.',
      'Very drought tolerant once established.',
    ],
    note: 'Stunning fragrant outdoor perennial that resists winter frost.'
  }
];

const DIFFICULTY_COLORS = {
  'Very Easy': '#e8f5e9',
  'Easy': '#f1f8e9',
  'Medium': '#fff3e0',
  'Hard': '#ffebee',
};

export default function PlantGuide() {
  const navigate = useNavigate();

  const handleAddToGarden = (plant) => {
    navigate('/plants/new', {
      state: {
        prefill: {
          name: `My ${plant.name}`,
          species: plant.species,
          plantType: plant.type,
          location: plant.type === 'INDOOR' ? 'Living Room' : 'Balcony / Garden',
          wateringIntervalDays: plant.wateringIntervalDays,
          sunlightRequirement: plant.sunlight,
          imageUrl: plant.imageUrl,
          healthStatus: 'HEALTHY',
          fertilizingIntervalDays: 30,
          humidityPreference: plant.humidityPreference || '',
          potSize: plant.potSize || '',
          repottingIntervalMonths: plant.repottingIntervalMonths || '',
          hardinessZone: plant.hardinessZone || '',
          isFrostTolerant: plant.isFrostTolerant ?? '',
          soilTypePreference: plant.soilTypePreference || '',
          pruningSeasonNote: plant.pruningSeasonNote || '',
          generalNotes: plant.tips ? plant.tips.slice(0, 2).join(' ') : '',
        }
      }
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">📖 Plant Guide</h1>
          <p className="page-subtitle">Expert care profiles for houseplants & garden specimens</p>
        </div>
      </div>

      <div className="guide-disclaimer">
        ℹ️ <strong>Interactive Tip:</strong> Click <strong>"➕ Add to My Garden"</strong> on any profile below to immediately pre-fill and personalize a plant profile for your collection!
      </div>

      <div className="guide-grid">
        {GUIDE_PLANTS.map(plant => (
          <div key={plant.name} className="guide-card">
            <div className="guide-media-container">
              {plant.imageUrl ? (
                <img src={plant.imageUrl} alt={plant.name} className="guide-image" />
              ) : null}
              <div className="guide-card-header">
                <span className="guide-emoji">{plant.emoji}</span>
                <div>
                  <h2 className="guide-plant-name">{plant.name}</h2>
                  <p className="guide-species">{plant.species}</p>
                </div>
              </div>
            </div>

            <div className="guide-badges">
              <span className="guide-badge" style={{ background: DIFFICULTY_COLORS[plant.difficulty] }}>
                ⭐ {plant.difficulty}
              </span>
              <span className="guide-badge">
                {plant.type === 'INDOOR' ? '🏠 Indoor' : '🌳 Outdoor'}
              </span>
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
              {plant.humidityPreference && (
                <div className="guide-spec">
                  <span className="guide-spec-label">Humidity</span>
                  <span className="guide-spec-value">{plant.humidityPreference}</span>
                </div>
              )}
              {plant.hardinessZone && (
                <div className="guide-spec">
                  <span className="guide-spec-label">Hardiness</span>
                  <span className="guide-spec-value">{plant.hardinessZone}</span>
                </div>
              )}
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

            <button
              className="btn-add-guide"
              onClick={() => handleAddToGarden(plant)}
            >
              ➕ Add {plant.name} to My Garden
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
