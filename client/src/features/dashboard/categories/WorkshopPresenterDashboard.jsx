import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Code2,
  Users,
  Server,
  Calendar,
  Clock,
  UploadCloud,
  FileCode,
  CheckCircle2,
} from 'lucide-react';

export function WorkshopPresenterDashboard({ user }) {
  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <Card className="hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-600 text-white font-bold text-xs uppercase">
                  Workshop Presenter Workspace
                </Badge>
                <Badge variant="outline" className="text-purple-300 border-purple-500 text-xs">
                  Lab Confirmed
                </Badge>
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">
                Instructor Portal: {user.name}
              </h2>
              <p className="text-xs text-purple-200 mt-1 max-w-xl">
                Manage your technical workshop lab environment, review participant prerequisites, and upload hands-on materials for your practical session at KICS UET.
              </p>
            </div>

            <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white gap-1.5 shadow">
              <UploadCloud className="w-4 h-4" /> Upload Lab Exercises (.zip)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workshop Details Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                Assigned Technical Workshop
              </CardTitle>
              <CardDescription className="text-xs">
                Hands-on practical training session scheduled at ICOSST 2026
              </CardDescription>
            </div>
            <Badge variant="uet">Lab Session</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60">
            <h3 className="text-base font-bold text-purple-900 dark:text-purple-200 font-heading">
              Cloud-Native Microservices & Kubernetes Resilience with Open-Source Tooling
            </h3>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Building fault-tolerant containerized architectures, service mesh traffic steering, and zero-downtime rolling deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Session Timing</span>
              <span className="font-bold text-slate-900 dark:text-white">Day 1: 22 Dec 2026 (02:00 PM – 05:00 PM)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Physical Location</span>
              <span className="font-bold text-slate-900 dark:text-white">KICS Advanced Computing Lab 3</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-0.5 font-medium">Lab Capacity & Attendance</span>
              <span className="font-bold text-purple-700 dark:text-purple-400">28 / 30 Workstations Reserved</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lab Environment & Prerequisites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-600" />
              Lab Setup & Cloud Node Status
            </CardTitle>
            <CardDescription className="text-xs">
              Pre-configured software images on UET lab workstations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>Ubuntu 24.04 LTS + Docker Engine 26</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Installed</Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>Kind / Minikube v1.33 Cluster</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Verified</Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-slate-700">
              <span>High-Speed Academic Fiber Access (1 Gbps)</span>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-600" />
              Participant Lab Resources
            </CardTitle>
            <CardDescription className="text-xs">
              Downloads provided to confirmed attendees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold block">GitHub Starter Template Repository</span>
                <span className="text-slate-500">github.com/icosst2026/workshop-k8s-resilience</span>
              </div>
              <Badge variant="secondary">Public</Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-semibold block">Lab Step-by-Step Guide (.PDF)</span>
                <span className="text-slate-500">Version 1.0 Ready for Attendees</span>
              </div>
              <Badge variant="uet">Approved</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
