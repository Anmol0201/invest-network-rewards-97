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
import AdminService, { AdminPlansResponse, InvestmentPlan, PlanStats } from '@/services/adminService';

type PlanForm = Partial<Pick<InvestmentPlan, 'name' | 'price' | 'dailyReturn' | 'validity' | 'maxWithdrawal' | 'features'>>;

export function PlansManagement() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [stats, setStats] = useState<PlanStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [createForm, setCreateForm] = useState<PlanForm>({
    name: '',
    price: undefined,
    dailyReturn: undefined,
    validity: undefined,
    maxWithdrawal: undefined,
    features: [],
  });

  const [editForm, setEditForm] = useState<PlanForm>({});
  const [deletePlan, setDeletePlan] = useState<InvestmentPlan | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: AdminPlansResponse = await AdminService.getInvestmentPlans();
      setPlans(response.plans || []);
      setStats(response.stats || null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const totalPlans = useMemo(() => stats?.totalPlans ?? plans.length, [stats, plans]);
  const totalSubscribers = useMemo(() => stats?.totalSubscribers ?? plans.reduce((a, p) => a + (p.subscribers || 0), 0), [stats, plans]);
  const totalRevenue = useMemo(() => stats?.totalRevenue ?? plans.reduce((a, p) => a + (p.revenue || 0), 0), [stats, plans]);
  const avgDailyPayout = useMemo(() => stats?.avgDailyPayout ?? 0, [stats]);

  const filteredPlans = useMemo(
    () => (showInactive ? plans : plans.filter(p => p && p.isActive)),
    [plans, showInactive]
  );

  const handleToggle = async (plan: InvestmentPlan) => {
    // Optimistic update for snappy UI
    const prev = [...plans];
    setPlans(plans.map(p => p.id === plan.id ? { ...p, isActive: !p.isActive } : p));
    try {
      const res = await AdminService.toggleInvestmentPlanStatus(plan.id);
      setPlans(plans => plans.map(p => p.id === res.id ? { ...p, isActive: res.isActive } : p));
    } catch (e) {
      // rollback on error
      setPlans(prev);
      console.error('Failed to toggle plan status', e);
      setError((e as any)?.message || 'Failed to toggle plan status');
    }
  };

  const openEdit = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setEditForm({
      name: plan.name,
      price: plan.price,
      dailyReturn: plan.dailyReturn,
      validity: plan.validity,
      maxWithdrawal: plan.maxWithdrawal,
      features: plan.features,
    });
    setIsEditDialogOpen(true);
  };

  const submitEdit = async () => {
    if (!selectedPlan) return;
    try {
      const updated = await AdminService.updateInvestmentPlan(selectedPlan.id, {
        name: editForm.name,
        price: Number(editForm.price),
        dailyReturn: Number(editForm.dailyReturn),
        validity: Number(editForm.validity),
        maxWithdrawal: Number(editForm.maxWithdrawal),
        features: editForm.features,
      });
      setPlans(plans => plans.map(p => p.id === updated.id ? { ...p, ...updated } : p));
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
    } catch (e) {
      console.error('Failed to update plan', e);
      setError((e as any)?.message || 'Failed to update plan');
    }
  };

  const submitCreate = async () => {
    try {
      const payload = {
        name: createForm.name!,
        price: Number(createForm.price),
        dailyReturn: Number(createForm.dailyReturn),
        validity: Number(createForm.validity),
        maxWithdrawal: Number(createForm.maxWithdrawal),
        features: createForm.features || [],
        isActive: true,
      } as any;
      const newPlan = await AdminService.createInvestmentPlan(payload);
      setPlans(prev => [...prev, newPlan]);
      setIsCreateDialogOpen(false);
      setCreateForm({ name: '', price: undefined, dailyReturn: undefined, validity: undefined, maxWithdrawal: undefined, features: [] });
    } catch (e) {
      console.error('Failed to create plan', e);
      setError((e as any)?.message || 'Failed to create plan');
    }
  };

  const openDelete = (plan: InvestmentPlan) => {
    setDeletePlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletePlan) return;
    try {
      setIsDeleting(true);
      await AdminService.deleteInvestmentPlan(deletePlan.id);
      setPlans(prev => prev.filter(p => p && p.id !== deletePlan.id));
      setIsDeleteDialogOpen(false);
      setDeletePlan(null);
    } catch (e) {
      console.error('Failed to delete plan', e);
      setError((e as any)?.message || 'Failed to delete plan');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plans & Subscriptions</h2>
          <p className="text-gray-600">Manage investment plans and subscription settings</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                <Input id="planName" placeholder="Enter plan name" value={createForm.name || ''} onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" placeholder="Enter price" value={createForm.price as any || ''} onChange={(e) => setCreateForm(f => ({ ...f, price: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyReturn">Daily Return (₹)</Label>
                <Input id="dailyReturn" type="number" placeholder="Enter daily return" value={createForm.dailyReturn as any || ''} onChange={(e) => setCreateForm(f => ({ ...f, dailyReturn: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity">Validity (Days)</Label>
                <Input id="validity" type="number" placeholder="Enter validity days" value={createForm.validity as any || ''} onChange={(e) => setCreateForm(f => ({ ...f, validity: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxWithdrawal">Max Withdrawal (₹)</Label>
                <Input id="maxWithdrawal" type="number" placeholder="Enter max withdrawal" value={createForm.maxWithdrawal as any || ''} onChange={(e) => setCreateForm(f => ({ ...f, maxWithdrawal: Number(e.target.value) }))} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={submitCreate}>Create Plan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-end mb-2 gap-2">
        <span className="text-sm text-gray-600">Show inactive</span>
        <Switch checked={showInactive} onCheckedChange={setShowInactive} />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {loading && (
        <div className="text-gray-600 text-sm">Loading plans...</div>
      )}

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
                <p className="text-2xl font-bold">{totalPlans}</p>
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
                <p className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
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
                <p className="text-2xl font-bold">₹{(avgDailyPayout || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.filter(Boolean).map((plan) => (
          <Card key={(plan as InvestmentPlan).id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{(plan as InvestmentPlan).name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch checked={!!(plan as InvestmentPlan).isActive} onCheckedChange={() => handleToggle(plan as InvestmentPlan)} />
                  <Badge variant={(plan as InvestmentPlan).isActive ? "default" : "secondary"}>
                    {(plan as InvestmentPlan).isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">₹{(plan as InvestmentPlan).price.toLocaleString()}</div>
                <p className="text-sm text-gray-500">One-time payment</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Return:</span>
                  <span className="font-medium">₹{(plan as InvestmentPlan).dailyReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Validity:</span>
                  <span className="font-medium">{(plan as InvestmentPlan).validity} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Withdrawal:</span>
                  <span className="font-medium">₹{(plan as InvestmentPlan).maxWithdrawal.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Features:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {(plan as InvestmentPlan).features?.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subscribers:</span>
                  <span className="font-medium">{(plan as InvestmentPlan).subscribers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">₹{(((plan as InvestmentPlan).revenue || 0) / 100000).toFixed(1)}L</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(plan as InvestmentPlan)}>
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
              {filteredPlans.filter(Boolean).map((plan) => (
                <TableRow key={(plan as InvestmentPlan).id}>
                  <TableCell className="font-medium">{(plan as InvestmentPlan).name}</TableCell>
                  <TableCell>₹{(plan as InvestmentPlan).price.toLocaleString()}</TableCell>
                  <TableCell>₹{(plan as InvestmentPlan).dailyReturn}</TableCell>
                  <TableCell>{(plan as InvestmentPlan).subscribers}</TableCell>
                  <TableCell>₹{(((plan as InvestmentPlan).revenue || 0) / 100000).toFixed(1)}L</TableCell>
                  <TableCell>
                    <Badge variant={(plan as InvestmentPlan).isActive ? "default" : "secondary"}>
                      {(plan as InvestmentPlan).isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(plan as InvestmentPlan)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => openDelete(plan as InvestmentPlan)}
                      >
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

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_planName">Plan Name</Label>
              <Input id="edit_planName" placeholder="Enter plan name" value={editForm.name || ''} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_price">Price (₹)</Label>
              <Input id="edit_price" type="number" placeholder="Enter price" value={editForm.price as any || ''} onChange={(e) => setEditForm(f => ({ ...f, price: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_dailyReturn">Daily Return (₹)</Label>
              <Input id="edit_dailyReturn" type="number" placeholder="Enter daily return" value={editForm.dailyReturn as any || ''} onChange={(e) => setEditForm(f => ({ ...f, dailyReturn: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_validity">Validity (Days)</Label>
              <Input id="edit_validity" type="number" placeholder="Enter validity days" value={editForm.validity as any || ''} onChange={(e) => setEditForm(f => ({ ...f, validity: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_maxWithdrawal">Max Withdrawal (₹)</Label>
              <Input id="edit_maxWithdrawal" type="number" placeholder="Enter max withdrawal" value={editForm.maxWithdrawal as any || ''} onChange={(e) => setEditForm(f => ({ ...f, maxWithdrawal: Number(e.target.value) }))} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={submitEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete the plan{' '}
              <span className="font-semibold">{deletePlan?.name}</span>? This action will deactivate the plan and it will no longer be available to users.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}