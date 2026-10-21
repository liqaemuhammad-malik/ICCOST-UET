import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import * as authApi from '@/api/auth';
import * as regApi from '@/api/registration';
import { defaultSchedule } from '@/features/shared/scheduleData';
import { StepProgressIndicator } from './components/StepProgressIndicator';
import { ParticipationTypeCard } from './components/ParticipationTypeCard';
import { VisitorActivitySelector } from './components/VisitorActivitySelector';
import { PresenterCategorySelector } from './components/PresenterCategorySelector';
import { PersonalInformationForm } from './components/PersonalInformationForm';
import { ActivitySummarySidebar } from './components/ActivitySummarySidebar';
import { RegistrationSuccessStep } from './components/RegistrationSuccessStep';
import { findConflictingActivity } from './timeConflictEngine';
import { toast } from 'sonner';

export function RegistrationWizard() {
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse initial query params if user came with preselected events
  const query = new URLSearchParams(location.search);
  const initialEvents = query.get('events')
    ? query.get('events').split('|').filter(Boolean)
    : query.get('event')
      ? [query.get('event')]
      : [];

  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachableStep, setMaxReachableStep] = useState(1);
  const [participationType, setParticipationType] = useState('VISITOR'); // 'VISITOR' | 'PRESENTER'

  // Activity selections (array of activity IDs)
  const [selectedActivityIds, setSelectedActivityIds] = useState(
    initialEvents.length ? initialEvents : ['d1-opening']
  );

  // Presenter stream details
  const [presenterData, setPresenterData] = useState({
    stream: 'PAPER_PRESENTATION', // 'PAPER_PRESENTATION' | 'WORKSHOPS' | 'BRAINIAC_COMPETITION'
    backendCategory: 'PAPER_PRESENTER',
    paperId: '',
    paperTitle: '',
    track: 'AI & Machine Learning',
    teamName: '',
    projectTitle: '',
  });

  // Personal form data
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    organization: user?.profile?.institution || '',
    designation: user?.profile?.designation || '',
    country: 'Pakistan',
    city: 'Lahore',
    attendanceMode: 'PHYSICAL',
    participantCategory: 'IEEE_MEMBER_STUDENT',
    isIeeeMember: false,
    ieeeMembershipNumber: '',
    attendDinner: false,
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [completedRegistration, setCompletedRegistration] = useState(null);

  // Config data
  const [feeConfig, setFeeConfig] = useState({
    ieeeStudentPhysical: 1000,
    ieeeStudentVirtual: 1000,
    nonIeeeProfessionalPhysical: 2000,
    nonIeeeProfessionalVirtual: 2000,
    dinnerFee: 5000,
    currency: 'PKR',
  });

  const [bankDetails, setBankDetails] = useState({
    accountTitle: 'AL-KHAWARIZMI INSTITUTE OF COMPUTER SCIENCE UET LAHORE',
    iban: 'PK93UNIL0109000316984445',
    bankName: 'UNITED BANK LIMITED',
    swiftCode: 'UNILPKKA',
    branch: 'UBL UET BRANCH',
  });

  // Load fee and bank configuration
  useEffect(() => {
    regApi
      .getRegistrationConfigApi()
      .then((res) => {
        if (res.data?.feeSettings) setFeeConfig(res.data.feeSettings);
        if (res.data?.bankDetails) setBankDetails(res.data.bankDetails);
      })
      .catch(() => { });
  }, []);

  // Sync auth state if user signs in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: user.email || prev.email || '',
        organization: prev.organization || user.profile?.institution || '',
        phone: prev.phone || user.profile?.phone || '',
      }));
    }
  }, [user]);

  // Activity toggle handler
  const handleToggleActivity = (activity) => {
    const actId = activity.id || activity.title;
    setSelectedActivityIds((prev) =>
      prev.includes(actId) ? prev.filter((id) => id !== actId) : [...prev, actId]
    );
  };

  // Activity conflict resolution (switch from conflicting to candidate)
  const handleSwitchActivity = (candidate, conflicting) => {
    const candidateId = candidate.id || candidate.title;
    const conflictingId = conflicting.id || conflicting.title;

    setSelectedActivityIds((prev) => [
      ...prev.filter((id) => id !== conflictingId),
      candidateId,
    ]);

    toast.success(`Switched to "${candidate.title}"`);
  };

  // Field change handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Validate personal information form
  const validatePersonalInfo = () => {
    const errors = {};
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = 'Full Name is required (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone || formData.phone.trim().length < 7) {
      errors.phone = 'Valid contact phone number is required';
    }

    if (!formData.organization || formData.organization.trim().length < 2) {
      errors.organization = 'University or Organization name is required';
    }

    if (formData.isIeeeMember && (!formData.ieeeMembershipNumber || !formData.ieeeMembershipNumber.trim())) {
      errors.ieeeMembershipNumber = 'IEEE Membership Number is required when indicating IEEE membership';
    }

    // Passwords only required for unauthenticated users
    if (!isAuthenticated) {
      if (!formData.password || formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step advancement
  const goToStep = (stepNumber) => {
    if (stepNumber > currentStep) {
      if (currentStep === 2 && selectedActivityIds.length === 0) {
        toast.error('Please select at least one conference activity');
        return;
      }
      if (currentStep === 3 && !validatePersonalInfo()) {
        toast.error('Please complete required fields');
        return;
      }
    }
    setCurrentStep(stepNumber);
    setMaxReachableStep((prev) => Math.max(prev, stepNumber));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submission handler
  const handleFinalSubmit = async () => {
    setServerError('');
    setSubmitting(true);

    try {
      let activeUser = user;

      // 1. If user is NOT authenticated, register account first
      if (!isAuthenticated) {
        const userCategory =
          participationType === 'PRESENTER'
            ? presenterData.backendCategory || 'PAPER_PRESENTER'
            : 'ATTENDEE_PARTICIPANT';

        const registerRes = await authApi.registerApi({
          name: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          category: userCategory,
          institution: formData.organization.trim(),
        });

        if (registerRes.data?.user && registerRes.data?.accessToken) {
          setAuth(registerRes.data.user, registerRes.data.accessToken);
          activeUser = registerRes.data.user;
        } else {
          // Log in as fallback
          const loginRes = await authApi.loginApi({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          });
          setAuth(loginRes.data.user, loginRes.data.accessToken);
          activeUser = loginRes.data.user;
        }
      }

      // 2. Prepare conference registration payload
      const activityTitles = selectedActivityIds.map((id) => {
        const act = defaultSchedule.find((item) => item.id === id || item.title === id);
        return act ? act.title : id;
      });

      const registrationPayload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim(),
        isIeeeMember: !!formData.isIeeeMember,
        ieeeMembershipNumber: formData.isIeeeMember ? formData.ieeeMembershipNumber?.trim() : '',
        participantCategory: formData.participantCategory || 'IEEE_MEMBER_STUDENT',
        attendanceMode: formData.attendanceMode || 'PHYSICAL',
        selectedActivities: activityTitles,
        attendDinner: !!formData.attendDinner,
      };

      // 3. Submit registration to existing backend API
      const regRes = await regApi.createOrUpdateRegistrationApi(registrationPayload);

      setCompletedRegistration(regRes.data);
      setCurrentStep(4);
      toast.success('Registration submitted successfully!');
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Registration submission failed. Please verify your details.';

      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-b from-slate-50 via-emerald-50/15 to-slate-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Conference Heade  r Card */}
        <div className="text-center mb-8 max-w-3xl mx-auto space-y-3">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            20th IEEE ICOSST 2026 • 22–23 December 2026 • UET Lahore
          </div> */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Conference Registration Portal
          </h1>
        </div>

        {/* Progress Stepper */}
        <div className="mb-10 max-w-4xl mx-auto">
          <StepProgressIndicator
            currentStep={currentStep}
            maxReachableStep={maxReachableStep}
            onStepClick={goToStep}
          />
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
          {/* Main Wizard Step Panel */}
          <main className="flex-1 min-w-0 w-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 p-6 sm:p-9 shadow-md">
            {/* STEP 1: Participation Type */}
            {currentStep === 1 && (
              <ParticipationTypeCard
                selectedType={participationType}
                onSelectType={setParticipationType}
                onContinue={() => goToStep(2)}
              />
            )}

            {/* STEP 2: Activity Selection (Visitor vs Presenter) */}
            {currentStep === 2 && (
              <>
                {participationType === 'VISITOR' ? (
                  <VisitorActivitySelector
                    selectedActivityIds={selectedActivityIds}
                    onToggleActivity={handleToggleActivity}
                    onSwitchActivity={handleSwitchActivity}
                    onBack={() => goToStep(1)}
                    onContinue={() => goToStep(3)}
                    feeConfig={feeConfig}
                    formData={formData}
                    currentUser={user}
                  />
                ) : (
                  <PresenterCategorySelector
                    presenterData={presenterData}
                    onChangePresenterData={setPresenterData}
                    selectedActivityIds={selectedActivityIds}
                    onToggleActivity={handleToggleActivity}
                    onBack={() => goToStep(1)}
                    onContinue={() => goToStep(3)}
                  />
                )}
              </>
            )}

            {/* STEP 3: Personal Information & Submission */}
            {currentStep === 3 && (
              <PersonalInformationForm
                formData={formData}
                onChangeField={handleFieldChange}
                errors={formErrors}
                serverError={serverError}
                submitting={submitting}
                currentUser={user}
                onBack={() => goToStep(2)}
                onContinue={() => {
                  if (validatePersonalInfo()) {
                    handleFinalSubmit();
                  } else {
                    toast.error('Please complete required fields');
                  }
                }}
              />
            )}

            {/* STEP 4: Success / Confirmation */}
            {currentStep === 4 && (
              <RegistrationSuccessStep
                registration={completedRegistration}
                bankDetails={bankDetails}
              />
            )}
          </main>

          {/* Right Summary Sidebar (Visible on Step 3 Personal Details) */}
          {currentStep === 3 && (
            <ActivitySummarySidebar
              participationType={participationType}
              selectedActivityIds={selectedActivityIds}
              presenterData={presenterData}
              formData={formData}
              currentStep={currentStep}
              feeConfig={feeConfig}
              canContinue={!submitting}
              continueText={submitting ? 'Submitting...' : 'Confirm & Submit Registration'}
              onContinue={() => {
                if (validatePersonalInfo()) handleFinalSubmit();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
