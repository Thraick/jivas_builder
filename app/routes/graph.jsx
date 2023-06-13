import ReactFlow, { Background, MiniMap, ReactFlowProvider, addEdge, updateEdge, useEdgesState, useNodesState, useReactFlow, } from "reactflow";
import styles from "reactflow/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import dagre from 'dagre';

import Sidebar from "./components/sidebar";
import SidebarUpdate from './components/sidebarUpdate';
import SidebarCreate from './components/sidebarCreate';
import { ddata, graphStyle } from './_index';

import AgentNode from './nodes/agent_node';
import StateNode from './nodes/state_node';
import NerStateNode from './nodes/ner_state_node';
import QaStateNode from './nodes/qa_state_node';
import StateResponseNode from './nodes/state_response_node';
import QaResponseNode from './nodes/qa_response_node';
import PromptNode from './nodes/prompt_node';
import NerResponse from './nodes/ner_response_node';
import TrainingDataNode from './nodes/training_data_node';
import ResEntitySetNode from './nodes/res_entity_set_node';
import EntitySetNode from './nodes/entity_set_node';
import AdapterNode from './nodes/adapter_node';
import StatesRootNode from './nodes/states_root_node';
import AdaptersRootNode from './nodes/adapters_root_node';
import PromptsRootNode from './nodes/prompts_root_node';
import StateResponsesRootNode from './nodes/state_responses_root_node';
import TrainingDataRootNode from './nodes/training_data_root_node';
import ResEntitySetRootNode from './nodes/res_entity_set_root_node';
import EntitySetRootNode from './nodes/entity_set_root_node';

import {MainMenu} from './components/mainMenu';
import SidebarMenu from './components/sidebarMenu ';

import MainNode from './components/main_node';
import MainEdge from './components/main_edge';

import { ContextMenu } from './components/contextMenu';

export const links = () => [{ rel: "stylesheet", href: styles }];


const nodeTypes = {
    // agent: MainNode,
    agent: AgentNode,
    state: StateNode,
    qa_state: QaStateNode,
    ner_state: NerStateNode,
    response: StateResponseNode,
    qa_response: QaResponseNode,
    ner_response: NerResponse,
    prompt: PromptNode,
    training_data: TrainingDataRootNode,
    response_entity_set: ResEntitySetNode,
    entity_set: EntitySetNode,
    entity_sets: EntitySetRootNode,
    adapter: AdapterNode,
    states: StatesRootNode,
    adapters: AdaptersRootNode,
    prompts: PromptsRootNode,
    state_responses: StateResponsesRootNode,
    ner_data: TrainingDataNode,
    response_entity_sets: ResEntitySetRootNode,
};

const nodeWidth = 400;
const nodeHeight = 60;


