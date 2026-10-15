import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RegistrationCountdown } from '@/features/public/RegistrationCountdown';
import {
  Ticket,
  Calendar,
  Coffee,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function AttendeeDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-500 text-slate-950 font-bold text-xs uppercase">
                  Attendee / Participant Portal
                </Badge>
                <Badge variant="outline" className="text-emerald-300 border-emerald-500 text-xs">
                  ICOSST 2026 Verified
                </Badge>
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                Welcome, {user.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Your delegate pass grants full access to keynotes, technical tracks, open source exhibition, and delegate kits at KICS, UET Lahore (22–23 Dec 2026).
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

      <RegistrationCountdown />

      {/* Metrics Row */}
      <div className="hidden">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Conference Pass</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">Delegate Pass (Confirmed)</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Active for 22–23 Dec</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Technical Sessions</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">5 Tracks Available</p>
              <span className="text-[10px] text-slate-500">AI, Security, Cloud & Open Systems</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Refreshment Tokens</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">Day 1 & Day 2 Meals</p>
              <span className="text-[10px] text-amber-600 font-semibold">Lunch + High Tea Entitled</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conference Schedule & Access Checklist */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Day 1 Itinerary (22 December 2026)
            </CardTitle>
            <CardDescription className="text-xs">
              KICS Seminar Complex, UET Main Campus, GT Road, Lahore
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">08:30 AM – 09:30 AM</span>
                <span className="text-slate-500">Registration Desk & Delegate Badge Collection</span>
              </div>
              <Badge variant="outline" className="text-emerald-700 border-emerald-500">Main Foyer</Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">09:30 AM – 10:45 AM</span>
                <span className="text-slate-500">Inaugural Ceremony & Opening Keynote Address</span>
              </div>
              <Badge variant="uet">Main Auditorium</Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">01:00 PM – 02:00 PM</span>
                <span className="text-slate-500">Networking Lunch & Exhibition Arena Walkthrough</span>
              </div>
              <Badge className="bg-amber-600 text-white">Dining Complex</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-emerald-200 dark:border-emerald-800/60">
          <CardHeader className="bg-gradient-to-br from-emerald-50 to-sky-50 pb-4 dark:from-emerald-950/40 dark:to-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-bold font-heading">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Participant profile summary
                </CardTitle>
                <CardDescription className="mt-1 text-xs">Your identity and portal status across all participant tabs</CardDescription>
              </div>
              <Link to="/dashboard/profile" className="text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-300">Edit profile</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-lg font-extrabold text-white shadow-sm">{user.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
              <div className="min-w-0"><p className="truncate font-heading text-base font-extrabold text-slate-900 dark:text-white">{user.name}</p><p className="truncate text-xs text-slate-500">{user.email}</p><p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="h-3 w-3 text-emerald-600" />{user.profile?.institution || 'UET Lahore (Main Campus)'}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><span className="text-slate-400">Registration</span><p className="mt-1 font-bold text-emerald-700 dark:text-emerald-300">Confirmed</p></div>
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"><span className="text-slate-400">Email status</span><p className="mt-1 font-bold text-emerald-700 dark:text-emerald-300">{user.isEmailVerified ? 'Verified' : 'Pending'}</p></div>
            </div>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
              {[['Registered events', '/dashboard/registered-events', 'Countdowns & venues'], ['Holding card', '/dashboard/pass', 'Your digital pass'], ['Orders & receipts', '/dashboard/invoices', 'Payment history']].map(([label, path, detail]) => <Link key={path} to={path} className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs transition hover:bg-emerald-50 dark:hover:bg-emerald-950/30"><span><span className="block font-bold text-slate-800 dark:text-slate-200">{label}</span><span className="text-[10px] text-slate-400">{detail}</span></span><ArrowRight className="h-3.5 w-3.5 text-emerald-600" /></Link>)}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
