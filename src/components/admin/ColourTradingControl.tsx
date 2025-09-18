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
  Gift,
  Lock,
  Unlock,
  Star,
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
  Legend,
} from "recharts";
import AdminService from "@/services/adminService";

export function ColourTradingControl() {
  const [selectedPlan, setSelectedPlan] = useState("₹10");
  const [winningColor, setWinningColor] = useState<string | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [backendOptions, setBackendOptions] = useState<{ options: string[]; multipliers: any } | null>(null);
  const [revealHistory, setRevealHistory] = useState<any[]>([]);
  const [round, setRound] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Sample data for colour trading
  const tradingStats = {
    totalTraders: 856,
    revenue: 28340,
    activeTraders: 542,
    popularColour: "Red",
  };

  const planOptions = [
    "₹10",
    "₹15",
    "₹20",
    "₹25",
    "₹50",
    "₹100",
    "₹150",
    "₹200",
    "₹250",
  ];

  // Build color ui data from backend options
  const colorData = useMemo(() => {
    const opts = backendOptions?.options || [
      'Red','Blue','Green','Yellow','Orange','Pink','Black','White','Violet','Brown','Cyan','Gray'
    ];
    const colorMap: Record<string, { color: string; bg: string; text: string; border: string; emoji: string }>= {
      Red: { color:'#EF4444', bg:'bg-red-200', text:'text-red-800', border:'border-red-300', emoji:'🔴' },
      Blue:{ color:'#3B82F6', bg:'bg-blue-200', text:'text-blue-800', border:'border-blue-300', emoji:'🔵' },
      Green:{ color:'#10B981', bg:'bg-green-200', text:'text-green-800', border:'border-green-300', emoji:'🟢' },
      Yellow:{ color:'#F59E0B', bg:'bg-yellow-200', text:'text-yellow-800', border:'border-yellow-300', emoji:'🟡' },
      Orange:{ color:'#F97316', bg:'bg-orange-200', text:'text-orange-800', border:'border-orange-300', emoji:'🟠' },
      Pink:{ color:'#EC4899', bg:'bg-pink-200', text:'text-pink-800', border:'border-pink-300', emoji:'🩷' },
      Black:{ color:'#1F2937', bg:'bg-gray-800', text:'text-white', border:'border-gray-700', emoji:'⚫' },
      White:{ color:'#F3F4F6', bg:'bg-white', text:'text-gray-800', border:'border-gray-300', emoji:'⚪' },
      Violet:{ color:'#8B5CF6', bg:'bg-violet-200', text:'text-violet-800', border:'border-violet-300', emoji:'🟣' },
      Brown:{ color:'#A16207', bg:'bg-yellow-600', text:'text-white', border:'border-yellow-700', emoji:'🤎' },
      Cyan:{ color:'#06B6D4', bg:'bg-cyan-200', text:'text-cyan-800', border:'border-cyan-300', emoji:'🟦' },
      Gray:{ color:'#6B7280', bg:'bg-gray-400', text:'text-white', border:'border-gray-500', emoji:'🔘' },
    };
    return opts.map((name) => ({
      name,
      value: 0,
      color: colorMap[name]?.color || '#94a3b8',
      bgColor: colorMap[name]?.bg || 'bg-slate-200',
      textColor: colorMap[name]?.text || 'text-slate-800',
      borderColor: colorMap[name]?.border || 'border-slate-300',
      reward: '',
      emoji: colorMap[name]?.emoji || '🎨',
    }));
  }, [backendOptions]);

  // Color distribution data (placeholder values)
  const colorDistribution = useMemo(() => colorData.map((item) => ({
    name: item.name,
    value: item.value || 1,
    color: item.color,
  })), [colorData]);

  // Colour trade count data for bar chart
  const colourTradeData = [
    { colour: "Red", count: 45 },
    { colour: "Blue", count: 38 },
    { colour: "Green", count: 32 },
    { colour: "Yellow", count: 28 },
    { colour: "Orange", count: 25 },
    { colour: "Pink", count: 22 },
    { colour: "Black", count: 18 },
    { colour: "White", count: 15 },
    { colour: "Violet", count: 12 },
    { colour: "Gray", count: 8 },
  ];

  // Top performing colours
  const topPerformingColours = [
    { colour: "Red", rank: 1, icon: "🔴", trades: 48 },
    { colour: "Blue", rank: 2, icon: "🔵", trades: 42 },
    { colour: "Green", rank: 3, icon: "🟢", trades: 38 },
    { colour: "Yellow", rank: 4, icon: "🟡", trades: 35 },
    { colour: "Orange", rank: 5, icon: "🟠", trades: 31 },
  ];

  const handleSelectWinner = (colorName: string) => {
    if (winningColor) return; // Already revealed
    setSelectedWinner(colorName);
  };

  const handleConfirmWinner = async () => {
    if (!selectedWinner || winningColor) return;
    if (!round?.id) return;
    try {
      setIsRevealing(true);
      await AdminService.finalizeTradingRound(round.id, selectedWinner);
      setWinningColor(selectedWinner);
      setRevealHistory((prev) => [{
        id: Date.now(),
        winningColor: selectedWinner,
        reward: '',
        timestamp: new Date().toLocaleString(),
        plan: selectedPlan,
        emoji: colorData.find(c=>c.name===selectedWinner)?.emoji || '🎁',
        totalParticipants: 0,
        totalPool: 0,
      }, ...prev]);
      await fetchRound();
    } catch (e) {
      console.error('Finalize failed', e);
    } finally {
      setIsRevealing(false);
    }
  };

  const handleResetRound = () => {
    setWinningColor(null);
    setSelectedWinner(null);
    setRevealHistory([]);
  };

  const fetchOptions = async () => {
    try {
      const cfg = await AdminService.getTradingOptions('color');
      setBackendOptions(cfg);
    } catch (e) {
      console.error('Failed to fetch options', e);
    }
  };

  const fetchRound = async () => {
    try {
      setLoading(true);
      const res = await AdminService.listTradingRounds({ gameType: 'color', status: 'open', limit: 1 });
      const r = (res.rounds || [])[0] || null;
      setRound(r);
      setWinningColor(r?.status === 'settled' ? r?.winningOption ?? null : null);
      setSelectedWinner(null);
    } catch (e) {
      console.error('Failed to load round', e);
    } finally {
      setLoading(false);
    }
  };

  const createRound = async () => {
    try {
      const ends = new Date(Date.now() + 60 * 60 * 1000); // 1h from now
      const payload: any = { gameType: 'color', endsAt: ends.toISOString(), status: 'open' };
      await AdminService.createTradingRound(payload);
      await fetchRound();
    } catch (e) {
      console.error('Create round failed', e);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchRound();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Colour Trading Control Panel
          </h1>
          <p className="text-gray-600">
            Manage colour trading operations and rewards
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={fetchRound}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" size="sm" onClick={createRound}>
            <Download className="w-4 h-4 mr-2" />
            Create Round
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Colour Traders
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tradingStats.totalTraders}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Colour Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{tradingStats.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              +5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Colour Traders
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tradingStats.activeTraders}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline w-3 h-3 mr-1 text-orange-600" />
              -8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Popular Colour
            </CardTitle>
            <Badge variant="outline" className="text-red-600">
              Red
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              🔴 {tradingStats.popularColour}
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
            Currently viewing colour trading data for{" "}
            <strong>{selectedPlan} plan</strong>
          </p>
        </CardContent>
      </Card>

      {/* NOTE: Removed the separate top Winning Color Selection card. The grid below
          is the single source of selection. Confirm and reset controls are
          rendered in the Round Status area so admin interactions happen next to
          the grid. */}

      {/* Colour Trading Control Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Colour Trading Control - {selectedPlan} Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {colorData.map((color) => {
              const isSelected = selectedWinner === color.name;
              const isWinner = winningColor === color.name;
              const canSelect = !winningColor && !isRevealing;

              return (
                <div
                  key={color.name}
                  className={`${color.bgColor} ${
                    color.borderColor
                  } border rounded-lg p-4 text-center relative transition-all duration-300 cursor-pointer ${
                    isWinner
                      ? "ring-4 ring-yellow-400 shadow-2xl scale-105 bg-gradient-to-br from-yellow-100 to-orange-100"
                      : isSelected
                      ? "ring-2 ring-blue-400 shadow-lg bg-blue-50"
                      : winningColor
                      ? "opacity-60 grayscale"
                      : canSelect
                      ? "hover:shadow-lg hover:scale-102"
                      : ""
                  }`}
                  onClick={() => canSelect && handleSelectWinner(color.name)}
                >
                  {/* Selection Indicator */}
                  {isSelected && !winningColor && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                      <Star className="w-3 h-3" />
                    </div>
                  )}

                  {/* Winner Badge */}
                  {isWinner && (
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 rounded-full p-2 shadow-lg animate-bounce">
                      <Star className="w-4 h-4" />
                    </div>
                  )}

                  {/* Color Emoji */}
                  <div
                    className={`text-2xl mb-2 ${
                      isWinner ? "animate-pulse" : ""
                    } ${isSelected ? "animate-bounce" : ""}`}
                  >
                    {color.emoji}
                  </div>

                  {/* Color Name */}
                  <div className={`font-bold text-lg ${color.textColor}`}>
                    {color.name}
                  </div>

                  {/* Percentage */}
                  <div className={`text-sm ${color.textColor} opacity-75`}>
                    {color.value}%
                  </div>

                  {/* Status Messages */}
                  {isWinner ? (
                    <div className="mt-3 p-3 bg-yellow-200 rounded-lg border-2 border-yellow-400">
                      <div className="text-yellow-900 font-bold text-lg animate-pulse">
                        🎉 WINNER! 🎉
                      </div>
                      <div className="text-yellow-800 font-semibold">
                        {color.reward}
                      </div>
                    </div>
                  ) : isSelected && !winningColor ? (
                    <div className="mt-3 p-2 bg-blue-200 rounded text-blue-800 font-semibold text-sm">
                      ✓ Selected
                    </div>
                  ) : winningColor ? (
                    <div className="mt-3 p-2 bg-gray-200 rounded text-gray-600 text-xs">
                      Not selected
                    </div>
                  ) : canSelect ? (
                    <div className="mt-3 p-2 bg-green-100 rounded text-green-700 text-xs">
                      Click to select
                    </div>
                  ) : (
                    <div className="mt-3 p-2 bg-gray-100 rounded text-gray-500 text-xs">
                      Round in progress
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Round Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-900">Round Status</h4>
                <p className="text-sm text-gray-600">
                  {winningColor
                    ? `Winner: ${winningColor}`
                    : selectedWinner
                    ? `Selected: ${selectedWinner} - Click "Confirm Winner" below the grid to reveal`
                    : (round ? `Round #${round?.roundNumber} is active` : 'No active round. Click Create Round.')}
                </p>
              </div>

              <div className="text-right space-y-2">
                <div className="text-lg font-bold text-gray-900">
                  {selectedPlan} Plan
                </div>
                <div className="text-sm text-gray-600">
                  {round ? (winningColor
                    ? "Round Complete"
                    : selectedWinner
                    ? "Ready to Confirm"
                    : "Round Active") : 'No Round'}
                </div>

                {/* Confirm / Reset actions moved here so the grid remains the
                      single interactive selection area. */}
                <div className="mt-3">
                  {round && !winningColor ? (
                    <Button
                      onClick={handleConfirmWinner}
                      disabled={!selectedWinner || isRevealing}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 px-4 py-2 mr-2"
                    >
                      {isRevealing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Revealing...
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 mr-2" />
                          Confirm Winner
                        </>
                      )}
                    </Button>
                  ) : null}

                  {round && winningColor ? (
                    <Button
                      onClick={handleResetRound}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 px-4 py-2"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Selection
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colour Demand Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Colour Demand Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={colorDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {colorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Colour Trades Count */}
        <Card>
          <CardHeader>
            <CardTitle>Colour Trades Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={colourTradeData}>
                  <XAxis
                    dataKey="colour"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Colours */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Colours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topPerformingColours.map((item) => (
              <div
                key={item.colour}
                className="bg-gray-50 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-2">
                  #{item.rank} {item.icon}
                </div>
                <div className="font-semibold text-lg">{item.colour}</div>
                <div className="text-sm text-gray-600">Rank {item.rank}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reveal History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Winning Color History - {selectedPlan} Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revealHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No winning colors selected yet</p>
              <p className="text-sm">
                Select a color above and confirm to start a new round
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  Total rounds completed:{" "}
                  <strong>{revealHistory.length}</strong>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRevealHistory([])}
                >
                  Clear History
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {revealHistory.map((reveal) => (
                  <div
                    key={reveal.id}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{reveal.emoji}</span>
                        <div>
                          <div className="font-bold text-lg text-gray-900">
                            {reveal.winningColor} Wins!
                          </div>
                          <div className="text-sm text-gray-600">
                            {reveal.plan} Plan
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {reveal.reward}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reveal.timestamp}
                        </div>
                      </div>
                    </div>

                    {/* Round Statistics */}
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-yellow-200">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {reveal.totalParticipants}
                        </div>
                        <div className="text-xs text-gray-600">
                          Participants
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          ₹{reveal.totalPool.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Total Pool</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Statistics */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-green-900">
                      Round Summary
                    </h4>
                    <p className="text-sm text-green-700">
                      {revealHistory.length} rounds completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ₹
                      {revealHistory
                        .reduce((total, reveal) => total + reveal.totalPool, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700">
                      Total pool distributed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
