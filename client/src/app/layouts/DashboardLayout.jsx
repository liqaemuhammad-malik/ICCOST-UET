import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { getMyRegistrationApi, getNotificationsApi, markNotificationReadApi } from '@/api/registration';
import {
  User,
  Ticket,
  Clock,
  CreditCard,
  Calendar,
  Users,
  Settings,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Bell,
  X,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

const rolePrivileges = {
  participant: { label: 'Participant access', icon: User },
  organizer: { label: 'Organizer access', icon: Users },
  finance: { label: 'Finance access', icon: CreditCard },
  approver: { label: 'Approver access', icon: FileCheck },
  admin: { label: 'Administrator access', icon: ShieldCheck },
  super_admin: { label: 'Super administrator access', icon: ShieldCheck },
  staff_gate: { label: 'Gate staff access', icon: ShieldCheck },
  staff_session: { label: 'Session staff access', icon: Calendar },
  staff_meal: { label: 'Meal staff access', icon: Ticket },
};

export function DashboardLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [registration, setRegistration] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const closeMenusOnOutsideClick = (event) => {
      if (!notificationMenuRef.current?.contains(event.target)) setShowNotifications(false);
      if (!profileMenuRef.current?.contains(event.target)) setShowProfileMenu(false);
    };

    document.addEventListener('mousedown', closeMenusOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeMenusOnOutsideClick);
  }, []);

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
  const privilege = rolePrivileges[user.role] || {
    label: `${user.role.replaceAll('_', ' ')} access`,
    icon: ShieldCheck,
  };
  const PrivilegeIcon = privilege.icon;

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
    { label: 'Personal Timetable', path: '/dashboard/timetable', icon: Calendar },
    ...(!registration ? [{ label: 'Conference Registration', path: '/dashboard/registration', icon: Ticket, isNew: true }] : []),
    { label: 'Registration Status', path: '/dashboard/status', icon: Clock, isNew: true },
    { label: 'Payment & Verification', path: '/dashboard/payment', icon: CreditCard, isNew: true },
  ];
  const primaryTabs = sidebarLinks;
  const tabLabels = {
    '/dashboard': 'Home',
    '/dashboard/registration': 'Register',
    '/dashboard/timetable': 'Schedule',
    '/dashboard/status': 'Status',
    '/dashboard/payment': 'Payment',
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Top Banner with Participant Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <Badge variant="uet" className="inline-flex items-center gap-1.5 text-xs" title={privilege.label}>
              <PrivilegeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{user.role.replaceAll('_', ' ').toUpperCase()}</span>
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
            <div ref={notificationMenuRef} className="relative">
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

            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                title="Profile"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-500 text-slate-950 transition hover:bg-emerald-400"
              >
                <User className="h-4 w-4" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-10 z-50 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 bg-emerald-50 p-4 dark:border-slate-800 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                        {user.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 p-4 text-xs">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Role</span>
                      <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{user.role?.replaceAll('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Category</span>
                      <span className="text-right font-semibold text-slate-800 dark:text-slate-200">{user.category || user.profile?.categoryCode || 'Participant'}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Institution</span>
                      <span className="truncate text-right font-semibold text-slate-800 dark:text-slate-200">{user.profile?.institution || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-slate-100 p-3 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await logout();
                        navigate('/login');
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-md bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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

      {/* Compact tab navigation keeps the participant's main actions visible without a tall sidebar. */}
      <nav aria-label="Participant portal navigation" className="relative mb-4 rounded-xl border border-emerald-800/70 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 shadow-md">
        <div className="grid grid-cols-2 gap-1 p-1.5 sm:grid-cols-5">
          {primaryTabs.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex min-h-10 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-semibold transition-colors ${isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tabLabels[item.path] || item.label}</span>
                {item.isNew && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Dashboard Content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
