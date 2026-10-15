import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Activity,
} from 'lucide-react';

export function OrganizerDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500 text-slate-950 font-bold text-xs uppercase">
                  Organizer Command Center
                </Badge>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500 text-xs">
                  KICS Steering Committee Access
                </Badge>
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                Organizer Workspace: {user.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Coordinate operational stations, review technical tracks, monitor attendee influx, and supervise venue logistics across KICS Seminar Complex and UET lecture theaters.
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Real-time Operational Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-400 font-medium">Registered Attendees</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">480+</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Across all 7 Categories</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-400 font-medium">Paper Presenters</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">64</p>
            <span className="text-[10px] text-sky-600 font-semibold">Accepted in 4 Tracks</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-400 font-medium">Hands-On Workshops</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">6 Labs</p>
            <span className="text-[10px] text-purple-600 font-semibold">92% Capacity Reserved</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-400 font-medium">Gate & Dining Stations</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">4 Active</p>
            <span className="text-[10px] text-amber-600 font-semibold">Staff Scanners Online</span>
          </CardContent>
        </Card>
      </div>

      {/* Venue Checklist & Coordination Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Venue Halls & Session Allocations
            </CardTitle>
            <CardDescription className="text-xs">
              Physical locations managed for ICOSST 2026
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold block">KICS Main Auditorium (Cap: 350)</span>
                <span className="text-slate-500">Keynote Addresses, Opening & Closing Ceremonies</span>
              </div>
              <Badge variant="uet">Operational</Badge>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold block">Session Hall A - AI & Security Track (Cap: 100)</span>
                <span className="text-slate-500">Paper Presentations & Technical Discussions</span>
              </div>
              <Badge variant="uet">Ready</Badge>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold block">Computer Labs 2 & 3 (Cap: 30 each)</span>
                <span className="text-slate-500">Cloud & Kubernetes Technical Workshops</span>
              </div>
              <Badge className="bg-purple-700 text-white">Lab Prepared</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Committee Duty Schedule
            </CardTitle>
            <CardDescription className="text-xs">
              Supervisory assignments for conference operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-semibold block text-slate-900 dark:text-white">Registration & Reception Team</span>
              <p className="text-slate-500 mt-0.5">Supervising badge printing, attendee verification, and welcome kit dispatch at Main Gate Foyer.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-semibold block text-slate-900 dark:text-white">Hospitality & Refreshment Desk</span>
              <p className="text-slate-500 mt-0.5">Monitoring atomic meal token redemption at Dining Hall counters via staff scanner app.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
