"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import api from "@/lib/axios"

interface Standard {
  id: string
  name: string
  institutionId: string
  createdAt: string
  updatedAt: string
  sections: Section[]
}

interface Section {
  id: string
  name: string
  createdAt: string
}

interface StandardsResponse {
  statusCode: number
  success: boolean
  message: string
  data: {
    standards: Standard[]
    pagination: {
      currentPage: number
      totalPages: number
      totalCount: number
      limit: number
    }
  }
}

export default function QuizGradeSelectionPage() {
  const router = useRouter()
  const [standards, setStandards] = useState<Standard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null)

  const fetchAllStandards = useCallback(async () => {
    try {
      setLoading(true)
      let allStandards: Standard[] = []
      let currentPage = 1
      let hasMorePages = true

      while (hasMorePages) {
        const response = await api.get<StandardsResponse>(`/institution-admin/standards?page=${currentPage}`)
        
        if (response.data.success) {
          allStandards = [...allStandards, ...response.data.data.standards]
          
          // Check if there are more pages
          if (currentPage >= response.data.data.pagination.totalPages) {
            hasMorePages = false
          } else {
            currentPage++
          }
        } else {
          hasMorePages = false
          setError('Failed to fetch standards')
        }
      }

      setStandards(allStandards)
    } catch (error) {
      console.error('Error fetching standards:', error)
      setError('Failed to fetch standards')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllStandards()
  }, [fetchAllStandards])

  const handleGradeSelect = (standard: Standard) => {
    setSelectedStandard(standard)
    
    // Store the selected standard in sessionStorage for the quiz creation flow
    sessionStorage.setItem('selectedQuizStandard', JSON.stringify(standard))
    router.push(`/quizzes/create/section`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            ← Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Quiz - Select Grade</h1>
              <p className="text-gray-600">Choose the grade/class for your quiz</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading grades...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-3">❌</span>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {standards.slice().reverse().map((standard) => (
                <button
                  key={standard.id}
                  type="button"
                  className={`bg-cover bg-center rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 w-full h-32 min-h-[8rem] relative overflow-hidden ${
                    selectedStandard?.id === standard.id
                      ? 'border-4 border-green-500 shadow-xl scale-105'
                      : 'border-0 hover:shadow-lg'
                  }`}
                  style={{ backgroundImage: 'url(/grade-selection.png)' }}
                  onClick={() => handleGradeSelect(standard)}
                >
                  {selectedStandard?.id === standard.id && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-xl"></div>
                  )}
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <h2 className="text-xl font-bold text-white text-center drop-shadow-lg">
                      {standard.name}
                    </h2>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