function BuilderPage() {

    const [nodes, setNodes, onNodesChange] = useNodesState([
        // {
        //     "id": "1",
        //     "type": "agent",
        //     "data": {
        //         "type": "agent",
        //         "edges": 11,
        //         "name": "Agent X",
        //         "published": true,
        //         "description": "This is classified",
        //         "nlu_confidence": 0.3,
        //         "ner_confidence": 0.1,
        //         "sen_confidence": 0.1
        //     },
        //     "position": {
        //         "x": 0,
        //         "y": 3520
        //     },
        //     "width": 50,
        //     "targetPosition": "left",
        //     "sourcePosition": "right"
        // },
        // {
        //     "id": "2",
        //     "type": "agent",
        //     "data": {
        //         "type": "prompt_root",
        //         "edges": 3
        //     },
        //     "position": {
        //         "x": 900,
        //         "y": 110
        //     },
        //     "width": -8,
        //     "targetPosition": "left",
        //     "sourcePosition": "right"
        // }
    ]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([
        // {
        //     "id": "1-2",
        //     "source": "1",
        //     "target": "2",
        //     "type": "main",
        //     "style": {
        //         "stroke": "#930D0D"
        //     }
        // }
    ]);
    const [initialData, setInitialData] = useState();
    const [nodeData, setNodeData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const reactFlowInstance = useReactFlow();


    const [isUpdatingNode, setIsUpdatingNode] = useState(false);
    const [isInfoNode, setIsInfoNode] = useState(false);
    const [isCreatingNode, setIsCreatingNode] = useState(false)
    const [doubleClick, setDoubelClick] = useState(false)
    const [resetDoubleClick, setResetDoubelClick] = useState(false)



    useEffect(() => {
        // console.log('use init load')
        onRestore()
    }, [])

    const onRestore = () => {
        if (ddata && nodes.length == 0) {
            const { "edges": edgelist, "nodes": nodelist } = createData(ddata)
            if (nodelist && edgelist) {

                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                    nodelist,
                    edgelist
                )
                // return [layoutedNodes, layoutedEdges]
                // setEdges(layoutedEdges)
                // setNodes(layoutedNodes)
                setNodes([layoutedNodes[0]])
                if (!initialData) {
                    setInitialData({
                        nodes: layoutedNodes,
                        edges: layoutedEdges
                    })
                }
            }

        }

    };


    const getLayoutedElements = (nodes, edges, direction = 'LR') => {
        const isHorizontal = direction === 'LR';

        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        dagreGraph.setGraph({ rankdir: direction });
        // console.log("nodes get layout")
        // console.log(nodes)
        const copiedNodes = JSON.parse(JSON.stringify(nodes));


        copiedNodes.forEach((node) => {
            // const spacingAdjustment = nodeWidth - node.width;
            // const adjustedWidth = nodeWidth + node.width;
            // const adjustHeight = nodeHeight + node.height
            const adjustedWidth = nodeWidth;
            dagreGraph.setNode(node.id, { width: adjustedWidth, height: nodeHeight });
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        copiedNodes.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.targetPosition = isHorizontal ? 'left' : 'top';
            node.sourcePosition = isHorizontal ? 'right' : 'bottom';

            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            };

            return node;
        });

        return { "nodes": copiedNodes, edges };
    };

    const handelCollapseAndExpand = (e, data) => {

        let childrenIds = getAllChildren(edges, data.id);
        if (childrenIds.length > 0) {
            const filteredEdges = edges.filter((edge) => !childrenIds.includes(edge.target));
            const filteredNodes = nodes.filter((node) => !childrenIds.includes(node.id));
            setNodes(filteredNodes)
            // setNodes(sortNodes(layoutedNodes));
            setEdges(filteredEdges)
        }
        else {
            const childrenEdges = initialData.edges.filter((edge) => edge.source === data.id);
            const childrenNodes = initialData.nodes.filter((node) => childrenEdges.some((child) => child.target === node.id));
            let nodelist = [...nodes, ...childrenNodes]
            let edgelist = [...edges, ...childrenEdges]
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                nodelist,
                edgelist
            );

            setNodes(layoutedNodes)
            setEdges(layoutedEdges)
        }
        // if (nodeData) {
        //     const currentFocus = nodes.filter(node => node.id === nodeData.id)
        //     // console.log("currentFocus")
        //     // console.log(currentFocus)
        //     // reactFlowInstance.setCenter(nodeData.position)
        //     // console.log(nodeData.position)
        //     // console.log(nodes[0].position)
        //     reactFlowInstance.setViewport({ x: currentFocus[0].position.x + 100, y: currentFocus[0].position.y - 100, zoom: 0.5 }, { duration: 800 });
        // }
    }

    const deleteNode = () => {
        // const nodelist = nodes.filter((element) => element.id != nodeData.id)
        // const edgelist = edges.filter(edge => !(edge.source === nodeData.id || edge.target === nodeData.id));
        let ee = getAllChildren(edges, nodeData.id)
        let childrenIds = [nodeData.id, ...ee]
        const initFilteredEdges = initialData.edges.filter((edge) => !childrenIds.includes(edge.target));
        const initFilteredNodes = initialData.nodes.filter((node) => !childrenIds.includes(node.id));

        const filteredEdges = edges.filter((edge) => !childrenIds.includes(edge.target));
        const filteredNodes = nodes.filter((node) => !childrenIds.includes(node.id));
        setInitialData({
            nodes: initFilteredNodes,
            edges: initFilteredEdges
        })
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            filteredNodes,
            filteredEdges
        );

        // setNodes(sortNodes(layoutedNodes));
        // reactFlowInstance.fitView()
        setNodes(layoutedNodes);
        setEdges(layoutedEdges)
        setIsOpen(false);
    };


    const handleClick = (e, node) => {
        setIsInfoNode(true);
        setIsCreatingNode(false);
        setIsUpdatingNode(false);
    }

    const handleMouseEnter = (e, node) => {
        if (!isCreatingNode && !isUpdatingNode) {
            setNodeData(node)
        }
    }

    const updateNode = () => {
        setIsUpdatingNode(true)
        setIsCreatingNode(false)
        setIsOpen(false)
    }

    const createNode = () => {
        setIsCreatingNode(true)
        setIsUpdatingNode(false)
        setIsOpen(false)
    }

    const closeSidebar = () => {
        setIsUpdatingNode(false)
        setNodeData(null)
        setIsInfoNode(false)
        setIsCreatingNode(false)
    }

    const [currentL, setCurrentL] = useState(0)

    useEffect(() => {
        // console.log("this ran useeffect")
        // if(nodes.length != currentL){
        //     console.log('lraaa')
        //     setCurrentL(nodes.length)
        // }
        reactFlowInstance.fitView()
    }, [nodes, edges])


    const onContextMenu = (e) => {
        e.preventDefault();
        // console.log(e)
        setIsOpen(true);
        setContextPosition({ x: e.clientX, y: e.clientY + 20 });
    }

    function handleUpdate(prop) {

        const updatedNodes = nodes.map((node) => {
            if (node.id === prop.id) {
                return {
                    ...node,
                    data: { ...prop.data }
                };
            } else {
                return node;
            }
        });

        const updatedInitialNodes = initialData.nodes.map((node) => {
            if (node.id === prop.id) {
                return {
                    ...node,
                    data: { ...prop.data }
                };
            } else {
                return node;
            }
        });

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            updatedNodes,
            edges
        );
        const { nodes: layoutInitialNodes, edges: layoutInitialEdges } = getLayoutedElements(
            updatedInitialNodes,
            edges
        );

        setInitialData({
            edges: layoutInitialEdges,
            nodes: layoutInitialNodes
        })

        setIsUpdatingNode(false);
        setIsInfoNode(false)
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
    }


    function handleCreate(data, sourceId, sourceType) {

        const childrenEdges = initialData.edges.filter((edge) => edge.source === sourceId);
        const childrenNodes = initialData.nodes.filter((node) => childrenEdges.some((child) => child.target === node.id));
        console.log("childrenNodes")
        console.log(childrenNodes)
        let updateEdge = []
        let updateNode = []
        // if (data.type == 'response') {
        if (['response', 'qa_response', 'ner_response'].includes(data.type)) {

            let newParent = childrenNodes.filter((n) => n.type == 'state_responses')
            console.log(newParent)
            if (newParent.length == 0) {
                let responseRootItem = {
                    id: getId(),
                    type: 'state_responses',
                    data: {
                        name: 'state_responses',
                        // edges: 2
                    }
                }
                const { "edge": responseRootEdge, "node": responseRootNode } = onAdd(responseRootItem, sourceId, sourceType);
                newParent = [responseRootNode];
                console.log("newParent")
                console.log(newParent)

                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [responseRootEdge, edge]
                updateNode = [responseRootNode, node]
            }
            else {
                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                console.log(node)
                updateEdge = [edge]
                updateNode = [node]
            }
        }
        else if (data.type == 'prompt') {
            let newParent = childrenNodes.filter((n) => n.type == 'prompts')

            if (newParent.length == 0) {
                let promptRootItem = {
                    id: getId(),
                    type: 'prompts',
                    data: {
                        name: 'prompts',
                    }
                }
                const { "edge": promptEdge, "node": promptNode } = onAdd(promptRootItem, sourceId, sourceType);
                newParent = [promptNode];
                // console.log("newParent")
                // console.log(newParent)

                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [promptEdge, edge]
                updateNode = [promptNode, node]
            }
            else {
                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                console.log(node)
                updateEdge = [edge]
                updateNode = [node]
            }

        }
        else if (data.type == 'ner_data') {
            let newParent = childrenNodes.filter((n) => n.type == 'training_data')

            if (newParent.length == 0) {
                let trainingDataRootItem = {
                    id: getId(),
                    type: 'training_data',
                    data: {
                        name: 'training_data',
                        // edges: 2
                    }
                }
                const { "edge": trainingDataEdge, "node": trainingDataNode } = onAdd(trainingDataRootItem, sourceId, sourceType);
                newParent = [trainingDataNode];
                // console.log("newParent")
                // console.log(newParent)

                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [trainingDataEdge, edge]
                updateNode = [trainingDataNode, node]
            }
            else {
                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                console.log(node)
                updateEdge = [edge]
                updateNode = [node]
            }

        }
        else if (data.type == 'entity_set') {
            let newParent = childrenNodes.filter((n) => n.type == 'entity_sets')

            if (newParent.length == 0) {
                let entitySetRootItem = {
                    id: getId(),
                    type: 'entity_sets',
                    data: {
                        name: 'entity_sets',
                        // edges: 2
                    }
                }
                const { "edge": entitySetEdge, "node": entitySetNode } = onAdd(entitySetRootItem, sourceId, sourceType);
                newParent = [entitySetNode];
                // console.log("newParent")
                // console.log(newParent)

                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [entitySetEdge, edge]
                updateNode = [entitySetNode, node]
            }
            else {
                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                console.log(node)
                updateEdge = [edge]
                updateNode = [node]
            }

        }
        else if (data.type == 'response_entity_set') {
            let newParent = childrenNodes.filter((n) => n.type == 'response_entity_sets')

            if (newParent.length == 0) {
                let resEntitySetRootItem = {
                    id: getId(),
                    type: 'response_entity_sets',
                    data: {
                        name: 'response_entity_sets',
                        // edges: 2
                    }
                }
                const { "edge": resEntitySetEdge, "node": resEntitySetNode } = onAdd(resEntitySetRootItem, sourceId, sourceType);
                newParent = [resEntitySetNode];
                // console.log("newParent")
                // console.log(newParent)

                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [resEntitySetEdge, edge]
                updateNode = [resEntitySetNode, node]
            }
            else {
                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                console.log(node)
                updateEdge = [edge]
                updateNode = [node]
            }

        }
        else if (['state', 'ner_state', 'qa_state',].includes(data.type)) {
            let newParent = childrenNodes.filter((n) => n.type == 'states')
            if (newParent.length == 0) {
                let stateRootItem = {
                    id: getId(),
                    type: 'states',
                    data: {
                        name: 'states',
                        // edges: 2
                    }
                }
                const { "edge": stateEdge, "node": stateNode } = onAdd(stateRootItem, sourceId, sourceType);
                newParent = [stateNode];
                // console.log("newParent")
                // console.log(newParent)

                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [stateEdge, edge]
                updateNode = [stateNode, node]
            }
            else {
                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [edge]
                updateNode = [node]
            }

        }
        else if (['adapter'].includes(data.type)) {
            let newParent = childrenNodes.filter((n) => n.type == 'adapters')

            if (newParent.length == 0) {
                let adaptorRootItem = {
                    id: getId(),
                    type: 'adapters',
                    data: {
                        name: 'adapters',
                        // edges: 2
                    }
                }
                const { "edge": adapterRootEdge, "node": adapterRootNode } = onAdd(adaptorRootItem, sourceId, sourceType);
                newParent = [adapterRootNode];
                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [adapterRootEdge, edge]
                updateNode = [adapterRootNode, node]
            }
            else {
                const { edge, node } = onAdd(data, newParent[0].id, newParent[0].type)
                updateEdge = [edge]
                updateNode = [node]
            }

        }
        else {
            const { edge, node } = onAdd(data, sourceId, sourceType)
            updateEdge = [edge]
            updateNode = [node]
        }

        const newNode = [...nodes, ...updateNode]
        const newEdge = [...edges, ...updateEdge]
        const newInitialNode = [...initialData.nodes, ...updateNode]
        const newInitialEdge = [...initialData.edges, ...updateEdge]

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            newNode,
            newEdge
        );

        console.log("newNode")
        console.log(newNode)
        console.log(layoutedNodes)

        const { nodes: layoutedInitialNodes, edges: layoutedInitialEdges } = getLayoutedElements(
            newInitialNode,
            newInitialEdge
        );
        // // console.log(newInitialNode)

        setInitialData({
            edges: layoutedInitialEdges,
            nodes: layoutedInitialNodes
        })
        setIsCreatingNode(false)
        setIsInfoNode(false)
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
    }


    return (

        <div className="workflow h-screen flex flex-col">


            {/* <div className="workflowWrapper flex-grow h-full relative"> */}
            {nodes && <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlow

                    // defaultNodes={defaultNodes}
                    // defaultEdges={defaultEdges}
                    // defaultNodes={nodes}
                    // defaultEdges={edges}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeContextMenu={onContextMenu}

                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onNodeDoubleClick={handelCollapseAndExpand}
                    onNodeClick={handleClick}
                    onPaneClick={closeSidebar}
                    // onInit={onRestore}
                    onNodeMouseEnter={handleMouseEnter}
                    minZoom={0.1}
                    fitView
                >
                    <ContextMenu
                        isOpen={isOpen}
                        position={contextPosition}
                        onMouseLeave={() => setIsOpen(false)}
                        actions={[
                            { label: 'Delete', effect: deleteNode },
                            { label: 'Create', effect: createNode },
                            { label: 'Update', effect: updateNode }
                        ]}
                    />
                    {/* <MainMenu /> */}

                    <MiniMap pannable zoomable position="bottom-right"></MiniMap>
                    {/* <Background variant="dots" gap={12} size={1} /> */}
                </ReactFlow>
            </div>}
            <SidebarMenu />

            {isInfoNode && <Sidebar props={nodeData} />}
            {/* {isInfoNode && !doubleClick && <Sidebar props={nodeData} />} */}
            {isUpdatingNode && nodeData && <SidebarUpdate props={nodeData} setNodes={handleUpdate} />}
            {isCreatingNode && nodeData && <SidebarCreate props={nodeData} setNodes={handleCreate} />}
        </div>

    )
}


