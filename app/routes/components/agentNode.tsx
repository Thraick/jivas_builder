import { Handle, Position, useNodeId } from "reactflow";

export function AgentNode() {
    const nodeId = useNodeId();
    return (
        <div className="bg-gray-100 w-40 px-2 py-1 rounded-sm border shadow-sm">
            <div className="uppercase text-sm text-center">Agent</div>
            <div className="lowercase text-xs text-center text-gray-500">
                {nodeId}
            </div>
            <Handle type="source" position={Position.Bottom} id="bottom" />
        </div>
    );
}