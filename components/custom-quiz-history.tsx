import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import api from '@/lib/api'

interface CustomQuiz {
  id: string
  title: string
  instructions: string
  timeLimitMinutes: number
  topic: string
  difficulty: string
  createdAt: string
  questionCount: number
  assignedCount: number
  completedCount: number
  averageScore: number | null
  classSection: {
    standardId: string
    sectionId: string | null
    standardName: string
    sectionName: string | null
  }
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

interface CustomQuizzesResponse {
  quizzes: CustomQuiz[]
}

interface CustomQuizHistoryProps {
  onViewQuiz?: (quiz: CustomQuiz) => void
}

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

export function CustomQuizHistory({ onViewQuiz }: CustomQuizHistoryProps) {
  const [quizzes, setQuizzes] = useState<CustomQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCustomQuizzes = async () => {
      try {
        setLoading(true)
        const response = await api.get<ApiResponse<CustomQuizzesResponse>>('/institution-admin/custom-quizzes/get')
        
        if (response.data.success) {
          setQuizzes(response.data.data.quizzes)
        } else {
          setError('Failed to fetch custom quizzes')
        }
      } catch (err) {
        console.error('Error fetching custom quizzes:', err)
        const apiError = err as ApiError
        if (apiError.response?.status === 401) {
          const message = apiError.response.data?.message
          setError(message || 'You do not have permission to view custom quizzes yet.')
        } else {
          setError('Failed to fetch custom quizzes')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCustomQuizzes()
  }, [])

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quiz.classSection.standardName?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleViewQuiz = (quiz: CustomQuiz) => {
    if (onViewQuiz) {
      onViewQuiz(quiz)
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
        <h1 className="text-2xl font-semibold">Custom Quizzes History</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search custom quizzes here" 
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
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Quiz Title</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Topic</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Class/Section</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Questions</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Time Limit</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Assigned</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Avg Score</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-gray-25 transition-colors relative">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 relative">
                  {quiz.title}
                  <div className="absolute bottom-0 left-6 right-6 h-px bg-gray-100 opacity-30"></div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{quiz.topic}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {quiz.classSection.standardName && quiz.classSection.sectionName 
                    ? `${quiz.classSection.standardName} - ${quiz.classSection.sectionName}`
                    : quiz.classSection.standardName || 'Not assigned'
                  }
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{quiz.questionCount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{quiz.timeLimitMinutes} min</td>
                <td className="px-6 py-4 text-sm text-gray-600">{quiz.assignedCount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {quiz.averageScore ? `${quiz.averageScore}%` : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <Button 
                    size="sm" 
                    className="px-4 py-1 text-sm font-medium rounded button-primary hover:bg-[var(--primary-600)]"
                    onClick={() => handleViewQuiz(quiz)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredQuizzes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No custom quizzes found</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
        <div>Showing {filteredQuizzes.length > 0 ? `1-${filteredQuizzes.length}` : '0'} of {filteredQuizzes.length} custom quizzes</div>
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
