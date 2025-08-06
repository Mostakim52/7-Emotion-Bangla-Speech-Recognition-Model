import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatBox from './ChatBox';
import InputArea from './InputArea';
const AssistantApp = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isMicDisabled, setIsMicDisabled] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emotionResult, setEmotionResult] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null); // Track the active chat for the current recording session
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const isListeningRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('banglaMoodChats');
    const savedCurrentChatId = localStorage.getItem('banglaMoodCurrentChatId');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        const chatsWithDates = parsedChats.map(chat => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          messages: chat.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChats(chatsWithDates);
      } catch (error) {
        console.error('Error parsing saved chats:', error);
        setChats([]);
      }
    }
    if (savedCurrentChatId) {
      setCurrentChatId(parseInt(savedCurrentChatId));
    }
  }, []);
  
  // Save chats to localStorage when chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('banglaMoodChats', JSON.stringify(chats));
    }
  }, [chats]);
  
  useEffect(() => {
    if (currentChatId !== null) {
      localStorage.setItem('banglaMoodCurrentChatId', currentChatId.toString());
    }
  }, [currentChatId]);
  
  // Sync ref with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);
  
  // Initialize speech recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "bn-BD";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        setSpeechText(finalTranscriptRef.current + interimTranscript);
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        handleAutoSend();
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsMicDisabled(true);
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition on cleanup:', error);
        }
      }
    };
  }, [currentChatId]);
  
  // Handle auto-send after speech recognition stops
  const handleAutoSend = () => {
    if (finalTranscriptRef.current.trim()) {
      sendMessage(finalTranscriptRef.current.trim());
      finalTranscriptRef.current = '';
      setSpeechText('');
    }
  };
  
  // Function to convert WebM to WAV
  const convertWebmToWav = async (webmBlob) => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Read the WebM blob as an array buffer
      const arrayBuffer = await webmBlob.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Get the audio buffer data
      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const length = audioBuffer.length;
      const buffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
      const view = new DataView(buffer);
      
      // Write WAV header
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + length * numberOfChannels * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
      view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
      view.setUint16(22, numberOfChannels, true); // NumChannels
      view.setUint32(24, sampleRate, true); // SampleRate
      view.setUint32(28, sampleRate * numberOfChannels * 2, true); // ByteRate
      view.setUint16(32, numberOfChannels * 2, true); // BlockAlign
      view.setUint16(34, 16, true); // BitsPerSample
      writeString(36, 'data');
      view.setUint32(40, length * numberOfChannels * 2, true);
      
      // Write audio data
      let offset = 44;
      for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
          view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
          offset += 2;
        }
      }
      
      // Create WAV blob
      return new Blob([buffer], { type: 'audio/wav' });
    } catch (error) {
      console.error('Error converting WebM to WAV:', error);
      throw error;
    }
  };
  
  // Start both speech recognition and audio recording
  const startListeningAndRecording = async () => {
    if (!recognitionRef.current) return;
    
    try {
      // Reset transcript and audio chunks
      finalTranscriptRef.current = '';
      setSpeechText('');
      audioChunksRef.current = [];
      setEmotionResult(null);
      
      // Create a new chat if there isn't one already
      let chatId = currentChatId;
      if (!chatId) {
        chatId = createNewChat();
      }
      // Set this as the active chat for this recording session
      setActiveChatId(chatId);
      
      // Start speech recognition
      recognitionRef.current.start();
      setIsListening(true);
      
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(webmBlob);
        
        try {
          // Convert WebM to WAV before sending to backend
          const wavBlob = await convertWebmToWav(webmBlob);
          
          // Send WAV audio to backend for emotion detection
          detectEmotion(wavBlob);
        } catch (error) {
          console.error('Error converting audio:', error);
          
          // Add error message to the active chat
          const errorMessage = {
            text: 'Sorry, there was an error processing your audio. Please try again.',
            type: 'bot',
            timestamp: new Date(),
            isError: true
          };
          
          // Use the active chat ID
          addMessageToChat(activeChatId, errorMessage);
        }
        
        // Stop all tracks to free mic
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsListening(false);
    }
  };
  
  // Stop both speech recognition and audio recording
  const stopListeningAndRecording = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsListening(false);
  };
  
  // Toggle mic controls both speech and recording
  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListeningAndRecording();
    } else {
      startListeningAndRecording();
    }
  };
  
  // Detect emotion from audio Backend Flask
  const detectEmotion = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      // Now sending as WAV file
      formData.append('audio', audioBlob, 'recording.wav');
      
      // Replace with your actual Flask backend endpoint
      const response = await fetch('https://your-backend-api.com/emotion-detection', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setEmotionResult(data.emotion);
      
      // Add emotion result to the active chat
      const emotionMessage = {
        text: `Detected emotion: ${data.emotion}`,
        type: 'bot',
        timestamp: new Date(),
        isEmotion: true
      };
      
      // Use the active chat ID
      addMessageToChat(activeChatId, emotionMessage);
      
    } catch (error) {
      console.error('Error detecting emotion:', error);
      
      // Add error message to the active chat
      const errorMessage = {
        text: 'Sorry, I could not detect the emotion. Please try again.',
        type: 'bot',
        timestamp: new Date(),
        isError: true
      };
      
      // Use the active chat ID
      addMessageToChat(activeChatId, errorMessage);
    } finally {
      setIsProcessing(false);
      // Reset active chat ID after processing
      setActiveChatId(null);
    }
  };
  
  // --- Chat functions ---
  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };
  
  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId) || null;
  };
  
  const addMessageToChat = (chatId, message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, messages: [...chat.messages, message] };
      }
      return chat;
    }));
  };
  
  const updateChatTitle = (chatId, firstMessage) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const title = firstMessage.split(' ').slice(0, 4).join(' ');
        return { ...chat, title: title.length > 20 ? title.substring(0, 20) + '...' : title };
      }
      return chat;
    }));
  };
  
  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    // Use active chat ID if available, otherwise use current chat or create one
    let chatId = activeChatId || currentChatId;
    if (!chatId) {
      chatId = createNewChat();
    }
    
    const userMessage = { text, type: 'user', timestamp: new Date() };
    const currentChat = getCurrentChat();
    
    // Check if this is the first message in the chat
    const isFirstMessage = !currentChat || currentChat.messages.length === 0;
    
    // Add the user message to the chat
    addMessageToChat(chatId, userMessage);
    
    // If this is the first message, update the chat title
    if (isFirstMessage) {
      updateChatTitle(chatId, text);
    }
    
    // Add a temporary message while processing
    if (!text.includes('Detected emotion:')) {
      const processingMessage = { 
        text: 'Analyzing your voice for emotion...', 
        type: 'bot', 
        timestamp: new Date(),
        isProcessing: true
      };
      addMessageToChat(chatId, processingMessage);
    }
  };
  
  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    // Reset active chat ID when selecting a different chat
    setActiveChatId(null);
  };
  
  const handleNewChat = () => {
    createNewChat();
    // Reset active chat ID when creating a new chat
    setActiveChatId(null);
  };
  
  const currentChatMessages = getCurrentChat()?.messages || [];
  
  return (
    <div className="app">
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      <div className="chat-container">
        <ChatBox messages={currentChatMessages} />
        <InputArea 
          isListening={isListening}
          isMicDisabled={isMicDisabled}
          speechText={speechText}
          onToggleMic={toggleSpeechRecognition}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};
export default AssistantApp;
