import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '@/components/shared/HeroSection';
import { StatTicker } from '@/components/shared/StatTicker';
import { Marquee } from '@/components/magic/Marquee';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as authApi from '@/api/auth';
import {
  Cpu,
  ShieldCheck,
  Code2,
  Cloud,
  Layers,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export function HomeView() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    authApi
      .getCategoriesApi()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const technicalTracks = [
    {
      icon: Cpu,
      title: 'Artificial Intelligence & Machine Learning',
      desc: 'Deep learning architectures, LLMs in open-source, computer vision, NLP, and intelligent agent systems.',
    },
    {
      icon: ShieldCheck,
      title: 'Cyber Security & Cryptography',
      desc: 'Defensive engineering, zero-trust protocols, open security auditing, and cloud threat modeling.',
    },
    {
      icon: Code2,
      title: 'Software Engineering & Open Systems',
      desc: 'Architectures for scale, modern devops, microservices, and sustainable open-source ecosystems.',
    },
    {
      icon: Cloud,
      title: 'Cloud, Distributed & Edge Computing',
      desc: 'Kubernetes orchestration, serverless frameworks, edge IoT clusters, and resilient data grids.',
    },
  ];

  const partners = [
    'IEEE Lahore Section',
    'UET Lahore',
    'Al-Khawarizmi Institute of Computer Science (KICS)',
    'Higher Education Commission (HEC)',
    'Punjab Information Technology Board (PITB)',
    'National Center for Cyber Security (NCCS)',
    'National Center for Artificial Intelligence (NCAI)',
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Key Metrics & Stat Ticker */}
      <StatTicker />

      {/* 3. Technical Tracks Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 border-emerald-600/40 uppercase mb-3">
              Research & Industry Scope
            </Badge>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              Core Technical Tracks & Sessions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Peer-reviewed technical presentations, international keynote addresses, and high-impact industry research papers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalTracks.map((track, i) => {
              const Icon = track.icon;
              return (
                <Card key={i} className="border-slate-200 dark:border-slate-800 hover:border-emerald-600/60 transition-all hover:shadow-md">
                  <CardHeader className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
                      {track.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {track.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Participant Categories Preview (Dynamic from DB) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="sample" className="mb-2">CONFIGURABLE ADMISSION MATRIX</Badge>
              <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                Participant Categories & Access Tiers
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Each category offers customized profile forms, tailored workshop permissions, and specific credential requirements.
              </p>
            </div>
            <Link to="/register">
              <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2">
                Begin Registration <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.code}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {cat.code}
                    </span>
                    {cat.requiresApproval && (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-400">
                        Review Req.
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-base font-heading text-slate-900 dark:text-white mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Allowed Activities:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.allowedActivityTypes?.slice(0, 3).map((act, idx) => (
                      <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                        {act.replace('_', ' ')}
                      </span>
                    ))}
                    {(cat.allowedActivityTypes?.length || 0) > 3 && (
                      <span className="text-[10px] text-slate-400">+{cat.allowedActivityTypes.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Sponsors & Partners Marquee */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="container mx-auto px-4 mb-4 text-center">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Academic Partners & Institutional Patrons
          </p>
        </div>

        <Marquee className="py-4">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-2.5 mx-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 whitespace-nowrap">
                {partner}
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* 6. Call to Action */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-extrabold font-heading mb-4">
            Join Us at UET Lahore for ICOSST 2026
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Register your conference pass, reserve limited hands-on workshop seats, or register your national competition team on the official digital platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8">
                Create Attendee Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
