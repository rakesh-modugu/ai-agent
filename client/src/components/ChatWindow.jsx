import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, LayoutTemplate } from 'lucide-react';

export default function ChatWindow({ messages, onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const send = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-[350px] bg-[#1a1d24] border-r border-gray-800 flex flex-col h-full shadow-xl z-10">
      <div className="p-5 border-b border-gray-800 bg-[#1f222a] flex items-center gap-3">
        <LayoutTemplate className="text-blue-500 w-6 h-6" />
        <h1 className="text-lg font-bold">Layout Agent</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Send a message to change the design.
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
            )}
            
            <div className={`p-3 rounded-xl max-w-[80%] text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-[#2a2d35] text-gray-200 rounded-bl-none shadow-sm border border-gray-700'
            }`}>
              {msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <div className="bg-[#2a2d35] p-3 rounded-xl rounded-bl-none text-gray-400 text-sm flex items-center gap-1 w-16">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-[#1a1d24] border-t border-gray-800">
        <div className="flex flex-wrap gap-2 mb-3">
          {["Convert this design to 9:16", "Move the headline to the top", "Keep the product large"].map((btn) => (
            <button 
              key={btn}
              onClick={() => onSendMessage(btn)}
              className="text-[11px] bg-[#2a2d35] hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-full transition-colors text-gray-400 border border-gray-700"
            >
              {btn}
            </button>
          ))}
        </div>

        <form onSubmit={send} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here..."
            className="w-full bg-[#0f1115] text-white p-3 pr-12 rounded-lg outline-none border border-gray-700 focus:border-blue-500 transition-colors text-sm shadow-inner"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 disabled:text-gray-600 hover:text-blue-400"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
