import React, { useState, useRef, useEffect } from 'react'

export default function Chat({ friend, isOpen, onClose, messages = [], onNewMessage }) {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (inputMessage.trim() === '' || !friend || !onNewMessage) return

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    // Call the parent's handler to update conversations
    onNewMessage(friend.name, newMessage)
    setInputMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen || !friend) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        {/* Chat Modal */}
        <div
          style={{
            width: '100%',
            maxWidth: '390px',
            height: '100%',
            maxHeight: '90vh',
            background: '#050816',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px 20px 0 0',
            overflow: 'hidden',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              background: '#010c28ff',
              borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              onClick={onClose}
              className="btn btn-link text-light p-0"
              style={{ textDecoration: 'none', padding: '4px' }}
            >
              <i className="bi bi-arrow-left" style={{ fontSize: '1.5rem' }}></i>
            </button>
            <img
              src={friend.profileImage || '/images/profile.png'}
              alt={friend.name}
              className="rounded-circle"
              style={{ width: 40, height: 40, objectFit: 'cover' }}
            />
            <div className="flex-grow-1">
              <div className="fw-bold text-white" style={{ fontSize: '1rem' }}>
                {friend.name}
              </div>
              <div className="text-light opacity-75" style={{ fontSize: '0.75rem' }}>
                {friend.status || 'Online'}
              </div>
            </div>
            <button
              className="btn btn-link text-light p-0"
              style={{ textDecoration: 'none', padding: '4px' }}
            >
              <i className="bi bi-three-dots-vertical" style={{ fontSize: '1.25rem' }}></i>
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#050816',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '8px',
                }}
              >
                {message.sender === 'friend' && (
                  <img
                    src={friend.profileImage || '/images/profile.png'}
                    alt={friend.name}
                    className="rounded-circle"
                    style={{ width: 32, height: 32, objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: message.sender === 'me' 
                      ? '18px 18px 4px 18px' 
                      : '18px 18px 18px 4px',
                    background: message.sender === 'me'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#010c28ff',
                    border: message.sender === 'friend' ? '2px solid rgba(255, 255, 255, 0.25)' : 'none',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                  }}
                >
                  <div>{message.text}</div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      opacity: 0.7,
                      marginTop: '4px',
                      textAlign: message.sender === 'me' ? 'right' : 'left',
                    }}
                  >
                    {message.timestamp}
                  </div>
                </div>
                {message.sender === 'me' && (
                  <img
                    src="/images/profile.png"
                    alt="You"
                    className="rounded-circle"
                    style={{ width: 32, height: 32, objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              background: '#010c28ff',
              borderTop: '2px solid rgba(255, 255, 255, 0.25)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <button
              className="btn btn-link text-light p-0"
              style={{ textDecoration: 'none', padding: '4px', flexShrink: 0 }}
            >
              <i className="bi bi-paperclip" style={{ fontSize: '1.25rem' }}></i>
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '20px',
                padding: '10px 16px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            {inputMessage.trim() ? (
              <button
                onClick={handleSend}
                className="btn btn-link text-light p-0"
                style={{
                  textDecoration: 'none',
                  padding: '4px',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className="bi bi-send-fill" style={{ fontSize: '1rem' }}></i>
              </button>
            ) : (
              <button
                className="btn btn-link text-light p-0"
                style={{ textDecoration: 'none', padding: '4px', flexShrink: 0 }}
              >
                <i className="bi bi-emoji-smile" style={{ fontSize: '1.25rem' }}></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

