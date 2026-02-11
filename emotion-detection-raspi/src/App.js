import React, { useState } from 'react';
import EmotionDisplay from './components/EmotionDisplay';
import AudioRecorder from './components/AudioRecorder';
import './App.css';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState('Say something to detect your mood');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNewEmotion = (emotion) => {
    setIsProcessing(false);
    setCurrentEmotion(emotion);
  };

  return (
    <div className="app">
      <div className="header">
        <p className="welcome-text">Welcome to our 7 class emotion detection system. Speak on the mic to test it out!</p>
        {<h1>Raspberry Pi Edition</h1>}
      </div>
      <EmotionDisplay emotion={currentEmotion} isProcessing={isProcessing} />
      <AudioRecorder 
        onDetectionStart={() => setIsProcessing(true)}
        onNewEmotion={handleNewEmotion}
      />
    </div>
  );
}

export default App;
