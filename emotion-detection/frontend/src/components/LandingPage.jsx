import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>বাংলা মুড অ্যাসিস্ট্যান্ট</h1>
        <div className="options-container">
          <Link to="/assistant" className="option-card">
            <div className="option-icon">🤖</div>
            <h2>Assistant</h2>
            <p>Chat with our Bangla voice assistant</p>
          </Link>
          <Link to="/learning" className="option-card">
            <div className="option-icon">📚</div>
            <h2>Incremental Learning</h2>
            <p>Improve model Bangla recognition skills</p>
          </Link>
          <Link to="/realtime-emotion" className="option-card">
            <div className="option-icon">🎙️</div>
            <h2>Real-Time Emotion Detection</h2>
            <p>Detect emotions instantly from your voice</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;