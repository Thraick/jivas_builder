import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

function QaResponseNode({ data }) {
  let name = '';
  if (data?.response) name = data?.response;
  

  return (
    <>
      <div className={`px-4 py-2 min-w-[200px] shadow-md rounded-full bg-qaResponseBg border-2 border-qaResponse flex flex-col items-center justify-center`}>
        <div className="text-xs capitalize">{data.type}</div>
        <div>
          <Handle type="source" position={Position.Right} className="w-16 h-16 rounded-full" />
          <Handle type="target" position={Position.Left} className="w-16 h-16 rounded-full" />

        </div>
        <div className="text-lg font-bold text-center capitalize">{name.replace(/_/g, ' ')}</div>
        {/* <div className="text-xs text-white-900">{data.edges}</div> */}
      </div>
    </>
  );
}

export default memo(QaResponseNode);

