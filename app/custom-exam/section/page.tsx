"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Section {
  id: string
  name: string
  createdAt: string
}

interface Standard {
  id: string
  name: string
  sections: Section[]
}

export default function CustomExamSectionPage() {
  const router = useRouter()
  const [standard, setStandard] = useState<Standard | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('customExamSelectedStandard')
    if (stored) {
      const s = JSON.parse(stored) as Standard
      setStandard(s)
      setSections(s.sections || [])
    } else {
      router.push('/custom-exam/grade')
    }
  }, [router])

  const handleSectionSelect = (section: Section) => {
    if (!standard) return
    
    const payload = {
      standardName: standard.name,
      sectionName: section.name,
      standard,
      section,
    }
    sessionStorage.setItem('customExamGradeAndSection', JSON.stringify(payload))
    router.push('/custom-exam/students')
  }

  if (!standard) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <button type="button" onClick={() => router.back()} className="text-gray-600 mb-4">← Back</button>
          <h1 className="text-2xl font-semibold">Select Section - {standard.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map(sec => (
            <button 
              key={sec.id} 
              type="button"
              onClick={() => handleSectionSelect(sec)} 
              className="rounded-2xl p-8 bg-cover bg-center hover:shadow-lg transition-all duration-300 hover:scale-105" 
              style={{backgroundImage: 'url(/section-selection.png)'}}
            >
              <div className="text-white text-center text-xl font-bold drop-shadow-lg">Section {sec.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
