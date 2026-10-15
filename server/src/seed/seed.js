import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../modules/users/user.model.js';
import { Profile } from '../modules/users/profile.model.js';
import { ParticipantCategory } from '../modules/categories/category.model.js';
import { SystemSetting } from '../modules/settings/setting.model.js';
import { ROLES, PARTICIPANT_CATEGORIES, ACTIVITY_TYPES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export async function runSeed() {
  logger.info('Starting ICOSST 2026 platform database seeding...');
  await connectDB();

  // 1. Seed the 7 User-Defined Participant Categories
  logger.info('Seeding ICOSST 2026 Participant Categories with dynamic field schemas...');
  const categoriesData = [
    {
      code: PARTICIPANT_CATEGORIES.ATTENDEE_PARTICIPANT,
      name: 'Attendee / Participant',
      description: 'General conference attendee, faculty, and student delegates joining keynote sessions, tracks, and exhibition.',
      requiresApproval: false,
      requiresInvitation: false,
      allowedActivityTypes: [
        ACTIVITY_TYPES.KEYNOTE,
        ACTIVITY_TYPES.TECHNICAL_SESSION,
        ACTIVITY_TYPES.CEREMONY,
      ],
      badgeColor: '#0b4f35', // UET Emerald Green
      requiredProfileFields: [
        {
          fieldName: 'institution',
          label: 'University / Organization Name',
          type: 'text',
          required: true,
          placeholder: 'e.g. UET Lahore, NUST, FAST-NUCES, Systems Ltd',
        },
        {
          fieldName: 'studentOrEmployeeId',
          label: 'Student Roll No / Employee ID',
          type: 'text',
          required: false,
          placeholder: 'e.g. 2022-CS-101',
        },
      ],
    },
    {
      code: PARTICIPANT_CATEGORIES.ORGANIZER,
      name: 'Organizer',
      description: 'KICS and UET Lahore organizing committee member, track chair, operations and session coordinator.',
      requiresApproval: false,
      requiresInvitation: false,
      allowedActivityTypes: Object.values(ACTIVITY_TYPES),
      badgeColor: '#0f172a', // Midnight Navy
      requiredProfileFields: [
        {
          fieldName: 'institution',
          label: 'Organizing Committee / Faculty Department',
          type: 'text',
          required: true,
          placeholder: 'e.g. KICS Operations Committee, Dept. of Computer Science',
        },
        {
          fieldName: 'designation',
          label: 'Committee Role / Designation',
          type: 'text',
          required: true,
          placeholder: 'e.g. Technical Program Coordinator, Logistics Chair',
        },
      ],
    },
    {
      code: PARTICIPANT_CATEGORIES.WORKSHOP_PRESENTER,
      name: 'Workshop Presenter',
      description: 'Hands-on technical workshop instructor conducting specialized technical lab sessions.',
      requiresApproval: false,
      requiresInvitation: false,
      allowedActivityTypes: [ACTIVITY_TYPES.WORKSHOP, ACTIVITY_TYPES.KEYNOTE],
      badgeColor: '#7c3aed', // Purple
      requiredProfileFields: [
        {
          fieldName: 'institution',
          label: 'Company / Research Lab',
          type: 'text',
          required: true,
          placeholder: 'e.g. Red Hat, Google Cloud, KICS AI Lab',
        },
        {
          fieldName: 'designation',
          label: 'Technical Designation',
          type: 'text',
          required: true,
          placeholder: 'e.g. Lead Architect, Senior ML Specialist',
        },
      ],
    },
    {
      code: PARTICIPANT_CATEGORIES.MEDIA_PERSON,
      name: 'Media Person',
      description: 'Journalist, press reporter, and media correspondent covering conference ceremonies and keynotes.',
      requiresApproval: false,
      requiresInvitation: false,
      allowedActivityTypes: [ACTIVITY_TYPES.KEYNOTE, ACTIVITY_TYPES.CEREMONY],
      badgeColor: '#0369a1', // Sky Blue
      requiredProfileFields: [
        {
          fieldName: 'institution',
          label: 'Press / Media Outlet Name',
          type: 'text',
          required: true,
          placeholder: 'e.g. Dawn News, Express Tribune, TechJuice, PTV',
        },
        {
          fieldName: 'studentOrEmployeeId',
          label: 'Press Card / Media Accreditation ID',
          type: 'text',
          required: true,
          placeholder: 'e.g. PRESS-2026-908',
        },
      ],
    },
    {
      code: PARTICIPANT_CATEGORIES.INVITED_SPEAKER,
      name: 'Invited Speaker',
      description: 'Distinguished international keynote speaker, foreign dignitary, and panelist.',
      requiresApproval: false,
      requiresInvitation: true,
      allowedActivityTypes: Object.values(ACTIVITY_TYPES),
      badgeColor: '#be123c', // Crimson
      requiredProfileFields: [
        {
          fieldName: 'institution',
          label: 'Affiliated University / Enterprise',
          type: 'text',
          required: true,
          placeholder: 'e.g. Stanford University, MIT, Open Source Initiative',
        },
        {
          fieldName: 'designation',
          label: 'Title / Honorific',
          type: 'text',
          required: true,
          placeholder: 'e.g. Professor & Chair, Chief Open Source Evangelist',
        },
      ],
    },
    {
      code: PARTICIPANT_CATEGORIES.PRESENTER_CO_PRESENTER,
      name: 'Presenter & Co-Presenter',
      description: 'Conference presentation author and co-author delivering technical paper or poster talks.',
      requiresApproval: false,
      requiresInvitation: false,
      allowedActivityTypes: [ACTIVITY_TYPES.TECHNICAL_SESSION, ACTIVITY_TYPES.KEYNOTE],
      badgeColor: '#b45309', // Amber
      requiredProfileFields: [
        {
          fieldName: 'institution',
          label: 'Affiliated University / Research Center',
          type: 'text',
          required: true,
          placeholder: 'e.g. UET Lahore, LUMS, NUST',
        },
      ],
    },
    {
      code: PARTICIPANT_CATEGORIES.PAPER_PRESENTER,
      name: 'Paper Presenter',
      description: 'Primary author presenting peer-reviewed research papers in technical tracks.',
      requiresApproval: false,
      requiresInvitation: false,
      allowedActivityTypes: [ACTIVITY_TYPES.TECHNICAL_SESSION, ACTIVITY_TYPES.KEYNOTE],
      badgeColor: '#059669', // Emerald
      requiredProfileFields: [
        {
          fieldName: 'institution',
          label: 'University / Institute Name',
          type: 'text',
          required: true,
          placeholder: 'e.g. UET Lahore, FAST Islamabad, COMSATS',
        },
      ],
    },
  ];

  for (const cat of categoriesData) {
    await ParticipantCategory.findOneAndUpdate({ code: cat.code }, cat, { upsert: true, new: true });
  }

  // 2. Seed System Settings
  logger.info('Seeding configurable System Settings...');
  const settingsData = [
    {
      key: 'EVENT_DETAILS',
      value: {
        title: '20th IEEE ICOSST 2026',
        subtitle: 'International Conference on Open Source Systems & Technologies',
        dates: '22–23 December 2026',
        venue: 'KICS Seminar Complex, UET Lahore',
        address: 'GT Road, Lahore, Pakistan',
        description: 'Join researchers, professionals, students, and technology leaders for two days of ideas, innovation, and collaboration.',
        email: 'icosst@kics.edu.pk',
        phone: '+92 (42) 99029450',
        registrationDeadline: '2026-12-15T23:59:59+05:00',
      },
      description: 'Public event details displayed across login and registration pages.',
    },
    {
      key: 'EVENT_SCHEDULE',
      value: [
        { day: 'Day 1', date: '22 December 2026', time: '09:00–10:00', title: 'Opening Ceremony & Keynote', venue: 'KICS Main Auditorium', speaker: 'ICOSST Steering Committee', description: '' },
        { day: 'Day 1', date: '22 December 2026', time: '10:30–12:00', title: 'Technical Track Sessions', venue: 'Session Hall A', speaker: '', description: '' },
        { day: 'Day 2', date: '23 December 2026', time: '09:30–11:00', title: 'Research Presentations', venue: 'Session Hall B', speaker: '', description: '' },
      ],
      description: 'Published conference events, sessions, speakers, and venues.',
    },
    {
      key: 'HOLD_EXPIRY_MINUTES',
      value: 15,
      description: 'Minutes before an unpaid seat hold automatically expires and is released or offered to waitlist',
    },
    {
      key: 'ENABLE_WAITLIST',
      value: true,
      description: 'Allow participants to join waitlist queue when activity reaches 100% capacity',
    },
    {
      key: 'TAX_PERCENTAGE',
      value: 0,
      description: 'Applicable sales/services tax percentage (configurable by finance)',
    },
    {
      key: 'TAX_TYPE',
      value: 'EXCLUSIVE',
      description: 'Whether tax is INCLUSIVE or EXCLUSIVE in displayed amounts',
    },
    {
      key: 'CONFIRMATION_MODE',
      value: 'PAYMENT_AND_APPROVAL',
      description: 'Instant confirmation vs. requiring both verified payment and reviewer approvals',
    },
    {
      key: 'BUFFER_MINUTES_BETWEEN_SESSIONS',
      value: 15,
      description: 'Mandatory transit buffer between consecutive activity enrollments to prevent schedule clashes',
    },
    {
      key: 'OFFICIAL_FEES_APPROVED',
      value: true,
      description: 'Flag indicating whether official ICOSST 2026 fee structure has been approved by the steering committee',
    },
    {
      key: 'BANK_TRANSFER_DETAILS',
      value: {
        accountTitle: 'AL-KHAWARIZMI INSTITUTE OF COMPUTER SCIENCE UET LAHORE',
        iban: 'PK93UNIL0109000316984445',
        bankName: 'UNITED BANK LIMITED',
        swiftCode: 'UNILPKKA',
        branch: 'UBL UET BRANCH',
        branchCode: '1950',
        branchAddress: 'MAIN GT ROAD UET LAHORE',
        instructions: 'Please transfer the exact payable amount to the official ICOSST account and upload the transaction receipt/screenshot for finance verification.',
      },
      description: 'Official bank transfer deposit credentials verified for ICOSST 2026.',
    },
    {
      key: 'REGISTRATION_FEE_SETTINGS',
      value: {
        currency: 'PKR',
        ieeeStudentPhysical: 1000,
        ieeeStudentVirtual: 1000,
        nonIeeeProfessionalPhysical: 2000,
        nonIeeeProfessionalVirtual: 2000,
        dinnerFee: 5000,
      },
      description: 'Official tier rates for IEEE Students, Professionals, and Gala Dinner.',
    },
  ];

  for (const set of settingsData) {
    await SystemSetting.findOneAndUpdate({ key: set.key }, set, { upsert: true, new: true });
  }

  // 3. Seed Users for Every User Category and Admin
  logger.info('Seeding dedicated users for each category + Admin...');
  const usersToSeed = [
    {
      name: 'Engr. Haris Khan',
      email: 'attendee@example.com',
      password: 'Participant@2026',
      role: ROLES.PARTICIPANT,
      category: PARTICIPANT_CATEGORIES.ATTENDEE_PARTICIPANT,
      institution: 'UET Lahore (Main Campus)',
    },
    {
      name: 'Dr. Waqas Ahmad (KICS Organizing Chair)',
      email: 'organizer@icosst.kics.edu.pk',
      password: 'Staff@icosst2026',
      role: ROLES.ORGANIZER,
      category: PARTICIPANT_CATEGORIES.ORGANIZER,
      institution: 'KICS, UET Lahore',
    },
    {
      name: 'Kamran Siddique (Cloud Workshop Lead)',
      email: 'workshop@icosst.kics.edu.pk',
      password: 'Presenter@2026',
      role: ROLES.PARTICIPANT,
      category: PARTICIPANT_CATEGORIES.WORKSHOP_PRESENTER,
      institution: 'Red Hat Open Source Cloud Lab',
    },
    {
      name: 'Ayesha Malik (Tech Correspondent)',
      email: 'media@icosst.kics.edu.pk',
      password: 'Media@2026',
      role: ROLES.PARTICIPANT,
      category: PARTICIPANT_CATEGORIES.MEDIA_PERSON,
      institution: 'Dawn Media Group',
    },
    {
      name: 'Prof. Dr. David Miller (Keynote Delegate)',
      email: 'speaker@icosst.kics.edu.pk',
      password: 'Speaker@2026',
      role: ROLES.PARTICIPANT,
      category: PARTICIPANT_CATEGORIES.INVITED_SPEAKER,
      institution: 'Open Source Security Foundation (OSSF)',
    },
    {
      name: 'Zainab Fatima (Co-Presenter)',
      email: 'presenter@icosst.kics.edu.pk',
      password: 'Presenter@2026',
      role: ROLES.PARTICIPANT,
      category: PARTICIPANT_CATEGORIES.PRESENTER_CO_PRESENTER,
      institution: 'NUST School of Electrical Engineering & CS',
    },
    {
      name: 'Bilal Hussain (Paper Presenter)',
      email: 'paper@icosst.kics.edu.pk',
      password: 'Paper@2026',
      role: ROLES.PARTICIPANT,
      category: PARTICIPANT_CATEGORIES.PAPER_PRESENTER,
      institution: 'FAST-NUCES Lahore',
    },
    {
      name: 'ICOSST Conference Super Admin',
      email: 'admin@icosst.kics.edu.pk',
      password: 'Admin@icosst2026',
      role: ROLES.SUPER_ADMIN,
      category: PARTICIPANT_CATEGORIES.ORGANIZER,
      institution: 'KICS Secretariat, UET Lahore',
    },
  ];

  for (const u of usersToSeed) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      user = new User({
        name: u.name,
        email: u.email,
        passwordHash: u.password,
        role: u.role,
        category: u.category,
        isEmailVerified: true,
      });
      await user.save();
    } else {
      user.name = u.name;
      user.role = u.role;
      user.category = u.category;
      user.isEmailVerified = true;
      user.passwordHash = u.password;
      await user.save();
    }

    await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        categoryCode: u.category,
        institution: u.institution,
        isProfileCompleted: true,
      },
      { upsert: true }
    );
  }

  logger.info('Database seeding completed successfully for all 7 categories and Admin!');
}

// Allow direct CLI invocation
if (process.argv[1]?.includes('seed.js')) {
  runSeed()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      logger.error({ err }, 'Seed execution failed');
      process.exit(1);
    });
}
