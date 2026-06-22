import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface Course {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  instructor: string;
  instructor_bio?: string;
  price: number;
  thumbnail_url?: string;
  duration_hours: number;
  lessons_count: number;
  students_enrolled: number;
  rating: number;
  is_active: boolean;
  is_featured: boolean;
  language: string;
  skills: string[];
  prerequisites: string[];
  requirements: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CourseListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  level?: string;
  is_active?: boolean;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface CreateCourseData {
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  category: string;
  level: string;
  instructor: string;
  price: number;
  duration_hours: number;
  lessons_count: number;
  language?: string;
  skills?: string[];
  prerequisites?: string[];
  requirements?: string[];
  tags?: string[];
  is_featured?: boolean;
  thumbnail_url?: string;
}

const mockCourses: Course[] = [
  {
    id: '1', uuid: 'cr001', title: 'Full-Stack Web Development', slug: 'full-stack-web-dev',
    description: 'A comprehensive course covering modern web development from frontend to backend. You will learn HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. Build real-world projects including an e-commerce platform, a social media dashboard, and a RESTful API. By the end, you will be job-ready as a full-stack developer.',
    short_description: 'Master React, Node.js, MongoDB and build production-ready applications.',
    category: 'Technology', level: 'beginner', instructor: 'Alex Rivera', instructor_bio: 'Senior full-stack engineer with 10+ years of experience.',
    price: 89.99, thumbnail_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    duration_hours: 48, lessons_count: 120, students_enrolled: 2340, rating: 4.8,
    is_active: true, is_featured: true, language: 'English',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'REST APIs'],
    prerequisites: ['Basic HTML & CSS knowledge'], requirements: ['A computer with internet access'],
    tags: ['web', 'javascript', 'full-stack', 'react', 'node'],
    created_at: '2025-11-01', updated_at: '2026-06-13',
  },
  {
    id: '2', uuid: 'cr002', title: 'Data Science & Machine Learning', slug: 'data-science-ml',
    description: 'Dive into the world of data science. Learn Python, pandas, NumPy, matplotlib, scikit-learn, and TensorFlow. Work with real datasets, build predictive models, and deploy machine learning solutions. Includes a capstone project on predictive analytics.',
    short_description: 'Python, ML algorithms, and data visualization with hands-on projects.',
    category: 'Technology', level: 'intermediate', instructor: 'Dr. Maya Patel', instructor_bio: 'PhD in Computer Science, AI researcher.',
    price: 129.99, thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    duration_hours: 60, lessons_count: 150, students_enrolled: 1820, rating: 4.7,
    is_active: true, is_featured: false, language: 'English',
    skills: ['Python', 'TensorFlow', 'scikit-learn', 'Data Visualization', 'Statistics'],
    prerequisites: ['Basic Python knowledge', 'High school math'],
    requirements: ['Python 3.8+ installed', '8GB+ RAM recommended'],
    tags: ['python', 'data-science', 'machine-learning', 'ai'],
    created_at: '2025-12-01', updated_at: '2026-06-10',
  },
  {
    id: '3', uuid: 'cr003', title: 'UI/UX Design Masterclass', slug: 'ui-ux-design-masterclass',
    description: 'Learn the art and science of user interface and user experience design. Covering Figma, design principles, wireframing, prototyping, user research, and usability testing. Create a complete portfolio project from scratch.',
    short_description: 'Figma, design thinking, prototyping, and portfolio building.',
    category: 'Design', level: 'beginner', instructor: 'Sophie Laurent', instructor_bio: 'Lead product designer at a top SaaS company.',
    price: 59.99, thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    duration_hours: 30, lessons_count: 75, students_enrolled: 3100, rating: 4.9,
    is_active: true, is_featured: true, language: 'English',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
    prerequisites: ['No prior design experience needed'],
    requirements: ['Figma (free tier)', 'Notebook for sketching'],
    tags: ['design', 'ui', 'ux', 'figma', 'prototyping'],
    created_at: '2026-01-15', updated_at: '2026-06-12',
  },
  {
    id: '4', uuid: 'cr004', title: 'Business Strategy & Management', slug: 'business-strategy',
    description: 'Develop strategic thinking and management skills. Covers competitive analysis, business modeling, financial planning, marketing strategy, and organizational leadership. Case studies from Fortune 500 companies.',
    short_description: 'Strategic planning, financial modeling, and leadership skills.',
    category: 'Business', level: 'intermediate', instructor: 'Mark Thompson', instructor_bio: 'MBA from Harvard, former McKinsey consultant.',
    price: 74.99, thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    duration_hours: 35, lessons_count: 85, students_enrolled: 1250, rating: 4.5,
    is_active: true, is_featured: false, language: 'English',
    skills: ['Business Strategy', 'Financial Analysis', 'Marketing', 'Leadership', 'Operations'],
    prerequisites: ['Basic business understanding'],
    requirements: ['None'],
    tags: ['business', 'management', 'strategy', 'leadership'],
    created_at: '2026-02-01', updated_at: '2026-06-08',
  },
  {
    id: '5', uuid: 'cr005', title: 'Digital Marketing & SEO', slug: 'digital-marketing-seo',
    description: 'Master digital marketing channels including SEO, SEM, social media marketing, email marketing, and content strategy. Learn Google Analytics, Ads, and HubSpot. Drive traffic and conversions.',
    short_description: 'SEO, Google Ads, social media, and content marketing mastery.',
    category: 'Marketing', level: 'beginner', instructor: 'Jessica Kim', instructor_bio: 'Digital marketing director with 8+ years experience.',
    price: 44.99, thumbnail_url: 'https://images.unsplash.com/photo-1432889821006-3149403b3f1a?w=400&h=225&fit=crop',
    duration_hours: 25, lessons_count: 60, students_enrolled: 2800, rating: 4.6,
    is_active: true, is_featured: true, language: 'English',
    skills: ['SEO', 'Google Ads', 'Content Marketing', 'Analytics', 'Social Media'],
    prerequisites: ['Basic internet skills'],
    requirements: ['Google Analytics account (free)'],
    tags: ['marketing', 'seo', 'digital', 'social-media'],
    created_at: '2026-01-20', updated_at: '2026-06-11',
  },
  {
    id: '6', uuid: 'cr006', title: 'Advanced React & Next.js', slug: 'advanced-react-nextjs',
    description: 'Deep dive into modern React patterns, server-side rendering, static generation, API routes, authentication, and deployment with Next.js 14. Build a production-grade SaaS application.',
    short_description: 'Server components, SSR, ISR, auth, and deployment with Next.js.',
    category: 'Technology', level: 'advanced', instructor: 'Alex Rivera', instructor_bio: 'Senior full-stack engineer with 10+ years of experience.',
    price: 99.99, thumbnail_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=225&fit=crop',
    duration_hours: 40, lessons_count: 95, students_enrolled: 890, rating: 4.8,
    is_active: true, is_featured: false, language: 'English',
    skills: ['Next.js', 'React', 'TypeScript', 'Prisma', 'Deployment'],
    prerequisites: ['Solid React knowledge', 'TypeScript basics'],
    requirements: ['Node.js 18+ installed'],
    tags: ['react', 'nextjs', 'typescript', 'full-stack'],
    created_at: '2026-03-01', updated_at: '2026-06-09',
  },
  {
    id: '7', uuid: 'cr007', title: 'Creative Writing Workshop', slug: 'creative-writing',
    description: 'Unlock your creative potential. Learn narrative structure, character development, dialogue writing, and publishing. Write your first short story or novel chapter with peer feedback.',
    short_description: 'Storytelling, character development, and narrative techniques.',
    category: 'Arts', level: 'beginner', instructor: 'Elena Torres', instructor_bio: 'Published author and creative writing professor.',
    price: 34.99, thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=225&fit=crop',
    duration_hours: 20, lessons_count: 48, students_enrolled: 1560, rating: 4.7,
    is_active: false, is_featured: false, language: 'English',
    skills: ['Creative Writing', 'Editing', 'Storytelling', 'Publishing'],
    prerequisites: ['Love for writing'],
    requirements: ['A notebook or word processor'],
    tags: ['writing', 'creative', 'storytelling'],
    created_at: '2026-04-01', updated_at: '2026-05-30',
  },
  {
    id: '8', uuid: 'cr008', title: 'Cloud Computing with AWS', slug: 'cloud-computing-aws',
    description: 'Learn cloud computing fundamentals and AWS services including EC2, S3, Lambda, DynamoDB, and CloudFormation. Prepare for the AWS Solutions Architect certification.',
    short_description: 'AWS services, cloud architecture, and certification prep.',
    category: 'Technology', level: 'intermediate', instructor: 'Raj Mehta', instructor_bio: 'AWS Solutions Architect certified, cloud consultant.',
    price: 109.99, thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    duration_hours: 45, lessons_count: 110, students_enrolled: 1450, rating: 4.6,
    is_active: true, is_featured: true, language: 'English',
    skills: ['AWS', 'Cloud Architecture', 'DevOps', 'Terraform', 'Docker'],
    prerequisites: ['Basic IT knowledge', 'Command line experience'],
    requirements: ['AWS free tier account'],
    tags: ['aws', 'cloud', 'devops', 'infrastructure'],
    created_at: '2026-02-15', updated_at: '2026-06-07',
  },
  {
    id: '9', uuid: 'cr009', title: 'Photography & Photo Editing', slug: 'photography-editing',
    description: 'From camera basics to advanced editing in Lightroom and Photoshop. Learn composition, lighting, portrait, landscape, and editing workflows. Build a professional portfolio.',
    short_description: 'Camera skills, composition, Lightroom, and Photoshop editing.',
    category: 'Arts', level: 'beginner', instructor: 'David Chen', instructor_bio: 'Professional photographer with National Geographic features.',
    price: 49.99, thumbnail_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=225&fit=crop',
    duration_hours: 28, lessons_count: 65, students_enrolled: 2100, rating: 4.8,
    is_active: true, is_featured: false, language: 'English',
    skills: ['Photography', 'Lightroom', 'Photoshop', 'Composition', 'Editing'],
    prerequisites: ['Any camera (including smartphone)'],
    requirements: ['Lightroom (free trial)'],
    tags: ['photography', 'editing', 'creative'],
    created_at: '2026-03-10', updated_at: '2026-06-06',
  },
  {
    id: '10', uuid: 'cr010', title: 'Personal Finance & Investing', slug: 'personal-finance',
    description: 'Take control of your finances. Learn budgeting, saving, investing in stocks and ETFs, retirement planning, and tax optimization. Build wealth with confidence.',
    short_description: 'Budgeting, investing, retirement planning, and wealth building.',
    category: 'Business', level: 'beginner', instructor: 'Mark Thompson', instructor_bio: 'MBA from Harvard, former McKinsey consultant.',
    price: 39.99, thumbnail_url: 'https://images.unsplash.com/photo-1565514020179-026b92b2a32a?w=400&h=225&fit=crop',
    duration_hours: 18, lessons_count: 42, students_enrolled: 3800, rating: 4.9,
    is_active: true, is_featured: true, language: 'English',
    skills: ['Budgeting', 'Investing', 'Retirement Planning', 'Tax Strategy'],
    prerequisites: ['No financial knowledge required'],
    requirements: ['A notebook'],
    tags: ['finance', 'investing', 'personal-development'],
    created_at: '2026-01-05', updated_at: '2026-06-13',
  },
];

