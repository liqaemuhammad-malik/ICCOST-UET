import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Users,
  Settings,
  CreditCard,
  FileCheck,
  Coffee,
  ShieldAlert,
  ClipboardList,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const allowedRoles = ['admin', 'super_admin', 'finance', 'approver'];
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-rose-600 mb-2">Restricted Administrative Area</h2>
        <p className="text-slate-600 mb-6">Your current role ({user.role}) is not authorized to access the ICOSST admin back-office.</p>
        <Link to="/dashboard" className="text-emerald-700 underline font-semibold">
          Return to Participant Portal
        </Link>
      </div>
    );
  }

  const adminNav = [
    { label: 'Executive KPIs', path: '/admin', icon: BarChart3 },
    { label: 'Categories & Fields', path: '/admin/categories', icon: Layers },
    { label: 'Activities & Capacity', path: '/admin/activities', icon: ClipboardList },
    { label: 'Pricing & Promos (SAMPLE)', path: '/admin/pricing', icon: CreditCard },
    { label: 'Finance & Bank Queue', path: '/admin/finance', icon: CreditCard },
    { label: 'Review Approvals', path: '/admin/approvals', icon: FileCheck },
    { label: 'Meals & Attendance', path: '/admin/meals', icon: Coffee },
    { label: 'Staff & Audit Logs', path: '/admin/audit', icon: ShieldAlert },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Admin Topbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Public Site
          </Link>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <div className="bg-white px-1.5 py-0.5 rounded-md flex items-center">
            <img src="/icosst-logo.png" alt="ICOSST 2026" className="h-6 w-auto object-contain" />
          </div>
          <span className="font-extrabold text-base font-heading tracking-tight">Admin Back-Office</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-300">{user.name}</span>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500 text-[10px] uppercase">
            {user.role}
          </Badge>
        </div>
      </header>

      <div className="flex">
        {/* Admin Navigation Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-49px)] p-4 space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Back-Office Controls</p>
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-800 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Main Admin Workspace */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
