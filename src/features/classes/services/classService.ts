import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface ClassItem {
  id: string;
  uuid: string;
  title: string;
  description: string;
  category: 'math' | 'science' | 'language' | 'arts' | 'technology' | 'business' | 'health' | 'music';
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  status: 'active' | 'inactive' | 'draft' | 'archived';
  instructor: string;
  instructor_avatar?: string;
  duration_minutes: number;
  lessons_count: number;
  students_enrolled: number;
  rating: number;
  price: number;
  thumbnail_url?: string;
  video_url?: string;
  tags: string[];
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ClassListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  level?: string;
  status?: string;
  instructor?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

const mockClasses: ClassItem[] = [
  {
    id: '1', uuid: 'c001', title: 'Introduction to Algebra', description: 'Master the fundamentals of algebra including linear equations, quadratic functions, and polynomial operations. Perfect for high school students and adult learners looking to build a strong mathematical foundation.', category: 'math', level: 'beginner', status: 'active',
    instructor: 'Dr. Sarah Chen', instructor_avatar: '', duration_minutes: 45, lessons_count: 24, students_enrolled: 156, rating: 4.7, price: 49.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['algebra', 'math', 'foundations'], start_date: '2026-01-15', end_date: '2026-04-15', created_at: '2025-12-01', updated_at: '2026-06-10',
  },
  {
    id: '2', uuid: 'c002', title: 'Advanced Calculus', description: 'Deep dive into differential and integral calculus, multivariable analysis, and real-world applications in physics and engineering.', category: 'math', level: 'advanced', status: 'active',
    instructor: 'Dr. Sarah Chen', duration_minutes: 60, lessons_count: 36, students_enrolled: 89, rating: 4.5, price: 79.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['calculus', 'advanced', 'math'], start_date: '2026-02-01', end_date: '2026-06-01', created_at: '2026-01-10', updated_at: '2026-06-08',
  },
  {
    id: '3', uuid: 'c003', title: 'Physics Fundamentals', description: 'Explore the basic principles of physics including mechanics, thermodynamics, and wave theory with hands-on virtual experiments.', category: 'science', level: 'beginner', status: 'active',
    instructor: 'Prof. James Wilson', duration_minutes: 50, lessons_count: 28, students_enrolled: 210, rating: 4.8, price: 59.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['physics', 'science', 'mechanics'], start_date: '2026-01-20', created_at: '2025-12-15', updated_at: '2026-06-12',
  },
  {
    id: '4', uuid: 'c004', title: 'Organic Chemistry', description: 'A comprehensive study of carbon-based compounds, reaction mechanisms, and spectroscopy techniques for college-level students.', category: 'science', level: 'intermediate', status: 'active',
    instructor: 'Dr. Emily Park', duration_minutes: 55, lessons_count: 32, students_enrolled: 134, rating: 4.6, price: 69.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['chemistry', 'organic', 'science'], start_date: '2026-03-01', end_date: '2026-07-01', created_at: '2026-02-01', updated_at: '2026-06-05',
  },
  {
    id: '5', uuid: 'c005', title: 'Spanish for Beginners', description: 'Learn conversational Spanish from scratch. Covers greetings, everyday vocabulary, basic grammar, and cultural insights.', category: 'language', level: 'beginner', status: 'active',
    instructor: 'Maria Gonzalez', duration_minutes: 30, lessons_count: 40, students_enrolled: 320, rating: 4.9, price: 39.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1546410531-og42a4b1c381?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['spanish', 'language', 'conversational'], start_date: '2026-01-10', created_at: '2025-12-20', updated_at: '2026-06-11',
  },
  {
    id: '6', uuid: 'c006', title: 'English Academic Writing', description: 'Develop advanced writing skills for academic contexts including essays, research papers, and thesis writing with peer review.', category: 'language', level: 'advanced', status: 'active',
    instructor: 'Prof. James Wilson', duration_minutes: 45, lessons_count: 20, students_enrolled: 98, rating: 4.4, price: 54.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['writing', 'academic', 'english'], start_date: '2026-02-15', end_date: '2026-05-15', created_at: '2026-01-20', updated_at: '2026-05-30',
  },
  {
    id: '7', uuid: 'c007', title: 'Digital Painting & Illustration', description: 'Unlock your creative potential with digital art. Learn Procreate, Photoshop techniques, color theory, and composition.', category: 'arts', level: 'beginner', status: 'draft',
    instructor: 'Anna Kowalski', duration_minutes: 40, lessons_count: 18, students_enrolled: 0, rating: 0, price: 44.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=225&fit=crop',
    tags: ['art', 'digital', 'illustration'], start_date: '2026-07-01', created_at: '2026-05-15', updated_at: '2026-05-15',
  },
  {
    id: '8', uuid: 'c008', title: 'Web Development Bootcamp', description: 'Build modern web applications from scratch. Covers HTML, CSS, JavaScript, React, Node.js, and deployment. Project-based learning.', category: 'technology', level: 'beginner', status: 'active',
    instructor: 'Alex Rivera', duration_minutes: 60, lessons_count: 60, students_enrolled: 450, rating: 4.8, price: 99.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['web', 'javascript', 'react', 'full-stack'], start_date: '2026-01-05', created_at: '2025-11-01', updated_at: '2026-06-13',
  },
  {
    id: '9', uuid: 'c009', title: 'Data Science with Python', description: 'Learn data analysis, visualization, and machine learning with Python. Includes pandas, matplotlib, scikit-learn, and real datasets.', category: 'technology', level: 'intermediate', status: 'active',
    instructor: 'Alex Rivera', duration_minutes: 55, lessons_count: 42, students_enrolled: 275, rating: 4.7, price: 89.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['python', 'data-science', 'machine-learning'], start_date: '2026-02-10', end_date: '2026-06-15', created_at: '2026-01-05', updated_at: '2026-06-09',
  },
  {
    id: '10', uuid: 'c010', title: 'Entrepreneurship 101', description: 'Turn your business idea into reality. Covers business planning, marketing, funding, legal structures, and scaling strategies.', category: 'business', level: 'beginner', status: 'active',
    instructor: 'Mark Thompson', duration_minutes: 35, lessons_count: 22, students_enrolled: 189, rating: 4.6, price: 49.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['business', 'entrepreneurship', 'startup'], start_date: '2026-03-01', created_at: '2026-02-01', updated_at: '2026-06-07',
  },
  {
    id: '11', uuid: 'c011', title: 'Yoga & Mindfulness', description: 'Improve flexibility, strength, and mental clarity with guided yoga sessions and meditation practices for all fitness levels.', category: 'health', level: 'all-levels', status: 'active',
    instructor: 'Lily Nakamura', duration_minutes: 25, lessons_count: 30, students_enrolled: 510, rating: 4.9, price: 29.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['yoga', 'mindfulness', 'wellness'], start_date: '2026-01-01', created_at: '2025-12-01', updated_at: '2026-06-12',
  },
  {
    id: '12', uuid: 'c012', title: 'Piano for Beginners', description: 'Learn to play piano from zero. Covers notes, chords, rhythm, reading sheet music, and playing your favorite songs.', category: 'music', level: 'beginner', status: 'active',
    instructor: 'David Kim', duration_minutes: 30, lessons_count: 36, students_enrolled: 198, rating: 4.5, price: 59.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['piano', 'music', 'beginner'], start_date: '2026-02-01', created_at: '2026-01-10', updated_at: '2026-06-06',
  },
  {
    id: '13', uuid: 'c013', title: 'Machine Learning A-Z', description: 'Comprehensive machine learning course covering supervised and unsupervised learning, neural networks, and deployment.', category: 'technology', level: 'advanced', status: 'inactive',
    instructor: 'Alex Rivera', duration_minutes: 65, lessons_count: 48, students_enrolled: 67, rating: 4.3, price: 129.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['machine-learning', 'ai', 'advanced'], start_date: '2025-09-01', end_date: '2026-03-01', created_at: '2025-08-01', updated_at: '2026-03-05',
  },
  {
    id: '14', uuid: 'c014', title: 'Introduction to Photoshop', description: 'Master Adobe Photoshop from scratch. Learn layers, masks, retouching, color grading, and graphic design fundamentals.', category: 'arts', level: 'beginner', status: 'active',
    instructor: 'Anna Kowalski', duration_minutes: 40, lessons_count: 25, students_enrolled: 167, rating: 4.6, price: 44.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tags: ['photoshop', 'design', 'graphic'], start_date: '2026-04-01', created_at: '2026-03-01', updated_at: '2026-06-04',
  },
  {
    id: '15', uuid: 'c015', title: 'Nutrition & Wellness Coaching', description: 'Evidence-based nutrition science, meal planning, gut health, and sustainable lifestyle changes for optimal wellbeing.', category: 'health', level: 'intermediate', status: 'draft',
    instructor: 'Lily Nakamura', duration_minutes: 30, lessons_count: 16, students_enrolled: 0, rating: 0, price: 39.99,
    thumbnail_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=225&fit=crop',
    tags: ['nutrition', 'health', 'wellness'], start_date: '2026-08-01', created_at: '2026-06-01', updated_at: '2026-06-01',
  },
];

export const categoryLabels: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  language: 'Languages',
  arts: 'Arts',
  technology: 'Technology',
  business: 'Business',
  health: 'Health & Fitness',
  music: 'Music',
};

