import React from 'react';

export default function WireframePreview({ layout }) {
  if (!layout || !layout.rootNodes || layout.rootNodes.length === 0) {
    return <div>No layout</div>;
  }

  let rootId = layout.rootNodes[0];
  let artboard = layout.nodes[rootId];
  
  if (!artboard) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#0f1115]">
      <div className="w-full max-w-[600px] max-h-[80vh] flex justify-center">
        <div 
          className="relative overflow-hidden bg-white shadow-lg transition-all duration-700 ease-in-out border border-gray-800 rounded"
          style={{ 
            aspectRatio: `${artboard.width} / ${artboard.height}`,
            width: '100%',
            backgroundColor: artboard.data?.backgroundColor || '#fff',
            containerType: 'inline-size' 
          }}
        >
          {artboard.children.map((id) => {
            let node = layout.nodes[id];
            if (!node) return null;

            let isCircle = node.data?.shapeType === 'circle';
            let isText = node.type === 'text';
            let isImg = node.type === 'image';
            let isShape = node.type === 'shape';
            let textValue = node.data?.content || '';

            let color = node.style?.visual?.color?.value || '#000';
            if (color === '#FFFF') color = '#FFF';

            return (
              <div
                key={id}
                className="absolute flex overflow-hidden transition-all duration-700 ease-in-out group hover:outline hover:outline-2 hover:outline-blue-500"
                style={{
                  left: `${node.nx * 100}%`,
                  top: `${node.ny * 100}%`,
                  width: `${node.nw * 100}%`,
                  height: `${node.nh * 100}%`,
                  borderRadius: isCircle ? '50%' : '0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: isShape && node.style?.visual?.fill?.value !== 'none' ? node.style?.visual?.fill?.value : '',
                  border: isShape && node.style?.visual?.stroke?.value ? `1px solid ${node.style.visual.stroke.value}` : ''
                }}
              >
                {isImg && node.data?.sourceUrl && (
                  <img src={node.data.sourceUrl} alt="img" className="absolute inset-0 w-full h-full object-cover" />
                )}
                
                {isText && (
                  <div 
                    className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center"
                    style={{ 
                      fontSize: `calc(${(node.style?.visual?.fontSize || 16) / artboard.width * 100}cqw)`,
                      color: color,
                      fontFamily: node.style?.visual?.fontFamily || 'sans-serif',
                      fontWeight: node.style?.visual?.fontWeight || 400,
                      lineHeight: '1.2',
                      textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: textValue.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') }} />
                  </div>
                )}
                
                <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-black text-white text-[10px] px-1 rounded z-50">
                  {node.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-5 text-gray-400 text-sm">
        Size: {artboard.width} x {artboard.height}
      </div>
    </div>
  );
}
