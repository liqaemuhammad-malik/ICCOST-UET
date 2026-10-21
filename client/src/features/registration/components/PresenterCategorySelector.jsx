import React from 'react';
import {
  FileText,
  Terminal,
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defaultSchedule } from '@/features/shared/scheduleData';
import { findConflictingActivity, formatConflictMessage } from '../timeConflictEngine';

const PRESENTER_OPTIONS = [
  {
    id: 'PAPER_PRESENTATION',
    backendCategory: 'PAPER_PRESENTER',
    title: 'Paper Presentation',
    icon: FileText,
    badge: 'Peer-Reviewed Track',
    description: 'Deliver accepted technical research papers in formal conference proceeding tracks.',
  },
  {
    id: 'WORKSHOPS',
    backendCategory: 'WORKSHOP_PRESENTER',
    title: 'Workshops',
    icon: Terminal,
    badge: 'Technical Lab Lead',
    description: 'Instruct or facilitate dedicated hands-on specialized computing and AI lab sessions.',
  },
  {
    id: 'BRAINIAC_COMPETITION',
    backendCategory: 'ATTENDEE_PARTICIPANT',
    title: 'Brainiac Competition',
    icon: Trophy,
    badge: 'Innovation Showcase',
    description: 'Compete in Brainiac 2026 Project Showcase and Speed/Gaming technical hackathons.',
  },
];

export function PresenterCategorySelector({
  presenterData,
  onChangePresenterData,
  selectedActivityIds,
  onToggleActivity,
  onBack,
  onContinue,
}) {
  const activeOption = presenterData.stream || 'PAPER_PRESENTATION';

  const workshops = defaultSchedule.filter(
    (item) => item.track?.toLowerCase().includes('workshop') || item.title?.toLowerCase().includes('workshop')
  );

  const competitionActivities = defaultSchedule.filter(
    (item) =>
      item.id === 'd2-brainiac' ||
      item.id === 'd2-showcase' ||
      item.id === 'd2-gaming' ||
      item.id === 'd2-speed'
  );

  const handleSelectStream = (streamId) => {
    const opt = PRESENTER_OPTIONS.find((o) => o.id === streamId);
    onChangePresenterData({
      ...presenterData,
      stream: streamId,
      backendCategory: opt?.backendCategory || 'PAPER_PRESENTER',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Presenter Track Selection
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Select your presentation or competition category to configure session scheduling.
        </p>
      </div>

      {/* 3 Selectable Presenter Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESENTER_OPTIONS.map((opt) => {
          const isSelected = activeOption === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => handleSelectStream(opt.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleSelectStream(opt.id);
                }
              }}
              className={`rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 outline-none text-left ${
                isSelected
                  ? 'border-emerald-600 bg-gradient-to-b from-emerald-50/80 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 ring-2 ring-emerald-600/60 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shadow-xs ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold uppercase tracking-wider py-0.5 px-2.5 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  {opt.badge}
                </Badge>
              </div>

              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white mb-1.5">
                {opt.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {opt.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stream Specific Field Panels */}
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-6 space-y-5">
        {/* CASE 1: Paper Presentation Form */}
        {activeOption === 'PAPER_PRESENTATION' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Paper Details & Submission Reference
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Enter your accepted conference paper metadata for official indexing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="paperId" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Paper ID / EasyChair Ref *
                </Label>
                <Input
                  id="paperId"
                  placeholder="e.g. ICOSST26-P104"
                  value={presenterData.paperId || ''}
                  onChange={(e) =>
                    onChangePresenterData({ ...presenterData, paperId: e.target.value })
                  }
                  className="h-11 text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="track" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Conference Research Track *
                </Label>
                <select
                  id="track"
                  value={presenterData.track || 'AI & Machine Learning'}
                  onChange={(e) =>
                    onChangePresenterData({ ...presenterData, track: e.target.value })
                  }
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-input bg-background text-foreground font-medium"
                >
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Cyber Security & Cryptography">Cyber Security & Cryptography</option>
                  <option value="Software Engineering & Open Systems">Software Engineering & Open Systems</option>
                  <option value="Cloud, Distributed & Edge Systems">Cloud, Distributed & Edge Systems</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="paperTitle" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Accepted Paper Title *
                </Label>
                <Input
                  id="paperTitle"
                  placeholder="e.g. Zero-Trust Distributed Authentication for Edge Cloud Microservices"
                  value={presenterData.paperTitle || ''}
                  onChange={(e) =>
                    onChangePresenterData({ ...presenterData, paperTitle: e.target.value })
                  }
                  className="h-11 text-sm rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: Workshops Selector */}
        {activeOption === 'WORKSHOPS' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Eligible Technical Workshops
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Select your assigned workshop session to reserve your lab room.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {workshops.map((w) => {
                const isSelected = selectedActivityIds.includes(w.id);
                return (
                  <div
                    key={w.id}
                    onClick={() => onToggleActivity(w)}
                    className={`rounded-xl border-2 p-4 cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <Badge variant="outline" className="text-xs font-bold">{w.day}</Badge>
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {w.time}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {w.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{w.venue}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CASE 3: Brainiac Competition Form */}
        {activeOption === 'BRAINIAC_COMPETITION' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Brainiac 2026 Project Showcase & Competitions
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Register your project team or entry for the Day 2 innovation showcase.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="teamName" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Team Name *
                </Label>
                <Input
                  id="teamName"
                  placeholder="e.g. UET CyberKnights, NeuralForge"
                  value={presenterData.teamName || ''}
                  onChange={(e) =>
                    onChangePresenterData({ ...presenterData, teamName: e.target.value })
                  }
                  className="h-11 text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="projectTitle" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Showcase Project Title *
                </Label>
                <Input
                  id="projectTitle"
                  placeholder="e.g. Open Autonomous Drone Surveillance Framework"
                  value={presenterData.projectTitle || ''}
                  onChange={(e) =>
                    onChangePresenterData({ ...presenterData, projectTitle: e.target.value })
                  }
                  className="h-11 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-3">
              <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">Select Competition Activities:</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {competitionActivities.map((comp) => {
                  const isSelected = selectedActivityIds.includes(comp.id);
                  return (
                    <div
                      key={comp.id}
                      onClick={() => onToggleActivity(comp)}
                      className={`rounded-xl border-2 p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-600 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate mr-3">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{comp.title}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{comp.time} · {comp.venue}</p>
                      </div>
                      <Badge variant={isSelected ? 'default' : 'outline'} className="text-xs font-bold py-1 px-2.5">
                        {isSelected ? 'Selected' : 'Add'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 sm:h-12 text-sm font-semibold px-6 border-slate-200 dark:border-slate-700 gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </Button>

        <Button
          type="button"
          onClick={onContinue}
          className="h-11 sm:h-12 text-sm sm:text-base px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <span>Continue to Personal Information</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
