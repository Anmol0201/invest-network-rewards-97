import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/lib/api';

type Withdrawal = {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  paymentMethod: string;
  requestDate: string | Date;
  processedDate?: string | Date | null;
  adminNotes?: string;
  rejectionReason?: string;
};

export function WithdrawalsManagement() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [userCache, setUserCache] = useState<Record<string, { name?: string; email?: string }>>({});

  const toDate = (value: any): Date => {
    if (!value) return new Date();
    // Firestore Timestamp support
    if (typeof value?.toDate === 'function') return value.toDate();
    return new Date(value);
  };

  const formatDateTime = (value: any): string => {
    try {
      const d = toDate(value);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleString();
    } catch {
      return '-';
    }
  };

  const mask = (str: string, visible: number = 4) => {
    if (!str) return '';
    const clean = String(str);
    if (clean.length <= visible) return clean;
    return `${'*'.repeat(Math.max(0, clean.length - visible))}${clean.slice(-visible)}`;
  };

  const renderPayment = (w: Withdrawal) => {
    const details: any = (w as any).paymentDetails || {};
    switch (w.paymentMethod) {
      case 'bank_transfer':
        return (
          <div>
            <p className="text-sm font-medium">Bank Transfer</p>
            {details.bankName && (
              <p className="text-xs text-gray-500">{details.bankName}</p>
            )}
            {details.accountNumber && (
              <p className="text-xs text-gray-500">AC: {mask(details.accountNumber)}</p>
            )}
            {details.ifscCode && (
              <p className="text-xs text-gray-500">IFSC: {details.ifscCode}</p>
            )}
          </div>
        );
      case 'upi':
        return (
          <div>
            <p className="text-sm font-medium">UPI</p>
            {details.upiId && (
              <p className="text-xs text-gray-500">{mask(details.upiId)}</p>
            )}
          </div>
        );
      default:
        return <span className="text-sm">{w.paymentMethod || '-'}</span>;
    }
  };

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      const res = await apiClient.get<{ data: Withdrawal[]; pagination?: { page: number; limit: number; total: number } }>(`/admin/withdrawals?${params.toString()}`);
      if (res.success && res.data) {
        const list = res.data as unknown as Withdrawal[];
        setWithdrawals(list);
        const total = (res as any).pagination?.total ?? list.length;
        setHasMore(total === limit); // heuristic without full count
        // Prefetch minimal user info for visible rows
        prefetchUsers(list);
      } else {
        throw new Error(res.message || 'Failed to fetch withdrawals');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page, limit]);

  const prefetchUsers = async (rows: Withdrawal[]) => {
    const missing = rows.map(r => r.userId).filter(uid => uid && !userCache[uid]);
    if (missing.length === 0) return;
    const newCache: Record<string, { name?: string; email?: string }> = {};
    await Promise.all(missing.map(async (uid) => {
      try {
        const res = await apiClient.get<{ id: string; name?: string; email?: string }>(`/admin/users/${uid}`);
        if (res.success && res.data) {
          const d: any = res.data;
          newCache[uid] = { name: d.name || '', email: d.email || '' };
        }
      } catch {
        // ignore
      }
    }));
    if (Object.keys(newCache).length) {
      setUserCache(prev => ({ ...prev, ...newCache }));
    }
  };

  const renderUser = (uid: string) => {
    const u = userCache[uid];
    if (!u) return <div><p className="font-medium">{uid}</p><p className="text-xs text-gray-500">Loading...</p></div>;
    return (
      <div>
        <p className="font-medium">{u.name || uid}</p>
        {u.email && <p className="text-xs text-gray-500">{u.email}</p>}
      </div>
    );
  };

  const exportCsv = () => {
    const headers = ['Request ID','User ID','Name','Email','Amount','Payment Method','Requested','Status'];
    const rows = withdrawals.map((w) => {
      const u = userCache[w.userId] || {};
      return [
        w.id,
        w.userId,
        (u as any).name || '',
        (u as any).email || '',
        String(w.amount ?? 0),
        w.paymentMethod || '',
        formatDateTime(w.requestDate),
        w.status
      ];
    });
    const csv = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `withdrawals_${statusFilter}_p${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiClient.put(`/wallet/withdrawals/${id}/process`, { status: 'approved' });
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'approved' } as Withdrawal : w));
    } catch (e) {
      console.error('Approve failed', e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient.put(`/wallet/withdrawals/${id}/process`, { status: 'rejected' });
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected' } as Withdrawal : w));
    } catch (e) {
      console.error('Reject failed', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Withdrawals Management</h2>
          <p className="text-gray-600">Manage and process withdrawal requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={loadWithdrawals}>
            <Download className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-sm text-gray-500">Loading...</TableCell>
                </TableRow>
              )}
              {error && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-sm text-red-600">{error}</TableCell>
                </TableRow>
              )}
              {!loading && !error && withdrawals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-sm text-gray-500">No withdrawals found</TableCell>
                </TableRow>
              )}
              {!loading && !error && withdrawals.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.id}</TableCell>
                  <TableCell>{renderUser(w.userId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold">₹{Number(w.amount || 0).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderPayment(w)}</TableCell>
                  <TableCell>{formatDateTime(w.requestDate)}</TableCell>
                  <TableCell>{getStatusBadge(w.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {w.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleApprove(w.id)}
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleReject(w.id)}
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setSelectedWithdrawal(w)} title="View details">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page</span>
              <Select value={String(limit)} onValueChange={(v) => { setPage(1); setLimit(parseInt(v, 10)); }}>
                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
              <span className="text-sm text-gray-600">Page {page}</span>
              <Button variant="outline" disabled={!hasMore && withdrawals.length < limit} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={(open) => !open && setSelectedWithdrawal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdrawal Details {selectedWithdrawal ? `- ${selectedWithdrawal.id}` : ''}</DialogTitle>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-medium">{selectedWithdrawal.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">₹{Number(selectedWithdrawal.amount || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedWithdrawal.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requested</p>
                  <p className="font-medium">{formatDateTime(selectedWithdrawal.requestDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment</p>
                {renderPayment(selectedWithdrawal)}
              </div>
              {selectedWithdrawal.adminNotes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Admin Notes</p>
                  <p className="text-sm">{selectedWithdrawal.adminNotes}</p>
                </div>
              )}
              {selectedWithdrawal.rejectionReason && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejection Reason</p>
                  <p className="text-sm">{selectedWithdrawal.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}