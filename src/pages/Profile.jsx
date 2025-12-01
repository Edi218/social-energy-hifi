import React, { useState, useEffect } from 'react'
import ActivityCard from '../components/ActivityCard.jsx'
import { useNavigate } from "react-router-dom";
import { getEnrolledEvents, removeEnrolledEvent } from "../utils/eventManager.js"; 

export default function Profile() {
  const friends = [
    { name: 'Elynn Lee', status: 'Available', timestamp: '13:04', profileImage: '/images/female.png' },
    { name: 'Oscar Dum', status: 'Busy', timestamp: '12:39', profileImage: '/images/profile.png' },
    { name: 'Carlo Emilion', message: 'Come join the football event tonight with me!', timestamp: '10:34', profileImage: '/images/profile.png' },
    { name: 'Daniel Jay Park', status: 'Do Not Disturb', timestamp: '00:13', profileImage: '/images/profile.png' },
    { name: 'Liam Cortez', status: 'Available', timestamp: 'Yesterday', profileImage: '/images/profile.png' },
    { name: 'Sophia Nguyen', status: 'Busy', timestamp: 'Yesterday', profileImage: '/images/female.png' },
    { name: 'Ethan Morales', message: 'On Campus right now. Let\'s hang out!', timestamp: 'Yesterday', profileImage: '/images/profile.png' },
    { name: 'Ava Becker', status: 'Available', timestamp: 'Yesterday', profileImage: '/images/female.png' },
    { name: 'Noah Tanaka', status: 'Busy', timestamp: '2 days ago', profileImage: '/images/profile.png' },
    { name: 'Chloe Ricci', status: 'Available', timestamp: '2 days ago', profileImage: '/images/female.png' },
    { name: 'Mateo Alvarez', status: 'Available', timestamp: '3 days ago', profileImage: '/images/profile.png' },
    { name: 'Lucas Hwang', status: 'Available', timestamp: '1 week ago', profileImage: '/images/profile.png' },
    { name: 'Isabella Fontaine', status: 'Available', timestamp: '1 week ago', profileImage: '/images/female.png' },
  ]

  const availableFriends = friends.filter(f => f.status === "Available");
  const availableFriendsNum = friends.filter(f => f.status === "Available").length;
  const preview = availableFriends.slice(0, 3);  // first 3 profile pictures
  const extraCount = availableFriends.length - preview.length;

  const navigate = useNavigate()

  // ----- NEW STATE -----
  const [status, setStatus] = useState(() => {
    // run only on first mount
    const saved = window.localStorage.getItem('se_profile_status')
    return saved || 'Available'
  })
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customStatus, setCustomStatus] = useState('')

  useEffect(() => {
    window.localStorage.setItem('se_profile_status', status)
  }, [status])

  const [energyLevel, setEnergyLevel] = useState(() => {
    const saved = window.localStorage.getItem('se_energy_level')
    return saved ? parseInt(saved, 10) : null
  })

  const [enrolledEvents, setEnrolledEvents] = useState([])

  useEffect(() => {
    const loadEvents = () => {
      setEnrolledEvents(getEnrolledEvents());
    };
    loadEvents();
    // Listen for events updates
    window.addEventListener('eventsUpdated', loadEvents);
    return () => window.removeEventListener('eventsUpdated', loadEvents);
  }, []);

  const getMoodEmoji = (level) => {
    const moods = {
      1: '😴',
      2: '😑',
      3: '😊',
      4: '😁',
      5: '🤩',
    }
    return moods[level] || '😊'
  }

  const getLevelLabel = (level) => {
    const labels = {
      1: 'Very Low',
      2: 'Low',
      3: 'Medium',
      4: 'High',
      5: 'Very High',
    }
    return labels[level] || ''
  }

  const toggleStatusMenu = () => {
    setShowStatusMenu((prev) => !prev)
  }

  const chooseStatus = (value) => {
    setStatus(value)
    setShowStatusMenu(false)
  }

  const chooseCustom = () => {
    setShowStatusMenu(false)
    setShowCustomModal(true)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const trimmed = customStatus.trim()
    if (!trimmed) return
    setStatus(trimmed)
    setCustomStatus('')
    setShowCustomModal(false)
  }

  const handleCustomCancel = () => {
    setCustomStatus('')
    setShowCustomModal(false)
  }

  return (
    <>
      <div>
        {/* PROFILE HEADER */}
        <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 border border-secondary-subtle bg-black position-relative">
          <img
            src="/images/profile.png"
            alt="Profile"
            className="rounded-circle"
            style={{ width: 64, height: 64, objectFit: "cover" }}
          />
          <div>
            <div className="h4 mb-1">You</div>

            {/* clickable status pill */}
            <button
              type="button"
              onClick={toggleStatusMenu}
              className="btn btn-sm px-3 py-1 rounded-pill"
              style={{
                backgroundColor: "#111827",
                border: "1px solid rgba(248, 250, 252, 0.25)",
                color: "#e5e7eb",
                fontSize: "0.85rem",
              }}
            >
              {status}
              <i className="bi bi-chevron-down ms-2"></i>
            </button>

            {energyLevel && (
              <div
                className="position-absolute"
                style={{
                  top: "1.2rem",            // move down slightly
                  right: "0.75rem",          // move inward slightly
                  backgroundColor: "#111827",
                  border: "1px solid rgba(148, 163, 184, 0.4)",
                  color: "#e5e7eb",
                  padding: "0.25rem 0.6rem", // smaller pill
                  borderRadius: "999px",
                  fontSize: "0.8rem",        // smaller text
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span style={{ fontSize: "1.1rem", lineHeight: "1" }}>
                  {getMoodEmoji(energyLevel)}
                </span>
                
              </div>
            )}

            {/* small subtext if you still want it */}
            {/* <div className="text-secondary mt-1" style={{ fontSize: "0.8rem" }}>
              Computer Science • 3rd Year
            </div> */}
          </div>

          {/* DROPDOWN PANEL */}
          {showStatusMenu && (
            <div
              className="position-absolute"
              style={{
                top: "100%",
                left: 16,
                marginTop: "0.5rem",
                zIndex: 20,
              }}
            >
              <div
                className="card bg-dark border border-secondary"
                style={{ minWidth: "220px" }}
              >
                <button
                  className="btn btn-dark text-start border-0 w-100"
                  onClick={() => chooseStatus("Available")}
                >
                  <span className="text-success me-2">●</span> Available
                </button>
                <button
                  className="btn btn-dark text-start border-0 w-100"
                  onClick={() => chooseStatus("Busy")}
                >
                  <span className="text-warning me-2">●</span> Busy
                </button>
                <button
                  className="btn btn-dark text-start border-0 w-100"
                  onClick={() => chooseStatus("Do Not Disturb")}
                >
                  <span className="text-danger me-2">●</span> Do Not Disturb
                </button>
                <hr className="my-1 border-secondary" />
                <button
                  className="btn btn-dark text-start border-0 w-100"
                  onClick={chooseCustom}
                >
                  <i className="bi bi-pencil me-2"></i> Custom…
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="d-grid gap-3">
          <button
            className="btn btn-outline-light"
            onClick={() => navigate('/home/calendar')}
          >
            <i className="bi bi-calendar3 me-2"></i> View My Calendar
          </button>
          <button
            className="btn btn-outline-light"
            onClick={() => navigate('/')}
            style={{
              backgroundColor: "#0e3b85ff",
              color: "#f8fafc",
              transition: "0.2s",
              borderColor: "rgba(247, 232, 126, 0.15)"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1e62d0ff"
              e.target.style.borderColor = "#facc15";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#0e3b85ff"
              e.target.style.borderColor = "rgba(247, 232, 126, 0.15)"
            }}
          >
            <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
            Adjust Social Energy
          </button>
          <button className="btn btn-success">+ Create New Activity</button>
        </div>

        <hr className="border-secondary my-4" />

        <div
          className="d-flex justify-content-between align-items-center mb-3"
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center gap-2">
            <i
              className="bi bi-card-checklist text-primary"
              style={{ fontSize: "22px" }}
            ></i>
            <h5 className="mb-0">Enrolled Activities</h5>
          </div>
        </div>

        {enrolledEvents.length === 0 ? (
          <ActivityCard
            title="No events yet"
            subtitle="Join events from the home page to see them here"
          />
        ) : (
          enrolledEvents.map((event, idx) => (
            <ActivityCard
              key={idx}
              title={event.title}
              subtitle={`${event.timeLabel} • ${event.location}`}
            >
              {event.attendees && event.attendees.length > 0 && (
                <div className="d-flex align-items-center mt-2 mb-3">
                  <i className="bi bi-people-fill me-2 text-secondary"></i>
                  <span className="text-light opacity-75" style={{ fontSize: "0.85rem" }}>
                    {event.attendees.join(', ')}
                  </span>
                </div>
              )}
              {/* Leave Button - Bottom Right inside card */}
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn"
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => {
                    removeEnrolledEvent(event.title, event.timeLabel);
                    window.dispatchEvent(new Event('eventsUpdated'));
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#c82333';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#dc3545';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Leave
                </button>
              </div>
            </ActivityCard>
          ))
        )}

        <hr className="border-secondary my-4" />

        <div
          className="d-flex justify-content-between align-items-center mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home/friends")}
        >
          <div className="d-flex align-items-center gap-2">
            <i
              className="bi bi-people-fill text-success"
              style={{ fontSize: "20px" }}
            ></i>
            <h5 className="mb-0">Your Friends</h5>
          </div>
          <i
            className="bi bi-chevron-right text-light opacity-75"
            style={{ fontSize: "20px" }}
          ></i>
        </div>

        <ActivityCard
          title={`${friends.length} friends`}
          subtitle={`${availableFriends.length} friends available right now`}
        >
          {/* AVAILABLE FRIENDS PREVIEW */}
          <div className="d-flex align-items-center mt-2">
            {/* Overlapping profile pics */}
            {preview.map((f, i) => (
              <img
                key={i}
                src={f.profileImage}
                alt={f.name}
                className="rounded-circle"
                style={{
                  width: "36px",
                  height: "36px",
                  objectFit: "cover",
                  border: "2px solid #0d1117",
                  marginLeft: i === 0 ? "0" : "-12px",
                  zIndex: 10 - i,
                }}
              />
            ))}

            {/* Text next to them */}
            <span className="text-light ms-3" style={{ fontSize: "0.9rem" }}>
              {availableFriends.length === 0
                ? "No friends available right now"
                : availableFriends.length === 1
                  ? `${availableFriends[0].name} is available now`
                  : `${availableFriends[0].name} and ${
                      extraCount > 0 ? extraCount + " others" : "1 other"
                    } are available now`}
            </span>
          </div>
        </ActivityCard>
      </div>

      {/* CUSTOM STATUS MODAL */}
      {showCustomModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 1050 }}
          onClick={handleCustomCancel}
        >
          <div
            className="card bg-dark border border-secondary"
            style={{ width: "90%", maxWidth: "380px" }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="card-body">
              <h5 className="card-title text-white mb-3">Set Custom Status</h5>
              <form onSubmit={handleCustomSubmit}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="e.g., Studying at ETH library 📚"
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  maxLength={80}
                />
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCustomCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}




