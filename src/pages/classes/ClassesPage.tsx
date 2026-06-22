import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import {
  Search,
  Grid3X3,
  List,
  Plus,
  Loader2,
  ChevronDown,
  X,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  BarChart3,
  Eye,
  Pencil,
  Trash2,
  Filter,
} from 'lucide-react';

import {
  classService,
  categoryLabels,
  levelLabels,
  statusLabels,
  instructors,
  type ClassItem,
  type ClassListParams,
} from '@/features/classes/services/classService';

// ─── Helper: render star rating ───────────────────────────────────

const RatingStars = ({ rating }: { rating: number }) => {
  if (rating === 0) return <span className="text-xs text-muted-foreground">No ratings</span>;
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// ─── Filter sidebar / panel ───────────────────────────────────────

interface FiltersState {
  search: string;
  category: string;
  level: string;
  status: string;
  instructor: string;
  sort: string;
  sortDir: 'asc' | 'desc';
}

const defaultFilters: FiltersState = {
  search: '',
  category: 'all',
  level: 'all',
  status: 'all',
  instructor: 'all',
  sort: 'updated_at',
  sortDir: 'desc',
};

const categoryOptions = Object.entries(categoryLabels);
const levelOptions = Object.entries(levelLabels);
const statusOptions = Object.entries(statusLabels);

// ─── Class Card (Grid) ────────────────────────────────────────────

const ClassCard = ({ item, onEdit, onDelete }: { item: ClassItem; onEdit: (c: ClassItem) => void; onDelete: (uuid: string) => void }) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30 cursor-pointer"
      onClick={() => navigate(`/classes/${item.uuid}`)}
    >
      {/* Thumbnail with overlay */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
            <Play className="h-5 w-5 text-foreground ml-0.5" />
          </div>
        </div>
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={
            item.status === 'active' ? 'success' :
            item.status === 'draft' ? 'secondary' :
            item.status === 'inactive' ? 'outline' : 'destructive'
          } className="text-[10px] px-1.5 capitalize">
            {item.status}
          </Badge>
        </div>
        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {item.duration_minutes} min
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Category */}
        <Badge variant="secondary" className="text-[10px] capitalize">
          {categoryLabels[item.category] || item.category}
        </Badge>

        {/* Title */}
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-muted-foreground">{item.instructor}</p>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {item.students_enrolled}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {item.lessons_count}
            </span>
          </div>
          <RatingStars rating={item.rating} />
        </div>

        {/* Price & actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold">
            {item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}
          </span>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7"
              onClick={(e) => { e.stopPropagation(); navigate(`/classes/${item.uuid}`); }}
              title="View class"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7"
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              title="Edit class"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7"
              onClick={(e) => { e.stopPropagation(); onDelete(item.uuid); }}
              title="Delete class"
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Class Row (List) ─────────────────────────────────────────────

const ClassRow = ({ item, onEdit, onDelete }: { item: ClassItem; onEdit: (c: ClassItem) => void; onDelete: (uuid: string) => void }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
      onClick={() => navigate(`/classes/${item.uuid}`)}
    >
      {/* Thumbnail */}
      <div className="h-12 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate">{item.title}</h3>
          <Badge variant={
            item.status === 'active' ? 'success' :
            item.status === 'draft' ? 'secondary' :
            item.status === 'inactive' ? 'outline' : 'destructive'
          } className="text-[10px] capitalize shrink-0">
            {item.status}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span>{item.instructor}</span>
          <span>•</span>
          <span className="capitalize">{categoryLabels[item.category] || item.category}</span>
          <span>•</span>
          <span className="capitalize">{levelLabels[item.level] || item.level}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{item.students_enrolled}</span>
        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{item.lessons_count}</span>
        <RatingStars rating={item.rating} />
      </div>

      {/* Price */}
      <div className="hidden lg:block w-16 text-right shrink-0">
        <span className="text-sm font-medium">{item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7"
          onClick={(e) => { e.stopPropagation(); navigate(`/classes/${item.uuid}`); }} title="View"
        ><Eye className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"
          onClick={(e) => { e.stopPropagation(); onEdit(item); }} title="Edit"
        ><Pencil className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"
          onClick={(e) => { e.stopPropagation(); onDelete(item.uuid); }} title="Delete"
        ><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
      </div>
    </div>
  );
};

// ─── Class Form (Create / Edit) ───────────────────────────────────

interface ClassFormData {
  title: string;
  description: string;
  category: string;
  level: string;
  status: string;
  instructor: string;
  duration_minutes: number;
  lessons_count: number;
  price: number;
  tags: string;
  start_date: string;
}

