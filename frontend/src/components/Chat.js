import React, { useState } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 5px solid #FF69B4;
  position: relative;
`;

const ChatHeader = styled.div`
  text-align: center;
  color: #FF6B6B;
  font-size: 1.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0 #FFD700;
`;

const MessagesContainer = styled.div`
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  background: #FFF5F5;
  border-radius: 15px;
  margin-bottom: 20px;
  border: 3px dashed #FFB6C1;
`;

const Message = styled.div`
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 80%;
  position: relative;
  animation: popIn 0.3s ease-out;
  
  ${props => props.isUser ? `
    background: #4CAF50;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 5px;
  ` : `
    background: #FFD700;
    color: #333;
    margin-right: auto;
    border-bottom-left-radius: 5px;
  `}

  @keyframes popIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 3px solid #FFB6C1;
  border-radius: 25px;
  font-size: 1em;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
  }
`;

const SendButton = styled.button`
  background: #FF69B4;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
  &:hover {
    transform: scale(1.05);
    background: #FF1493;
  }
`;

const EmojiButton = styled.button`
  background: #FFD700;
  color: #333;
  border: none;
  padding: 12px;
  border-radius: 25px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: #FFC107;
  }
`;

const LoadingDots = styled.div`
  display: inline-block;
  color: #333;
  font-size: 1.2em;
  animation: loading 1.5s infinite;
  
  @keyframes loading {
    0% { content: '.'; }
    33% { content: '..'; }
    66% { content: '...'; }
  }
`;

const emojis = ['😊', '🎈', '🎮', '🎨', '🎵', '🌟', '🌈', '🦄'];

function Chat() {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your AI friend! 👋", isUser: false },
    { text: "Let's chat and have fun! 🎈", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const apiUrl = 'https://aicode-n2nw6eu2f-taaha161s-projects.vercel.app';
      console.log('Sending request to:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.response) {
        throw new Error('No response from the server');
      }

      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          text: `Oops! Something went wrong!\n\nError: ${error.message}\n\n`,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <ChatContainer>
      <ChatHeader>Chat with AI Friend! 💬</ChatHeader>
      <MessagesContainer>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
        {isLoading && (
          <Message isUser={false}>
            Thinking<LoadingDots>...</LoadingDots>
          </Message>
        )}
      </MessagesContainer>
      <InputContainer>
        <EmojiButton onClick={() => addEmoji(emojis[Math.floor(Math.random() * emojis.length)])}>
          😊
        </EmojiButton>
        <ChatInput
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
          disabled={isLoading}
        />
        <SendButton onClick={handleSend} disabled={isLoading}>
          Send ✨
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default Chat; 