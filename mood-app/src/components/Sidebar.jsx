import React from 'react'

const Sidebar = ({ chats, currentChatId, onSelectChat, onNewChat }) => {
  return (
    <div className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>
      <div className="chat-history">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            className={`chat-history-item ${chat.id === currentChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="chat-icon">💬</div>
            <div className="chat-title">{chat.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar