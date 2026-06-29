import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Tag,
  Megaphone,
  BarChart3,
  GraduationCap,
  FolderOpen,
  Bot,
  BookOpen,
  UserCog,
  Shield,
  KeyRound,
  UserCheck,
  BookMarked,
  Library,
  FileText,
  Video,
  SlidersHorizontal,
  Palette,
  Globe,
  Mail,
  Bell,
  Webhook,
  HardDrive,
  Cpu,
  Cloud,
  Activity,
  ToggleLeft,
  Wallet,
  ScrollText,
  LogIn,
  Headphones,
  type LucideIcon,
} from 'lucide-react';

export interface SearchItem {
  label: string;
  href: string;
  icon: LucideIcon;
  category: string;
  description?: string;
  keywords?: string[];
}

export const searchIndex: SearchItem[] = [
  // Main navigation
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Main', description: 'Platform overview and key metrics', keywords: ['home', 'overview', 'stats'] },
  { label: 'Tenants', href: '/tenants', icon: Building2, category: 'Main', description: 'Manage tenant organizations', keywords: ['organizations', 'clients', 'companies'] },
  { label: 'Plans', href: '/plans', icon: CreditCard, category: 'Main', description: 'Subscription plans and pricing', keywords: ['pricing', 'tiers', 'packages'] },
  { label: 'Subscriptions', href: '/subscriptions', icon: Users, category: 'Main', description: 'Manage user subscriptions', keywords: ['billing', 'active'] },
  { label: 'Coupons', href: '/coupons', icon: Tag, category: 'Main', description: 'Discount coupons and promotions', keywords: ['discount', 'promo', 'voucher'] },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone, category: 'Main', description: 'Marketing campaigns', keywords: ['marketing', 'promotions'] },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, category: 'Main', description: 'Platform analytics and reports', keywords: ['reports', 'statistics', 'metrics'] },
  { label: 'Support', href: '/support', icon: Headphones, category: 'Main', description: 'Support tickets and conversations', keywords: ['help', 'tickets', 'chat'] },

  // Learning
  { label: 'Learners', href: '/learners', icon: GraduationCap, category: 'Learning', description: 'Manage platform learners', keywords: ['students', 'enrollments'] },
  { label: 'All Courses', href: '/courses', icon: Library, category: 'Learning', description: 'Browse and manage courses', keywords: ['classes', 'training'] },
  { label: 'Course Categories', href: '/courses/categories', icon: BookMarked, category: 'Learning', description: 'Organize courses by category', keywords: ['tags', 'subcategories'] },
  { label: 'Modules', href: '/courses/modules', icon: BookMarked, category: 'Learning', description: 'Course module management', keywords: ['lessons', 'units'] },
  { label: 'Assignments', href: '/courses/assignments', icon: FileText, category: 'Learning', description: 'Course assignments and tasks', keywords: ['homework', 'tasks', 'exercises'] },
  { label: 'Recording', href: '/courses/recording', icon: Video, category: 'Learning', description: 'Manage course recordings', keywords: ['videos', 'lectures'] },
  { label: 'Course Assets', href: '/courses/assets', icon: FolderOpen, category: 'Learning', description: 'Course media and documents', keywords: ['files', 'media', 'resources'] },

  // Classes
  { label: 'All Classes', href: '/classes', icon: BookOpen, category: 'Classes', description: 'View all scheduled classes', keywords: ['sessions', 'schedule'] },
  { label: 'Previous Classes', href: '/classes/previous', icon: BookOpen, category: 'Classes', description: 'Past class sessions', keywords: ['past', 'history', 'completed'] },
  { label: 'Running Classes', href: '/classes/running', icon: BookOpen, category: 'Classes', description: 'Currently active classes', keywords: ['live', 'active', 'ongoing'] },

  // Assets
  { label: 'Assets', href: '/assets', icon: FolderOpen, category: 'Assets', description: 'Media assets and file library', keywords: ['files', 'media', 'documents', 'uploads'] },

  // AI
  { label: 'Manage AI', href: '', icon: Bot, category: 'AI', description: 'AI configuration and management', keywords: ['artificial intelligence', 'ml', 'models'] },

  // User Management
  { label: 'Users', href: '/users', icon: UserCheck, category: 'User Management', description: 'Manage system users', keywords: ['accounts', 'people'] },
  { label: 'Roles', href: '/roles', icon: KeyRound, category: 'User Management', description: 'User roles and permissions', keywords: ['permissions', 'access'] },
  { label: 'Permissions', href: '/permissions', icon: Shield, category: 'User Management', description: 'Fine-grained permission control', keywords: ['access control', 'acl'] },

  // Audit
  { label: 'Login Audit', href: '/audit/login', icon: LogIn, category: 'Audit', description: 'Monitor login attempts and activity', keywords: ['security', 'auth', 'login history'] },

  // Profile & Settings
  { label: 'Profile Settings', href: '/profile', icon: UserCog, category: 'Settings', description: 'Edit your profile and preferences', keywords: ['account', 'personal'] },
  { label: 'General Settings', href: '/settings/general', icon: SlidersHorizontal, category: 'Settings', description: 'Platform-wide settings', keywords: ['platform', 'basic'] },
  { label: 'Theme & Branding', href: '/settings/theme', icon: Palette, category: 'Settings', description: 'Customize appearance and branding', keywords: ['appearance', 'colors', 'logo', 'skin'] },
  { label: 'Region Settings', href: '/settings/region', icon: Globe, category: 'Settings', description: 'Regional and localization settings', keywords: ['locale', 'timezone', 'language'] },
  { label: 'Email Settings', href: '/settings/email', icon: Mail, category: 'Settings', description: 'Email configuration and templates', keywords: ['smtp', 'mail', 'notifications'] },
  { label: 'Notifications', href: '/settings/notifications', icon: Bell, category: 'Settings', description: 'Configure notification preferences', keywords: ['alerts', 'push'] },
  { label: 'Integrations', href: '/settings/integrations', icon: Webhook, category: 'Settings', description: 'Third-party integrations and APIs', keywords: ['api', 'webhook', 'connect'] },
  { label: 'Storage & CDN', href: '/settings/storage', icon: HardDrive, category: 'Settings', description: 'Storage drivers and CDN configuration', keywords: ['uploads', 's3', 'cloud'] },
  { label: 'System Settings', href: '/settings/system', icon: Cpu, category: 'Settings', description: 'System-level configuration', keywords: ['system', 'performance'] },
  { label: 'Environment Settings', href: '/settings/environment', icon: Cloud, category: 'Settings', description: 'Environment and deployment settings', keywords: ['env', 'deployment', 'config'] },
  { label: 'Security & Compliance', href: '/settings/security', icon: Shield, category: 'Settings', description: 'Security policies and compliance', keywords: ['password', '2fa', 'mfa', 'encryption'] },
  { label: 'Logs & Monitoring', href: '/settings/logs', icon: Activity, category: 'Settings', description: 'System logs and monitoring', keywords: ['audit', 'logs', 'monitoring', 'debug'] },
  { label: 'Tenant Defaults', href: '/settings/tenant-defaults', icon: Building2, category: 'Settings', description: 'Default settings for new tenants', keywords: ['defaults', 'templates'] },
  { label: 'Feature Toggles', href: '/settings/features', icon: ToggleLeft, category: 'Settings', description: 'Enable or disable platform features', keywords: ['flags', 'features'] },
  { label: 'Payment Settings', href: '/settings/payment', icon: Wallet, category: 'Settings', description: 'Payment gateway configuration', keywords: ['stripe', 'paypal', 'billing', 'checkout'] },
];

export const searchCategories = [
  'Main',
  'Learning',
  'Classes',
  'Assets',
  'AI',
  'User Management',
  'Audit',
  'Settings',
] as const;
