import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";

interface RecentItem {
  id: string;
  created_at: string;
  agri_results: {
    best_crop: string;
    yield_prediction: number;
  }[];
}

const RecentPredictions = () => {
  const navigate = useNavigate();
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecent();
  }, []);

  const fetchRecent = async () => {
    try {
      const { data } = await supabase
        .from("agri_inputs")
        .select(`
          id,
          created_at,
          agri_results (
            best_crop,
            yield_prediction
          )
        `)
        .order("created_at", { ascending: false })
        .limit(3);

      setRecent(data || []);
    } catch (error) {
      console.error("Fetch recent error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-medium">
        <CardContent className="py-8">
          <div className="animate-pulse text-center">Loading recent predictions...</div>
        </CardContent>
      </Card>
    );
  }

  if (recent.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
          <CardDescription>Your latest AI-powered analyses</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            No predictions yet. Get started with your first analysis!
          </p>
          <Button onClick={() => navigate("/new-prediction")}>
            Create First Prediction
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Predictions</CardTitle>
            <CardDescription>Your latest AI-powered analyses</CardDescription>
          </div>
          <Button variant="outline" onClick={() => navigate("/history")}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recent.map((item) => {
            const result = item.agri_results[0];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-medium transition-smooth"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg mb-1">
                    {result?.best_crop || "Processing..."}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {result && (
                      <span className="text-accent font-medium">
                        {result.yield_prediction.toLocaleString()} kg/ha
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/results/${item.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPredictions;
