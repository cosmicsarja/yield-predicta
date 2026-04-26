import { NavLink } from "react-router-dom";
import {
  Home,
  Sprout,
  BarChart,
  Beaker,
  ClipboardList,
  History,
  CloudSun,
  Lightbulb,
  Users,
  Settings,
  LogOut,
  MapPin,
  MessageCircle,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";

export function AppSidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { title: t("nav.dashboard"), url: "/dashboard", icon: Home },
    { title: t("nav.cropRecommendation"), url: "/crop-recommendation", icon: Sprout },
    { title: t("nav.yieldPrediction"), url: "/yield-prediction", icon: BarChart },
    { title: t("nav.fertilizerPlan"), url: "/fertilizer-plan", icon: Beaker },
    { title: t("nav.results"), url: "/results", icon: ClipboardList },
    { title: t("nav.history"), url: "/history", icon: History },
    { title: t("nav.weather"), url: "/weather", icon: CloudSun },
    { title: t("nav.smartTips"), url: "/smart-tips", icon: Lightbulb },
    { title: t("nav.aiChat"), url: "/chat", icon: MessageCircle },
    { title: t("nav.map"), url: "/map", icon: MapPin },
    { title: t("nav.about"), url: "/about", icon: Users },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
    { title: t("nav.profile"), url: "/profile", icon: User },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t("common.error"));
    } else {
      toast.success(t("common.success"));
      navigate("/auth");
    }
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-0">
        <div className="flex flex-col gap-0">
          {/* Brand Header */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/20 to-accent/10 border-b border-border">
            <div className="p-2 bg-primary rounded-xl shadow-md">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">AgriAdvisor</h2>
              <p className="text-xs text-muted-foreground">Smart Farming AI</p>
            </div>
          </div>
          {/* Language Selector in sidebar */}
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t("common.language")}</span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                          : "hover:bg-accent/50 transition-all duration-200"
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("nav.logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
