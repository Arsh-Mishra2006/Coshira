// axios CDN link
const axios = window.axios;

const apiKey = '66e4bafcc56acbf54f55e514';
const externalUserId = '<plugin-1726265979>';
const endpointId = 'predefined-openai-gpt4o'; // Example endpoint

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Function to append messages to the chat box
function appendMessage(content, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender);
  const messageContent = document.createElement('p');
  messageContent.innerText = content;
  messageDiv.appendChild(messageContent);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
}

// Function to handle sending query
function sendQuery() {
  const query = userInput.value.trim();
  if (!query) return;

  // Append the user query to the chat box
  appendMessage(query, 'user');
  userInput.value = ''; // Clear the input field

  // Step 1: Create Chat Session
  axios.post('https://api.on-demand.io/chat/v1/sessions', {
    pluginIds: [],
    externalUserId: externalUserId
  }, {
    headers: {
      apikey: apiKey
    }
  })
  .then(response => {
    const sessionId = response.data.id; // Extract session ID

    // Step 2: Submit Query
    return axios.post(`https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
      endpointId: endpointId,
      query: query,
      pluginIds: ['plugin-1712327325', 'plugin-1713962163', 'plugin-1726265979'],
      responseMode: 'sync'
    }, {
      headers: {
        apikey: apiKey
      }
    });
  })
  .then(response => {
    const botResponse = response.data.message || 'Sorry, I couldn’t process that.';
    appendMessage(botResponse, 'bot'); // Append bot response
  })
  .catch(error => {
    console.error('Error:', error);
    appendMessage('Error: Unable to connect.', 'bot'); // Append error message
  });
}

// Add event listener to the Send button
sendBtn.addEventListener('click', sendQuery);

// Allow pressing Enter to send message
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendQuery();
  }
});
