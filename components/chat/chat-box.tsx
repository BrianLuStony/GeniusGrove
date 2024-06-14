'use client';

import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

type Message = {
  sender: 'user' | 'bot';
  text: string;
  isHTML?: boolean;
};

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: input },
    ]);

    try {
      // Send the prompt to the server and get the response
      const response = await axios.post('/api/chat', { prompt: input });

      // Add the bot's message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: response.data.response, isHTML: true },
      ]);

      setInput(''); // Clear the input field after sending the message
    } catch (error) {
      console.error('Failed to fetch chat', error);
    } finally {
      setLoading(false); // Reset loading state after response or error
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 bg-white shadow rounded-lg">
        <div className="mb-2 text-left">
          {messages.map((msg, index) => (
            <div key={index} className={`block mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              {msg.isHTML ? (
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-blue-500 text-white' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ) : (
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {msg.text}
                  {/* {msg.sender === 'user' ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>} */}
                </span>
              )}
            </div>
          ))}
          {loading && (
            <span className="inline-block p-2 rounded-lg bg-gray-300 text-black animate-pulse">
              Typing...
            </span>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-grow p-2 border-t border-gray-300 rounded-l-lg focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
