import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-8 text-center shadow-2xl">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4 stroke-[1.5]" />
        <h1 className="text-2xl font-black tracking-tight text-neutral-100 mb-2">Node Not Found</h1>
        <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
          The server route or enterprise gateway domain space you requested could not be resolved or mapped within our database cluster.
        </p>
        <Link 
          to="/" 
          className="w-full py-3 bg-white hover:bg-neutral-200 text-neutral-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Home className="w-4 h-4" /> Return to Platform Core Hub
        </Link>
      </div>
    </div>
  );
}