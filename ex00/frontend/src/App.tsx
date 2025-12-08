import { useState, useRef, useEffect } from 'react';
import './App.css'
import MapView from './MapView';

type Destination = {
  id: string;
  name: string;
  country: string;
  description: string;
  lat?: number;
  lng?: number;
}

type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  destinations?: Destination[];
  timestamp: Date;
}

function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // En producción, usar /api que será proxyado por nginx al backend
      // En desarrollo, usar la URL completa
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001');
      const response = await fetch(`${apiUrl}/echo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.error || 'Error processing request',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      if (data.destinations && Array.isArray(data.destinations) && data.destinations.length > 0) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `I found ${data.destinations.length} recommended destinations for you:`,
          destinations: data.destinations,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.error || data.processedText || 'No destinations found for your search.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Error connecting to server. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="main-page">
      <header className='main-header'>
        <h1 className='main-title'>Trip Recommendator</h1>
        <p className='main-subtitle'>
          Describe the trip you would like to take and I'll recommend perfect destinations for you
        </p>
      </header>

      <main className='chat-container'>
        <div className='messages-area'>
          {messages.length === 0 ? (
            <div className='welcome-message'>
              <p>👋 Hello! I'm your travel assistant.</p>
              <p>Tell me what kind of trip you'd like to take and I'll recommend the best destinations.</p>
              <p className='welcome-example'>Example: "I want a cheap beach trip in Europe"</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className='message-content'>
                  {message.type === 'user' ? (
                    <div className='message-bubble user-bubble'>
                      {message.content}
                    </div>
                  ) : (
                    <>
                      <div className='message-bubble assistant-bubble'>
                        {message.content}
                      </div>
                      {message.destinations && message.destinations.length > 0 && (
                        <div className='assistant-response'>
                          <div className='destinations-list'>
                            {message.destinations.map((dest) => (
                              <div key={dest.id} className='destination-card'>
                                <h3 className='destination-title'>
                                  {dest.name}{' '}
                                  <span className='destination-country'>
                                    ({dest.country})
                                  </span>
                                </h3>
                                <p className='destination-description'>
                                  {dest.description}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className='map-container'>
                            <MapView destinations={message.destinations} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className='message assistant'>
              <div className='message-content'>
                <div className='message-bubble assistant-bubble loading'>
                  Searching...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className='input-container'>
          <div className='input-wrapper'>
            <textarea
              ref={inputRef}
              className='chat-input'
              rows={1}
              placeholder='Type your message here...'
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className='send-button'
              onClick={handleSend}
              disabled={isLoading || !inputText.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
