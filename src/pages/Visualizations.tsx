import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowLeft, BarChart3, PieChart, LineChart, Download } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  LineChart as RechartsLineChart, 
  Line,
  Area,
  AreaChart,
  ResponsiveContainer
} from 'recharts';

const COLORS = [
  'hsl(var(--chart-primary))',
  'hsl(var(--chart-secondary))',
  'hsl(var(--chart-tertiary))',
  'hsl(var(--chart-warning))',
  'hsl(var(--chart-success))',
];

interface VisualizationsProps {
  data?: any[];
  filename?: string;
}

const Visualizations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data = [], filename = 'dataset' } = (location.state || {}) as VisualizationsProps;
  
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const numericColumns = useMemo(() => {
    if (data.length === 0) return [];
    return columns.filter(col => 
      data.some(row => typeof row[col] === 'number' || !isNaN(Number(row[col])))
    );
  }, [columns, data]);

  const chartData = useMemo(() => {
    if (!selectedXAxis || !selectedYAxis || data.length === 0) return [];
    
    const grouped = data.reduce((acc, row) => {
      const xValue = String(row[selectedXAxis]);
      const yValue = Number(row[selectedYAxis]) || 0;
      
      if (!acc[xValue]) {
        acc[xValue] = { name: xValue, value: 0, count: 0 };
      }
      acc[xValue].value += yValue;
      acc[xValue].count += 1;
      
      return acc;
    }, {} as Record<string, { name: string; value: number; count: number }>);

    return Object.values(grouped).slice(0, 10); // Limit to top 10 for readability
  }, [data, selectedXAxis, selectedYAxis]);

  const pieData = useMemo(() => {
    if (!selectedXAxis || data.length === 0) return [];
    
    const grouped = data.reduce((acc, row) => {
      const value = String(row[selectedXAxis]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number))
      .slice(0, 8);
  }, [data, selectedXAxis]);

  if (data.length === 0) {
    return (
      <div className="min-h-screen hero-gradient">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">No Data Available</h1>
            <p className="text-xl text-muted-foreground">Please upload data first to create visualizations.</p>
            <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-chart-primary to-chart-secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Upload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mb-4 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-chart-primary via-accent to-chart-secondary bg-clip-text text-transparent">
                Data Visualizations
              </h1>
              <p className="text-xl text-muted-foreground">
                Explore your data with interactive charts and graphs
              </p>
            </div>
            <div className="text-right space-y-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {filename}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {data.length.toLocaleString()} rows • {columns.length} columns
              </p>
            </div>
          </div>

          {/* Controls */}
          <Card className="floating-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-chart-primary" />
                Chart Configuration
              </CardTitle>
              <CardDescription>
                Select data fields and chart type to generate visualizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">X-Axis (Categories)</label>
                  <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select column..." />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Y-Axis (Values)</label>
                  <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select numeric column..." />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Chart Type</label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          {selectedXAxis && (chartType === 'pie' || selectedYAxis) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Chart */}
              <Card className="floating-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {chartType === 'bar' && <BarChart3 className="h-5 w-5" />}
                      {chartType === 'line' && <LineChart className="h-5 w-5" />}
                      {chartType === 'area' && <LineChart className="h-5 w-5" />}
                      {chartType === 'pie' && <PieChart className="h-5 w-5" />}
                      {chartType === 'pie' ? `${selectedXAxis} Distribution` : `${selectedYAxis} by ${selectedXAxis}`}
                    </span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {chartType === 'bar' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="name" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar 
                            dataKey="value" 
                            fill="hsl(var(--chart-primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    
                    {chartType === 'line' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="name" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(var(--chart-primary))"
                            strokeWidth={3}
                            dot={{ fill: 'hsl(var(--chart-primary))', strokeWidth: 2, r: 4 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    )}

                    {chartType === 'area' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="name" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                          />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(var(--chart-primary))"
                            fill="hsl(var(--chart-primary))"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}

                    {chartType === 'pie' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Pie 
                            data={pieData} 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={120}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Chart Types Grid */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="glass-card">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {columns.slice(0, 6).map((col, idx) => (
                        <Card key={col} className="floating-card">
                          <CardContent className="p-6">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-sm text-muted-foreground">{col}</h3>
                              <p className="text-2xl font-bold" style={{ color: COLORS[idx % COLORS.length] }}>
                                {numericColumns.includes(col) 
                                  ? data.reduce((sum, row) => sum + (Number(row[col]) || 0), 0).toLocaleString()
                                  : new Set(data.map(row => row[col])).size
                                }
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {numericColumns.includes(col) ? 'Total Value' : 'Unique Values'}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizations;