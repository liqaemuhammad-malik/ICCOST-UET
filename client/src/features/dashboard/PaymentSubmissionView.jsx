import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { OrdersReceiptsView } from './OrdersReceiptsView';
import {
  getMyRegistrationApi,
  getRegistrationConfigApi,
  submitPaymentApi,
} from '@/api/registration';
import {
  Building,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  FileText,
  Eye,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export function PaymentSubmissionView() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountTitle: 'AL-KHAWARIZMI INSTITUTE OF COMPUTER SCIENCE UET LAHORE',
    iban: 'PK93UNIL0109000316984445',
    bankName: 'UNITED BANK LIMITED',
    swiftCode: 'UNILPKKA',
    branch: 'UBL UET BRANCH',
    branchCode: '1950',
    branchAddress: 'MAIN GT ROAD UET LAHORE',
    instructions: 'Please transfer the exact payable amount to the official ICOSST account and upload the transaction receipt/screenshot for finance verification.',
  });

  const [copiedField, setCopiedField] = useState(null);

  const [formData, setFormData] = useState({
    transactionReference: '',
    paymentDate: new Date().toISOString().split('T')[0],
    amountPaid: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [regRes, configRes] = await Promise.all([
        getMyRegistrationApi().catch(() => null),
        getRegistrationConfigApi().catch(() => null),
      ]);

      if (configRes?.data?.bankDetails) {
        setBankDetails(configRes.data.bankDetails);
      }

      if (regRes?.data) {
        const reg = regRes.data;
        setRegistration(reg);
        setFormData((prev) => ({
          ...prev,
          amountPaid: reg.totalFee || '',
        }));

        if (reg.paymentStatus === 'REJECTED' || reg.paymentStatus === 'RESUBMISSION_REQUESTED') {
          setIsResubmitting(true);
        }
      }
    } catch (err) {
      console.error('Failed to load payment portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: 'Only JPG, PNG, WebP, or PDF files are allowed.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'File size exceeds maximum 5MB limit.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: null }));
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.transactionReference.trim()) {
      errs.transactionReference = 'Transaction or Reference Number is required';
    }
    if (!formData.paymentDate) {
      errs.paymentDate = 'Payment Date is required';
    }
    if (!formData.amountPaid || Number(formData.amountPaid) <= 0) {
      errs.amountPaid = 'Valid Amount Paid is required';
    }
    if (!selectedFile) {
      errs.file = 'Please upload a bank deposit slip or transaction receipt file';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrors({});
      setSuccessMessage('');

      const data = new FormData();
      data.append('transactionReference', formData.transactionReference.trim());
      data.append('paymentDate', formData.paymentDate);
      data.append('amountPaid', formData.amountPaid);
      data.append('receipt', selectedFile);

      await submitPaymentApi(data);
      setSuccessMessage('Payment proof successfully submitted! It is now queued for finance verification.');
      setSelectedFile(null);
      setFilePreview(null);
      setIsResubmitting(false);
      await loadData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Payment submission failed';
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  // If user hasn't registered yet
  if (!registration) {
    return (
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-center p-8">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          Conference Registration Required First
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
          You must submit your conference registration before making a bank payment. The system requires an authoritative registration reference and calculated payable fee.
        </p>
        <Button
          onClick={() => navigate('/dashboard/registration')}
          className="mt-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
        >
          Open Conference Registration <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

  const paymentSubmission = registration.paymentSubmission;
  const isPendingVerification = registration.paymentStatus === 'PENDING_VERIFICATION';
  const isVerified = registration.paymentStatus === 'VERIFIED';
  const isRejected = registration.paymentStatus === 'REJECTED';
  const isResubmitRequested = registration.paymentStatus === 'RESUBMISSION_REQUESTED';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Payment & Bank Verification Portal
              </h2>
              <Badge variant="uet">FINANCE DESK</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official bank transfer settlement and proof submission for ICOSST 2026.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Payable Fee:</span>
            <Badge className="bg-emerald-700 text-white font-bold text-sm">
              {registration.currency} {registration.totalFee?.toLocaleString()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/dashboard/status')}
            className="text-xs shrink-0"
          >
            View Live Tracker
          </Button>
        </div>
      )}

      {/* Rejection / Resubmission Alert */}
      {(isRejected || isResubmitRequested) && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/40">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                {isRejected ? 'Payment Verification Rejected' : 'Payment Resubmission Requested by Finance'}
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                <strong>Administrator Explanation:</strong>{' '}
                {registration.rejectionReason || registration.resubmissionNotes || registration.adminRemarks || 'Please submit a clear, legible payment receipt.'}
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Use the form below to resubmit an updated transaction receipt and reference number. Your previous submission has been preserved in audit history.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Verified Status Banner */}
      {isVerified && !isResubmitting && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  Payment Successfully Verified!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Amount: <strong>{registration.currency} {paymentSubmission?.amountPaid?.toLocaleString()}</strong> • Ref: <strong>{paymentSubmission?.transactionReference}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => navigate('/dashboard/status')}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs gap-1.5"
              >
                Registration Status <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              {registration.registrationStatus === 'APPROVED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="text-xs gap-1.5"
                >
                  View Dashboard <FileCheck className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Under Verification Banner */}
      {isPendingVerification && !isResubmitting && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-7 h-7 text-amber-600 shrink-0 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Payment Under Verification
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  Your bank deposit receipt (Ref: <strong>{paymentSubmission?.transactionReference}</strong>) is currently being reviewed by the KICS Finance Committee.
                </p>
                <span className="text-[10px] text-slate-500">
                  Submitted: {paymentSubmission?.paymentDate ? new Date(paymentSubmission.paymentDate).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {paymentSubmission?.receiptFile?.url && (
                <a
                  href={paymentSubmission.receiptFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="w-3.5 h-3.5" /> View Uploaded Receipt
                </a>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsResubmitting(true)}
                className="text-xs text-amber-800 border-amber-300"
              >
                Update / Re-upload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid: Bank Details (Left) + Submission Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Credentials Card */}
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="bg-slate-900 text-white rounded-t-xl pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400" />
                  Official Bank Account Information
                </CardTitle>
                <CardDescription className="text-xs text-slate-300">
                  Direct interbank transfer (IBFT), Raast, or branch over-the-counter deposit.
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px]">VERIFIED</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4 text-xs">
            {/* Account Title */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Account Title</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs block mt-0.5">
                  {bankDetails.accountTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(bankDetails.accountTitle, 'title')}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                title="Copy Title"
              >
                {copiedField === 'title' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* IBAN */}
            <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider block">
                  IBAN (International Bank Account Number)
                </span>
                <span className="font-mono font-black text-emerald-950 dark:text-emerald-100 text-sm block mt-0.5 tracking-wide">
                  {bankDetails.iban}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(bankDetails.iban, 'iban')}
                className="p-1.5 rounded hover:bg-emerald-100 text-emerald-700"
                title="Copy IBAN"
              >
                {copiedField === 'iban' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Grid of Bank details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bank Name</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{bankDetails.bankName}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">SWIFT Code</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{bankDetails.swiftCode}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Branch Code</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{bankDetails.branchCode}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Branch Name</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{bankDetails.branch}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Branch Address</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block mt-0.5">
                {bankDetails.branchAddress}
              </span>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
              <strong>Instructions:</strong> Please retain the original digital transfer screenshot or deposit slip receipt. Ensure the transaction reference number and timestamp are clearly readable.
            </div>
          </CardContent>
        </Card>

        {/* Payment Submission Form */}
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              {isResubmitting
                ? 'Resubmit Payment Evidence'
                : isPendingVerification
                ? 'Update Payment Information'
                : 'Participant Payment Form'}
            </CardTitle>
            <CardDescription className="text-xs">
              Upload evidence of completed bank transfer to initiate finance review.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Readonly Details */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registration Ref</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {registration.registrationNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Payable Amount</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {registration.currency} {registration.totalFee?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method (Read-only) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <Input
                  disabled
                  value="Bank Transfer (Online IBFT / Branch Deposit)"
                  className="text-xs h-10 bg-slate-50 dark:bg-slate-900 text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Transaction Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction / Reference Number *
                </label>
                <Input
                  value={formData.transactionReference}
                  onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
                  placeholder="e.g. UBL-TRX-982341 or 12-digit RAAST / IBFT ID"
                  className="text-xs h-10 font-mono"
                />
                {errors.transactionReference && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.transactionReference}</p>
                )}
              </div>

              {/* Payment Date & Amount Paid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="text-xs h-10"
                  />
                  {errors.paymentDate && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.paymentDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Amount Paid (PKR) *
                  </label>
                  <Input
                    type="number"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                    placeholder="e.g. 6000"
                    className="text-xs h-10 font-mono"
                  />
                  {errors.amountPaid && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.amountPaid}</p>
                  )}
                </div>
              </div>

              {/* Upload Payment Receipt File */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Payment Receipt (JPG, PNG, PDF max 5MB) *
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    id="receipt-file-upload"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="receipt-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                  >
                    <Upload className="w-8 h-8 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {selectedFile ? 'Change Selected File' : 'Click to Browse Deposit Slip'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Supports high-resolution camera photos, screenshots, or bank PDFs
                    </span>
                  </label>

                  {selectedFile && (
                    <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span className="truncate">{selectedFile.name}</span>
                        <span className="text-[10px] text-slate-400">
                          ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">READY</Badge>
                    </div>
                  )}

                  {filePreview && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                      <img
                        src={filePreview}
                        alt="Receipt Preview"
                        className="max-h-40 w-auto mx-auto object-contain"
                      />
                    </div>
                  )}
                </div>
                {errors.file && <p className="text-[11px] text-rose-600 mt-1">{errors.file}</p>}
              </div>

              {errors.form && (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 text-xs gap-2 shadow-md"
              >
                {submitting ? (
                  'Submitting Payment...'
                ) : isResubmitting ? (
                  'Resubmit Corrected Payment Evidence'
                ) : (
                  'Submit Payment for Verification'
                )}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Invoice and receipt history is part of the payment workspace. */}
      <OrdersReceiptsView embedded />
    </div>
  );
}
