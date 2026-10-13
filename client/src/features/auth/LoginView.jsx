import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Mail, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid academic/personal email'),
  password: z.string().min(1, 'Password is required'),
});

const QUICK_TEST_ACCOUNTS = [
  {
    roleName: 'Attendee / Participant',
    email: 'attendee@example.com',
    pass: 'Participant@2026',
    badge: 'ATTENDEE',
  },
  {
    roleName: 'Organizer',
    email: 'organizer@icosst.kics.edu.pk',
    pass: 'Staff@icosst2026',
    badge: 'ORGANIZER',
  },
  {
    roleName: 'Workshop Presenter',
    email: 'workshop@icosst.kics.edu.pk',
    pass: 'Presenter@2026',
    badge: 'WORKSHOP',
  },
  {
    roleName: 'Media Person',
    email: 'media@icosst.kics.edu.pk',
    pass: 'Media@2026',
    badge: 'MEDIA',
  },
  {
    roleName: 'Invited Speaker',
    email: 'speaker@icosst.kics.edu.pk',
    pass: 'Speaker@2026',
    badge: 'SPEAKER',
  },
  {
    roleName: 'Presenter & Co-Presenter',
    email: 'presenter@icosst.kics.edu.pk',
    pass: 'Presenter@2026',
    badge: 'CO-PRESENTER',
  },
  {
    roleName: 'Paper Presenter',
    email: 'paper@icosst.kics.edu.pk',
    pass: 'Paper@2026',
    badge: 'PAPER',
  },
  {
    roleName: 'Conference Admin',
    email: 'admin@icosst.kics.edu.pk',
    pass: 'Admin@icosst2026',
    badge: 'SUPER ADMIN',
  },
];

export function LoginView() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      const user = await login(values);
      // Route to admin desk if super_admin, or to their specific category dashboard
      if (user.role === 'admin' || user.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (email, pass) => {
    setValue('email', email);
    setValue('password', pass);
    setServerError('');
  };

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
            Conference Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Log in to access your category-specific dashboard and event schedule
          </p>
        </div>

        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  Sign In to Dashboard
                </CardTitle>
                <CardDescription className="text-xs">
                  Enter your registered email and password
                </CardDescription>
              </div>
              <Link to="/register">
                <Button variant="outline" size="sm" className="text-xs">
                  New? Register Here
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
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@university.edu.pk"
                    className="pl-9 h-11 text-sm"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
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

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md gap-2"
              >
                {submitting ? 'Authenticating...' : 'Sign In to My Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Quick 1-Click Fill for All 7 Categories + Admin */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant 1-Click Test Accounts:</span>
                </div>
                <span className="text-[10px] text-slate-400">Click to autofill</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {QUICK_TEST_ACCOUNTS.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email, acc.pass)}
                    className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all text-[11px]"
                  >
                    <span className="font-bold block truncate text-slate-900 dark:text-white">
                      {acc.roleName}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800 py-3 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-700 dark:text-emerald-400 font-bold ml-1 hover:underline">
              Register yourself here &rarr;
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
