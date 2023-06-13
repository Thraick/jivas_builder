import { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';


// type Action = {
//   label: string;
//   effect: (...args: any[]) => any;
// };

// type Position = {
//   x: number;
//   y: number;
// };

// type Props = {
//   actions: Action[];
//   isOpen: boolean;
//   position: Position;
//   onMouseLeave: () => void;
// };

export const ContextMenu = memo(
  ({ isOpen, position, actions = [], onMouseLeave }) =>
    isOpen ? (
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseLeave={onMouseLeave}
      >

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2  p-8 flex justify-center space-x-4">
          {actions.map((action) => (
            <ListButton key={action.label} action={action} />
            // <button
            //   key={action.label}
            //   onClick={action.effect}
            //   className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center"
            // >
            //   {getButtonIcon(action.label)}
            // </button>
          ))}
        </div>
      </div>
    ) : null
);



const getButtonIcon = (label) => {
  switch (label) {
    case 'Delete':
      return <FontAwesomeIcon icon={faTrash} />;
    case 'Create':
      return <FontAwesomeIcon icon={faPlus} />;
    case 'Update':
      return <FontAwesomeIcon icon={faEdit} />;
    default:
      return null;
  }
};



function ListButton({action}) {
  // console.log("label")
  // console.log(action)
  switch (action.label) {
    case 'Delete':
      return (
        <button
          key={action.label}
          onClick={action.effect}
          className="bg-red-500 hover:bg-red-800 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          {/* {getButtonIcon(label)} */}
          <FontAwesomeIcon icon={faTrash} />
        </button>
      )
    case 'Update':
      return (
        <button
          key={action.label}
          onClick={action.effect}
          className="bg-green-500 hover:bg-green-800 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          {/* {getButtonIcon(label)} */}
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )
    case 'Create':
      return (
        <button
          key={action.label}
          onClick={action.effect}
          className="bg-blue-500 hover:bg-blue-800 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          {/* {getButtonIcon(label)} */}
          <FontAwesomeIcon icon={faPlus} />
        </button>
      )
      default:
        return null
  }
}