import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const Chatbot = ({ darkMode, setDarkMode }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am NiveshPath\'s AI Financial Advisor. You can ask me questions about investments, savings, budgeting, or any financial topic.', isBot: true },
  ]);
  
  // Welcome message that will be shown if chat history is cleared
  const welcomeMessage = { 
    id: 1, 
    text: 'Hello! I am NiveshPath\'s AI Financial Advisor. You can ask me questions about investments, savings, budgeting, or any financial topic.', 
    isBot: true 
  };
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [newChat, setNewChat] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch chat history when component mounts
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Function to fetch chat history from the backend
  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await apiService.chatbot.getHistory();
      
      if (response.data && Array.isArray(response.data)) {
        // If we have history, replace the initial message with the history
        if (response.data.length > 0) {
          setMessages(response.data.map((msg, index) => ({
            id: index + 1,
            text: msg.content || msg.text,
            isBot: msg.sender === 'bot' || msg.isBot
          })));
          
          // Create chat history entries from unique conversations
          const uniqueChats = [];
          
          // Group messages by conversation or create default entry
          if (response.data.length > 0) {
            // Extract first user message from each conversation to use as title
            const userMessages = response.data.filter(msg => msg.sender === 'user' || !msg.isBot);
            
            if (userMessages.length > 0) {
              // Use first user message as title for the chat
              const firstUserMsg = userMessages[0];
              const chatTitle = firstUserMsg.content || firstUserMsg.text;
              const formattedTitle = chatTitle.length > 20 ? chatTitle.substring(0, 20) + '...' : chatTitle;
              
              uniqueChats.push({
                id: 1,
                title: formattedTitle,
                date: new Date().toLocaleDateString(),
                messages: response.data
              });
              
              // If there are multiple user messages with significant gap, create separate chat entries
              let lastIndex = 0;
              for (let i = 1; i < userMessages.length; i++) {
                const currentIndex = response.data.findIndex(msg => 
                  msg.id === userMessages[i].id || 
                  (msg.content === userMessages[i].content && msg.text === userMessages[i].text)
                );
                
                // If messages are far apart (more than 4 messages between), consider it a new conversation
                if (currentIndex - lastIndex > 4) {
                  const chatTitle = userMessages[i].content || userMessages[i].text;
                  const formattedTitle = chatTitle.length > 20 ? chatTitle.substring(0, 20) + '...' : chatTitle;
                  
                  uniqueChats.push({
                    id: uniqueChats.length + 1,
                    title: formattedTitle,
                    date: new Date().toLocaleDateString(),
                    messages: response.data.slice(lastIndex, currentIndex + 1)
                  });
                }
                
                lastIndex = currentIndex;
              }
            } else {
              // Fallback if no user messages found
              uniqueChats.push({
                id: 1,
                title: 'Financial Advice',
                date: new Date().toLocaleDateString(),
                messages: response.data
              });
            }
          }
          
          setChatHistory(uniqueChats);
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Don't show error toast for history fetch, just keep the default message
    } finally {
      setLoading(false);
    }
  };
  
  // Function to load a specific chat from history
  const loadChatFromHistory = (chat) => {
    if (chat && chat.messages && Array.isArray(chat.messages)) {
      // Map the messages to the format expected by the component
      const formattedMessages = chat.messages.map((msg, index) => ({
        id: index + 1,
        text: msg.content || msg.text,
        isBot: msg.sender === 'bot' || msg.isBot
      }));
      
      setMessages(formattedMessages);
      setInput('');
      setError(null);
      toast.info(`Loaded chat: ${chat.title}`);
    } else {
      toast.error('Could not load chat history');
    }
  };
  
  // Function to clear chat history
  const clearChat = () => {
    // Reset to just the welcome message
    setMessages([welcomeMessage]);
    setInput('');
    setError(null);
    toast.info('Chat history cleared');
  };
  
  // Function to start a new chat
  const startNewChat = () => {
    setMessages([welcomeMessage]);
    setInput('');
    setError(null);
    setNewChat(true);
    
    // Add new chat to history
    const newChatEntry = {
      id: chatHistory.length + 1,
      title: 'New Financial Chat',
      date: new Date().toLocaleDateString(),
      messages: [welcomeMessage]
    };
    setChatHistory([newChatEntry, ...chatHistory]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Clear any previous errors
    setError(null);

    // Add user message
    const userMessage = { id: messages.length + 1, text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Send message to backend API
      const response = await apiService.chatbot.sendMessage(input.trim());
      
      // Process the response from the API
      if (response.data && response.data.response) {
        const botMessage = { 
          id: messages.length + 2, 
          text: response.data.response, 
          isBot: true 
        };
        setMessages(prev => [...prev, botMessage]);
        
        // Update chat title if this is a new chat
        if (newChat && chatHistory.length > 0) {
          const updatedHistory = [...chatHistory];
          updatedHistory[0].title = input.length > 20 ? input.substring(0, 20) + '...' : input;
          updatedHistory[0].messages = [...updatedHistory[0].messages, userMessage, botMessage];
          setChatHistory(updatedHistory);
          setNewChat(false);
        } else if (chatHistory.length > 0) {
          // Update existing chat with new messages
          const updatedHistory = [...chatHistory];
          updatedHistory[0].messages = [...messages, botMessage];
          setChatHistory(updatedHistory);
        }
      } else {
        // Fallback in case the API response format is unexpected
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setError('Failed to get a response. Please try again.');
      toast.error('Failed to get a response. Please try again.');
      
      // Add a fallback bot message
      const errorMessage = { 
        id: messages.length + 2, 
        text: 'Sorry, I encountered an error processing your request. Please try again later.', 
        isBot: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Handle pressing Enter key to submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Only submit if there's text and we're not already processing a message
      if (input.trim() !== '' && !isTyping && !loading) {
        handleSubmit(e);
      }
      return false;
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg overflow-hidden">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} bg-primary dark:bg-primary text-white transition-all duration-300 overflow-hidden flex flex-col`}>
        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-md border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <h3 className="text-xs uppercase text-gray-400 dark:text-gray-400 font-semibold mb-2 px-2">Chat History</h3>
          <div className="space-y-1">
            {chatHistory.map(chat => (
              <button 
                key={chat.id}
                className="w-full text-left p-2 rounded-md hover:bg-gray-700 transition-colors flex items-start gap-2 overflow-hidden"
                onClick={() => loadChatFromHistory(chat)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div className="overflow-hidden">
                  <div className="text-sm truncate">{chat.title}</div>
                  <div className="text-xs text-gray-400">{chat.date}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* User & Settings */}
        <div className="p-3 border-t border-gray-700">
          <Link to="/dashboard" className="block p-2 rounded-md hover:bg-gray-700 transition-colors mb-1">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </div>
          </Link>
          <Link to="/profile" className="block p-2 rounded-md hover:bg-gray-700 transition-colors mb-1">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </div>
          </Link>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-primary shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-primary dark:text-white">NiveshPath AI Assistant</h1>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
            disabled={loading || isTyping}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </header>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-dark-bg p-4 sm:p-6 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.isBot ? 'items-start' : 'items-start justify-end'}`}
              >
                {message.isBot && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 01-.659 1.591L9.5 14.5M9.75 3.104c.251.023.501.05.75.082m0 0a24.301 24.301 0 014.5 0" />
                    </svg>
                  </div>
                )}
                <div 
                  className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-4 shadow-sm ${message.isBot 
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary dark:text-gray-200' 
                    : 'bg-secondary text-white ml-auto'}`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
                {!message.isBot && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center ml-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 01-.659 1.591L9.5 14.5M9.75 3.104c.251.023.501.05.75.082m0 0a24.301 24.301 0 014.5 0" />
                  </svg>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-sm max-w-[85%] sm:max-w-[75%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-secondary dark:bg-accent rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-secondary dark:bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-secondary dark:bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Form */}
        <div className="bg-white dark:bg-primary border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                className="w-full p-4 pr-16 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white dark:bg-gray-700 text-primary dark:text-white"
                disabled={isTyping || loading}
              />
              <button
                type="submit"
                disabled={isTyping || loading || input.trim() === ''}
                className="absolute right-2 top-2 p-2 rounded-md text-white bg-secondary hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
              NiveshPath AI Assistant is ready to answer your financial questions.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;