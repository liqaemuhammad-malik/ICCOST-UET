import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import {
  GraduationCap,
  Calendar,
  Layers,
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

  const navLinks = [];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">
      {/* Premium Classic Prestige Hairline Bar */}
      <div className="h-[3px] bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-900 w-full"></div>

      {/* Main Academic Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-emerald-900/15 bg-gradient-to-r from-white via-white/95 to-emerald-50/80 shadow-[0_8px_30px_-14px_rgba(6,78,59,0.45)] backdrop-blur-xl dark:border-slate-800 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/95">
        <div className="container mx-auto flex h-[4.5rem] items-center justify-between px-4 sm:h-24">
          {/* Official 20th IEEE ICOSST 2026 Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative flex items-center justify-center rounded-2xl border border-emerald-700/30 bg-white p-1.5 shadow-[0_5px_18px_rgba(6,78,59,0.16)] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-amber-500/70 group-hover:shadow-[0_8px_24px_rgba(6,78,59,0.22)] sm:p-2">
              <img
                src="/icosst-logo.png"
                alt="20th IEEE ICOSST 2026 Logo"
                className="h-11 sm:h-14 w-auto object-contain"
              />
            </div>
            <div className="hidden flex-col justify-center border-l border-emerald-900/20 pl-3.5 dark:border-slate-700 lg:flex">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-800 dark:text-emerald-400">
                Al-Khawarizmi Institute of Computer Science (KICS)
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                University of Engineering and Technology (UET) Lahore
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
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
          <div className="hidden items-center gap-2 sm:flex">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Participant Dashboard */}
                <Link to="/dashboard">
                    <Button size="sm" className="gap-1.5 bg-gradient-to-r from-emerald-700 to-emerald-600 font-semibold text-white shadow-[0_4px_12px_rgba(4,120,87,0.25)] transition hover:-translate-y-0.5 hover:from-emerald-800 hover:to-emerald-700">
                    <User className="w-4 h-4" />
                    Portal: {user.name.split(' ')[0]}
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleLogout} title="Log Out" className="text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-emerald-950/30">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-700 to-emerald-600 font-semibold text-white shadow-[0_4px_12px_rgba(4,120,87,0.25)] hover:from-emerald-800 hover:to-emerald-700">
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
              className="rounded-xl border border-emerald-900/20 bg-white/70 p-2 text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-emerald-900/15 bg-white/95 px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
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
      <footer className="hidden">
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

      <footer className="relative mt-auto overflow-hidden border-t border-emerald-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-4 text-slate-200 shadow-[0_-8px_30px_rgba(2,6,23,0.25)]">
        <div className="footer-orb footer-orb-left" />
        <div className="footer-orb footer-orb-right" />
        <div className="container relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 px-4 md:grid-cols-3">
          <div className="group flex items-center justify-center gap-3 md:justify-self-start">
            <div className="rounded-xl border border-emerald-700/50 bg-white p-1.5 shadow-lg shadow-emerald-950/40 transition duration-500 group-hover:rotate-2 group-hover:scale-105">
              <img src="/icosst-logo.png" alt="20th IEEE ICOSST 2026" className="h-14 w-auto object-contain" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">ICOSST 2026</p>
              <p className="mt-1 text-[11px] font-medium text-slate-300">Open Source Systems &amp; Technologies</p>
              <p className="mt-1 max-w-xs text-[10px] leading-4 text-slate-400">
                International conference hosted by UET Lahore and organized through KICS.
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] leading-5 text-slate-300 md:border-x md:border-slate-700/80 md:px-8">
            <p className="font-bold text-white">KICS &amp; UET Lahore</p>
            <p className="text-[10px] text-slate-300">Al-Khawarizmi Institute of Computer Science</p>
            <p className="text-[10px] text-slate-300">University of Engineering and Technology, Lahore</p>
            <div>Email: <span className="font-semibold text-emerald-300">icosst@kics.edu.pk</span></div>
            <div>Tel: <span className="font-semibold text-emerald-300">+92 (42) 99029450</span></div>
          </div>

          <div className="footer-partners justify-self-center md:justify-self-end">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-emerald-500">
              <div className="flex items-center gap-2">
                <a href="https://uet.edu.pk/home/" target="_blank" rel="noreferrer" aria-label="UET Lahore">
                  <img src="/uet-logo.png" alt="UET Lahore" className="h-9 w-9 rounded-full bg-white object-contain p-0.5 transition duration-300 hover:scale-110" />
                </a>
                <a href="https://kics.edu.pk/" target="_blank" rel="noreferrer" aria-label="KICS UET Lahore">
                  <img src="/kics-logo.png" alt="KICS UET Lahore" className="h-9 w-9 rounded-full bg-white object-contain p-0.5 transition duration-300 hover:scale-110" />
                </a>
              </div>
              <span className="text-xs font-bold text-slate-100">UET &amp; KICS Partners</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
