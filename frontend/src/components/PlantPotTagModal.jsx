import './PlantPotTagModal.css';

export default function PlantPotTagModal({ isOpen, plant, onClose }) {
  if (!isOpen || !plant) return null;

  const currentUrl = `${window.location.origin}/plants/${plant.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(currentUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop pot-tag-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog pot-tag-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">🏷️</span>
            <h3 className="modal-title">Printable Plant Pot Tag</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>

        <div className="modal-body pot-tag-modal-body">
          <p className="pot-tag-instructions">
            Print this tag, cut along the border, and stake it into your physical pot!
            Anyone can scan the QR code to open this plant's digital care dashboard directly.
          </p>

          {/* Printable Tag Area */}
          <div className="printable-tag" id="printable-plant-tag">
            <div className="tag-header">
              <span className="tag-brand">🌱 Virtual Plant Care</span>
              <span className="tag-type-badge">{plant.plantType}</span>
            </div>

            <div className="tag-body">
              <h2 className="tag-plant-name">{plant.name}</h2>
              <p className="tag-species">{plant.species}</p>
              <div className="tag-divider"></div>

              <div className="tag-specs-grid">
                <div className="tag-spec-item">
                  <span className="tag-spec-icon">💧</span>
                  <div>
                    <strong>Water</strong>
                    <span>Every {plant.wateringIntervalDays}d</span>
                  </div>
                </div>
                <div className="tag-spec-item">
                  <span className="tag-spec-icon">☀️</span>
                  <div>
                    <strong>Light</strong>
                    <span>{plant.sunlightRequirement}</span>
                  </div>
                </div>
                <div className="tag-spec-item">
                  <span className="tag-spec-icon">📍</span>
                  <div>
                    <strong>Location</strong>
                    <span>{plant.location}</span>
                  </div>
                </div>
                {plant.healthStatus && (
                  <div className="tag-spec-item">
                    <span className="tag-spec-icon">💚</span>
                    <div>
                      <strong>Health</strong>
                      <span>{plant.healthStatus}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="tag-qr-section">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${plant.name}`}
                  className="tag-qr-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="tag-qr-fallback" style={{ display: 'none' }}>
                  <p>QR Code</p>
                  <code>/plants/{plant.id}</code>
                </div>
                <span className="tag-qr-caption">📱 Scan for Care History & Status</span>
              </div>
            </div>

            <div className="tag-stake-point">
              <span>▼ Insert Stake into Pot ▼</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-primary" onClick={handlePrint}>
            🖨️ Print Pot Tag
          </button>
        </div>
      </div>
    </div>
  );
}

