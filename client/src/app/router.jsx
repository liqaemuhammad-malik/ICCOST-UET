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
import { ConferenceRegistrationView } from '@/features/dashboard/ConferenceRegistrationView';
import { RegistrationStatusView } from '@/features/dashboard/RegistrationStatusView';
import { PaymentSubmissionView } from '@/features/dashboard/PaymentSubmissionView';
import { OrdersReceiptsView } from '@/features/dashboard/OrdersReceiptsView';
import { AdminRegistrationsView } from '@/admin/AdminRegistrationsView';
import { AdminDashboard } from '@/admin/AdminDashboard';
import { ScannerView } from '@/scanner/ScannerView';
import { EventSettingsView } from '@/features/admin/EventSettingsView';
import { EventScheduleView } from '@/features/admin/EventScheduleView';
import { PublicScheduleView } from '@/features/public/PublicScheduleView';
import { ConferenceTimetable } from '@/features/shared/ConferenceTimetable';
import { RegisteredEventsView } from '@/features/dashboard/RegisteredEventsView';

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
        path: 'registration',
        element: <ConferenceRegistrationView />,
      },
      {
        path: 'status',
        element: <RegistrationStatusView />,
      },
      {
        path: 'payment',
        element: <PaymentSubmissionView />,
      },
      {
        path: 'pass',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'timetable',
        element: <ConferenceTimetable title="Personal conference timetable" />,
      },
      {
        path: 'registered-events',
        element: <RegisteredEventsView />,
      },
      {
        path: 'invoices',
        element: <OrdersReceiptsView />,
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
        path: 'registrations',
        element: <AdminRegistrationsView defaultFilter="ALL" />,
      },
      {
        path: 'finance',
        element: <AdminRegistrationsView defaultFilter="VERIFICATION" />,
      },
      {
        path: 'approvals',
        element: <AdminRegistrationsView defaultFilter="ALL" />,
      },
      {
        path: 'pricing',
        element: <AdminRegistrationsView defaultFilter="SETTINGS" />,
      },
      {
        path: 'activities',
        element: <EventScheduleView />,
      },
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
