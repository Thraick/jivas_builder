import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FC, memo } from 'react';

// export default function MainMenu() {
//     return (
//         <div>
//             <div className="flex justify-end m-4">
//                 <button className="bg-gray-500 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center">
//                     {/* <FontAwesomeIcon icon={faFileImport} size="xs" className="mr-2" /> */}
//                     Export
//                 </button>
//             </div>
//         </div>
//     );
// }



export const MainMenu = memo(() =>
(
    <div>
        <div className="flex justify-end m-4">
            <button className="bg-gray-500 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center">
                Export
            </button>
        </div>
    </div>
)
);