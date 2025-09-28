'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Section {
  id: string
  name: string
  createdAt: string
}

interface Standard {
  id: string
  name: string
  institutionId: string
  createdAt: string
  updatedAt: string
  sections: Section[]
}

export default function QuizSectionSelection() {
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the selected standard from sessionStorage
    const storedStandard = sessionStorage.getItem('selectedQuizStandard')
    if (storedStandard) {
      const standard: Standard = JSON.parse(storedStandard)
      setSelectedStandard(standard)
      setSections(standard.sections || [])
    } else {
      // No grade selected, redirect back to grade selection
      router.push('/quizzes/create/grade')
    }
    setLoading(false)
  }, [router])

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section)
    
    if (!selectedStandard) return
    
    // Store both standard and section for the students page
    const selectionData = {
      standardName: selectedStandard.name,
      sectionName: section.name,
      standard: selectedStandard,
      section: section
    }
    sessionStorage.setItem('quizGradeAndSection', JSON.stringify(selectionData))
    
    // Navigate to student list in quiz create flow
    router.push(`/quizzes/create/assign`)
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Quiz - Select Section</h1>
              <p className="text-gray-600">Choose the section for your quiz</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[color:var(--primary-500)]"></div>
              </div>
            </>
          ) : !selectedStandard ? (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">Error</h1>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <p className="text-red-700 font-medium">No grade selected. Please go back and select a grade.</p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">
                Select section - {selectedStandard.name}
              </h1>

              {sections.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <p className="text-yellow-700 font-medium">
                    No sections available for {selectedStandard.name}. Please contact your administrator.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className={`bg-cover bg-center rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 w-full h-32 min-h-[8rem] relative overflow-hidden ${
                        selectedSection?.id === section.id
                          ? 'border-4 border-[color:var(--primary-500)] shadow-xl scale-105'
                          : 'border-0 hover:shadow-lg'
                      }`}
                      style={{ backgroundImage: 'url(/section-selection.png)' }}
                      onClick={() => handleSectionSelect(section)}
                    >
                      {selectedSection?.id === section.id && (
                        <div className="absolute inset-0 rounded-xl bg-[color:var(--primary-500)] bg-opacity-20"></div>
                      )}
                      <div className="relative z-10 h-full flex items-center justify-center">
                        <h2 className="text-xl font-bold text-white text-center drop-shadow-lg">
                          Section {section.name}
                        </h2>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
