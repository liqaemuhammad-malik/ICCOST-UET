import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { QrCode, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ScannerLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const staffRoles = ['staff_gate', 'staff_session', 'staff_meal', 'admin', 'super_admin'];
  if (!staffRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center text-slate-800">
        <h2 className="text-xl font-bold text-rose-600 mb-2">Staff Credentials Required</h2>
        <p className="text-sm text-slate-600 mb-4">
          This handheld scanner utility is restricted to verified conference ground staff.
        </p>
        <Link to="/dashboard" className="text-emerald-700 underline font-semibold text-sm">
          Return to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* High-contrast mobile top bar */}
      <header className="bg-black border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-300">
          <ArrowLeft className="w-4 h-4" /> Exit Scanner
        </Link>
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-sm tracking-wide">ICOSST SCANNER</span>
        </div>
        <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]">
          {user.role.toUpperCase()}
        </Badge>
      </header>

      {/* Viewport for scanning */}
      <main className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
