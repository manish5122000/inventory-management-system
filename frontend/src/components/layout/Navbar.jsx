import { Bell, Search, User, ChevronDown, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <div className="bg-white shadow-sm h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-200">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
       
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        <div className="hidden md:block h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-slate-50 px-2 md:px-3 py-2 rounded-lg transition-colors">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            <User className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div>
              <p className="text-sm font-medium text-slate-900">Admin</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}