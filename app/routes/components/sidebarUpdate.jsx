import { useState } from 'react'

export default function SidebarUpdate({ props, setNodes }) {

  const [updatedData, setUpdatedData] = useState(props);
  const [published, setPublished] = useState(updatedData.data.published || null)
  const [error, setError] = useState({});



  function validateFields() {
    const updatedError = {};
    if (!updatedData.data.name && updatedData.data.name != undefined) {
      updatedError.name = 'Name field is required.';
    } 
    if (!updatedData.data.text && updatedData.data.text != undefined) {
      updatedError.text = 'Text field is required.';
    } 
    if (!updatedData.data.description && updatedData.data.description != undefined) {
      updatedError.description = 'Description field is required.';
    } 
    if (!updatedData.data.transition_state && updatedData.data.transition_state != undefined) {
      updatedError.transition_state = 'Transition State field is required.';
    } 
    if (Object.keys(updatedError).length !== 0) {
      setError(updatedError);
      return false
    }else{
      setError(updatedError);
      return true
    }

  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        [name]: value,
      },
    }));
  };

  function onPublish(published) {
    console.log(published)
    setPublished(published)
    setUpdatedData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        published: published,
      },
    }));
  }

  function handleUpdate() {
    let isValid = validateFields()
    
    if (isValid) {
      setNodes(updatedData);
    }
  }



  return (
    <aside className="sidebar bg-gray-200 w-80 h-screen p-4 fixed left-0">
      <div>
        <h2 className="text-2xl font-bold mb-4">Update</h2>
        {props.data.name && (
          <label className="block mb-2">
            <span className="font-bold">Name</span>
            <input
              type="text"
              name='name'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.data.name}
              onChange={handleInputChange}
              autoFocus
            />
          </label>
        )}
        {error.name && (
          <p className="text-red-500 mb-2">{error.name}</p>
        )}

        {props.data.text && (
          <label className="block mb-2">
            <span className="font-bold">Text</span>
            <textarea
              rows={3}
              type="text"
              name='text'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.data.text}
              onChange={handleInputChange}
              autoFocus
            />
          </label>
        )}
        {error.text && (
          <p className="text-red-500 mb-2">{error.text}</p>
        )}

        {props.data.type && (
          <label className="block mb-2">
            <span className="font-bold">Type</span>
            <select
              name="type"
              value={updatedData.data.type}
              onChange={handleInputChange}
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1 appearance-none"
            >
              <option value="agent">Agent</option>
              <option value="state">State</option>
              <option value="qa_state">Qa State</option>
              <option value="nlu_response">NLU Response</option>
              <option value="response">Response</option>
              <option value="prompt">Prompt</option>
            </select>
          </label>
        )}

        {props.data.description && (
          <label className="block mb-2">
            <span className="font-bold">Description</span>
            <textarea
              rows={3}
              type="text"
              name='description'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.data.description}
              onChange={handleInputChange}

            />
          </label>
        )}
        {error.description && (
          <p className="text-red-500 mb-2">{error.description}</p>
        )}

        {props.data.transition_state && (
          <label className="block mb-2">
            <span className="font-bold">Transition State</span>
            <input
              type="text"
              name='transition_state'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.data.transition_state}
              onChange={handleInputChange}
            />
          </label>
        )}
        {error.transition_state && (
          <p className="text-red-500 mb-2">{error.transition_state}</p>
        )}

        {props.data.ner_confidence && (
          <label className="block mb-2">
            <div className='flex items-center justify-between'>
              <span className="font-bold">Ner Confidence:</span>
              <span className="font-bold">{updatedData.data.ner_confidence}</span>
            </div>
            <input
              type="range"
              name="ner_confidence"
              min={0}
              max={1}
              step={0.1}
              className="w-full mt-1"
              value={updatedData.data.ner_confidence}
              onChange={handleInputChange}
            />
          </label>
        )}

        {props.data.nlu_confidence && (
          <label className="block mb-2">
            <div className='flex items-center justify-between'>
              <span className="font-bold">Nlu Confidence:</span>
              <span className="font-bold">{updatedData.data.nlu_confidence}</span>
            </div>
            <input
              type="range"
              name="nlu_confidence"
              min={0}
              max={1}
              step={0.1}
              className="w-full mt-1"
              value={updatedData.data.nlu_confidence}
              onChange={handleInputChange}
            />
          </label>
        )}

        {props.data.sen_confidence && (
          <label className="block mb-2">
            <div className='flex items-center justify-between'>
              <span className="font-bold">Sen Confidence:</span>
              <span className="font-bold">{updatedData.data.sen_confidence}</span>
            </div>
            <input
              type="range"
              name="sen_confidence"
              min={0}
              max={1}
              step={0.1}
              className="w-full mt-1"
              value={updatedData.data.sen_confidence}
              onChange={handleInputChange}
            />
          </label>
        )}

        {published !== undefined && (
          <label className="mb-2 flex items-center justify-between">
            <span className="font-bold">Published</span>
            <div className='mt-1'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={published} onChange={(e) => onPublish(Boolean(e.target.checked))} name="published" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </label>
        )}

      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4"
      >
        Update
      </button>
    </aside>
  );

};




/*
name /
type /
published /
response
text
description /
ner_confidence /
nlu_confidence /
sen_confidence /
transition_state

*/