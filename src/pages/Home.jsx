import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import QuoteCard from "../components/QuoteCard.jsx";
import { addEnrolledEvent, getEnrolledEvents } from "../utils/eventManager.js";

export default function Home() {

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  
  // State for advise modal
  const [isAdviseModalOpen, setIsAdviseModalOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const [showAll, setShowAll] = useState(false);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortType, setSortType] = useState(null);

  const [showNudge, setShowNudge] = useState(false);
  
  // Friends list (same as in Friendslist.jsx)
  const friendsList = [
    'Elynn Lee',
    'Oscar Dum',
    'Carlo Emilion',
    'Daniel Jay Park',
    'Liam Cortez',
    'Sophia Nguyen',
    'Ethan Morales',
    'Ava Becker',
    'Noah Tanaka',
    'Chloe Ricci',
    'Mateo Alvarez',
    'Lucas Hwang',
    'Isabella Fontaine',
  ];
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
      description: "A peaceful study session in the quiet section of the main library. Perfect for when you need to focus without distractions. We'll work on our own projects but share the calm, productive energy.",
    },
    {
      title: "Short Walk & Talk",
      timeLabel: "Tuesday at 5:00 PM",
      location: "Polyterrasse",
      attendees: ["Sophia"],
      image: "/images/events/polyterasse.jpg",
      description: "A gentle stroll around Polyterrasse to get some fresh air and light conversation. No pressure, just a relaxed way to connect and recharge. We'll keep it short and sweet.",
    },
    {
      title: "Chill Tea Break",
      timeLabel: "Wednesday at 4:00 PM",
      location: "ETH Alumni Lounge",
      attendees: ["Lucas", "Carlo"],
      image: "/images/events/tea.jpg",
      description: "A cozy tea break in the alumni lounge to unwind and chat casually. Bring your favorite mug and enjoy some quiet conversation. It's all about low-key vibes and good company.",
    },
    {
      title: "Solo Reading Corner",
      timeLabel: "Thursday at 6:30 PM",
      location: "ETH Main Library, Reading Nook",
      attendees: ["Chloe"],
      image: "/images/events/reading.jpg",
      description: "A super quiet reading session tucked away in a cozy corner of the library. We'll each bring our own book or article and just read in silence. Perfect if you want to be around someone without needing to talk much.",
    },
    {
     title: "Late-Afternoon Headphone Study",
      timeLabel: "Sunday at 4:00 PM",
      location: "HG Lounge Area",
     attendees: ["Mateo"],
      image: "/images/events/headphones.avif",
      description: "A calm study meetup where we both bring headphones and work on our laptops. No obligation to chat, just a gentle sense of company while we focus on our own tasks.",
    },
    {
      title: "Mindful Breathing Break",
      timeLabel: "Today at 3:30 PM",
      location: "Polyterrasse, Quiet Corner",
      attendees: ["Ava"],
      image: "/images/events/mindful.jpg",
      description: "A short, low-key break to sit, breathe, and decompress together. We'll find a quiet spot, enjoy the view, and do a few minutes of calm breathing—no intense conversation, just a soft reset for the day.",
    },

  ];

  // ⭐ LOW SOCIAL ENERGY
  const lowEnergyEvents = [
    {
      title: "Cozy Board Game Night",
      timeLabel: "Friday at 8:00 PM",
      location: "Friend's Flat, Kreis 6",
      attendees: ["Lucas", "Isabella"],
      image: "/images/events/boardgames.jpg",
      description: "A relaxed evening of board games in a cozy apartment setting. We'll play some chill games like Catan or Codenames while enjoying snacks and good conversation. Perfect for a low-energy social night.",
    },
    {
      title: "Calm Study Meetup",
      timeLabel: "Monday at 3:00 PM",
      location: "CAB Silent Room",
      attendees: ["Chloe"],
      image: "/images/events/study.png",
      description: "A peaceful study session in the silent room where we can work together quietly. We'll keep each other company while respecting the quiet atmosphere. Great for staying motivated without the pressure of conversation.",
    },
    {
      title: "Evening Stroll",
      timeLabel: "Friday at 6:00 PM",
      location: "Zürich Central",
      attendees: ["Ethan", "Ava"],
      image: "/images/events/walk-night.jpg",
      description: "A gentle evening walk through Zürich Central to enjoy the city lights and fresh air. We'll take it slow and chat about our week. It's a perfect way to unwind and connect without any big commitments.",
    },
    {
      title: "Quiet Library Study",
      timeLabel: "Tonight at 7:00 PM",
      location: "ETH Main Library",
      attendees: ["Ava"],
      image: "/images/events/quiet-study.jpg",
      description: "A focused study session in the main library's quiet section. We'll work on our assignments together but independently, sharing the productive atmosphere. Ideal for when you need to get work done in a calm environment.",
    },
    {
      title: "Gentle Yoga & Stretch",
      timeLabel: "Sunday at 10:00 AM",
      location: "ETH Hönggerberg Lawn",
      attendees: ["Sophia", "Chloe"],
      image: "/images/events/yoga.jpg",
      description: "A relaxed morning session of light stretching and beginner-friendly yoga. We'll move slowly, chat a bit between poses, and just enjoy a soft start to the day.",
    },
    {
      title: "Quiet Café Work Session",
      timeLabel: "Thursday at 5:30 PM",
      location: "Café Galileo, ETH Zentrum",
      attendees: ["Lucas"],
      image: "/images/events/cafe-work.jpg",
      description: "We'll grab a drink, find a quiet table, and work on our laptops. Low-pressure conversation, mostly focused on getting things done with a comforting background buzz.",
    },
    {
      title: "Sunset Bench Hangout",
      timeLabel: "Tonight at 7:30 PM",
      location: "Polyterrasse Viewpoint",
      attendees: ["Ethan", "Ava"],
      image: "/images/events/sunset.jpg",
      description: "A calm evening sitting on a bench, watching the sunset over Zürich. We'll talk if we feel like it or just enjoy the view together. No plans, no expectations—just a soft end to the day.",
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
      description: "A casual coffee meetup at Einstein Cafe to catch up and chat about classes, life, and everything in between. We'll grab our favorite drinks and find a cozy spot to relax. Perfect for a mid-morning social break.",
    },
    {
      title: "Lunch with Friends",
      timeLabel: "Wednesday at 12:30 PM",
      location: "ETH Mensa Polyterrasse",
      attendees: ["Mateo", "Isabella"],
      image: "/images/events/mensa.jpg",
      description: "A relaxed lunch at the Polyterrasse Mensa where we'll enjoy good food and great conversation. We'll discuss our week, share study tips, and just enjoy each other's company. It's a nice way to break up the day.",
    },
    {
      title: "Study Together",
      timeLabel: "Saturday at 6:00 PM",
      location: "ETH CAB Building",
      attendees: ["Ava", "Isabella", "Mateo", "Chloe"],
      image: "/images/events/study.png",
      description: "A collaborative study session where we'll work on our assignments together and help each other out when needed. We'll take breaks to chat and keep the energy positive. Great for staying motivated and getting things done.",
    },
    {
      title: "Lunch Crew",
      timeLabel: "Thursday at 12:30 PM",
      location: "ETH Mensa Polyterrasse",
      attendees: ["Mateo", "Chloe", "Isabella"],
      image: "/images/events/mensa2.jpg",
      description: "Our regular Thursday lunch meetup at the Mensa! We'll grab food together and catch up on the week. It's become a nice tradition that helps us stay connected and share what's going on in our lives.",
    },
    {
      title: "Problem-Solving Session",
      timeLabel: "Monday at 5:00 PM",
      location: "HG G Floor Study Area",
      attendees: ["Daniel", "Chloe", "Ava"],
      image: "/images/events/problem-solving.jpg",
      description: "A focused but friendly meetup to work through problem sets together. We'll discuss tricky questions, share approaches, and keep things supportive and collaborative.",
    },
    {
      title: "Mensa Dessert Break",
      timeLabel: "Friday at 2:30 PM",
      location: "ETH Mensa Polyterrasse",
      attendees: ["Isabella", "Mateo"],
      image: "/images/events/dessert.jpg",
      description: "A short afternoon meetup just for coffee, dessert, and a mid-day reset. We'll chat about how the week is going and enjoy something sweet before heading back to work.",
    },
    {
      title: "Campus Photo Walk",
      timeLabel: "Saturday at 3:00 PM",
      location: "ETH Zentrum Campus",
      attendees: ["Lucas", "Sophia"],
      image: "/images/events/photo-walk.webp",
      description: "A relaxed walk around campus to take photos of cool spots and views. We'll explore, chat, and maybe grab a drink afterward—social, but still easygoing and flexible.",
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
      description: "An energetic study sprint where we'll tackle our assignments together and push each other to stay focused. We'll work in focused blocks with short breaks to chat and recharge. Perfect for when you're feeling motivated and want to get a lot done.",
    },
    {
      title: "Evening Jog Crew",
      timeLabel: "Tonight at 8:00 PM",
      location: "ETH Hönggerberg",
      attendees: ["Liam", "Ethan", "Daniel"],
      image: "/images/events/run.jpg",
      description: "A fun evening jog around Hönggerberg campus to get some exercise and fresh air. We'll run at a comfortable pace and chat along the way. It's a great way to stay active and socialize at the same time.",
    },
    {
      title: "Casual Dinner Out",
      timeLabel: "Saturday at 7:00 PM",
      location: "Nooch Zurich",
      attendees: ["Oscar", "Daniel"],
      image: "/images/events/dinner.jpg",
      description: "A relaxed dinner at Nooch Zurich to enjoy some delicious Asian cuisine and good conversation. We'll try different dishes, share stories, and just have a great time together. Perfect for a Saturday night out.",
    },
    {
      title: "Big Study Group",
      timeLabel: "Tomorrow at 2:00 PM",
      location: "HG D1.2",
      attendees: ["Ava", "Isabella", "Mateo", "Chloe"],
      image: "/images/events/study.png",
      description: "A productive study session with the whole group where we'll work on assignments and help each other with difficult problems. We'll take regular breaks to chat and keep the atmosphere positive and motivating. Great for tackling challenging material together.",
    },
    {
      title: "Lunch Crew",
      timeLabel: "Thursday at 12:30 PM",
      location: "Mensa Polyterrasse",
      attendees: ["Chloe", "Mateo"],
      image: "/images/events/mensa2.jpg",
      description: "A lively lunch meetup at the Mensa where we'll enjoy good food and catch up on everything. We'll share what we're working on, discuss upcoming projects, and just enjoy each other's company. Always a highlight of the week!",
    },
    {
      title: "Brainstorm & Whiteboard Jam",
      timeLabel: "Wednesday at 5:00 PM",
      location: "ETH HG E Floor Seminar Room",
      attendees: ["Oscar", "Daniel", "Chloe", "Mateo"],
      image: "/images/events/whiteboard.jpg",
      description: "An energetic session where we grab a whiteboard and brainstorm ideas—projects, exams, or random side ideas. Expect lively discussion, quick sketches, and lots of shared thinking.",
    },
    {
      title: "City Exploration Walk",
      timeLabel: "Sunday at 1:00 PM",
      location: "Zürich Old Town (Neumarkt)",
      attendees: ["Ava", "Lucas", "Isabella"],
      image: "/images/events/city-walk.jpg",
      description: "A longer walk through Zürich’s old town, with time to explore hidden alleys, grab snacks, and talk. It's social and active, but still relaxed enough to go with the flow.",
    },
    {
      title: "Chill Games at CAB",
      timeLabel: "Friday at 7:00 PM",
      location: "CAB Common Room",
      attendees: ["Ethan", "Liam", "Carlo", "Sophia"],
      image: "/images/events/cardgames.webp",
      description: "An evening of light card and party games in a common room. Expect laughs, friendly competition, and breaks to chat—lively, but not overwhelming.",
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
      description: "A fun Friday night out at BQM Bar to celebrate the end of the week! We'll grab drinks, play some games, and enjoy the lively atmosphere. It's the perfect way to unwind and have a great time with friends. Let's make it a memorable night!",
    },
    {
      title: "ASVZ Group Workout",
      timeLabel: "Saturday at 6:00 PM",
      location: "ASVZ Polyterrasse",
      attendees: ["Carlo", "Oscar", "Ethan"],
      image: "/images/events/workout.jpg",
      description: "An energetic group workout session at ASVZ Polyterrasse! We'll push each other through a fun circuit training or weight session. It's all about staying active, having fun, and motivating each other. Perfect for when you're feeling pumped and ready to move!",
    },
    {
      title: "Volleyball Free Play",
      timeLabel: "Sunday at 3:00 PM",
      location: "ASVZ Höngg",
      attendees: ["Liam", "Ethan", "Lucas"],
      image: "/images/events/volleyball.png",
      description: "A competitive and fun volleyball session at ASVZ Höngg! We'll play some friendly matches, work on our skills, and enjoy the active energy. Whether you're experienced or just want to try it out, everyone's welcome. Let's get moving and have a blast!",
    },
    {
      title: "Big Study Group",
      timeLabel: "Tuesday at 2:00 PM",
      location: "ETH HG D1.2",
      attendees: ["Ava", "Isabella", "Mateo", "Chloe"],
      image: "/images/events/study.png",
      description: "An energetic and collaborative study session with the whole crew! We'll tackle challenging problems together, share knowledge, and keep the momentum high. With regular breaks for laughs and snacks, it's both productive and fun. Perfect for when you're feeling motivated and ready to conquer your work!",
    },
    {
      title: "Student Party Night",
      timeLabel: "Saturday at 10:00 PM",
      location: "StuZ Night Event",
      attendees: ["Lucas", "Isabella", "Ethan", "Sophia", "Daniel"],
      image: "/images/events/party.jpg",
      description: "A loud, high-energy student party with music, dancing, and a big crowd. We'll move between groups, meet new people, and enjoy the full weekend party vibe.",
    },
    {
      title: "Intense ASVZ HIIT Session",
      timeLabel: "Wednesday at 7:30 PM",
      location: "ASVZ Polyterrasse Gym",
      attendees: ["Carlo", "Liam", "Oscar"],
      image: "/images/events/hiit.avif",
      description: "A fast-paced HIIT workout where we really push ourselves. Lots of energy, encouragement, and endorphins—perfect if you're in the mood to sweat and feel pumped afterward.",
    },
    {
      title: "Bowling & Arcade Night",
      timeLabel: "Friday at 8:30 PM",
      location: "Bowling Center Zürich",
      attendees: ["Ava", "Mateo", "Chloe", "Daniel", "Lucas"],
      image: "/images/events/bowling.jpg",
      description: "A lively night of bowling, arcade games, and friendly trash talk. We'll cheer, compete, and laugh a lot—ideal for when you want something fun and energetic with the group.",
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
  const handleOpenEventModal = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  // this is where your original "join" logic lives now
  const handleSignUp = () => {
    if (!selectedEvent) return;
    addEnrolledEvent(selectedEvent);
    window.dispatchEvent(new Event("eventsUpdated"));
    handleCloseEventModal();
  };

  const handleAdvise = () => {
    setIsAdviseModalOpen(true);
    setSelectedFriends([]);
  };

  const handleCloseAdviseModal = () => {
    setIsAdviseModalOpen(false);
    setSelectedFriends([]);
  };

  const toggleFriendSelection = (friendName) => {
    setSelectedFriends((prev) => {
      if (prev.includes(friendName)) {
        return prev.filter((name) => name !== friendName);
      } else {
        return [...prev, friendName];
      }
    });
  };

  const handleSendAdvise = () => {
    if (!selectedEvent || selectedFriends.length === 0) return;

    const saved = localStorage.getItem("se_conversations");
    const conversations = saved ? JSON.parse(saved) : {};

    const now = new Date();
    const timestamp = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const adviseMessage = `Hey! I think you'd enjoy this event: "${selectedEvent.title}" at ${selectedEvent.location} on ${selectedEvent.timeLabel}.`;

    selectedFriends.forEach((friendName) => {
      const friendConversations = conversations[friendName] || [];
      const newMessage = {
        id: friendConversations.length + 1,
        text: adviseMessage,
        sender: "me",
        timestamp,
        date: now.toISOString(),
      };

      conversations[friendName] = [...friendConversations, newMessage];
    });

    localStorage.setItem("se_conversations", JSON.stringify(conversations));

    handleCloseAdviseModal();
    handleCloseEventModal();

    window.dispatchEvent(new Event("conversationsUpdated"));
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
  <div className="d-flex align-items-center justify-content-between mb-3">
    {/* Left: title + icon */}
    <div className="d-flex align-items-center">
      <i
        className="bi bi-calendar-event text-light me-2"
        style={{ fontSize: "20px" }}
      ></i>
      <h4 className="mb-0 text-white">Upcoming</h4>
    </div>

    {/* Right: round calendar button linking to Calendar page */}
    <button
      type="button"
      className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        padding: 0,
        borderColor: "rgba(148,163,184,0.5)",
        color: "#e5e7eb",
        backgroundColor: "transparent",
      }}
      onClick={() => navigate("/home/calendar")}  // adjust path if needed
      title="Open calendar"
    >
      <i className="bi bi-calendar4-week" style={{ fontSize: "18px" }}></i>
    </button>
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

      <div id="events-section" className="d-flex align-items-center justify-content-between mb-3 mt-4">
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
            // IMPORTANT: open modal instead of directly joining
            onJoin={() => handleOpenEventModal(ev)}
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

      {/* Event Details Modal */}
      {isEventModalOpen && selectedEvent && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 1050,
            padding: "1rem",
          }}
          onClick={handleCloseEventModal}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "350px",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "#020617",
              borderRadius: "18px",
              border: `1px solid ${currentBorderColor}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="d-flex align-items-center justify-content-between p-3"
              style={{ borderBottom: "1px solid rgba(148,163,184,0.2)" }}
            >
              <button
                onClick={handleCloseEventModal}
                className="btn btn-link p-0"
                style={{ textDecoration: "none", color: "#ffffff" }}
              >
                <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem" }}></i>
              </button>
              <h5 className="mb-0 fw-semibold text-white">
                {selectedEvent.title}
              </h5>
              <div style={{ width: "1.5rem" }}></div>
            </div>

            {/* Event Image */}
            <div
              style={{
                width: "100%",
                height: "200px",
                overflow: "hidden",
                backgroundColor: "#0f172a",
              }}
            >
              {selectedEvent.image ? (
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "100%", color: "#9ca3af", opacity: 0.3 }}
                >
                  <i className="bi bi-image" style={{ fontSize: "3rem" }} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Description */}
              <p
                className="text-light mb-4"
                style={{ fontSize: "1rem", lineHeight: "1.6", opacity: 0.9 }}
              >
                {selectedEvent.description}
              </p>

              {/* Social Proof */}
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="d-flex align-items-center mb-4">
                  <span
                    className="text-light me-2"
                    style={{ fontSize: "0.9rem", opacity: 0.8 }}
                  >
                    Advised by {selectedEvent.attendees[0]}
                    {selectedEvent.attendees.length > 1 &&
                      ` and ${
                        selectedEvent.attendees.length - 1
                      } other${
                        selectedEvent.attendees.length > 2 ? "s" : ""
                      }`}
                  </span>
                  <div className="d-flex align-items-center ms-2">
                    {selectedEvent.attendees.slice(0, 3).map((attendee, idx) => (
                      <div
                        key={attendee + idx}
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                        style={{
                          width: 28,
                          height: 28,
                          backgroundColor: currentBorderColor.replace(
                            /rgba?\(([^,]+),([^,]+),([^,]+).*\)/,
                            (m, r, g, b) => `rgba(${r},${g},${b},1)`
                          ),
                          marginLeft: idx === 0 ? 0 : -8,
                          border: "2px solid #020617",
                          fontSize: "0.75rem",
                        }}
                      >
                        {attendee[0]}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn w-50"
                  style={{
                    backgroundColor: "#0f172a",
                    color: "#f9fafb",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid rgba(148,163,184,0.3)",
                  }}
                  onClick={handleSignUp}
                >
                  Sign up
                </button>
                <button
                  className="btn w-50"
                  style={{
                    backgroundColor: "#0f172a",
                    color: "#f9fafb",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid rgba(148,163,184,0.3)",
                  }}
                  onClick={handleAdvise}
                >
                  Advise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advise Modal */}
      {isAdviseModalOpen && selectedEvent && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 1060,
            padding: "1rem",
          }}
          onClick={handleCloseAdviseModal}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "350px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#020617",
              borderRadius: "18px",
              border: `1px solid ${currentBorderColor}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="d-flex align-items-center justify-content-between p-3"
              style={{
                borderBottom: "1px solid rgba(148,163,184,0.2)",
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleCloseAdviseModal}
                className="btn btn-link p-0"
                style={{ textDecoration: "none", color: "#ffffff" }}
              >
                <i className="bi bi-arrow-left" style={{ fontSize: "1.5rem" }}></i>
              </button>
              <h5 className="mb-0 fw-semibold text-white">Send Advise</h5>
              <div style={{ width: "1.5rem" }}></div>
            </div>

            {/* Content - Scrollable */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="p-4" style={{ flexShrink: 0 }}>
                <p
                  className="text-light mb-3"
                  style={{ fontSize: "0.95rem", opacity: 0.9 }}
                >
                  Select friends to send advice about{" "}
                  <strong>{selectedEvent.title}</strong>
                </p>
              </div>

              {/* Friends List */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "0 1rem",
                  paddingBottom: "1rem",
                }}
              >
                {friendsList.map((friendName) => {
                  const isSelected = selectedFriends.includes(friendName);
                  return (
                    <div
                      key={friendName}
                      className="d-flex align-items-center p-2 mb-2 rounded"
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(148,163,184,0.1)"
                          : "transparent",
                        border: isSelected
                          ? `1px solid ${currentBorderColor}`
                          : "1px solid rgba(148,163,184,0.2)",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleFriendSelection(friendName)}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "36px",
                          height: "36px",
                          backgroundColor: currentBorderColor.replace(
                            /rgba?\(([^,]+),([^,]+),([^,]+).*\)/,
                            (m, r, g, b) => `rgba(${r},${g},${b},1)`
                          ),
                          color: "#020617",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        {friendName[0]}
                      </div>
                      <div className="flex-grow-1">
                        <div
                          className="text-white fw-semibold"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {friendName}
                        </div>
                      </div>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "22px",
                          height: "22px",
                          border: `2px solid ${
                            isSelected
                              ? currentBorderColor
                              : "rgba(148,163,184,0.5)"
                          }`,
                          backgroundColor: isSelected
                            ? currentBorderColor
                            : "transparent",
                        }}
                      >
                        {isSelected && (
                          <i
                            className="bi bi-check text-white"
                            style={{ fontSize: "0.7rem" }}
                          ></i>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Send Advise Button */}
            <div
              className="p-4"
              style={{
                borderTop: "1px solid rgba(148,163,184,0.2)",
                flexShrink: 0,
              }}
            >
              <button
                className="btn w-100"
                style={{
                  backgroundColor:
                    selectedFriends.length > 0
                      ? currentBorderColor.replace(
                          /rgba?\(([^,]+),([^,]+),([^,]+).*\)/,
                          (m, r, g, b) => `rgba(${r},${g},${b},1)`
                        )
                      : "#0f172a",
                  color: "#020617",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  fontWeight: 600,
                  border:
                    selectedFriends.length > 0
                      ? "none"
                      : "1px solid rgba(148,163,184,0.3)",
                  opacity: selectedFriends.length > 0 ? 1 : 0.5,
                  cursor:
                    selectedFriends.length > 0 ? "pointer" : "not-allowed",
                }}
                onClick={handleSendAdvise}
                disabled={selectedFriends.length === 0}
              >
                Send advise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nudge overlay */}
      {showNudge && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.7)",
            zIndex: 2000,
          }}
          onClick={() => setShowNudge(false)}
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body d-flex">
              <div className="me-3 d-flex align-items-start justify-content-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center pulse-icon"
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

              <div style={{ flex: 1 }}>
                <h5 className="text-white fw-semibold mb-2">
                  {nudgeConfig.title}
                </h5>
                <p
                  className="text-secondary mb-3"
                  style={{ fontSize: "0.9rem" }}
                >
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
                        navigate("/");
                      } else {
                    // already on /home – scroll to events section
                    const el = document.getElementById("events-section");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
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