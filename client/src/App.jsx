import { useState } from 'react'
import axios from 'axios'
import WireframePreview from './components/WireframePreview'
import ChatWindow from './components/ChatWindow'
import JsonViewer from './components/JsonViewer'
import initialData from './data/initialLayout.json'

// ఇది లోకల్ గా రన్ చేసినప్పుడు localhost కి కనెక్ట్ అవుతుంది.
// మీరు Vercel లో పెట్టినప్పుడు VITE_API_URL ద్వారా లైవ్ సర్వర్ కి ఆటోమేటిక్ గా కనెక్ట్ అవుతుంది.
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/chat';

function App() {
  const [layout, setLayout] = useState(initialData)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (text) => {
    let newMsg = { role: 'user', content: text };
    let msgs = [...messages, newMsg];
    setMessages(msgs);
    setLoading(true);

    try {
      let res = await axios.post(API_URL, {
        message: text,
        layout: layout,
        history: msgs.slice(-5)
      });
      
      setLayout(res.data.updatedLayout);
      setMessages([...msgs, { role: 'assistant', content: res.data.explanation }]);
    } catch (err) {
      console.log(err);
      setMessages([...msgs, { role: 'assistant', content: "Server error occurred" }]);
    }
    
    setLoading(false);
  }

  return (
    <div className="flex h-screen bg-[#0f1115] text-white overflow-hidden font-sans">
      <ChatWindow messages={messages} onSendMessage={handleSend} isLoading={loading} />
      <div className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1f222a] to-[#0f1115] border-x border-gray-800 p-8 justify-center items-center">
        <WireframePreview layout={layout} />
      </div>
      <JsonViewer layout={layout} />
    </div>
  )
}

export default App
