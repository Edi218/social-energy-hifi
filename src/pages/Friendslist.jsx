import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Friend from '../components/Friend.jsx'
import Chat from '../components/Chat.jsx'

export default function Friendslist() {
  const navigate = useNavigate()
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const friendsData = [
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

  // Helper function to create dates for initial conversations
  const createDate = (daysAgo, hours = 12, minutes = 0) => {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  // Conversations are stored here in the Friendslist component
  // Each friend has their own unique conversation history
  // Key: friend's name, Value: array of message objects
  const [conversations, setConversations] = useState({
    'Elynn Lee': [
      { id: 1, text: 'Hey! Are you free this weekend?', sender: 'friend', timestamp: '09:15', date: createDate(0, 9, 15) },
      { id: 2, text: 'Yes, I should be! What\'s up?', sender: 'me', timestamp: '09:18', date: createDate(0, 9, 18) },
      { id: 3, text: 'Want to go hiking? The weather looks perfect', sender: 'friend', timestamp: '09:20', date: createDate(0, 9, 20) },
      { id: 4, text: 'That sounds amazing! I\'d love to', sender: 'me', timestamp: '09:22', date: createDate(0, 9, 22) },
      { id: 5, text: 'Great! Let\'s meet at the trailhead at 8am Saturday', sender: 'friend', timestamp: '09:25', date: createDate(0, 9, 25) },
    ],
    'Oscar Dum': [
      { id: 1, text: 'Sorry I missed your call earlier', sender: 'friend', timestamp: '14:30', date: createDate(0, 14, 30) },
      { id: 2, text: 'No worries! I was just checking in', sender: 'me', timestamp: '14:32', date: createDate(0, 14, 32) },
      { id: 3, text: 'I\'m swamped with this project deadline', sender: 'friend', timestamp: '14:35', date: createDate(0, 14, 35) },
      { id: 4, text: 'I totally get it. Let me know if you need help', sender: 'me', timestamp: '14:37', date: createDate(0, 14, 37) },
      { id: 5, text: 'Thanks! I might take you up on that', sender: 'friend', timestamp: '14:40', date: createDate(0, 14, 40) },
    ],
    'Carlo Emilion': [
      { id: 1, text: 'Come join the football event tonight with me!', sender: 'friend', timestamp: '10:30', date: createDate(0, 10, 30) },
      { id: 2, text: 'What time does it start?', sender: 'me', timestamp: '10:32', date: createDate(0, 10, 32) },
      { id: 3, text: '7pm at the sports center. You in?', sender: 'friend', timestamp: '10:34', date: createDate(0, 10, 34) },
      { id: 4, text: 'Perfect! See you there', sender: 'me', timestamp: '10:36', date: createDate(0, 10, 36) },
      { id: 5, text: 'Awesome! Bring your energy! ⚽', sender: 'friend', timestamp: '10:38', date: createDate(0, 10, 38) },
    ],
    'Daniel Jay Park': [
      { id: 1, text: 'Hey, can we reschedule our study session?', sender: 'me', timestamp: '23:45', date: createDate(0, 23, 45) },
      { id: 2, text: 'Sure, when works for you?', sender: 'friend', timestamp: '00:10', date: createDate(0, 0, 10) },
      { id: 3, text: 'How about tomorrow afternoon?', sender: 'me', timestamp: '00:12', date: createDate(0, 0, 12) },
      { id: 4, text: 'That works! Library at 2pm?', sender: 'friend', timestamp: '00:13', date: createDate(0, 0, 13) },
    ],
    'Liam Cortez': [
      { id: 1, text: 'Did you finish the assignment?', sender: 'friend', timestamp: '16:20', date: createDate(1, 16, 20) },
      { id: 2, text: 'Almost done! Just need to review it', sender: 'me', timestamp: '16:25', date: createDate(1, 16, 25) },
      { id: 3, text: 'Cool, want to compare answers?', sender: 'friend', timestamp: '16:27', date: createDate(1, 16, 27) },
      { id: 4, text: 'Yeah, let\'s do that. Coffee shop in 30?', sender: 'me', timestamp: '16:30', date: createDate(1, 16, 30) },
      { id: 5, text: 'Perfect! See you there', sender: 'friend', timestamp: '16:32', date: createDate(1, 16, 32) },
    ],
    'Sophia Nguyen': [
      { id: 1, text: 'Thanks for helping me with the presentation!', sender: 'friend', timestamp: '11:15', date: createDate(1, 11, 15) },
      { id: 2, text: 'Of course! How did it go?', sender: 'me', timestamp: '11:20', date: createDate(1, 11, 20) },
      { id: 3, text: 'Really well! The professor loved it', sender: 'friend', timestamp: '11:22', date: createDate(1, 11, 22) },
      { id: 4, text: 'That\'s awesome! So happy for you 🎉', sender: 'me', timestamp: '11:25', date: createDate(1, 11, 25) },
      { id: 5, text: 'We should celebrate! Dinner tonight?', sender: 'friend', timestamp: '11:28', date: createDate(1, 11, 28) },
    ],
    'Ethan Morales': [
      { id: 1, text: 'On Campus right now. Let\'s hang out!', sender: 'friend', timestamp: '15:10', date: createDate(1, 15, 10) },
      { id: 2, text: 'Where are you?', sender: 'me', timestamp: '15:12', date: createDate(1, 15, 12) },
      { id: 3, text: 'At the main library. Come find me!', sender: 'friend', timestamp: '15:15', date: createDate(1, 15, 15) },
      { id: 4, text: 'On my way! Be there in 5', sender: 'me', timestamp: '15:18', date: createDate(1, 15, 18) },
    ],
    'Ava Becker': [
      { id: 1, text: 'Hey! Long time no see', sender: 'friend', timestamp: '12:00', date: createDate(1, 12, 0) },
      { id: 2, text: 'I know! How have you been?', sender: 'me', timestamp: '12:05', date: createDate(1, 12, 5) },
      { id: 3, text: 'Good! Just busy with classes. You?', sender: 'friend', timestamp: '12:08', date: createDate(1, 12, 8) },
      { id: 4, text: 'Same here. We should catch up soon', sender: 'me', timestamp: '12:10', date: createDate(1, 12, 10) },
      { id: 5, text: 'Definitely! This weekend maybe?', sender: 'friend', timestamp: '12:12', date: createDate(1, 12, 12) },
    ],
    'Noah Tanaka': [
      { id: 1, text: 'Can you send me the notes from today?', sender: 'me', timestamp: '17:45', date: createDate(2, 17, 45) },
      { id: 2, text: 'Sure! I\'ll send them in a bit', sender: 'friend', timestamp: '18:00', date: createDate(2, 18, 0) },
      { id: 3, text: 'Thanks! I really appreciate it', sender: 'me', timestamp: '18:02', date: createDate(2, 18, 2) },
      { id: 4, text: 'No problem! Just uploaded them', sender: 'friend', timestamp: '18:15', date: createDate(2, 18, 15) },
    ],
    'Chloe Ricci': [
      { id: 1, text: 'Are you going to the concert next week?', sender: 'friend', timestamp: '19:30', date: createDate(2, 19, 30) },
      { id: 2, text: 'I haven\'t decided yet. Are you?', sender: 'me', timestamp: '19:35', date: createDate(2, 19, 35) },
      { id: 3, text: 'Yes! Got tickets yesterday. You should come!', sender: 'friend', timestamp: '19:37', date: createDate(2, 19, 37) },
      { id: 4, text: 'Sounds fun! Let me check my schedule', sender: 'me', timestamp: '19:40', date: createDate(2, 19, 40) },
    ],
    'Mateo Alvarez': [
      { id: 1, text: 'Happy birthday! 🎂', sender: 'friend', timestamp: '08:00', date: createDate(3, 8, 0) },
      { id: 2, text: 'Thank you so much!', sender: 'me', timestamp: '08:05', date: createDate(3, 8, 5) },
      { id: 3, text: 'Any plans for today?', sender: 'friend', timestamp: '08:10', date: createDate(3, 8, 10) },
      { id: 4, text: 'Just a quiet dinner with family', sender: 'me', timestamp: '08:12', date: createDate(3, 8, 12) },
      { id: 5, text: 'Nice! Enjoy your day!', sender: 'friend', timestamp: '08:15', date: createDate(3, 8, 15) },
    ],
    'Lucas Hwang': [
      { id: 1, text: 'Hey, did you see the new movie that came out?', sender: 'me', timestamp: '20:00', date: createDate(7, 20, 0) },
      { id: 2, text: 'Not yet! Is it good?', sender: 'friend', timestamp: '20:05', date: createDate(7, 20, 5) },
      { id: 3, text: 'Really good! We should watch it together', sender: 'me', timestamp: '20:07', date: createDate(7, 20, 7) },
      { id: 4, text: 'I\'m down! This weekend?', sender: 'friend', timestamp: '20:10', date: createDate(7, 20, 10) },
    ],
    'Isabella Fontaine': [
      { id: 1, text: 'Thanks for the book recommendation!', sender: 'friend', timestamp: '13:20', date: createDate(14, 13, 20) },
      { id: 2, text: 'You\'re welcome! Did you start reading it?', sender: 'me', timestamp: '13:25', date: createDate(14, 13, 25) },
      { id: 3, text: 'Yes! Already on chapter 3. It\'s amazing!', sender: 'friend', timestamp: '13:28', date: createDate(14, 13, 28) },
      { id: 4, text: 'Right? It gets even better', sender: 'me', timestamp: '13:30', date: createDate(14, 13, 30) },
      { id: 5, text: 'Can\'t wait to discuss it when I finish!', sender: 'friend', timestamp: '13:32', date: createDate(14, 13, 32) },
    ],
  })

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend)
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setSelectedFriend(null)
  }

  // Function to parse timestamp string to Date object
  const parseTimestamp = (timestampStr) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Handle time format like "09:15" or "14:30"
    if (timestampStr.match(/^\d{1,2}:\d{2}$/)) {
      const [hours, minutes] = timestampStr.split(':').map(Number)
      const date = new Date(today)
      date.setHours(hours, minutes, 0, 0)
      // If time is in the future (like 00:13), assume it's from yesterday
      if (date > now) {
        date.setDate(date.getDate() - 1)
      }
      return date
    }
    
    // Handle relative times
    if (timestampStr.includes('Yesterday')) {
      const date = new Date(today)
      date.setDate(date.getDate() - 1)
      date.setHours(12, 0, 0, 0) // Default to noon
      return date
    }
    
    if (timestampStr.includes('days ago')) {
      const daysMatch = timestampStr.match(/(\d+)\s*days?\s*ago/)
      const days = daysMatch ? parseInt(daysMatch[1]) : 1
      const date = new Date(today)
      date.setDate(date.getDate() - days)
      date.setHours(12, 0, 0, 0)
      return date
    }
    
    if (timestampStr.includes('week')) {
      const weekMatch = timestampStr.match(/(\d+)\s*week/)
      const weeks = weekMatch ? parseInt(weekMatch[1]) : 1
      const date = new Date(today)
      date.setDate(date.getDate() - (weeks * 7))
      date.setHours(12, 0, 0, 0)
      return date
    }
    
    // Default to a week ago if we can't parse
    return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  // Function to get the last message date for a friend
  const getLastMessageDate = (friendName) => {
    const friendMessages = conversations[friendName]
    if (!friendMessages || friendMessages.length === 0) {
      return null
    }
    
    // Get the last message
    const lastMessage = friendMessages[friendMessages.length - 1]
    
    // If the message has a Date object, use it
    if (lastMessage.date instanceof Date) {
      return lastMessage.date
    }
    
    // Otherwise parse the timestamp string
    return parseTimestamp(lastMessage.timestamp)
  }

  // Sort friends by most recent message (most recent first)
  const sortedFriends = useMemo(() => {
    return [...friendsData].sort((a, b) => {
      const dateA = getLastMessageDate(a.name)
      const dateB = getLastMessageDate(b.name)
      
      // Friends with messages come before friends without
      if (dateA && !dateB) return -1
      if (!dateA && dateB) return 1
      if (!dateA && !dateB) return 0
      
      // Sort by date (most recent first)
      return dateB - dateA
    })
  }, [conversations])

  // Function to update conversations when a new message is sent
  const handleNewMessage = (friendName, newMessage) => {
    // Add actual Date object to the message
    const messageWithDate = {
      ...newMessage,
      date: new Date()
    }
    
    setConversations(prev => ({
      ...prev,
      [friendName]: [...(prev[friendName] || []), messageWithDate]
    }))
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        {/*<button 
          onClick={() => navigate('/home/profile')}
          className="btn btn-link text-light p-0"
          style={{ textDecoration: 'none' }}
        >
          <i className="bi bi-arrow-left" style={{ fontSize: '1.5rem' }}></i>
        </button>*/}
        <h2 className="mb-0 text-center flex-grow-1" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Your Friendlist
        </h2>
        {/*<img 
          src="/images/profile.png" 
          alt="Profile" 
          className="rounded-circle" 
          style={{ width: 32, height: 32, objectFit: "cover" }}
        />*/}
      </div>

      {/* Friends List */}
      <div>
        {sortedFriends.map((friend, index) => {
          // Get the last message to show preview
          const friendMessages = conversations[friend.name] || []
          const lastMessage = friendMessages[friendMessages.length - 1]
          
          // Determine what to show: last message text, status, or default message
          let displayMessage = friend.message || friend.status
          let displayTimestamp = friend.timestamp
          
          if (lastMessage) {
            // Show last message text if it exists
            if (lastMessage.text) {
              displayMessage = lastMessage.text
            }
            // Update timestamp based on last message date - use original format
            if (lastMessage.date) {
              const now = new Date()
              const msgDate = lastMessage.date
              const diffMs = now - msgDate
              const diffDays = Math.floor(diffMs / 86400000)
              const diffWeeks = Math.floor(diffDays / 7)
              
              // Format timestamp in original style
              if (diffDays === 0) {
                // Today - show time like "13:04"
                const hours = msgDate.getHours().toString().padStart(2, '0')
                const minutes = msgDate.getMinutes().toString().padStart(2, '0')
                displayTimestamp = `${hours}:${minutes}`
              } else if (diffDays === 1) {
                displayTimestamp = 'Yesterday'
              } else if (diffDays < 7) {
                displayTimestamp = `${diffDays} days ago`
              } else if (diffWeeks === 1) {
                displayTimestamp = '1 week ago'
              } else {
                displayTimestamp = `${diffWeeks} weeks ago`
              }
            } else {
              displayTimestamp = lastMessage.timestamp
            }
          }
          
          return (
            <Friend
              key={friend.name}
              name={friend.name}
              status={friend.status}
              message={displayMessage}
              profileImage={friend.profileImage}
              timestamp={displayTimestamp}
              onClick={() => handleFriendClick(friend)}
            />
          )
        })}
      </div>

      {/* Chat Modal */}
      <Chat
        friend={selectedFriend}
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        messages={selectedFriend ? conversations[selectedFriend.name] || [] : []}
        onNewMessage={handleNewMessage}
      />
    </div>
  )
}
