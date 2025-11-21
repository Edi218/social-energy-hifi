import React from 'react'

export default function ActivityCard({ title, subtitle, cta='Open', onClick }) {
  return (
    <div className="card mb-3 shadow-sm border-light-thin" style={{ background: "#010c28ff" }}>
      <div className="card-body">
        <h5 className="card-title fw-semibold text-white">{title}</h5>
        {subtitle && <p className="text-light opacity-75">{subtitle}</p>}
        {/*<button className="btn btn-success" onClick={onClick}>{cta}</button>*/} 
      </div>
    </div>
  )
}