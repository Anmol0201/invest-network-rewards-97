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
  Target,
  Users,
  DollarSign,
  TrendingUp,
  Settings
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
import { Switch } from '@/components/ui/switch';

const plansData = [
  {
    id: 1,
    name: 'Base Plan',
    price: 999,
    dailyReturn: 50,
    validityDays: 365,
    maxWithdrawal: 5000,
    features: ['Basic Support', 'Daily Earnings', 'Referral Bonus'],
    isActive: true,
    subscribersCount: 856,
    totalRevenue: 853344
  },
  {
    id: 2,
    name: 'Silver Plan',
    price: 2999,
    dailyReturn: 180,
    validityDays: 365,
    maxWithdrawal: 15000,
    features: ['Priority Support', 'Daily Earnings', 'Referral Bonus', 'Weekly Bonus'],
    isActive: true,
    subscribersCount: 642,
    totalRevenue: 1924758
  },
  {
    id: 3,
    name: 'Gold Plan',
    price: 4999,
    dailyReturn: 320,
    validityDays: 365,
    maxWithdrawal: 25000,
    features: ['VIP Support', 'Daily Earnings', 'Referral Bonus', 'Weekly Bonus', 'Monthly Bonus'],
    isActive: true,
    subscribersCount: 423,
    totalRevenue: 2114577
  },
  {
    id: 4,
    name: 'Diamond Plan',
    price: 9999,
    dailyReturn: 680,
    validityDays: 365,
    maxWithdrawal: 50000,
    features: ['Premium Support', 'Daily Earnings', 'Referral Bonus', 'All Bonuses', 'VIP Events'],
    isActive: true,
    subscribersCount: 156,
    totalRevenue: 1559844
  }
];

export function PlansManagement() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plans & Subscriptions</h2>
          <p className="text-gray-600">Manage investment plans and subscription settings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="planName">Plan Name</Label>
                <Input id="planName" placeholder="Enter plan name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" placeholder="Enter price" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyReturn">Daily Return (₹)</Label>
                <Input id="dailyReturn" type="number" placeholder="Enter daily return" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity">Validity (Days)</Label>
                <Input id="validity" type="number" placeholder="Enter validity days" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxWithdrawal">Max Withdrawal (₹)</Label>
                <Input id="maxWithdrawal" type="number" placeholder="Enter max withdrawal" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button className="bg-orange-500 hover:bg-orange-600">Create Plan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold">2,077</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹64.5L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Daily Payout</p>
                <p className="text-2xl font-bold">₹2,580</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plansData.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch checked={plan.isActive} />
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">₹{plan.price.toLocaleString()}</div>
                <p className="text-sm text-gray-500">One-time payment</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Return:</span>
                  <span className="font-medium">₹{plan.dailyReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Validity:</span>
                  <span className="font-medium">{plan.validityDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Withdrawal:</span>
                  <span className="font-medium">₹{plan.maxWithdrawal.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Features:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subscribers:</span>
                  <span className="font-medium">{plan.subscribersCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">₹{(plan.totalRevenue / 100000).toFixed(1)}L</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  Config
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plans Table for detailed view */}
      <Card>
        <CardHeader>
          <CardTitle>Plans Details Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Daily Return</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plansData.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>₹{plan.price.toLocaleString()}</TableCell>
                  <TableCell>₹{plan.dailyReturn}</TableCell>
                  <TableCell>{plan.subscribersCount}</TableCell>
                  <TableCell>₹{(plan.totalRevenue / 100000).toFixed(1)}L</TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}