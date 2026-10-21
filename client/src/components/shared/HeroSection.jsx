import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Award, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { SplitText } from '@/components/reactbits/SplitText';

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: Dec 22, 2026 09:00:00 PKT
    const target = new Date('2026-12-22T09:00:00+05:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, target - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-20 border-b border-slate-800">
      {/* Background spotlight */}
      <Spotlight className="-top-20 left-10 md:left-40" fill="rgba(10, 85, 114, 0.35)" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Academic badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs py-1 px-3">
            20th Annual Jubilee Edition
          </Badge>
          <Badge className="bg-slate-800 text-slate-300 border border-slate-700 text-xs py-1 px-3">
            IEEE Technical Co-Sponsorship
          </Badge>
          <Badge className="bg-amber-950/60 text-amber-300 border border-amber-800/80 text-xs py-1 px-3">
            SAMPLE Pricing Active
          </Badge>
        </div>

        {/* Heading */}
        <div className="max-w-4xl">
          <p className="text-emerald-400 font-semibold tracking-wider text-sm uppercase mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            Al-Khawarizmi Institute of Computer Science (KICS), UET Lahore
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight mb-5">
            <SplitText text="20th International Conference on Open Source Systems & Technologies" delay={0.02} />
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mb-8">
            Pakistan’s premier flagship academic & industrial summit convening global researchers, software engineers, and university innovators around AI, cybersecurity, and resilient open platforms.
          </p>
        </div>

        {/* Conference Date & Venue Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mb-10 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/80 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Conference Dates</p>
              <p className="font-semibold text-white">22–23 December 2026</p>
              <p className="text-xs text-slate-400">Tuesday – Wednesday</p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l border-slate-700 pt-3 md:pt-0 md:pl-4">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Venue & Host</p>
              <p className="font-semibold text-white">KICS Seminar Complex</p>
              <p className="text-xs text-slate-400">UET Main Campus, GT Road, Lahore</p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l border-slate-700 pt-3 md:pt-0 md:pl-4">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Event Features</p>
              <p className="font-semibold text-white">Keynotes • Workshops • Expo</p>
              <p className="text-xs text-slate-400">Software & Cyber Competitions</p>
            </div>
          </div>
        </div>

        {/* Action Buttons & Countdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-3xl">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 shadow-lg shadow-emerald-900/30 gap-2">
              Register for Conference
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link to="/catalog">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
              Browse Passes & SAMPLE Fees
            </Button>
          </Link>

          <Link to="/schedule">
            <Button size="lg" variant="ghost" className="w-full sm:w-auto text-slate-400 hover:text-white hover:bg-slate-800">
              Event Timeline
            </Button>
          </Link>
        </div>

        {/* Live Countdown Box */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Event Countdown (22 Dec 2026)
            </p>
          </div>

          <div className="flex items-center gap-3 text-center">
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 min-w-[60px]">
              <div className="text-xl font-bold font-heading text-white">{timeLeft.days}</div>
              <div className="text-[10px] uppercase text-slate-400">Days</div>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 min-w-[60px]">
              <div className="text-xl font-bold font-heading text-white">{timeLeft.hours}</div>
              <div className="text-[10px] uppercase text-slate-400">Hours</div>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 min-w-[60px]">
              <div className="text-xl font-bold font-heading text-white">{timeLeft.minutes}</div>
              <div className="text-[10px] uppercase text-slate-400">Mins</div>
            </div>
            <span className="text-slate-600 font-bold">:</span>
            <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 min-w-[60px]">
              <div className="text-xl font-bold font-heading text-emerald-400">{timeLeft.seconds}</div>
              <div className="text-[10px] uppercase text-slate-400">Secs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
