
export default function SidebarMenu() {

  return (
    <aside className="fixed m-2 right-0">
  <div className="flex justify-end space-x-2">
    <button className="bg-gray-200 hover:bg-blue-200 py-1 px-2 rounded flex items-center text-sm">
      Import
    </button>
    <button className="bg-gray-200 hover:bg-blue-200 py-1 px-2 rounded flex items-center text-sm">
      Export
    </button>
    <button className="bg-gray-200 hover:bg-blue-200 py-1 px-2 rounded flex items-center text-sm">
      Collapse
    </button>
    <button className="bg-gray-200 hover:bg-blue-200 py-1 px-2 rounded flex items-center text-sm">
      Expand
    </button>
  </div>
</aside>


  );

};