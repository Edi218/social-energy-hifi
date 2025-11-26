import React from 'react'

export default function ActivityCard({ title, subtitle, cta = 'Open', onClick, children }) {
  return (
    <div 
      className="card mb-3 shadow-sm border-light-thin"
      style={{ 
        background: "#010c28ff",
        border: "2px solid rgba(148, 163, 184, 0.25)",
        borderRadius: "12px"
      }}
    >
      <div className="card-body">

        {/* Title */}
        <h5 className="card-title fw-semibold text-white">
          {title}
        </h5>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-light opacity-75 mb-2">
            {subtitle}
          </p>
        )}

        {/* ✔️ Children now render properly */}
        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}

        {/* CTA (currently unused but working if you re-enable) */}
        {/* 
        <button className="btn btn-success" onClick={onClick}>
          {cta}
        </button>
        */}
      </div>
    </div>
  )
}