import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, History, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PredictionCards from "@/components/dashboard/PredictionCards";
import RecentPredictions from "@/components/dashboard/RecentPredictions";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t("common.error"));
    } else {
      toast.success(t("common.success"));
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">{t("common.loading")}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <DashboardHeader />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/history")}
              >
                <History className="mr-2 h-4 w-4" />
                {t("nav.history")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("nav.logout")}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t("nav.dashboard")}</h1>
            <p className="text-muted-foreground">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate("/new-prediction")}
            className="shadow-medium hover:shadow-strong transition-smooth"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t("common.startPredicting")}
          </Button>
        </div>

        {/* Prediction Overview Cards */}
        <PredictionCards />

        {/* Recent Predictions */}
        <RecentPredictions />
      </main>
    </div>
  );
};

export default Dashboard;
