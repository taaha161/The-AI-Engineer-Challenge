import React from 'react';
import styled from 'styled-components';
import Chat from './components/Chat';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%);
  padding: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const ContentBox = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 30px;
  margin: 20px auto;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 5px solid #FFD700;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
    background: #FF69B4;
    border-radius: 25px;
    z-index: -1;
    opacity: 0.3;
  }
`;

const Title = styled.h1`
  color: #FF6B6B;
  text-align: center;
  font-size: 3em;
  margin-bottom: 30px;
  text-shadow: 3px 3px 0 #FFD700;
  transform: rotate(-2deg);
`;

const Button = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.2em;
  cursor: pointer;
  margin: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  
  &:hover {
    transform: scale(1.1);
    background: #45a049;
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`;

function App() {
  return (
    <AppContainer>
      <FloatingElement color="#FFD700" style={{ top: '10%', left: '10%' }} />
      <FloatingElement color="#FF69B4" style={{ top: '20%', right: '15%' }} />
      <FloatingElement color="#4CAF50" style={{ bottom: '15%', left: '20%' }} />
      
      <ContentBox>
        <Title>Welcome to Fun Land! 🎈</Title>
        <div style={{ textAlign: 'center' }}>
          <Button>Start Adventure! 🚀</Button>
          <Button>Play Games! 🎮</Button>
          <Button>Learn Stuff! 📚</Button>
        </div>
      </ContentBox>

      <Chat />
    </AppContainer>
  );
}

export default App; 