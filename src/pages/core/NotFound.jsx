import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-[#F0EEEB] rounded-3xl p-8 text-center shadow-lg">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4 stroke-[1.5]" />
        <h1 className="text-2xl font-black tracking-tight text-neutral-900 mb-2">Node Not Found</h1>
        <p className="text-sm text-[#737373] mb-8 leading-relaxed">
          The server route or enterprise gateway domain space you requested could not be resolved or mapped within our database cluster.
        </p>
        <Link 
          to="/" 
          className="w-full py-3 bg-[#D03D56] hover:bg-[#3F0712] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <Home className="w-4 h-4" /> Return to Platform Core Hub
        </Link>
      </div>
    </div>
  );
}