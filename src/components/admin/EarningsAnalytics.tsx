import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiClient } from "@/lib/api";

interface EarningsData {
  date: string;
  totalEarnings: number;
  userEarnings: number;
  adminProfit: number;
}

interface PlanEarning {
  plan: string;
  earnings: number;
  color: string;
}

interface TopEarner {
  name: string;
  earnings: number;
  plan: string;
  level: string;
}

interface EarningsMetrics {
  todayProfit: number;
  todayChange: number;
  weekProfit: number;
  weekChange: number;
  monthProfit: number;
  monthChange: number;
  activeEarners: number;
  earnerChange: number;
}

export function EarningsAnalytics() {
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [planEarnings, setPlanEarnings] = useState<PlanEarning[]>([]);
  const [topEarners, setTopEarners] = useState<TopEarner[]>([]);
  const [metrics, setMetrics] = useState<EarningsMetrics>({
    todayProfit: 0,
    todayChange: 0,
    weekProfit: 0,
    weekChange: 0,
    monthProfit: 0,
    monthChange: 0,
    activeEarners: 0,
    earnerChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch earnings analytics
        const response = await apiClient.get<{
          earningsData: EarningsData[];
          planEarnings: PlanEarning[];
          topEarners: TopEarner[];
          keyMetrics: {
            todayProfit: number;
            todayChange: number;
            weekProfit: number;
            weekChange: number;
            monthProfit: number;
            monthChange: number;
            activeEarners: number;
            earnerChange: number;
          };
        }>("/admin/analytics/earnings");

        if (response.success && response.data) {
          setEarningsData(response.data.earningsData || []);
          setPlanEarnings(response.data.planEarnings || []);
          setTopEarners(response.data.topEarners || []);
          setMetrics({
            todayProfit: response.data.keyMetrics?.todayProfit || 0,
            todayChange: response.data.keyMetrics?.todayChange || 0,
            weekProfit: response.data.keyMetrics?.weekProfit || 0,
            weekChange: response.data.keyMetrics?.weekChange || 0,
            monthProfit: response.data.keyMetrics?.monthProfit || 0,
            monthChange: response.data.keyMetrics?.monthChange || 0,
            activeEarners: response.data.keyMetrics?.activeEarners || 0,
            earnerChange: response.data.keyMetrics?.earnerChange || 0,
          });
        } else {
          setError("Failed to load earnings data from server");
        }
      } catch (err) {
        console.error("Error fetching earnings data:", err);
        setError(
          "Failed to connect to the server. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading earnings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Earnings Analytics</h2>
        <p className="text-gray-600">
          Monitor earnings distribution and profit analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{metrics.todayProfit.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {metrics.todayChange >= 0 ? (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">
                        +{metrics.todayChange}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">
                        {metrics.todayChange}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week's Profit</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{metrics.weekProfit.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {metrics.weekChange >= 0 ? (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">
                        +{metrics.weekChange}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">
                        {metrics.weekChange}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month's Profit</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{metrics.monthProfit.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {metrics.monthChange >= 0 ? (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">
                        +{metrics.monthChange}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">
                        {metrics.monthChange}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Earners</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metrics.activeEarners.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {metrics.earnerChange >= 0 ? (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">
                        +{metrics.earnerChange}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">
                        {metrics.earnerChange}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line
                    type="monotone"
                    dataKey="totalEarnings"
                    stroke="#F97316"
                    strokeWidth={3}
                    name="Total Earnings"
                  />
                  <Line
                    type="monotone"
                    dataKey="adminProfit"
                    stroke="#DC2626"
                    strokeWidth={2}
                    name="Admin Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan-wise Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Plan-wise Earnings Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planEarnings}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="earnings"
                    label={({ plan, value }) => `${plan}: ₹${value / 1000}K`}
                  >
                    {planEarnings.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User vs Admin Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>User vs Admin Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Bar
                    dataKey="userEarnings"
                    fill="#FED7AA"
                    name="User Earnings"
                  />
                  <Bar
                    dataKey="adminProfit"
                    fill="#F97316"
                    name="Admin Profit"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Earners */}
        <Card>
          <CardHeader>
            <CardTitle>Top Earners This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(topEarners.length > 0
                ? topEarners
                : [
                    {
                      name: "No data available",
                      earnings: 0,
                      plan: "-",
                      level: "-",
                    },
                  ]
              ).map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        {user.plan} • {user.level}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ₹{user.earnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Month</th>
                  <th className="text-right p-3">Total Earnings</th>
                  <th className="text-right p-3">User Earnings</th>
                  <th className="text-right p-3">Admin Profit</th>
                  <th className="text-right p-3">Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                {earningsData.map((month, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{month.date}</td>
                    <td className="p-3 text-right">
                      ₹{month.totalEarnings.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      ₹{month.userEarnings.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-green-600 font-medium">
                      ₹{month.adminProfit.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      {(
                        (month.adminProfit / month.totalEarnings) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
