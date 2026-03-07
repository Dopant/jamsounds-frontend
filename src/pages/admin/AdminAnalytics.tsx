import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  DollarSign,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Tablet
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('adminToken');
        console.log('AdminAnalytics: using token', token);
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <AdminLayout><div className="p-8 text-center">Loading analytics...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-8 text-center text-red-500">{error}</div></AdminLayout>;
  if (!analytics) return <AdminLayout><div className="p-8 text-center">No analytics data.</div></AdminLayout>;

  // Remove user/revenue metrics, use only backend metrics
  const { totalRating, avgRating, totalViews, topByViews, topByRating, globalDistribution, deviceBreakdown } = analytics;

  // Calculate total visits for country percentage
  const totalCountryVisits = globalDistribution?.reduce((sum: number, row: any) => sum + row.count, 0) || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive platform analytics and insights
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalViews?.toLocaleString() ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalRating?.toLocaleString() ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total Rating</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Avg: {avgRating?.toFixed(2) ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Content by Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topByViews?.map((content: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{content.title}</p>
                      <p className="text-sm text-muted-foreground">{content.views.toLocaleString()} views</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{content.rating}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Content by Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topByRating?.map((content: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{content.title}</p>
                      <p className="text-sm text-muted-foreground">{content.rating} rating</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{content.views} views</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Distribution and Device Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User distribution by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {globalDistribution?.map((row: any, idx: number) => (
                  <div key={idx} className="mb-2">
                    <div className="flex justify-between text-sm items-center">
                      <span className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>{row.country}</span>
                      </span>
                      <span>{row.count.toLocaleString()} ({totalCountryVisits ? Math.round((row.count / totalCountryVisits) * 100) : 0}%)</span>
                    </div>
                    <Progress value={totalCountryVisits ? (row.count / totalCountryVisits) * 100 : 0} className="h-2" />
                  </div>
                ))}
                {globalDistribution?.length === 0 && <div className="text-muted-foreground">No data yet.</div>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Desktop, Mobile, Tablet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deviceBreakdown?.map((row: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {row.device === "Desktop" && <Monitor className="w-4 h-4" />}
                      {row.device === "Mobile" && <Smartphone className="w-4 h-4" />}
                      {row.device === "Tablet" && <Tablet className="w-4 h-4" />}
                      <span>{row.device}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{row.count.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {deviceBreakdown?.length === 0 && <div className="text-muted-foreground">No data yet.</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;