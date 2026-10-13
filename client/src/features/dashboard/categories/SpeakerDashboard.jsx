import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mic2,
  Calendar,
  Clock,
  MapPin,
  UploadCloud,
  FileCheck,
  Building2,
  UserCheck,
} from 'lucide-react';

export function SpeakerDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="border-rose-300 dark:border-rose-800/60 bg-gradient-to-r from-rose-950 to-slate-900 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-rose-600 text-white font-bold text-xs uppercase">
                  Invited Keynote Speaker
                </Badge>
                <Badge variant="outline" className="text-rose-300 border-rose-400 text-xs">
                  Distinguished VIP Guest
                </Badge>
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                Honorable Speaker: {user.name}
              </h2>
              <p className="text-xs text-rose-200 mt-1 max-w-xl">
                Thank you for honoring ICOSST 2026. Manage your keynote speech details, review auditorium audiovisual provisions, and submit your slide presentation deck.
              </p>
            </div>

            <Button size="sm" className="bg-rose-600 hover:bg-rose-500 text-white gap-1.5 shadow">
              <UploadCloud className="w-4 h-4" /> Upload Keynote Slides (.pptx / .pdf)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Keynote Session Details */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                Plenary Keynote Session
              </CardTitle>
              <CardDescription className="text-xs">
                Scheduled at KICS Main Auditorium, UET Lahore
              </CardDescription>
            </div>
            <Badge variant="uet">Plenary Talk</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
            <h3 className="text-base font-bold text-rose-950 dark:text-rose-200 font-heading">
              "The Next Decade of Resilient Open Source AI: Security, Governance & Sovereign Infrastructure"
            </h3>
            <p className="text-xs text-rose-800 dark:text-rose-300 mt-1">
              Opening Plenary Address exploring trustworthy machine learning models and open global compute grids.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Date & Time</span>
              <span className="font-bold text-slate-900 dark:text-white">Day 1: 22 Dec 2026 (10:00 AM – 11:00 AM)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Session Hall</span>
              <span className="font-bold text-slate-900 dark:text-white">KICS Main Auditorium (Hall 1)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Session Chair</span>
              <span className="font-bold text-slate-900 dark:text-white">Prof. Dr. Waqas Ahmad (KICS)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIP Hospitality & AV Rider */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Building2 className="w-4 h-4 text-rose-600" />
              VIP Protocol & Hospitality
            </CardTitle>
            <CardDescription className="text-xs">
              Arrangements by UET Hospitality & Transport Division
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-semibold block">Accommodation</span>
              <span className="text-slate-500">Executive Guest Suite, UET Main Campus (Check-in: 21 Dec, Check-out: 24 Dec)</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-semibold block">Airport Pickup & Transit</span>
              <span className="text-slate-500">Dedicated Chauffeur Service assigned for Allama Iqbal International Airport (LHE).</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-semibold block">Speaker Liaison Officer</span>
              <span className="text-slate-500">Engr. Salman Tariq (+92-300-1234567 • salman@kics.edu.pk)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Mic2 className="w-4 h-4 text-rose-600" />
              Stage Audio-Visual Setup
            </CardTitle>
            <CardDescription className="text-xs">
              Configured provisions for your speech delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>Wireless Lapel / Headset Microphone</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Prepared</Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>Confidence Monitor with Presenter Notes</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Configured</Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>Wireless Slide Clicker & Green Laser Pointer</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Ready at Podium</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
