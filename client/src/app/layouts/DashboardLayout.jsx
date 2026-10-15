import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { getMyRegistrationApi, getNotificationsApi, markNotificationReadApi } from '@/api/registration';
import {
  User,
  Ticket,
  Clock,
  CreditCard,
  QrCode,
  Calendar,
  Users,
  Settings,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Bell,
  X,
  FileCheck,
} from 'lucide-react';

export function DashboardLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [registration, setRegistration] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getMyRegistrationApi()
        .then((res) => {
          if (res?.data) setRegistration(res.data);
        })
        .catch(() => { });

      getNotificationsApi()
        .then((res) => {
          if (res?.data) setNotifications(res.data);
        })
        .catch(() => { });
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markNotificationReadApi(notif._id).catch(() => { });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
    }
    if (notif.link) {
      setShowNotifications(false);
      navigate(notif.link);
    }
  };

  const sidebarLinks = [
    { label: 'Overview & Status', path: '/dashboard', icon: User },
    { label: 'Conference Registration', path: '/dashboard/registration', icon: Ticket, isNew: true },
    { label: 'Registration Status', path: '/dashboard/status', icon: Clock, isNew: true },
    { label: 'Payment & Verification', path: '/dashboard/payment', icon: CreditCard, isNew: true },
    { label: 'My Holding Card', path: '/dashboard/pass', icon: QrCode },
    { label: 'Personal Timetable', path: '/dashboard/timetable', icon: Calendar },
    { label: 'Orders & Receipts', path: '/dashboard/invoices', icon: FileCheck },
    { label: 'Team Competitions', path: '/dashboard/teams', icon: Users },
    { label: 'Profile Settings', path: '/dashboard/profile', icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Banner with Participant Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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

            {registration && (
              <Badge
                variant={
                  registration.registrationStatus === 'APPROVED'
                    ? 'success'
                    : registration.registrationStatus === 'REJECTED'
                      ? 'destructive'
                      : 'warning'
                }
                className="text-[10px] font-bold"
              >
                Pass: {registration.registrationStatus.replaceAll('_', ' ')}
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user.email} • {registration?.organization || user.profile?.institution || 'Institution Affiliation Pending'}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 relative">
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-9 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold">
                    <span>Portal Notifications</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 cursor-pointer transition-colors ${n.isRead ? 'opacity-70 hover:bg-slate-50' : 'bg-emerald-50/50 hover:bg-emerald-50 font-semibold'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-400 text-xs">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Registered Category</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {registration
                ? registration.participantCategory === 'IEEE_MEMBER_STUDENT'
                  ? 'IEEE Member / Student'
                  : 'Non-IEEE Member / Professional'
                : user.category || user.profile?.categoryCode || 'ATTENDEE_PARTICIPANT'}
            </span>
          </div>
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isNew && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      NEW
                    </span>
                  )}
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
