import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEnrolledEvents, parseEventTime } from "../utils/eventManager.js";

/** Shared helpers – must match Home.jsx */
const PRIORITY_STORAGE_KEY = "se_event_priority_map";
const DEADLINE_STORAGE_KEY = "se_deadline_events";

const makeEventKey = (title, timeLabel) => `${title}__${timeLabel}`;

/* ----- Priority map helpers ----- */
const loadPriorityMap = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PRIORITY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const savePriorityMap = (map) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRIORITY_STORAGE_KEY, JSON.stringify(map));
};

/* ----- Deadline storage helpers ----- */
const loadDeadlines = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DEADLINE_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    // migrate old short-day labels (e.g. "Thu at 8:00 AM") → "Thursday at 8:00 AM"
    const shortToFull = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };

    let changed = false;
    const migrated = parsed.map((d) => {
      if (typeof d.timeLabel === "string") {
        const m = d.timeLabel.match(/^([A-Z][a-z]{2}) at (.+)$/); // e.g. "Thu at 8:00 AM"
        if (m && shortToFull[m[1]]) {
          changed = true;
          return { ...d, timeLabel: `${shortToFull[m[1]]} at ${m[2]}` };
        }
      }
      return d;
    });

    if (changed) {
      window.localStorage.setItem(DEADLINE_STORAGE_KEY, JSON.stringify(migrated));
    }

    return migrated;
  } catch {
    return [];
  }
};

const saveDeadlines = (items) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEADLINE_STORAGE_KEY, JSON.stringify(items));
};

