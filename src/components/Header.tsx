import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import UserAvatar from "@/components/UserAvatar";

// ═══════════════════════════════════════════════════════════════
// SHARED HEADER COMPONENT - أكاديمية إبداع
// ═══════════════════════════════════════════════════════════════

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut, profile, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  console.log('[Header] Render:', {
    loading,
    hasUser: !!user,
    hasProfile: !!profile,
    userEmail: user?.email,
    profileRole: profile?.role,
    profileStatus: profile?.status
  });

  const isActive = (path: string) => {
    if (path === "/courses") {
      return location.pathname === "/courses" || location.pathname.startsWith("/course/");
    }
    return location.pathname === path;
  };

  const handleMobileSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="https://clic-ibdae.com/wp-content/uploads/2023/11/logo-clic-ibdae_.png"
              alt="CLIC IBDAE Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-secondary font-semibold"
                  : "text-foreground/80 hover:text-secondary"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              to="/courses"
              className={`transition-colors ${
                isActive("/courses")
                  ? "text-secondary font-semibold"
                  : "text-foreground/80 hover:text-secondary"
              }`}
            >
              الدورات
            </Link>
            <a
              href="/#features"
              className="text-foreground/80 hover:text-secondary transition-colors"
            >
              المميزات
            </a>
            <a
              href="/#testimonials"
              className="text-foreground/80 hover:text-secondary transition-colors"
            >
              آراء الطلاب
            </a>
            {isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors ${
                  isActive("/admin")
                    ? "text-secondary font-semibold"
                    : "text-secondary/80 hover:text-secondary"
                }`}
              >
                لوحة التحكم
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-secondary/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-foreground/80 hover:text-secondary transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-foreground/80 hover:text-secondary transition-colors" />
              )}
            </Button>

            {loading ? (
              <div className="h-10 w-10 rounded-full bg-secondary/20 animate-pulse" />
            ) : user ? (
              <UserAvatar />
            ) : (
              <>
                <Link to="/signin">
                  <Button
                    variant="ghost"
                    className="text-foreground/80 hover:text-secondary hover:bg-secondary/10"
                  >
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-gradient-gold text-background font-semibold px-6 hover:glow-gold">
                    ابدأ الآن
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-6 glass rounded-2xl animate-fade-in-down">
            <div className="flex flex-col gap-4">
              {/* User info for mobile */}
              {user && profile && (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-semibold">
                      {profile.full_name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{profile.full_name || "مستخدم"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="divider-gold my-2" />
                </>
              )}

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 transition-colors ${
                  isActive("/")
                    ? "text-secondary font-semibold"
                    : "text-foreground/80 hover:text-secondary"
                }`}
              >
                الرئيسية
              </Link>
              <Link
                to="/courses"
                onClick={() => setIsMenuOpen(false)}
                className={`py-2 transition-colors ${
                  isActive("/courses")
                    ? "text-secondary font-semibold"
                    : "text-foreground/80 hover:text-secondary"
                }`}
              >
                الدورات
              </Link>
              <a
                href="/#features"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground/80 hover:text-secondary transition-colors py-2"
              >
                المميزات
              </a>
              <a
                href="/#testimonials"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground/80 hover:text-secondary transition-colors py-2"
              >
                آراء الطلاب
              </a>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-2 transition-colors text-secondary ${
                    isActive("/admin") ? "font-semibold" : "hover:text-secondary"
                  }`}
                >
                  لوحة التحكم
                </Link>
              )}

              <div className="divider-gold my-2" />

              {/* Theme Toggle for Mobile */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full justify-center gap-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5" />
                    <span>الوضع النهاري</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>الوضع الليلي</span>
                  </>
                )}
              </Button>

              <div className="divider-gold my-2" />

              {loading ? (
                <div className="h-12 bg-secondary/20 animate-pulse rounded-lg" />
              ) : user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">
                      الملف الشخصي
                    </Button>
                  </Link>
                  <Button
                    onClick={handleMobileSignOut}
                    variant="outline"
                    className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center">
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="btn-gradient-gold text-background w-full">
                      ابدأ الآن
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
