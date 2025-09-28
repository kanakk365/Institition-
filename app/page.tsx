'use client';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityChart } from "@/components/activity-chart"
import { Button } from "@/components/ui/button"
import { RecentStudents } from "@/components/recent-students"
import { Users, ClipboardList, FolderOpen, TrendingUp } from "lucide-react"
import { useState, useEffect } from 'react';
import api from '@/lib/api';

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

export default function SuperAdminDashboard() {
  const { institution } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/institution-admin/dashboard');
        if (response.data.success) {
          setDashboardData(response.data.data.stats);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('Error fetching dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
            {institution && (
              <p className="text-gray-600 mt-1">Welcome back, {institution.name}</p>
            )}
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
          {!loading && !error && dashboardData && (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.totalStudents}</p>
                        <p className="text-sm text-gray-600">Total Students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-[var(--primary-50)] rounded-lg">
                        <ClipboardList className="h-6 w-6 text-[color:var(--primary-600)]" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.totalQuizzes}</p>
                        <p className="text-sm text-gray-600">Total Quizzes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-[var(--primary-50)] rounded-lg">
                        <FolderOpen className="h-6 w-6 text-[color:var(--primary-600)]" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.projectsInProgress}</p>
                        <p className="text-sm text-gray-600">Projects in Progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.avgClassScore}%</p>
                        <p className="text-sm text-gray-600">Avg Class Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Graph */}
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">Activity Graph</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      {dashboardData.activityGraph.timeframe}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ActivityChart data={dashboardData.activityGraph.data} />
                </CardContent>
              </Card>

              {/* Recently Added Students */}
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
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
