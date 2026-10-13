import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as authApi from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export function ForgotPasswordView() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (values) => {
    setServerError('');
    setSubmitting(true);
    try {
      await authApi.forgotPasswordApi(values.email);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-220px)] bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-md">
        <Card className="shadow-md border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold font-heading">Reset Password</CardTitle>
            <CardDescription className="text-xs">
              Enter your email address to receive password reset instructions
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
                  If an account exists with that email address, a password reset link has been dispatched.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full">Back to Sign In</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Registered Email</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="email" type="email" placeholder="name@university.edu.pk" className="pl-9" {...register('email')} />
                  </div>
                  {errors.email && <p className="text-xs text-rose-600">{errors.email.message}</p>}
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                  {submitting ? 'Sending Request...' : 'Send Password Reset Link'}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 py-3 text-xs text-slate-500">
            Remembered your password?{' '}
            <Link to="/login" className="text-emerald-700 font-semibold ml-1 hover:underline">
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
