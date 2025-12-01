import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import QuoteCard from "../components/QuoteCard.jsx";
import { addEnrolledEvent, getEnrolledEvents } from "../utils/eventManager.js";

export default function Home() {
  // Read saved energy level
  const savedLevel = (() => {
    const raw = window.localStorage.getItem("se_energy_level");
    return raw ? parseInt(raw, 10) : null;
  })();

  const quoteByBucket = {
    verylow: {
      title: "Take It Slow",
      text:
        "Rest is productive too. Recharging now helps you stay focused later. Lean into calm activities that restore your energy.",
      icon: "🧘",
      borderColor: "rgba(239,68,68,0.5)",
      iconBg: "rgba(239,68,68,0.15)",
    },
    low: {
      title: "Gentle Connections",
      text:
        "Light social moments can make a big difference. A short chat or quiet hangout can help lift your mood without draining you.",
      icon: "💛",
      borderColor: "rgba(249,115,22,0.5)",
      iconBg: "rgba(249,115,22,0.15)",
    },
    medium: {
      title: "Finding Your Balance",
      text:
        "Meaningful connections boost productivity and well-being. Even short moments with friends help recharge your mind.",
      icon: "💛",
      borderColor: "rgba(234,179,8,0.5)",
      iconBg: "rgba(234,179,8,0.15)",
    },
    mediumhigh: {
      title: "Make the Most of Your Motivation",
      text:
        "You're energized — perfect for group activities or productive sessions with friends. Share the momentum!",
      icon: "💚",
      borderColor: "rgba(34,197,94,0.5)",
      iconBg: "rgba(34,197,94,0.15)",
    },
    high: {
      title: "You're Fully Charged!",
      text:
        "Your high energy makes you the spark in your social circle. This is a great moment for dynamic activities and new experiences.",
      icon: "⚡",
      borderColor: "rgba(16,185,129,0.6)",
      iconBg: "rgba(16,185,129,0.15)",
    },
    unknown: {
      title: "Welcome!",
      text:
        "Select your social energy level to get personalized recommendations tailored to how you're feeling today.",
      icon: "✨",
      borderColor: "rgba(148,163,184,0.25)",
      iconBg: "rgba(148,163,184,0.1)",
    },
  };


  // Map 1–5 → bucket
  const energyBucket =
    savedLevel == null
      ? "unknown"
      : savedLevel === 1
      ? "verylow"
      : savedLevel === 2
      ? "low"
      : savedLevel === 3
      ? "medium"
      : savedLevel === 4
      ? "mediumhigh"
      : "high";

  const navigate = useNavigate();

  // Small “nudge” popup state
  const [showNudge, setShowNudge] = useState(false);

  // Show popup after 100 seconds on the home page
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("nudge_shown");

    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setShowNudge(true);
      sessionStorage.setItem("nudge_shown", "true");
    }, 10_000);

    return () => clearTimeout(timer);
  }, []);

  const nudgeByBucket = {
    verylow: {
      title: "Tiny Steps Are Enough",
      text:
        "You’ve been at it for a while. How about a short, low-key break or a quiet check-in with someone you trust?",
      primaryLabel: "Browse gentle events",
      secondaryLabel: "Maybe later",
    },
    low: {
      title: "A Small Social Boost",
      text:
        "A quick coffee chat or short walk could gently lift your mood without overwhelming you.",
      primaryLabel: "See low-key ideas",
      secondaryLabel: "Keep focusing",
    },
    medium: {
      title: "Ready for a Little Break?",
      text:
        "You’ve been focused for a while. A short social break can help you come back with more energy.",
      primaryLabel: "Check events",
      secondaryLabel: "Stay here",
    },
    mediumhigh: {
      title: "Channel Your Momentum",
      text:
        "You seem energized! This might be a great moment to join a group activity or plan something with friends.",
      primaryLabel: "See group activities",
      secondaryLabel: "Not now",
    },
    high: {
      title: "Put Your Energy to Use",
      text:
        "You’re fully charged! Perfect moment to join an event, invite friends, or start something fun.",
      primaryLabel: "Open events",
      secondaryLabel: "Maybe later",
    },
    unknown: {
      title: "How Are You Feeling?",
      text:
        "Tell me how you’re feeling so we can suggest the right type of break or activity for you.",
      primaryLabel: "Set my energy level",
      secondaryLabel: "Skip for now",
    },
  };

  const nudgeConfig = nudgeByBucket[energyBucket] || nudgeByBucket.unknown;

  const quote = quoteByBucket[energyBucket] || quoteByBucket.unknown;

  const borderColors = {
    verylow: "rgba(239,68,68,0.85)",    // red
    low: "rgba(249,115,22,0.9)",        // orange
    medium: "rgba(234,179,8,0.9)",      // yellow
    mediumhigh: "rgba(139, 252, 180, 0.9)",  // light green
    high: "rgba(22,163,74,0.95)",       // stronger green
    unknown: "rgba(148,163,184,0.7)",   // neutral slate
  };

  const currentBorderColor =
    borderColors[energyBucket] || borderColors.unknown;

  const priorityItems = [
    {
      title: "Physics Problem Set",
      timeLabel: "Tomorrow at 12:00 PM",
    },
    {
      title: "Linear Algebra Lecture",
      timeLabel: "Tomorrow at 8:00 AM",
    },
  ];

  const flexibleItems = [
    {
      title: "Coffee with Lucas",
      timeLabel: "Tomorrow at 4:00 PM",
    },
    {
      title: "Group Project Meeting",
      timeLabel: "Tomorrow at 6:00 PM",
    },
  ];

  // Small internal component for those schedule cards
  const ScheduleCard = ({ title, timeLabel, variant }) => {
    const isPriority = variant === "priority";

    const borderColor = isPriority
      ? "rgba(239, 68, 68, 0.6)" // red
      : "rgba(34, 197, 94, 0.6)"; // green

    const badgeBg = isPriority ? "#7f1d1d" : "#065f46";
    const badgeText = isPriority ? "Priority" : "Flexible";


    return (
      <div
        className="card mb-3"
        style={{
          backgroundColor: "#020617",
          borderRadius: "18px",
          border: `1px solid ${borderColor}`,
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="text-white fw-semibold mb-2" style={{ fontSize: "1.05rem" }}>{title}</h5>
            <div className="d-flex align-items-center text-secondary">
              <i className="bi bi-clock me-2" />
              <span>{timeLabel}</span>
            </div>
          </div>

          <span
            className="px-3 py-1 rounded-pill"
            style={{
              backgroundColor: badgeBg,
              color: "#fecaca",
              fontSize: "0.85rem",
              fontWeight: 600,
              border: `1px solid ${borderColor}`,
            }}
          >
            {badgeText}
          </span>
        </div>
      </div>
    );
  };

  // ----- EVENTS FOR EACH BUCKET -----

  // ⭐ VERY LOW SOCIAL ENERGY
  const veryLowEvents = [
    {
      title: "Quiet Library Study",
      timeLabel: "Monday at 7:00 PM",
      location: "ETH Main Library",
      attendees: ["Ava"],
      image: "/images/events/quiet-study.jpg",
    },
    {
      title: "Short Walk & Talk",
      timeLabel: "Tuesday at 5:00 PM",
      location: "Polyterrasse",
      attendees: ["Sophia"],
      image: "/images/events/polyterasse.jpg",
    },
    {
      title: "Chill Tea Break",
      timeLabel: "Wednesday at 4:00 PM",
      location: "ETH Alumni Lounge",
      attendees: ["Lucas", "Carlo"],
      image: "/images/events/tea.jpg",
    },
  ];

  // ⭐ LOW SOCIAL ENERGY
  const lowEnergyEvents = [
    {
      title: "Cozy Board Game Night",
      timeLabel: "Friday at 8:00 PM",
      location: "Friend’s Flat, Kreis 6",
      attendees: ["Lucas", "Isabella"],
      image: "/images/events/boardgames.jpg",
    },
    {
      title: "Calm Study Meetup",
      timeLabel: "Monday at 3:00 PM",
      location: "CAB Silent Room",
      attendees: ["Chloe"],
      image: "/images/events/study.png",
    },
    {
      title: "Evening Stroll",
      timeLabel: "Friday at 6:00 PM",
      location: "Zürich Central",
      attendees: ["Ethan", "Ava"],
      image: "/images/events/walk-night.jpg",
    },
    {
      title: "Quiet Library Study",
      timeLabel: "Tonight at 7:00 PM",
      location: "ETH Main Library",
      attendees: ["Ava"],
      image: "/images/events/quiet-study.jpg",
    },
  ];

  // ⭐ MEDIUM SOCIAL ENERGY
  const mediumEnergyEvents = [
    {
      title: "Coffee Chat",
      timeLabel: "Tuesday at 10:00 AM",
      location: "Einstein Cafe, ETH HG",
      attendees: ["Chloe", "Lucas"],
      image: "/images/events/coffee.jpg",
    },
    {
      title: "Lunch with Friends",
      timeLabel: "Wednesday at 12:30 PM",
      location: "ETH Mensa Polyterrasse",
      attendees: ["Mateo", "Isabella"],
      image: "/images/events/mensa.jpg",
    },
    {
      title: "Study Together",
      timeLabel: "Saturday at 6:00 PM",
      location: "ETH CAB Building",
      attendees: ["Ava", "Isabella", "Mateo", "Chloe"],
      image: "/images/events/study.png",
    },
    {
      title: "Lunch Crew",
      timeLabel: "Thursday at 12:30 PM",
      location: "ETH Mensa Polyterrasse",
      attendees: ["Mateo", "Chloe", "Isabella"],
      image: "/images/events/mensa2.jpg",
    },
  ];

  // ⭐ MEDIUM-HIGH SOCIAL ENERGY
  const mediumHighEvents = [
    {
      title: "Group Study Sprint",
      timeLabel: "Today at 4:00 PM",
      location: "ETH HG E33",
      attendees: ["Ava", "Isabella", "Mateo", "Chloe"],
      image: "/images/events/study.jpg",
    },
    {
      title: "Evening Jog Crew",
      timeLabel: "Tonight at 8:00 PM",
      location: "ETH Hönggerberg",
      attendees: ["Liam", "Ethan", "Daniel"],
      image: "/images/events/run.jpg",
    },
    {
      title: "Casual Dinner Out",
      timeLabel: "Saturday at 7:00 PM",
      location: "Nooch Zurich",
      attendees: ["Oscar", "Daniel"],
      image: "/images/events/dinner.jpg",
    },
    {
      title: "Big Study Group",
      timeLabel: "Tomorrow at 2:00 PM",
      location: "HG D1.2",
      attendees: ["Ava", "Isabella", "Mateo", "Chloe"],
      image: "/images/events/study.png",
    },
    {
      title: "Lunch Crew",
      timeLabel: "Thursday at 12:30 PM",
      location: "Mensa Polyterrasse",
      attendees: ["Chloe", "Mateo"],
      image: "/images/events/mensa2.jpg",
    },
  ];

  // ⭐ HIGH SOCIAL ENERGY
  const highEnergyEvents = [
    {
      title: "Drinks at BQM",
      timeLabel: "Friday at 9:00 PM",
      location: "BQM Bar",
      attendees: ["Lucas", "Ethan", "Sophia", "Daniel"],
      image: "/images/events/drinks.jpg",
    },
    {
      title: "ASVZ Group Workout",
      timeLabel: "Saturday at 6:00 PM",
      location: "ASVZ Polyterrasse",
      attendees: ["Carlo", "Oscar", "Ethan"],
      image: "/images/events/workout.jpg",
    },
    {
      title: "Volleyball Free Play",
      timeLabel: "Sunday at 3:00 PM",
      location: "ASVZ Höngg",
      attendees: ["Liam", "Ethan", "Lucas"],
      image: "/images/events/volleyball.png",
    },
    {
      title: "Big Study Group",
      timeLabel: "Tuesday at 2:00 PM",
      location: "ETH HG D1.2",
      attendees: ["Ava", "Isabella", "Mateo", "Chloe"],
      image: "/images/events/study.png",
    },
  ];

  // SELECT EVENTS BASED ON BUCKET
  let eventsForUser =
    energyBucket === "verylow"
      ? veryLowEvents
      : energyBucket === "low"
      ? lowEnergyEvents
      : energyBucket === "medium"
      ? mediumEnergyEvents
      : energyBucket === "mediumhigh"
      ? mediumHighEvents
      : energyBucket === "high"
      ? highEnergyEvents
      : mediumEnergyEvents; // default

  // Show more/less
  const [showAll, setShowAll] = useState(false);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  
  // Sort state
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortType, setSortType] = useState(null); // 'date', 'distance', 'commonFriends'
  
  // User's friends list (for common friends filter)
  const userFriends = [
    'Elynn Lee', 'Oscar Dum', 'Carlo Emilion', 'Daniel Jay Park', 
    'Liam Cortez', 'Sophia Nguyen', 'Ethan Morales', 'Ava Becker',
    'Noah Tanaka', 'Chloe Ricci', 'Mateo Alvarez', 'Lucas Hwang', 'Isabella Fontaine'
  ];
  
  // Apply sorting to events - use useMemo to recalculate when sortType or eventsForUser changes
  const sortedEvents = useMemo(() => {
    if (!sortType) return eventsForUser;
    
    let sorted = [...eventsForUser];
    
    if (sortType === 'date') {
      // Sort by date: earlier events first
      const today = new Date();
      const dayOfWeek = today.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      sorted.sort((a, b) => {
        const getEventDate = (event) => {
          const lower = event.timeLabel.toLowerCase();
          const timeMatch = event.timeLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
          let hours = timeMatch ? parseInt(timeMatch[1]) : 12;
          const ampm = timeMatch ? timeMatch[3].toUpperCase() : 'PM';
          if (ampm === 'PM' && hours !== 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          
          if (lower.includes('today') || lower.includes('tonight')) {
            return dayOfWeek * 100 + hours;
          } else if (lower.includes('tomorrow')) {
            return ((dayOfWeek + 1) % 7) * 100 + hours;
          } else {
            for (let i = 0; i < dayNames.length; i++) {
              if (lower.includes(dayNames[i].toLowerCase())) {
                // Adjust day index to be relative to today
                let dayIndex = i;
                if (dayIndex < dayOfWeek) dayIndex += 7; // Next week
                return dayIndex * 100 + hours;
              }
            }
          }
          return 9999; // Unknown dates go last
        };
        
        return getEventDate(a) - getEventDate(b);
      });
    } else if (sortType === 'commonFriends') {
      // Sort by number of common friends: more friends first
      sorted.sort((a, b) => {
        const getCommonFriendsCount = (event) => {
          if (!event.attendees) return 0;
          return event.attendees.filter(attendee => 
            userFriends.includes(attendee)
          ).length;
        };
        
        return getCommonFriendsCount(b) - getCommonFriendsCount(a);
      });
    } else if (sortType === 'distance') {
      // Distance sort: closest first (placeholder - no actual sorting yet)
      // Keep original order for now
    }
    
    return sorted;
  }, [sortType, eventsForUser, userFriends]);

  // Load enrolled events
  useEffect(() => {
    const loadEvents = () => {
      setEnrolledEvents(getEnrolledEvents());
    };
    loadEvents();
    window.addEventListener('eventsUpdated', loadEvents);
    return () => window.removeEventListener('eventsUpdated', loadEvents);
  }, []);

  // Check if an event is already joined
  const isEventJoined = (event) => {
    return enrolledEvents.some(
      (e) => e.title === event.title && e.timeLabel === event.timeLabel
    );
  };

  // Handle joining an event
  const handleJoinEvent = (event) => {
    addEnrolledEvent(event);
    // Trigger a re-render by updating state (you could use a custom event or context)
    window.dispatchEvent(new Event('eventsUpdated'));
  };

  const visibleEvents = showAll ? sortedEvents : sortedEvents.slice(0, 3);

  return (
    <div>
      <h3
        className="mb-0"
        style={{
          color: "#ffffff",
          textShadow: `0 0 6px ${currentBorderColor}55, 0 0 12px ${currentBorderColor}40`,
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      > <i className="bi bi-speedometer2 me-2"></i> Dashboard </h3>

      <hr className="border-secondary my-3" />

      {quote && (
        <QuoteCard
          title={quote.title}
          text={quote.text}
          icon={quote.icon}
          borderColor={quote.borderColor}
          iconBg={quote.iconBg}
        />
      )}

      <hr className="border-secondary my-3" />

      {/* UPCOMING SECTION */}
      <div className="mb-4">
        <div className="d-flex align-items-center mb-3">
          <i
            className="bi bi-calendar-event text-light me-2"
            style={{ fontSize: "20px" }}
          ></i>
          <h4 className="mb-0 text-white">Upcoming</h4>
        </div>

        {/* KEEP THESE (Priority) */}
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i
              className="bi bi-exclamation-circle-fill text-danger me-2"
              style={{ fontSize: "18px" }}
            />
            <span className="text-white fw-semibold">Keep These</span>
          </div>
          {priorityItems.map((item, idx) => (
            <ScheduleCard
              key={`p-${idx}`}
              title={item.title}
              timeLabel={item.timeLabel}
              variant="priority"
            />
          ))}
        </div>

        {/* FLEXIBLE */}
        <div>
          <div className="d-flex align-items-center mb-2">
            <i
              className="bi bi-check-circle-fill text-success me-2"
              style={{ fontSize: "18px" }}
            />
            <span className="text-white fw-semibold">Flexible</span>
          </div>
          {flexibleItems.map((item, idx) => (
            <ScheduleCard
              key={`f-${idx}`}
              title={item.title}
              timeLabel={item.timeLabel}
              variant="flexible"
            />
          ))}
        </div>
      </div>

      <hr className="border-secondary my-3" />

      <div className="d-flex align-items-center justify-content-between mb-3 mt-4">
        <div className="d-flex align-items-center">
          <i
            className="bi bi-lightning-charge-fill me-2 section-icon"
            style={{
              fontSize: "20px",
              color: currentBorderColor,   
              filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6))",
            }}
          ></i>
          <h4 className="mb-0 text-white section-title">Recommended Events</h4>
        </div>
        
        {/* Sort Button */}
        <div className="position-relative">
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            style={{
              borderColor: 'rgba(148, 163, 184, 0.3)',
              color: '#f8fafc',
              fontSize: '0.9rem',
              padding: '0.4rem 0.8rem',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            <i className="bi bi-funnel me-2"></i>
            <span>Sort by</span>
            <i className={`bi bi-chevron-${showSortMenu ? 'up' : 'down'} ms-2`} style={{ fontSize: '0.8rem' }}></i>
          </button>
          
          {/* Sort Menu */}
          {showSortMenu && (
            <div
              className="card bg-dark border border-secondary"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                minWidth: '220px',
                zIndex: 100,
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              }}
            >
              <div className="card-body p-2">
                {/* Date Sort */}
                <button
                  className="btn btn-dark text-start border-0 w-100"
                  onClick={() => {
                    if (sortType === 'date') {
                      setSortType(null);
                    } else {
                      setSortType('date');
                    }
                  }}
                  style={{
                    backgroundColor: sortType === 'date' ? 'rgba(148, 163, 184, 0.2)' : 'transparent',
                  }}
                >
                  <i className="bi bi-calendar3 me-2"></i>
                  Date (earlier first)
                </button>
                
                <hr className="my-2 border-secondary" />
                
                {/* Common Friends Sort */}
                <button
                  className="btn btn-dark text-start border-0 w-100"
                  onClick={() => {
                    if (sortType === 'commonFriends') {
                      setSortType(null);
                    } else {
                      setSortType('commonFriends');
                    }
                  }}
                  style={{
                    backgroundColor: sortType === 'commonFriends' ? 'rgba(148, 163, 184, 0.2)' : 'transparent',
                  }}
                >
                  <i className="bi bi-people me-2"></i>
                  Common Friends (more first)
                </button>
                
                <hr className="my-2 border-secondary" />
                
                {/* Distance Sort (placeholder) */}
                <button
                  className="btn btn-dark text-start border-0 w-100"
                  onClick={() => {
                    if (sortType === 'distance') {
                      setSortType(null);
                    } else {
                      setSortType('distance');
                    }
                  }}
                  style={{
                    backgroundColor: sortType === 'distance' ? 'rgba(148, 163, 184, 0.2)' : 'transparent',
                    opacity: 0.7,
                  }}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  Distance (closest first)
                </button>
                
                {/* Clear Sort */}
                {sortType && (
                  <>
                    <hr className="my-2 border-secondary" />
                    <button
                      className="btn btn-dark text-start border-0 w-100 text-danger"
                      onClick={() => {
                        setSortType(null);
                      }}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Clear Sort
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event list */}
      <div className="mt-3">
        {visibleEvents.map((ev, i) => (
          <EventCard
            key={i}
            title={ev.title}
            timeLabel={ev.timeLabel}
            location={ev.location}
            attendees={ev.attendees}
            image={ev.image}
            borderColor={currentBorderColor}
            isJoined={isEventJoined(ev)}
            onJoin={() => handleJoinEvent(ev)}
          />
        ))}
      </div>

      {sortedEvents.length > 3 && (
        <div className="text-center mt-3">
          {!showAll ? (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowAll(true)}
            >
              Show more ▼
            </button>
          ) : (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowAll(false)}
            >
              Show less ▲
            </button>
          )}
        </div>
      )}
       {showNudge && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.7)",
            zIndex: 2000,
          }}
          onClick={() => setShowNudge(false)} // clicking backdrop closes
        >
          <div
            className="card"
            style={{
              width: "90%",
              maxWidth: "420px",
              backgroundColor: "#020617",
              borderRadius: "18px",
              border: `1px solid ${currentBorderColor}`,
              boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()} // prevent backdrop close
          >
            <div className="card-body d-flex">
              {/* Icon circle */}
              <div
                className="me-3 d-flex align-items-start justify-content-center"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#0f172a",
                    border: `1px solid ${currentBorderColor}`,
                    fontSize: "1.5rem",
                  }}
                >
                  ⚡
                </div>
              </div>

              {/* Text + actions */}
              <div style={{ flex: 1 }}>
                <h5 className="text-white fw-semibold mb-2">
                  {nudgeConfig.title}
                </h5>
                <p className="text-secondary mb-3" style={{ fontSize: "0.9rem" }}>
                  {nudgeConfig.text}
                </p>

                <div className="d-flex gap-2 justify-content-end">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowNudge(false)}
                  >
                    {nudgeConfig.secondaryLabel}
                  </button>

                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => {
                      setShowNudge(false);
                      if (energyBucket === "unknown") {
                        navigate("/"); // go back to energy selection
                      } else {
                        navigate("/home"); // or "/home" or "/home/calendar"
                      }
                    }}
                  >
                    {nudgeConfig.primaryLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}