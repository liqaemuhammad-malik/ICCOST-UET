import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as authApi from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RegistrationCountdown } from '@/features/public/RegistrationCountdown';
import {
  User,
  Mail,
  Lock,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  {
    value: 'ATTENDEE_PARTICIPANT',
    label: 'Attendee',
    description: 'General conference attendee joining keynotes, tracks, and exhibition activities.',
    color: '#0b4f35',
  },
  {
    value: 'PARTICIPANT',
    label: 'Participant / UET Student',
    description: 'UET students and delegates whose credentials are checked through the UET LMS at login.',
    color: '#047857',
  },
  {
    value: 'ORGANIZER',
    label: 'Organizer',
    description: 'KICS and UET Lahore organizing committee, session chairs, and track coordinators.',
    color: '#0f172a',
  },
  {
    value: 'WORKSHOP_PRESENTER',
    label: 'Workshop Presenter',
    description: 'Hands-on technical workshop instructor conducting practical lab sessions.',
    color: '#7c3aed',
  },
  {
    value: 'MEDIA_PERSON',
    label: 'Media Person',
    description: 'Accredited journalists, press correspondents, and broadcasting media crews.',
    color: '#0369a1',
  },
  {
    value: 'INVITED_SPEAKER',
    label: 'Invited Speaker',
    description: 'Plenary keynote speakers, international delegates, and panel dignitaries.',
    color: '#be123c',
  },
  {
    value: 'PRESENTER_CO_PRESENTER',
    label: 'Presenter & Co-Presenter',
    description: 'Presentation authors and co-authors delivering technical presentations.',
    color: '#b45309',
  },
  {
    value: 'PAPER_PRESENTER',
    label: 'Paper Presenter',
    description: 'Authors presenting peer-reviewed research papers in conference proceedings.',
    color: '#059669',
  },
];

const registerSchema = z
  .object({
    name: z.string().min(2, 'Full Name is required (minimum 2 characters)'),
    email: z.string().email('Please enter a valid academic/personal email'),
    category: z.string().min(1, 'Please select your conference category'),
    institution: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function RegisterView() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      category: 'ATTENDEE_PARTICIPANT',
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const res = await authApi.registerApi({
        name: values.name,
        email: values.email,
        password: values.password,
        category: values.category === 'PARTICIPANT' ? 'ATTENDEE_PARTICIPANT' : values.category,
        institution: values.institution || '',
      });

      // Automatically authenticate the newly registered user
      if (res.data?.user && res.data?.accessToken) {
        setAuth(res.data.user, res.data.accessToken);
        // Direct transition straight to their specific category dashboard!
        navigate('/dashboard');
      } else {
        // Fallback: login directly
        const loginRes = await authApi.loginApi({
          email: values.email,
          password: values.password,
        });
        setAuth(loginRes.data.user, loginRes.data.accessToken);
        navigate('/dashboard');
      }
    } catch (err) {
      setServerError(
        err.response?.data?.error?.message || 'Registration failed. Please review your input.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategoryInfo = CATEGORY_OPTIONS.find((c) => c.value === selectedCategory);

  return (
    <div className="relative flex min-h-[calc(100vh-140px)] flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-10" style={{ backgroundImage: "url('/uet_lahore_cover.jpeg')", backgroundPosition: 'center', backgroundSize: 'cover' }}>
      <img src="/uet_lahore_cover.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover" />
      <div className="relative z-10 w-full max-w-xl animate-[fadeIn_.6s_ease-out]">
        {/* Conference Header Branding */}
        <div className="text-center mb-6">

          <h1 className="text-2xl font-extrabold font-heading text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)] sm:text-3xl">
            Conference Registration Portal
          </h1>
          <p className="mx-auto mt-1 max-w-md text-xs font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-sm">
            Select your participation category to access your specific conference dashboard
          </p>
        </div>

        <RegistrationCountdown />

        <Card className="shadow-2xl border-white/70 dark:border-slate-800/80 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 transition-transform duration-300 hover:-translate-y-1">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  Register Attendee Identity
                </CardTitle>
                <CardDescription className="text-xs">
                  One verified credential per delegate
                </CardDescription>
              </div>
              <Link to="/login">
                <Button variant="outline" size="sm" className="text-xs">
                  Sign In Instead
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            {serverError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Category Dropdown (Mandatory as requested) */}
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Participation Category (Select from Dropdown) *</span>
                  <Badge variant="uet" className="text-[10px]">Required</Badge>
                </Label>
                <div className="relative">
                  <select
                    id="category"
                    className="w-full h-11 px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none font-medium cursor-pointer"
                    {...register('category')}
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
                {errors.category && <p className="text-xs text-rose-600">{errors.category.message}</p>}

                {/* Selected Category Explainer Pill */}
                {selectedCategoryInfo && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{selectedCategoryInfo.label}: </span>
                      <span className="text-[11px] text-emerald-800 dark:text-emerald-300">{selectedCategoryInfo.description}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Full Name (for Badge & Certificate) *
                </Label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="name"
                    placeholder="Prof. / Dr. / Engr. / Mr. / Ms. Name"
                    className="pl-9 h-11 text-sm"
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@university.edu.pk or personal email"
                    className="pl-9 h-11 text-sm"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
              </div>

              {/* Institution / Organization */}
              <div className="space-y-1.5">
                <Label htmlFor="institution" className="text-xs font-semibold">
                  University / Organization / Media Outlet (Optional)
                </Label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="institution"
                    placeholder="e.g. UET Lahore, NUST, Dawn News, KICS"
                    className="pl-9 h-11 text-sm"
                    {...register('institution')}
                  />
                </div>
              </div>

              {/* Passwords in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold">
                    Password (min. 8 chars) *
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9 h-11 text-sm"
                      {...register('password')}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-rose-600">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9 h-11 text-sm"
                      {...register('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md gap-2 mt-2"
              >
                {submitting ? 'Creating Account & Entering Dashboard...' : 'Register & Open My Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800 py-3 text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-700 dark:text-emerald-400 font-bold ml-1 hover:underline">
              Sign In to your Dashboard &rarr;
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
