// Utility functions to manage enrolled events

export const getEnrolledEvents = () => {
  const stored = window.localStorage.getItem('se_enrolled_events');
  return stored ? JSON.parse(stored) : [];
};

export const addEnrolledEvent = (event) => {
  const events = getEnrolledEvents();
  // Check if event already exists (by title and timeLabel)
  const exists = events.some(
    (e) => e.title === event.title && e.timeLabel === event.timeLabel
  );
  if (!exists) {
    events.push(event);
    window.localStorage.setItem('se_enrolled_events', JSON.stringify(events));
  }
  return events;
};

export const removeEnrolledEvent = (eventTitle, timeLabel) => {
  const events = getEnrolledEvents();
  const filtered = events.filter(
    (e) => !(e.title === eventTitle && e.timeLabel === timeLabel)
  );
  window.localStorage.setItem('se_enrolled_events', JSON.stringify(filtered));
  return filtered;
};

// Parse timeLabel to get day and time for calendar
export const parseEventTime = (timeLabel) => {
  // Examples: "Monday at 7:00 PM", "Today at 4:00 PM", "Tonight at 8:00 PM", "Friday at 8:00 PM"
  const dayMap = {
    'monday': 'Mon',
    'tuesday': 'Tue',
    'wednesday': 'Wed',
    'thursday': 'Thu',
    'friday': 'Fri',
    'saturday': 'Sat',
    'sunday': 'Sun',
  };

  const lower = timeLabel.toLowerCase();
  let day = null;
  let time = null;
  let hour24 = null; // 24-hour format for easier matching

  // Check for day names
  for (const [fullDay, shortDay] of Object.entries(dayMap)) {
    if (lower.includes(fullDay)) {
      day = shortDay;
      break;
    }
  }

  // If no day found, try to determine from "today", "tonight", "tomorrow"
  if (!day) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    if (lower.includes('today')) {
      day = dayNames[dayOfWeek];
    } else if (lower.includes('tonight')) {
      day = dayNames[dayOfWeek];
    } else if (lower.includes('tomorrow')) {
      day = dayNames[(dayOfWeek + 1) % 7];
    }
  }

  // Extract time (format: "7:00 PM", "4:00 PM", etc.)
  const timeMatch = timeLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();
    
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    hour24 = hours; // Store 24-hour format
    
    // Convert to display format (e.g., "7 PM", "4 PM")
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    time = `${displayHour} ${ampm}`;
  }

  return { day, time, hour24 };
};

