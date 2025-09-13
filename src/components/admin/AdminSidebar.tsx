import React from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  TrendingUp,
  CreditCard,
  BarChart3,
  FileText,
  UserCog,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'plans', label: 'Plans & Subscriptions', icon: Target },
    { id: 'earnings', label: 'Earnings Analytics', icon: TrendingUp },
    { id: 'withdrawals', label: 'Withdrawals Management', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'content', label: 'Content Management', icon: FileText },
    { id: 'staff', label: 'Staff Management', icon: UserCog }
  ];

  return (
    <div className="fixed left-0 top-0 w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto z-30">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-orange-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">LuminaFlow Control</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
              activeSection === item.id
                ? "bg-orange-50 text-orange-600 border border-orange-200"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}