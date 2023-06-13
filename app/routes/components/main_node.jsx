import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

function MainNode({ data }) {
  let name = '';
  if (data?.name) name = data?.name;
  
  function convertToCamelCase(str) {
    return str.replace(/_([a-z])/g, function (match, letter) {
      return letter.toUpperCase();
    });
  }
  // const dd = convertToCamelCase(data?.type)
  // const bgStyle = `bg-${dd}Bg`;
  // const borderStyle = `border-${dd}`;

  return (
    <>
      <div
          className={`px-4 py-2 min-w-[200px] shadow-md rounded-full bg-blue-200 border-2 border-blue-500 flex flex-col items-center justify-center`}
      >
        <div className="text-xs capitalize">{data.type}</div>
        <div>
          <Handle type="source" position={Position.Right} className="w-16 h-16 rounded-full" />
          <Handle type="target" position={Position.Left} className="w-16 h-16 rounded-full" />

        </div>
        <div className="text-lg font-bold text-center capitalize">{name.replace(/_/g, ' ')}</div>
        <div className="text-xs text-white-900">{data.edges}</div>
      </div>
    </>
  );
}

export default memo(MainNode);



