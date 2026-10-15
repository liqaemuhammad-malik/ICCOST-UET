import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Camera,
  FileText,
  Download,
  Calendar,
  Radio,
  Share2,
  CheckCircle2,
} from 'lucide-react';

export function MediaDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-sky-500 text-slate-950 font-bold text-xs uppercase">
                  Media & Press Portal
                </Badge>
                <Badge variant="outline" className="text-sky-300 border-sky-400 text-xs">
                  Accredited Journalist Access
                </Badge>
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                Press Representative: {user.name}
              </h2>
              <p className="text-xs text-sky-200 mt-1 max-w-xl">
                Access official ICOSST 2026 press kits, dignitary interview slots, opening ceremony broadcast feeds, and media briefing schedules at KICS UET.
              </p>
            </div>

            <Button size="sm" className="bg-sky-600 hover:bg-sky-500 text-white gap-1.5 shadow">
              <Download className="w-4 h-4" /> Download Official Press Kit (.zip)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Press Accreditation Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Press Pass Badge</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">PRESS-2026-908</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Stage & Arena Access Granted</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Media Lounge & Wi-Fi</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">KICS Media Center</p>
              <span className="text-[10px] text-slate-500">Dedicated 200 Mbps Uplink</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Press Releases</span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">3 Releases Ready</p>
              <span className="text-[10px] text-amber-600 font-semibold">Under Embargo until 22 Dec</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Briefing Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Press Conferences & Media Briefings
            </CardTitle>
            <CardDescription className="text-xs">
              Official briefings with Chief Guests and Conference General Chairs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900 dark:text-white">Inaugural Press Briefing</span>
                <Badge variant="uet">22 Dec, 11:30 AM</Badge>
              </div>
              <p className="text-slate-500">VC UET Lahore & Director KICS address media on Pakistan's open source software initiatives.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900 dark:text-white">Keynote Speaker Press Meet</span>
                <Badge variant="outline" className="border-sky-500 text-sky-600">22 Dec, 03:00 PM</Badge>
              </div>
              <p className="text-slate-500">Q&A session with international keynote delegates and enterprise open source contributors.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Media Kit Downloads
            </CardTitle>
            <CardDescription className="text-xs">
              Official digital media assets and conference fact sheet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-semibold block">ICOSST 2026 Fact Sheet & Agenda Overview (.PDF)</span>
                <span className="text-slate-500 text-[10px]">Conference facts, statistics, and schedule</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-8">Download</Button>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-semibold block">Official High-Resolution Vector Logos & Graphics (.ZIP)</span>
                <span className="text-slate-500 text-[10px]">UET, KICS, and ICOSST 20th Jubilee brandmarks</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-8">Download</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