export default function MainMap() {
    return (
        <ReactFlowProvider>
            <BuilderPage />
        </ReactFlowProvider>
    )
}



const edgeTypes = {
    main: MainEdge,
};

export function getId() {
    const uniqueId = new Date().getTime(); // Generate a unique identifier using current timestamp
    const randomNum = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 100000
    const randomId = uniqueId + randomNum; // Combine the unique identifier and random number
    return randomId.toString(); // Convert the randomId to a string
}

const getWidth = (text) => {
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.textContent = text;
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width;
}

function SelectionChangeLogger() {
    useOnSelectionChange({
        onChange: ({ nodes, edges }) => console.log('changed selection', nodes, edges),
    });

    return null;
}

function createData(data) {
    if (data) {
        // console.log(data)
        let edges = [];
        let nodes = [];
        // console.log(data['states'])


        // agent 
        let agentData = {
            id: getId(),
            type: 'agent',
            data: {
                // type: 'agent',
                // edges: data['states'].length,
                name: data['name'],
                published: data['published'],
                description: data['description'],
                nlu_confidence: data['nlu_confidence'],
                ner_confidence: data['ner_confidence'],
                sen_confidence: data['sen_confidence'],
            },
        }
        const { "edge": agentEdge, "node": agentNode } = onAdd(agentData, null, null);
        nodes = [agentNode]
        let stateRootItem = {};
        if (ddata['states'].length > 0) {
            stateRootItem = {
                id: getId(),
                type: 'states',
                data: {
                    name: 'states',
                    // edges: 2
                }
            }
            const { "edge": stateEdge, "node": stateNode } = onAdd(stateRootItem, agentData.id, agentData.type);
            edges = [...edges, stateEdge];
            nodes = [...nodes, stateNode];
        }
        if (ddata['adapters'].length > 0) {
            let adaptorRootItem = {
                id: getId(),
                type: 'adapters',
                data: {
                    name: 'adapters',
                    // edges: 2
                }
            }
            const { "edge": adapterRootEdge, "node": adapterRootNode } = onAdd(adaptorRootItem, agentData.id, agentData.type);
            edges = [...edges, adapterRootEdge];
            nodes = [...nodes, adapterRootNode];

            ddata['adapters'].map((adp) => {
                let adapterItem = {
                    id: getId(),
                    type: 'adapter',
                    data: {
                        type: adp['type'],
                        name: adp['name'],
                        enabled: adp['enabled'],
                        monde_name: adp['model_name'],
                        prompt: adp['prompt'],
                        provider: adp['provider'],
                        api_key: adp['api_key'],
                    }
                }
                const { "edge": adapterEdge, "node": adapterNode } = onAdd(adapterItem, adaptorRootItem.id, adaptorRootItem.type);
                edges = [...edges, adapterEdge];
                nodes = [...nodes, adapterNode];

            })
        }

        // state 
        ddata['states'].map((item) => {
            // if (item['state_responses'].length && item['entity_set'] && )
            let stateLength = 0;


            let stateItem = {
                id: getId(),
                type: item['type'],
                data: {
                    type: item['type'],
                    // edges: stateLength,
                    // edges: item['state_responses'].length,
                    name: item['name'],
                    published: item['published']
                },
            }
            // const { "edge": stateEdge, "node": stateNode } = onAdd(stateItem, agentData.id);

            // edges = [...edges, stateEdge];
            // nodes = [...nodes, stateNode];

            if (item['prompts'].length > 0) {
                stateLength += 1;
                let promptRootItem = {
                    id: getId(),
                    type: 'prompts',
                    data: {
                        name: 'prompts',
                        // edges: item["prompts"].length
                    }
                }
                const { "edge": promptRootEdge, "node": promptRootNode } = onAdd(promptRootItem, stateItem.id, stateItem.type);
                edges = [...edges, promptRootEdge];
                nodes = [...nodes, promptRootNode];

                item.prompts.map((pro) => {
                    let promptItem = {
                        id: getId(),
                        type: 'prompt',
                        data: {
                            // type: 'prompt',
                            prompt: pro
                        }
                    }
                    const { "edge": promptEdge, "node": promptNode } = onAdd(promptItem, promptRootItem.id, promptRootItem.type);
                    edges = [...edges, promptEdge];
                    nodes = [...nodes, promptNode];

                })
            }

            if (item['state_responses'].length > 0) {
                stateLength += 1;
                // let state_response_length = 0;
                // let state_response_length = item['state_responses'].length;
                // if (item['state_responses']['type'] == "ner_response"){
                //     state_response_length = 1;
                // }
                let responseRootItem = {
                    id: getId(),
                    type: 'state_responses',
                    data: {
                        name: 'state_responses',
                        // edges: item['state_responses'].length
                    }
                }
                const { "edge": responseRootEdge, "node": responseRootNode } = onAdd(responseRootItem, stateItem.id, stateItem.type);

                edges = [...edges, responseRootEdge];
                nodes = [...nodes, responseRootNode];

                item.state_responses.map((res) => {
                    let data = {}

                    if ('ner_response' == res['type']) {
                        data = {
                            type: res['type'],
                            // edges: res['template'].length,
                            published: res['published'],
                            entity_set: res['entity_set'],
                            response: res['template'],
                            transition_state: res['transition_state'],
                        }
                    }
                    else if ('response' == res['type']) {
                        data = {
                            type: res['type'],
                            edges: res['text'].length,
                            response: res['text'],
                            published: res['published'],
                        }
                    }
                    let responseItem = {
                        id: getId(),
                        type: res['type'],
                        data,

                    }
                    const { "edge": resEdge, "node": resNode } = onAdd(responseItem, responseRootItem.id, responseRootItem.type);
                    edges = [...edges, resEdge];
                    nodes = [...nodes, resNode];

                    if ('ner_response' == res['type'] && res['entity_set'].length > 0) {
                        // stateLength += 1;
                        let resEntitySetRootItem = {
                            id: getId(),
                            type: 'response_entity_sets',
                            data: {
                                name: 'response_entity_sets',
                                // edges: item['entity_set'].length
                            }
                        }

                        const { "edge": resEntitySetRootEdge, "node": resEntitySetRootNode } = onAdd(resEntitySetRootItem, responseItem.id, responseItem.type);

                        edges = [...edges, resEntitySetRootEdge];
                        nodes = [...nodes, resEntitySetRootNode];

                        res.entity_set.map((ent) => {
                            let resEntitySetItem = {
                                id: getId(),
                                type: 'response_entity_set',
                                data: {
                                    // type: 'res_entity_set',
                                    entity: ent
                                }
                            }
                            const { "edge": resEntitySetEdge, "node": resEntitySetNode } = onAdd(resEntitySetItem, resEntitySetRootItem.id, resEntitySetRootItem.type);
                            edges = [...edges, resEntitySetEdge];
                            nodes = [...nodes, resEntitySetNode];

                        })

                    }

                })
            }
            if (item['type'] == 'ner_state') {
                if (item['entity_set'].length > 0) {
                    stateLength += 1;
                    let entitySetRootItem = {
                        id: getId(),
                        type: 'entity_sets',
                        data: {
                            name: 'entity_sets',
                            // edges: item['entity_set'].length
                        }
                    }

                    const { "edge": entitySetRootEdge, "node": entitySetRootNode } = onAdd(entitySetRootItem, stateItem.id, stateItem.type);

                    edges = [...edges, entitySetRootEdge];
                    nodes = [...nodes, entitySetRootNode];

                    item.entity_set.map((ent) => {
                        let entitySetItem = {
                            id: getId(),
                            type: 'entity_set',
                            data: {
                                // type: 'entity_set',
                                entity: ent
                            }
                        }
                        const { "edge": entitySetEdge, "node": entitySetNode } = onAdd(entitySetItem, entitySetRootItem.id, entitySetRootItem.type);
                        edges = [...edges, entitySetEdge];
                        nodes = [...nodes, entitySetNode];

                    })



                }

                if (item['training_data'].length > 0) {
                    stateLength += 1;
                    let trainingDataRootItem = {
                        id: getId(),
                        type: 'training_data',
                        data: {
                            name: 'training_data',
                            // edges: item['training_data'].length
                        }
                    }

                    const { "edge": trainingDataRootEdge, "node": trainingDataRootNode } = onAdd(trainingDataRootItem, stateItem.id, stateItem.type);

                    edges = [...edges, trainingDataRootEdge];
                    nodes = [...nodes, trainingDataRootNode];

                    item.training_data.map((train) => {
                        let trainingDataItem = {
                            id: getId(),
                            type: 'ner_data',
                            data: {
                                // type: 'training_data',
                                ner: train
                            }
                        }
                        const { "edge": trainingDataEdge, "node": trainingDataNode } = onAdd(trainingDataItem, trainingDataRootItem.id, trainingDataRootItem.type);
                        edges = [...edges, trainingDataEdge];
                        nodes = [...nodes, trainingDataNode];

                    })
                }
            }
            stateItem.data.edges = stateLength

            const { "edge": stateEdge, "node": stateNode } = onAdd(stateItem, stateRootItem.id, stateRootItem.type);
            edges = [...edges, stateEdge];
            nodes = [...nodes, stateNode];


            // state response 
        })



        // console.log("nodessss");
        // console.log(nodes);
        // console.log(edges);
        // nodes = sortNodes(nodes);

        // console.log(nodes)

        return { edges, nodes }
    }
}

