
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';

// Define message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Mock function to simulate chatbot response
const getMockResponse = async (message: string): Promise<string> => {
  // This is where you would integrate with OpenAI API
  // For now, we'll use a simple mock
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const responses = [
    "It's important to consult with a healthcare professional for personalized advice.",
    "Regular check-ups are recommended to maintain good health.",
    "A balanced diet and regular exercise can help prevent many health issues.",
    "Staying hydrated is essential for overall health and wellbeing.",
    "If you're experiencing severe symptoms, please seek immediate medical attention.",
    "Mental health is just as important as physical health.",
    "Getting adequate sleep is crucial for your immune system.",
    "Vaccination is an important preventive measure against many diseases.",
    "Stress management techniques like meditation can improve your health.",
    "Regular screenings can help catch potential health issues early.",
  ];
  
  // Simple keyword matching for demonstration
  if (message.toLowerCase().includes('pneumonia')) {
    return "Pneumonia symptoms include chest pain, cough with phlegm, fatigue, fever, and chills. If you suspect pneumonia, please consult with a doctor immediately.";
  } else if (message.toLowerCase().includes('cancer') || message.toLowerCase().includes('lung cancer')) {
    return "Lung cancer symptoms may include persistent cough, chest pain, shortness of breath, and coughing up blood. Early detection is crucial, so please consult with a healthcare professional if you have concerns.";
  } else if (message.toLowerCase().includes('tuberculosis') || message.toLowerCase().includes('tb')) {
    return "Tuberculosis (TB) symptoms include coughing that lasts three or more weeks, coughing up blood, chest pain, fatigue, and unintentional weight loss. TB is serious but treatable with proper medical care.";
  }
  
  // Default to random response
  return responses[Math.floor(Math.random() * responses.length)];
};

const ChatbotAI = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm MedAI, your healthcare assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Get response from chatbot (replace with real OpenAI API call)
      const response = await getMockResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('chatbot_ai')}</h1>
        <p className="text-muted-foreground">Ask questions about health and medical concerns</p>
      </div>
      
      <Card className="mt-6 flex-1 flex flex-col">
        <CardHeader className="bg-gradient-medical text-white">
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            MedAI Health Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Message display area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-medical-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === 'bot' ? (
                      <>
                        <Bot className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">MedAI</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">You</span>
                      </>
                    )}
                  </div>
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 text-right mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-medical-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-medical-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-2 h-2 bg-medical-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('ask_question')}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-medical"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotAI;
