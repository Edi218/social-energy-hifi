import React from 'react'
import { useNavigate } from 'react-router-dom'
import Friend from '../components/Friend.jsx'

export default function Friendslist() {
  const navigate = useNavigate()

  const friends = [
    { name: 'Elynn Lee', status: 'Available', timestamp: '13:04' },
    { name: 'Oscar Dum', status: 'Busy', timestamp: '12:39' },
    { name: 'Carlo Emilion', message: 'Come join the football event tonight with me!', timestamp: '10:34' },
    { name: 'Daniel Jay Park', status: 'Do Not Disturb', timestamp: '00:13' },
    { name: 'Liam Cortez', status: 'Available', timestamp: 'Yesterday' },
    { name: 'Sophia Nguyen', status: 'Busy', timestamp: 'Yesterday' },
    { name: 'Ethan Morales', message: 'On Campus right now. Let\'s hang out!', timestamp: 'Yesterday' },
    { name: 'Ava Becker', status: 'Available', timestamp: 'Yesterday' },
    { name: 'Noah Tanaka', status: 'Busy', timestamp: '2 days ago' },
    { name: 'Chloe Ricci', status: 'Available', timestamp: '2 days ago' },
    { name: 'Mateo Alvarez', status: 'Available', timestamp: '3 days ago' },
    { name: 'Lucas Hwang', status: 'Available', timestamp: '1 week ago' },
    { name: 'Isabella Fontaine', status: 'Available', timestamp: '1 week ago' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button 
          onClick={() => navigate('/home/profile')}
          className="btn btn-link text-light p-0"
          style={{ textDecoration: 'none' }}
        >
          <i className="bi bi-arrow-left" style={{ fontSize: '1.5rem' }}></i>
        </button>
        <h2 className="mb-0 text-center flex-grow-1" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          Your Friendlist
        </h2>
        <img 
          src="/images/profile.png" 
          alt="Profile" 
          className="rounded-circle" 
          style={{ width: 32, height: 32, objectFit: "cover" }}
        />
      </div>

      {/* Friends List */}
      <div>
        {friends.map((friend, index) => (
          <Friend
            key={index}
            name={friend.name}
            status={friend.status}
            message={friend.message}
            profileImage={friend.profileImage}
            timestamp={friend.timestamp}
          />
        ))}
      </div>
    </div>
  )
}
