import React from 'react'

export default function EventCard({
  title,
  timeLabel,
  location,
  attendees = [],
  image,
  onJoin,
  isJoined = false,
  borderColor = 'rgba(34,197,94,0.35)',
}) {
  const preview = attendees.slice(0, 3)
  const extraCount = attendees.length - preview.length

  // Turn the transparent border color into a solid version
  const solidColor = borderColor.replace(
    /rgba?\(([^,]+),([^,]+),([^,]+).*\)/,
    (m, r, g, b) => `rgba(${r},${g},${b},1)`
  )

  return (
    <div
      className="card mb-4 event-card"
      style={{
        backgroundColor: '#020617',
        borderRadius: '18px',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
      }}
    >
      <div className="card-body">
        {/* TOP ROW */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">

            {/* EVENT IMAGE */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                flexShrink: 0,
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt={title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: '100%', opacity: 0.3 }}
                >
                  <i className="bi bi-image" style={{ fontSize: '1.4rem' }} />
                </div>
              )}
            </div>

            <h5 className="text-white fw-semibold mb-0">{title}</h5>
          </div>
        </div>

        {/* TIME */}
        <div className="d-flex align-items-center mb-2 text-light opacity-80">
          <i className="bi bi-clock me-2" />
          <span>{timeLabel}</span>
        </div>

        {/* LOCATION */}
        <div className="d-flex align-items-center mb-3 text-light opacity-80">
          <i className="bi bi-geo-alt me-2" />
          <span>{location}</span>
        </div>

        {/* ATTENDEES */}
        {attendees.length > 0 && (
          <div className="d-flex align-items-center mb-3 text-light opacity-90">
            <i className="bi bi-people-fill me-2" />

            <div className="d-flex align-items-center">
              {preview.map((name, idx) => (
                <div
                  key={name + idx}
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: solidColor,   
                    color: '#020617',
                    fontWeight: 600,
                    marginLeft: idx === 0 ? 0 : -12,
                    border: '2px solid #020617',
                  }}
                >
                  {name[0]}
                </div>
              ))}

              <span className="ms-3" style={{ fontSize: '0.9rem' }}>
                {preview.join(', ')}
                {extraCount > 0 && ` +${extraCount}`}
              </span>
            </div>
          </div>
        )}

        {/* JOIN/JOINED BUTTON - Bottom Right */}
        <div className="d-flex justify-content-end">
          {isJoined ? (
            <button
              className="btn"
              disabled
              style={{
                backgroundColor: '#6c757d',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'not-allowed',
                opacity: 0.7,
              }}
            >
              Joined
            </button>
          ) : (
            <button
              className="btn"
              style={{
                backgroundColor: '#28a745',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
              }}
              onClick={onJoin}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#218838';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#28a745';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
