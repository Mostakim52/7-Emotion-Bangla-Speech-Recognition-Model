import { useEffect, useRef, useCallback } from 'react';
import { ENDPOINTS, getAuthHeaders } from '../../utils/config';

const RECORDING_DURATION = 3000;
const DELAY_BETWEEN_RECORDINGS = 300;

const AudioRecorder = ({ onDetectionStart, onNewEmotion, isActive }) => {
  const isMountedRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const isRecordingRef = useRef(false);
  const timeoutRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore stop races when recording ends while cleaning up.
      }
    }

    mediaRecorderRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    isRecordingRef.current = false;
  }, []);

  const sendAudioToBackend = useCallback(
    async (audioBlob) => {
      if (!isMountedRef.current || !isActiveRef.current) {
        return;
      }

      try {
        abortControllerRef.current = new AbortController();

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        const response = await fetch(ENDPOINTS.DETECT_EMOTION, {
          method: 'POST',
          body: formData,
          headers: getAuthHeaders(),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (isMountedRef.current && isActiveRef.current) {
          onNewEmotion(result.emotion || 'No emotion detected');
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMountedRef.current && isActiveRef.current) {
          onNewEmotion('Network error');
        }
      } finally {
        abortControllerRef.current = null;
      }
    },
    [onNewEmotion]
  );

  const scheduleNextRecording = useCallback(() => {
    if (!isMountedRef.current || !isActiveRef.current) {
      return;
    }

    if (timeoutRef.current) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      if (isMountedRef.current && isActiveRef.current && !isRecordingRef.current) {
        void recordAudio();
      }
    }, DELAY_BETWEEN_RECORDINGS);
  }, []);

  const recordAudio = useCallback(async () => {
    if (!isMountedRef.current || !isActiveRef.current || isRecordingRef.current) {
      return;
    }

    isRecordingRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (!isMountedRef.current || !isActiveRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        isRecordingRef.current = false;
        return;
      }

      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (!isMountedRef.current || !isActiveRef.current) {
          isRecordingRef.current = false;
          return;
        }

        if (chunks.length === 0) {
          onNewEmotion('No audio detected');
          isRecordingRef.current = false;
          scheduleNextRecording();
          return;
        }

        const audioBlob = new Blob(chunks, { type: mimeType || 'audio/webm' });
        onDetectionStart();
        await sendAudioToBackend(audioBlob);

        isRecordingRef.current = false;
        scheduleNextRecording();
      };

      recorder.onerror = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        mediaRecorderRef.current = null;
        isRecordingRef.current = false;

        if (isMountedRef.current && isActiveRef.current) {
          onNewEmotion('Recording error');
          scheduleNextRecording();
        }
      };

      recorder.start();

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (recorder.state === 'recording' && isActiveRef.current) {
          recorder.stop();
        }
      }, RECORDING_DURATION);
    } catch {
      isRecordingRef.current = false;
      if (isMountedRef.current && isActiveRef.current) {
        onNewEmotion('Microphone error');
      }
      scheduleNextRecording();
    }
  }, [onDetectionStart, onNewEmotion, scheduleNextRecording, sendAudioToBackend]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    if (isActive) {
      void recordAudio();
      return;
    }

    cleanup();
  }, [isActive, cleanup, recordAudio]);

  return null;
};

export default AudioRecorder;
