import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/Dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import {
  Search, Grid3X3, List, Plus, Loader2, ChevronDown, X, Play, Clock, Users,
  Star, BookOpen, Eye, Pencil, Trash2, Filter, ToggleLeft, ToggleRight,
  GraduationCap, BarChart3,
} from 'lucide-react';
import {
  courseService, categoryLabels, levelLabels, instructors,
  type Course, type CreateCourseData,
} from '@/features/courses/services/courseService';

// ─── RatingStars ──────────────────────────────────────────────────

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {rating > 0 ? (
      <><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /><span className="text-xs font-medium">{rating.toFixed(1)}</span></>
    ) : (
      <span className="text-xs text-muted-foreground">—</span>
    )}
  </div>
);

// ─── Course Card ──────────────────────────────────────────────────

const CourseCard = ({ course, onEdit, onToggleActive, onDelete }: {
  course: Course; onEdit: (c: Course) => void; onToggleActive: (uuid: string) => void; onDelete: (uuid: string) => void;
}) => {
  const navigate = useNavigate();
  return (
    <Card className={`group overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer ${course.is_active ? 'hover:border-primary/30' : 'opacity-75 hover:opacity-100'}`}
      onClick={() => navigate(`/courses/${course.uuid}`)}
    >
      <div className="relative h-40 bg-muted overflow-hidden">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><BookOpen className="h-12 w-12 text-muted-foreground/30" /></div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
            <Play className="h-5 w-5 text-foreground ml-0.5" />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant={course.is_active ? 'success' : 'secondary'} className="text-[10px] px-1.5">
            {course.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        {course.is_featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="text-[10px] px-1.5 bg-yellow-500 text-white border-0">Featured</Badge>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
          <Clock className="h-3 w-3" />{course.duration_hours}h
        </div>
      </div>
      <CardContent className="p-3 space-y-2">
        <Badge variant="secondary" className="text-[10px] capitalize">{course.category}</Badge>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <GraduationCap className="h-3 w-3" /><span className="truncate">{course.instructor}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students_enrolled}</span>
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.lessons_count}</span>
          </div>
          <RatingStars rating={course.rating} />
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold">{course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}</span>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.uuid}`); }} title="View"><Eye className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEdit(course); }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggleActive(course.uuid); }} title={course.is_active ? 'Deactivate' : 'Activate'}>
              {course.is_active ? <ToggleRight className="h-3.5 w-3.5 text-green-500" /> : <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDelete(course.uuid); }} title="Delete"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Course Row ───────────────────────────────────────────────────

const CourseRow = ({ course, onEdit, onToggleActive, onDelete }: {
  course: Course; onEdit: (c: Course) => void; onToggleActive: (uuid: string) => void; onDelete: (uuid: string) => void;
}) => {
  const navigate = useNavigate();
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer ${!course.is_active ? 'opacity-70' : ''}`}
      onClick={() => navigate(`/courses/${course.uuid}`)}
    >
      <div className="h-12 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><BookOpen className="h-5 w-5 text-muted-foreground/30" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate">{course.title}</h3>
          <Badge variant={course.is_active ? 'success' : 'secondary'} className="text-[10px] capitalize shrink-0">{course.is_active ? 'Active' : 'Inactive'}</Badge>
          {course.is_featured && <Badge variant="default" className="text-[10px] bg-yellow-500 text-white border-0 shrink-0">Featured</Badge>}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <GraduationCap className="h-3 w-3" /><span>{course.instructor}</span>
          <span>•</span><span>{course.category}</span>
          <span>•</span><span className="capitalize">{course.level}</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.students_enrolled}</span>
        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.lessons_count}</span>
        <RatingStars rating={course.rating} />
      </div>
      <div className="hidden lg:block w-16 text-right shrink-0"><span className="text-sm font-medium">{course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}</span></div>
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.uuid}`); }} title="View"><Eye className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEdit(course); }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggleActive(course.uuid); }} title={course.is_active ? 'Deactivate' : 'Activate'}>
          {course.is_active ? <ToggleRight className="h-3.5 w-3.5 text-green-500" /> : <ToggleLeft className="h-3.5 w-3.5 text-muted-foreground" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onDelete(course.uuid); }} title="Delete"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
      </div>
    </div>
  );
};

// ─── Course Form Dialog ───────────────────────────────────────────

interface CourseFormData {
  title: string; slug: string; description: string; short_description: string;
  category: string; level: string; instructor: string; price: number;
  duration_hours: number; lessons_count: number; language: string;
  skills: string; prerequisites: string; tags: string; thumbnail_url: string;
}

