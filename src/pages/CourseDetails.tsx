import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Lock,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// أكاديمية إبداع - COURSE DETAILS PAGE
// ═══════════════════════════════════════════════════════════════

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: string;
  order_index: number;
  is_free: boolean;
  content: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: string;
  level: string;
  instructor_name: string;
  price: number;
  content: string | null;
  video_url: string | null;
  categories: { name_ar: string; slug: string } | null;
}

interface CourseAccess {
  accessed_at: string;
  progress: number;
  completed_at: string | null;
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseAccess, setCourseAccess] = useState<CourseAccess | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (profile?.status !== "approved") {
      toast.error("يجب أن يتم الموافقة على حسابك أولاً");
      navigate("/courses");
      return;
    }

    fetchCourseDetails();
  }, [courseId, user, profile]);

  const fetchCourseDetails = async () => {
    if (!courseId) return;

    try {
      setLoading(true);

      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(
          `
          id,
          title,
          description,
          thumbnail_url,
          duration,
          level,
          instructor_name,
          price,
          content,
          video_url,
          categories (name_ar, slug)
        `
        )
        .eq("id", courseId)
        .eq("is_published", true)
        .single();

      if (courseError) throw courseError;
      if (!courseData) {
        toast.error("الدورة غير موجودة");
        navigate("/courses");
        return;
      }

      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Set first lesson as selected by default
      if (lessonsData && lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }

      // Fetch or create course access record
      if (user) {
        const { data: accessData, error: accessError } = await supabase
          .from("user_course_access")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .single();

        if (accessError && accessError.code !== "PGRST116") {
          // PGRST116 = no rows returned
          console.error("Error fetching access:", accessError);
        }

        if (accessData) {
          setCourseAccess(accessData);
        } else {
          // Create access record
          const { data: newAccess, error: createError } = await supabase
            .from("user_course_access")
            .insert({
              user_id: user.id,
              course_id: courseId,
              progress: 0,
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating access:", createError);
          } else {
            setCourseAccess(newAccess);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("فشل تحميل تفاصيل الدورة");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

  const updateProgress = async () => {
    if (!user || !courseId) return;

    const completedLessons = lessons.filter((l) => l.id === selectedLesson?.id).length;
    const progress = Math.round((completedLessons / lessons.length) * 100);

    const { error } = await supabase
      .from("user_course_access")
      .update({ progress })
      .eq("user_id", user.id)
      .eq("course_id", courseId);

    if (error) {
      console.error("Error updating progress:", error);
    } else {
      setCourseAccess((prev) => (prev ? { ...prev, progress } : null));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">الدورة غير موجودة</h2>
          <Button onClick={() => navigate("/courses")}>العودة إلى الدورات</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════════════════════════
          SHARED NAVIGATION HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <Header />

      {/* ═══════════════════════════════════════════════════════════════
          COURSE HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 border-b border-border/30">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-secondary transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <Link to="/courses" className="hover:text-secondary transition-colors">
              الدورات
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-foreground">{course.title}</span>
          </div>

          {/* Course Info */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                {course.categories && (
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 mb-3">
                    {course.categories.name_ar}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>{course.instructor_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <span>{lessons.length} درس</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <span>{course.duration}</span>
                </div>
                <Badge variant="outline" className="border-secondary/50">
                  {course.level === "beginner" ? "مبتدئ" : course.level === "intermediate" ? "متوسط" : "متقدم"}
                </Badge>
              </div>
            </div>

            {/* Progress Card */}
            <div>
              <Card className="bg-card/50 border-border/50 p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">تقدمك</span>
                    <span className="text-sm font-semibold text-secondary">{courseAccess?.progress || 0}%</span>
                  </div>
                  <Progress value={courseAccess?.progress || 0} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {courseAccess?.completed_at
                    ? "تم الانتهاء من الدورة"
                    : `${Math.round(((courseAccess?.progress || 0) / 100) * lessons.length)} من ${lessons.length} دروس مكتملة`}
                </div>
                <Button className="w-full btn-gradient-gold text-background font-semibold hover:glow-gold">
                  <Play className="w-4 h-4 ml-2" />
                  {courseAccess?.progress ? "متابعة التعلم" : "ابدأ الآن"}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COURSE CONTENT
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Video Player & Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Video */}
              {selectedLesson?.video_url ? (
                <div className="relative aspect-video bg-background rounded-xl overflow-hidden border border-border/50">
                  <iframe
                    src={selectedLesson.video_url}
                    title={selectedLesson.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-background rounded-xl overflow-hidden border border-border/50 flex items-center justify-center">
                  <Play className="w-16 h-16 text-muted-foreground" />
                </div>
              )}

              {/* Lesson Info */}
              {selectedLesson && (
                <Card className="bg-card/50 border-border/50 p-6">
                  <h2 className="text-2xl font-bold font-display mb-3 text-foreground">{selectedLesson.title}</h2>
                  {selectedLesson.description && (
                    <p className="text-muted-foreground mb-4">{selectedLesson.description}</p>
                  )}
                  {selectedLesson.content && (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-foreground">{selectedLesson.content}</p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-border/50">
                    <Button
                      variant="outline"
                      onClick={handlePreviousLesson}
                      disabled={lessons.findIndex((l) => l.id === selectedLesson.id) === 0}
                      className="border-secondary/50 text-secondary hover:bg-secondary/10"
                    >
                      <ChevronRight className="w-4 h-4 ml-2" />
                      الدرس السابق
                    </Button>
                    <Button
                      className="btn-gradient-gold text-background font-semibold hover:glow-gold"
                      onClick={handleNextLesson}
                      disabled={
                        lessons.findIndex((l) => l.id === selectedLesson.id) === lessons.length - 1
                      }
                    >
                      الدرس التالي
                      <ChevronLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Lessons Sidebar */}
            <div>
              <Card className="bg-card/50 border-border/50 p-6 sticky top-24">
                <h3 className="text-xl font-bold font-display mb-4 text-foreground">محتوى الدورة</h3>
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-right p-4 rounded-lg transition-all ${
                        selectedLesson?.id === lesson.id
                          ? "bg-secondary/20 border-2 border-secondary"
                          : "bg-background/50 border border-border/50 hover:bg-secondary/5 hover:border-secondary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            selectedLesson?.id === lesson.id
                              ? "bg-secondary text-background"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {lesson.is_free ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
                            {lesson.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration}</span>
                            {lesson.is_free && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                مجاني
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BACK TO COURSES
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 border-t border-border/30">
        <div className="container mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => navigate("/courses")}
            className="border-secondary/50 text-secondary hover:bg-secondary/10"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة إلى الدورات
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
