import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/api/client';
import {
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  Coffee,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Calendar,
  Layers,
  MapPin,
  Mic2,
  BookOpen,
  Camera,
  ShieldAlert,
} from 'lucide-react';

export function AdminDashboard() {
  const [kpis, setKpis] = useState({
    totalUsers: 8,
    confirmedRegistrations: 480,
    pendingPayments: 12,
    pendingApprovals: 4,
    sampleRevenue: 'PKR 420,000',
    seatsOccupiedPercent: 88,
    mealsServed: 350,
  });

  const categoryBreakdown = [
    { name: 'Attendees / Participants', count: 320, badge: 'ATTENDEE', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Paper Presenters', count: 64, badge: 'PAPER', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Presenters & Co-Presenters', count: 42, badge: 'CO-PRESENTER', color: 'bg-amber-100 text-amber-800' },
    { name: 'Organizers & Chairs', count: 28, badge: 'ORGANIZER', color: 'bg-slate-200 text-slate-800' },
    { name: 'Workshop Instructors', count: 12, badge: 'WORKSHOP', color: 'bg-purple-100 text-purple-800' },
    { name: 'Invited Keynote Speakers', count: 8, badge: 'SPEAKER', color: 'bg-rose-100 text-rose-800' },
    { name: 'Accredited Media & Press', count: 6, badge: 'MEDIA', color: 'bg-sky-100 text-sky-800' },
  ];

  const allEventSessions = [
    {
      time: '22 Dec (09:30 AM – 10:45 AM)',
      title: 'Inaugural Plenary & 20th Jubilee Keynote',
      track: 'Plenary Track',
      venue: 'KICS Main Auditorium',
      speaker: 'Prof. Dr. David Miller (OSSF) / VC UET Lahore',
      status: 'Ready',
    },
    {
      time: '22 Dec (11:00 AM – 01:00 PM)',
      title: 'Technical Session 1: AI, LLMs & Intelligent Systems',
      track: 'Artificial Intelligence',
      venue: 'Session Hall A',
      speaker: '12 Accepted Paper Presenters',
      status: 'Scheduled',
    },
    {
      time: '22 Dec (02:00 PM – 05:00 PM)',
      title: 'Workshop: Kubernetes Cloud Resilience & Microservices',
      track: 'Hands-on Technical Lab',
      venue: 'Advanced Lab 3',
      speaker: 'Kamran Siddique (Red Hat Cloud Lead)',
      status: 'Full (28/30)',
    },
    {
      time: '23 Dec (09:30 AM – 11:00 AM)',
      title: 'Technical Session 2: Cyber Threat Modeling & Zero-Trust',
      track: 'Cyber Security',
      venue: 'Session Hall A',
      speaker: 'Bilal Hussain & 10 Presenters',
      status: 'Scheduled',
    },
    {
      time: '23 Dec (11:15 AM – 01:00 PM)',
      title: 'Technical Session 3: Software Engineering & Architecture',
      track: 'Software Systems',
      venue: 'Session Hall B',
      speaker: 'Zainab Fatima & Co-Presenters',
      status: 'Scheduled',
    },
    {
      time: '23 Dec (03:30 PM – 05:00 PM)',
      title: 'Closing Ceremony, Awards & IEEE Certificate Distribution',
      track: 'Ceremony',
      venue: 'KICS Main Auditorium',
      speaker: 'Steering Committee Chairs & Chief Guest',
      status: 'Scheduled',
    },
  ];

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [logsRes, regRes] = await Promise.all([
        api.get('/audit?limit=6').catch(() => ({ data: null })),
        api.get('/registrations/admin/all?limit=1').catch(() => ({ data: null })),
      ]);

      if (logsRes.data?.data) {
        setAuditLogs(logsRes.data.data);
      }

      if (regRes.data?.data?.metrics) {
        const m = regRes.data.data.metrics;
        setKpis((prev) => ({
          ...prev,
          confirmedRegistrations: m.approved,
          pendingPayments: m.paymentSubmitted,
          sampleRevenue: `PKR ${m.totalRevenue?.toLocaleString() || '0'}`,
        }));
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Administrator Master Hub — All Events & Operations
            </h1>
            <Badge variant="uet">SUPER ADMIN</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Comprehensive oversight of ICOSST 2026: 22–23 Dec 2026 at KICS, UET Lahore, Pakistan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={loading} className="gap-1.5 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Live Telemetry
          </Button>
          <Badge variant="sample" className="text-xs">DEMO MODE</Badge>
        </div>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Total Registrations</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                {kpis.confirmedRegistrations}
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold">Across all 7 Categories</span>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Estimated Receipts</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                {kpis.sampleRevenue}
              </h3>
              <span className="text-[10px] text-amber-600 font-semibold">Sample Fee Model</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Scheduled Sessions</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                6 Key Events
              </h3>
              <span className="text-[10px] text-sky-600 font-semibold">22–23 Dec Timetable</span>
            </div>
            <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Venue Utilization</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                {kpis.seatsOccupiedPercent}% Booked
              </h3>
              <span className="text-[10px] text-purple-600 font-semibold">Auditorium & Labs</span>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations Breakdown by User Category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Registration Roster by Category
          </CardTitle>
          <CardDescription className="text-xs">
            Live delegate counts across all 7 participant categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {categoryBreakdown.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">{cat.name}</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{cat.count}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">{cat.badge}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Sessions Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            ICOSST 2026 Master Event Program (22–23 December 2026)
          </CardTitle>
          <CardDescription className="text-xs">
            Complete schedule of all technical tracks, keynotes, labs, and ceremonies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {allEventSessions.map((session, i) => (
              <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{session.title}</span>
                    <Badge variant="outline" className="text-[10px]">{session.track}</Badge>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{session.time}</span> • {session.venue} • {session.speaker}
                  </p>
                </div>
                <Badge variant="uet" className="text-[10px] shrink-0 self-start sm:self-auto">
                  {session.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Stream */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold font-heading">
              Append-Only Security & Operational Audit Log
            </CardTitle>
            <CardDescription className="text-xs">
              Immutable ledger of all registrations, approvals, and credential activities
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">Tamper-Proof DB</Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                      <Badge variant="secondary" className="text-[10px] uppercase">{log.targetEntity}</Badge>
                      <span className="text-[10px] text-slate-400">by {log.actorRole}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{log.reason || 'Operational record'}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                Audit logs are actively streaming. Perform an action to view realtime entries.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
