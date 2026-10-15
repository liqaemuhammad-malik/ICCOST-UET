import React from 'react';
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import {
  User,
  QrCode,
  CalendarCheck2,
  CreditCard,
  Users,
  Settings,
  AlertCircle,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { ConferenceTimetable } from '@/features/shared/ConferenceTimetable';
import { defaultPortalTheme, portalThemes } from '@/features/dashboard/portalThemes';

export function DashboardLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const category = user.category || user.profile?.categoryCode || 'ATTENDEE_PARTICIPANT';
  const theme = portalThemes[category] || defaultPortalTheme;

  const sidebarLinks = [
    { label: 'Overview & Status', path: '/dashboard', icon: User },
    { label: 'My Holding Card', path: '/dashboard/pass', icon: QrCode },
    { label: 'Registered Events', path: '/dashboard/registered-events', icon: CalendarCheck2 },
    { label: 'Orders & Receipts', path: '/dashboard/invoices', icon: CreditCard },
    { label: 'Team Competitions', path: '/dashboard/teams', icon: Users },
    { label: 'Profile Settings', path: '/dashboard/profile', icon: Settings },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8 dark:from-slate-950 dark:to-slate-900 ${theme.accent}`}>
      {/* Top Banner with Participant Info */}
      <div className={`relative mb-6 flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border ${theme.border} bg-white p-6 shadow-sm dark:bg-slate-900 sm:flex-row sm:items-center`}>
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.shell}`} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <Badge className={`text-xs ${theme.soft} ${theme.accent}`}>
              {theme.label.toUpperCase()}
            </Badge>
            {user.isEmailVerified ? (
              <Badge variant="success" className="text-[10px] gap-1">
                <CheckCircle2 className="w-3 h-3" /> Email Verified
              </Badge>
            ) : (
              <Badge variant="warning" className="text-[10px] gap-1">
                <AlertCircle className="w-3 h-3" /> Unverified Email
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user.email} • {user.profile?.institution || 'Institution Affiliation Pending'}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-50"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
          <div className="text-right flex flex-col items-end">
            <span className={`text-xs uppercase font-semibold ${theme.accent}`}>{theme.eyebrow}</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {category.replaceAll('_', ' ')}
          </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
          <nav className={`rounded-2xl border ${theme.border} bg-white p-2 shadow-sm dark:bg-slate-900`}>
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? `${theme.active} font-semibold`
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? theme.icon : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3">
          <Outlet />
          {location.pathname === '/dashboard' && <div className="mt-8"><div className={`mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] ${theme.accent}`}><span className="h-2 w-2 rounded-full bg-emerald-500" />{theme.eyebrow}</div><ConferenceTimetable compact themeKey={category} title="Complete ICOSST 2026 timetable" /></div>}
        </div>
      </div>
    </div>
  );
}
