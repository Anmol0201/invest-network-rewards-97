import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 145000, users: 1200, withdrawals: 98000 },
  { month: 'Feb', revenue: 168000, users: 1450, withdrawals: 112000 },
  { month: 'Mar', revenue: 152000, users: 1680, withdrawals: 105000 },
  { month: 'Apr', revenue: 189000, users: 1920, withdrawals: 128000 },
  { month: 'May', revenue: 175000, users: 2150, withdrawals: 119000 },
  { month: 'Jun', revenue: 206000, users: 2480, withdrawals: 145000 },
];

const planPerformance = [
  { plan: 'Base Plan', subscribers: 856, revenue: 853344, avgReturn: 50 },
  { plan: 'Silver Plan', subscribers: 642, revenue: 1924758, avgReturn: 180 },
  { plan: 'Gold Plan', subscribers: 423, revenue: 2114577, avgReturn: 320 },
  { plan: 'Diamond Plan', subscribers: 156, revenue: 1559844, avgReturn: 680 },
];

const userActivity = [
  { date: '2024-06-01', newUsers: 45, activeUsers: 1840, churned: 12 },
  { date: '2024-06-02', newUsers: 52, activeUsers: 1875, churned: 8 },
  { date: '2024-06-03', newUsers: 38, activeUsers: 1892, churned: 15 },
  { date: '2024-06-04', newUsers: 67, activeUsers: 1935, churned: 10 },
  { date: '2024-06-05', newUsers: 41, activeUsers: 1958, churned: 18 },
  { date: '2024-06-06', newUsers: 55, activeUsers: 1988, churned: 7 },
  { date: '2024-06-07', newUsers: 48, activeUsers: 2015, churned: 13 },
];

export function ReportsAnalytics() {
  const [reportType, setReportType] = useState('revenue');
  const [timePeriod, setTimePeriod] = useState('monthly');

  const generateReport = (type: string) => {
    console.log(`Generating ${type} report...`);
    // Add report generation logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive business intelligence and reporting</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹10.35L</p>
                <p className="text-xs text-green-500">+18% vs last month</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">2,077</p>
                <p className="text-xs text-blue-500">+12% growth rate</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-orange-600">23.5%</p>
                <p className="text-xs text-orange-500">+2.1% improvement</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold text-purple-600">87.3%</p>
                <p className="text-xs text-purple-500">+5.2% vs last quarter</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button 
              variant="outline" 
              className="p-6 h-auto flex-col"
              onClick={() => generateReport('revenue')}
            >
              <DollarSign className="w-8 h-8 mb-2 text-green-600" />
              <span>Revenue Report</span>
              <span className="text-xs text-gray-500">Financial overview</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-6 h-auto flex-col"
              onClick={() => generateReport('users')}
            >
              <Users className="w-8 h-8 mb-2 text-blue-600" />
              <span>User Analytics</span>
              <span className="text-xs text-gray-500">User behavior</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-6 h-auto flex-col"
              onClick={() => generateReport('withdrawals')}
            >
              <TrendingUp className="w-8 h-8 mb-2 text-orange-600" />
              <span>Withdrawal Report</span>
              <span className="text-xs text-gray-500">Payout analysis</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-6 h-auto flex-col"
              onClick={() => generateReport('performance')}
            >
              <BarChart3 className="w-8 h-8 mb-2 text-purple-600" />
              <span>Performance Report</span>
              <span className="text-xs text-gray-500">Overall metrics</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-6 h-auto flex-col"
              onClick={() => generateReport('custom')}
            >
              <FileText className="w-8 h-8 mb-2 text-gray-600" />
              <span>Custom Report</span>
              <span className="text-xs text-gray-500">Build your own</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Withdrawals Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="#F97316" 
                    fill="#FED7AA"
                    name="Revenue"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="withdrawals" 
                    stackId="2"
                    stroke="#DC2626" 
                    fill="#FEE2E2"
                    name="Withdrawals"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivity}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="New Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Active Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="churned" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Churned"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Plan Name</th>
                  <th className="text-right p-3">Subscribers</th>
                  <th className="text-right p-3">Total Revenue</th>
                  <th className="text-right p-3">Avg Daily Return</th>
                  <th className="text-right p-3">Revenue per User</th>
                  <th className="text-right p-3">Performance</th>
                </tr>
              </thead>
              <tbody>
                {planPerformance.map((plan, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{plan.plan}</td>
                    <td className="p-3 text-right">{plan.subscribers}</td>
                    <td className="p-3 text-right">₹{(plan.revenue / 100000).toFixed(1)}L</td>
                    <td className="p-3 text-right">₹{plan.avgReturn}</td>
                    <td className="p-3 text-right">₹{(plan.revenue / plan.subscribers).toFixed(0)}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(plan.revenue / 2500000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {((plan.revenue / 2500000) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                <span className="font-bold text-green-600">+18.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Growth</span>
                <span className="font-bold text-blue-600">+15.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit Margin</span>
                <span className="font-bold text-orange-600">+2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="font-bold text-purple-600">+5.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="font-bold">94.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">System Uptime</span>
                  <span className="font-bold">99.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Payment Success</span>
                  <span className="font-bold">96.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '96.7%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Download Monthly Report
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Create Custom Filter
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}