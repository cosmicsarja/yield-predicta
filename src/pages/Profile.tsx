import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          farm_location: data.farm_location || "",
          farm_size: data.farm_size?.toString() || "",
        });
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

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
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading profile...</div>
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farm_location">Farm Location</Label>
                <Input
                  id="farm_location"
                  type="text"
                  value={profile.farm_location}
                  onChange={(e) =>
                    setProfile({ ...profile, farm_location: e.target.value })
                  }
                  placeholder="City, State/Province, Country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farm_size">Farm Size (hectares)</Label>
                <Input
                  id="farm_size"
                  type="number"
                  step="0.01"
                  value={profile.farm_size}
                  onChange={(e) =>
                    setProfile({ ...profile, farm_size: e.target.value })
                  }
                  placeholder="e.g., 5.5"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
