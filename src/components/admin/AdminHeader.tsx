import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, User, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

interface AdminHeaderProps {
  onLogout?: () => void;
  onProfileClick?: () => void;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function AdminHeader({ onLogout, onProfileClick }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch admin user data
  useEffect(() => {
    async function fetchAdminUser() {
      try {
        // First try to get admin profile
        let response = await apiClient.get("/admin/profile");

        // If that fails, try the general profile endpoint
        if (!response.success) {
          response = await apiClient.get("/profile");
        }

        if (response.success && response.data) {
          // Extract profile data from the response structure
          const responseData = response.data as any;
          const profileData = responseData.profile || responseData;
          setAdminUser({
            id: profileData.id || profileData.userId || "1",
            name: profileData.name || "Admin User",
            email: profileData.email || "admin@wenews.com",
            role: profileData.role || "admin",
          });
        } else {
          // Fallback user data
          setAdminUser({
            id: "1",
            name: "WeNews Admin",
            email: "admin@wenews.com",
            role: "admin",
          });
        }
      } catch (err) {
        console.error("Error fetching admin user:", err);
        // Fallback user data
        setAdminUser({
          id: "1",
          name: "WeNews Admin",
          email: "admin@wenews.com",
          role: "admin",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAdminUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            WeNews Admin Dashboard
          </h2>
          <p className="text-gray-600">Master Control Center</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, transactions..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Admin Profile */}
          <div
            className="flex items-center space-x-3 relative"
            ref={dropdownRef}
          >
            {!loading && adminUser && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {adminUser.name}
                </p>
                <p className="text-xs text-gray-500">{adminUser.email}</p>
              </div>
            )}
            {loading && (
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            )}
            <button
              className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {adminUser?.name ? (
                <span className="text-white font-bold text-sm">
                  {adminUser.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      if (onProfileClick) onProfileClick();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
