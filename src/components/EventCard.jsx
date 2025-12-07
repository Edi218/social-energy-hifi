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
  tags = [], // NEW
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
        {/* TOP ROW: image + title + join button */}
        <div className="d-flex align-items-start justify-content-between mb-3">
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

            <div>
              <h5 className="text-white fw-semibold mb-1">{title}</h5>
              {/* TIME (small under title on mobile-ish card) */}
              <div className="d-flex align-items-center text-light opacity-75">
                <i className="bi bi-clock me-2" />
                <span style={{ fontSize: '0.9rem' }}>{timeLabel}</span>
              </div>
            </div>
          </div>

          {/* JOIN / JOINED BUTTON – Top right now */}
          <div className="ms-3">
            {isJoined ? (
              <button
                className="btn"
                disabled
                style={{
                  backgroundColor: '#6c757d',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.4rem 1.1rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'not-allowed',
                  opacity: 0.7,
                  whiteSpace: 'nowrap',
                }}
              >
                Joined
              </button>
            ) : (
              <button
                className="btn"
                style={{
                  backgroundColor: solidColor,
                  color: '#020617',
                  border: 'none',
                  padding: '0.4rem 1.1rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onClick={onJoin}
                onMouseEnter={(e) => {
                  e.target.style.filter = 'brightness(1.05)'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.filter = 'none'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                Join
              </button>
            )}
          </div>
        </div>

        {/* LOCATION */}
        <div className="d-flex align-items-center mb-2 text-light opacity-80">
          <i className="bi bi-geo-alt me-2" />
          <span>{location}</span>
        </div>

        {/* TAGS ROW */}
        {tags.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="badge"
                style={{
                  borderRadius: '999px',
                  border: `1px solid ${borderColor}`,
                  background:
                    'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.6))',
                  color: '#e5e7eb',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  textTransform: 'capitalize',
                  letterSpacing: '0.03em',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: solidColor,
                    marginRight: 6,
                    boxShadow: `0 0 4px ${solidColor}`,
                  }}
                />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ATTENDEES */}
        {attendees.length > 0 && (
          <div className="d-flex align-items-center mb-1 text-light opacity-90">
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
      </div>
    </div>
  )
}
