import React, { useState, useEffect } from "react";
import ActivityCard from "../components/ActivityCard.jsx";
import { useNavigate } from "react-router-dom";
import {
  getEnrolledEvents,
  removeEnrolledEvent,
  addEnrolledEvent,
} from "../utils/eventManager.js";

// ---------- STATIC OPTIONS FOR NEW ACTIVITY ----------

const DAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TIME_OPTIONS = (() => {
  // 8:00 AM → 12:00 AM (midnight) in 30-min steps
  const slots = [];
  let hour = 8;
  let minute = 0;

  while (true) {
    const isMidnight = hour === 24 && minute === 0;
    const hourForDisplay = isMidnight ? 0 : hour;

    const ampm = hourForDisplay >= 12 ? "PM" : "AM";
    let displayHour = hourForDisplay % 12;
    if (displayHour === 0) displayHour = 12;
    const displayMin = minute.toString().padStart(2, "0");

    slots.push(`${displayHour}:${displayMin} ${ampm}`);

    if (isMidnight) break;

    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
    if (hour > 24) break; // safety
  }

  return slots;
})();

// -----------------------------------------------------

export default function Profile() {
  const friends = [
    {
      name: "Elynn Lee",
      status: "Available",
      timestamp: "13:04",
      profileImage: "/images/female.png",
    },
    {
      name: "Oscar Dum",
      status: "Busy",
      timestamp: "12:39",
      profileImage: "/images/profile.png",
    },
    {
      name: "Carlo Emilion",
      message: "Come join the football event tonight with me!",
      timestamp: "10:34",
      profileImage: "/images/profile.png",
    },
    {
      name: "Daniel Jay Park",
      status: "Do Not Disturb",
      timestamp: "00:13",
      profileImage: "/images/profile.png",
    },
    {
      name: "Liam Cortez",
      status: "Available",
      timestamp: "Yesterday",
      profileImage: "/images/profile.png",
    },
    {
      name: "Sophia Nguyen",
      status: "Busy",
      timestamp: "Yesterday",
      profileImage: "/images/female.png",
    },
    {
      name: "Ethan Morales",
      message: "On Campus right now. Let's hang out!",
      timestamp: "Yesterday",
      profileImage: "/images/profile.png",
    },
    {
      name: "Ava Becker",
      status: "Available",
      timestamp: "Yesterday",
      profileImage: "/images/female.png",
    },
    {
      name: "Noah Tanaka",
      status: "Busy",
      timestamp: "2 days ago",
      profileImage: "/images/profile.png",
    },
    {
      name: "Chloe Ricci",
      status: "Available",
      timestamp: "2 days ago",
      profileImage: "/images/female.png",
    },
    {
      name: "Mateo Alvarez",
      status: "Available",
      timestamp: "3 days ago",
      profileImage: "/images/profile.png",
    },
    {
      name: "Lucas Hwang",
      status: "Available",
      timestamp: "1 week ago",
      profileImage: "/images/profile.png",
    },
    {
      name: "Isabella Fontaine",
      status: "Available",
      timestamp: "1 week ago",
      profileImage: "/images/female.png",
    },
  ];

  const availableFriends = friends.filter((f) => f.status === "Available");
  const availableFriendsNum = availableFriends.length;
  const preview = availableFriends.slice(0, 3);
  const extraCount = availableFriendsNum - preview.length;

  const navigate = useNavigate();

  // ----- PROFILE STATUS STATE -----
  const [status, setStatus] = useState(() => {
    const saved = window.localStorage.getItem("se_profile_status");
    return saved || "Available";
  });
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStatus, setCustomStatus] = useState("");

  useEffect(() => {
    window.localStorage.setItem("se_profile_status", status);
  }, [status]);

  // energy pill
  const [energyLevel, setEnergyLevel] = useState(() => {
    const saved = window.localStorage.getItem("se_energy_level");
    return saved ? parseInt(saved, 10) : null;
  });

  const [enrolledEvents, setEnrolledEvents] = useState([]);

  useEffect(() => {
    const loadEvents = () => {
      setEnrolledEvents(getEnrolledEvents());
    };
    loadEvents();
    window.addEventListener("eventsUpdated", loadEvents);
    return () => window.removeEventListener("eventsUpdated", loadEvents);
  }, []);

  const getMoodEmoji = (level) => {
    const moods = {
      1: "😴",
      2: "😑",
      3: "😊",
      4: "😁",
      5: "🤩",
    };
    return moods[level] || "😊";
  };

  // ----- STATUS HANDLERS -----
  const toggleStatusMenu = () => {
    setShowStatusMenu((prev) => !prev);
  };

  const chooseStatus = (value) => {
    setStatus(value);
    setShowStatusMenu(false);
  };

  const chooseCustom = () => {
    setShowStatusMenu(false);
    setShowCustomModal(true);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const trimmed = customStatus.trim();
    if (!trimmed) return;
    setStatus(trimmed);
    setCustomStatus("");
    setShowCustomModal(false);
  };

  const handleCustomCancel = () => {
    setCustomStatus("");
    setShowCustomModal(false);
  };

  // ----- CREATE NEW ACTIVITY STATE -----
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newShort, setNewShort] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDay, setNewDay] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newImageDataUrl, setNewImageDataUrl] = useState("");
  const [newEnergyLevel, setNewEnergyLevel] = useState("");

  const resetCreateForm = () => {
    setNewTitle("");
    setNewLocation("");
    setNewShort("");
    setNewDescription("");
    setNewDay("");
    setNewTime("");
    setNewImageDataUrl("");
    setNewEnergyLevel(""); // Add this line
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImageDataUrl(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDay || !newTime) {
      // very simple validation
      alert("Please fill in at least a title, day, and time.");
      return;
    }

    const timeLabel = `${newDay} at ${newTime}`;

    const event = {
      title: newTitle.trim(),
      timeLabel,
      location: newLocation.trim() || "Custom activity",
      attendees: [],
      image: newImageDataUrl || undefined,
      description:
        newDescription.trim() ||
        newShort.trim() ||
        "Custom activity you created.",
      shortDescription: newShort.trim() || "",
      createdBy: "you",
      isCustom: true,
      recommendedEnergyLevel: newEnergyLevel || null, // Add this line
    };

    addEnrolledEvent(event);
    window.dispatchEvent(new Event("eventsUpdated"));

    resetCreateForm();
    setShowCreateModal(false);
  };

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
                  top: "1.2rem",
                  right: "0.75rem",
                  backgroundColor: "#111827",
                  border: "1px solid rgba(148, 163, 184, 0.4)",
                  color: "#e5e7eb",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
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
            onClick={() => navigate("/home/calendar")}
          >
            <i className="bi bi-calendar3 me-2"></i> View My Calendar
          </button>
          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "#0e3b85ff",
              color: "#f8fafc",
              transition: "0.2s",
              borderColor: "rgba(247, 232, 126, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1e62d0ff";
              e.target.style.borderColor = "#facc15";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#0e3b85ff";
              e.target.style.borderColor = "rgba(247, 232, 126, 0.15)";
            }}
          >
            <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
            Adjust Social Energy
          </button>
          <button
            className="btn btn-success"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Activity
          </button>
        </div>

        <hr className="border-secondary my-4" />

        {/* ENROLLED ACTIVITIES */}
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
            subtitle="Join events from the home page or create your own to see them here"
          />
        ) : (
          enrolledEvents.map((event, idx) => {
            const subtitleText = event.location
              ? `${event.timeLabel} • ${event.location}`
              : event.timeLabel;

            return (
              <ActivityCard
                key={idx}
                title={event.title}
                subtitle={subtitleText}
              >
                {event.attendees && event.attendees.length > 0 && (
                  <div className="d-flex align-items-center mt-2 mb-3">
                    <i className="bi bi-people-fill me-2 text-secondary"></i>
                    <span
                      className="text-light opacity-75"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {event.attendees.join(", ")}
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.5rem 1.25rem",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => {
                      removeEnrolledEvent(event.title, event.timeLabel);
                      window.dispatchEvent(new Event("eventsUpdated"));
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#c82333";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#dc3545";
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    Leave
                  </button>
                </div>
              </ActivityCard>
            );
          })
        )}

        <hr className="border-secondary my-4" />

        {/* FRIENDS SECTION */}
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
          subtitle={`${availableFriendsNum} friends available right now`}
        >
          <div className="d-flex align-items-center mt-2">
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

            <span className="text-light ms-3" style={{ fontSize: "0.9rem" }}>
              {availableFriendsNum === 0
                ? "No friends available right now"
                : availableFriendsNum === 1
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
            onClick={(e) => e.stopPropagation()}
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
                  <button type="submit" className="btn btn.success">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW ACTIVITY MODAL */}
      {showCreateModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.7)", zIndex: 1060 }}
          onClick={() => {
            resetCreateForm();
            setShowCreateModal(false);
          }}
        >
          <div
            className="card bg-dark border border-secondary"
            style={{ width: "95%", maxWidth: "420px", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body" style={{ overflowY: "auto" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white mb-0">Create New Activity</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    resetCreateForm();
                    setShowCreateModal(false);
                  }}
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateSubmit}>
                <div className="mb-3">
                  <label className="form-label text-light">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    maxLength={80}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">
                    Location (optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    maxLength={80}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">
                    Short Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newShort}
                    onChange={(e) => setNewShort(e.target.value)}
                    maxLength={120}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">
                    Extended Description
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label text-light">Day</label>
                    <select
                      className="form-select"
                      value={newDay}
                      onChange={(e) => setNewDay(e.target.value)}
                      required
                    >
                      <option value="">Select day</option>
                      {DAY_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label text-light">Time</label>
                    <select
                      className="form-select"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      required
                    >
                      <option value="">Select time</option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">
                    Image (optional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {newImageDataUrl && (
                    <div className="mt-2">
                      <img
                        src={newImageDataUrl}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "180px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* NEW: Recommended Energy Level */}
                <div className="mb-3">
                  <label className="form-label text-light">
                    Recommended Energy Level (optional)
                  </label>
                  <select
                    className="form-select"
                    value={newEnergyLevel}
                    onChange={(e) => setNewEnergyLevel(e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="verylow">Very Low</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="mediumhigh">Medium-High</option>
                    <option value="high">Very High</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      resetCreateForm();
                      setShowCreateModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Create & Enroll
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
