import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { fetchPredictionHistory, type PredictionSummary } from "@/lib/dashboard-data";

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<PredictionSummary[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await fetchPredictionHistory();
      setHistory(data);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <DashboardHeader />
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Prediction History</h1>
          <p className="text-muted-foreground">
            View all your past predictions and results
          </p>
        </div>

        {history.length === 0 ? (
          <Card className="shadow-medium">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No predictions yet. Create your first prediction to get started!
              </p>
              <Button onClick={() => navigate("/new-prediction")}>
                Create Prediction
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {history.map(({ input, result }) => (
              <Card key={input.id} className="shadow-medium hover:shadow-strong transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">
                        {result?.best_crop || "Processing..."}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(input.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/results/${input.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">N-P-K</p>
                      <p className="font-semibold">
                        {input.nitrogen}-{input.phosphorus}-{input.potassium}
                      </p>
                    </div>
                    {result && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Crop</p>
                          <p className="font-semibold text-primary">{result.best_crop}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Yield</p>
                          <p className="font-semibold text-accent">
                            {result.yield_prediction.toLocaleString()} kg/ha
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
