import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Share2,
  Plus,
  Info,
  Loader2,
  RefreshCw,
  AlertOctagon,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getGraphData, getHealthInsights } from '@/lib/api/timeline';
import type { BiomarkerGraphData, HealthInsight } from '@/types/timeline';

// Dummy timeline data (used as fallback when API fails or for demo)
const DUMMY_TIMELINE_DATA = [
  { date: 'Jul 23', hba1c: 5.6, cholesterol: 220, glucose: 92, creatinine: 1.0 },
  { date: 'Oct 23', hba1c: 5.8, cholesterol: 215, glucose: 95, creatinine: 1.0 },
  { date: 'Jan 24', hba1c: 6.1, cholesterol: 210, glucose: 102, creatinine: 1.1 },
  { date: 'Apr 24', hba1c: 6.3, cholesterol: 200, glucose: 108, creatinine: 1.2 },
  { date: 'Jul 24', hba1c: 6.5, cholesterol: 195, glucose: 112, creatinine: 1.3 },
  { date: 'Oct 24', hba1c: 6.7, cholesterol: 190, glucose: 115, creatinine: 1.4 },
  { date: 'Jan 25', hba1c: 6.9, cholesterol: 185, glucose: 118, creatinine: 1.4 },
];

const DUMMY_ANNOTATIONS = [
  { date: 'Jan 24', label: 'Started Metformin' },
  { date: 'Jul 24', label: 'Diet change' },
];

const testOptions = [
  { id: 'hba1c', label: 'HbA1c', color: '#22c55e', unit: '%' },
  { id: 'cholesterol', label: 'Cholesterol', color: '#10b981', unit: 'mg/dL' },
  { id: 'glucose', label: 'Fasting Glucose', color: '#f59e0b', unit: 'mg/dL' },
  { id: 'creatinine', label: 'Creatinine', color: '#ef4444', unit: 'mg/dL' },
];

const insights = [
  {
    type: 'trend',
    icon: TrendingUp,
    title: 'HbA1c Rising',
    description: 'HbA1c has increased 0.15% per month over the last 18 months',
    severity: 'warning',
  },
  {
    type: 'trend',
    icon: TrendingDown,
    title: 'Cholesterol Improving',
    description: 'LDL cholesterol decreased 16% since starting medication',
    severity: 'success',
  },
  {
    type: 'pattern',
    icon: AlertTriangle,
    title: 'Kidney Function Declining',
    description: 'Creatinine levels have been steadily increasing. Consult nephrologist.',
    severity: 'error',
  },
];

const dateRanges = ['3 months', '6 months', '1 year', 'All time'];

