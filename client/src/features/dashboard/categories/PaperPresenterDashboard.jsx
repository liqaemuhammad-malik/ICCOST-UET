import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  UploadCloud,
  FileCheck2,
  Award,
  BookOpen,
} from 'lucide-react';

export function PaperPresenterDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-500 text-slate-950 font-bold text-xs uppercase">
                  Paper Presenter Portal
                </Badge>
                <Badge variant="outline" className="text-emerald-300 border-emerald-400 text-xs">
                  Camera-Ready Approved
                </Badge>
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                Author & Presenter: {user.name}
              </h2>
              <p className="text-xs text-emerald-200 mt-1 max-w-xl">
                Your peer-reviewed research paper has been scheduled for oral presentation in the ICOSST 2026 Technical Proceedings at KICS, UET Lahore.
              </p>
            </div>

            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow">
              <UploadCloud className="w-4 h-4" /> Upload Camera-Ready Slides
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Paper Metadata & Acceptance Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                Accepted Research Paper
              </CardTitle>
              <CardDescription className="text-xs">
                Paper ID: <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">ICOSST26-PAPER-142</span>
              </CardDescription>
            </div>
            <Badge variant="uet">Oral Technical Track</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
            <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200 font-heading">
              "Deep Neural Architectures for Real-Time Open Source Cyber Threat Modeling & Zero-Day Detection"
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
              Track: Cyber Security, Cryptography & Threat Intelligence • Peer-reviewed & approved by Technical Program Committee.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Scheduled Time</span>
              <span className="font-bold text-slate-900 dark:text-white">Day 1: 22 Dec 2026 (03:30 PM – 03:45 PM)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Presentation Hall</span>
              <span className="font-bold text-slate-900 dark:text-white">Session Hall A (KICS Complex)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Camera-Ready Status</span>
              <span className="font-bold text-emerald-600">IEEE Xplore Formatting Verified</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author Checklist & Certificate Track */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              Author Publication Checklist
            </CardTitle>
            <CardDescription className="text-xs">
              Conference indexing and presentation milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>IEEE Electronic Copyright Form (eCF)</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Signed & Submitted</Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>PDF eXpress Compliance Check</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Passed (PID: 142)</Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>Author Conference Registration</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Completed</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Paper Presenter Certificate
            </CardTitle>
            <CardDescription className="text-xs">
              Accreditation issued by ICOSST 2026 Technical Committee
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-300">
                Following your oral presentation on 22 December 2026, the Session Chair will sign off on presentation delivery. Your official IEEE co-sponsored Certificate of Presentation will unlock automatically on this dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
