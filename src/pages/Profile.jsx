import React from 'react'
import ActivityCard from '../components/ActivityCard.jsx'

export default function Profile() {
  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 border border-secondary-subtle bg-black">
        <div className="rounded-circle bg-secondary" style={{width:64,height:64}} />
        <div>
          <div className="h4 mb-0">You</div>
          <div className="text-secondary">Computer Science • 3rd Year</div>
        </div>
      </div>

      <div className="d-grid gap-3">
        <button className="btn btn-outline-light">
          <i className="bi bi-calendar3 me-2"></i> View My Calendar
        </button>
        <button className="btn btn-success">+ Create New Activity</button>
      </div>

      <hr className="border-secondary my-4"/>

      <h5 className="mb-3">Enrolled Activities</h5>
      <ActivityCard title="No events yet" subtitle="Browse and enroll to see them here" cta="Explore" />

      <h5 className="mt-4 mb-3">Your Friends</h5>
      <ActivityCard title="6 friends" subtitle="See who’s free this week" cta="Open friends" />
    </div>
  )
}