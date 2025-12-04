import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  BookOpen,
  Loader2,
  ArrowRight,
  Tag,
} from "lucide-react";
import AdminUsers from "./AdminUsers";
import AdminCourses from "./AdminCourses";
import AdminCategories from "./AdminCategories";

// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD - أكاديمية إبداع
// ═══════════════════════════════════════════════════════════════

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
      return;
    }

    if (!authLoading && user && !isAdmin) {
      navigate("/");
      return;
    }
  }, [authLoading, user, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in-up">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4 text-muted-foreground hover:text-secondary hover:bg-secondary/10 group"
            >
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              <span>العودة للرئيسية</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-secondary/20">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display">
                  <span className="text-foreground">لوحة</span>{" "}
                  <span className="text-gradient-gold">التحكم</span>
                </h1>
                <p className="text-muted-foreground">إدارة المستخدمين والدورات والفئات</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in-up stagger-1">
            <TabsList className="glass border-border/50 mb-8">
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                المستخدمين
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2">
                <BookOpen className="w-4 h-4" />
                الدورات
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <Tag className="w-4 h-4" />
                الفئات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-0">
              <AdminUsers />
            </TabsContent>

            <TabsContent value="courses" className="mt-0">
              <AdminCourses />
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <AdminCategories />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} أكاديمية إبداع - لوحة الإدارة
        </div>
      </footer>
    </div>
  );
};

export default Admin;
