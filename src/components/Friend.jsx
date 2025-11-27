import React from 'react'

export default function Friend({ name, status, message, profileImage, timestamp, onClick }) {
  return (
    <div 
      className="d-flex align-items-center gap-3 p-3 mb-3 rounded-3 position-relative"
      style={{ 
        background: "#010c28ff",
        border: "2px solid rgba(255, 255, 255, 0.25)",
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.background = 'rgba(1, 12, 40, 0.8)'
          e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.4)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.background = '#010c28ff'
          e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.25)'
        }
      }}
    >
      <img 
        src={profileImage || "/images/profile.png"} 
        alt={name} 
        className="rounded-circle" 
        style={{ width: 48, height: 48, objectFit: "cover" }}
      />
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div className="fw-bold text-white" style={{ fontSize: "1rem" }}>{name}</div>
          {timestamp && (
            <div className="text-light opacity-75 ms-2" style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
              {timestamp}
            </div>
          )}
        </div>
        {message ? (
          <div className="text-light opacity-75" style={{ fontSize: "0.875rem" }}>{message}</div>
        ) : (
          <div className="text-light opacity-75" style={{ fontSize: "0.875rem" }}>{status}</div>
        )}
      </div>
    </div>
  )
}

