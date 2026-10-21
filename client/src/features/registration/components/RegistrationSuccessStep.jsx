import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Download,
  CreditCard,
  Building,
  ArrowRight,
  User,
  ShieldCheck,
  Mail,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function RegistrationSuccessStep({ registration, bankDetails = {} }) {
  const regNumber = registration?.registrationNumber || 'ICOSST26-REG-XXXX';
  const totalFee = registration?.totalFee || 0;
  const currency = registration?.currency || 'PKR';

  const copyIban = () => {
    if (bankDetails.iban) {
      navigator.clipboard.writeText(bankDetails.iban);
      toast.success('IBAN copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      {/* Top Banner Card */}
      <div className="text-center p-8 rounded-3xl bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-300 dark:border-emerald-700 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-700/30">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <Badge variant="outline" className="border-emerald-600 text-emerald-800 dark:text-emerald-300 mb-2.5 text-xs font-bold uppercase tracking-wider py-1 px-3">
          Registration Officially Recorded
        </Badge>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          Welcome to ICOSST 2026!
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1.5 leading-relaxed">
          Your conference registration has been recorded under the official reference number below.
        </p>

        <div className="mt-5 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 shadow-xs">
          <span className="text-xs sm:text-sm text-slate-500 font-semibold">Registration Ref:</span>
          <span className="font-mono text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-300 tracking-wider">
            {regNumber}
          </span>
        </div>
      </div>

      {/* Official Bank Deposit Instructions Card */}
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-emerald-700" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Official Bank Deposit Credentials
            </h3>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
            Payable: {currency} {totalFee.toLocaleString()}
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">Account Title</span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {bankDetails.accountTitle || 'AL-KHAWARIZMI INSTITUTE OF COMPUTER SCIENCE UET LAHORE'}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block">IBAN</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5">
                  {bankDetails.iban || 'PK93UNIL0109000316984445'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyIban}
                className="h-8 text-xs font-bold text-emerald-700 hover:bg-emerald-50 gap-1.5 border-emerald-300"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy IBAN
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 text-xs block">Bank Name</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {bankDetails.bankName || 'UNITED BANK LIMITED (UBL)'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Branch</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {bankDetails.branch || 'UBL UET Branch Lahore (Code 1950)'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Please deposit or transfer the payable amount to the account above. Then log in to your participant portal to upload your bank transfer transaction receipt/screenshot for finance verification.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link to="/dashboard/payment" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-12 px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all gap-2">
            <CreditCard className="w-4 h-4" />
            Upload Payment Proof Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <Link to="/dashboard" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base font-bold gap-2 rounded-xl border-slate-200 dark:border-slate-700">
            <User className="w-4 h-4" />
            Go to Participant Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
