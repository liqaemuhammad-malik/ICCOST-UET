import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as authApi from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const resetSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function ResetPasswordView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (values) => {
    if (!token) {
      setServerError('Missing reset token in URL.');
      return;
    }
    setServerError('');
    setSubmitting(true);
    try {
      await authApi.resetPasswordApi({ token, newPassword: values.newPassword });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Password reset failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-220px)] bg-slate-50 dark:bg-slate-900/50">
      <div className="w-full max-w-md">
        <Card className="shadow-md border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold font-heading">Choose New Password</CardTitle>
            <CardDescription className="text-xs">
              Enter and confirm your new secure account password
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <p className="text-sm text-slate-700 dark:text-slate-200 mb-4">
                  Your password has been reset successfully.
                </p>
                <Link to="/login">
                  <Button className="w-full bg-emerald-700 text-white">Continue to Sign In</Button>
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
                  <Label htmlFor="newPassword" className="text-xs font-semibold">New Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="newPassword" type="password" placeholder="••••••••" className="pl-9" {...register('newPassword')} />
                  </div>
                  {errors.newPassword && <p className="text-xs text-rose-600">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-9" {...register('confirmPassword')} />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                  {submitting ? 'Updating Password...' : 'Save New Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
