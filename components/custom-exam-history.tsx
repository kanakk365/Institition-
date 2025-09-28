import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import api from '@/lib/api'

interface CustomExam {
  id: string
  title: string
  topic: string
  timeLimitMinutes: number
  type: string
  difficulty: string
  createdAt: string
  questionCount: number
  totalMarks: number
  assignedCount: number
  completedCount: number
  averageScore: number | null
  standard: {
    id: string
    name: string
  } | null
  section: {
    id: string
    name: string
  } | null
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

interface CustomExamsResponse {
  exams: CustomExam[]
}

interface CustomExamHistoryProps {
  onViewExam?: (exam: CustomExam) => void
}

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

export function CustomExamHistory({ onViewExam }: CustomExamHistoryProps) {
  const [exams, setExams] = useState<CustomExam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCustomExams = async () => {
      try {
        setLoading(true)
        const response = await api.get<ApiResponse<CustomExamsResponse>>('/institution-admin/custom-exams/get')
        
        if (response.data.success) {
          setExams(response.data.data.exams)
        } else {
          setError('Failed to fetch custom exams')
        }
      } catch (err) {
        console.error('Error fetching custom exams:', err)
        const apiError = err as ApiError
        if (apiError.response?.status === 401) {
          const message = apiError.response.data?.message
          setError(message || 'You do not have permission to view custom exams yet.')
        } else {
          setError('Failed to fetch custom exams')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCustomExams()
  }, [])

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exam.standard?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleViewExam = (exam: CustomExam) => {
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
        <h1 className="text-2xl font-semibold">Custom Exams History</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search custom exams here" 
            className="pl-10 w-64 border-gray-200 focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Exam Title</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Topic</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Class/Section</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Questions</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Total Marks</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Assigned</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Avg Score</th>
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
                  {exam.standard && exam.section 
                    ? `${exam.standard.name} - ${exam.section.name}`
                    : 'Not assigned'
                  }
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.questionCount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.totalMarks}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.assignedCount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {exam.averageScore ? `${exam.averageScore}%` : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <Button 
                    size="sm" 
                    className="px-4 py-1 text-sm font-medium rounded button-primary"
                    onClick={() => handleViewExam(exam)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredExams.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No custom exams found</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
        <div>Showing {filteredExams.length > 0 ? `1-${filteredExams.length}` : '0'} of {filteredExams.length} custom exams</div>
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
