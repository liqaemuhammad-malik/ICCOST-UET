import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as authApi from '@/api/auth';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing email verification token in URL.');
      return;
    }

    authApi
      .verifyEmailApi(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error?.message || 'Email verification link is invalid or expired.');
      });
  }, [token]);

  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-220px)] bg-slate-50 dark:bg-slate-900/50">
      <Card className="max-w-md w-full text-center p-6 shadow-md border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center py-6">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Verifying your email token...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold font-heading text-slate-900 mb-2">
                Email Verified!
              </CardTitle>
              <p className="text-sm text-slate-600 mb-6">{message}</p>
              <Link to="/login" className="w-full">
                <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                  Continue to Sign In
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-4">
              <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold font-heading text-slate-900 mb-2">
                Verification Failed
              </CardTitle>
              <p className="text-sm text-slate-600 mb-6">{message}</p>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
