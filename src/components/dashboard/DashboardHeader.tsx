import { Sprout } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary rounded-lg">
          <Sprout className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Smart Agriculture Advisor</h2>
          <p className="text-sm text-muted-foreground">AI-powered farming insights</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>
    </div>
  );
};

export default DashboardHeader;
