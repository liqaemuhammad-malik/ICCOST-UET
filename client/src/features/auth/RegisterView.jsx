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
    label: 'Attendee / Participant',
    description: 'General conference delegate, students, and faculty attending keynotes and tracks.',
    color: '#0b4f35',
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
        category: values.category,
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
    <div className="py-10 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-xl">
        {/* Conference Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200/90 mb-3">
            <img
              src="/icosst-logo.png"
              alt="20th IEEE ICOSST 2026"
              className="h-16 sm:h-20 w-auto object-contain mx-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Conference Registration Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Select your participation category to access your specific conference dashboard
          </p>
        </div>

        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
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
