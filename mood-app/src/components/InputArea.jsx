import React from 'react'

const InputArea = ({ isListening, isMicDisabled, speechText }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission is handled by the mic button
  }

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        value={speechText}
        readOnly
        placeholder={isListening ? "Listening... Speak now" : "Click mic to speak..."}
      />
      <button 
        type="button"
        className={`mic ${isListening ? 'listening' : ''}`}
        onClick={() => window.dispatchEvent(new CustomEvent('toggleMic'))}
        disabled={isMicDisabled}
      >
        {isMicDisabled ? '❌' : isListening ? '⏹️' : '🎙️'}
      </button>
    </form>
  )
}

export default InputArea