const CourseFormDialog = ({ open, onOpenChange, initialData, onSubmit, isLoading }: {
  open: boolean; onOpenChange: (o: boolean) => void; initialData?: Course | null;
  onSubmit: (d: CourseFormData) => void; isLoading?: boolean;
}) => {
  const [form, setForm] = useState<CourseFormData>({
    title: '', slug: '', description: '', short_description: '', category: 'Technology',
    level: 'beginner', instructor: '', price: 0, duration_hours: 10, lessons_count: 20,
    language: 'English', skills: '', prerequisites: '', tags: '', thumbnail_url: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title, slug: initialData.slug, description: initialData.description,
        short_description: initialData.short_description || '', category: initialData.category,
        level: initialData.level, instructor: initialData.instructor, price: initialData.price,
        duration_hours: initialData.duration_hours, lessons_count: initialData.lessons_count,
        language: initialData.language, skills: initialData.skills.join(', '),
        prerequisites: initialData.prerequisites.join(', '), tags: initialData.tags.join(', '),
        thumbnail_url: initialData.thumbnail_url || '',
      });
    } else {
      setForm({ title: '', slug: '', description: '', short_description: '', category: 'Technology', level: 'beginner', instructor: '', price: 0, duration_hours: 10, lessons_count: 20, language: 'English', skills: '', prerequisites: '', tags: '', thumbnail_url: '' });
    }
  }, [initialData, open]);

  const set = (key: keyof CourseFormData, value: any) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Course' : 'Create Course'}</DialogTitle>
          <DialogDescription>{initialData ? 'Update the course details.' : 'Create a new course with all the details.'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g., Full-Stack Web Development" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="e.g., full-stack-web-dev" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description</label>
            <Input value={form.short_description} onChange={(e) => set('short_description', e.target.value)} placeholder="Brief tagline for the course card" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Description</label>
            <textarea className="w-full min-h-[100px] rounded-lg border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Detailed course description..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={form.level} onValueChange={(v) => set('level', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(levelLabels).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Input value={form.language} onChange={(e) => set('language', e.target.value)} placeholder="English" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Instructor</label>
              <Input value={form.instructor} onChange={(e) => set('instructor', e.target.value)} placeholder="e.g., Alex Rivera" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail URL</label>
              <Input value={form.thumbnail_url} onChange={(e) => set('thumbnail_url', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => set('price', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (hours)</label>
              <Input type="number" value={form.duration_hours} onChange={(e) => set('duration_hours', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lessons</label>
              <Input type="number" value={form.lessons_count} onChange={(e) => set('lessons_count', Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Skills (comma separated)</label>
            <Input value={form.skills} onChange={(e) => set('skills', e.target.value)} placeholder="e.g., React, Node.js, TypeScript" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Prerequisites (comma separated)</label>
            <Input value={form.prerequisites} onChange={(e) => set('prerequisites', e.target.value)} placeholder="e.g., Basic JavaScript, HTML & CSS" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="e.g., web, javascript, react" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
            <Button onClick={() => onSubmit(form)} disabled={!form.title || !form.slug || isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-1" />{initialData ? 'Updating...' : 'Creating...'}</> : initialData ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Page ────────────────────────────────────────────────────

const CoursesPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('updated_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    courseService.getAll({ per_page: 100 }).then((res) => { setCourses(res.data); setLoading(false); });
  }, []);

  const displayedCourses = useMemo(() => {
    let filtered = [...courses];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (categoryFilter !== 'all') filtered = filtered.filter((c) => c.category === categoryFilter);
    if (levelFilter !== 'all') filtered = filtered.filter((c) => c.level === levelFilter);
    if (statusFilter === 'active') filtered = filtered.filter((c) => c.is_active);
    else if (statusFilter === 'inactive') filtered = filtered.filter((c) => !c.is_active);

    filtered.sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      switch (sort) {
        case 'title': return a.title.localeCompare(b.title) * dir;
        case 'rating': return (a.rating - b.rating) * dir;
        case 'students_enrolled': return (a.students_enrolled - b.students_enrolled) * dir;
        case 'price': return (a.price - b.price) * dir;
        default: return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * dir;
      }
    });
    return filtered;
  }, [courses, search, categoryFilter, levelFilter, statusFilter, sort, sortDir]);

  const activeFilterCount = [categoryFilter, levelFilter, statusFilter].filter((v) => v !== 'all').length;

  const openCreate = () => { setEditingCourse(null); setFormOpen(true); };
  const openEdit = (c: Course) => { setEditingCourse(c); setFormOpen(true); };

  const handleFormSubmit = (data: CourseFormData) => {
    setFormLoading(true);
    setTimeout(() => {
      if (editingCourse) {
        setCourses((prev) => prev.map((c) => c.uuid === editingCourse.uuid ? {
          ...c,
          title: data.title,
          slug: data.slug,
          description: data.description,
          short_description: data.short_description,
          category: data.category,
          level: data.level as Course['level'],
          instructor: data.instructor,
          price: data.price,
          duration_hours: data.duration_hours,
          lessons_count: data.lessons_count,
          language: data.language,
          thumbnail_url: data.thumbnail_url,
          skills: data.skills.split(',').map((s) => s.trim()).filter(Boolean),
          prerequisites: data.prerequisites.split(',').map((s) => s.trim()).filter(Boolean),
          tags: data.tags.split(',').map((s) => s.trim()).filter(Boolean),
          updated_at: new Date().toISOString(),
        } : c));
      } else {
        const newCourse: Course = {
          id: String(Date.now()), uuid: `cr${String(courses.length + 1).padStart(3, '0')}`,
          title: data.title, slug: data.slug, description: data.description, short_description: data.short_description,
          category: data.category, level: data.level as any, instructor: data.instructor, price: data.price,
          duration_hours: data.duration_hours, lessons_count: data.lessons_count, students_enrolled: 0, rating: 0,
          is_active: true, is_featured: false, language: data.language, instructor_bio: '',
          skills: data.skills.split(',').map((s) => s.trim()).filter(Boolean),
          prerequisites: data.prerequisites.split(',').map((s) => s.trim()).filter(Boolean),
          requirements: [], tags: data.tags.split(',').map((s) => s.trim()).filter(Boolean),
          thumbnail_url: data.thumbnail_url || undefined,
          created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        };
        setCourses((prev) => [newCourse, ...prev]);
      }
      setFormLoading(false); setFormOpen(false); setEditingCourse(null);
    }, 400);
  };

  const handleToggleActive = (uuid: string) => {
    setCourses((prev) => prev.map((c) => c.uuid === uuid ? { ...c, is_active: !c.is_active, updated_at: new Date().toISOString() } : c));
  };

  const handleDelete = () => {
    if (!deleteUuid) return;
    setCourses((prev) => prev.filter((c) => c.uuid !== deleteUuid));
    setDeleteUuid(null);
  };

  const stats = useMemo(() => ({
    total: courses.length,
    active: courses.filter((c) => c.is_active).length,
    students: courses.reduce((s, c) => s + c.students_enrolled, 0),
    avgRating: courses.filter((c) => c.rating > 0).reduce((s, c, _, arr) => s + c.rating / arr.length, 0),
  }), [courses]);

  return (
    <div className="space-y-6">
      <PageTitle title="Courses" subtitle="Manage your course catalog — create, edit, and organize learning content">
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" />Create Course</Button>
      </PageTitle>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses', value: stats.total, icon: BookOpen, bg: 'bg-primary/10', color: 'text-primary' },
          { label: 'Active', value: stats.active, icon: BarChart3, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Students', value: stats.students.toLocaleString(), icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Avg Rating', value: stats.avgRating ? stats.avgRating.toFixed(1) : '—', icon: Star, bg: 'bg-yellow-50', color: 'text-yellow-600' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="relative">
          <Filter className="h-4 w-4 mr-1.5" />Filters
          {activeFilterCount > 0 && <Badge variant="default" className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]">{activeFilterCount}</Badge>}
        </Button>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_at">Last Modified</SelectItem>
            <SelectItem value="title">Name</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="students_enrolled">Students</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
          <ChevronDown className={`h-4 w-4 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
        </Button>
        <div className="hidden sm:block w-px h-8 bg-border" />
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}><Grid3X3 className="h-4 w-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}><List className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(categoryLabels).map(([v, l]) => (<SelectItem key={v} value={v}>{l}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Level</label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {Object.entries(levelLabels).map(([v, l]) => (<SelectItem key={v} value={v}>{l}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" className="mt-3 text-xs" onClick={() => { setCategoryFilter('all'); setLevelFilter('all'); setStatusFilter('all'); }}>Clear all filters</Button>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : displayedCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No courses found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">{search || activeFilterCount > 0 ? 'Try adjusting your filters' : 'Create your first course to get started'}</p>
          {!search && activeFilterCount === 0 && <Button variant="outline" className="mt-4" onClick={openCreate}><Plus className="h-4 w-4 mr-1.5" />Create Course</Button>}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedCourses.map((course) => (
            <CourseCard key={course.uuid} course={course} onEdit={openEdit} onToggleActive={handleToggleActive} onDelete={setDeleteUuid} />
          ))}
        </div>
      ) : (
        <div className="space-y-0.5">
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground">
            <div className="w-20 shrink-0" /><div className="flex-1">Title</div>
            <div className="hidden md:flex items-center gap-4 shrink-0">Stats</div>
            <div className="hidden lg:block w-16 text-right shrink-0">Price</div>
            <div className="w-28 shrink-0" />
          </div>
          {displayedCourses.map((course) => (
            <CourseRow key={course.uuid} course={course} onEdit={openEdit} onToggleActive={handleToggleActive} onDelete={setDeleteUuid} />
          ))}
        </div>
      )}

      {!loading && displayedCourses.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">Showing {displayedCourses.length} of {courses.length} courses</p>
      )}

      <CourseFormDialog open={formOpen} onOpenChange={(o) => { if (!o) setEditingCourse(null); setFormOpen(o); }}
        initialData={editingCourse} onSubmit={handleFormSubmit} isLoading={formLoading} />

      <ConfirmDialog open={!!deleteUuid} onOpenChange={(o) => !o && setDeleteUuid(null)}
        title="Delete Course" description="Are you sure you want to delete this course? This action cannot be undone."
        confirmLabel="Delete" variant="destructive" onConfirm={handleDelete} isLoading={false} />
    </div>
  );
};

export default CoursesPage;
