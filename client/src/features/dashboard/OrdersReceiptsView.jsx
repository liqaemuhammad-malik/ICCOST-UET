import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getMyRegistrationApi, downloadMyDelegateSlipApi } from '@/api/registration';
import {
  CreditCard,
  Download,
  Eye,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
} from 'lucide-react';

export function OrdersReceiptsView({ embedded = false }) {
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await getMyRegistrationApi();
        if (res?.data) {
          setRegistration(res.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const blob = await downloadMyDelegateSlipApi();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ICOSST-2026-Receipt-${registration?.registrationNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Official receipt is available once registration is approved.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  const paymentSubmission = registration?.paymentSubmission;
  const isApproved = registration?.registrationStatus === 'APPROVED';

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      {/* Top Banner */}
      {!embedded && <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Orders & Official Receipts
              </h2>
              <Badge variant="uet">AUDITED LEDGER</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete history of conference orders, fee invoices, and verified bank receipts.
            </p>
          </div>
        </div>
      </div>}

      {registration ? (
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold font-heading">
                  Invoice #{registration.registrationNumber}
                </CardTitle>
                <CardDescription className="text-xs">
                  Issued by KICS, University of Engineering & Technology (UET) Lahore
                </CardDescription>
              </div>

              <Badge
                variant={
                  registration.paymentStatus === 'VERIFIED'
                    ? 'success'
                    : registration.paymentStatus === 'REJECTED'
                    ? 'destructive'
                    : 'warning'
                }
                className="text-xs py-1 px-3"
              >
                {registration.paymentStatus.replaceAll('_', ' ')}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-slate-200 dark:border-slate-700 font-bold uppercase text-[10px] text-slate-400">
                  <tr>
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Mode</th>
                    <th className="py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                      ICOSST 2026 Conference Admission Delegate Pass
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {registration.participantCategory === 'IEEE_MEMBER_STUDENT'
                        ? 'IEEE Member / Student'
                        : 'Non-IEEE Member / Professional'}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{registration.attendanceMode}</td>
                    <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                      PKR {registration.registrationFee?.toLocaleString()}
                    </td>
                  </tr>

                  {registration.attendDinner && (
                    <tr>
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                        Official Conference Gala Dinner Ticket
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">Networking Banquet</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">Physical</td>
                      <td className="py-3 text-right font-bold text-slate-900 dark:text-white">
                        PKR {registration.dinnerFee?.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-bold text-sm">
                    <td colSpan="3" className="py-3 text-right text-slate-900 dark:text-white">
                      Grand Total Settled:
                    </td>
                    <td className="py-3 text-right text-emerald-700 dark:text-emerald-400 font-mono text-base font-extrabold">
                      PKR {registration.totalFee?.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment Transaction Details Card */}
            {paymentSubmission && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      Settled via Bank Transfer (United Bank Limited)
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Transaction Ref: <strong className="font-mono text-slate-800 dark:text-slate-200">{paymentSubmission.transactionReference}</strong> • Payment Date:{' '}
                    {new Date(paymentSubmission.paymentDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {paymentSubmission.receiptFile?.url && (
                    <a
                      href={paymentSubmission.receiptFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-md border border-slate-300 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Uploaded Slip
                    </a>
                  )}

                  {isApproved && (
                    <Button
                      size="sm"
                      onClick={handleDownload}
                      disabled={downloading}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {downloading ? 'Downloading...' : 'Official PDF Slip'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="p-8 text-center border-dashed">
          <p className="text-xs text-slate-500">No order or registration history recorded yet.</p>
        </Card>
      )}
    </div>
  );
}