const ClassFormDialog = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ClassItem | null;
  onSubmit: (data: ClassFormData) => void;
  isLoading?: boolean;
}) => {
  const [form, setForm] = useState<ClassFormData>({
    title: '', description: '', category: 'technology', level: 'beginner',
    status: 'draft', instructor: '', duration_minutes: 30, lessons_count: 10,
    price: 0, tags: '', start_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        level: initialData.level,
        status: initialData.status,
        instructor: initialData.instructor,
        duration_minutes: initialData.duration_minutes,
        lessons_count: initialData.lessons_count,
        price: initialData.price,
        tags: initialData.tags.join(', '),
        start_date: initialData.start_date,
      });
    } else {
      setForm({
        title: '', description: '', category: 'technology', level: 'beginner',
        status: 'draft', instructor: '', duration_minutes: 30, lessons_count: 10,
        price: 0, tags: '', start_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, open]);

  const set = (key: keyof ClassFormData, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Class' : 'Create Class'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the class details.' : 'Create a new class with all the details.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g., Introduction to Algebra" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full min-h-[80px] rounded-lg border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe what students will learn..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(([val, label]) => (
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
                  {levelOptions.map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={form.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Instructor</label>
              <Input value={form.instructor} onChange={(e) => set('instructor', e.target.value)} placeholder="e.g., Dr. Sarah Chen" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (min)</label>
              <Input type="number" value={form.duration_minutes} onChange={(e) => set('duration_minutes', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lessons</label>
              <Input type="number" value={form.lessons_count} onChange={(e) => set('lessons_count', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => set('price', Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="e.g., algebra, math, beginner" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={() => onSubmit(form)} disabled={!form.title || isLoading}>
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" />{initialData ? 'Updating...' : 'Creating...'}</>
              ) : (
                initialData ? 'Update Class' : 'Create Class'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Classes Page ────────────────────────────────────────────

const ClassesPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  // CRUD state
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Load data
  useEffect(() => {
    classService.getAll({ per_page: 100 }).then((res) => {
      setClasses(res.data);
      setLoading(false);
    });
  }, []);

  // Filtered classes
  const displayedClasses = useMemo(() => {
    let filtered = [...classes];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.category !== 'all') filtered = filtered.filter((c) => c.category === filters.category);
    if (filters.level !== 'all') filtered = filtered.filter((c) => c.level === filters.level);
    if (filters.status !== 'all') filtered = filtered.filter((c) => c.status === filters.status);
    if (filters.instructor !== 'all') filtered = filtered.filter((c) => c.instructor === filters.instructor);

    filtered.sort((a, b) => {
      const dir = filters.sortDir === 'desc' ? -1 : 1;
      switch (filters.sort) {
        case 'title': return a.title.localeCompare(b.title) * dir;
        case 'rating': return (a.rating - b.rating) * dir;
        case 'students_enrolled': return (a.students_enrolled - b.students_enrolled) * dir;
        case 'price': return (a.price - b.price) * dir;
        default: return (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()) * dir;
      }
    });

    return filtered;
  }, [classes, filters]);

  const activeFilterCount = [filters.category, filters.level, filters.status, filters.instructor].filter((v) => v !== 'all').length;

  // CRUD handlers
  const openCreate = () => { setEditingClass(null); setFormOpen(true); };
  const openEdit = (c: ClassItem) => { setEditingClass(c); setFormOpen(true); };

  const handleFormSubmit = (data: ClassFormData) => {
    setFormLoading(true);
    setTimeout(() => {
      if (editingClass) {
        setClasses((prev) =>
          prev.map((c) =>
            c.uuid === editingClass.uuid
              ? {
                  ...c,
                  title: data.title,
                  description: data.description,
                  category: data.category as ClassItem['category'],
                  level: data.level as ClassItem['level'],
                  status: data.status as ClassItem['status'],
                  instructor: data.instructor,
                  duration_minutes: data.duration_minutes,
                  lessons_count: data.lessons_count,
                  price: data.price,
                  tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
                  start_date: data.start_date,
                  updated_at: new Date().toISOString(),
                }
              : c
          )
        );
      } else {
        const newClass: ClassItem = {
          id: String(Date.now()),
          uuid: `c${String(classes.length + 1).padStart(3, '0')}`,
          title: data.title,
          description: data.description,
          category: data.category as any,
          level: data.level as any,
          status: data.status as any,
          instructor: data.instructor,
          duration_minutes: data.duration_minutes,
          lessons_count: data.lessons_count,
          students_enrolled: 0,
          rating: 0,
          price: data.price,
          tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
          start_date: data.start_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setClasses((prev) => [newClass, ...prev]);
      }
      setFormLoading(false);
      setFormOpen(false);
      setEditingClass(null);
    }, 400);
  };

  const handleDelete = () => {
    if (!deleteUuid) return;
    setClasses((prev) => prev.filter((c) => c.uuid !== deleteUuid));
    setDeleteUuid(null);
  };

  const setFilter = (key: keyof FiltersState, value: any) => setFilters((prev) => ({ ...prev, [key]: value }));

  const statCards = useMemo(() => {
    const total = classes.length;
    const active = classes.filter((c) => c.status === 'active').length;
    const totalStudents = classes.reduce((s, c) => s + c.students_enrolled, 0);
    const avgRating = classes.filter((c) => c.rating > 0).reduce((s, c, _, arr) => s + c.rating / arr.length, 0);
    return [
      { label: 'Total Classes', value: total, icon: BookOpen },
      { label: 'Active', value: active, icon: BarChart3 },
      { label: 'Students', value: totalStudents.toLocaleString(), icon: Users },
      { label: 'Avg Rating', value: avgRating ? avgRating.toFixed(1) : '—', icon: Star },
    ];
  }, [classes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageTitle title="Classes" subtitle="Manage all classes, courses, and learning content">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Create Class
        </Button>
      </PageTitle>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
          />
          {filters.search && (
            <button onClick={() => setFilter('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="relative">
          <Filter className="h-4 w-4 mr-1.5" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        <Select value={filters.sort} onValueChange={(v) => setFilter('sort', v)}>
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_at">Last Modified</SelectItem>
            <SelectItem value="title">Name</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="students_enrolled">Students</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc')} title={filters.sortDir === 'asc' ? 'Ascending' : 'Descending'}>
          <ChevronDown className={`h-4 w-4 transition-transform ${filters.sortDir === 'asc' ? 'rotate-180' : ''}`} />
        </Button>

        <div className="hidden sm:block w-px h-8 bg-border" />

        <div className="flex items-center border rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`} title="Grid view">
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`} title="List view">
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select value={filters.category} onValueChange={(v) => setFilter('category', v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Level</label>
                <Select value={filters.level} onValueChange={(v) => setFilter('level', v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levelOptions.map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={filters.status} onValueChange={(v) => setFilter('status', v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statusOptions.map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Instructor</label>
                <Select value={filters.instructor} onValueChange={(v) => setFilter('instructor', v)}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Instructors</SelectItem>
                    {instructors.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(activeFilterCount > 0) && (
              <Button variant="ghost" size="sm" className="mt-3 text-xs" onClick={() => setFilters((prev) => ({ ...prev, category: 'all', level: 'all', status: 'all', instructor: 'all' }))}>
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : displayedClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No classes found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {filters.search || activeFilterCount > 0 ? 'Try adjusting your filters' : 'Create your first class to get started'}
          </p>
          {!filters.search && activeFilterCount === 0 && (
            <Button variant="outline" className="mt-4" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1.5" />
              Create Class
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedClasses.map((item) => (
            <ClassCard key={item.uuid} item={item} onEdit={openEdit} onDelete={setDeleteUuid} />
          ))}
        </div>
      ) : (
        <div className="space-y-0.5">
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground">
            <div className="w-20 shrink-0" />
            <div className="flex-1">Title</div>
            <div className="hidden md:flex items-center gap-4 shrink-0">Stats</div>
            <div className="hidden lg:block w-16 text-right shrink-0">Price</div>
            <div className="w-24 shrink-0" />
          </div>
          {displayedClasses.map((item) => (
            <ClassRow key={item.uuid} item={item} onEdit={openEdit} onDelete={setDeleteUuid} />
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && displayedClasses.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {displayedClasses.length} of {classes.length} classes
        </p>
      )}

      {/* Create / Edit Dialog */}
      <ClassFormDialog
        open={formOpen}
        onOpenChange={(o) => { if (!o) { setEditingClass(null); } setFormOpen(o); }}
        initialData={editingClass}
        onSubmit={handleFormSubmit}
        isLoading={formLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteUuid}
        onOpenChange={(o) => !o && setDeleteUuid(null)}
        title="Delete Class"
        description="Are you sure you want to delete this class? This action cannot be undone. All associated lessons and student progress may be affected."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={false}
      />
    </div>
  );
};

export default ClassesPage;
