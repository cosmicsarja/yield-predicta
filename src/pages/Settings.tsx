import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Settings() {
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
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          farm_location: profile.farm_location,
          farm_size: profile.farm_size ? parseFloat(profile.farm_size) : null,
        });

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile and account preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal and farm details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="full_name"
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="farm_location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Farm Location
              </Label>
              <Input
                id="farm_location"
                type="text"
                value={profile.farm_location}
                onChange={(e) => setProfile({ ...profile, farm_location: e.target.value })}
                placeholder="City, State"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="farm_size">Farm Size (in hectares)</Label>
              <Input
                id="farm_size"
                type="number"
                step="0.01"
                value={profile.farm_size}
                onChange={(e) => setProfile({ ...profile, farm_size: e.target.value })}
                placeholder="Enter farm size"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Weather Integration</CardTitle>
          <CardDescription>
            Live weather now uses a public forecast service, so no manual API key setup is required.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
