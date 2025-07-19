const micBtn = document.getElementById("micBtn");
const transcriptionDiv = document.getElementById("transcription");
const chatBox = document.getElementById("chatBox");
const chatHistory = document.getElementById("chatHistory");
const newChatBtn = document.getElementById("newChatBtn");

let finalTranscript = "";
let listening = false;
let chatId = Date.now(); // Unique chat ID for this session

// On page load
window.onload = () => {
  loadChatHistory();
  loadChat(chatId);
};

// ========== LOCAL STORAGE ==========

function saveMessageToStorage(text, sender) {
  const savedChats = JSON.parse(localStorage.getItem("chats")) || {};
  if (!savedChats[chatId]) savedChats[chatId] = [];
  savedChats[chatId].push({ text, sender });
  localStorage.setItem("chats", JSON.stringify(savedChats));
}

function loadChat(id) {
  chatBox.innerHTML = "";
  const savedChats = JSON.parse(localStorage.getItem("chats")) || {};
  const messages = savedChats[id] || [];
  messages.forEach(msg => addMessage(msg.text, msg.sender));
}

function loadChatHistory() {
  const savedChats = JSON.parse(localStorage.getItem("chats")) || {};
  chatHistory.innerHTML = "";

  Object.entries(savedChats).forEach(([id, messages]) => {
    if (!messages.length) return;
    const preview = messages[0].text.slice(0, 30) + "...";
    const item = document.createElement("div");
    item.className = "chat-history-item";
    item.textContent = preview;
    item.onclick = () => {
      chatId = id;
      loadChat(id);
    };
    chatHistory.prepend(item);
  });
}

// ========== CHAT UI ==========

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const text = transcriptionDiv.textContent.trim();
  if (!text || text === "🎙️ Listening..." || text === "Say something...") return;

  addMessage(text, "user");
  saveMessageToStorage(text, "user");

  transcriptionDiv.textContent = "Say something...";
  finalTranscript = "";

  setTimeout(() => {
    const fakeResponse = "🤖 Dummy response for: " + text;
    addMessage(fakeResponse, "bot");
    saveMessageToStorage(fakeResponse, "bot");
  }, 800);

  loadChatHistory(); // Refresh history
}

// ========== NEW CHAT ==========

newChatBtn.onclick = () => {
  chatId = Date.now();
  chatBox.innerHTML = "";
  transcriptionDiv.textContent = "Say something...";
  finalTranscript = "";
};

// ========== SPEECH RECOGNITION ==========

let recognition;
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "bn-BD";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    finalTranscript = "";
    transcriptionDiv.textContent = "🎙️ Listening...";
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }
    transcriptionDiv.textContent = finalTranscript + interimTranscript;
  };

  recognition.onend = () => {
    if (listening) {
      micBtn.textContent = "🎙️";
      listening = false;
      sendMessage(); // Auto send after stop
    }
  };

  micBtn.onclick = () => {
    if (!listening) {
      recognition.start();
      micBtn.textContent = "🔴";
      listening = true;
    } else {
      recognition.stop(); // Will trigger onend → sendMessage
    }
  };
} else {
  micBtn.disabled = true;
  micBtn.textContent = "❌";
}