export default function Timeline() {
  const [selectedTests, setSelectedTests] = useState(['hba1c', 'cholesterol']);
  const [dateRange, setDateRange] = useState('1 year');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDummyData, setUsingDummyData] = useState(false);
  
  // Chart data (transformed from API)
  const [timelineData, setTimelineData] = useState<any[]>(DUMMY_TIMELINE_DATA);
  const [annotations, setAnnotations] = useState<any[]>(DUMMY_ANNOTATIONS);
  const [insights, setInsights] = useState<any[]>([]);
  const [availableTests, setAvailableTests] = useState(testOptions);

  // Fetch timeline data from API
  useEffect(() => {
    fetchTimelineData();
  }, [dateRange]);

  const fetchTimelineData = async () => {
    setIsLoading(true);
    setError(null);
    setUsingDummyData(false);

    try {
      // Calculate date range
      const dateFrom = getDateFromRange(dateRange);
      
      // Fetch graph data for selected biomarkers
      const graphData = await getGraphData({
        biomarkers: selectedTests,
        date_from: dateFrom,
      });

      // Fetch AI insights
      const insightsData = await getHealthInsights({
        months: dateRange === '3 months' ? 3 : dateRange === '6 months' ? 6 : 12,
      });

      // Transform API response to chart format
      const transformedData = transformGraphDataToChartFormat(graphData.biomarkers);
      
      setTimelineData(transformedData);
      setAnnotations(graphData.annotations.map(a => ({
        date: format(new Date(a.annotation_date), 'MMM yy'),
        label: a.annotation_text,
      })));
      
      // Transform insights
      const transformedInsights = insightsData.insights.map(insight => ({
        type: insight.type,
        icon: insight.severity === 'warning' || insight.severity === 'critical' ? AlertTriangle : 
              insight.type === 'improvement' ? TrendingDown : TrendingUp,
        title: insight.title,
        description: insight.description,
        severity: insight.severity === 'critical' ? 'error' : insight.severity,
      }));
      
      setInsights(transformedInsights);
      
    } catch (err) {
      // Get error details
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      console.error('❌ Timeline API Error:', {
        message: errorMessage,
        status: (err as any)?.status,
        fullError: err,
      });
      
      // Show error toast
      toast.error(`Timeline API Error: ${errorMessage}`, {
        description: 'Using demo data. Check console for details.',
        duration: 5000,
      });
      
      // Fallback to dummy data
      setTimelineData(DUMMY_TIMELINE_DATA);
      setAnnotations(DUMMY_ANNOTATIONS);
      setInsights([
        {
          type: 'trend',
          icon: TrendingUp,
          title: 'HbA1c Rising',
          description: 'HbA1c has increased 0.15% per month over the last 18 months',
          severity: 'warning',
        },
        {
          type: 'trend',
          icon: TrendingDown,
          title: 'Cholesterol Improving',
          description: 'LDL cholesterol decreased 16% since starting medication',
          severity: 'success',
        },
        {
          type: 'pattern',
          icon: AlertTriangle,
          title: 'Kidney Function Declining',
          description: 'Creatinine levels have been steadily increasing. Consult nephrologist.',
          severity: 'error',
        },
      ]);
      setUsingDummyData(true);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Get date string based on range
  const getDateFromRange = (range: string): string => {
    const now = new Date();
    let monthsAgo = 12;
    
    switch (range) {
      case '3 months':
        monthsAgo = 3;
        break;
      case '6 months':
        monthsAgo = 6;
        break;
      case '1 year':
        monthsAgo = 12;
        break;
      case 'All time':
        monthsAgo = 60; // 5 years
        break;
    }
    
    const dateFrom = new Date(now);
    dateFrom.setMonth(dateFrom.getMonth() - monthsAgo);
    return dateFrom.toISOString().split('T')[0];
  };

  // Helper: Transform API biomarker data to chart format
  const transformGraphDataToChartFormat = (biomarkers: BiomarkerGraphData[]): any[] => {
    // Group all data points by date
    const dateMap = new Map<string, any>();
    
    biomarkers.forEach(biomarker => {
      const standardName = biomarker.standard_name;
      
      biomarker.data_points.forEach(point => {
        const dateKey = format(new Date(point.date), 'MMM yy');
        
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, { date: dateKey });
        }
        
        dateMap.get(dateKey)![standardName] = point.value;
      });
    });
    
    // Convert to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const toggleTest = (testId: string) => {
    setSelectedTests(prev =>
      prev.includes(testId)
        ? prev.filter(t => t !== testId)
        : [...prev, testId]
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Health Timeline
                </h1>
                <p className="text-muted-foreground">
                  Track your health biomarkers over time and spot trends
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTimelineData}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* API Error Banner */}
          {usingDummyData && error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">Timeline API Connection Failed</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Error:</strong> {error}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Showing demo data. Check browser console (F12) for full error details.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchTimelineData}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading timeline data...</p>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Chart Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Test Selection */}
                  <div className="flex flex-wrap items-center gap-3">
                    {testOptions.map((test) => (
                      <label
                        key={test.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                          selectedTests.includes(test.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Checkbox
                          checked={selectedTests.includes(test.id)}
                          onCheckedChange={() => toggleTest(test.id)}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: test.color }}
                        />
                        <span className="text-sm font-medium">{test.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                    {dateRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          dateRange === range
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Trend Analysis</span>
                      {usingDummyData && (
                        <Badge variant="outline" className="text-xs">Demo Data</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Note
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                        />
                        
                        {/* Reference area for normal HbA1c range */}
                        {selectedTests.includes('hba1c') && (
                          <ReferenceArea y1={4} y2={5.7} fill="hsl(142, 71%, 45%)" fillOpacity={0.1} />
                        )}

                        {/* Annotation lines */}
                        {annotations.map((anno, i) => (
                          <ReferenceLine
                            key={i}
                            x={anno.date}
                            stroke="hsl(var(--muted-foreground))"
                            strokeDasharray="5 5"
                            label={{
                              value: anno.label,
                              position: 'top',
                              fill: 'hsl(var(--muted-foreground))',
                              fontSize: 11,
                            }}
                          />
                        ))}

                        {availableTests.map((test) => (
                          selectedTests.includes(test.id) && (
                            <Line
                              key={test.id}
                              type="monotone"
                              dataKey={test.id}
                              stroke={test.color}
                              strokeWidth={2}
                              dot={{ fill: test.color, strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, fill: test.color }}
                              name={`${test.label} (${test.unit})`}
                            />
                          )
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-border">
                    {availableTests.filter(t => selectedTests.includes(t.id)).map((test) => (
                      <div key={test.id} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: test.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {test.label} ({test.unit})
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="w-3 h-3 rounded bg-primary/20" />
                      <span className="text-sm text-muted-foreground">Normal Range</span>
                    </div>
                  </div>
                </motion.div>
            </div>

            {/* Insights Panel */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                  AI Insights
                </h3>
                
                <div className="space-y-4">
                  {insights.map((insight, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl ${
                        insight.severity === 'success' ? 'bg-success/10' :
                        insight.severity === 'warning' ? 'bg-warning/10' : 'bg-error/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          insight.severity === 'success' ? 'bg-success/20 text-success' :
                          insight.severity === 'warning' ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                        }`}>
                          <insight.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground text-sm mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-muted/50 flex items-start gap-3">
                  <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    These insights are AI-generated and should not replace professional medical advice.
                  </p>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                  Latest Values
                </h3>
                
                <div className="space-y-3">
                  {availableTests.map((test) => {
                    if (timelineData.length < 2) return null;
                    
                    const latestValue = timelineData[timelineData.length - 1][test.id as keyof typeof timelineData[0]];
                    const prevValue = timelineData[timelineData.length - 2][test.id as keyof typeof timelineData[0]];
                    
                    if (!latestValue || !prevValue) return null;
                    
                    const change = ((Number(latestValue) - Number(prevValue)) / Number(prevValue) * 100).toFixed(1);
                    const isUp = Number(change) > 0;
                    
                    return (
                      <div key={test.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: test.color }}
                          />
                          <span className="text-sm text-muted-foreground">{test.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {latestValue} {test.unit}
                          </span>
                          <Badge variant={isUp ? 'warning' : 'success'} className="text-xs">
                            {isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {change}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
}