export const categoryLabels: Record<string, string> = {
  Technology: 'Technology',
  Design: 'Design',
  Business: 'Business',
  Marketing: 'Marketing',
  Arts: 'Arts',
  Science: 'Science',
  Health: 'Health & Fitness',
  Music: 'Music',
};

export const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  'all-levels': 'All Levels',
};

export const courseService = {
  getAll: async (params?: CourseListParams): Promise<PaginatedResponse<Course>> => {
    await new Promise((r) => setTimeout(r, 200));
    let filtered = [...mockCourses];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)
      );
    }
    if (params?.category && params.category !== 'all') filtered = filtered.filter((c) => c.category === params.category);
    if (params?.level && params.level !== 'all') filtered = filtered.filter((c) => c.level === params.level);
    if (params?.is_active !== undefined) filtered = filtered.filter((c) => c.is_active === params.is_active);

    if (params?.sort) {
      filtered.sort((a, b) => {
        const dir = params.direction === 'desc' ? -1 : 1;
        switch (params.sort) {
          case 'title': return a.title.localeCompare(b.title) * dir;
          case 'rating': return (a.rating - b.rating) * dir;
          case 'students_enrolled': return (a.students_enrolled - b.students_enrolled) * dir;
          case 'price': return (a.price - b.price) * dir;
          default: return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * dir;
        }
      });
    }

    const perPage = params?.per_page || 15;
    const page = params?.page || 1;
    const total = filtered.length;
    const start = (page - 1) * perPage;
    const data = filtered.slice(start, start + perPage);

    return {
      success: true, message: 'Courses retrieved successfully', data,
      meta: { current_page: page, from: start + 1, last_page: Math.ceil(total / perPage), path: '/courses', per_page: perPage, to: start + data.length, total },
    };
  },

  getByUuid: async (uuid: string): Promise<ApiResponse<Course>> => {
    await new Promise((r) => setTimeout(r, 150));
    const course = mockCourses.find((c) => c.uuid === uuid);
    return { success: true, message: 'Course retrieved successfully', data: course || ({} as Course) };
  },

  create: async (data: CreateCourseData): Promise<ApiResponse<Course>> => {
    await new Promise((r) => setTimeout(r, 300));
    const newCourse: Course = {
      id: String(mockCourses.length + 1),
      uuid: `cr${String(mockCourses.length + 1).padStart(3, '0')}`,
      ...data,
      students_enrolled: 0,
      rating: 0,
      is_active: true,
      is_featured: data.is_featured ?? false,
      instructor_bio: '',
      description: data.description || '',
      level: (data.level || 'beginner') as Course['level'],
      language: data.language || 'English',
      skills: data.skills || [],
      prerequisites: data.prerequisites || [],
      requirements: data.requirements || [],
      tags: data.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockCourses.push(newCourse);
    return { success: true, message: 'Course created successfully', data: newCourse };
  },

  update: async (uuid: string, data: Partial<Course>): Promise<ApiResponse<Course>> => {
    await new Promise((r) => setTimeout(r, 300));
    const idx = mockCourses.findIndex((c) => c.uuid === uuid);
    if (idx >= 0) {
      mockCourses[idx] = { ...mockCourses[idx], ...data, updated_at: new Date().toISOString() };
    }
    return { success: true, message: 'Course updated successfully', data: mockCourses[idx] };
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = mockCourses.findIndex((c) => c.uuid === uuid);
    if (idx >= 0) mockCourses.splice(idx, 1);
    return { success: true, message: 'Course deleted successfully', data: null };
  },

  toggleActive: async (uuid: string): Promise<ApiResponse<Course>> => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = mockCourses.findIndex((c) => c.uuid === uuid);
    if (idx >= 0) {
      mockCourses[idx].is_active = !mockCourses[idx].is_active;
      mockCourses[idx].updated_at = new Date().toISOString();
    }
    return { success: true, message: 'Course status toggled', data: mockCourses[idx] };
  },
};

export const instructors = [...new Set(mockCourses.map((c) => c.instructor))].sort();
