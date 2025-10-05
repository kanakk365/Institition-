import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import api from '@/lib/api'

interface Question {
  id: string
  text: string
  type: string
  marks: number
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
}

interface Exam {
  id: string
  title: string
  topic: string
  difficulty: string
  type: string
  timeLimitMinutes: number
  createdAt: string
  isActive: boolean
  teacher: {
    id: string
    name: string
  }
  classSection: {
    standardId: string | null
    standardName: string | null
    sectionId: string | null
    sectionName: string | null
  }
  stats: {
    totalAssigned: number
    completed: number
    averageScore: number | null
  }
  questions: Question[]
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

interface ExamHistoryProps {
  onViewExam?: (exam: Exam) => void
}

export function ExamHistory({ onViewExam }: ExamHistoryProps) {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true)
        const response = await api.get<ApiResponse<Exam[]>>('/teacher/exams/all')
        
        if (response.data.success) {
          setExams(response.data.data)
        } else {
          setError('Failed to fetch exams')
        }
      } catch (err) {
        console.error('Error fetching exams:', err)
        setError('Failed to fetch exams')
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exam.classSection.standardName?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleViewExam = (exam: Exam) => {
    if (onViewExam) {
      onViewExam(exam)
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary-500)]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">All Exams History</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search exams here" 
            className="pl-10 w-64 border-gray-200 focus:border-[color:var(--primary-500)] focus:ring-[color:var(--primary-500)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
        {/* Table */}
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Exam Title</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Topic</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Class/Section</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Avg Score</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Assigned</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-25 transition-colors relative">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 relative">
                  {exam.title}
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gray-100 opacity-30"></div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.topic}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {exam.classSection.standardName && exam.classSection.sectionName 
                    ? `${exam.classSection.standardName} - ${exam.classSection.sectionName}`
                    : 'Not assigned'
                  }
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {exam.stats.averageScore ? `${exam.stats.averageScore}%` : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.stats.totalAssigned}</td>
                <td className="px-6 py-4">
                  <Button 
                    size="sm" 
                    className="button-primary px-4 py-1 text-sm font-medium rounded"
                    onClick={() => handleViewExam(exam)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
        <div>Showing {filteredExams.length > 0 ? `1-${filteredExams.length}` : '0'} of {filteredExams.length} exams</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            ‹
          </Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">
            ›
          </Button>
        </div>
      </div>
    </div>
  )
}
