import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ props }) {
  // const onDragStart = (event, nodeType) => {
  //   event.dataTransfer.setData('application/reactflow', nodeType);
  //   event.dataTransfer.effectAllowed = 'move';
  // };
  console.log(props)
  // let label = "";
  // // console.log(props)
  // if (props) {
  //   // console.log("data sidebar")
  //   console.log(props)
  //   label = props.data.name
  // }
  const data = props.data;

  return (
    <aside className="sidebar bg-gray-200 w-80 h-screen p-4 fixed left-0">
      {/* <aside className="sidebar bg-gradient-to-r from-gray-400 to-white w-80 h-screen p-4 fixed left-0"> */}

      <div>
        <h2 className="text-2xl font-bold mb-4">Information</h2>

        {data.name && <p className="mb-2"><span className="font-bold">Name:</span> {data.name}</p>}
        {data.description && <p className="mb-2"><span className="font-bold">Description:</span> {data.description}</p>}
        {data.nlu_confidence && <p className="mb-2"><span className="font-bold">NLU Confidence:</span> {data.nlu_confidence}</p>}
        {data.ner_confidence && <p className="mb-2"><span className="font-bold">NER Confidence:</span> {data.ner_confidence}</p>}
        {data.sen_confidence && <p className="mb-2"><span className="font-bold">SEN Confidence:</span> {data.sen_confidence}</p>}


        {data.type && <p className="mb-2"><span className="font-bold">Type:</span> {data.type}</p>}
        {data.prompt && <p className="mb-2"><span className="font-bold">Prompt:</span> {data.prompt}</p>}
        {data.provider && <p className="mb-2"><span className="font-bold">provider:</span> {data.provider}</p>}
        {data.model_name && <p className="mb-2"><span className="font-bold">Model Name:</span> {data.model_name}</p>}
        {data.api_key && <p className="mb-2"><span className="font-bold">Api Key:</span> {data.api_key}</p>}
        {data.response && <p className="mb-2"><span className="font-bold">response:</span> {data.response}</p>}
        {data.entity && <p className="mb-2"><span className="font-bold">Entity:</span> {data.entity}</p>}
        {data.Ner && <p className="mb-2"><span className="font-bold">Ner:</span> {data.Ner}</p>}
        {data.ner_response && <p className="mb-2"><span className="font-bold">Ner Response:</span> {data.ner_response}</p>}

        {data.enabled && <p className="mb-2"><span className="font-bold">Enabled:</span> {data.enabled ? 'Yes' : 'No'}</p>}
        {data.published && <p className="mb-2"><span className="font-bold">Published:</span> {data.published ? 'Yes' : 'No'}</p>}

      </div>
    </aside>
  );

};