import { useEffect, useRef, useCallback } from 'react';
import { ENDPOINTS } from '../utils/config';

const AudioRecorder = ({ onDetectionStart, onNewEmotion }) => {
  const isMountedRef = useRef(true);
  const isRecordingRef = useRef(false);
  const timeoutRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

  const RECORDING_DURATION = 3000;
  const DELAY_BETWEEN_RECORDINGS = 0;
  // Just use the Pi's hostname - works across all networks
  const getPiIP = () => {
    return 'raspberrypi.local'; // No IP detection needed!
  };

  // Use in your React component
  const API_BASE_URL = `http://${getPiIP()}:5000`;

  const API_ENDPOINT = `https://localhost:5000/detect-emotion`;
  
  // Voice activity detection thresholds
  const MIN_VOLUME_THRESHOLD = 0.005;
  const MIN_SPEECH_DURATION = 1.0;
  const SILENCE_THRESHOLD = 0.005;

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const analyzeAudioBlob = useCallback(async (audioBlob) => {
    try {
      console.log('🔍 Analyzing audio for voice activity...');
      
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      
      let rms = 0;
      let speechSamples = 0;
      const sampleRate = audioBuffer.sampleRate;
      const windowSize = Math.floor(sampleRate * 0.1);
      
      for (let i = 0; i < channelData.length; i += windowSize) {
        let windowRms = 0;
        const windowEnd = Math.min(i + windowSize, channelData.length);
        
        for (let j = i; j < windowEnd; j++) {
          windowRms += channelData[j] * channelData[j];
        }
        
        windowRms = Math.sqrt(windowRms / (windowEnd - i));
        
        if (windowRms > SILENCE_THRESHOLD) {
          speechSamples++;
          rms += windowRms;
        }
      }
      
      const averageRms = speechSamples > 0 ? rms / speechSamples : 0;
      const speechDuration = (speechSamples * windowSize) / sampleRate;
      
      console.log(`📊 Audio analysis: RMS=${averageRms.toFixed(4)}, Speech duration=${speechDuration.toFixed(2)}s`);
      
      const hasVoiceActivity = averageRms > MIN_VOLUME_THRESHOLD && speechDuration > MIN_SPEECH_DURATION;
      
      return {
        hasVoiceActivity,
        averageRms,
        speechDuration,
        totalDuration: channelData.length / sampleRate
      };
      
    } catch (error) {
      console.error('❌ Error analyzing audio:', error);
      return { hasVoiceActivity: true, error: true };
    }
  }, [MIN_VOLUME_THRESHOLD, MIN_SPEECH_DURATION, SILENCE_THRESHOLD]);

  const sendAudioToBackend = useCallback(async (audioBlob) => {
    try {
      console.log('🚀 Sending audio to backend...');
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(ENDPOINTS.DETECT_EMOTION, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Backend response:', result);

      if (isMountedRef.current && result.emotion) {
        onNewEmotion(result.emotion);
      } else if (isMountedRef.current) {
        console.warn('⚠️ No emotion in response');
        onNewEmotion('No emotion detected');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      if (isMountedRef.current) {
        onNewEmotion(error.name === 'AbortError' ? 'Request timeout' : 'Network error');
      }
    }
  }, [onNewEmotion]);

  // ✅ FIXED: Define scheduleNextRecording function
  const scheduleNextRecording = useCallback(() => {
    if (!isMountedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    console.log(`⏳ Waiting ${DELAY_BETWEEN_RECORDINGS}ms before next recording...`);

    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        console.log('🔄 Starting next recording cycle');
        recordAudio();
      }
    }, DELAY_BETWEEN_RECORDINGS);
  }, [DELAY_BETWEEN_RECORDINGS]);

  // ✅ FIXED: Define recordAudio function
  const recordAudio = useCallback(async () => {
    if (!isMountedRef.current || isRecordingRef.current) return;

    isRecordingRef.current = true;

    try {
      console.log('🎤 Starting audio recording...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 16000
        }
      });

      streamRef.current = stream;
      const mimeType = 'audio/webm';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log(`📊 Audio chunk received: ${event.data.size} bytes`);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('⏹️ Recording stopped, analyzing audio...');
        try {
          stream.getTracks().forEach(track => track.stop());
          streamRef.current = null;

          if (chunks.length === 0) {
            console.warn('⚠️ No audio data recorded');
            if (isMountedRef.current) {
              onNewEmotion('No audio detected');
            }
            return;
          }

          const audioBlob = new Blob(chunks, { type: mimeType });
          console.log(`📦 Audio blob created: ${audioBlob.size} bytes`);

          const analysis = await analyzeAudioBlob(audioBlob);
          
          if (!analysis.hasVoiceActivity) {
            console.log('🔇 No voice activity detected, skipping backend processing');
            if (isMountedRef.current) {
              onNewEmotion('Listening...');
            }
            return;
          }

          console.log('🗣️ Voice activity detected, processing...');
          if (isMountedRef.current) {
            onDetectionStart();
          }

          await sendAudioToBackend(audioBlob);
          
        } catch (error) {
          console.error('❌ Error processing recorded audio:', error);
          if (isMountedRef.current) {
            onNewEmotion('Processing error');
          }
        } finally {
          isRecordingRef.current = false;
          scheduleNextRecording();
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event.error);
        cleanup();
        if (isMountedRef.current) {
          onNewEmotion('Recording error');
        }
        isRecordingRef.current = false;
        scheduleNextRecording();
      };

      mediaRecorder.start();
      console.log(`⏱️ Recording for ${RECORDING_DURATION}ms...`);

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, RECORDING_DURATION);

    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      cleanup();
      if (isMountedRef.current) {
        onNewEmotion('Microphone error');
      }
      isRecordingRef.current = false;
      scheduleNextRecording();
    }
  }, [
    analyzeAudioBlob, 
    sendAudioToBackend, 
    onDetectionStart, 
    onNewEmotion, 
    cleanup, 
    scheduleNextRecording,
    RECORDING_DURATION
  ]);

  // ✅ FIXED: Now useEffect is used
  useEffect(() => {
    isMountedRef.current = true;
    console.log('🎵 AudioRecorder component mounted, starting first recording');
    recordAudio();

    return () => {
      console.log('🛑 AudioRecorder component unmounting, cleaning up...');
      isMountedRef.current = false;
      cleanup();
    };
  }, [recordAudio, cleanup]);

  return null;
};

export default AudioRecorder;
