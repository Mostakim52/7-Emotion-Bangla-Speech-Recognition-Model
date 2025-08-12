import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ chats, currentChatId, onSelectChat, onNewChat, onDeleteChat }) => {
  const navigate = useNavigate();
  
  // Plus SVG Icon
  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
    </svg>
  );
  
  // Chat SVG Icon
  const ChatIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
    </svg>
  );
  
  // Delete SVG Icon
  const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
    </svg>
  );
  
  const handleTitleClick = () => {
    navigate('/');
  };
  
  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    onDeleteChat(chatId);
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header" onClick={handleTitleClick}>
        <h1 className="sidebar-title">BanglaMOOD</h1>
      </div>
      
      <button className="new-chat-btn" onClick={onNewChat}>
        <PlusIcon />
        <span>New Chat</span>
      </button>
      
      <div className="chat-history">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            className={`chat-history-item ${chat.id === currentChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="chat-icon">
              <ChatIcon />
            </div>
            <div className="chat-title">{chat.title}</div>
            <button 
              className="delete-chat-btn"
              onClick={(e) => handleDeleteChat(e, chat.id)}
              title="Delete chat"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;