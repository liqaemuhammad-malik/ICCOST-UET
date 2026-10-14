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
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  accountType: z.enum([
    'ATTENDEE',
    'PARTICIPANT',
    'ORGANIZER',
    'WORKSHOP_PRESENTER',
    'MEDIA_PERSON',
    'INVITED_SPEAKER',
    'PRESENTER_CO_PRESENTER',
    'PAPER_PRESENTER',
    'ADMIN',
  ]),
  email: z.string().email('Please enter a valid academic/personal email'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginView({ adminOnly = false }) {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      accountType: adminOnly ? 'ADMIN' : 'ATTENDEE',
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

  return (
    <div className="relative flex min-h-[calc(100vh-140px)] flex-col items-center justify-center overflow-hidden px-4 py-10" style={{ backgroundImage: "url('/uet_lahore_cover.jpeg')", backgroundPosition: 'center', backgroundSize: 'cover' }}>
      <img src="/uet_lahore_cover.jpeg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover" />
      <div className="relative z-10 w-full max-w-xl animate-[fadeIn_.6s_ease-out]">
        {/* Conference Header Branding */}
        <div className="text-center mb-6">

          <h1 className="text-2xl font-extrabold font-heading text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.85)] sm:text-3xl">
            {adminOnly ? 'Administration Sign In' : 'Conference Sign In'}
          </h1>
          <p className="mx-auto mt-1 max-w-md text-xs font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-sm">
            {adminOnly ? 'Secure access for the ICOSST administration portal' : 'Log in to access your category-specific dashboard and event schedule'}
          </p>
        </div>

        <Card className="shadow-2xl border-white/70 dark:border-slate-800/80 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 transition-transform duration-300 hover:-translate-y-1">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {adminOnly ? 'Sign In to Admin Portal' : 'Sign In to Dashboard'}
                </CardTitle>
                <CardDescription className="text-xs">
                  Enter your registered email and password
                </CardDescription>
              </div>
              {!adminOnly && (
                <Link to="/register">
                  <Button variant="outline" size="sm" className="text-xs">
                    New? Register Here
                  </Button>
                </Link>
              )}
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
                <Label htmlFor="accountType" className="text-xs font-semibold">
                  Login As
                </Label>
                <select
                  id="accountType"
                  className="w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-sm dark:bg-slate-900 dark:border-slate-700"
                  {...register('accountType')}
                >
                  {adminOnly ? (
                    <option value="ADMIN">Conference Admin</option>
                  ) : (
                    <>
                      <option value="ATTENDEE">Attendee</option>
                      <option value="PARTICIPANT">Participant / UET Student</option>
                      <option value="ORGANIZER">Organizer</option>
                      <option value="WORKSHOP_PRESENTER">Workshop Presenter</option>
                      <option value="MEDIA_PERSON">Media Person</option>
                      <option value="INVITED_SPEAKER">Invited Speaker</option>
                      <option value="PRESENTER_CO_PRESENTER">Presenter &amp; Co-Presenter</option>
                      <option value="PAPER_PRESENTER">Paper Presenter</option>
                    </>
                  )}
                </select>
                {errors.accountType && <p className="text-xs text-rose-600">{errors.accountType.message}</p>}
              </div>

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

          </CardContent>

          {!adminOnly && (
            <CardFooter className="justify-center border-t border-slate-100 py-3 text-xs text-slate-500 dark:border-slate-800">
              Don't have an account?{' '}
              <Link to="/register" className="ml-1 font-bold text-emerald-700 hover:underline dark:text-emerald-400">
                Register yourself here &rarr;
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
