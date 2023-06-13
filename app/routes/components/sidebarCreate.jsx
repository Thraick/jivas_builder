import { useEffect, useState } from 'react'
import { getId } from '../graph'

export default function SidebarCreate({ props, setNodes }) {
  const [selectedType, setSelectedType] = useState('');
  const [updatedData, setUpdatedData] = useState();
  const [published, setPublished] = useState()
  const [adapter, setAdapter] = useState('');
  const [adapterEnable, setAdapterEnable] = useState();
  const [adapterType, setAdapterType] = useState();
  const [error, setError] = useState({});


  function validateFields() {
    const updatedError = {};
    if (!updatedData?.name && updatedData?.name != undefined) {
      updatedError.name = 'Name field is required.';
    }
    if (!updatedData?.text && updatedData?.text != undefined) {
      updatedError.text = 'Text field is required.';
    }
    if (!updatedData?.description && updatedData?.description != undefined) {
      updatedError.description = 'Description field is required.';
    }
    if (!updatedData?.transition_state && updatedData?.transition_state != undefined) {
      updatedError.transition_state = 'Transition State field is required.';
    }
    if (Object.keys(updatedError).length !== 0) {
      setError(updatedError);
      return false
    } else {
      setError(updatedError);
      return true
    }

  }

  function onPublish(published) {
    setPublished(published)
    setUpdatedData((prevData) => ({
      ...prevData,
      published: published,
    }));
  }

  function onAdapterEnable(isEnable) {
    setAdapterEnable(isEnable)
    setUpdatedData((prevData) => ({
      ...prevData,
      enabled: isEnable,
    }));
  }

  function handleTypeChange(event) {
    const currentSelected = event.target.value;
    setAdapterEnable(undefined)
    setPublished(undefined)
    console.log("fieldTypes[currentSelected]")
    console.log(fieldTypes[currentSelected])
    setSelectedType(currentSelected);
    setUpdatedData(fieldTypes[currentSelected]);
    if (fieldTypes[currentSelected]?.published) {
      setPublished(fieldTypes[currentSelected].published || null)
    }
    if (fieldTypes[currentSelected]?.enabled) {
      setAdapterEnable(fieldTypes[currentSelected].enabled || null)
    }
    if (fieldTypes[currentSelected]?.type != undefined && currentSelected != 'adapter') {
      setUpdatedData((prevData) => ({
        ...prevData,
        type: currentSelected,
      }));
    }
    // else{
    //   setUpdatedData((prevData) => ({
    //     ...prevData,
    //     type: currentSelected,
    //   }));
    // }
  }

  function handleAdapterChange(event) {
    setAdapter(event.target.value);
  }

  function handleAdapterTypeChange(event) {
    setAdapterType(event.target.value);
    setUpdatedData((prevData) => ({
      ...prevData,
      type: event.target.value,
    }));
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleCreate() {
    let isValid = validateFields()
    let newUpdatedData = updatedData;

    if (adapter == "") {
      delete newUpdatedData.adapter;
    }
    else {
      newUpdatedData.adapter = adapter
    }

    if (isValid) {
      const validData = {
        id: getId(),
        data: newUpdatedData,
        type: selectedType
      }
      setNodes(validData, props.id, props.type);
    }
  }


  return (
    <aside className="sidebar bg-gray-200 w-80 h-screen p-4 fixed left-0">
      <div>
        <h2 className="text-2xl font-bold mb-4">Create</h2>
        {/* type  */}
        {props && nodeType[props.type] && <div>
          <label className="block mb-2">
            <span className="font-bold">Node</span>
            <select
              name="nodeType"
              value={selectedType}
              onChange={handleTypeChange}
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1 appearance-none"
              autoFocus
            >
              {nodeType[props.type].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>}
        {/* name  */}
        {updatedData && updatedData.name != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Name</span>
            <input
              type="text"
              name='name'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.name}
              onChange={handleInputChange}
            // autoFocus
            />
          </label>
          {error.name && (
            <p className="text-red-500 mb-2">{error.name}</p>
          )}
        </div>}
        {/* text  */}
        {updatedData && updatedData.text != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Text</span>
            <input
              type="text"
              name='text'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.text}
              onChange={handleInputChange}
            />
          </label>
          {error.text && (
            <p className="text-red-500 mb-2">{error.text}</p>
          )}
        </div>}
        {/* template  */}
        {updatedData && updatedData.template != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Template</span>
            <textarea
              rows={2}
              type="text"
              name='template'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.template}
              onChange={handleInputChange}
            />
          </label>
          {error.template && (
            <p className="text-red-500 mb-2">{error.template}</p>
          )}
        </div>}
        {/* adapter  */}
        {updatedData && updatedData.type != undefined && ['adapter'].includes(selectedType) && <div>
          <label className="block mb-2">
            <span className="font-bold">Adapter Type</span>
            <select
              name="type"
              value={adapterType}
              onChange={handleAdapterTypeChange}
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1 appearance-none"
            >
              {adapterTypeList.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>}
        {/* entity  */}
        {updatedData && updatedData.entity != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Entity</span>
            <input
              type="text"
              name='entity'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.entity}
              onChange={handleInputChange}
            />
          </label>
          {error.entity && (
            <p className="text-red-500 mb-2">{error.entity}</p>
          )}
        </div>}
        {/* prompt  */}
        {updatedData && updatedData.prompt != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Prompt</span>
            <input
              type="text"
              name='prompt'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.prompt}
              onChange={handleInputChange}
            />
          </label>
          {error.prompt && (
            <p className="text-red-500 mb-2">{error.prompt}</p>
          )}
        </div>}
        {/* response  */}
        {updatedData && updatedData.response != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Response</span>
            <textarea
              rows={2}
              type="text"
              name='response'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.response}
              onChange={handleInputChange}
            />
          </label>
          {error.response && (
            <p className="text-red-500 mb-2">{error.response}</p>
          )}
        </div>}
        {/* transition_state  */}
        {updatedData && updatedData.transition_state != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Transition State</span>
            <input
              type="text"
              name='transition_state'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.transition_state}
              onChange={handleInputChange}
            />
          </label>
          {error.transition_state && (
            <p className="text-red-500 mb-2">{error.transition_state}</p>
          )}
        </div>}
        {/* ner  */}
        {updatedData && updatedData.ner != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Ner Response</span>
            <textarea
              rows={3}
              type="text"
              name='ner'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.ner}
              onChange={handleInputChange}
            />
          </label>
          {error.ner && (
            <p className="text-red-500 mb-2">{error.ner}</p>
          )}
        </div>}
        {/* adapter  */}
        {updatedData && updatedData.adapter != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Adapter</span>
            <select
              name="adapter"
              value={adapter}
              onChange={handleAdapterChange}
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1 appearance-none"
            >
              {adapterList.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>}
        {/* provider  */}
        {updatedData && updatedData.provider != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Provider</span>
            <input
              type="text"
              name='provider'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.provider}
              onChange={handleInputChange}
            />
          </label>
          {error.provider && (
            <p className="text-red-500 mb-2">{error.provider}</p>
          )}
        </div>}
        {/* model_name  */}
        {updatedData && updatedData.model_name != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Model Name</span>
            <input
              type="text"
              name='model_name'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.model_name}
              onChange={handleInputChange}
            />
          </label>
          {error.model_name && (
            <p className="text-red-500 mb-2">{error.model_name}</p>
          )}
        </div>}
        {/* api_key  */}
        {updatedData && updatedData.api_key != undefined && <div>
          <label className="block mb-2">
            <span className="font-bold">Api Key</span>
            <input
              type="text"
              name='api_key'
              className="border border-gray-300 rounded w-full px-2 py-1 mt-1"
              value={updatedData.api_key}
              onChange={handleInputChange}
            />
          </label>
          {error.api_key && (
            <p className="text-red-500 mb-2">{error.api_key}</p>
          )}
        </div>}
        {/* published  */}
        {published !== undefined && <div>
          <label className="mb-2 flex items-center justify-between">
            <span className="font-bold">Published</span>
            <div className='mt-1'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={published} onChange={(e) => onPublish(Boolean(e.target.checked))} name="published" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </label>
        </div>}
        {/* enabled  */}
        {adapterEnable !== undefined && <div>
          <label className="mb-2 flex items-center justify-between">
            <span className="font-bold">Enabled</span>
            <div className='mt-1'>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={adapterEnable} onChange={(e) => onAdapterEnable(Boolean(e.target.checked))} name="enabled" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </label>
        </div>}

      </div>
      {selectedType && <button
        onClick={handleCreate}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4">
        Create
      </button>}
    </aside>
  );

};

