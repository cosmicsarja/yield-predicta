import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sprout, Brain, TrendingUp, ArrowRight, Leaf, FlaskConical, Zap, Shield, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    { value: "50K+", label: t("home.stats.farmers") },
    { value: "2M+", label: t("home.stats.predictions") },
    { value: "94%", label: t("home.stats.accuracy") },
    { value: "28", label: t("home.stats.states") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary rounded-xl shadow-lg">
              <Sprout className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <span className="text-2xl font-bold">AgriAdvisor</span>
              <span className="hidden sm:block text-xs text-muted-foreground">Smart Farming AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="outline" onClick={() => navigate("/auth")} size="sm">
              {t("common.signIn")}
            </Button>
            <Button onClick={() => navigate("/auth")} size="sm" className="shadow-medium hidden sm:flex">
              {t("common.getStarted")}
            </Button>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 border border-primary/20">
            <Zap className="h-4 w-4" />
            {t("home.trustedBy")}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">{t("home.title").split(" ").slice(0, 2).join(" ")}</span>
            {" "}{t("home.title").split(" ").slice(2).join(" ")}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="shadow-medium hover:shadow-strong transition-smooth gap-2"
            >
              {t("common.startPredicting")}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              {t("common.learnMore")}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-card rounded-2xl border shadow-soft hover:shadow-medium transition-smooth">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-medium hover:shadow-strong transition-smooth border-2 border-primary/20 group">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-smooth">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{t("home.features.crop.title")}</CardTitle>
              <CardDescription>{t("home.features.crop.desc")}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-smooth border-2 border-accent/20 group">
            <CardHeader>
              <div className="p-3 bg-accent/10 rounded-xl w-fit mb-4 group-hover:bg-accent/20 transition-smooth">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <CardTitle>{t("home.features.yield.title")}</CardTitle>
              <CardDescription>{t("home.features.yield.desc")}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-smooth border-2 border-secondary/20 group">
            <CardHeader>
              <div className="p-3 bg-secondary/10 rounded-xl w-fit mb-4 group-hover:bg-secondary/20 transition-smooth">
                <FlaskConical className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle>{t("home.features.fertilizer.title")}</CardTitle>
              <CardDescription>{t("home.features.fertilizer.desc")}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">{t("home.howItWorks.title")}</h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { key: "step1", num: "01" },
              { key: "step2", num: "02" },
              { key: "step3", num: "03" },
              { key: "step4", num: "04" },
            ].map(({ key, num }) => (
              <div key={key} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary/30 transition-smooth shadow-soft">
                  <span className="text-xl font-bold text-primary">{num}</span>
                </div>
                <h3 className="font-semibold mb-2">{t(`home.howItWorks.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`home.howItWorks.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Shield, text: "Secure & Private" },
            { icon: Globe, text: "22 Languages Supported" },
            { icon: Zap, text: "Real-time AI Predictions" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 p-4 bg-card rounded-xl border shadow-soft">
              <Icon className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Card className="shadow-strong bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
          <CardContent className="text-center py-12">
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-6">
              <Brain className="h-14 w-14 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{t("home.cta.title")}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{t("home.cta.subtitle")}</p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="shadow-medium gap-2"
            >
              {t("home.cta.button")}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>{t("home.footer")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
