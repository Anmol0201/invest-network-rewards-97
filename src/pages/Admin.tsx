import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import UserManagement from "@/components/admin/UserManagement";
import { PlansManagement } from "@/components/admin/PlansManagement";
import { EarningsAnalytics } from "@/components/admin/EarningsAnalytics";
import { WithdrawalsManagement } from "@/components/admin/WithdrawalsManagement";
import { ReportsAnalytics } from "@/components/admin/ReportsAnalytics";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { StaffManagement } from "@/components/admin/StaffManagement";
import { ColourTradingControl } from "@/components/admin/ColourTradingControl";
import { NumberTradingControl } from "@/components/admin/NumberTradingControl";

interface AdminProps {
  onLogout?: () => void;
}

export default function Admin({ onLogout }: AdminProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />;
      case "colour-trading":
        return <ColourTradingControl />;
      case "number-trading":
        return <NumberTradingControl />;
      case "users":
        return <UserManagement />;
      case "plans":
        return <PlansManagement />;
      case "earnings":
        return <EarningsAnalytics />;
      case "withdrawals":
        return <WithdrawalsManagement />;
      case "reports":
        return <ReportsAnalytics />;
      case "content":
        return <ContentManagement />;
      case "staff":
        return <StaffManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="ml-64">
        <AdminHeader onLogout={onLogout} />
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
