import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  adminGetAllRegistrationsApi,
  adminGetRegistrationDetailsApi,
  adminReviewPaymentApi,
  adminReviewRegistrationApi,
  adminGetFeeSettingsApi,
  adminUpdateFeeSettingsApi,
  downloadDelegateSlipByIdApi,
} from '@/api/registration';
import {
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
  Building,
  Utensils,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Settings,
  RefreshCw,
} from 'lucide-react';

export function AdminRegistrationsView({ defaultFilter = 'ALL' }) {
  const [activeTab, setActiveTab] = useState(defaultFilter); // 'ALL' | 'PENDING' | 'VERIFICATION' | 'APPROVED' | 'REJECTED' | 'SETTINGS' | 'REPORTS'
  const [registrations, setRegistrations] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    approved: 0,
    pendingPayment: 0,
    paymentSubmitted: 0,
    underReview: 0,
    rejected: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegId, setSelectedRegId] = useState(null);
  const [reviewDetails, setReviewDetails] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Review modal actions
  const [actionModal, setActionModal] = useState(null); // 'APPROVE_PAYMENT' | 'REJECT_PAYMENT' | 'RESUBMIT_PAYMENT' | 'APPROVE_REG' | 'REJECT_REG'
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  // Fee settings state
  const [feeSettings, setFeeSettings] = useState({
    currency: 'PKR',
    ieeeStudentPhysical: 1000,
    ieeeStudentVirtual: 1000,
    nonIeeeProfessionalPhysical: 2000,
    nonIeeeProfessionalVirtual: 2000,
    dinnerFee: 5000,
  });
  const [feeSubmitting, setFeeSubmitting] = useState(false);
  const [feeSuccess, setFeeSuccess] = useState('');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = { search };

      if (activeTab === 'PENDING') {
        params.paymentStatus = 'NOT_SUBMITTED';
      } else if (activeTab === 'VERIFICATION') {
        params.paymentStatus = 'PENDING_VERIFICATION';
      } else if (activeTab === 'APPROVED') {
        params.registrationStatus = 'APPROVED';
      } else if (activeTab === 'REJECTED') {
        params.registrationStatus = 'REJECTED';
      }

      const res = await adminGetAllRegistrationsApi(params);
      if (res?.data) {
        setRegistrations(res.data.items || []);
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }
      }
    } catch (err) {
      console.error('Failed to load admin registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeSettings = async () => {
    try {
      const res = await adminGetFeeSettingsApi();
      if (res?.data) setFeeSettings(res.data);
    } catch (err) {
      console.error('Failed to load fee settings:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'SETTINGS') {
      fetchFeeSettings();
    } else {
      fetchRegistrations();
    }
  }, [activeTab, search]);

  const openReviewModal = async (regId) => {
    setSelectedRegId(regId);
    setReviewLoading(true);
    setActionModal(null);
    setAdminNotes('');
    setRejectionReason('');
    setActionError('');
    try {
      const res = await adminGetRegistrationDetailsApi(regId);
      if (res?.data) {
        setReviewDetails(res.data);
      }
    } catch (err) {
      console.error('Failed to load review details:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedRegId || !actionModal) return;
    setActionSubmitting(true);
    setActionError('');

    try {
      if (actionModal === 'APPROVE_PAYMENT') {
        await adminReviewPaymentApi(selectedRegId, {
          action: 'APPROVE',
          notes: adminNotes,
        });
      } else if (actionModal === 'REJECT_PAYMENT') {
        if (!rejectionReason.trim()) {
          setActionError('Please provide a rejection reason');
          setActionSubmitting(false);
          return;
        }
        await adminReviewPaymentApi(selectedRegId, {
          action: 'REJECT',
          rejectionReason,
          notes: adminNotes,
        });
      } else if (actionModal === 'RESUBMIT_PAYMENT') {
        if (!rejectionReason.trim()) {
          setActionError('Please explain what needs correction');
          setActionSubmitting(false);
          return;
        }
        await adminReviewPaymentApi(selectedRegId, {
          action: 'REQUEST_RESUBMISSION',
          rejectionReason,
          notes: adminNotes,
        });
      } else if (actionModal === 'APPROVE_REG') {
        await adminReviewRegistrationApi(selectedRegId, {
          action: 'APPROVE',
          notes: adminNotes,
        });
      } else if (actionModal === 'REJECT_REG') {
        if (!rejectionReason.trim()) {
          setActionError('Please provide a rejection reason');
          setActionSubmitting(false);
          return;
        }
        await adminReviewRegistrationApi(selectedRegId, {
          action: 'REJECT',
          rejectionReason,
          notes: adminNotes,
        });
      }

      setActionModal(null);
      // Reload modal details and registrations list
      const updated = await adminGetRegistrationDetailsApi(selectedRegId);
      if (updated?.data) setReviewDetails(updated.data);
      fetchRegistrations();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      setActionError(msg);
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleSaveFeeSettings = async (e) => {
    e.preventDefault();
    setFeeSubmitting(true);
    setFeeSuccess('');
    try {
      await adminUpdateFeeSettingsApi(feeSettings);
      setFeeSuccess('Registration fee settings updated and audited successfully.');
    } catch (err) {
      console.error('Failed to update fee settings:', err);
    } finally {
      setFeeSubmitting(false);
    }
  };

  const handleDownloadSlip = async (regId, regNumber) => {
    try {
      const blob = await downloadDelegateSlipByIdApi(regId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ICOSST-2026-Slip-${regNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not download slip. Ensure registration is approved.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'VERIFIED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'UNDER_REVIEW':
      case 'PENDING_VERIFICATION':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300';
      case 'PENDING_PAYMENT':
      case 'NOT_SUBMITTED':
      case 'RESUBMISSION_REQUESTED':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Participant Registrations & Payment Approval Center
            </h1>
            <Badge variant="uet">ADMIN BACK-OFFICE</Badge>
          </div>
          <p className="text-xs text-slate-500">
            Audit, verify bank deposit proofs, and issue verified gate passes for ICOSST 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchRegistrations}
            disabled={loading}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Total Registrations</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                {metrics.total}
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {metrics.approved} Officially Approved
              </span>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Pending Verifications</p>
              <h3 className="text-2xl font-extrabold text-amber-600 font-heading mt-1">
                {metrics.paymentSubmitted}
              </h3>
              <span className="text-[10px] text-amber-600 font-semibold">Bank receipts awaiting review</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Verified Revenue</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                PKR {metrics.totalRevenue?.toLocaleString()}
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold">Audited Bank Settlements</span>
            </div>
            <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Awaiting Settlement</p>
              <h3 className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 font-heading mt-1">
                {metrics.pendingPayment}
              </h3>
              <span className="text-[10px] text-slate-500">Unsubmitted payment proofs</span>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'ALL', label: 'All Registrations' },
            { id: 'VERIFICATION', label: `Pending Payments (${metrics.paymentSubmitted})` },
            { id: 'APPROVED', label: `Approved Participants (${metrics.approved})` },
            { id: 'PENDING', label: 'Unpaid / Awaiting Transfer' },
            { id: 'REJECTED', label: 'Rejected Queue' },
            { id: 'REPORTS', label: 'Registration Reports' },
            { id: 'SETTINGS', label: 'Registration Fee Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Filter */}
        {activeTab !== 'SETTINGS' && activeTab !== 'REPORTS' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, reg ID..."
              className="text-xs h-9 pl-8"
            />
          </div>
        )}
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'SETTINGS' ? (
        /* Registration Fee Settings Tab */
        <Card className="max-w-3xl border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-600" />
              Administrative Registration Fee Settings
            </CardTitle>
            <CardDescription className="text-xs">
              Configure baseline rates for conference admission tiers and official banquet dinner.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {feeSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {feeSuccess}
              </div>
            )}

            <form onSubmit={handleSaveFeeSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    IEEE Member / Student Tier
                  </h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      In-Person Physical Attendance (PKR)
                    </label>
                    <Input
                      type="number"
                      value={feeSettings.ieeeStudentPhysical}
                      onChange={(e) =>
                        setFeeSettings({ ...feeSettings, ieeeStudentPhysical: Number(e.target.value) })
                      }
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Virtual Attendance (PKR)
                    </label>
                    <Input
                      type="number"
                      value={feeSettings.ieeeStudentVirtual}
                      onChange={(e) =>
                        setFeeSettings({ ...feeSettings, ieeeStudentVirtual: Number(e.target.value) })
                      }
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Non-IEEE Member / Professional Tier
                  </h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      In-Person Physical Attendance (PKR)
                    </label>
                    <Input
                      type="number"
                      value={feeSettings.nonIeeeProfessionalPhysical}
                      onChange={(e) =>
                        setFeeSettings({
                          ...feeSettings,
                          nonIeeeProfessionalPhysical: Number(e.target.value),
                        })
                      }
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Virtual Attendance (PKR)
                    </label>
                    <Input
                      type="number"
                      value={feeSettings.nonIeeeProfessionalVirtual}
                      onChange={(e) =>
                        setFeeSettings({
                          ...feeSettings,
                          nonIeeeProfessionalVirtual: Number(e.target.value),
                        })
                      }
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 max-w-sm">
                <label className="block font-bold text-amber-900 dark:text-amber-200 text-xs mb-1">
                  Conference Gala Dinner Additional Fee (PKR)
                </label>
                <Input
                  type="number"
                  value={feeSettings.dinnerFee}
                  onChange={(e) =>
                    setFeeSettings({ ...feeSettings, dinnerFee: Number(e.target.value) })
                  }
                  className="text-xs h-9 font-mono bg-white dark:bg-slate-900 border-amber-300"
                />
              </div>

              <Button
                type="submit"
                disabled={feeSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 gap-1.5"
              >
                {feeSubmitting ? 'Saving...' : 'Save & Publish Fee Configuration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : activeTab === 'REPORTS' ? (
        /* Reports & Analytics Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Registration Completion Rate</h4>
              <p className="text-2xl font-black mt-2 text-slate-900 dark:text-white">
                {metrics.total > 0 ? `${Math.round((metrics.approved / metrics.total) * 100)}%` : '0%'}
              </p>
              <span className="text-[10px] text-slate-500">Approved vs Total Started</span>
            </Card>

            <Card className="p-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Average Fee Settled</h4>
              <p className="text-2xl font-black mt-2 text-slate-900 dark:text-white">
                PKR {metrics.approved > 0 ? Math.round(metrics.totalRevenue / metrics.approved).toLocaleString() : '0'}
              </p>
              <span className="text-[10px] text-slate-500">Per verified delegate</span>
            </Card>

            <Card className="p-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Pending Finance Queue</h4>
              <p className="text-2xl font-black mt-2 text-amber-600">
                {metrics.paymentSubmitted} Requests
              </p>
              <span className="text-[10px] text-slate-500">Awaiting officer reconciliation</span>
            </Card>
          </div>
        </div>
      ) : (
        /* Requests Table Tab */
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Reg ID</th>
                  <th className="py-3 px-4">Participant & Affiliation</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Payable</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4">Payment Ref</th>
                  <th className="py-3 px-4">Receipt</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Reg Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {registrations.length > 0 ? (
                  registrations.map((reg) => {
                    const pay = reg.paymentSubmission;
                    return (
                      <tr
                        key={reg._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {reg.registrationNumber}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {reg.fullName}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                            {reg.email} • {reg.organization}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                            {reg.participantCategory === 'IEEE_MEMBER_STUDENT'
                              ? 'IEEE Member / Student'
                              : 'Professional'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {reg.attendanceMode} {reg.attendDinner ? '• Dinner' : ''}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                          PKR {reg.totalFee?.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-emerald-700 dark:text-emerald-400">
                          {pay ? `PKR ${pay.amountPaid?.toLocaleString()}` : '—'}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {pay?.transactionReference || '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          {pay?.receiptFile?.url ? (
                            <a
                              href={pay.receiptFile.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-600 font-bold inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </a>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant="outline"
                            className={`text-[9px] font-bold ${getStatusColor(reg.paymentStatus)}`}
                          >
                            {reg.paymentStatus?.replaceAll('_', ' ')}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant="outline"
                            className={`text-[9px] font-bold ${getStatusColor(reg.registrationStatus)}`}
                          >
                            {reg.registrationStatus?.replaceAll('_', ' ')}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => openReviewModal(reg._id)}
                              className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] h-7 px-2.5 font-bold"
                            >
                              Review
                            </Button>
                            {reg.registrationStatus === 'APPROVED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadSlip(reg._id, reg.registrationNumber)}
                                title="Download Slip"
                                className="h-7 w-7 p-0"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-slate-500 text-xs">
                      {loading ? 'Loading registrations...' : 'No participant registrations match current filter.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Review Payment & Approval Modal */}
      {selectedRegId && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-heading">
                    Review Payment & Registration Clearance
                  </h3>
                  {reviewDetails?.registration?.registrationNumber && (
                    <Badge variant="uet">
                      {reviewDetails.registration.registrationNumber}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Verify transaction reference against bank statement before issuing pass.
                </p>
              </div>

              <button
                onClick={() => setSelectedRegId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {reviewLoading || !reviewDetails ? (
                <div className="p-12 text-center text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Loading participant record and audit timeline...
                </div>
              ) : (
                <>
                  {/* Action Banner / Prompt Form if an action is currently selected */}
                  {actionModal && (
                    <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          {actionModal === 'APPROVE_PAYMENT' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {actionModal === 'REJECT_PAYMENT' && <XCircle className="w-4 h-4 text-rose-600" />}
                          {actionModal === 'RESUBMIT_PAYMENT' && <RotateCcw className="w-4 h-4 text-amber-600" />}
                          {actionModal === 'APPROVE_REG' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                          {actionModal === 'REJECT_REG' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                          Confirm Action: {actionModal.replaceAll('_', ' ')}
                        </h4>
                        <button onClick={() => setActionModal(null)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {actionError && (
                        <div className="p-2.5 bg-rose-50 text-rose-800 rounded text-[11px] font-semibold">
                          {actionError}
                        </div>
                      )}

                      {(actionModal === 'REJECT_PAYMENT' ||
                        actionModal === 'RESUBMIT_PAYMENT' ||
                        actionModal === 'REJECT_REG') && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Reason / Instructions for Participant *
                          </label>
                          <Input
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g. Deposit slip reference blurred or amount does not match total payable."
                            className="text-xs h-9 bg-white dark:bg-slate-900"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Internal Admin Remarks (Optional audit memo)
                        </label>
                        <Input
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Internal memo / bank branch verified"
                          className="text-xs h-9 bg-white dark:bg-slate-900"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActionModal(null)}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleExecuteAction}
                          disabled={actionSubmitting}
                          className={`text-xs font-bold text-white ${
                            actionModal.includes('REJECT')
                              ? 'bg-rose-600 hover:bg-rose-500'
                              : 'bg-emerald-600 hover:bg-emerald-500'
                          }`}
                        >
                          {actionSubmitting ? 'Processing...' : 'Confirm & Execute'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 2-Column Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left: Participant & Registration */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                        Participant & Affiliation
                      </h4>
                      <div className="space-y-1.5">
                        <p><strong className="text-slate-500">Name:</strong> {reviewDetails.registration.fullName}</p>
                        <p><strong className="text-slate-500">Email:</strong> {reviewDetails.registration.email}</p>
                        <p><strong className="text-slate-500">Phone:</strong> {reviewDetails.registration.phone}</p>
                        <p><strong className="text-slate-500">Institution:</strong> {reviewDetails.registration.organization}</p>
                        <p>
                          <strong className="text-slate-500">Category:</strong>{' '}
                          {reviewDetails.registration.participantCategory === 'IEEE_MEMBER_STUDENT'
                            ? 'IEEE Member / Student'
                            : 'Non-IEEE Member / Professional'}
                        </p>
                        <p>
                          <strong className="text-slate-500">IEEE Member:</strong>{' '}
                          {reviewDetails.registration.isIeeeMember
                            ? `Yes (${reviewDetails.registration.ieeeMembershipNumber || 'Verified'})`
                            : 'No'}
                        </p>
                        <p><strong className="text-slate-500">Attendance:</strong> {reviewDetails.registration.attendanceMode}</p>
                        <p>
                          <strong className="text-slate-500">Gala Dinner:</strong>{' '}
                          {reviewDetails.registration.attendDinner ? 'Included (+ PKR 5,000)' : 'Not Included'}
                        </p>
                        <p>
                          <strong className="text-slate-500">Total Payable:</strong>{' '}
                          <span className="font-bold text-slate-900 dark:text-white">
                            PKR {reviewDetails.registration.totalFee?.toLocaleString()}
                          </span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Enrolled Activities:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {reviewDetails.registration.selectedActivities?.map((act, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">
                              {act}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Submitted Payment & Receipt File */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                          Payment Submission Evidence
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold ${getStatusColor(reviewDetails.registration.paymentStatus)}`}
                        >
                          {reviewDetails.registration.paymentStatus?.replaceAll('_', ' ')}
                        </Badge>
                      </div>

                      {reviewDetails.paymentSubmission ? (
                        <div className="space-y-2">
                          <p>
                            <strong className="text-slate-500">Transaction Ref:</strong>{' '}
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {reviewDetails.paymentSubmission.transactionReference}
                            </span>
                          </p>
                          <p>
                            <strong className="text-slate-500">Amount Paid:</strong>{' '}
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                              PKR {reviewDetails.paymentSubmission.amountPaid?.toLocaleString()}
                            </span>
                          </p>
                          <p>
                            <strong className="text-slate-500">Payment Date:</strong>{' '}
                            {new Date(reviewDetails.paymentSubmission.paymentDate).toLocaleDateString()}
                          </p>

                          {/* Receipt File Preview */}
                          <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                            {reviewDetails.paymentSubmission.receiptFile?.url ? (
                              <div className="space-y-2">
                                {reviewDetails.paymentSubmission.receiptFile.mimetype?.includes('pdf') ? (
                                  <div className="p-4 text-center">
                                    <FileText className="w-10 h-10 text-emerald-600 mx-auto mb-1" />
                                    <p className="text-[11px] font-bold">PDF Deposit Slip</p>
                                    <a
                                      href={reviewDetails.paymentSubmission.receiptFile.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-700 underline text-[11px] font-semibold"
                                    >
                                      Open PDF Document
                                    </a>
                                  </div>
                                ) : (
                                  <a
                                    href={reviewDetails.paymentSubmission.receiptFile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={reviewDetails.paymentSubmission.receiptFile.url}
                                      alt="Bank Receipt"
                                      className="max-h-48 mx-auto object-contain rounded border"
                                    />
                                    <span className="text-[10px] text-slate-400 block mt-1">
                                      Click to view full-resolution proof
                                    </span>
                                  </a>
                                )}
                              </div>
                            ) : (
                              <p className="text-slate-400 text-xs">No receipt file uploaded.</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-400 text-xs">
                          Participant has not submitted payment proof yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Previous Payment Attempts if any */}
                  {reviewDetails.paymentSubmission?.attempts?.length > 0 && (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase">
                        Previous Payment Attempts ({reviewDetails.paymentSubmission.attempts.length})
                      </h4>
                      <div className="space-y-2">
                        {reviewDetails.paymentSubmission.attempts.map((att, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] flex items-center justify-between"
                          >
                            <div>
                              <span className="font-mono font-bold">{att.transactionReference}</span> •{' '}
                              <span>PKR {att.amountPaid?.toLocaleString()}</span> •{' '}
                              <span className="text-slate-400">{new Date(att.submittedAt).toLocaleDateString()}</span>
                              {att.rejectionReason && (
                                <p className="text-rose-600 font-semibold mt-0.5">
                                  Reason: {att.rejectionReason}
                                </p>
                              )}
                            </div>
                            {att.receiptFile?.url && (
                              <a
                                href={att.receiptFile.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 underline text-xs font-semibold"
                              >
                                View Past Slip
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audit History Timeline */}
                  {reviewDetails.approvalHistory?.length > 0 && (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase">
                        Audit Trail & History
                      </h4>
                      <div className="space-y-1.5">
                        {reviewDetails.approvalHistory.map((h, i) => (
                          <div
                            key={i}
                            className="p-2 bg-slate-50 dark:bg-slate-800 rounded flex items-center justify-between text-[11px]"
                          >
                            <div>
                              <strong className="text-slate-800 dark:text-slate-200">{h.action}</strong>{' '}
                              <span className="text-slate-400">by {h.actorRole || 'system'}</span>
                              {h.reason && <p className="text-slate-500 mt-0.5">{h.reason}</p>}
                            </div>
                            <span className="text-slate-400 text-[10px]">
                              {new Date(h.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Actions Footer */}
            {reviewDetails && !reviewLoading && (
              <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-semibold">Current State:</span>
                  <Badge variant="outline" className={getStatusColor(reviewDetails.registration.registrationStatus)}>
                    {reviewDetails.registration.registrationStatus}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Payment Actions */}
                  {reviewDetails.registration.paymentStatus !== 'VERIFIED' &&
                    reviewDetails.paymentSubmission && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setActionModal('APPROVE_PAYMENT')}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Payment
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActionModal('RESUBMIT_PAYMENT')}
                          className="border-amber-300 text-amber-800 hover:bg-amber-50 text-xs gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Request Resubmission
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActionModal('REJECT_PAYMENT')}
                          className="border-rose-300 text-rose-800 hover:bg-rose-50 text-xs gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" /> Reject Payment
                        </Button>
                      </>
                    )}

                  {/* Registration Approval Actions */}
                  {reviewDetails.registration.registrationStatus !== 'APPROVED' && (
                    <Button
                      size="sm"
                      onClick={() => setActionModal('APPROVE_REG')}
                      disabled={reviewDetails.registration.paymentStatus !== 'VERIFIED'}
                      title={
                        reviewDetails.registration.paymentStatus !== 'VERIFIED'
                          ? 'Payment must be verified first'
                          : 'Approve and activate gate pass'
                      }
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Approve Registration
                    </Button>
                  )}

                  {reviewDetails.registration.registrationStatus !== 'REJECTED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActionModal('REJECT_REG')}
                      className="border-rose-400 text-rose-800 text-xs gap-1.5"
                    >
                      Reject Registration
                    </Button>
                  )}

                  {reviewDetails.registration.registrationStatus === 'APPROVED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleDownloadSlip(
                          reviewDetails.registration._id,
                          reviewDetails.registration.registrationNumber
                        )
                      }
                      className="text-xs font-bold gap-1.5 border-emerald-600 text-emerald-800"
                    >
                      <Download className="w-3.5 h-3.5" /> Delegate Slip
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
