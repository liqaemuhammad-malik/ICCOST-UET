import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ScannerLayout } from './layouts/ScannerLayout';

import { HomeView } from '@/features/public/HomeView';
import { LoginView } from '@/features/auth/LoginView';
import { RegisterView } from '@/features/auth/RegisterView';
import { VerifyEmailView } from '@/features/auth/VerifyEmailView';
import { ForgotPasswordView } from '@/features/auth/ForgotPasswordView';
import { ResetPasswordView } from '@/features/auth/ResetPasswordView';
import { VerifyCardView } from '@/features/public/VerifyCardView';
import { DashboardOverviewView } from '@/features/dashboard/DashboardOverviewView';
import { DigitalPassView } from '@/features/dashboard/DigitalPassView';
import { AdminDashboard } from '@/admin/AdminDashboard';
import { ScannerView } from '@/scanner/ScannerView';
import { EventSettingsView } from '@/features/admin/EventSettingsView';
import { EventScheduleView } from '@/features/admin/EventScheduleView';
import { PublicScheduleView } from '@/features/public/PublicScheduleView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <RegisterView /> },
      { path: 'register', element: <RegisterView /> },
      { path: 'login', element: <LoginView /> },
      { path: 'admin-login', element: <LoginView adminOnly /> },
      { path: 'verify-email', element: <VerifyEmailView /> },
      { path: 'forgot-password', element: <ForgotPasswordView /> },
      { path: 'reset-password', element: <ResetPasswordView /> },
      { path: 'verify-card', element: <VerifyCardView /> },
      {
        path: 'catalog',
        element: (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold font-heading mb-2">Passes & Pricing Catalog</h1>
            <p className="text-sm text-slate-500 mb-6">Explore conference admission tiers, workshops, and team competition entries. Official fees are pending approval (all prices shown are SAMPLE values).</p>
            <div className="p-8 border border-dashed rounded-xl text-center bg-slate-50 dark:bg-slate-900/50">
              <span className="font-bold text-emerald-700 block mb-2">Catalog & Pure Pricing Engine</span>
              <p className="text-xs text-slate-500">Scheduled for delivery in Phase 2 & 3. You can register an attendee account or test role logins right now!</p>
            </div>
          </div>
        ),
      },
      {
        path: 'schedule',
        element: <PublicScheduleView />,
        /* element: (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold font-heading mb-2">22–23 December 2026 Event Schedule</h1>
            <p className="text-sm text-slate-500 mb-6">Timetable and room assignments at KICS Seminar Complex, UET Lahore.</p>
            <div className="p-8 border border-dashed rounded-xl text-center bg-slate-50 dark:bg-slate-900/50">
              <span className="font-bold text-emerald-700 block mb-2">Schedule Timeline Component</span>
              <p className="text-xs text-slate-500">Delivered in Phase 2 with full room and session allocations.</p>
            </div>
          </div>
        ), */
      },
      {
        path: 'tracks',
        element: (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold font-heading mb-2">Technical Tracks & Workshops</h1>
            <p className="text-sm text-slate-500 mb-6">AI, Cyber Security, Cloud, and Open Source research tracks.</p>
          </div>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverviewView /> },
      {
        path: 'pass',
        element: <DigitalPassView />,
      },
      {
        path: 'timetable',
        element: (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold font-heading mb-1">Personal Conference Timetable</h3>
            <p className="text-xs text-slate-500">Customized schedule reflecting your confirmed keynotes and workshops.</p>
          </div>
        ),
      },
      {
        path: 'invoices',
        element: (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold font-heading mb-1">Order History & Invoices</h3>
            <p className="text-xs text-slate-500">Download official PDF receipts and verify payment settlement status.</p>
          </div>
        ),
      },
      {
        path: 'teams',
        element: (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold font-heading mb-1">Competition Teams</h3>
            <p className="text-xs text-slate-500">Manage member invites, acceptance, and abstract submissions.</p>
          </div>
        ),
      },
      {
        path: 'profile',
        element: <DashboardOverviewView />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      {
        path: 'categories',
        element: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Participant Categories & Dynamic Field Builder</h2>
            <p className="text-xs text-slate-500">Admin CRUD for category rules, required profile fields, and activity permissions.</p>
          </div>
        ),
      },
      {
        path: 'activities',
        element: <EventScheduleView />,
        /* element: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Activities, Sessions & Rooms</h2>
            <p className="text-xs text-slate-500">Manage workshop seat capacities, physical rooms, and schedules.</p>
          </div>
        ), */
      },
      {
        path: 'pricing',
        element: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Pricing Rules & Promo Codes (SAMPLE)</h2>
            <p className="text-xs text-slate-500">Dimensional price matrix configuration, early bird discounts, and waivers.</p>
          </div>
        ),
      },
      {
        path: 'finance',
        element: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Finance & Bank Transfer Verification Queue</h2>
            <p className="text-xs text-slate-500">Review deposit slips, duplicate reference detection, and refund processing.</p>
          </div>
        ),
      },
      {
        path: 'approvals',
        element: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Registration Approvals Queue</h2>
            <p className="text-xs text-slate-500">Verify student identities, competition abstracts, and VIP invitations.</p>
          </div>
        ),
      },
      {
        path: 'meals',
        element: (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Meals & Refreshment Policies</h2>
            <p className="text-xs text-slate-500">Configure serving windows, entitlements per category, and live scan counts.</p>
          </div>
        ),
      },
      {
        path: 'audit',
        element: <AdminDashboard />,
      },
      {
        path: 'settings',
        element: <EventSettingsView />,
      },
    ],
  },
  {
    path: '/scan',
    element: <ScannerLayout />,
    children: [{ index: true, element: <ScannerView /> }],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
