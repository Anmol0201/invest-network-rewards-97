import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Download,
  RefreshCw,
  Hash,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import AdminService from "@/services/adminService";

export function NumberTradingControl() {
  const [selectedPlan, setSelectedPlan] = useState("₹10");
  const [selectedWinningNumber, setSelectedWinningNumber] = useState<
    number | null
  >(null);

  // Admin controlled winner selection flow
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealHistory, setRevealHistory] = useState<
    Array<{ round: number; winner: number; timestamp: string }>
  >([]);
  const [backendOptions, setBackendOptions] = useState<string[] | null>(null);
  const [round, setRound] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Sample data for number trading
  const tradingStats = {
    totalNumberTraders: 1234,
    numberRevenue: 42680,
    activeNumberTraders: 758,
    popularNumber: 7,
  };

  const planOptions = [
    "₹10",
    "₹15",
    "₹20",
    "₹25",
    "₹50",
    "₹100",
    "₹200",
    "₹300",
    "₹250",
  ];

  // Number groups distribution data (used for charts)
  const numberGroupsData = [
    { name: "0-10", value: 18, color: "#EF4444" },
    { name: "11-20", value: 17, color: "#F97316" },
    { name: "21-30", value: 14, color: "#EAB308" },
    { name: "31-40", value: 14, color: "#22C55E" },
    { name: "41-50", value: 12, color: "#3B82F6" },
    { name: "51-60", value: 9, color: "#8B5CF6" },
    { name: "61-70", value: 7, color: "#EC4899" },
    { name: "71-80", value: 5, color: "#06B6D4" },
    { name: "81-90", value: 2, color: "#64748B" },
    { name: "91-100", value: 2, color: "#1F2937" },
  ];

  const groupWiseTradeData = [
    { group: "0-10", count: 50 },
    { group: "11-20", count: 48 },
    { group: "21-30", count: 38 },
    { group: "31-40", count: 35 },
    { group: "41-50", count: 31 },
    { group: "51-60", count: 25 },
    { group: "61-70", count: 20 },
    { group: "71-80", count: 17 },
    { group: "81-90", count: 12 },
    { group: "91-100", count: 8 },
  ];

  const mostPopularNumbers = [
    { number: 7, rank: 1, trades: 48 },
    { number: 21, rank: 2, trades: 45 },
    { number: 42, rank: 3, trades: 42 },
    { number: 69, rank: 4, trades: 38 },
    { number: 100, rank: 5, trades: 35 },
  ];

  const refresh = async () => {
    setLoading(true);
    try {
      const [opts, rounds] = await Promise.all([
        AdminService.getTradingOptions('number'),
        AdminService.listTradingRounds({ gameType: 'number', status: 'open', limit: 1 }),
      ]);
      const options = (opts as any)?.options as string[];
      setBackendOptions(options);
      const r = (rounds as any).rounds?.[0] || null;
      setRound(r);
      setWinningNumber(r?.winningOption ? Number(r.winningOption) : null);
    } catch (e) {
      console.error('Failed to refresh number trading data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleConfirmWinner = async () => {
    if (selectedWinner == null) return;
    if (!round?.id) return;
    setIsRevealing(true);
    try {
      await AdminService.finalizeTradingRound(round.id, selectedWinner);
      setWinningNumber(selectedWinner);
      setRevealHistory((h) => [
        {
          round: (round?.roundNumber ?? h.length + 1),
          winner: selectedWinner,
          timestamp: new Date().toISOString(),
        },
        ...h,
      ]);
      setSelectedWinner(null);
      await refresh();
    } catch (e) {
      console.error('Finalize number round failed', e);
    } finally {
      setIsRevealing(false);
    }
  };

  const handleResetRound = () => {
    setWinningNumber(null);
    setSelectedWinner(null);
    setIsRevealing(false);
  };

  const handleToggleSelect = (num: number) => {
    setSelectedWinner((s) => (s === num ? null : num));
  };

  const handleCreateRound = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const ends = new Date(now.getTime() + 60 * 60 * 1000);
      await AdminService.createTradingRound({ gameType: 'number', startsAt: now.toISOString(), endsAt: ends.toISOString() });
      await refresh();
    } catch (e) {
      console.error('Create number round failed', e);
    } finally {
      setLoading(false);
    }
  };

  const numberList = useMemo(() => {
    const list = backendOptions || Array.from({ length: 100 }, (_, i) => String(i + 1));
    return list.map((n) => Number(n)).sort((a, b) => a - b);
  }, [backendOptions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Number Trading Control Panel
          </h1>
          <p className="text-gray-600">
            Manage number trading operations (1-100) and rewards
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          {!round && (
            <Button className="bg-blue-600 hover:bg-blue-700" size="sm" onClick={handleCreateRound} disabled={loading}>
              Create Round
            </Button>
          )}
          <Button className="bg-green-600 hover:bg-green-700" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Number Traders
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tradingStats.totalNumberTraders}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Number Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{tradingStats.numberRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +7% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Number Traders
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tradingStats.activeNumberTraders}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline w-3 h-3 mr-1 text-orange-600" />
              -6% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Popular Number
            </CardTitle>
            <Badge variant="outline" className="text-blue-600">
              {tradingStats.popularNumber}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Hash className="inline w-6 h-6 mr-1" />
              {tradingStats.popularNumber}
            </div>
            <p className="text-xs text-muted-foreground">48 trades</p>
          </CardContent>
        </Card>
      </div>

      {/* Trading Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Trading Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {planOptions.map((plan) => (
              <Button
                key={plan}
                variant={selectedPlan === plan ? "default" : "outline"}
                onClick={() => setSelectedPlan(plan)}
                className={
                  selectedPlan === plan
                    ? "bg-orange-500 hover:bg-orange-600"
                    : ""
                }
              >
                {plan}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Currently viewing number trading data for{" "}
            <strong>{selectedPlan} plan</strong>
          </p>
        </CardContent>
      </Card>

      {/* Number Trading Control (main grid + round status) */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Number Trading Control - {selectedPlan} Plan
          </CardTitle>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Admin: select winning number
            </div>
            <Button
              onClick={handleConfirmWinner}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
              disabled={selectedWinner == null || isRevealing}
            >
              {isRevealing ? "Confirming..." : "Confirm Winner"}
            </Button>
            <Button onClick={handleResetRound} variant="ghost" size="sm">
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="grid grid-cols-10 gap-2 mb-4">
                {numberList.map((number) => {
                  const isWinner = winningNumber === number;
                  const isSelected = selectedWinner === number;
                  const baseClasses = `h-10 w-full text-xs font-medium`;
                  const colorClass =
                    number <= 10
                      ? "border-red-300 hover:border-red-400"
                      : number <= 20
                      ? "border-orange-300 hover:border-orange-400"
                      : number <= 30
                      ? "border-yellow-300 hover:border-yellow-400"
                      : number <= 40
                      ? "border-green-300 hover:border-green-400"
                      : number <= 50
                      ? "border-blue-300 hover:border-blue-400"
                      : number <= 60
                      ? "border-purple-300 hover:border-purple-400"
                      : number <= 70
                      ? "border-pink-300 hover:border-pink-400"
                      : number <= 80
                      ? "border-cyan-300 hover:border-cyan-400"
                      : number <= 90
                      ? "border-gray-300 hover:border-gray-400"
                      : "border-slate-300 hover:border-slate-400";

                  return (
                    <button
                      key={number}
                      className={`${baseClasses} ${colorClass} rounded-md outline-none transition-all ${
                        isSelected ? "ring-2 ring-orange-400" : ""
                      } ${
                        isWinner
                          ? "bg-yellow-400 text-white scale-105"
                          : "bg-white"
                      }`}
                      onClick={() => handleToggleSelect(number)}
                    >
                      {number}
                    </button>
                  );
                })}
              </div>

              {/* round status area (show selected / winning) */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">
                    Current selected (admin):
                  </div>
                  <div className="text-lg font-bold">
                    {selectedWinner ? `#${selectedWinner}` : "-"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Winning number (revealed):
                  </div>
                  <div className="text-lg font-bold">
                    {winningNumber ? `#${winningNumber}` : "Not revealed"}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-80">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Reveal History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {revealHistory.length === 0 && (
                        <div className="text-sm text-gray-500">
                          No reveals yet
                        </div>
                      )}
                      {revealHistory.map((r) => (
                        <div
                          key={r.round}
                          className="flex items-center justify-between"
                        >
                          <div>Round {r.round}</div>
                          <div className="font-semibold">#{r.winner}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Top Numbers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {mostPopularNumbers.map((m) => (
                        <div
                          key={m.number}
                          className="flex items-center justify-between"
                        >
                          <div className="text-sm">#{m.number}</div>
                          <div className="text-sm text-gray-600">
                            {m.trades} trades
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Number Groups Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={numberGroupsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {numberGroupsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Group-wise Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupWiseTradeData}>
                  <XAxis
                    dataKey="group"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Popular Numbers */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {mostPopularNumbers.map((item) => (
              <div
                key={item.number}
                className="bg-blue-50 rounded-lg p-6 text-center"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  #{item.number}
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {item.number}
                </div>
                <div className="text-sm text-gray-600">Rank {item.rank}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Range-wise Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Range-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {numberGroupsData.slice(0, 5).map((range) => (
              <div
                key={range.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: range.color }}
                  ></div>
                  <span className="font-medium">{range.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {range.value}% of total trades
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${range.value * 2}%`,
                        backgroundColor: range.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
