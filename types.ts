// types.ts

export type LocalizedString = {
  ar: string;
  fr: string;
};

export enum UserRole {
  INVESTOR = 'INVESTOR',
  PROJECT_OWNER = 'PROJECT_OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  VALIDATOR_ADMIN = 'VALIDATOR_ADMIN',
  FINANCIAL_ADMIN = 'FINANCIAL_ADMIN',
  SERVICE_ADMIN = 'SERVICE_ADMIN',
}

export enum KYCStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum ProjectStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  FUNDED = 'FUNDED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  DRAFT = 'DRAFT',
}

export enum ProjectStage {
  IDEA = 'IDEA',
  GROWTH = 'GROWTH',
}

export enum MilestoneStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
}

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    INVESTMENT = 'INVESTMENT',
    REFUND = 'REFUND',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
}

export enum ServiceStatus {
  PENDING = 'PENDING',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export interface Service {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  price: number;
  deliveryTimeDays: number;
  icon: string; // Material symbols icon name
}

export interface ServiceRequest {
  id: string;
  userId: string;
  serviceId: string;
  status: ServiceStatus;
  requestDate: Date;
  completionDate?: Date;
}


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  phoneVerified?: boolean;
  kycStatus: KYCStatus;
  createdAt: Date;
  profilePictureUrl?: string;
  bio?: string;
  city?: string;
  address?: string;
  bankInfo?: {
    rib: string;
    bankName: string;
  };
}

export interface RoadmapMilestone {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  targetDate: Date;
  status: MilestoneStatus;
}

export interface FinancialRecord {
  year: number;
  revenue: number;
  profit: number;
}

export interface Project {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  category: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  startDate: Date;
  deadline: Date;
  minimumInvestment: number;
  equityOffered: number; // Percentage of profit offered to investors
  status: ProjectStatus;
  stage: ProjectStage; // New field to distinguish project type
  owner: User;
  imageUrl: string;
  supervisorId?: string;
  businessPlanUrl?: string;
  roadmap?: RoadmapMilestone[];
  financials?: FinancialRecord[]; // Optional historical financial data
}

export interface Wallet {
    id: string;
    userId: string;
    balance: number;
}

export interface Transaction {
    id: string;
    walletId: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: Date;
    status: 'Completed' | 'Pending' | 'Failed';
}

export interface Investment {
    id: string;
    userId: string;
    projectId: string;
    amount: number;
    date: Date;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  rib: string;
  bankName: string;
  status: WithdrawalStatus;
  requestDate: Date;
  decisionDate?: Date;
  adminNotes?: string;
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  submittedAt: Date;
  status: ReportStatus;
  publishedAt?: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socials: {
    linkedin: string;
    twitter: string;
  };
}

export interface FooterLink {
  id: string;
  text: LocalizedString;
  url: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface PaymentGatewaySettings {
  activeGateway: 'cmi' | 'stripe' | 'paypal' | 'cih';
  cmi: {
    merchantId: string;
    accessKey: string;
  };
  stripe: {
    publicKey: string;
    secretKey: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
  };
  cih: {
    merchantId: string;
    apiKey: string;
  };
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroImageUrl: string;
  heroButton1Text: LocalizedString;
  heroButton1Url: string;
  heroButton2Text: LocalizedString;
  heroButton2Url: string;
  teamSectionTitle: LocalizedString;
  teamSectionDescription: LocalizedString;
  teamMembers: TeamMember[];
  servicesPageTitle: LocalizedString;
  servicesPageDescription: LocalizedString;
  footer: {
    description: LocalizedString;
    navigationLinks: FooterLink[];
    legalLinks: FooterLink[];
    socials: SocialLinks;
  };
  // SEO Fields
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  faviconUrl: string;
  // Maintenance Mode Fields
  maintenanceModeEnabled: boolean;
  maintenanceModeMessage: string;
  // Integrations
  integrations: {
    googleAnalyticsId: string;
    paymentGateway: PaymentGatewaySettings;
    emailService: {
      apiKey: string;
      senderEmail: string;
    };
    cloudStorage: {
      accessKeyId: string;
      secretAccessKey: string;
      bucketName: string;
      region: string;
    };
  };
  // Notification Toggles
  notifications: {
    user: {
      onProjectApproved: boolean;
      onKycRejected: boolean;
      onNewInvestment: boolean;
    };
    admin: {
      onNewProjectPending: boolean;
      onNewUserRegistered: boolean;
    };
  };
  // System Settings
  systemSettings: {
    transactions: {
      platformFeePercentage: number;
      minDeposit: number;
      maxDeposit: number;
      passFeesToUser: boolean;
    };
    projects: {
      defaultCampaignDurationDays: number;
      minFundingGoal: number;
      maxFundingGoal: number;
      autoRefundOnFailure: boolean;
    };
    security: {
      passwordMinLength: number;
      passwordRequiresNumber: boolean;
      passwordRequiresSymbol: boolean;
      sessionDurationMinutes: number;
      twoFactorAuthEnabled: boolean;
    };
    performance: {
      cacheDurationMinutes: number;
      enableImageOptimization: boolean;
    };
  };
}