const onAdd = (item, sourceId, sourceType) => {
    // console.log("onAdd called")
    let newEdge = null;
    // const positionss = {
    //     x: 0, y: 0
    // }
    // console.log("positionss")
    // console.log(positionss)
    // console.log(position)
    const newNode = {
        id: item.id,
        type: item.type,
        data: item.data,
        position: { x: 0, y: 0 },
        // position: positionss
        // width: getWidth(item.data.name) - 8
        // width: nodeWidth,
        // height: nodeHeight
        // {
        //     "x": 450,
        //     "y": 6655
        // }
    }
    // console.log("newNode on add")
    // console.log(newNode)
    if (sourceId) {
        newEdge = {
            id: sourceId + '-' + item.id,
            source: sourceId,
            target: item.id,

            type: 'main',
            style: {
                stroke: graphStyle[sourceType]
            }
        };
    }
    // console.log("newNode onadd")
    // console.log(newNode)
    return { 'edge': newEdge, 'node': newNode }
}

function getAllChildren(edges, parentId) {
    const children = edges.filter((edge) => edge.source === parentId);
    let allChildren = [];

    for (const child of children) {
        allChildren.push(child.target);
        allChildren = allChildren.concat(getAllChildren(edges, child.target));
    }

    return allChildren;
}

const defaultNodes = [
    {
        "id": "1686252318165",
        "type": "agent",
        "data": {
            "type": "agent",
            "edges": 11,
            "name": "Agent X",
            "published": true,
            "description": "This is classified",
            "nlu_confidence": 0.3,
            "ner_confidence": 0.1,
            "sen_confidence": 0.1
        },
        "position": {
            "x": 0,
            "y": 10340
        },
        "width": 50,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252291430",
        "type": "agent",
        "data": {
            "type": "prompt_root",
            "edges": 3
        },
        "position": {
            "x": 900,
            "y": 6930
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252290070",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Hi"
        },
        "position": {
            "x": 1350,
            "y": 6820
        },
        "width": 7,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252343918",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Hello"
        },
        "position": {
            "x": 1350,
            "y": 6930
        },
        "width": 29,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252296446",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Hiya"
        },
        "position": {
            "x": 1350,
            "y": 7040
        },
        "width": 24,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252377158",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 2
        },
        "position": {
            "x": 900,
            "y": 7205
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252377727",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 26,
            "name": "Hello, how may I help you?",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 7150
        },
        "width": 184,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252334035",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 124,
            "name": "I'm Eldon Marks. I'm the inventor of TrueSelph and I'd be happy to answer any questions about the product that you may have.",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 7260
        },
        "width": 903,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252297839",
        "type": "agent",
        "data": {
            "type": "state",
            "edges": 2,
            "name": "greet",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 7095
        },
        "width": 30,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252294499",
        "type": "agent",
        "data": {
            "type": "prompt_root",
            "edges": 4
        },
        "position": {
            "x": 900,
            "y": 7535
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252282354",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Can you explain how the product functions in more detail"
        },
        "position": {
            "x": 1350,
            "y": 7370
        },
        "width": 403,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252334143",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "What is true self"
        },
        "position": {
            "x": 1350,
            "y": 7480
        },
        "width": 110,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252280357",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "What's it all about"
        },
        "position": {
            "x": 1350,
            "y": 7590
        },
        "width": 122,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252366355",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "How can I use it"
        },
        "position": {
            "x": 1350,
            "y": 7700
        },
        "width": 106,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252351768",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 2
        },
        "position": {
            "x": 900,
            "y": 7865
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252351275",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 178,
            "name": "TrueSelph allows you to create an interactive version of yourself to put on your website, mobile app, or kiosk so you can truly connect with people in an infinitely scalable way.",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 7810
        },
        "width": 1245,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252281222",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 323,
            "name": "There are so many ways that you can use TrueSelph, but I'd recommend you use it to boost sales and brand awareness as you drive engagements and increase conversion rates. You can put your customer sales rep on your website, mobile app, or kiosk to offer that next-gen experience for visitors, just like what they did to me.",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 7920
        },
        "width": 2350,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252295011",
        "type": "agent",
        "data": {
            "type": "qa_state",
            "edges": 2,
            "name": "what_is_it",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 7700
        },
        "width": 66,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252330718",
        "type": "agent",
        "data": {
            "type": "prompt_root",
            "edges": 3
        },
        "position": {
            "x": 900,
            "y": 8140
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252334150",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Can you give me a demonstration of how it works?"
        },
        "position": {
            "x": 1350,
            "y": 8030
        },
        "width": 355,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252304930",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Show me how it works"
        },
        "position": {
            "x": 1350,
            "y": 8140
        },
        "width": 153,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252328847",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "I'd like to see it"
        },
        "position": {
            "x": 1350,
            "y": 8250
        },
        "width": 100,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252298860",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 2
        },
        "position": {
            "x": 900,
            "y": 8415
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252306350",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 167,
            "name": "Sure, there is no better demonstration than this one. This interaction is powered by true self. Just between us, it's not a Zoom call. There's no one on the other end.",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 8360
        },
        "width": 1172,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252305641",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 22,
            "name": "You're looking at it..",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 8470
        },
        "width": 135,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252353595",
        "type": "agent",
        "data": {
            "type": "qa_state",
            "edges": 2,
            "name": "demonstration",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 8305
        },
        "width": 97,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252301461",
        "type": "agent",
        "data": {
            "type": "prompt_root",
            "edges": 4
        },
        "position": {
            "x": 900,
            "y": 8745
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252316150",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Bye"
        },
        "position": {
            "x": 1350,
            "y": 8580
        },
        "width": 19,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252354980",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Talk to you later"
        },
        "position": {
            "x": 1350,
            "y": 8690
        },
        "width": 106,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252326132",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Goodbye"
        },
        "position": {
            "x": 1350,
            "y": 8800
        },
        "width": 58,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252278987",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "See you later, have a great day!"
        },
        "position": {
            "x": 1350,
            "y": 8910
        },
        "width": 218,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252344306",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 2
        },
        "position": {
            "x": 900,
            "y": 9075
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252365600",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 30,
            "name": "It was nice chatting with you.",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 9020
        },
        "width": 201,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252283468",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 42,
            "name": "See you later, it was nice talking to you.",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 9130
        },
        "width": 276,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252279725",
        "type": "agent",
        "data": {
            "type": "state",
            "edges": 2,
            "name": "goodbye",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 8910
        },
        "width": 55,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252362783",
        "type": "agent",
        "data": {
            "type": "prompt_root",
            "edges": 3
        },
        "position": {
            "x": 900,
            "y": 9350
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252345306",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "My name is John Doe what it yours?"
        },
        "position": {
            "x": 1350,
            "y": 9240
        },
        "width": 252,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252377717",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "I am Janet"
        },
        "position": {
            "x": 1350,
            "y": 9350
        },
        "width": 67,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252316454",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "They call me Marcus Webley"
        },
        "position": {
            "x": 1350,
            "y": 9460
        },
        "width": 199,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252321275",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 1
        },
        "position": {
            "x": 900,
            "y": 9570
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252319357",
        "type": "agent",
        "data": {
            "type": "ner_response",
            "edges": 50,
            "published": true,
            "entity_set": [
                "name"
            ],
            "name": "It's nice to meet you {{name}}. Where do you live?",
            "transition_state": "where_do_you_live"
        },
        "position": {
            "x": 1350,
            "y": 9570
        },
        "width": 351,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252328848",
        "type": "agent",
        "data": {
            "type": "res_entity_set_root",
            "edges": 1
        },
        "position": {
            "x": 1800,
            "y": 9570
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252322490",
        "type": "agent",
        "data": {
            "type": "res_entity_set",
            "name": "name"
        },
        "position": {
            "x": 2250,
            "y": 9570
        },
        "width": 32,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252303003",
        "type": "agent",
        "data": {
            "type": "entity_set_root",
            "edges": 1
        },
        "position": {
            "x": 900,
            "y": 9680
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252372346",
        "type": "agent",
        "data": {
            "type": "entity_set",
            "name": "name"
        },
        "position": {
            "x": 1350,
            "y": 9680
        },
        "width": 32,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252359490",
        "type": "agent",
        "data": {
            "type": "training_data_root",
            "edges": 4
        },
        "position": {
            "x": 900,
            "y": 9955
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252374241",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "My name is [Marcus Webley](name)"
        },
        "position": {
            "x": 1350,
            "y": 9790
        },
        "width": 253,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252344445",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "They call me [John Doe](name)"
        },
        "position": {
            "x": 1350,
            "y": 9900
        },
        "width": 220,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252332646",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "I'm [Margaret Fraser](name)"
        },
        "position": {
            "x": 1350,
            "y": 10010
        },
        "width": 197,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252331925",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "[Jonathan](name) is my name"
        },
        "position": {
            "x": 1350,
            "y": 10120
        },
        "width": 208,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252368352",
        "type": "agent",
        "data": {
            "type": "ner_state",
            "edges": 4,
            "name": "handle_introduction",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 9625
        },
        "width": 137,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252321277",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 1
        },
        "position": {
            "x": 900,
            "y": 10230
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252282686",
        "type": "agent",
        "data": {
            "type": "ner_response",
            "edges": 46,
            "published": true,
            "entity_set": [
                "address"
            ],
            "name": "It's nice to know that you live in {{address}}"
        },
        "position": {
            "x": 1350,
            "y": 10230
        },
        "width": 303,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252369501",
        "type": "agent",
        "data": {
            "type": "res_entity_set_root",
            "edges": 1
        },
        "position": {
            "x": 1800,
            "y": 10230
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252373744",
        "type": "agent",
        "data": {
            "type": "res_entity_set",
            "name": "address"
        },
        "position": {
            "x": 2250,
            "y": 10230
        },
        "width": 50,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252284349",
        "type": "agent",
        "data": {
            "type": "entity_set_root",
            "edges": 1
        },
        "position": {
            "x": 900,
            "y": 10340
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252361815",
        "type": "agent",
        "data": {
            "type": "entity_set",
            "name": "address"
        },
        "position": {
            "x": 1350,
            "y": 10340
        },
        "width": 50,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252322484",
        "type": "agent",
        "data": {
            "type": "training_data_root",
            "edges": 4
        },
        "position": {
            "x": 900,
            "y": 10615
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252317098",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "I live at [223 Wren Lane](address)"
        },
        "position": {
            "x": 1350,
            "y": 10450
        },
        "width": 238,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252378306",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "Oh I'm from [Guyana](address)"
        },
        "position": {
            "x": 1350,
            "y": 10560
        },
        "width": 217,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252359939",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "I live over at [Floral Park, North Ruimveldt]](address)"
        },
        "position": {
            "x": 1350,
            "y": 10670
        },
        "width": 371,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252339625",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "[123 Peaceful Lane](address)"
        },
        "position": {
            "x": 1350,
            "y": 10780
        },
        "width": 205,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252292827",
        "type": "agent",
        "data": {
            "type": "ner_state",
            "edges": 3,
            "name": "where_do_you_live",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 10340
        },
        "width": 131,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252351697",
        "type": "agent",
        "data": {
            "type": "prompt_root",
            "edges": 3
        },
        "position": {
            "x": 900,
            "y": 11000
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252375580",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "I would like to send a message"
        },
        "position": {
            "x": 1350,
            "y": 10890
        },
        "width": 212,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252358561",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Allow me to send a message"
        },
        "position": {
            "x": 1350,
            "y": 11000
        },
        "width": 198,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252344721",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Send a message"
        },
        "position": {
            "x": 1350,
            "y": 11110
        },
        "width": 111,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252316246",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 2
        },
        "position": {
            "x": 900,
            "y": 11275
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252371822",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 33,
            "name": "Who would you like to send it to?",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 11220
        },
        "width": 230,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252330281",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 25,
            "name": "Sure, who is it going to?",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 11330
        },
        "width": 165,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252301908",
        "type": "agent",
        "data": {
            "type": "state",
            "edges": 2,
            "name": "send_message",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 11165
        },
        "width": 102,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252282691",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 1
        },
        "position": {
            "x": 900,
            "y": 11440
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252366302",
        "type": "agent",
        "data": {
            "type": "ner_response",
            "edges": 51,
            "published": true,
            "entity_set": [
                "contact"
            ],
            "name": "What message would you like to send to {{contact}}?",
            "transition_state": "compose_message_body"
        },
        "position": {
            "x": 1350,
            "y": 11440
        },
        "width": 373,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252353357",
        "type": "agent",
        "data": {
            "type": "res_entity_set_root",
            "edges": 1
        },
        "position": {
            "x": 1800,
            "y": 11440
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252353463",
        "type": "agent",
        "data": {
            "type": "res_entity_set",
            "name": "contact"
        },
        "position": {
            "x": 2250,
            "y": 11440
        },
        "width": 47,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252280167",
        "type": "agent",
        "data": {
            "type": "entity_set_root",
            "edges": 1
        },
        "position": {
            "x": 900,
            "y": 11550
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252324226",
        "type": "agent",
        "data": {
            "type": "entity_set",
            "name": "contact"
        },
        "position": {
            "x": 1350,
            "y": 11550
        },
        "width": 47,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252342741",
        "type": "agent",
        "data": {
            "type": "training_data_root",
            "edges": 3
        },
        "position": {
            "x": 900,
            "y": 11770
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252336558",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "[Cindy August](contact)"
        },
        "position": {
            "x": 1350,
            "y": 11660
        },
        "width": 167,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252365032",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "I would like to send it to [Eldon Marks](contact)"
        },
        "position": {
            "x": 1350,
            "y": 11770
        },
        "width": 333,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252374978",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "Send it to [Dora](contact)"
        },
        "position": {
            "x": 1350,
            "y": 11880
        },
        "width": 178,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252345015",
        "type": "agent",
        "data": {
            "type": "ner_state",
            "edges": 3,
            "name": "prompt_for_message_contact",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 11550
        },
        "width": 211,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252287615",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 1
        },
        "position": {
            "x": 900,
            "y": 11990
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252368702",
        "type": "agent",
        "data": {
            "type": "ner_response",
            "edges": 42,
            "published": true,
            "entity_set": [
                "message"
            ],
            "name": "Got it, ready to send message? {{message}}",
            "transition_state": "confirm_message_send"
        },
        "position": {
            "x": 1350,
            "y": 11990
        },
        "width": 309,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252351206",
        "type": "agent",
        "data": {
            "type": "res_entity_set_root",
            "edges": 1
        },
        "position": {
            "x": 1800,
            "y": 11990
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252365153",
        "type": "agent",
        "data": {
            "type": "res_entity_set",
            "name": "message"
        },
        "position": {
            "x": 2250,
            "y": 11990
        },
        "width": 57,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252358817",
        "type": "agent",
        "data": {
            "type": "entity_set_root",
            "edges": 1
        },
        "position": {
            "x": 900,
            "y": 12100
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252355770",
        "type": "agent",
        "data": {
            "type": "entity_set",
            "name": "message"
        },
        "position": {
            "x": 1350,
            "y": 12100
        },
        "width": 57,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252352166",
        "type": "agent",
        "data": {
            "type": "training_data_root",
            "edges": 3
        },
        "position": {
            "x": 900,
            "y": 12320
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252282840",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "This is my message [can you pick up groceries](message)"
        },
        "position": {
            "x": 1350,
            "y": 12210
        },
        "width": 412,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252315377",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "Tell him that [this is a good bit of things to say](message)"
        },
        "position": {
            "x": 1350,
            "y": 12320
        },
        "width": 407,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252310157",
        "type": "agent",
        "data": {
            "type": "training_data",
            "name": "[Making my way down town coming back home](message)"
        },
        "position": {
            "x": 1350,
            "y": 12430
        },
        "width": 416,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252308113",
        "type": "agent",
        "data": {
            "type": "ner_state",
            "edges": 3,
            "name": "compose_message_body",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 12100
        },
        "width": 178,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252287418",
        "type": "agent",
        "data": {
            "type": "prompt_root",
            "edges": 6
        },
        "position": {
            "x": 900,
            "y": 12815
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252358290",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Yes"
        },
        "position": {
            "x": 1350,
            "y": 12540
        },
        "width": 18,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252323948",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Sure"
        },
        "position": {
            "x": 1350,
            "y": 12650
        },
        "width": 25,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252284398",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Nevermind"
        },
        "position": {
            "x": 1350,
            "y": 12760
        },
        "width": 71,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252311357",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Yep please send it"
        },
        "position": {
            "x": 1350,
            "y": 12870
        },
        "width": 124,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252324436",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Send it"
        },
        "position": {
            "x": 1350,
            "y": 12980
        },
        "width": 43,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252331047",
        "type": "agent",
        "data": {
            "type": "prompt",
            "name": "Don't send it"
        },
        "position": {
            "x": 1350,
            "y": 13090
        },
        "width": 84,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252335470",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 2
        },
        "position": {
            "x": 900,
            "y": 13255
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252328515",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 18,
            "name": "Ok, I'll forget it",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 13200
        },
        "width": 98,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252313924",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 34,
            "name": "Affirmative, your message was sent",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 13310
        },
        "width": 249,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252298040",
        "type": "agent",
        "data": {
            "type": "qa_state",
            "edges": 2,
            "name": "confirm_message_send",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 13035
        },
        "width": 166,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252322391",
        "type": "agent",
        "data": {
            "type": "state_response_root",
            "edges": 2
        },
        "position": {
            "x": 900,
            "y": 13475
        },
        "width": -8,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252319990",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 43,
            "name": "Hmm.. I'm not sure I can help with that one",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 13420
        },
        "width": 302,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252314452",
        "type": "agent",
        "data": {
            "type": "response",
            "edges": 24,
            "name": "I'm sorry, I'm not sure.",
            "published": true
        },
        "position": {
            "x": 1350,
            "y": 13530
        },
        "width": 153,
        "targetPosition": "left",
        "sourcePosition": "right"
    },
    {
        "id": "1686252310198",
        "type": "agent",
        "data": {
            "type": "state",
            "edges": 1,
            "name": "confused",
            "published": true
        },
        "position": {
            "x": 450,
            "y": 13475
        },
        "width": 60,
        "targetPosition": "left",
        "sourcePosition": "right"
    }
]

