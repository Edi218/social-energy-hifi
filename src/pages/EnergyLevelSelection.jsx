import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'

export default function EnergyLevelSelection() {
  const [energyLevel, setEnergyLevel] = useState(1)
  const [hasSelectedLevel, setHasSelectedLevel] = useState(false)
  const navigate = useNavigate()

  const handleSkip = () => {
  // remove any previously selected level
  window.localStorage.removeItem("se_energy_level");
  // (optional) also clear conversations / events if you want a clean test state
  // window.localStorage.removeItem("se_conversations");
  // window.localStorage.removeItem("se_enrolled_events");

  navigate("/home");
};

  const handleContinue = () => {
    navigate('/home')
  }

  const getLevelColor = (level) => {
    if (level === 1) return '#dc3545' // red
    if (level === 2) return '#fd7e14' // orange
    if (level === 3) return '#ffc107' // yellow
    if (level === 4) return '#20c997' // light green
    if (level === 5) return '#198754' // dark green
    return '#6c757d' // gray
  }

  const getMoodEmoji = (level) => {
    const moods = {
      1: '😴', // Very Low - tired/sleepy
      2: '😑', // Low - unamused
      3: '😊', // Medium - slight smile
      4: '😁', // High - big smile
      5: '🤩'  // Very High - star-struck/excited
    }
    return moods[level] || '😊'
  }

  const getLevelLabel = (level) => {
    const labels = {
      1: 'Very Low',
      2: 'Low',
      3: 'Medium',
      4: 'High',
      5: 'Very High'
    }
    return labels[level] || ''
  }

  const handleLevelClick = (level) => {
    setEnergyLevel(level)
    setHasSelectedLevel(true)
    window.localStorage.setItem('se_energy_level', String(level))
  }


  return (
    
        <main className="flex-grow-1 px-3 py-4 d-flex flex-column justify-content-center">
          <h1 className="text-center mb-5" style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#f8fafc', lineHeight: '1.3' }}>
            Estimate your current social energy level!
          </h1>

          {/* Clickable Mood Indicators */}
          <div
            className="d-flex justify-content-center align-items-start mb-5"
            style={{ gap: '0.75rem' }}
          >
            {[1, 2, 3, 4, 5].map((level) => {
              const color = getLevelColor(level)
              const isSelected = level === energyLevel
              
              return (
                <div
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flex: '0 0 auto',
                    padding: '0.25rem',
                  }}
                >
                  {/* Mood Face */}
                  <div
                    className = "pulse-icon"
                    style={{ 
                      width: isSelected ? '64px' : '56px',
                      height: isSelected ? '64px' : '56px',
                      borderRadius: '50%',
                      background: isSelected ? `${color}20` : 'transparent',
                      border: `3px solid ${isSelected ? color : '#495057'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isSelected ? '2.5rem' : '2rem',
                      transition: 'all 0.3s ease',
                      boxShadow: isSelected ? `0 0 0 4px ${color}30, 0 4px 12px ${color}40` : 'none',
                      marginBottom: '0.5rem',
                      opacity: isSelected ? 1 : 0.6,
                    }}
                  >
                    {getMoodEmoji(level)}
                  </div>
                  {/* Level Label */}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: isSelected ? '#f8fafc' : '#6c757d',
                      fontWeight: isSelected ? '600' : '400',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {getLevelLabel(level)}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="button-container d-flex justify-content-center gap-3 mt-4">
            <button
              onClick={handleSkip}
              className="btn"
              style={{
                borderRadius: '12px',
                padding: '0.75rem 3rem',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: '#212529',
                color: '#f8fafc',
                border: '2px solid #495057',
                minWidth: '150px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#343a40'
                e.target.style.borderColor = '#6c757d'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#212529'
                e.target.style.borderColor = '#495057'
              }}
            >
              Skip
            </button>
            {hasSelectedLevel && (
              <button
                onClick={handleContinue}
                className="btn"
                style={{
                  borderRadius: '12px',
                  padding: '0.75rem 3rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backgroundColor: '#212529',
                  color: '#f8fafc',
                  border: '2px solid #495057',
                  minWidth: '150px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#343a40'
                  e.target.style.borderColor = '#6c757d'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#212529'
                  e.target.style.borderColor = '#495057'
                }}
              >
                Continue
              </button>
            )}
          </div>
        </main>
  )
}

