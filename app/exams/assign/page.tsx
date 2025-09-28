'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { StudentList } from '@/components/student-list'

interface Standard {
  id: number
  name: string
}

interface Section {
  id: number
  name: string
  classstandardid: number
  standard: Standard
}

export default function ExamStudentAssignment() {
  const router = useRouter()
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])

  useEffect(() => {
    // Get selected standard and section from sessionStorage
    const standard = sessionStorage.getItem('selectedStandard')
    const section = sessionStorage.getItem('selectedSection')
    
    if (!standard || !section) {
      router.push('/exams/create/grade')
      return
    }

    setSelectedStandard(JSON.parse(standard))
    setSelectedSection(JSON.parse(section))
  }, [router])

  const handleStudentsSelect = (studentIds: number[]) => {
    setSelectedStudents(studentIds)
  }

  const handleNext = () => {
    if (selectedStudents.length > 0) {
      // Store selected students in sessionStorage
      sessionStorage.setItem('selectedStudents', JSON.stringify(selectedStudents))
      // Navigate to exam creation form
      router.push('/exams/create')
    }
  }

  const handleBack = () => {
    router.push('/exams/create/section')
  }

  if (!selectedStandard || !selectedSection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create Exam - Assign Students</h1>
              <p className="text-sm text-gray-600 mt-1">
                Grade: {selectedStandard.name} | Section: {selectedSection.name}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={selectedStudents.length === 0}
                className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Create Exam ({selectedStudents.length} students)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Students</h2>
          <p className="text-gray-600">Choose students who will take this exam</p>
        </div>

        {/* Selection Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Grade:</span>
              <span className="ml-2 text-sm text-gray-900">{selectedStandard.name}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Section:</span>
              <span className="ml-2 text-sm text-gray-900">{selectedSection.name}</span>
            </div>
          </div>
        </div>

        {/* Student List Component */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <StudentList
            sectionId={selectedSection.id}
            onStudentsSelect={handleStudentsSelect}
            selectedStudents={selectedStudents}
          />
        </div>

        {/* Selected Students Summary */}
        {selectedStudents.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <title>Students Selected</title>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {selectedStudents.length} student{selectedStudents.length === 1 ? '' : 's'} selected for the exam
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
