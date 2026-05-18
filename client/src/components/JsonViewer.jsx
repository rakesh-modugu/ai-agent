import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

export default function JsonViewer({ layout }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(JSON.stringify(layout, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[400px] bg-[#1a1d24] border-l border-gray-800 flex flex-col h-full shadow-2xl z-10">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1f222a]">
        <div className="flex items-center gap-2 text-gray-300">
          <Code className="w-5 h-5" />
          <h2 className="font-semibold text-sm">JSON Data</h2>
        </div>
        <button 
          onClick={copyCode}
          className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-[11px] text-[#a9b1d6] font-mono leading-relaxed">
          {JSON.stringify(layout, null, 2)}
        </pre>
      </div>
    </div>
  );
}
