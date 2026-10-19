import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

// Category Dashboards
import { AttendeeDashboard } from './categories/AttendeeDashboard';
import { OrganizerDashboard } from './categories/OrganizerDashboard';
import { WorkshopPresenterDashboard } from './categories/WorkshopPresenterDashboard';
import { MediaDashboard } from './categories/MediaDashboard';
import { SpeakerDashboard } from './categories/SpeakerDashboard';
import { PresentationDashboard } from './categories/PresentationDashboard';
import { PaperPresenterDashboard } from './categories/PaperPresenterDashboard';
import { AdminDashboard } from '@/admin/AdminDashboard';
import { DigitalPassView } from './DigitalPassView';
import { RegistrationCountdown } from '@/features/public/RegistrationCountdown';

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

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const selectedCategory = user.category || user.profile?.categoryCode || 'ATTENDEE_PARTICIPANT';
  const ActiveComponent = CATEGORY_MAP[selectedCategory]?.component || AttendeeDashboard;

  return (
    <div className="space-y-6">
      {isAdmin ? <AdminDashboard /> : (
        <>
          <div className="grid items-stretch gap-6 xl:grid-cols-2">
            <div className="h-[560px] min-h-0">
              <DigitalPassView embedded />
            </div>
            <div className="h-[560px] min-h-0">
              <RegistrationCountdown fillHeight />
            </div>
          </div>
          <ActiveComponent user={user} />
        </>
      )}
    </div>
  );
}
