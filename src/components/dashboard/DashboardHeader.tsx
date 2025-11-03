import { Sprout } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary rounded-lg">
        <Sprout className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <h2 className="text-xl font-bold">Smart Agriculture Advisor</h2>
        <p className="text-sm text-muted-foreground">AI-powered farming insights</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
