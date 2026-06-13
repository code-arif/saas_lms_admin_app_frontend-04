import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import {
  Play, Clock, Users, Star, BookOpen, ChevronLeft, GraduationCap,
  DollarSign, Globe, Award, CheckCircle, XCircle,
  Edit, Trash2, ToggleLeft, ToggleRight, Share2, Download,
} from 'lucide-react';
import { courseService, categoryLabels, levelLabels, type Course } from '@/features/courses/services/courseService';

const RatingStars = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  if (rating === 0) return <span className="text-sm text-muted-foreground">No ratings yet</span>;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${cls} ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
      ))}
      <span className="text-lg font-bold ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

const CourseDetailPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uuid) return;
    courseService.getByUuid(uuid).then((res) => { setCourse(res.data); setLoading(false); });
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <p className="text-lg font-medium">Course not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/courses')}><ChevronLeft className="h-4 w-4 mr-1" /> Back to Courses</Button>
      </div>
    );
  }

  const c = course;

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Courses
      </button>

      {/* Hero */}
      <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-muted mb-8">
        {c.thumbnail_url ? (
          <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><BookOpen className="h-20 w-20 text-muted-foreground/30" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="capitalize">{c.category}</Badge>
            <Badge variant={c.is_active ? 'success' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
            {c.is_featured && <Badge variant="default" className="bg-yellow-500 text-white border-0">Featured</Badge>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{c.title}</h1>
          <p className="text-sm text-white/80 mt-1 max-w-2xl">{c.short_description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Students', value: c.students_enrolled.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Duration', value: `${c.duration_hours}h`, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Lessons', value: c.lessons_count, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Price', value: c.price === 0 ? 'Free' : `$${c.price.toFixed(2)}`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                    <div><p className="text-lg font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">About This Course</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{c.description}</p>
          </div>

          <Separator />

          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold mb-3">What You'll Learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {c.skills.map((skill) => (
                <div key={skill} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500 shrink-0" /><span>{skill}</span></div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {c.prerequisites.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-lg font-semibold mb-3">Prerequisites</h2>
                <ul className="space-y-1.5">
                  {c.prerequisites.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm"><XCircle className="h-4 w-4 text-muted-foreground shrink-0" /><span>{p}</span></li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Requirements */}
          {c.requirements.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                <ul className="space-y-1.5">
                  {c.requirements.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm"><Award className="h-4 w-4 text-muted-foreground shrink-0" /><span>{r}</span></li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info Card */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{c.price === 0 ? 'Free' : `$${c.price.toFixed(2)}`}</p>
                <p className="text-xs text-muted-foreground mt-1">One-time payment • Lifetime access</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full" size="lg">
                  <Play className="h-4 w-4 mr-2" />Preview Course
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />Download Syllabus
                </Button>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Instructor</span>
                  <span className="font-medium">{c.instructor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <Badge variant="secondary" className="capitalize">{levelLabels[c.level] || c.level}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{c.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <RatingStars rating={c.rating} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{categoryLabels[c.category] || c.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {c.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize text-[10px]">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-sm">Actions</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate(`/courses/${c.uuid}/edit`)}>
                <Edit className="h-4 w-4 mr-2" /> Edit Course
              </Button>
              <Button variant="outline" className="w-full justify-start text-yellow-600 hover:text-yellow-700">
                {c.is_active ? <ToggleLeft className="h-4 w-4 mr-2" /> : <ToggleRight className="h-4 w-4 mr-2" />}
                {c.is_active ? 'Deactivate Course' : 'Activate Course'}
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Delete Course
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