export const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  'all-levels': 'All Levels',
};

export const statusLabels: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  draft: 'Draft',
  archived: 'Archived',
};

export const classService = {
  getAll: async (params?: ClassListParams): Promise<PaginatedResponse<ClassItem>> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 200));

    let filtered = [...mockClasses];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params?.category && params.category !== 'all') {
      filtered = filtered.filter((c) => c.category === params.category);
    }

    if (params?.level && params.level !== 'all') {
      filtered = filtered.filter((c) => c.level === params.level);
    }

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter((c) => c.status === params.status);
    }

    if (params?.instructor && params.instructor !== 'all') {
      filtered = filtered.filter((c) => c.instructor === params.instructor);
    }

    if (params?.sort) {
      filtered.sort((a, b) => {
        const dir = params.direction === 'desc' ? -1 : 1;
        switch (params.sort) {
          case 'title': return a.title.localeCompare(b.title) * dir;
          case 'rating': return (a.rating - b.rating) * dir;
          case 'students_enrolled': return (a.students_enrolled - b.students_enrolled) * dir;
          case 'price': return (a.price - b.price) * dir;
          case 'updated_at':
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
      success: true,
      message: 'Classes retrieved successfully',
      data,
      meta: {
        current_page: page,
        from: start + 1,
        last_page: Math.ceil(total / perPage),
        path: '/classes',
        per_page: perPage,
        to: start + data.length,
        total,
      },
    };
  },

  getByUuid: async (uuid: string): Promise<ApiResponse<ClassItem>> => {
    await new Promise((r) => setTimeout(r, 150));
    const cls = mockClasses.find((c) => c.uuid === uuid);
    return {
      success: true,
      message: 'Class retrieved successfully',
      data: cls || ({} as ClassItem),
    };
  },

  create: async (data: Partial<ClassItem>): Promise<ApiResponse<ClassItem>> => {
    await new Promise((r) => setTimeout(r, 300));
    const newClass: ClassItem = {
      id: String(mockClasses.length + 1),
      uuid: `c${String(mockClasses.length + 1).padStart(3, '0')}`,
      title: data.title || '',
      description: data.description || '',
      category: data.category || 'technology',
      level: data.level || 'beginner',
      status: data.status || 'draft',
      instructor: data.instructor || 'Admin',
      duration_minutes: data.duration_minutes || 30,
      lessons_count: data.lessons_count || 10,
      students_enrolled: 0,
      rating: 0,
      price: data.price || 0,
      tags: data.tags || [],
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { success: true, message: 'Class created successfully', data: newClass };
  },

  update: async (uuid: string, data: Partial<ClassItem>): Promise<ApiResponse<ClassItem>> => {
    await new Promise((r) => setTimeout(r, 300));
    const idx = mockClasses.findIndex((c) => c.uuid === uuid);
    const updated = { ...mockClasses[idx], ...data, updated_at: new Date().toISOString() };
    if (idx >= 0) mockClasses[idx] = updated;
    return { success: true, message: 'Class updated successfully', data: updated };
  },

  delete: async (uuid: string): Promise<ApiResponse> => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = mockClasses.findIndex((c) => c.uuid === uuid);
    if (idx >= 0) mockClasses.splice(idx, 1);
    return { success: true, message: 'Class deleted successfully', data: null };
  },
};

export const instructors = [...new Set(mockClasses.map((c) => c.instructor))].sort();
