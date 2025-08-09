const chatBody = document.querySelector('.chat-body');
const inputField = document.querySelector('.chat-input input[type="text"]');
const sendButton = document.querySelector('.chat-input button');
const fileInput = document.getElementById('file-upload');

const GEMINI_API_KEY = 'AIzaSyBsqaeBrAjy8uBssehDsKH2bFbieKytadE'; // Replace with your actual key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;

function addMessage(text, sender = 'user') {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);

  const icon = document.createElement('i');
  icon.className = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';

  const textP = document.createElement('p');
  textP.textContent = text;

  messageDiv.appendChild(icon);
  messageDiv.appendChild(textP);
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;

  addMessage(userText, 'user');
  inputField.value = '';

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userText }] }]
      })
    });

    const data = await response.json();
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I didn’t understand that.';
    addMessage(botReply, 'bot');
  } catch (error) {
    console.error('Gemini API error:', error);
    addMessage('Oops! Something went wrong.', 'bot');
  }
}

sendButton.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    addMessage(`📎 File selected: ${file.name}`, 'user');
  }
});
