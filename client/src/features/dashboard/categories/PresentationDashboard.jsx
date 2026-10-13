import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Presentation,
  Users2,
  Calendar,
  Clock,
  MapPin,
  UploadCloud,
  FileCheck,
  Award,
} from 'lucide-react';

export function PresentationDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="border-amber-300 dark:border-amber-800/60 bg-gradient-to-r from-amber-950 to-slate-900 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500 text-slate-950 font-bold text-xs uppercase">
                  Presenter & Co-Presenter Desk
                </Badge>
                <Badge variant="outline" className="text-amber-300 border-amber-400 text-xs">
                  Technical Track Slot Confirmed
                </Badge>
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                Presenter Workspace: {user.name}
              </h2>
              <p className="text-xs text-amber-200 mt-1 max-w-xl">
                Review your assigned technical presentation slot, verify co-presenter accreditation, and upload your slide presentation deck for review by the track session chair.
              </p>
            </div>

            <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white gap-1.5 shadow">
              <UploadCloud className="w-4 h-4" /> Upload Slide Presentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Presentation Slot Details */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                Scheduled Presentation Details
              </CardTitle>
              <CardDescription className="text-xs">
                Track: Software Engineering & Distributed Systems
              </CardDescription>
            </div>
            <Badge variant="uet">Oral Presentation (15 Mins)</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-200 font-heading">
              "Resilience Patterns and Failure Isolation in Distributed Open Source Cloud Microservices"
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              Case study and empirical benchmarks conducted across multi-region Kubernetes clusters during high-throughput workloads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Date & Slot</span>
              <span className="font-bold text-slate-900 dark:text-white">Day 2: 23 Dec 2026 (11:15 AM – 11:30 AM)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Session Room</span>
              <span className="font-bold text-slate-900 dark:text-white">Session Hall B (CS Department)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Format</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">12 Mins Talk + 3 Mins Q&A</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presenter & Co-Presenter Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Users2 className="w-4 h-4 text-amber-600" />
              Presenter & Co-Presenter Team
            </CardTitle>
            <CardDescription className="text-xs">
              Registered co-authors delivering this presentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">{user.name}</span>
                <span className="text-slate-500">Lead Presenter • {user.profile?.institution || 'UET Lahore'}</span>
              </div>
              <Badge variant="uet">Primary</Badge>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Zainab Fatima</span>
                <span className="text-slate-500">Co-Presenter • NUST School of Electrical Engg & CS</span>
              </div>
              <Badge variant="secondary">Co-Presenter</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              Presentation Certificate Criteria
            </CardTitle>
            <CardDescription className="text-xs">
              Requirements for official certificate issuance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-emerald-600 border-emerald-500 mt-0.5 shrink-0">1</Badge>
              <p className="text-slate-600 dark:text-slate-400">At least one presenter must deliver the talk in person during the assigned slot.</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-emerald-600 border-emerald-500 mt-0.5 shrink-0">2</Badge>
              <p className="text-slate-600 dark:text-slate-400">Session Chair will record electronic check-in timestamp upon completion.</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-emerald-600 border-emerald-500 mt-0.5 shrink-0">3</Badge>
              <p className="text-slate-600 dark:text-slate-400">Digital certificates for both presenter & co-presenter are issued immediately on Day 2.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
