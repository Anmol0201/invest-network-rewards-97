import React, { useEffect, useMemo, useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

import { apiClient } from '@/lib/api';

type Staff = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  joinDate?: string | Date;
  status: 'active' | 'inactive' | 'on_leave' | string;
  performance?: Record<string, any>;
};

export function StaffManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'on_leave'>('all');
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: '', department: '', status: 'active' as const
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (selectedDepartment) qs.set('department', selectedDepartment);
      if (selectedStatus && selectedStatus !== 'all') qs.set('status', selectedStatus);
      const res = await apiClient.get<{ data: Staff[]; pagination?: any }>(`/admin/staff?${qs.toString()}`);
      if (res.success) {
        // Some fields may be Firestore Timestamps, normalize joinDate
        const items = (res.data as any[]).map((s: any) => ({
          ...s,
          joinDate: s.joinDate?.toDate ? s.joinDate.toDate().toISOString() : s.joinDate,
        }));
        setStaff(items);
      }
    } catch (e) {
      console.error('Failed to fetch staff', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, [selectedDepartment, selectedStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'on_leave':
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

  const onEdit = (item: Staff) => {
    setEditing(item);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const payload = { ...editing } as any;
      delete payload.id;
      const res = await apiClient.put(`/admin/staff/${(editing as any).id}`, payload);
      if (res.success) {
        setEditOpen(false);
        setEditing(null);
        fetchStaff();
      }
    } catch (e) {
      console.error('Update failed', e);
    }
  };

  const getPerformanceScore = (performance: any, role: string) => {
    if (!performance) return 0;
    const r = (role || '').toLowerCase();
    if (r.includes('sales')) {
      const num = performance.usersOnboarded || 0;
      const den = performance.target || 0;
      return den ? (num / den) * 100 : 0;
    } else if (r.includes('support')) {
      const num = performance.ticketsResolved || 0;
      const den = performance.target || 0;
      return den ? (num / den) * 100 : 0;
    } else if (r.includes('withdrawal')) {
      const num = performance.withdrawalsProcessed || 0;
      const den = performance.target || 0;
      return den ? (num / den) * 100 : 0;
    }
    if (typeof performance.rating === 'number') return (performance.rating / 5) * 100;
    return 0;
  };

  const stats = useMemo(() => {
    const total = staff.length;
    const byDept = staff.reduce<Record<string, Staff[]>>((acc, s) => {
      const key = (s.department || 'other').toLowerCase();
      (acc[key] ||= []).push(s);
      return acc;
    }, {});
    const sales = byDept['sales'] || [];
    const support = byDept['support'] || [];
    const sum = (arr: number[]) => arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
    const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);
    const salesOnboarded = sum(sales.map(s => s.performance?.usersOnboarded || 0));
    const supportTickets = sum(support.map(s => s.performance?.ticketsResolved || 0));
    const avgPerf = avg(staff.map(s => getPerformanceScore(s.performance, s.role)));
    return {
      totalStaff: total,
      salesCount: sales.length,
      supportCount: support.length,
      salesOnboarded,
      supportTickets,
      avgPerf,
    };
  }, [staff]);

  const departmentRows = useMemo(() => {
    const departments = ['sales', 'support', 'finance', 'marketing'];
    const rows = departments.map(dep => {
      const items = staff.filter(s => (s.department || '').toLowerCase() === dep);
      const count = items.length;
      const perfPerc = items.map(s => getPerformanceScore(s.performance, s.role));
      const sum = (arr: number[]) => arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
      const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);
      const performance = Math.min(150, Math.round(avg(perfPerc)));
      let keyMetrics = '-';
      if (dep === 'sales') {
        const onboarded = sum(items.map(s => s.performance?.usersOnboarded || 0));
        const revenue = sum(items.map(s => s.performance?.revenue || 0));
        keyMetrics = `${onboarded} users onboarded, ₹${(revenue / 100000).toFixed(1)}L revenue`;
      } else if (dep === 'support') {
        const tickets = sum(items.map(s => s.performance?.ticketsResolved || 0));
        keyMetrics = `${tickets} tickets resolved`;
      } else if (dep === 'finance') {
        const processed = sum(items.map(s => s.performance?.withdrawalsProcessed || 0));
        keyMetrics = `${processed} withdrawals processed`;
      } else if (dep === 'marketing') {
        const leads = sum(items.map(s => s.performance?.leads || 0));
        keyMetrics = leads ? `${leads} leads` : '-';
      }
      return { dep, count, keyMetrics, performance };
    });
    return rows.filter(r => r.count > 0);
  }, [staff]);

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
                <Input id="staffName" placeholder="Enter full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffEmail">Email</Label>
                <Input id="staffEmail" type="email" placeholder="Enter email address" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffPhone">Phone</Label>
                <Input id="staffPhone" placeholder="Enter phone number" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffRole">Role</Label>
                <Input id="staffRole" placeholder="e.g., Sales Manager" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={form.department} onValueChange={(v)=>setForm(f=>({...f,department:v}))}>
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
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={async()=>{
                  try {
                    const res = await apiClient.post('/admin/staff', form);
                    if (res.success) {
                      setIsDialogOpen(false);
                      setForm({ name:'', email:'', phone:'', role:'', department:'', status:'active' });
                      fetchStaff();
                    }
                  } catch (e) { console.error('Create staff failed', e);} 
                }}>Add Staff</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Department Stats (Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalStaff}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.salesCount}</p>
                <p className="text-xs text-gray-500">{stats.salesOnboarded} users onboarded</p>
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
                <p className="text-2xl font-bold text-orange-600">{stats.supportCount}</p>
                <p className="text-xs text-gray-500">{stats.supportTickets} tickets resolved</p>
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
                <p className="text-2xl font-bold text-purple-600">{stats.avgPerf.toFixed(1)}%</p>
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
            <Select value={selectedStatus} onValueChange={(v)=>setSelectedStatus(v as any)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(loading ? [] : staff).map((staff) => (
          <Card key={staff.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {staff.name?.split(' ').map(n => n[0]).join('')}
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
                  <span className="text-gray-600">Joined: {staff.joinDate ? new Date(staff.joinDate).toISOString().slice(0,10) : '-'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Rating: {staff.performance?.rating ?? '-'}{staff.performance?.rating ? '/5' : ''}</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  {staff.role?.toLowerCase().includes('sales') && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Users Onboarded</span>
                        <span className="font-medium">
                          {(staff.performance?.usersOnboarded ?? 0)}/{(staff.performance?.target ?? 0)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((((staff.performance?.usersOnboarded ?? 0) / ((staff.performance?.target ?? 0) || 1)) * 100), 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue Generated</span>
                        <span className="font-medium text-green-600">
                          ₹{(((staff.performance?.revenue ?? 0) / 100000).toFixed(1))}L
                        </span>
                      </div>
                    </>
                  )}

                  {staff.role?.toLowerCase().includes('support') && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tickets Resolved</span>
                        <span className="font-medium">
                          {(staff.performance?.ticketsResolved ?? 0)}/{(staff.performance?.target ?? 0)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((((staff.performance?.ticketsResolved ?? 0) / ((staff.performance?.target ?? 0) || 1)) * 100), 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Resolution Time</span>
                        <span className="font-medium text-blue-600">
                          {staff.performance?.avgResolutionTime ?? '-'}
                        </span>
                      </div>
                    </>
                  )}

                  {staff.role?.toLowerCase().includes('withdrawal') && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Withdrawals Processed</span>
                        <span className="font-medium">
                          {(staff.performance?.withdrawalsProcessed ?? 0)}/{(staff.performance?.target ?? 0)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${Math.min((((staff.performance?.withdrawalsProcessed ?? 0) / ((staff.performance?.target ?? 0) || 1)) * 100), 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Processing Time</span>
                        <span className="font-medium text-orange-600">
                          {staff.performance?.avgProcessingTime ?? '-'}
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
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(staff)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={async()=>{
                  if (!confirm(`Delete ${staff.name}?`)) return;
                  try { await apiClient.delete(`/admin/staff/${staff.id}`); fetchStaff(); } catch(e){ console.error('Delete failed', e);} 
                }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(v)=>{ setEditOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input id="editName" value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input id="editEmail" type="email" value={editing.email} onChange={e=>setEditing({...editing, email:e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone</Label>
                <Input id="editPhone" value={editing.phone || ''} onChange={e=>setEditing({...editing, phone:e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Input id="editRole" value={editing.role} onChange={e=>setEditing({...editing, role:e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDept">Department</Label>
                <Select value={editing.department} onValueChange={(v)=>setEditing({...editing!, department:v})}>
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
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select value={(editing.status as any) || 'active'} onValueChange={(v)=>setEditing({...editing!, status: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={()=>{ setEditOpen(false); setEditing(null); }}>Cancel</Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={saveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Department Performance Summary (Dynamic) */}
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
              {departmentRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-gray-500">No departments to summarize.</TableCell>
                </TableRow>
              )}
              {departmentRows.map(r => (
                <TableRow key={r.dep}>
                  <TableCell className="font-medium">{r.dep.charAt(0).toUpperCase() + r.dep.slice(1)}</TableCell>
                  <TableCell>{r.count} {r.count === 1 ? 'member' : 'members'}</TableCell>
                  <TableCell>{r.keyMetrics}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className={`${r.dep==='sales'?'bg-green-500': r.dep==='support'?'bg-blue-500': r.dep==='finance'?'bg-orange-500':'bg-purple-500'} h-2 rounded-full`} style={{ width: `${Math.min(Math.max(r.performance,0), 130)}%` }}></div>
                      </div>
                      <span className="text-sm">{Math.round(r.performance)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={()=> setSelectedDepartment(r.dep)}>
                      <Eye className="w-4 h-4" />
                    </Button>
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