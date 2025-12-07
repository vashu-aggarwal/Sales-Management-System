import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Video,
  LayoutGrid,
  Zap,
  FileText,
  CheckSquare2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Sidebar() {
  const [servicesOpen, setServicesOpen] = useState(true);
  const [invoicesOpen, setInvoicesOpen] = useState(true);

  return (
    <aside className="hidden lg:flex w-60 bg-white h-screen border-r border-gray-200 flex-col">
      
      {/* top user header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            V
          </div>

          <div>
            <p className="font-semibold text-sm text-gray-900">Vault</p>
            <p className="text-xs text-gray-500">Vashu Aggarwal</p>
          </div>
        </div>

        <ChevronDown size={18} className="text-gray-400" />
      </div>

      {/* scrollable menu area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 text-sm">

        {/* dashboard */}
        <SidebarItem icon={<LayoutGrid size={18} />} label="Dashboard" />

        {/* nexus */}
        <SidebarItem icon={<Zap size={18} />} label="Nexus" />

        {/* intake */}
        <SidebarItem icon={<Video size={18} />} label="Intake" />

        {/* services */}
        <SectionHeader
          title="Services"
          open={servicesOpen}
          onClick={() => setServicesOpen(!servicesOpen)}
        />

        {servicesOpen && (
          <div className="ml-5 space-y-1 mt-2">
            <SidebarItem icon={<Video size={16} />} label="Pre-active" />
            <SidebarItem icon={<CheckCircle size={16} />} label="Active" />
            <SidebarItem icon={<AlertCircle size={16} />} label="Blocked" />
            <SidebarItem icon={<CheckCircle size={16} />} label="Closed" />
          </div>
        )}

        {/* invoices */}
        <SectionHeader
          title="Invoices"
          open={invoicesOpen}
          onClick={() => setInvoicesOpen(!invoicesOpen)}
        />

        {invoicesOpen && (
          <div className="ml-5 space-y-1 mt-2">
            <SidebarItem icon={<FileText size={16} />} label="Proforma Invoices" active />
            <SidebarItem icon={<FileText size={16} />} label="Final Invoices" />
          </div>
        )}
      </div>
    </aside>
  );
}


function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors
      ${active ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
    >
      <span className={`flex-shrink-0 ${active ? "text-gray-800" : "text-gray-500"}`}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SectionHeader({ title, open, onClick }) {
  return (
    <div
      className="flex items-center justify-between text-gray-600 font-medium mt-4 mb-1 cursor-pointer px-1 hover:bg-gray-50 rounded transition-colors py-1"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <CheckSquare2 size={16} className="text-gray-500" />
        <span className="text-sm">{title}</span>
      </div>

      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </div>
  );
}