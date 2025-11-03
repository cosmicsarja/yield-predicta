import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Brain, TrendingUp, Users, ArrowRight, Leaf, CloudRain, FlaskConical } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">AgriAdvisor</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")} className="shadow-medium">
              Get Started
            </Button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            AI-Powered <span className="text-gradient">Smart Agriculture</span> Advisor
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Make data-driven farming decisions with advanced AI predictions for crop recommendations, 
            yield forecasting, and fertilizer optimization.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="shadow-medium hover:shadow-strong transition-smooth"
            >
              Start Predicting
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-medium hover:shadow-strong transition-smooth border-2 border-primary/20">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Crop Recommendation</CardTitle>
              <CardDescription>
                Get AI-powered suggestions for the best crops based on your soil and climate data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-smooth border-2 border-accent/20">
            <CardHeader>
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <CardTitle>Yield Prediction</CardTitle>
              <CardDescription>
                Accurate forecasts of expected yields to help you plan better and maximize profits
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-smooth border-2 border-secondary/20">
            <CardHeader>
              <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-4">
                <FlaskConical className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle>Fertilizer Advisory</CardTitle>
              <CardDescription>
                Optimized fertilizer recommendations to improve soil health and crop productivity
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Enter Data</h3>
              <p className="text-sm text-muted-foreground">
                Input soil parameters, weather conditions, and farm details
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our ML models process your data for accurate predictions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-sm text-muted-foreground">
                Receive crop, yield, and fertilizer recommendations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-semibold mb-2">Make Decisions</h3>
              <p className="text-sm text-muted-foreground">
                Implement insights to optimize your farm productivity
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="shadow-strong bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
          <CardContent className="text-center py-12">
            <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join farmers using AI to make smarter decisions and increase their yields
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="shadow-medium"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Smart Agriculture Advisor. Powered by AI for Farmers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
