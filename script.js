import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MentalHealthChatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm here to provide support and talk with you. How are you feeling today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref for scrolling

  useEffect(() => {
    // Scroll to bottom of chat window whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const callAI = async (userMessage) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'YOUR_API_KEY'; // Use environment variables
    const apiUrl = process.env.NEXT_PUBLIC_OPENAI_API_URL || 'YOUR_API_ENDPOINT';

    if (!apiKey || !apiUrl) {
      console.error("API Key or URL not found. Please set environment variables.");
      return "I'm unable to connect right now. Please check back later.";
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer ${apiKey}
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // or another suitable model
          messages: [
            {
              role: 'system',
              content: `You are a supportive mental health chatbot. Your role is to:
                - Listen empathetically and provide emotional support
                - Suggest healthy coping strategies
                - Encourage professional help when appropriate
                - ALWAYS refer to crisis services if any concerning content is detected
                - Never provide medical advice or diagnosis
                - Maintain a warm, understanding tone`
            },
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150, // Adjust as needed
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details
        console.error("API Error:", response.status, errorData);
        return "I encountered an error. Please try again later.";
      }
      
      return data.choices[0].message.content.trim(); // Trim whitespace

    } catch (error) {
      console.error('Error calling AI API:', error);
      return "I apologize, but I'm having trouble connecting right now. If you need immediate support, please reach out to the crisis resources listed below.";
    }
  };

  const handleSend = async () => {
    const message = inputText.trim();
    if (!message) return;

    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputText('');
    setIsLoading(true);

    const aiResponse = await callAI(message);
    setMessages(prev => [...prev, { type: 'bot', content: aiResponse }]);
    setIsLoading(false);
  };

  return (
    // ... (rest of the JSX remains largely the same)
    <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4">
      {/* ... (messages mapping) */}
      <div ref={messagesEndRef} /> {/* Empty div at the bottom for scrolling */}
    </div>
    // ...
  );
};

export default MentalHealthChatbot;
