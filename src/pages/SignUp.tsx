import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Loader2,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// أكاديمية إبداع - SIGN UP PAGE
// ═══════════════════════════════════════════════════════════════

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signInWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);

    setIsLoading(false);

    if (error) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم إنشاء الحساب بنجاح!",
        description: "يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك",
      });
      navigate("/signin");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    setIsLoading(false);

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-muted-foreground hover:text-secondary hover:bg-secondary/10 group animate-fade-in-up"
          >
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            <span>العودة للرئيسية</span>
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 animate-fade-in-up stagger-1">
            <img
              src="https://clic-ibdae.com/wp-content/uploads/2023/11/logo-clic-ibdae_.png"
              alt="CLIC IBDAE Logo"
              className="w-12 h-12 object-contain"
            />
          </Link>

          {/* Header */}
          <div className="mb-8 animate-fade-in-up stagger-2">
            <h2 className="text-3xl font-bold font-display mb-2">
              <span className="text-foreground">أنشئ حسابك</span>{" "}
              <span className="text-gradient-gold">الآن</span>
            </h2>
            <p className="text-muted-foreground">
              انضم إلى مجتمع المبدعين وابدأ رحلتك التعليمية
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2 animate-fade-in-up stagger-3">
              <Label htmlFor="name" className="text-foreground font-medium">
                الاسم الكامل
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pr-10 h-12 bg-muted/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20 text-foreground placeholder:text-muted-foreground"
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2 animate-fade-in-up stagger-4">
              <Label htmlFor="email" className="text-foreground font-medium">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 h-12 bg-muted/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20 text-foreground placeholder:text-muted-foreground"
                  required
                  autoComplete="email"
                  dir="ltr"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 animate-fade-in-up stagger-5">
              <Label htmlFor="password" className="text-foreground font-medium">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10 h-12 bg-muted/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20 text-foreground placeholder:text-muted-foreground"
                  required
                  autoComplete="new-password"
                  dir="ltr"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 animate-fade-in-up stagger-6">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                تأكيد كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 pl-10 h-12 bg-muted/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20 text-foreground placeholder:text-muted-foreground"
                  required
                  autoComplete="new-password"
                  dir="ltr"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 animate-fade-in-up stagger-7">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1 border-border/50 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                disabled={isLoading}
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
              >
                أوافق على{" "}
                <a href="#" className="text-secondary hover:underline">
                  الشروط والأحكام
                </a>{" "}
                و{" "}
                <a href="#" className="text-secondary hover:underline">
                  سياسة الخصوصية
                </a>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!agreedToTerms || isLoading}
              className="w-full h-12 btn-gradient-gold text-background font-bold text-lg hover:glow-gold disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up stagger-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>إنشاء الحساب</span>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative animate-fade-in-up stagger-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full divider-gold" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  أو سجل باستخدام
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in-up stagger-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="h-12 border-border/50 hover:border-secondary/50 hover:bg-secondary/5"
              >
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="h-12 border-border/50 hover:border-secondary/50 hover:bg-secondary/5"
              >
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>Facebook</span>
              </Button>
            </div>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-muted-foreground animate-fade-in-up stagger-8">
            لديك حساب بالفعل؟{" "}
            <Link to="/signin" className="text-secondary hover:underline font-semibold">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary/30" />
        <div className="absolute inset-0 pattern-stars opacity-20" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="max-w-lg">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary">+500 طالب مسجل</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6 animate-fade-in-up stagger-1">
              <span className="text-foreground">ابدأ رحلتك</span>
              <br />
              <span className="text-gradient-gold text-glow-gold">نحو الإبداع</span>
            </h2>

            <p className="text-lg text-foreground/70 mb-8 animate-fade-in-up stagger-2">
              انضم إلى آلاف المبدعين العرب الذين يتعلمون صناعة المحتوى الإعلامي الاحترافي
            </p>

            {/* Features */}
            <div className="space-y-4 animate-fade-in-up stagger-3">
              {[
                "دورات احترافية في التصوير والمونتاج",
                "شهادات معتمدة عند الإتمام",
                "مجتمع داعم من المبدعين",
                "دعم فني على مدار الساعة",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            {/* Video Preview Card */}
            <div className="mt-12 glass rounded-2xl p-6 animate-fade-in-up stagger-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Play className="w-8 h-8 text-secondary" fill="currentColor" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">شاهد كيف يعمل</div>
                  <div className="text-sm text-muted-foreground">فيديو تعريفي - 2 دقيقة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
