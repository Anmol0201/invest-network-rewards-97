import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const earningsData = [
  { date: '2024-01', totalEarnings: 45000, userEarnings: 38000, adminProfit: 7000 },
  { date: '2024-02', totalEarnings: 52000, userEarnings: 44000, adminProfit: 8000 },
  { date: '2024-03', totalEarnings: 48000, userEarnings: 40000, adminProfit: 8000 },
  { date: '2024-04', totalEarnings: 61000, userEarnings: 51000, adminProfit: 10000 },
  { date: '2024-05', totalEarnings: 55000, userEarnings: 46000, adminProfit: 9000 },
  { date: '2024-06', totalEarnings: 67000, userEarnings: 56000, adminProfit: 11000 },
];

const planEarnings = [
  { plan: 'Base', earnings: 145000, color: '#FED7AA' },
  { plan: 'Silver', earnings: 285000, color: '#F97316' },
  { plan: 'Gold', earnings: 420000, color: '#EA580C' },
  { plan: 'Diamond', earnings: 180000, color: '#DC2626' },
];

export function EarningsAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Earnings Analytics</h2>
        <p className="text-gray-600">Monitor earnings distribution and profit analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Profit</p>
                <p className="text-2xl font-bold text-green-600">₹12,450</p>
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+15%</span>
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
                <p className="text-2xl font-bold text-blue-600">₹78,320</p>
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+8%</span>
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
                <p className="text-2xl font-bold text-orange-600">₹2,84,560</p>
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500">-3%</span>
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
                <p className="text-2xl font-bold text-purple-600">1,856</p>
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+12%</span>
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
                    label={({ plan, value }) => `${plan}: ₹${(value/1000)}K`}
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
                  <Bar dataKey="userEarnings" fill="#FED7AA" name="User Earnings" />
                  <Bar dataKey="adminProfit" fill="#F97316" name="Admin Profit" />
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
              {[
                { name: 'Rajesh Kumar', earnings: 15640, plan: 'Diamond', level: 'Level 5' },
                { name: 'Priya Sharma', earnings: 12850, plan: 'Gold', level: 'Level 4' },
                { name: 'Amit Singh', earnings: 11240, plan: 'Gold', level: 'Level 3' },
                { name: 'Sunita Devi', earnings: 9850, plan: 'Silver', level: 'Level 4' },
                { name: 'Vikash Yadav', earnings: 8750, plan: 'Silver', level: 'Level 3' }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.plan} • {user.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{user.earnings.toLocaleString()}</p>
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
                    <td className="p-3 text-right">₹{month.totalEarnings.toLocaleString()}</td>
                    <td className="p-3 text-right">₹{month.userEarnings.toLocaleString()}</td>
                    <td className="p-3 text-right text-green-600 font-medium">₹{month.adminProfit.toLocaleString()}</td>
                    <td className="p-3 text-right">{((month.adminProfit / month.totalEarnings) * 100).toFixed(1)}%</td>
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