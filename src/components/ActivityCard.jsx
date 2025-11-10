import React from 'react'

export default function ActivityCard({ title, subtitle, cta='Open', onClick }) {
  return (
    <div className="card bg-secondary-subtle mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        {subtitle && <p className="card-text text-body-secondary">{subtitle}</p>}
        <button className="btn btn-success" onClick={onClick}>{cta}</button>
      </div>
    </div>
  )
}