"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

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

interface SectionSelectionProps {
  grade: string
}

export function SectionSelection({ grade }: SectionSelectionProps) {
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([])
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the selected standard from sessionStorage
    const storedStandard = sessionStorage.getItem('selectedStandard')
    if (storedStandard) {
      const standard: Standard = JSON.parse(storedStandard)
      setSelectedStandard(standard)
      setSections(standard.sections || [])
    }
    setLoading(false)
  }, [])

  const handleSectionSelect = (section: Section) => {
    if (!selectedStandard) return
    
    // Store both standard and section for the students page
    const selectionData = {
      standardName: selectedStandard.name,
      sectionName: section.name,
      standard: selectedStandard,
      section: section
    }
    sessionStorage.setItem('gradeAndSection', JSON.stringify(selectionData))
    
    // Navigate to student selection in create flow
    router.push(`/quizzes/create/students`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500"></div>
        </div>
      </div>
    )
  }

  if (!selectedStandard) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Error</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <p className="text-red-700 font-medium">No grade selected. Please go back and select a grade.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
              className="bg-cover bg-center rounded-2xl p-8 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 w-full h-32 min-h-[8rem]"
              style={{ backgroundImage: 'url(/section-selection.png)' }}
              onClick={() => handleSectionSelect(section)}
            >
              <h2 className="text-xl font-bold text-white text-center drop-shadow-lg h-full flex items-center justify-center">
                Section {section.name}
              </h2>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
