import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import {
  GraduationCap,
  Calendar,
  Layers,
  QrCode,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export function RootLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Register Here', path: '/register' },
    { label: 'Sign In', path: '/login' },
    { label: 'Category Dashboards', path: '/dashboard' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Premium Classic Prestige Hairline Bar */}
      <div className="h-[3px] bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-900 w-full"></div>

      {/* Main Academic Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]">
        <div className="container mx-auto px-4 h-20 sm:h-24 flex items-center justify-between">
          {/* Official 20th IEEE ICOSST 2026 Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="bg-white p-1 sm:p-1.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center justify-center transition-transform group-hover:scale-[1.02]">
              <img
                src="/icosst-logo.png"
                alt="20th IEEE ICOSST 2026 Logo"
                className="h-11 sm:h-14 w-auto object-contain"
              />
            </div>
            <div className="hidden lg:flex flex-col border-l border-slate-200 dark:border-slate-800 pl-3.5 justify-center">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                Al-Khawarizmi Institute of Computer Science (KICS)
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                University of Engineering and Technology (UET) Lahore
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                22–23 December 2026 • Hybrid & On-Campus
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 ${
                    isActive
                      ? 'text-emerald-800 dark:text-emerald-400 font-semibold border-b-2 border-emerald-700 pb-1'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Buttons / Dropdown */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Scanner shortcut for staff */}
                {['staff_gate', 'staff_session', 'staff_meal', 'admin', 'super_admin'].includes(user.role) && (
                  <Link to="/scan">
                    <Button variant="outline" size="sm" className="gap-1.5 border-emerald-600 text-emerald-700 dark:text-emerald-300">
                      <QrCode className="w-4 h-4" />
                      Scanner PWA
                    </Button>
                  </Link>
                )}

                {/* Admin shortcut */}
                {['admin', 'super_admin', 'finance', 'approver'].includes(user.role) && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm" className="gap-1.5 bg-slate-800 text-white hover:bg-slate-700">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      Admin Desk
                    </Button>
                  </Link>
                )}

                {/* Participant Dashboard */}
                <Link to="/dashboard">
                  <Button size="sm" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white">
                    <User className="w-4 h-4" />
                    Portal: {user.name.split(' ')[0]}
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleLogout} title="Log Out" className="text-slate-500 hover:text-rose-600">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-200">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm">
                    Register Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-emerald-700 text-white">My Participant Portal</Button>
                  </Link>
                  {['admin', 'super_admin', 'finance', 'approver'].includes(user.role) && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Admin Dashboard</Button>
                    </Link>
                  )}
                  {['staff_gate', 'staff_session', 'staff_meal', 'admin', 'super_admin'].includes(user.role) && (
                    <Link to="/scan" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Staff Scanner App</Button>
                    </Link>
                  )}
                  <Button variant="ghost" onClick={handleLogout} className="w-full text-rose-600">
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-emerald-700 text-white">Register Account</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Official Academic Conference Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Conference Org */}
            <div className="space-y-3">
              <h4 className="text-white font-bold font-heading text-base">ICOSST 2026</h4>
              <p className="text-xs leading-relaxed text-slate-400">
                20th International Conference on Open Source Systems and Technologies. Organized annually by Al-Khawarizmi Institute of Computer Science (KICS), UET Lahore.
              </p>
              <div className="text-xs text-emerald-400 font-semibold">
                Dates: 22–23 December 2026
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-2">
              <h5 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Quick Navigation</h5>
              <ul className="space-y-1.5 text-xs">
                <li><Link to="/catalog" className="hover:text-white transition-colors">Conference Pass Packages (SAMPLE)</Link></li>
                <li><Link to="/schedule" className="hover:text-white transition-colors">Program Schedule & Rooms</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Participant Registration</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Participant Dashboard & QR Pass</Link></li>
              </ul>
            </div>

            {/* Col 3: Academic Committees */}
            <div className="space-y-2">
              <h5 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Conference Secretariat</h5>
              <p className="text-xs text-slate-400">
                Al-Khawarizmi Institute of Computer Science (KICS)<br />
                University of Engineering and Technology (UET)<br />
                GT Road, Lahore - 54890, Pakistan
              </p>
              <p className="text-xs text-slate-400">
                Email: <span className="text-slate-200">icosst@kics.edu.pk</span><br />
                Tel: <span className="text-slate-200">+92 (42) 99029450</span>
              </p>
            </div>

            {/* Col 4: Platform Compliance */}
            <div className="space-y-2">
              <h5 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Policy Notice</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fees and concessions displayed in this demonstration portal are SAMPLE values subject to official notification by the ICOSST 2026 Steering Committee.
              </p>
              <div className="pt-2">
                <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                  IEEE Co-Sponsored Series
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>© 2026 Al-Khawarizmi Institute of Computer Science (KICS), UET Lahore. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Production-Grade MERN Architecture</span>
              <span>•</span>
              <span className="text-emerald-500">Zero-Docker Native Run</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
