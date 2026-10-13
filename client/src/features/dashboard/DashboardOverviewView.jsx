import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Category Dashboards
import { AttendeeDashboard } from './categories/AttendeeDashboard';
import { OrganizerDashboard } from './categories/OrganizerDashboard';
import { WorkshopPresenterDashboard } from './categories/WorkshopPresenterDashboard';
import { MediaDashboard } from './categories/MediaDashboard';
import { SpeakerDashboard } from './categories/SpeakerDashboard';
import { PresentationDashboard } from './categories/PresentationDashboard';
import { PaperPresenterDashboard } from './categories/PaperPresenterDashboard';
import { AdminDashboard } from '@/admin/AdminDashboard';
import { Layers, ShieldCheck, Sparkles } from 'lucide-react';

const CATEGORY_MAP = {
  ATTENDEE_PARTICIPANT: { label: 'Attendee / Participant', component: AttendeeDashboard },
  ORGANIZER: { label: 'Organizer', component: OrganizerDashboard },
  WORKSHOP_PRESENTER: { label: 'Workshop Presenter', component: WorkshopPresenterDashboard },
  MEDIA_PERSON: { label: 'Media Person', component: MediaDashboard },
  INVITED_SPEAKER: { label: 'Invited Speaker', component: SpeakerDashboard },
  PRESENTER_CO_PRESENTER: { label: 'Presenter & Co-Presenter', component: PresentationDashboard },
  PAPER_PRESENTER: { label: 'Paper Presenter', component: PaperPresenterDashboard },
};

export function DashboardOverviewView() {
  const { user } = useAuthStore();
  
  // Default to user's registered category, or allow manual quick preview
  const defaultCat = user?.category || user?.profile?.categoryCode || 'ATTENDEE_PARTICIPANT';
  const [selectedCategory, setSelectedCategory] = useState(defaultCat);

  // If user is admin/super_admin and requested
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const [showAdminView, setShowAdminView] = useState(isAdmin);

  if (!user) return null;

  // Selected Category Component
  const ActiveComponent = CATEGORY_MAP[selectedCategory]?.component || AttendeeDashboard;

  return (
    <div className="space-y-6">
      {/* Interactive Category Switcher Toolbar (Allows 1-click preview of all requested dashboards) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Category-Specific Dashboards
            </span>
            <span className="text-[10px] text-slate-400">
              (Current Registered: <strong className="text-emerald-700 dark:text-emerald-400">{user.category || 'ATTENDEE_PARTICIPANT'}</strong>)
            </span>
          </div>

          {isAdmin && (
            <Button
              size="sm"
              variant={showAdminView ? 'default' : 'outline'}
              onClick={() => setShowAdminView(!showAdminView)}
              className="text-xs h-7 gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {showAdminView ? 'Switch to Category View' : 'Switch to Admin Event Hub'}
            </Button>
          )}
        </div>

        {/* 7 Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          {Object.entries(CATEGORY_MAP).map(([key, item]) => {
            const isCurrent = !showAdminView && selectedCategory === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedCategory(key);
                  setShowAdminView(false);
                }}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  isCurrent
                    ? 'bg-emerald-700 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render the selected specific dashboard */}
      {showAdminView ? (
        <AdminDashboard />
      ) : (
        <ActiveComponent user={user} />
      )}
    </div>
  );
}
