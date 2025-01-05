import { HiMenuAlt2 } from "react-icons/hi";

export const ResponsiveHeader = ({ isSidebarOpen, onSidebarToggle }) => {
  return (
    <header className="p-5 bg-primary block lg:hidden">
      <div className="flex justify-between items-center w-full">
        <button 
          onClick={onSidebarToggle}
          className="toggle-button p-2 hover:bg-primary-dark rounded-lg transition-colors"
        >
          <HiMenuAlt2 className="text-white w-6 h-6" />
        </button>
        <div className="text-white font-medium">BGS Sales Management</div>
      </div>
    </header>
  );
};