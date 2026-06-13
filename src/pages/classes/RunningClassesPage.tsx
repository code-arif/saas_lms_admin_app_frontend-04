import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import {
  Search,
  Grid3X3,
  List,
  Loader2,
  ChevronDown,
  X,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Eye,  Zap, TrendingUp,
} from 'lucide-react';
import {
  classService,
  categoryLabels,
  levelLabels,
  type ClassItem,
} from '@/features/classes/services/classService';

// ─── RatingStars ──────────────────────────────────────────────────

const RatingStars = ({ rating }: { rating: number }) => {
  if (rating === 0) return <span className="text-xs text-muted-foreground">No ratings</span>;
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

// ─── Grid Card ────────────────────────────────────────────────────

const RunningClassCard = ({ item }: { item: ClassItem }) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-green-500/30 cursor-pointer border-green-500/10"
      onClick={() => navigate(`/classes/${item.uuid}`)}
    >
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
        <div className="absolute top-2 left-2">
          <Badge variant="success" className="text-[10px] px-1.5 capitalize flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Active
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {item.duration_minutes} min
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        <Badge variant="secondary" className="text-[10px] capitalize">
          {categoryLabels[item.category] || item.category}
        </Badge>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground">{item.instructor}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{item.students_enrolled}</span>
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{item.lessons_count}</span>
          </div>
          <RatingStars rating={item.rating} />
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold">{item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}</span>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7"
              onClick={(e) => { e.stopPropagation(); navigate(`/classes/${item.uuid}`); }} title="View"
            ><Eye className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── List Row ─────────────────────────────────────────────────────

const RunningClassRow = ({ item }: { item: ClassItem }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
      onClick={() => navigate(`/classes/${item.uuid}`)}
    >
      <div className="h-12 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate">{item.title}</h3>
          <Badge variant="success" className="text-[10px] capitalize shrink-0 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Active
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
      <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{item.students_enrolled}</span>
        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{item.lessons_count}</span>
        <RatingStars rating={item.rating} />
      </div>
      <div className="hidden lg:block w-16 text-right shrink-0">
        <span className="text-sm font-medium">{item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.stopPropagation(); navigate(`/classes/${item.uuid}`); }} title="View"
      ><Eye className="h-3.5 w-3.5" /></Button>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────

const RunningClassesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sort, setSort] = useState('students_enrolled');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    classService.getAll({ per_page: 100 }).then((res) => {
      setClasses(res.data);
      setLoading(false);
    });
  }, []);

  const runningClasses = useMemo(() => {
    const now = new Date();
    return classes.filter((c) =>
      c.status === 'active' &&
      !(c.end_date && new Date(c.end_date) < now)
    );
  }, [classes]);

  const displayedClasses = useMemo(() => {
    let filtered = [...runningClasses];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') filtered = filtered.filter((c) => c.category === categoryFilter);
    if (levelFilter !== 'all') filtered = filtered.filter((c) => c.level === levelFilter);
    filtered.sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      switch (sort) {
        case 'title': return a.title.localeCompare(b.title) * dir;
        case 'rating': return (a.rating - b.rating) * dir;
        case 'students_enrolled':
        default: return (a.students_enrolled - b.students_enrolled) * dir;
      }
    });
    return filtered;
  }, [runningClasses, search, categoryFilter, levelFilter, sort, sortDir]);

  const categoryOptions = Object.entries(categoryLabels);
  const levelOptions = Object.entries(levelLabels);
  const totalStudents = runningClasses.reduce((s, c) => s + c.students_enrolled, 0);
  const avgRating = runningClasses.filter((c) => c.rating > 0)
    .reduce((s, c, _, arr) => s + c.rating / arr.length, 0);
  const uniqueCategories = new Set(runningClasses.map((c) => c.category)).size;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Running Classes"
        subtitle={`${runningClasses.length} active class${runningClasses.length !== 1 ? 'es' : ''} currently in progress`}
      />

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{runningClasses.length}</p>
              <p className="text-xs text-muted-foreground">Active Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalStudents.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgRating ? avgRating.toFixed(1) : '—'}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{uniqueCategories}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search running classes..." className="pl-9" value={search}
            onChange={(e) => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levelOptions.map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="students_enrolled">Most Students</SelectItem>
            <SelectItem value="title">Name</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
          <ChevronDown className={`h-4 w-4 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
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

      <Separator />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : displayedClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Zap className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No running classes</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {search || categoryFilter !== 'all' || levelFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No classes are currently active'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedClasses.map((item) => (
            <RunningClassCard key={item.uuid} item={item} />
          ))}
        </div>
      ) : (
        <div className="space-y-0.5">
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground">
            <div className="w-20 shrink-0" />
            <div className="flex-1">Title</div>
            <div className="hidden md:flex items-center gap-4 shrink-0">Stats</div>
            <div className="hidden lg:block w-16 text-right shrink-0">Price</div>
            <div className="w-8 shrink-0" />
          </div>
          {displayedClasses.map((item) => (
            <RunningClassRow key={item.uuid} item={item} />
          ))}
        </div>
      )}

      {!loading && displayedClasses.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Showing {displayedClasses.length} of {runningClasses.length} running classes
        </p>
      )}
    </div>
  );
};

export default RunningClassesPage;
