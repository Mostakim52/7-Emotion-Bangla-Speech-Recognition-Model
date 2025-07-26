import React, { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import InputArea from './components/InputArea'

const App = () => {
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [isMicDisabled, setIsMicDisabled] = useState(false)
  const [speechText, setSpeechText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef('')
  const actionTimeoutRef = useRef(null)

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('banglaMoodChats')
    const savedCurrentChatId = localStorage.getItem('banglaMoodCurrentChatId')

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats)
        // Convert date strings back to Date objects
        const chatsWithDates = parsedChats.map(chat => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          messages: chat.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))
        setChats(chatsWithDates)
      } catch (error) {
        console.error('Error parsing saved chats:', error)
        setChats([])
      }
    }

    if (savedCurrentChatId) {
      setCurrentChatId(parseInt(savedCurrentChatId))
    }
  }, [])

  // Save chats to localStorage whenever chats or currentChatId changes
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('banglaMoodChats', JSON.stringify(chats))
    }
  }, [chats])

  useEffect(() => {
    if (currentChatId !== null) {
      localStorage.setItem('banglaMoodCurrentChatId', currentChatId.toString())
    }
  }, [currentChatId])

  // Initialize speech recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = "bn-BD"
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log('Speech recognition started')
      }

      recognition.onresult = (event) => {
        let interimTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }
        setSpeechText(finalTranscriptRef.current + interimTranscript)
      }

      recognition.onend = () => {
        console.log('Speech recognition ended')
        if (isListening && !isProcessing) {
          startRecognition()
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (isListening && !isProcessing) {
          setTimeout(() => {
            if (isListening && !isProcessing) {
              startRecognition()
            }
          }, 1000)
        }
      }

      recognitionRef.current = recognition
    } else {
      setIsMicDisabled(true)
    }

    const startRecognition = () => {
      if (recognitionRef.current && !isProcessing) {
        try {
          setIsProcessing(true)
          recognitionRef.current.start()
          setIsProcessing(false)
        } catch (error) {
          console.error('Error starting recognition:', error)
          setIsProcessing(false)
          setTimeout(() => {
            if (isListening && !isProcessing) {
              try {
                recognitionRef.current.start()
              } catch (retryError) {
                console.error('Retry failed:', retryError)
                setIsListening(false)
              } finally {
                setIsProcessing(false)
              }
            }
          }, 1000)
        }
      }
    }

    const stopRecognition = () => {
      if (recognitionRef.current && !isProcessing) {
        try {
          setIsProcessing(true)
          recognitionRef.current.stop()
          setIsProcessing(false)
        } catch (error) {
          console.error('Error stopping recognition:', error)
          setIsProcessing(false)
        }
      }
    }

    const handleToggleMic = () => {
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current)
      }

      actionTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && !isProcessing) {
          if (isListening) {
            stopRecognition()
            setIsListening(false)

            if (finalTranscriptRef.current.trim()) {
              sendMessage(finalTranscriptRef.current.trim())
              finalTranscriptRef.current = ''
              setSpeechText('')
            }
          } else {
            finalTranscriptRef.current = ''
            setSpeechText('')
            startRecognition()
            setIsListening(true)
          }
        }
      }, 100)
    }

    window.addEventListener('toggleMic', handleToggleMic)

    return () => {
      window.removeEventListener('toggleMic', handleToggleMic)
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current)
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.log('Error stopping recognition on cleanup:', error)
        }
      }
    }
  }, [isListening, currentChatId, isProcessing])

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    return newChat.id
  }

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId) || null
  }

  const updateChatTitle = (chatId, firstMessage) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId && chat.title === 'New Chat') {
        const title = firstMessage.split(' ').slice(0, 4).join(' ')
        return { ...chat, title: title.length > 20 ? title.substring(0, 20) + '...' : title }
      }
      return chat
    }))
  }

  const addMessageToChat = (chatId, message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, messages: [...chat.messages, message] }
      }
      return chat
    }))
  }

  const sendMessage = (text) => {
    if (!text.trim()) return

    let chatId = currentChatId
    if (!chatId) {
      chatId = createNewChat()
    }

    const userMessage = { text, type: 'user', timestamp: new Date() }
    
    // Check if this will be the first message BEFORE adding it
    const currentChat = getCurrentChat()
    const willBeFirstMessage = currentChat && currentChat.messages.length === 0 && currentChat.title === 'New Chat'

    // Add the user message
    addMessageToChat(chatId, userMessage)

    // Update chat title if it's the first message
    if (willBeFirstMessage) {
      updateChatTitle(chatId, text)
    }

    setTimeout(() => {
      const botResponse = "🤖 Dummy response for: " + text
      const botMessage = { text: botResponse, type: 'bot', timestamp: new Date() }
      addMessageToChat(chatId, botMessage)
    }, 800)
  }

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId)
  }

  const handleNewChat = () => {
    createNewChat()
  }

  const currentChatMessages = getCurrentChat()?.messages || []

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
        />
      </div>
    </div>
  )
}

export default App