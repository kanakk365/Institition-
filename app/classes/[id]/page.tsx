"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from '@/lib/api'

interface ClassStatistics {
  standardId: string
  grade: string
  totalStudents: number
  statistics: {
    quizzes: {
      averageScore: number
      totalSubmissions: number
    }
    exams: {
      averageScore: number
      totalSubmissions: number
    }
    projects: {
      completed: number
    }
    overallPerformance: number
  }
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

interface Quiz {
  title: string
  subject: string
  score: number
  timeTaken: string
  date: string
}

interface Project {
  title: string
  status: "Approved" | "Pending"
  submissionDate: string
  feedback: string
}

interface Exam {
  title: string
  subject: string
  score: number
  timeTaken: string
  date: string
}

// Mock data for quizzes, projects, and exams (since they're not in the API response)
const quizData: Quiz[] = [
  { title: "Fractions Basics", subject: "Math", score: 82, timeTaken: "6 min", date: "03 Jul 2025" },
  { title: "Photosynthesis", subject: "Science", score: 90, timeTaken: "3 min", date: "03 Jul 2025" },
  { title: "Figures of Speech", subject: "English", score: 78, timeTaken: "7min", date: "12 Jul 2025" },
]

const projectData: Project[] = [
  { title: "My Smart City", status: "Approved", submissionDate: "13 Jul 2025", feedback: "Well done!" },
  { title: "Save Water Poster", status: "Pending", submissionDate: "-/-", feedback: "-/-" },
]

const examData: Exam[] = [
  { title: "Fractions Basics", subject: "Math", score: 82, timeTaken: "6 min", date: "03 Jul 2025" },
  { title: "Photosynthesis", subject: "Science", score: 90, timeTaken: "3 min", date: "03 Jul 2025" },
  { title: "Figures of Speech", subject: "English", score: 78, timeTaken: "7min", date: "12 Jul 2025" },
]

export default function ClassDetailsPage() {
  const params = useParams()
  const standardId = params.id as string
  
  const [classStats, setClassStats] = useState<ClassStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    students: true,
    quizzes: false,
    projects: false,
    exams: false,
  })

  useEffect(() => {
    const fetchClassStatistics = async () => {
      try {
        setLoading(true)
        const response = await api.get<ApiResponse<{ stats: ClassStatistics[] }>>(
          `/institution-admin/class-statistics/${standardId}`
        )
        
        if (response.data.success && response.data.data.stats.length > 0) {
          setClassStats(response.data.data.stats[0])
        } else {
          setError('No statistics found for this class')
        }
      } catch (err) {
        console.error('Error fetching class statistics:', err)
        setError('Failed to fetch class statistics')
      } finally {
        setLoading(false)
      }
    }

    if (standardId) {
      fetchClassStatistics()
    }
  }, [standardId])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[color:var(--primary-500)]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !classStats) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error || 'Class not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600">
              No data available for this page, I will add new API later
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
