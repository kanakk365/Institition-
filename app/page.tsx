'use client';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecentStudents } from "@/components/recent-students"
import { Users, ClipboardList, FolderOpen, TrendingUp } from "lucide-react"
import { FormEvent, useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ChartBarInteractive, SubjectPerformanceData } from "@/components/ui/barchart"

const DEFAULT_INSTITUTION_ID = "cmcx8sm3y0000qe0r6xjq6imo";

interface DashboardStats {
  totalStudents: number;
  totalQuizzes: number;
  projectsInProgress: number;
  avgClassScore: number;
  activityGraph: {
    data: Array<{
      grade: string;
      averageScore: number;
    }>;
    timeframe: string;
  };
  recentStudents: {
    count: number;
    students: Array<{
      id: string;
      name: string;
      email: string;
      class: string;
      section: string;
      joinedAt: string;
    }>;
    timeframe: string;
  };
}

type SummaryMetric = {
  count: number;
  changeFromLastMonth: number;
};

interface InstitutionAnalytics {
  summary: {
    totalStudents: SummaryMetric;
    totalGrades: SummaryMetric;
    totalSections: SummaryMetric;
    totalTeachers: SummaryMetric;
  };
  performanceBySubject: SubjectPerformanceData[];
}

export default function SuperAdminDashboard() {
  const { institution, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'GPT' | 'CBSE' | 'CAMBRIDGE'>('GPT');
  const [isSubmittingMode, setIsSubmittingMode] = useState(false);
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<InstitutionAnalytics | null>(null);

  const normalizedBoard = useMemo(
    () => String(institution?.affiliatedBoard ?? '').trim().toUpperCase(),
    [institution?.affiliatedBoard]
  );

  const modeOptions = useMemo(() => {
    const options: Array<{ label: string; value: 'GPT' | 'CBSE' | 'CAMBRIDGE' }> = [
      { label: 'GPT', value: 'GPT' },
    ];

    if (normalizedBoard === 'CBSE') {
      options.push({ label: 'CBSE', value: 'CBSE' });
      return options;
    }

    if (normalizedBoard === 'CAMBRIDGE') {
      options.push({ label: 'CAMBRIDGE', value: 'CAMBRIDGE' });
      return options;
    }

    options.push(
      { label: 'CBSE', value: 'CBSE' },
      { label: 'CAMBRIDGE', value: 'CAMBRIDGE' },
    );

    return options;
  }, [normalizedBoard]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      const institutionId = institution?.id || DEFAULT_INSTITUTION_ID;

      const [dashboardResult, analyticsResult] = await Promise.allSettled([
        api.get('/institution-admin/dashboard'),
        api.get(`/analytics/institution/${institutionId}`),
      ]);

      let dashboardSuccess = false;
      if (dashboardResult.status === 'fulfilled') {
        const dashboardResponse = dashboardResult.value;
        if (dashboardResponse.data?.success && dashboardResponse.data?.data?.stats) {
          setDashboardData(dashboardResponse.data.data.stats);
          dashboardSuccess = true;
        } else {
          setDashboardData(null);
        }
      } else {
        console.error('Dashboard stats fetch failed:', dashboardResult.reason);
        setDashboardData(null);
      }

      let analyticsSuccess = false;
      if (analyticsResult.status === 'fulfilled') {
        const analyticsResponse = analyticsResult.value;
        if (analyticsResponse.data?.success && analyticsResponse.data?.data) {
          setAnalytics(analyticsResponse.data.data as InstitutionAnalytics);
          analyticsSuccess = true;
        } else {
          setAnalytics(null);
        }
      } else {
        console.error('Institution analytics fetch failed:', analyticsResult.reason);
        setAnalytics(null);
      }

      if (!dashboardSuccess && !analyticsSuccess) {
        setError('Error fetching dashboard data');
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [institution?.id, isAuthenticated]);

  useEffect(() => {
    if (!institution) {
      return;
    }

    const inferredMode = String(institution.affiliatedBoard || '')
      .trim()
      .toUpperCase();

    if (
      inferredMode === 'GPT' ||
      inferredMode === 'CBSE' ||
      inferredMode === 'CAMBRIDGE'
    ) {
      setMode(inferredMode);
    }
  }, [institution]);

  useEffect(() => {
    const allowedModes = modeOptions.map((option) => option.value);
    if (!allowedModes.includes(mode)) {
      setMode(allowedModes[0]);
    }
  }, [modeOptions, mode]);

  const handleModeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingMode) {
      return;
    }

    try {
      setIsSubmittingMode(true);
      const response = await api.post('/institution-admin/settings/switch', {
        mode,
      });

      const { data } = response;
      const success = Boolean(data?.success);
      const message =
        (data?.message as string | undefined) ??
        'Curriculum mode updated successfully';

      if (!success) {
        throw new Error(message);
      }

      const updatedMode = String(data?.data?.mode || mode).toUpperCase();
      if (
        updatedMode === 'GPT' ||
        updatedMode === 'CBSE' ||
        updatedMode === 'CAMBRIDGE'
      ) {
        setMode(updatedMode);
      }

      toast({
        title: 'Success',
        description: `Curriculum mode updated to ${updatedMode}.`,
        duration: 3000,
      });
    } catch (submitError) {
      const fallbackMessage =
        submitError instanceof Error
          ? submitError.message
          : 'Unable to update curriculum mode.';

      toast({
        title: 'Update failed',
        description: fallbackMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingMode(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                {institution && (
                  <p className="text-gray-600 mt-1">Welcome back, {institution.name}</p>
                )}
              </div>
              <form
                onSubmit={handleModeSubmit}
                className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:w-auto"
              >
                <fieldset className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <legend className="text-sm font-medium text-gray-700">
                    Curriculum mode
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {modeOptions.map((option) => {
                      const isSelected = mode === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            isSelected
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-red-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="curriculum-mode"
                            value={option.value}
                            checked={isSelected}
                            onChange={() => setMode(option.value)}
                            className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500 accent-red-600"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingMode}
                    className="whitespace-nowrap"
                  >
                    {isSubmittingMode ? 'Updating…' : 'Update mode'}
                  </Button>
                </fieldset>
              </form>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[color:var(--primary-500)]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && (
            <>
              {/* Summary Metrics */}
              {analytics && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[{
                    key: "totalStudents" as const,
                    title: "Total Students",
                    icon: <Users className="h-6 w-6 text-purple-600" />,
                    iconBg: "bg-purple-100",
                  }, {
                    key: "totalGrades" as const,
                    title: "Total Grades",
                    icon: <ClipboardList className="h-6 w-6 text-[color:var(--primary-600)]" />,
                    iconBg: "bg-[var(--primary-50)]",
                  }, {
                    key: "totalSections" as const,
                    title: "Total Sections",
                    icon: <FolderOpen className="h-6 w-6 text-[color:var(--primary-600)]" />,
                    iconBg: "bg-[var(--primary-50)]",
                  }, {
                    key: "totalTeachers" as const,
                    title: "Total Teachers",
                    icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
                    iconBg: "bg-blue-100",
                  }].map(({ key, title, icon, iconBg }) => {
                    const metric = analytics.summary[key];
                    const isPositive = metric.changeFromLastMonth >= 0;
                    return (
                      <Card key={key} className="bg-white border-0 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-lg ${iconBg}`}>
                                {icon}
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-gray-900">{metric.count.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">{title}</p>
                              </div>
                            </div>
                            
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              

              {/* Performance by Subject */}
              {analytics?.performanceBySubject?.length ? (
                <ChartBarInteractive performanceData={analytics.performanceBySubject} />
              ) : null}

              {/* Recently Added Students */}
              {dashboardData && (
                <Card className="bg-white border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Recently added students ({dashboardData.recentStudents.timeframe})
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        See All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RecentStudents students={dashboardData.recentStudents.students} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
