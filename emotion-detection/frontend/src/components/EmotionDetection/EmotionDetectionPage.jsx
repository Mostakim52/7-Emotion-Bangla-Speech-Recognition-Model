import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AudioRecorder from './AudioRecorder';
import EmotionDisplay from './EmotionDisplay';
import { ENDPOINTS } from '../../utils/config';
import './emotion-detection.css';

const EmotionDetectionPage = () => {
  const [currentEmotion, setCurrentEmotion] = useState('Press Start Listening to detect your mood');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useIncrementalModel, setUseIncrementalModel] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleModelSwitch = useCallback(async (modelType) => {
    try {
      const response = await fetch(ENDPOINTS.SWITCH_MODEL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model_type: modelType }),
      });

      if (!response.ok) {
        throw new Error('Failed to switch model');
      }

      setCurrentEmotion(`Switched to ${modelType} model. Press Start Listening to test.`);
    } catch (error) {
      console.error('Model switch failed:', error);
      setCurrentEmotion('Network error when switching model');
      setUseIncrementalModel((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    void handleModelSwitch(useIncrementalModel ? 'incremental' : 'original');
  }, [useIncrementalModel, handleModelSwitch]);

  const handleNewEmotion = (emotion) => {
    setIsProcessing(false);
    setCurrentEmotion(emotion);
  };

  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setIsProcessing(false);
      setCurrentEmotion('Recording stopped. Press Start Listening to resume.');
      return;
    }

    setIsListening(true);
    setCurrentEmotion('Starting up. Please wait...');
  };

  return (
    <div className="emotion-page">
      <div className="emotion-page-top-nav">
        <div className="emotion-page-nav-left">
          <Link to="/" className="emotion-page-home-button" aria-label="Go back to main page">
            ← Back to Main Page
          </Link>
          <div className="emotion-page-nav-hint">Need the main menu? Use this button anytime.</div>
        </div>
      </div>

      <p className="emotion-page-welcome-text">
        Welcome to our 7 Bangla Speech Emotion Recognition system. Click "Start Listening" and speak into the microphone to detect your mood!
      </p>

      <div className="emotion-page-model-selector">
        <h3 className="emotion-page-model-selector-title">Choose your model</h3>
        <button
          className={`emotion-page-model-toggle ${useIncrementalModel ? 'incremental' : 'normal'}`}
          onClick={() => setUseIncrementalModel((prev) => !prev)}
        >
          {useIncrementalModel ? 'Incremental' : 'Normal'}
        </button>
      </div>

      <div className="emotion-page-listening-controls">
        <button
          className={`emotion-page-listen-toggle ${isListening ? 'listening' : 'stopped'}`}
          onClick={handleToggleListening}
        >
          {isListening ? '⏹️ Stop Listening' : '🎤 Start Listening'}
        </button>
      </div>

      <EmotionDisplay emotion={currentEmotion} isProcessing={isProcessing} />

      <AudioRecorder
        onDetectionStart={() => setIsProcessing(true)}
        onNewEmotion={handleNewEmotion}
        isActive={isListening}
      />
    </div>
  );
};

export default EmotionDetectionPage;
