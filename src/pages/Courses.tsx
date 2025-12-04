import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Play,
  Star,
  BookOpen,
  Clock,
  Users,
  Sparkles,
  Search,
  Filter,
  Camera,
  Film,
  Mic,
  Video,
  Palette,
  Lightbulb,
  ChevronLeft,
  Lock,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Note: Camera, Film, Mic, Video, Palette, Lightbulb are still used in categories icons

// ═══════════════════════════════════════════════════════════════
// أكاديمية إبداع - COURSES PAGE
// ═══════════════════════════════════════════════════════════════

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: string;
  level: string;
  instructor_name: string;
  price: number;
  category_id: string;
  categories: { name_ar: string; slug: string } | null;
  lessons_count?: number;
}

const Courses = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          duration,
          level,
          instructor_name,
          price,
          category_id,
          categories (name_ar, slug)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get lesson counts for each course
      const coursesWithLessons = await Promise.all(
        (data || []).map(async (course) => {
          const { count } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);
          return { ...course, lessons_count: count || 0 };
        })
      );

      setCourses(coursesWithLessons);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('فشل تحميل الدورات');
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleCourseClick = (courseId: string) => {
    if (!user) {
      setShowLoginDialog(true);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const categorySlug = course.categories?.slug || '';
    const matchesCategory = selectedCategory === "all" || categorySlug === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════════════════════════
          SHARED NAVIGATION HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <Header />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 pattern-stars opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-6 animate-fade-in-up">
              +25 دورة متخصصة
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 animate-fade-in-up stagger-1">
              <span className="text-foreground">اكتشف</span>{" "}
              <span className="text-gradient-gold">دوراتنا</span>
              <br />
              <span className="text-foreground">المتخصصة</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up stagger-2">
              تعلم صناعة المحتوى الإعلامي من خبراء المجال بمناهج عملية ومحتوى عربي أصيل
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto animate-fade-in-up stagger-3">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث عن دورة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 bg-card/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORIES
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-secondary text-background font-semibold glow-gold"
                    : "bg-card/50 text-foreground/70 hover:bg-secondary/10 hover:text-secondary"
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FILTERS & COURSES
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div className="text-muted-foreground">
              عرض <span className="text-secondary font-semibold">{filteredCourses.length}</span> دورة
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">تصفية:</span>
              </div>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-40 bg-card/50 border-border/50">
                  <SelectValue placeholder="المستوى" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  <SelectItem value="beginner">مبتدئ</SelectItem>
                  <SelectItem value="intermediate">متوسط</SelectItem>
                  <SelectItem value="advanced">متقدم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesLoading ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground">لا توجد دورات متاحة</p>
              </div>
            ) : (
              filteredCourses.map((course, index) => (
                <Card
                  key={course.id}
                  className={`overflow-hidden bg-card/50 border-border/50 hover:border-secondary/30 group card-hover animate-fade-in-up cursor-pointer`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleCourseClick(course.id)}
                >
                  {/* Course Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-background overflow-hidden">
                    <img
                      src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop'}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-none text-foreground">
                        {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                      </Badge>
                    </div>

                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform glow-gold">
                        <Play className="w-7 h-7 text-background" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Category */}
                    {course.categories && (
                      <div className="mb-3">
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                          {course.categories.name_ar}
                        </Badge>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold font-display mb-2 text-foreground group-hover:text-secondary transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons_count || 0} درس</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* Instructor & Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                          <Users className="w-4 h-4 text-secondary" />
                        </div>
                        <div className="text-sm text-foreground">{course.instructor_name}</div>
                      </div>
                      <div className="text-lg font-bold text-gradient-gold">
                        {course.price} د.م
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="px-6 pb-6">
                    <Button
                      className="w-full btn-gradient-gold text-background font-semibold hover:glow-gold group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course.id);
                      }}
                    >
                      {user ? (
                        <>
                          <span>عرض التفاصيل</span>
                          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 ml-2" />
                          <span>سجل دخولك للوصول</span>
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">لم يتم العثور على دورات</h3>
              <p className="text-muted-foreground mb-6">جرب تغيير معايير البحث أو التصفية</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                  setSearchQuery("");
                }}
                className="border-secondary/50 text-secondary hover:bg-secondary/10"
              >
                إعادة ضبط الفلاتر
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredCourses.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-secondary/50 text-secondary hover:bg-secondary/10 px-8"
              >
                عرض المزيد من الدورات
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl glass-gold">
            <div className="absolute inset-0 pattern-stars opacity-20" />

            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-2xl md:text-4xl font-bold font-display mb-4">
                <span className="text-foreground">لم تجد ما تبحث عنه؟</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                تواصل معنا وأخبرنا عن الدورة التي ترغب في تعلمها وسنعمل على توفيرها لك
              </p>
              <Button className="btn-gradient-gold text-background font-semibold px-8 py-6 text-lg hover:glow-gold-intense">
                تواصل معنا
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-secondary/20 rounded-lg rotate-45" />
                <div className="absolute inset-1 bg-gradient-to-br from-secondary to-secondary/70 rounded-md flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
              </div>
              <span className="text-lg font-bold font-display text-gradient-gold">
                أكاديمية إبداع
              </span>
            </Link>

            <p className="text-muted-foreground text-sm">
              © 2024 أكاديمية إبداع. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="glass border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-display text-center">
              <span className="text-foreground">سجل دخولك</span>{" "}
              <span className="text-gradient-gold">للوصول</span>
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground pt-2">
              يجب عليك تسجيل الدخول أو إنشاء حساب جديد للوصول إلى محتوى الدورات
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              className="btn-gradient-gold text-background font-semibold hover:glow-gold"
              onClick={() => {
                setShowLoginDialog(false);
                navigate("/signin");
              }}
            >
              تسجيل الدخول
            </Button>
            <Button
              variant="outline"
              className="border-secondary/50 text-secondary hover:bg-secondary/10"
              onClick={() => {
                setShowLoginDialog(false);
                navigate("/signup");
              }}
            >
              إنشاء حساب جديد
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const categories = [
  { id: "all", name: "الكل", icon: Sparkles },
  { id: "photography", name: "التصوير", icon: Camera },
  { id: "video", name: "الفيديو", icon: Film },
  { id: "editing", name: "المونتاج", icon: Video },
  { id: "audio", name: "الصوتيات", icon: Mic },
  { id: "design", name: "التصميم", icon: Palette },
  { id: "content", name: "المحتوى", icon: Lightbulb },
];

export default Courses;
