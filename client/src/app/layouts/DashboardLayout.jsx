import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import {
  User,
  QrCode,
  Calendar,
  CreditCard,
  Users,
  Settings,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export function DashboardLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const sidebarLinks = [
    { label: 'Overview & Status', path: '/dashboard', icon: User },
    { label: 'My Digital QR Pass', path: '/dashboard/pass', icon: QrCode },
    { label: 'Personal Timetable', path: '/dashboard/timetable', icon: Calendar },
    { label: 'Orders & Receipts', path: '/dashboard/invoices', icon: CreditCard },
    { label: 'Team Competitions', path: '/dashboard/teams', icon: Users },
    { label: 'Profile Settings', path: '/dashboard/profile', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Banner with Participant Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <Badge variant="uet" className="text-xs">
              {user.role.toUpperCase()}
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

        <div className="text-right flex flex-col items-end">
          <span className="text-xs text-slate-400 uppercase font-semibold">Registered Category</span>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {user.category || user.profile?.categoryCode || 'ATTENDEE_PARTICIPANT'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1">
          <nav className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2 space-y-1 shadow-sm">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
