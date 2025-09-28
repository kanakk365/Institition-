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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{classStats.grade}</h1>
          <Badge className="bg-[var(--primary-100)] text-[color:var(--primary-800)] hover:bg-[var(--primary-100)]">
            Active
          </Badge>
        </div>

        {/* Students Section */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <button
              type="button"
              onClick={() => toggleSection("students")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--primary-50)]"
            >
              <h2 className="text-lg font-semibold text-gray-900">Students</h2>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                {expandedSections.students ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.students && (
              <div className="border-t border-[color:var(--primary-100)] p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{classStats.totalStudents}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Grade / Section</p>
                    <p className="text-lg font-semibold text-gray-900">A,B,C,D</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge className="bg-[var(--primary-100)] text-[color:var(--primary-800)]">
                      Active
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average score</p>
                    <p className="text-lg font-semibold text-gray-900">{classStats.statistics.overallPerformance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Projects Completed</p>
                    <p className="text-lg font-semibold text-gray-900">{classStats.statistics.projects.completed}+</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Exam Participation Rate</p>
                    <p className="text-lg font-semibold text-gray-900">98%</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quizzes Section */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <button
              type="button"
              onClick={() => toggleSection("quizzes")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--primary-50)]"
            >
              <h2 className="text-lg font-semibold text-gray-900">Quizzes</h2>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                {expandedSections.quizzes ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.quizzes && (
              <div className="overflow-hidden">
                <div className="bg-[color:var(--primary-500)] text-[color:var(--primary-foreground)] grid grid-cols-5 gap-4 px-4 py-3 text-sm font-medium">
                  <div>Quiz Title</div>
                  <div>Subject</div>
                  <div>Score</div>
                  <div>Time Taken</div>
                  <div>Date</div>
                </div>
                {quizData.map((quiz, index) => (
                  <div key={`${quiz.title}-${quiz.subject}-${index}`} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[color:var(--primary-100)] text-sm hover:bg-[var(--primary-50)] transition-colors">
                    <div className="text-gray-900">{quiz.title}</div>
                    <div className="text-gray-600">{quiz.subject}</div>
                    <div className="text-gray-900">{quiz.score}%</div>
                    <div className="text-gray-600">{quiz.timeTaken}</div>
                    <div className="text-gray-600">{quiz.date}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <button
              type="button"
              onClick={() => toggleSection("projects")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--primary-50)]"
            >
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                {expandedSections.projects ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.projects && (
              <div className="overflow-hidden">
                <div className="bg-[color:var(--primary-500)] text-[color:var(--primary-foreground)] grid grid-cols-4 gap-4 px-4 py-3 text-sm font-medium">
                  <div>Project Title</div>
                  <div>Status</div>
                  <div>Submission Date</div>
                  <div>Feedback</div>
                </div>
                {projectData.map((project, index) => (
                  <div key={`${project.title}-${project.status}-${index}`} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-[color:var(--primary-100)] text-sm hover:bg-[var(--primary-50)] transition-colors">
                    <div className="text-gray-900">{project.title}</div>
                    <div>
                      <Badge 
                        className="bg-[var(--primary-100)] text-[color:var(--primary-800)]"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="text-gray-600">{project.submissionDate}</div>
                    <div className="text-gray-600">{project.feedback}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exams Section */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <button
              type="button"
              onClick={() => toggleSection("exams")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--primary-50)]"
            >
              <h2 className="text-lg font-semibold text-gray-900">Exams</h2>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                {expandedSections.exams ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.exams && (
              <div className="overflow-hidden">
                <div className="bg-[color:var(--primary-500)] text-[color:var(--primary-foreground)] grid grid-cols-5 gap-4 px-4 py-3 text-sm font-medium">
                  <div>Exam title</div>
                  <div>Subject</div>
                  <div>Score</div>
                  <div>Time Taken</div>
                  <div>Date</div>
                </div>
                {examData.map((exam, index) => (
                  <div key={`${exam.title}-${exam.subject}-${index}`} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[color:var(--primary-100)] text-sm hover:bg-[var(--primary-50)] transition-colors">
                    <div className="text-gray-900">{exam.title}</div>
                    <div className="text-gray-600">{exam.subject}</div>
                    <div className="text-gray-900">{exam.score}%</div>
                    <div className="text-gray-600">{exam.timeTaken}</div>
                    <div className="text-gray-600">{exam.date}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
