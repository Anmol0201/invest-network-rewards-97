import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Users,
  Award,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Target,
  CheckCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const staffData = [
  {
    id: 1,
    name: 'Rohit Sharma',
    email: 'rohit.sharma@luminaflow.com',
    phone: '+91 9876543210',
    role: 'Sales Manager',
    department: 'Sales',
    joinDate: '2024-01-15',
    status: 'Active',
    performance: {
      usersOnboarded: 145,
      target: 150,
      revenue: 2850000,
      rating: 4.8
    }
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@luminaflow.com',
    phone: '+91 9876543211',
    role: 'Support Executive',
    department: 'Support',
    joinDate: '2024-02-10',
    status: 'Active',
    performance: {
      ticketsResolved: 1250,
      target: 1200,
      avgResolutionTime: '2.5 hours',
      rating: 4.6
    }
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.kumar@luminaflow.com',
    phone: '+91 9876543212',
    role: 'Sales Executive',
    department: 'Sales',
    joinDate: '2024-03-01',
    status: 'Active',
    performance: {
      usersOnboarded: 89,
      target: 100,
      revenue: 1680000,
      rating: 4.2
    }
  },
  {
    id: 4,
    name: 'Sunita Singh',
    email: 'sunita.singh@luminaflow.com',
    phone: '+91 9876543213',
    role: 'Withdrawal Manager',
    department: 'Finance',
    joinDate: '2024-01-20',
    status: 'Active',
    performance: {
      withdrawalsProcessed: 2450,
      target: 2000,
      avgProcessingTime: '4 hours',
      rating: 4.9
    }
  }
];

export function StaffManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'On Leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Sales Manager': 'bg-blue-100 text-blue-800',
      'Sales Executive': 'bg-blue-50 text-blue-700',
      'Support Executive': 'bg-green-100 text-green-800',
      'Withdrawal Manager': 'bg-orange-100 text-orange-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceScore = (performance: any, role: string) => {
    if (role.includes('Sales')) {
      return (performance.usersOnboarded / performance.target) * 100;
    } else if (role.includes('Support')) {
      return (performance.ticketsResolved / performance.target) * 100;
    } else if (role.includes('Withdrawal')) {
      return (performance.withdrawalsProcessed / performance.target) * 100;
    }
    return 85; // Default score
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-gray-600">Manage staff performance and roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staffName">Full Name</Label>
                <Input id="staffName" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffEmail">Email</Label>
                <Input id="staffEmail" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffPhone">Phone</Label>
                <Input id="staffPhone" placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffRole">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales-manager">Sales Manager</SelectItem>
                    <SelectItem value="sales-executive">Sales Executive</SelectItem>
                    <SelectItem value="support-executive">Support Executive</SelectItem>
                    <SelectItem value="withdrawal-manager">Withdrawal Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button className="bg-orange-500 hover:bg-orange-600">Add Staff</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-xs text-gray-500">Across all departments</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sales Team</p>
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-xs text-gray-500">234 users onboarded</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Support Team</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
                <p className="text-xs text-gray-500">1,250 tickets resolved</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-purple-600">92.3%</p>
                <p className="text-xs text-gray-500">Above target</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staffData.map((staff) => (
          <Card key={staff.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{staff.name}</CardTitle>
                    <Badge className={getRoleColor(staff.role)}>{staff.role}</Badge>
                  </div>
                </div>
                {getStatusBadge(staff.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{staff.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{staff.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Joined: {staff.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Rating: {staff.performance.rating}/5</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  {staff.role.includes('Sales') && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Users Onboarded</span>
                        <span className="font-medium">
                          {staff.performance.usersOnboarded}/{staff.performance.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((staff.performance.usersOnboarded / staff.performance.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue Generated</span>
                        <span className="font-medium text-green-600">
                          ₹{(staff.performance.revenue / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </>
                  )}

                  {staff.role.includes('Support') && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tickets Resolved</span>
                        <span className="font-medium">
                          {staff.performance.ticketsResolved}/{staff.performance.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((staff.performance.ticketsResolved / staff.performance.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Resolution Time</span>
                        <span className="font-medium text-blue-600">
                          {staff.performance.avgResolutionTime}
                        </span>
                      </div>
                    </>
                  )}

                  {staff.role.includes('Withdrawal') && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Withdrawals Processed</span>
                        <span className="font-medium">
                          {staff.performance.withdrawalsProcessed}/{staff.performance.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((staff.performance.withdrawalsProcessed / staff.performance.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Processing Time</span>
                        <span className="font-medium text-orange-600">
                          {staff.performance.avgProcessingTime}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Staff Count</TableHead>
                <TableHead>Key Metrics</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Sales</TableCell>
                <TableCell>8 members</TableCell>
                <TableCell>234 users onboarded, ₹45.3L revenue</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm">96%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Support</TableCell>
                <TableCell>12 members</TableCell>
                <TableCell>3,450 tickets resolved, 3.2hrs avg time</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '104%' }}></div>
                    </div>
                    <span className="text-sm">104%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Finance</TableCell>
                <TableCell>4 members</TableCell>
                <TableCell>2,450 withdrawals, 4hrs avg processing</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '122%' }}></div>
                    </div>
                    <span className="text-sm">122%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}