export default function Calendar() {
  const navigate = useNavigate();
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [priorityMap, setPriorityMap] = useState(() => loadPriorityMap());
  const [priorityMenu, setPriorityMenu] = useState(null); // { key, x, y }

  const [deadlineMenu, setDeadlineMenu] = useState(null); // { id, x, y }
  const [deadlines, setDeadlines] = useState(() => loadDeadlines());
  const [deadlineModalOpen, setDeadlineModalOpen] = useState(false);
  const [deadlineTitle, setDeadlineTitle] = useState("");
  const [deadlineDay, setDeadlineDay] = useState("Thu");
  const [deadlineTime, setDeadlineTime] = useState("8 AM");

  useEffect(() => {
    const loadEvents = () => {
      setEnrolledEvents(getEnrolledEvents());
    };
    loadEvents();
    window.addEventListener("eventsUpdated", loadEvents);
    return () => window.removeEventListener("eventsUpdated", loadEvents);
  }, []);

  const timeSlots = [
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
    "12 AM",
  ];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Same four Upcoming dummy events as in Home – they should show in Calendar too
  const seededUpcomingEvents = [
    {
      title: "Physics Problem Set",
      timeLabel: "Tomorrow at 12:00 PM",
      defaultVariant: "priority",
    },
    {
      title: "Linear Algebra Lecture",
      timeLabel: "Thursday at 8:00 AM",
      defaultVariant: "priority",
    },
    {
      title: "Coffee with Lucas",
      timeLabel: "Tomorrow at 4:00 PM",
      defaultVariant: "flexible",
    },
    {
      title: "Group Project Meeting",
      timeLabel: "Thursday at 6:00 PM",
      defaultVariant: "flexible",
    },
  ];

  // Merge enrolled (joined / own) + seeded Upcoming + deadlines (avoid duplicates)
  const calendarEvents = useMemo(() => {
    const combined = [...enrolledEvents];
    const existingKeys = new Set(
      combined.map((ev) => makeEventKey(ev.title, ev.timeLabel))
    );

    seededUpcomingEvents.forEach((ev) => {
      const key = makeEventKey(ev.title, ev.timeLabel);
      if (!existingKeys.has(key)) {
        combined.push({ ...ev, source: "seeded" });
        existingKeys.add(key);
      }
    });

    deadlines.forEach((d) => {
      const key = makeEventKey(d.title, d.timeLabel);
      if (!existingKeys.has(key)) {
        combined.push(d);
        existingKeys.add(key);
      }
    });

    return combined;
  }, [enrolledEvents, deadlines]);

  const getVariantForEvent = (event) => {
    const key = makeEventKey(event.title, event.timeLabel);
    if (priorityMap[key]) return priorityMap[key];
    if (event.defaultVariant) return event.defaultVariant;
    // joined / own events default to flexible
    return "flexible";
  };

  const handleChangeVariant = (key, newVariant) => {
    setPriorityMap((prev) => {
      const next = { ...prev, [key]: newVariant };
      savePriorityMap(next);
      return next;
    });
    setPriorityMenu(null);
    // no event dispatch needed – Calendar uses local state, Home will re-read on mount
  };

  const handleRemoveDeadline = (deadlineId) => {
    setDeadlines((prev) => {
      const next = prev.filter((d) => d.id !== deadlineId);
      saveDeadlines(next);
      return next;
    });
    setDeadlineMenu(null);
  };

  // format hour for warnings (24h → "8 PM")
  const formatHour = (hour24) => {
    if (hour24 == null) return "";
    const ampm = hour24 >= 12 ? "PM" : "AM";
    let hour = hour24 % 12;
    if (hour === 0) hour = 12;
    return `${hour} ${ampm}`;
  };

  // Detect clashes between priority / flexible events (deadlines ignored)
  const conflicts = useMemo(() => {
    const slots = new Map();

    calendarEvents.forEach((ev) => {
      if (ev.isDeadline) return; // deadlines not part of clash check
      const { day, hour24 } = parseEventTime(ev.timeLabel);
      if (!day || hour24 == null) return;
      const key = `${day}-${hour24}`;

      if (!slots.has(key)) {
        slots.set(key, { day, hour24, events: [] });
      }
      slots.get(key).events.push(ev);
    });

    const result = [];
    slots.forEach((slot) => {
      if (slot.events.length < 2) return;

      const counts = { priority: 0, flexible: 0 };
      slot.events.forEach((ev) => {
        const v = getVariantForEvent(ev);
        if (v === "priority") counts.priority += 1;
        else if (v === "flexible") counts.flexible += 1;
      });

      result.push({
        day: slot.day,
        hour24: slot.hour24,
        events: slot.events,
        ...counts,
      });
    });

    return result;
  }, [calendarEvents, priorityMap]);

  // Save new deadline
  const handleSaveDeadline = () => {
    const title = deadlineTitle.trim();
    if (!title) return;

    // map short labels used in the select ("Thu") → full labels for timeLabel
    const shortToFull = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    };

    const fullDay = shortToFull[deadlineDay] || deadlineDay;

    // Convert "8 AM" → "8:00 AM" to match parseEventTime expectations
    const timeWithMinutes = deadlineTime.replace(" ", ":00 ");
    const timeLabel = `${fullDay} at ${timeWithMinutes}`;

    const newDeadline = {
      id: Date.now(),
      title,
      timeLabel,
      isDeadline: true,
    };

    setDeadlines((prev) => {
      const next = [...prev, newDeadline];
      saveDeadlines(next);
      return next;
    });

    setDeadlineModalOpen(false);
    setDeadlineTitle("");
  };

  return (
    <div
      onClick={() => {
        setPriorityMenu(null);
        setDeadlineMenu(null);
      }}
    >
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div>
          <h2 className="mb-0" style={{ fontWeight: "600" }}>
            Week Calendar
          </h2>
          <p
            className="text-secondary small mb-0"
            style={{ fontSize: "0.875rem" }}
          >
            Your schedule overview
          </p>
        </div>
      </div>

      {/* Calendar Card */}
      <div
        className="rounded-4 p-4"
        style={{
          backgroundColor: "#0a1628",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Week Overview Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0" style={{ fontWeight: "500" }}>
            Week Overview
          </h5>
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#dc3545",
                  borderRadius: "3px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              ></div>
              <span
                className="text-secondary small"
                style={{ fontSize: "0.8rem" }}
              >
                Priority
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#28a745",
                  borderRadius: "3px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              ></div>
              <span
                className="text-secondary small"
                style={{ fontSize: "0.8rem" }}
              >
                Flexible
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: "#f97316",
                  borderRadius: "3px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              ></div>
              <span
                className="text-secondary small"
                style={{ fontSize: "0.8rem" }}
              >
                Deadline
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div
          style={{
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "70vh",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "70px repeat(7, 1fr)",
              gap: "0",
              minWidth: "520px",
              backgroundColor: "rgba(15, 30, 50, 0.5)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Empty top-left cell */}
            <div
              style={{
                backgroundColor: "rgba(15, 30, 50, 0.3)",
                borderBottom: "1px solid rgba(100, 120, 150, 0.2)",
                borderRight: "1px solid rgba(100, 120, 150, 0.2)",
              }}
            ></div>

            {/* Day headers */}
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-secondary py-2"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  borderBottom: "1px solid rgba(100, 120, 150, 0.2)",
                  backgroundColor: "rgba(15, 30, 50, 0.3)",
                }}
              >
                {day}
              </div>
            ))}

            {/* Time slots and grid cells */}
            {timeSlots.map((time, timeIndex) => (
              <React.Fragment key={time}>
                {/* Time label */}
                <div
                  className="text-secondary py-2 px-2"
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    borderRight: "1px solid rgba(100, 120, 150, 0.2)",
                    borderBottom:
                      timeIndex === timeSlots.length - 1
                        ? "none"
                        : "1px solid rgba(100, 120, 150, 0.2)",
                    backgroundColor: "rgba(15, 30, 50, 0.3)",
                    textAlign: "right",
                  }}
                >
                  {time}
                </div>

                {/* Day cells for this time slot */}
                {days.map((day, dayIndex) => {
                  // Find events for this time slot and day
                  const cellEvents = calendarEvents.filter((event) => {
                    const { day: eventDay, hour24 } = parseEventTime(
                      event.timeLabel
                    );
                    if (eventDay !== day || hour24 === null) return false;

                    // Convert time slot label ("3 PM") → 24h
                    const timeSlot24 = (() => {
                      const parts = time.split(" ");
                      let hour = parseInt(parts[0], 10);
                      const ampm = parts[1];
                      if (ampm === "PM" && hour !== 12) hour += 12;
                      if (ampm === "AM" && hour === 12) hour = 0;
                      return hour;
                    })();

                    return hour24 === timeSlot24;
                  });

                  return (
                    <div
                      key={`${time}-${day}`}
                      style={{
                        minHeight: "45px",
                        backgroundColor: "transparent",
                        borderRight:
                          dayIndex === days.length - 1
                            ? "none"
                            : "1px solid rgba(100, 120, 150, 0.2)",
                        borderBottom:
                          timeIndex === timeSlots.length - 1
                            ? "none"
                            : "1px solid rgba(100, 120, 150, 0.2)",
                        transition: "background-color 0.2s ease",
                        cursor: "pointer",
                        position: "relative",
                        padding: cellEvents.length > 0 ? "2px" : "0",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(30, 50, 80, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {cellEvents.map((event) => {
                        const variant = getVariantForEvent(event);
                        const isDeadline = event.isDeadline === true;

                        let bgColor;
                        let borderColor;

                        if (isDeadline) {
                          // orange for deadlines
                          bgColor = "#f97316";
                          borderColor = "#fed7aa";
                        } else if (variant === "priority") {
                          bgColor = "#dc3545"; // red
                          borderColor = "#fca5a5";
                        } else {
                          bgColor = "#28a745"; // green
                          borderColor = "#6ee7b7";
                        }

                        const key = makeEventKey(
                          event.title,
                          event.timeLabel
                        );

                        return (
                          <div
                            key={isDeadline ? `deadline-${event.id}` : key}
                            style={{
                              backgroundColor: bgColor,
                              border: `1px solid ${borderColor}`,
                              color: "#ffffff",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              marginBottom: "2px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontWeight: "500",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.35)",
                            }}
                            title={event.title}
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect =
                                e.currentTarget.getBoundingClientRect();

                              if (isDeadline) {
                                // open deadline menu
                                setDeadlineMenu({
                                  id: event.id,
                                  x: rect.left + rect.width / 2,
                                  y: rect.bottom + 6,
                                });
                              } else {
                                // open priority/flexible menu
                                setPriorityMenu({
                                  key,
                                  x: rect.left + rect.width / 2,
                                  y: rect.bottom + 6,
                                });
                              }
                            }}
                          >
                            {event.title.length > 12
                              ? event.title.substring(0, 12) + "..."
                              : event.title}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Conflicts + Set Deadline button */}
      <div className="mt-3 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
        <div style={{ flex: 1 }}>
          {conflicts.length > 0 ? (
            <div
              className="text-secondary"
              style={{ fontSize: "0.85rem", opacity: 0.7 }}
            >
              {conflicts.slice(0, 3).map((c, idx) => {
                const timeLabel = formatHour(c.hour24);
                const titles = c.events.map((ev) => ev.title).join(", ");

                let typeText;
                if (c.priority && !c.flexible) {
                  typeText = `${c.priority} priority event${
                    c.priority > 1 ? "s" : ""
                  }`;
                } else if (!c.priority && c.flexible) {
                  typeText = `${c.flexible} flexible event${
                    c.flexible > 1 ? "s" : ""
                  }`;
                } else {
                  typeText = `${c.priority} priority and ${c.flexible} flexible events`;
                }

                return (
                  <div key={idx} className="mb-1">
                    ⚠️ {typeText} clash on {c.day} at {timeLabel}:{" "}
                    <span className="fw-semibold">{titles}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="text-secondary"
              style={{ fontSize: "0.85rem", opacity: 0.5 }}
            >
              No overlapping priority/flexible events right now.
            </div>
          )}
        </div>

        <button
          className="btn btn-outline-warning"
          onClick={() => setDeadlineModalOpen(true)}
        >
          <i className="bi bi-flag me-2" />
          Set deadline
        </button>
      </div>

      {/* Priority / Flexible popover */}
      {priorityMenu &&
        (() => {
          const event = calendarEvents.find(
            (ev) => makeEventKey(ev.title, ev.timeLabel) === priorityMenu.key
          );
          if (!event || event.isDeadline) return null; // safety

          const currentVariant = getVariantForEvent(event);

          return (
            <div
              className="position-fixed"
              style={{
                top: priorityMenu.y,
                left: priorityMenu.x,
                transform: "translate(-50%, 0)",
                zIndex: 3000,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="card bg-dark border border-secondary"
                style={{ minWidth: "180px" }}
              >
                <div className="card-body p-2">
                  <div
                    className="text-secondary small mb-2"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Mark this event as:
                  </div>
                  <button
                    className="btn btn-dark w-100 text-start mb-1"
                    style={{
                      border:
                        currentVariant === "priority"
                          ? "1px solid rgba(239,68,68,0.8)"
                          : "1px solid transparent",
                    }}
                    onClick={() =>
                      handleChangeVariant(priorityMenu.key, "priority")
                    }
                  >
                    <span className="text-danger me-2">●</span> Priority
                  </button>
                  <button
                    className="btn btn-dark w-100 text-start"
                    style={{
                      border:
                        currentVariant === "flexible"
                          ? "1px solid rgba(34,197,94,0.8)"
                          : "1px solid transparent",
                    }}
                    onClick={() =>
                      handleChangeVariant(priorityMenu.key, "flexible")
                    }
                  >
                    <span className="text-success me-2">●</span> Flexible
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Deadline popover */}
      {deadlineMenu && (
        <div
          className="position-fixed"
          style={{
            top: deadlineMenu.y,
            left: deadlineMenu.x,
            transform: "translate(-50%, 0)",
            zIndex: 3000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="card bg-dark border border-secondary"
            style={{ minWidth: "180px" }}
          >
            <div className="card-body p-2">
              <div
                className="text-secondary small mb-2"
                style={{ fontSize: "0.8rem" }}
              >
                Deadline options
              </div>
              <button
                className="btn btn-dark w-100 text-start text-danger"
                onClick={() => handleRemoveDeadline(deadlineMenu.id)}
              >
                <i className="bi bi-trash me-2" />
                Remove deadline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deadline Modal */}
      {deadlineModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.6)",
            zIndex: 4000,
          }}
          onClick={() => setDeadlineModalOpen(false)}
        >
          <div
            className="card"
            style={{
              width: "90%",
              maxWidth: "360px",
              backgroundColor: "#020617",
              borderRadius: "18px",
              border: "1px solid rgba(148,163,184,0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body">
              <h5 className="text-white mb-3">Set deadline</h5>

              <div className="mb-3">
                <label className="form-label text-secondary small">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={deadlineTitle}
                  onChange={(e) => setDeadlineTitle(e.target.value)}
                  placeholder="e.g. Project report"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">
                  Day
                </label>
                <select
                  className="form-select"
                  value={deadlineDay}
                  onChange={(e) => setDeadlineDay(e.target.value)}
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small">
                  Time
                </label>
                <select
                  className="form-select"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setDeadlineModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning"
                  onClick={handleSaveDeadline}
                  disabled={!deadlineTitle.trim()}
                >
                  Save deadline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
