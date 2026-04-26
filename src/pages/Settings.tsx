import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, MapPin, Loader2, Languages, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function Settings() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "",
    farm_location: "",
    farm_size: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          farm_location: data.farm_location || "",
          farm_size: data.farm_size?.toString() || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          farm_location: profile.farm_location,
          farm_size: profile.farm_size ? parseFloat(profile.farm_size) : null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success(t("common.success"));
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          {t("settings.title")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("settings.subtitle")}</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t("settings.profileInfo")}
          </CardTitle>
          <CardDescription>{t("settings.profileDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("settings.fullName")}
              </Label>
              <Input
                id="full_name"
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder={t("settings.namePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="farm_location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("settings.farmLocation")}
              </Label>
              <Input
                id="farm_location"
                type="text"
                value={profile.farm_location}
                onChange={(e) => setProfile({ ...profile, farm_location: e.target.value })}
                placeholder={t("settings.locationPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="farm_size">{t("settings.farmSize")}</Label>
              <Input
                id="farm_size"
                type="number"
                step="0.01"
                value={profile.farm_size}
                onChange={(e) => setProfile({ ...profile, farm_size: e.target.value })}
                placeholder={t("settings.sizePlaceholder")}
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("common.saving")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t("common.saveChanges")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            {t("settings.languageSettings")}
          </CardTitle>
          <CardDescription>{t("settings.languageDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
            <div>
              <p className="font-medium text-sm">{t("common.language")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("settings.languageDesc")}</p>
            </div>
            <LanguageSelector />
          </div>
        </CardContent>
      </Card>

      {/* Weather Integration */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.weatherIntegration")}</CardTitle>
          <CardDescription>{t("settings.weatherDesc")}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