const defaultEdges = [
    {
        "id": "1686252297839-1686252291430",
        "source": "1686252297839",
        "target": "1686252291430",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252291430-1686252290070",
        "source": "1686252291430",
        "target": "1686252290070",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252291430-1686252343918",
        "source": "1686252291430",
        "target": "1686252343918",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252291430-1686252296446",
        "source": "1686252291430",
        "target": "1686252296446",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252297839-1686252377158",
        "source": "1686252297839",
        "target": "1686252377158",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252377158-1686252377727",
        "source": "1686252377158",
        "target": "1686252377727",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252377158-1686252334035",
        "source": "1686252377158",
        "target": "1686252334035",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252297839",
        "source": "1686252318165",
        "target": "1686252297839",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252295011-1686252294499",
        "source": "1686252295011",
        "target": "1686252294499",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252294499-1686252282354",
        "source": "1686252294499",
        "target": "1686252282354",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252294499-1686252334143",
        "source": "1686252294499",
        "target": "1686252334143",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252294499-1686252280357",
        "source": "1686252294499",
        "target": "1686252280357",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252294499-1686252366355",
        "source": "1686252294499",
        "target": "1686252366355",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252295011-1686252351768",
        "source": "1686252295011",
        "target": "1686252351768",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252351768-1686252351275",
        "source": "1686252351768",
        "target": "1686252351275",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252351768-1686252281222",
        "source": "1686252351768",
        "target": "1686252281222",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252295011",
        "source": "1686252318165",
        "target": "1686252295011",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252353595-1686252330718",
        "source": "1686252353595",
        "target": "1686252330718",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252330718-1686252334150",
        "source": "1686252330718",
        "target": "1686252334150",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252330718-1686252304930",
        "source": "1686252330718",
        "target": "1686252304930",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252330718-1686252328847",
        "source": "1686252330718",
        "target": "1686252328847",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252353595-1686252298860",
        "source": "1686252353595",
        "target": "1686252298860",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252298860-1686252306350",
        "source": "1686252298860",
        "target": "1686252306350",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252298860-1686252305641",
        "source": "1686252298860",
        "target": "1686252305641",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252353595",
        "source": "1686252318165",
        "target": "1686252353595",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252279725-1686252301461",
        "source": "1686252279725",
        "target": "1686252301461",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252301461-1686252316150",
        "source": "1686252301461",
        "target": "1686252316150",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252301461-1686252354980",
        "source": "1686252301461",
        "target": "1686252354980",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252301461-1686252326132",
        "source": "1686252301461",
        "target": "1686252326132",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252301461-1686252278987",
        "source": "1686252301461",
        "target": "1686252278987",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252279725-1686252344306",
        "source": "1686252279725",
        "target": "1686252344306",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252344306-1686252365600",
        "source": "1686252344306",
        "target": "1686252365600",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252344306-1686252283468",
        "source": "1686252344306",
        "target": "1686252283468",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252279725",
        "source": "1686252318165",
        "target": "1686252279725",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252368352-1686252362783",
        "source": "1686252368352",
        "target": "1686252362783",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252362783-1686252345306",
        "source": "1686252362783",
        "target": "1686252345306",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252362783-1686252377717",
        "source": "1686252362783",
        "target": "1686252377717",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252362783-1686252316454",
        "source": "1686252362783",
        "target": "1686252316454",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252368352-1686252321275",
        "source": "1686252368352",
        "target": "1686252321275",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252321275-1686252319357",
        "source": "1686252321275",
        "target": "1686252319357",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252319357-1686252328848",
        "source": "1686252319357",
        "target": "1686252328848",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252328848-1686252322490",
        "source": "1686252328848",
        "target": "1686252322490",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252368352-1686252303003",
        "source": "1686252368352",
        "target": "1686252303003",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252303003-1686252372346",
        "source": "1686252303003",
        "target": "1686252372346",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252368352-1686252359490",
        "source": "1686252368352",
        "target": "1686252359490",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252359490-1686252374241",
        "source": "1686252359490",
        "target": "1686252374241",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252359490-1686252344445",
        "source": "1686252359490",
        "target": "1686252344445",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252359490-1686252332646",
        "source": "1686252359490",
        "target": "1686252332646",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252359490-1686252331925",
        "source": "1686252359490",
        "target": "1686252331925",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252368352",
        "source": "1686252318165",
        "target": "1686252368352",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252292827-1686252321277",
        "source": "1686252292827",
        "target": "1686252321277",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252321277-1686252282686",
        "source": "1686252321277",
        "target": "1686252282686",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252282686-1686252369501",
        "source": "1686252282686",
        "target": "1686252369501",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252369501-1686252373744",
        "source": "1686252369501",
        "target": "1686252373744",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252292827-1686252284349",
        "source": "1686252292827",
        "target": "1686252284349",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252284349-1686252361815",
        "source": "1686252284349",
        "target": "1686252361815",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252292827-1686252322484",
        "source": "1686252292827",
        "target": "1686252322484",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252322484-1686252317098",
        "source": "1686252322484",
        "target": "1686252317098",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252322484-1686252378306",
        "source": "1686252322484",
        "target": "1686252378306",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252322484-1686252359939",
        "source": "1686252322484",
        "target": "1686252359939",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252322484-1686252339625",
        "source": "1686252322484",
        "target": "1686252339625",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252292827",
        "source": "1686252318165",
        "target": "1686252292827",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252301908-1686252351697",
        "source": "1686252301908",
        "target": "1686252351697",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252351697-1686252375580",
        "source": "1686252351697",
        "target": "1686252375580",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252351697-1686252358561",
        "source": "1686252351697",
        "target": "1686252358561",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252351697-1686252344721",
        "source": "1686252351697",
        "target": "1686252344721",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252301908-1686252316246",
        "source": "1686252301908",
        "target": "1686252316246",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252316246-1686252371822",
        "source": "1686252316246",
        "target": "1686252371822",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252316246-1686252330281",
        "source": "1686252316246",
        "target": "1686252330281",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252301908",
        "source": "1686252318165",
        "target": "1686252301908",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252345015-1686252282691",
        "source": "1686252345015",
        "target": "1686252282691",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252282691-1686252366302",
        "source": "1686252282691",
        "target": "1686252366302",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252366302-1686252353357",
        "source": "1686252366302",
        "target": "1686252353357",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252353357-1686252353463",
        "source": "1686252353357",
        "target": "1686252353463",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252345015-1686252280167",
        "source": "1686252345015",
        "target": "1686252280167",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252280167-1686252324226",
        "source": "1686252280167",
        "target": "1686252324226",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252345015-1686252342741",
        "source": "1686252345015",
        "target": "1686252342741",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252342741-1686252336558",
        "source": "1686252342741",
        "target": "1686252336558",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252342741-1686252365032",
        "source": "1686252342741",
        "target": "1686252365032",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252342741-1686252374978",
        "source": "1686252342741",
        "target": "1686252374978",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252345015",
        "source": "1686252318165",
        "target": "1686252345015",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252308113-1686252287615",
        "source": "1686252308113",
        "target": "1686252287615",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252287615-1686252368702",
        "source": "1686252287615",
        "target": "1686252368702",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252368702-1686252351206",
        "source": "1686252368702",
        "target": "1686252351206",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252351206-1686252365153",
        "source": "1686252351206",
        "target": "1686252365153",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252308113-1686252358817",
        "source": "1686252308113",
        "target": "1686252358817",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252358817-1686252355770",
        "source": "1686252358817",
        "target": "1686252355770",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252308113-1686252352166",
        "source": "1686252308113",
        "target": "1686252352166",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252352166-1686252282840",
        "source": "1686252352166",
        "target": "1686252282840",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252352166-1686252315377",
        "source": "1686252352166",
        "target": "1686252315377",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252352166-1686252310157",
        "source": "1686252352166",
        "target": "1686252310157",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252308113",
        "source": "1686252318165",
        "target": "1686252308113",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252298040-1686252287418",
        "source": "1686252298040",
        "target": "1686252287418",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252287418-1686252358290",
        "source": "1686252287418",
        "target": "1686252358290",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252287418-1686252323948",
        "source": "1686252287418",
        "target": "1686252323948",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252287418-1686252284398",
        "source": "1686252287418",
        "target": "1686252284398",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252287418-1686252311357",
        "source": "1686252287418",
        "target": "1686252311357",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252287418-1686252324436",
        "source": "1686252287418",
        "target": "1686252324436",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252287418-1686252331047",
        "source": "1686252287418",
        "target": "1686252331047",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252298040-1686252335470",
        "source": "1686252298040",
        "target": "1686252335470",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252335470-1686252328515",
        "source": "1686252335470",
        "target": "1686252328515",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252335470-1686252313924",
        "source": "1686252335470",
        "target": "1686252313924",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252298040",
        "source": "1686252318165",
        "target": "1686252298040",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252310198-1686252322391",
        "source": "1686252310198",
        "target": "1686252322391",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252322391-1686252319990",
        "source": "1686252322391",
        "target": "1686252319990",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252322391-1686252314452",
        "source": "1686252322391",
        "target": "1686252314452",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    },
    {
        "id": "1686252318165-1686252310198",
        "source": "1686252318165",
        "target": "1686252310198",
        "type": "main",
        "style": {
            "stroke": "#930D0D"
        }
    }
]

