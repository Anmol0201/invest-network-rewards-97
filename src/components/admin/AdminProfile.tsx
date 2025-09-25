import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Save,
  Upload,
  Bell,
  AlertCircle,
  CheckCircle,
  Lock,
} from "lucide-react";

interface AdminProfileData {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string;
  position: string;
  bio: string;
  avatar: string | null;
  preferences: {
    theme: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    dashboard: {
      defaultView: string;
    };
  };
  notificationSettings: {
    emailAlerts: boolean;
    loginAlerts: boolean;
    withdrawalAlerts: boolean;
    systemAlerts: boolean;
  };
}

export function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      // First try the specific admin profile endpoint
      let response = await apiClient.get<AdminProfileData>("/admin/profile");

      // If that fails, try the general profile endpoint
      if (!response.success) {
        response = await apiClient.get<AdminProfileData>("/profile");
      }

      if (response.success && response.data) {
        // Extract profile data from nested response structure
        const responseData = response.data as any;
        const profileFromResponse = responseData.profile || responseData;

        // Ensure all required properties exist with proper defaults
        const profileData: AdminProfileData = {
          id: profileFromResponse.id || "1",
          userId: profileFromResponse.userId || "admin-1",
          name: profileFromResponse.name || "Admin User",
          email: profileFromResponse.email || "admin@example.com",
          phone: profileFromResponse.phone || "+1-234-567-8900",
          role: profileFromResponse.role || "admin",
          department: profileFromResponse.department || "Administration",
          position: profileFromResponse.position || "System Administrator",
          bio:
            profileFromResponse.bio ||
            "System administrator with full access privileges.",
          avatar: profileFromResponse.avatar || null,
          preferences: profileFromResponse.preferences || {
            theme: "light",
            language: "en",
            notifications: {
              email: true,
              push: true,
              sms: false,
            },
            dashboard: {
              defaultView: "overview",
            },
          },
          notificationSettings: profileFromResponse.notificationSettings || {
            emailAlerts: true,
            loginAlerts: true,
            withdrawalAlerts: true,
            systemAlerts: true,
          },
        };
        setProfile(profileData);
      } else {
        // Use fallback profile data
        setProfile({
          id: "1",
          userId: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          phone: "+1-234-567-8900",
          role: "admin",
          department: "Administration",
          position: "System Administrator",
          bio: "System administrator with full access privileges.",
          avatar: null,
          preferences: {
            theme: "light",
            language: "en",
            notifications: {
              email: true,
              push: true,
              sms: false,
            },
            dashboard: {
              defaultView: "overview",
            },
          },
          notificationSettings: {
            emailAlerts: true,
            loginAlerts: true,
            withdrawalAlerts: true,
            systemAlerts: true,
          },
        });
        setError("Using demo profile data - API endpoint not available");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      // Use fallback profile data on error
      setProfile({
        id: "1",
        userId: "admin-1",
        name: "Admin User",
        email: "admin@example.com",
        phone: "+1-234-567-8900",
        role: "admin",
        department: "Administration",
        position: "System Administrator",
        bio: "System administrator with full access privileges.",
        avatar: null,
        preferences: {
          theme: "light",
          language: "en",
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          dashboard: {
            defaultView: "overview",
          },
        },
        notificationSettings: {
          emailAlerts: true,
          loginAlerts: true,
          withdrawalAlerts: true,
          systemAlerts: true,
        },
      });
      setError("Using demo profile data - API connection failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      // Try admin endpoint first
      let response = await apiClient.put("/admin/profile", {
        name: profile.name,
        phone: profile.phone,
        department: profile.department,
        position: profile.position,
        bio: profile.bio,
      });

      // If that fails, try general profile endpoint
      if (!response.success) {
        response = await apiClient.put("/profile", {
          name: profile.name,
          phone: profile.phone,
          department: profile.department,
          position: profile.position,
          bio: profile.bio,
        });
      }

      if (response.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      setError(
        "Error updating profile: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateNotifications(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      // Try admin endpoint first
      let response = await apiClient.put("/admin/profile/notifications", {
        emailAlerts: profile.notificationSettings.emailAlerts,
        loginAlerts: profile.notificationSettings.loginAlerts,
        withdrawalAlerts: profile.notificationSettings.withdrawalAlerts,
        systemAlerts: profile.notificationSettings.systemAlerts,
      });

      // If that fails, try general profile endpoint
      if (!response.success) {
        response = await apiClient.put("/profile/notifications", {
          emailAlerts: profile.notificationSettings.emailAlerts,
          loginAlerts: profile.notificationSettings.loginAlerts,
          withdrawalAlerts: profile.notificationSettings.withdrawalAlerts,
          systemAlerts: profile.notificationSettings.systemAlerts,
        });
      }

      if (response.success) {
        setSuccess("Notification settings updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Failed to update notification settings");
      }
    } catch (err) {
      setError(
        "Error updating notification settings: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePreferences(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      // Try admin endpoint first
      let response = await apiClient.put(
        "/admin/profile/preferences",
        profile.preferences
      );

      // If that fails, try general profile endpoint
      if (!response.success) {
        response = await apiClient.put(
          "/profile/preferences",
          profile.preferences
        );
      }

      if (response.success) {
        setSuccess("Preferences updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Failed to update preferences");
      }
    } catch (err) {
      setError(
        "Error updating preferences: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validate passwords
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await apiClient.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.success) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError(response.message || "Failed to change password");
      }
    } catch (err) {
      setPasswordError(
        "Error changing password: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // In a real app, you would upload the file to your server or cloud storage
    // For now, we'll create a data URL
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result && profile) {
        const avatarUrl = event.target.result.toString();

        setSaving(true);
        try {
          // Try admin endpoint first
          let response = await apiClient.put("/admin/profile/avatar", {
            avatar: avatarUrl,
          });

          // If that fails, try general endpoint
          if (!response.success) {
            response = await apiClient.put("/profile/avatar", {
              avatar: avatarUrl,
            });
          }

          if (response.success) {
            setProfile({
              ...profile,
              avatar: avatarUrl,
            });
            setSuccess("Avatar updated successfully!");
          } else {
            setError("Failed to update avatar");
          }
        } catch (err) {
          setError(
            "Error updating avatar: " +
              (err instanceof Error ? err.message : String(err))
          );
        } finally {
          setSaving(false);
        }
      }
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return <div className="flex justify-center p-10">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="flex justify-center p-10">
        <Card className="w-full">
          <CardContent className="p-10 text-center">
            <div className="text-red-500 mb-4">
              {error || "Profile data not available"}
            </div>
            <Button onClick={loadProfile}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Profile</h2>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="mr-6">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadAvatar}
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="text-orange-600 font-medium">{profile.position}</p>
              <p className="text-gray-500">
                {profile.department} • {profile.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2 font-medium ${
            activeTab === "details"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 font-medium ${
            activeTab === "security"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Security Settings
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-medium ${
            activeTab === "notifications"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Notification Settings
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`px-4 py-2 font-medium ${
            activeTab === "preferences"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          System Preferences
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {/* Profile Details Tab */}
      {activeTab === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="name"
                      className="pl-10"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="email"
                      className="pl-10"
                      value={profile.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={profile.phone || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="department"
                      className="pl-10"
                      value={profile.department}
                      onChange={(e) =>
                        setProfile({ ...profile, department: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="position"
                      className="pl-10"
                      value={profile.position}
                      onChange={(e) =>
                        setProfile({ ...profile, position: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="role"
                      className="pl-10"
                      value={profile.role}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security Settings Tab */}
      {activeTab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="current-password"
                      type="password"
                      className="pl-10"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="new-password"
                      type="password"
                      className="pl-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id="confirm-password"
                      type="password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {passwordSuccess}
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <div className="text-sm text-gray-600 mb-4">
                    <p>Password requirements:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>At least 8 characters long</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={changingPassword}
                >
                  {changingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings Tab */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateNotifications} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Receive system alerts via email
                    </p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={profile.notificationSettings.emailAlerts}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        notificationSettings: {
                          ...profile.notificationSettings,
                          emailAlerts: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified about new admin logins
                    </p>
                  </div>
                  <Switch
                    id="login-alerts"
                    checked={profile.notificationSettings.loginAlerts}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        notificationSettings: {
                          ...profile.notificationSettings,
                          loginAlerts: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="withdrawal-alerts">Withdrawal Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified about large withdrawals
                    </p>
                  </div>
                  <Switch
                    id="withdrawal-alerts"
                    checked={profile.notificationSettings.withdrawalAlerts}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        notificationSettings: {
                          ...profile.notificationSettings,
                          withdrawalAlerts: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-alerts">System Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified about system events
                    </p>
                  </div>
                  <Switch
                    id="system-alerts"
                    checked={profile.notificationSettings.systemAlerts}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        notificationSettings: {
                          ...profile.notificationSettings,
                          systemAlerts: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Notification Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePreferences} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Preference</Label>
                  <select
                    id="theme"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={profile.preferences.theme}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          theme: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={profile.preferences.language}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          language: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-view">Default Dashboard View</Label>
                  <select
                    id="default-view"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={profile.preferences.dashboard.defaultView}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          dashboard: {
                            ...profile.preferences.dashboard,
                            defaultView: e.target.value,
                          },
                        },
                      })
                    }
                  >
                    <option value="overview">Dashboard Overview</option>
                    <option value="users">User Management</option>
                    <option value="earnings">Earnings Analytics</option>
                    <option value="reports">Reports & Analytics</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    Communication Preferences
                  </h4>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-comm"
                      checked={profile.preferences.notifications.email}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: {
                              ...profile.preferences.notifications,
                              email: checked,
                            },
                          },
                        })
                      }
                    />
                    <Label htmlFor="email-comm">Email Communications</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="push-notif"
                      checked={profile.preferences.notifications.push}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: {
                              ...profile.preferences.notifications,
                              push: checked,
                            },
                          },
                        })
                      }
                    />
                    <Label htmlFor="push-notif">Push Notifications</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sms-notif"
                      checked={profile.preferences.notifications.sms}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: {
                            ...profile.preferences,
                            notifications: {
                              ...profile.preferences.notifications,
                              sms: checked,
                            },
                          },
                        })
                      }
                    />
                    <Label htmlFor="sms-notif">SMS Notifications</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
