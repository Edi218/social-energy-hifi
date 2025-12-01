import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { getEnrolledEvents, parseEventTime } from "../utils/eventManager.js";

export default function Calendar() {
  const navigate = useNavigate();
  const [enrolledEvents, setEnrolledEvents] = useState([]);

  useEffect(() => {
    const loadEvents = () => {
      setEnrolledEvents(getEnrolledEvents());
    };
    loadEvents();
    // Listen for events updates
    window.addEventListener('eventsUpdated', loadEvents);
    return () => window.removeEventListener('eventsUpdated', loadEvents);
  }, []);
  
  const timeSlots = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', 
    '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', 
    '10 PM', '11 PM', '12 AM'
  ];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        {/*<i 
          className="bi bi-arrow-left text-light" 
          style={{ 
            fontSize: "24px", 
            cursor: "pointer",
            transition: "opacity 0.2s ease"
          }}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => e.target.style.opacity = "0.7"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
        ></i>*/}
        <div>
          <h2 className="mb-0" style={{ fontWeight: "600" }}>Week Calendar</h2>
          <p className="text-secondary small mb-0" style={{ fontSize: "0.875rem" }}>Your schedule overview</p>
        </div>
      </div>

      {/* Calendar Card */}
      <div 
        className="rounded-4 p-4"
        style={{ 
          backgroundColor: "#0a1628",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Week Overview Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0" style={{ fontWeight: "500" }}>Week Overview</h5>
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-2">
              <div 
                style={{ 
                  width: "14px", 
                  height: "14px", 
                  backgroundColor: "#dc3545", 
                  borderRadius: "3px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
                }}
              ></div>
              <span className="text-secondary small" style={{ fontSize: "0.8rem" }}>Priority</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div 
                style={{ 
                  width: "14px", 
                  height: "14px", 
                  backgroundColor: "#28a745", 
                  borderRadius: "3px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
                }}
              ></div>
              <span className="text-secondary small" style={{ fontSize: "0.8rem" }}>Flexible</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "70vh", WebkitOverflowScrolling: "touch" }}>
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "70px repeat(7, 1fr)", 
              gap: "0",
              minWidth: "520px",
              backgroundColor: "rgba(15, 30, 50, 0.5)",
              borderRadius: "8px",
              overflow: "hidden"
            }}
          >
            {/* Empty top-left cell */}
            <div style={{ 
              backgroundColor: "rgba(15, 30, 50, 0.3)",
              borderBottom: "1px solid rgba(100, 120, 150, 0.2)",
              borderRight: "1px solid rgba(100, 120, 150, 0.2)"
            }}></div>
            
            {/* Day headers */}
            {days.map((day) => (
              <div 
                key={day} 
                className="text-center text-secondary py-2" 
                style={{ 
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  borderBottom: "1px solid rgba(100, 120, 150, 0.2)",
                  backgroundColor: "rgba(15, 30, 50, 0.3)"
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
                    borderBottom: timeIndex === timeSlots.length - 1 ? "none" : "1px solid rgba(100, 120, 150, 0.2)",
                    backgroundColor: "rgba(15, 30, 50, 0.3)",
                    textAlign: "right"
                  }}
                >
                  {time}
                </div>
                
                {/* Day cells for this time slot */}
                {days.map((day, dayIndex) => {
                  // Find events for this time slot and day
                  const cellEvents = enrolledEvents.filter((event) => {
                    const { day: eventDay, hour24 } = parseEventTime(event.timeLabel);
                    if (eventDay !== day || hour24 === null) return false;
                    
                    // Convert time slot to 24-hour format
                    const timeSlot24 = (() => {
                      const parts = time.split(' ');
                      let hour = parseInt(parts[0]);
                      const ampm = parts[1];
                      if (ampm === 'PM' && hour !== 12) hour += 12;
                      if (ampm === 'AM' && hour === 12) hour = 0;
                      return hour;
                    })();
                    
                    // Match if the event hour matches the time slot hour
                    return hour24 === timeSlot24;
                  });

                  return (
                    <div 
                      key={`${time}-${day}`}
                      style={{ 
                        minHeight: "45px",
                        backgroundColor: "transparent",
                        borderRight: dayIndex === days.length - 1 ? "none" : "1px solid rgba(100, 120, 150, 0.2)",
                        borderBottom: timeIndex === timeSlots.length - 1 ? "none" : "1px solid rgba(100, 120, 150, 0.2)",
                        transition: "background-color 0.2s ease",
                        cursor: "pointer",
                        position: "relative",
                        padding: cellEvents.length > 0 ? "2px" : "0"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(30, 50, 80, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {cellEvents.map((event, eventIdx) => (
                        <div
                          key={eventIdx}
                          style={{
                            backgroundColor: "#28a745",
                            color: "#ffffff",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            marginBottom: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontWeight: "500"
                          }}
                          title={event.title}
                        >
                          {event.title.length > 8 ? event.title.substring(0, 8) + "..." : event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}