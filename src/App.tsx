import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CropRecommendation from "./pages/CropRecommendation";
import YieldPrediction from "./pages/YieldPrediction";
import FertilizerPlan from "./pages/FertilizerPlan";
import NewPrediction from "./pages/NewPrediction";
import Results from "./pages/Results";
import History from "./pages/History";
import WeatherUpdates from "./pages/WeatherUpdates";
import SmartTips from "./pages/SmartTips";
import MapView from "./pages/MapView";
import AboutDevelopers from "./pages/AboutDevelopers";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <SidebarInset className="flex-1">
        {children}
      </SidebarInset>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/crop-recommendation" element={<ProtectedLayout><CropRecommendation /></ProtectedLayout>} />
          <Route path="/yield-prediction" element={<ProtectedLayout><YieldPrediction /></ProtectedLayout>} />
          <Route path="/fertilizer-plan" element={<ProtectedLayout><FertilizerPlan /></ProtectedLayout>} />
          <Route path="/new-prediction" element={<ProtectedLayout><NewPrediction /></ProtectedLayout>} />
          <Route path="/results" element={<ProtectedLayout><Results /></ProtectedLayout>} />
          <Route path="/results/:id" element={<ProtectedLayout><Results /></ProtectedLayout>} />
          <Route path="/history" element={<ProtectedLayout><History /></ProtectedLayout>} />
          <Route path="/weather" element={<ProtectedLayout><WeatherUpdates /></ProtectedLayout>} />
          <Route path="/smart-tips" element={<ProtectedLayout><SmartTips /></ProtectedLayout>} />
          <Route path="/map" element={<ProtectedLayout><MapView /></ProtectedLayout>} />
          <Route path="/about" element={<ProtectedLayout><AboutDevelopers /></ProtectedLayout>} />
          <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
