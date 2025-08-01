import React, { useState, useRef } from 'react';
import './ChatBot.css';
import { generateAIResponse } from '../utils/ai';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      text: input,
      type: 'user',
      timestamp: new Date().toLocaleTimeString()
    }]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      // Prepare context from previous messages
      const context = messages
        .filter(msg => msg.type === 'user')
        .map(msg => `User: ${msg.text}\n`)
        .join('');

      // Format the prompt for Gemini AI
      const prompt = `
        You are a professional health assistant. 
        Provide accurate, evidence-based medical information.
        Be concise, clear, and professional.
        
        Previous conversation:
        ${context}
        
        User: ${input}
        Assistant:
      `;

      // Get AI response
      const aiResponse = await generateAIResponse(prompt);
      
      // Add bot response
      setMessages(prev => [...prev, {
        text: aiResponse,
        type: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);
      scrollToBottom();
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again.',
        type: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>Chat with AI</h2>
        <button
          className="clear-conversation"
          onClick={() => setMessages([])}
          disabled={messages.length === 0}
        >
          Clear Conversation
        </button>
      </div>
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}>
            <div className="message-avatar" 
              style={{
                backgroundImage: `url(${message.type === 'user' ? 
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBI2beNHoX4k-0ltSGRe_SGJmAp00BXJb7reiOHo0GizSgkc1d8MOein4-H_Ip0iiUsE5beLwG4DLT_IAynnZ9QRJ_pi9epdOHto5wMu318ypHGRYva6HhtIS9kjjohOkYWo4INCu7oACIFTb6UDb4bjc5fPbeAr4BRWY-38FPKrlXAnwL07pvMwYfUuKojXMQFcehcX1cqwznbB3daiLJCx-OHJfCy66qZauBXKCgSyo3xNWRHa1ULBoSXuU3nQ2UqUUfJnYl1craq' : 
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCKkWGsc1yPj-iTevicgG-MHFTXo2hR6J-d6-_S37RHO6pLyNrzZn3LWef5ZWfGVCdC60LG_K9IBTsmQEJXm-KCXzMP2GK_fS_V99Kh2Dv13S2G5N5tGtxL6-DyIXIpNvTX9yg_-HTAwygWqdj0JlwNlW6_rf5QPAOYZoCRLm8xfTmuh0OLP01xr7leA-Tn2zWeWo5Ae5yi3wf0JRZfcAZveEtDCYzZy2qwLE011A6PBD2uq5OSYY14oBBFGOJB5_9YH0rbRj8FItT' 
                })`
              }}
            />
            <div className="message-content">
              <div className="message-meta">
                {message.type === 'user' ? 'You' : 'AI Assistant'}
                <span style={{ marginLeft: '8px', color: '#6c757d' }}>
                  {message.timestamp}
                </span>
              </div>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
