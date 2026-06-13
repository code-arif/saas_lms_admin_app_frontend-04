import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

export interface Asset {
  id: string;
  uuid: string;
  name: string;
  type: 'pdf' | 'video' | 'image' | 'doc' | 'docx' | 'xlsx' | 'pptx' | 'zip' | 'audio' | 'txt' | 'link' | 'other';
  mime_type: string;
  size: number;
  thumbnail_url?: string;
  uploaded_by: string;
  uploaded_at: string;
  updated_at: string;
  folder: string;
  description?: string;
}

export interface AssetListParams {
  page?: number;
  per_page?: number;
  search?: string;
  type?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

const mockAssets: Asset[] = [
  { id: '1', uuid: 'a1b2c3d4', name: 'Course Syllabus 2026.pdf', type: 'pdf', mime_type: 'application/pdf', size: 2_400_000, uploaded_by: 'Admin', uploaded_at: '2026-06-10T10:00:00Z', updated_at: '2026-06-10T10:00:00Z', folder: 'Documents' },
  { id: '2', uuid: 'b2c3d4e5', name: 'Introduction to Algebra - Lesson 1.mp4', type: 'video', mime_type: 'video/mp4', size: 156_000_000, uploaded_by: 'Instructor A', uploaded_at: '2026-06-09T14:30:00Z', updated_at: '2026-06-09T14:30:00Z', folder: 'Videos' },
  { id: '3', uuid: 'c3d4e5f6', name: 'Student Handbook 2026.docx', type: 'docx', mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 850_000, uploaded_by: 'Admin', uploaded_at: '2026-06-08T09:00:00Z', updated_at: '2026-06-08T09:00:00Z', folder: 'Documents' },
  { id: '4', uuid: 'd4e5f6g7', name: 'Q2 Progress Report.xlsx', type: 'xlsx', mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1_200_000, uploaded_by: 'Finance', uploaded_at: '2026-06-07T11:00:00Z', updated_at: '2026-06-07T11:00:00Z', folder: 'Reports' },
  { id: '5', uuid: 'e5f6g7h8', name: 'Science Fair Projects.pptx', type: 'pptx', mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 5_600_000, uploaded_by: 'Instructor B', uploaded_at: '2026-06-06T16:00:00Z', updated_at: '2026-06-06T16:00:00Z', folder: 'Presentations' },
  { id: '6', uuid: 'f6g7h8i9', name: 'Campus Tour Photo.jpg', type: 'image', mime_type: 'image/jpeg', size: 3_200_000, uploaded_by: 'Marketing', uploaded_at: '2026-06-05T08:30:00Z', updated_at: '2026-06-05T08:30:00Z', folder: 'Images' },
  { id: '7', uuid: 'g7h8i9j0', name: 'Audio Lecture - Week 1.mp3', type: 'audio', mime_type: 'audio/mpeg', size: 28_000_000, uploaded_by: 'Instructor A', uploaded_at: '2026-06-04T13:00:00Z', updated_at: '2026-06-04T13:00:00Z', folder: 'Audio' },
  { id: '8', uuid: 'h8i9j0k1', name: 'Backup Course Data.zip', type: 'zip', mime_type: 'application/zip', size: 450_000_000, uploaded_by: 'Admin', uploaded_at: '2026-06-03T17:00:00Z', updated_at: '2026-06-03T17:00:00Z', folder: 'Backups' },
  { id: '9', uuid: 'i9j0k1l2', name: 'Reading Notes.txt', type: 'txt', mime_type: 'text/plain', size: 12_000, uploaded_by: 'Student', uploaded_at: '2026-06-02T10:15:00Z', updated_at: '2026-06-02T10:15:00Z', folder: 'Notes' },
  { id: '10', uuid: 'j0k1l2m3', name: 'Grading Rubric.doc', type: 'doc', mime_type: 'application/msword', size: 380_000, uploaded_by: 'Instructor B', uploaded_at: '2026-06-01T09:45:00Z', updated_at: '2026-06-01T09:45:00Z', folder: 'Documents' },
  { id: '11', uuid: 'k1l2m3n4', name: 'Helpful Resources.url', type: 'link', mime_type: 'text/uri-list', size: 200, uploaded_by: 'Admin', uploaded_at: '2026-05-30T12:00:00Z', updated_at: '2026-05-30T12:00:00Z', folder: 'Links' },
  { id: '12', uuid: 'l2m3n4o5', name: 'Lab Experiment Results.csv', type: 'xlsx', mime_type: 'text/csv', size: 95_000, uploaded_by: 'Instructor A', uploaded_at: '2026-05-28T15:30:00Z', updated_at: '2026-05-28T15:30:00Z', folder: 'Data' },
  { id: '13', uuid: 'm3n4o5p6', name: 'Welcome Video - New Students.mp4', type: 'video', mime_type: 'video/mp4', size: 210_000_000, uploaded_by: 'Admin', uploaded_at: '2026-05-25T08:00:00Z', updated_at: '2026-05-25T08:00:00Z', folder: 'Videos' },
  { id: '14', uuid: 'n4o5p6q7', name: 'Graduation Ceremony Slides.pptx', type: 'pptx', mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 8_200_000, uploaded_by: 'Admin', uploaded_at: '2026-05-20T14:00:00Z', updated_at: '2026-05-20T14:00:00Z', folder: 'Presentations' },
  { id: '15', uuid: 'o5p6q7r8', name: 'Logo - High Resolution.png', type: 'image', mime_type: 'image/png', size: 1_800_000, uploaded_by: 'Marketing', uploaded_at: '2026-05-15T11:00:00Z', updated_at: '2026-05-15T11:00:00Z', folder: 'Images' },
  { id: '16', uuid: 'p6q7r8s9', name: 'Financial Audit Report.pdf', type: 'pdf', mime_type: 'application/pdf', size: 4_500_000, uploaded_by: 'Finance', uploaded_at: '2026-05-10T10:30:00Z', updated_at: '2026-05-10T10:30:00Z', folder: 'Reports' },
  { id: '17', uuid: 'q7r8s9t0', name: 'Podcast - Episode 5.mp3', type: 'audio', mime_type: 'audio/mpeg', size: 45_000_000, uploaded_by: 'Marketing', uploaded_at: '2026-05-05T09:00:00Z', updated_at: '2026-05-05T09:00:00Z', folder: 'Audio' },
  { id: '18', uuid: 'r8s9t0u1', name: 'Server Logs Archive.zip', type: 'zip', mime_type: 'application/zip', size: 890_000_000, uploaded_by: 'IT', uploaded_at: '2026-05-01T23:00:00Z', updated_at: '2026-05-01T23:00:00Z', folder: 'Backups' },
  { id: '19', uuid: 's9t0u1v2', name: 'Quick Start Guide.txt', type: 'txt', mime_type: 'text/plain', size: 8_500, uploaded_by: 'Admin', uploaded_at: '2026-04-28T13:00:00Z', updated_at: '2026-04-28T13:00:00Z', folder: 'Documents' },
  { id: '20', uuid: 't0u1v2w3', name: 'Online Course Platform - Demo.mp4', type: 'video', mime_type: 'video/mp4', size: 320_000_000, uploaded_by: 'IT', uploaded_at: '2026-04-20T16:00:00Z', updated_at: '2026-04-20T16:00:00Z', folder: 'Videos' },
];

export const assetService = {
  getAll: async (params?: AssetListParams): Promise<PaginatedResponse<Asset>> => {
    let filtered = [...mockAssets];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(q));
    }

    if (params?.type && params.type !== 'all') {
      filtered = filtered.filter((a) => a.type === params.type);
    }

    if (params?.sort) {
      filtered.sort((a, b) => {
        const dir = params.direction === 'desc' ? -1 : 1;
        switch (params.sort) {
          case 'name': return a.name.localeCompare(b.name) * dir;
          case 'size': return (a.size - b.size) * dir;
          case 'updated_at': return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * dir;
          default: return 0;
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
      message: 'Assets retrieved successfully',
      data,
      meta: {
        current_page: page,
        from: start + 1,
        last_page: Math.ceil(total / perPage),
        path: '/assets',
        per_page: perPage,
        to: start + data.length,
        total,
      },
    };
  },

  getByUuid: async (uuid: string): Promise<ApiResponse<Asset>> => {
    const asset = mockAssets.find((a) => a.uuid === uuid);
    return {
      success: true,
      message: 'Asset retrieved successfully',
      data: asset || ({} as Asset),
    };
  },
};
