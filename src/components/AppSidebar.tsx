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

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Crop Recommendation", url: "/crop-recommendation", icon: Sprout },
  { title: "Yield Prediction", url: "/yield-prediction", icon: BarChart },
  { title: "Fertilizer Plan", url: "/fertilizer-plan", icon: Beaker },
  { title: "Results Summary", url: "/results", icon: ClipboardList },
  { title: "History", url: "/history", icon: History },
  { title: "Weather Updates", url: "/weather", icon: CloudSun },
  { title: "Smart Tips", url: "/smart-tips", icon: Lightbulb },
  { title: "Map", url: "/map", icon: MapPin },
  { title: "About Developers", url: "/about", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg">AgriAdvisor</h2>
            <p className="text-xs text-muted-foreground">Smart Farming AI</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-accent"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