const fieldTypes = {
  state: {
    name: "",
    type: '',
    published: true,
  },
  qa_state: {
    name: "",
    type: '',
    published: true
  },
  ner_state: {
    name: '',
    type: '',
    published: true,
  },
  adapter: {
    name: '',
    type: '',
    enabled: true,
    prompt: '',
    provider: '',
    model_name: '',
    api_key: '',
  },
  response: {
    response: "",
    type: '',
    adapter: "",
    published: true,
  },
  qa_response: {
    response: "",
    type: '',
    adapter: "",
    published: true,
  },
  ner_response: {
    response: "",
    type: '',
    published: true,
    transition_state: '',
  },
  prompt: {
    prompt: "",
  },
  entity_set: {
    entity: ""
  },
  ner_data: {
    ner: ""
  }

}

const nodeType = {
  agent: [
    "",
    "state",
    'qa_state',
    'ner_state',
    'adapter'
  ],
  state: [
    '',
    'response',
    'prompt'
  ],
  qa_state: [
    '',
    "qa_response",
    "prompt"
  ],
  ner_state: [
    '',
    "ner_response",
    "prompt",
    "entity_set",
    "ner_data"
  ],
  ner_response: [
    '',
    'entity_set',
  ]
}
const adapterList = ["", "default_openai_llm_adapter"]
const trans_state = ['', 'asdfsaf']

const adapterTypeList = ['', 'llm']