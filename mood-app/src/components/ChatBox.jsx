import React, { useEffect, useRef } from 'react'

const ChatBox = ({ messages }) => {
  const chatBoxRef = useRef(null)

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div id="chatBox" className="chat-box" ref={chatBoxRef}>
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.type}`}>
          {message.type === 'bot' && (
            <div className="avatar">🤖</div>
          )}
          <div className="content">{message.text}</div>
          {message.type === 'user' && (
            <div className="avatar">👤</div>
          )}
        </div>
      ))}
      {messages.length === 0 && (
        <div className="welcome-message">
          <div className="welcome-content">
            <h2>বাংলা মুড অ্যাসিস্ট্যান্ট</h2>
            <p>Start a conversation by clicking the microphone button and speaking in Bangla!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBox