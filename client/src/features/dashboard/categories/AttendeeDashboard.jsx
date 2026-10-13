import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Ticket,
  Calendar,
  Coffee,
  QrCode,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Download,
} from 'lucide-react';

export function AttendeeDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-900 to-slate-900 text-white">
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

            <div className="flex gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow">
                <Download className="w-4 h-4" /> Download Delegate Slip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              Digital QR Pass & Gate Clearance
            </CardTitle>
            <CardDescription className="text-xs">
              Present this digital token at UET security gates and hall entrances
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center p-6 space-y-4">
            <div className="inline-block p-4 bg-white dark:bg-slate-900 border-2 border-dashed border-emerald-600 rounded-xl">
              <QrCode className="w-28 h-28 text-slate-900 dark:text-white mx-auto" />
              <p className="text-[11px] font-mono font-bold mt-2 text-emerald-700 dark:text-emerald-400">
                PASS-ICOSST26-ATT-0089
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Auto-verified on ground with Staff Handheld Scanner for instant hall entry and refreshment redemption.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
