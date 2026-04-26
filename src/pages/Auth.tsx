import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN") navigate("/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) { toast.error(t("common.error")); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: fullName } },
    });
    setIsLoading(false);
    if (error) { toast.error(error.message); } else { toast.success("Account created! Please check your email."); }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error(t("common.error")); return; }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) { toast.error(error.message); } else { toast.success(t("common.success")); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Language Selector top right */}
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg">
            <Sprout className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AgriAdvisor</h1>
          <p className="text-muted-foreground">AI-powered farming insights</p>
        </div>

        <Card className="shadow-strong border-2">
          <CardHeader>
            <CardTitle>{t("auth.title")}</CardTitle>
            <CardDescription>{t("auth.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="signin">{t("auth.signIn")}</TabsTrigger>
                <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />{t("auth.email")}
                    </Label>
                    <Input id="signin-email" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />{t("auth.password")}
                    </Label>
                    <Input id="signin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
                  </div>
                  <Button type="submit" className="w-full gap-2 mt-2" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("auth.signIn")}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />{t("settings.fullName")}
                    </Label>
                    <Input id="signup-name" type="text" placeholder="John Farmer" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />{t("auth.email")}
                    </Label>
                    <Input id="signup-email" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />{t("auth.password")}
                    </Label>
                    <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
                  </div>
                  <Button type="submit" className="w-full gap-2 mt-2" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("auth.createAccount")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {t("home.footer")}
        </p>
      </div>
    </div>
  );
};

export default Auth;
