import React from 'react'
import ActivityCard from '../components/ActivityCard.jsx'
import { useNavigate } from "react-router-dom"; 



export default function Profile() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 border border-secondary-subtle bg-black">
        <img src="/images/profile.png" alt="Profile" className="rounded-circle" style={{ width: 64, height: 64, objectFit: "cover" }}/>
        <div>
          <div className="h4 mb-0">You</div>
          <div className="text-secondary">Computer Science • 3rd Year</div>
        </div>
      </div>

      <div className="d-grid gap-3">
        <button className="btn btn-outline-light" onClick={() => navigate("/calendar")}>
          <i className="bi bi-calendar3 me-2"></i> View My Calendar
        </button>
        <button className="btn btn-success">+ Create New Activity</button>
      </div>

      <hr className="border-secondary my-4"/>

      <div className="d-flex justify-content-between align-items-center mb-3" style={{ cursor: "pointer" }}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-card-checklist text-primary" style={{ fontSize: "22px" }}></i>
          <h5 className="mb-0">Enrolled Activities</h5>
        </div>
        {/*<i className="bi bi-chevron-right text-light opacity-75" style={{ fontSize: "20px" }}></i>*/}
      </div>

      <ActivityCard title="No events yet" subtitle="Placeholder for enrolled events" />

      <hr className="border-secondary my-4"/>

      <div className="d-flex justify-content-between align-items-center mb-3" style={{ cursor: "pointer" }} onClick={() => navigate("/friends")}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-people-fill text-success" style={{ fontSize: "20px" }}></i>
          <h5 className="mb-0">Your Friends</h5>
        </div>
        <i className="bi bi-chevron-right text-light opacity-75" style={{ fontSize: "20px" }}></i>
      </div>

      <ActivityCard title="6 friends" subtitle="Placeholder for available friends" />
    </div>
  )
}