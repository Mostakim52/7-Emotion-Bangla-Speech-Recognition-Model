import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AssistantApp from './components/AssistantApp/AssistantApp';
import LearningPage from './components/Incremental/LearningPage';
import EmotionDetectionPage from './components/EmotionDetection/EmotionDetectionPage';
import './styles.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('route-fade-in');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('route-fade-out');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'route-fade-out') {
      setDisplayLocation(location);
      setTransitionStage('route-fade-in');
    }
  };

  return (
    <div className={`route-shell ${transitionStage}`} onAnimationEnd={handleAnimationEnd}>
      <Routes location={displayLocation}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assistant" element={<AssistantApp />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/realtime-emotion" element={<EmotionDetectionPage />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;