import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Calendar,
  TrendingDown,
  Eye,
  Download
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const withdrawalData = [
  {
    id: 'WD001',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@gmail.com',
    amount: 5000,
    requestDate: '2024-06-15',
    status: 'Pending',
    accountNumber: '****1234',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    reason: 'Monthly withdrawal'
  },
  {
    id: 'WD002',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@gmail.com',
    amount: 8500,
    requestDate: '2024-06-14',
    status: 'Approved',
    accountNumber: '****5678',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    reason: 'Emergency withdrawal'
  },
  {
    id: 'WD003',
    userName: 'Amit Singh',
    userEmail: 'amit.singh@gmail.com',
    amount: 12000,
    requestDate: '2024-06-13',
    status: 'Rejected',
    accountNumber: '****9012',
    ifscCode: 'ICIC0001234',
    bankName: 'ICICI Bank',
    reason: 'Insufficient balance'
  },
  {
    id: 'WD004',
    userName: 'Sunita Devi',
    userEmail: 'sunita.devi@gmail.com',
    amount: 3500,
    requestDate: '2024-06-12',
    status: 'Pending',
    accountNumber: '****3456',
    ifscCode: 'AXIS0001234',
    bankName: 'Axis Bank',
    reason: 'Regular withdrawal'
  }
];

export function WithdrawalsManagement() {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleApprove = (id: string) => {
    console.log('Approving withdrawal:', id);
    // Add approval logic here
  };

  const handleReject = (id: string) => {
    console.log('Rejecting withdrawal:', id);
    // Add rejection logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Withdrawals Management</h2>
          <p className="text-gray-600">Manage and process withdrawal requests</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today Requests</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-xs text-gray-500">₹1,25,000 total</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Yesterday Processed</p>
                <p className="text-2xl font-bold text-green-600">31</p>
                <p className="text-xs text-gray-500">₹1,86,500 approved</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-orange-600">156</p>
                <p className="text-xs text-gray-500">₹8,45,230 total</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">642</p>
                <p className="text-xs text-gray-500">₹32,84,560 total</p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-green-500 hover:bg-green-600 p-6 h-auto flex-col">
              <CheckCircle className="w-8 h-8 mb-2" />
              <span>Approve All Pending</span>
              <span className="text-sm opacity-80">(12 requests)</span>
            </Button>
            
            <Button variant="outline" className="p-6 h-auto flex-col">
              <Eye className="w-8 h-8 mb-2" />
              <span>Bulk Review</span>
              <span className="text-sm opacity-80">Review multiple requests</span>
            </Button>
            
            <Button variant="outline" className="p-6 h-auto flex-col">
              <Download className="w-8 h-8 mb-2" />
              <span>Generate Report</span>
              <span className="text-sm opacity-80">Daily/Monthly reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>User Details</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawalData.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">{withdrawal.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{withdrawal.userName}</p>
                      <p className="text-sm text-gray-500">{withdrawal.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold">₹{withdrawal.amount.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{withdrawal.bankName}</p>
                      <p className="text-xs text-gray-500">{withdrawal.accountNumber}</p>
                      <p className="text-xs text-gray-500">{withdrawal.ifscCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>{withdrawal.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {withdrawal.status === 'Pending' ? (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleApprove(withdrawal.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleReject(withdrawal.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Withdrawal Details - {withdrawal.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">User Name</label>
                                  <p className="font-medium">{withdrawal.userName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Amount</label>
                                  <p className="font-medium">₹{withdrawal.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Bank Name</label>
                                  <p className="font-medium">{withdrawal.bankName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Status</label>
                                  <div className="mt-1">{getStatusBadge(withdrawal.status)}</div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Reason</label>
                                <p className="font-medium">{withdrawal.reason}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Processing Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-3">Approval Criteria</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Verified KYC status</li>
                <li>• Sufficient wallet balance</li>
                <li>• Valid bank account details</li>
                <li>• No recent suspicious activity</li>
                <li>• Minimum withdrawal amount met</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-red-600 mb-3">Rejection Reasons</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Incomplete KYC verification</li>
                <li>• Insufficient funds</li>
                <li>• Invalid bank details</li>
                <li>• Account under review</li>
                <li>• Violation of terms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}