import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Play,
  Star,
  Users,
  BookOpen,
  Award,
  ChevronLeft,
  Sparkles,
  Video,
  Palette,
  Mic,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Aperture,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";

// ═══════════════════════════════════════════════════════════════
// أكاديمية إبداع - LANDING PAGE
// ═══════════════════════════════════════════════════════════════

const Index = () => {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          SHARED NAVIGATION HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <Header />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-24">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

          {/* Pattern overlay */}
          <div className="absolute inset-0 pattern-stars opacity-30" />

          {/* Floating decorative elements */}
          <div className="absolute top-1/3 right-[10%] w-4 h-4 bg-secondary rounded-full animate-float opacity-60" />
          <div className="absolute top-1/2 right-[20%] w-2 h-2 bg-secondary/60 rounded-full animate-float-delayed opacity-40" />
          <div className="absolute bottom-1/3 left-[15%] w-3 h-3 bg-secondary/80 rounded-full animate-float-slow opacity-50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-8 animate-fade-in-up stagger-1">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary">منصة تعليمية عربية رائدة</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-display leading-tight mb-6 animate-fade-in-up stagger-2">
                <span className="text-foreground">أطلق</span>{" "}
                <span className="text-gradient-gold text-glow-gold">إبداعك</span>
                <br />
                <span className="text-foreground">في صناعة</span>{" "}
                <span className="text-secondary">المحتوى</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up stagger-3">
                تعلم أسرار صناعة المحتوى الإعلامي من خبراء المجال.
                دورات احترافية في التصوير، المونتاج، والإنتاج الإعلامي.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up stagger-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="btn-gradient-gold text-background font-bold text-lg px-8 py-6 hover:glow-gold-intense group"
                  >
                    <span>ابدأ رحلتك الآن</span>
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-secondary/50 text-secondary hover:bg-secondary/10 px-8 py-6 group"
                  >
                    <Play className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    <span>استعرض الدورات</span>
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start mt-12 animate-fade-in-up stagger-5">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient-gold">+500</div>
                  <div className="text-sm text-muted-foreground">طالب مسجل</div>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient-gold">+25</div>
                  <div className="text-sm text-muted-foreground">دورة متخصصة</div>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient-gold">4.9</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    تقييم الطلاب
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              {/* Main card */}
              <div className="relative animate-fade-in-left stagger-3">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl blur-2xl" />
                <div className="relative glass rounded-3xl p-4 border-gradient overflow-hidden">
                  {/* Hero Video Thumbnail */}
                  <div
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setIsVideoModalOpen(true)}
                  >
                    {/* YouTube Thumbnail */}
                    <img
                      src="https://img.youtube.com/vi/q-PnhWzbeF4/maxresdefault.jpg"
                      alt="شاهد الفيديو التعريفي"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-secondary/90 flex items-center justify-center backdrop-blur-sm border-2 border-secondary/50 hover:scale-110 transition-all duration-300 cursor-pointer glow-gold-intense group-hover:scale-110 group-hover:glow-gold-intense">
                        <Play className="w-8 h-8 text-background transition-transform" fill="currentColor" />
                      </div>
                    </div>

                    {/* Overlay text */}
                    <div className="absolute bottom-4 right-4 left-4">
                      <div className="glass rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Video className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">شاهد الفيديو التعريفي</div>
                            <div className="text-sm text-muted-foreground">اضغط للمشاهدة</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">تقدمك في الدورة</span>
                      <span className="text-secondary font-semibold">65%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[65%] bg-gradient-to-l from-secondary to-secondary/70 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-8 -right-8 glass-gold rounded-2xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">شهادة معتمدة</div>
                    <div className="text-sm text-muted-foreground">عند الإتمام</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-8 glass rounded-2xl p-4 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 space-x-reverse">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="" className="w-8 h-8 rounded-full object-cover border-2 border-background" />
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="" className="w-8 h-8 rounded-full object-cover border-2 border-background" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="" className="w-8 h-8 rounded-full object-cover border-2 border-background" />
                  </div>
                  <div className="text-sm">
                    <span className="text-secondary font-semibold">+50</span>{" "}
                    <span className="text-muted-foreground">انضموا هذا الأسبوع</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-secondary/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-4">
              لماذا أكاديمية إبداع؟
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              <span className="text-foreground">منصة تعليمية</span>{" "}
              <span className="text-gradient-gold">متكاملة</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نقدم لك تجربة تعليمية فريدة تجمع بين المحتوى العربي الأصيل وأحدث تقنيات التعليم الإلكتروني
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative p-8 bg-card/50 border-border/50 hover:border-secondary/30 transition-all duration-500 group card-hover stagger-${index + 1} animate-fade-in-up`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-secondary" />
                  </div>

                  <h3 className="text-xl font-bold font-display mb-3 text-foreground group-hover:text-secondary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COURSES PREVIEW SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-4">
                دوراتنا المميزة
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold font-display">
                <span className="text-foreground">اكتشف</span>{" "}
                <span className="text-gradient-gold">دوراتنا</span>
              </h2>
            </div>
            <Link to="/courses">
              <Button variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10 group">
                <span>عرض جميع الدورات</span>
                <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card
                key={index}
                className={`overflow-hidden bg-card/50 border-border/50 hover:border-secondary/30 group card-hover stagger-${index + 1} animate-fade-in-up cursor-pointer`}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                {/* Course Image */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-background overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

                  {/* Badge */}
                  {course.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge className={`${course.badgeClass}`}>{course.badge}</Badge>
                    </div>
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform glow-gold">
                      <Play className="w-6 h-6 text-background" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-secondary">
                      <Star className="w-4 h-4 fill-secondary" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">({course.students} طالب)</span>
                  </div>

                  <h3 className="text-xl font-bold font-display mb-2 text-foreground group-hover:text-secondary transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{course.lessons} درس</span>
                    </div>
                    <div className="text-lg font-bold text-gradient-gold">
                      {course.price}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-4">
              آراء طلابنا
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              <span className="text-foreground">ماذا يقول</span>{" "}
              <span className="text-gradient-gold">طلابنا؟</span>
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`p-8 bg-card/50 border-border/50 hover:border-secondary/30 transition-all duration-500 relative stagger-${index + 1} animate-fade-in-up`}
              >
                {/* Quote mark */}
                <div className="absolute top-4 left-4 text-6xl font-serif-ar text-secondary/20 leading-none">
                  "
                </div>

                <div className="relative">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-secondary fill-secondary"
                      />
                    ))}
                  </div>

                  <p className="text-foreground/90 mb-6 leading-relaxed font-serif-ar text-lg">
                    {testimonial.content}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center">
                      <span className="font-bold text-secondary">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT / CREATIVE STUDIO SECTION - Dark & Gold Theme
          ═══════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-32 relative overflow-hidden">
        {/* Dark Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />

        {/* Ambient Gold Orbs */}
        <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[150px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 left-[5%] w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '3s' }} />

        {/* Texture overlay */}
        <div className="absolute inset-0 pattern-stars opacity-20" />

        {/* Floating Gold Particles */}
        <div className="absolute top-20 right-[15%] w-3 h-3 bg-secondary rounded-full animate-float opacity-60" />
        <div className="absolute bottom-32 left-[10%] w-2 h-2 bg-secondary/70 rounded-full animate-float-delayed opacity-50" />
        <div className="absolute top-1/2 right-[5%] w-4 h-4 bg-secondary/50 rounded-full animate-float-slow opacity-40" />
        <div className="absolute top-1/3 left-[20%] w-2 h-2 bg-secondary rounded-full animate-float opacity-30" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Editorial Header with Dramatic Typography */}
          <div className="mb-20 relative">
            {/* Oversized Background Text */}
            <div className="absolute -top-16 right-0 text-[12rem] font-black text-secondary/[0.03] leading-none select-none pointer-events-none font-display hidden lg:block">
              إبداع
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="relative">
                {/* Small Label */}
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="w-12 h-[2px] bg-gradient-to-l from-secondary to-transparent" />
                  <span className="text-sm font-bold text-secondary tracking-[0.2em] uppercase">استوديو الإبداع</span>
                </div>

                {/* Main Title - Bold Editorial */}
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-display leading-[0.9] mb-4">
                  <span className="block text-foreground">اصنع</span>
                  <span className="block text-gradient-gold text-glow-gold">محتواك</span>
                  <span className="block text-foreground">بأسلوبك</span>
                </h2>
              </div>

              {/* Side Description */}
              <div className="max-w-md lg:pb-4">
                <p className="text-muted-foreground text-lg leading-relaxed font-serif-ar">
                  نؤمن بأن كل مبدع يملك قصة فريدة تستحق أن تُروى.
                  في استوديوهاتنا المجهزة بأحدث التقنيات، نساعدك على تحويل رؤيتك إلى واقع مرئي مذهل.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid - Asymmetric Layout */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left Column - Feature Cards */}
            <div className="lg:col-span-4 space-y-6">
              {/* Feature Card 1 - Dark with Gold Accent */}
              <div className="group relative glass p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-secondary/30 border border-border/50 animate-fade-in-up stagger-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 group-hover:bg-secondary/20 transition-all duration-700" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-6 group-hover:glow-gold transition-all">
                    <Camera className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 font-display group-hover:text-secondary transition-colors">تصوير احترافي</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    معدات تصوير من الطراز الأول مع إضاءة سينمائية متقدمة
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-secondary/20 rounded-bl-lg" />
              </div>

              {/* Feature Card 2 - Glass Gold Accent */}
              <div className="group relative glass-gold p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:border-secondary/40 animate-fade-in-up stagger-2">
                <div className="absolute -bottom-8 -right-8 w-24 h-24 border-4 border-secondary/10 rounded-full group-hover:border-secondary/30 transition-colors" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                    <Aperture className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 font-display group-hover:text-secondary transition-colors">مونتاج متقدم</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    برامج مونتاج احترافية مع تأثيرات بصرية مذهلة
                  </p>
                </div>
              </div>

              {/* Feature Card 3 - Gradient Card */}
              <div className="group relative p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl animate-fade-in-up stagger-3 border-gradient">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-secondary/10" />
                <div className="absolute inset-0 pattern-stars opacity-30" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mb-6 group-hover:glow-gold transition-all">
                    <Zap className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 font-display group-hover:text-secondary transition-colors">إنتاج سريع</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    نسلم مشاريعك بجودة عالية وفي الوقت المحدد
                  </p>

                  {/* Stats */}
                  <div className="mt-6 pt-6 border-t border-border/50 flex items-center gap-4">
                    <div>
                      <div className="text-3xl font-black text-gradient-gold">48h</div>
                      <div className="text-xs text-muted-foreground">متوسط التسليم</div>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div>
                      <div className="text-3xl font-black text-gradient-gold">4K</div>
                      <div className="text-xs text-muted-foreground">جودة الإخراج</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column - Main Image with Dramatic Framing */}
            <div className="lg:col-span-8 relative">
              {/* Image Container with Editorial Offset */}
              <div className="relative animate-fade-in-left stagger-2">
                {/* Background Frame - Offset with Gold Accent */}
                <div className="absolute -top-6 -right-6 w-full h-full bg-secondary/5 rounded-3xl" />
                <div className="absolute -top-3 -right-3 w-full h-full border-2 border-secondary/20 rounded-3xl" />

                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-border/50">
                  <img
                    src="https://clic-ibdae.com/wp-content/uploads/2025/03/IMG-20250227-WA0133-scaled.jpg"
                    alt="استوديو إبداع للتصوير الاحترافي"
                    className="w-full h-[600px] lg:h-[700px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay - Dark with Gold tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-transparent to-primary/10 opacity-60" />

                  {/* Bottom Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                      {/* Quote */}
                      <div className="max-w-lg">
                        <div className="text-5xl text-secondary/30 font-serif-ar leading-none mb-2">"</div>
                        <blockquote className="text-xl lg:text-2xl text-foreground font-serif-ar leading-relaxed">
                          الإبداع ليس موهبة، إنه طريقة في النظر إلى الأشياء
                        </blockquote>
                        <cite className="block mt-4 text-muted-foreground text-sm">— فريق أكاديمية إبداع</cite>
                      </div>

                      {/* CTA Button */}
                      <div className="flex-shrink-0">
                        <button className="group/btn relative px-8 py-4 btn-gradient-gold text-background font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:glow-gold-intense">
                          <span className="relative z-10 flex items-center gap-2">
                            <span>احجز جلستك</span>
                            <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge - Top Left */}
                  <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2 px-4 py-2 glass-gold rounded-full shadow-lg animate-float border border-secondary/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-secondary">متاح الآن</span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 right-6 w-16 h-16 border-2 border-secondary/30 rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="w-12 h-12 border-2 border-secondary/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                </div>

                {/* Stats Bar - Below Image */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { number: '+200', label: 'مشروع منجز', delay: '1' },
                    { number: '+50', label: 'عميل سعيد', delay: '2' },
                    { number: '5★', label: 'تقييم متوسط', delay: '3' },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`text-center p-6 glass rounded-2xl border border-border/50 hover:border-secondary/30 animate-fade-in-up stagger-${stat.delay} group transition-all duration-300 cursor-default hover-lift`}
                    >
                      <div className="text-3xl lg:text-4xl font-black text-gradient-gold mb-1 group-hover:text-glow-gold transition-all">
                        {stat.number}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border-gradient">
            {/* Background */}
            <div className="absolute inset-0 cta-gradient-bg" />
            <div className="absolute inset-0 pattern-stars opacity-20" />

            {/* Content */}
            <div className="relative p-12 md:p-20 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-8">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary">ابدأ رحلتك التعليمية اليوم</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
                <span className="text-foreground">هل أنت مستعد لإطلاق</span>
                <br />
                <span className="text-gradient-gold text-glow-gold">إبداعك الإعلامي؟</span>
              </h2>

              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                انضم إلى أكثر من 500 طالب يتعلمون صناعة المحتوى الإعلامي
                واحصل على شهادة معتمدة عند إتمام الدورات
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="btn-gradient-gold text-background font-bold text-lg px-10 py-6 hover:glow-gold-intense"
                  >
                    سجل الآن مجاناً
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-foreground/20 text-foreground hover:bg-foreground/5 px-10 py-6"
                  >
                    تصفح الدورات
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span>ضمان استرداد الأموال</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span>دعم فني 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span>شهادات معتمدة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <img
                  src="https://clic-ibdae.com/wp-content/uploads/2023/11/logo-clic-ibdae_.png"
                  alt="CLIC IBDAE Logo"
                  className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div>
                  <h3 className="text-xl font-bold font-display text-gradient-gold">
                    أكاديمية إبداع
                  </h3>
                  <p className="text-xs text-muted-foreground">Ibdae Academy</p>
                </div>
              </Link>
              <p className="text-muted-foreground max-w-md mb-6">
                منصة تعليمية عربية رائدة متخصصة في صناعة المحتوى الإعلامي.
                نسعى لتمكين المبدعين العرب من تحقيق أحلامهم في عالم الإعلام.
              </p>
              <div className="flex gap-4">
                {['twitter', 'youtube', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-secondary/20 hover:text-secondary transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-foreground mb-4">روابط سريعة</h4>
              <ul className="space-y-3">
                {['الدورات', 'المدرسين', 'الأسعار', 'المدونة'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">الدعم</h4>
              <ul className="space-y-3">
                {['مركز المساعدة', 'تواصل معنا', 'الشروط والأحكام', 'سياسة الخصوصية'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="divider-gold my-12" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
            <p>© 2024 أكاديمية إبداع. جميع الحقوق محفوظة.</p>
            <p>صُنع بـ ❤️ للمبدعين العرب</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
          VIDEO MODAL
          ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 bg-background/95 backdrop-blur-xl border-secondary/20 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>الفيديو التعريفي</DialogTitle>
          </VisuallyHidden>
          <div className="relative aspect-video w-full">
            {isVideoModalOpen && (
              <iframe
                src="https://www.youtube.com/embed/q-PnhWzbeF4?autoplay=1&rel=0"
                title="الفيديو التعريفي"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const features = [
  {
    icon: Video,
    title: "دروس فيديو احترافية",
    description: "محتوى مرئي عالي الجودة مُعد بعناية من قبل خبراء في المجال مع تطبيقات عملية.",
  },
  {
    icon: Users,
    title: "مجتمع داعم",
    description: "انضم إلى مجتمع من المبدعين العرب للتواصل وتبادل الخبرات والإلهام.",
  },
  {
    icon: Award,
    title: "شهادات معتمدة",
    description: "احصل على شهادات معتمدة عند إتمام الدورات لتعزيز مسيرتك المهنية.",
  },
  {
    icon: BookOpen,
    title: "مناهج متدرجة",
    description: "مسارات تعليمية مصممة بعناية تناسب جميع المستويات من المبتدئ للمحترف.",
  },
  {
    icon: Palette,
    title: "مشاريع تطبيقية",
    description: "طبق ما تتعلمه في مشاريع حقيقية لبناء معرض أعمالك الخاص.",
  },
  {
    icon: Mic,
    title: "دعم مستمر",
    description: "فريق دعم متاح على مدار الساعة للإجابة على استفساراتك ومساعدتك.",
  },
];

const courses = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop",
    title: "أساسيات التصوير الاحترافي",
    description: "تعلم أسرار التصوير من الصفر حتى الاحتراف مع تطبيقات عملية على أحدث الكاميرات.",
    rating: "4.9",
    students: "234",
    lessons: 24,
    price: "199 د.م",
    badge: "الأكثر مبيعاً",
    badgeClass: "bg-secondary text-background",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
    title: "المونتاج الإبداعي",
    description: "إتقان برامج المونتاج الاحترافية وتقنيات التحرير السينمائي.",
    rating: "4.8",
    students: "189",
    lessons: 32,
    price: "249 د.م",
    badge: "جديد",
    badgeClass: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=400&fit=crop",
    title: "صناعة البودكاست",
    description: "من الفكرة إلى النشر - تعلم إنتاج بودكاست احترافي يجذب المستمعين.",
    rating: "4.7",
    students: "156",
    lessons: 18,
    price: "149 د.م",
    badge: null,
    badgeClass: "",
  },
];

const testimonials = [
  {
    name: "أحمد محمد",
    role: "صانع محتوى",
    content: "أكاديمية إبداع غيرت مسيرتي المهنية تماماً. الدورات عملية ومفيدة جداً والمدرسين خبراء حقيقيين.",
  },
  {
    name: "سارة العلي",
    role: "مصورة فوتوغرافية",
    content: "المحتوى العربي الأصيل والجودة العالية هي ما يميز هذه المنصة. أنصح بها كل من يريد التعلم.",
  },
  {
    name: "محمد خالد",
    role: "منتج فيديو",
    content: "الدعم الفني ممتاز والمجتمع داعم جداً. تعلمت أكثر مما توقعت في وقت قصير.",
  },
];

export default Index;
