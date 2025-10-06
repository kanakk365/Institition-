"use client"

import { useState } from "react"
import { CustomExamHistory, CustomExamAttempts } from "@/components/custom-exam-history"

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

export default function CustomExamPage() {
  const [currentView, setCurrentView] = useState("exam-history")
  const [selectedExam, setSelectedExam] = useState<CustomExam | null>(null)
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)

  const handleViewExam = (exam: CustomExam) => {
    setSelectedExam(exam)
    setSelectedExamId(exam.id)
    setCurrentView("exam-details")
  }

  const handleViewExamById = (examId: string) => {
    setSelectedExamId(examId)
    setCurrentView("exam-details")
  }

  const handleBack = () => {
    setCurrentView("exam-history")
    setSelectedExam(null)
    setSelectedExamId(null)
  }

  const renderContent = () => {
    switch (currentView) {
      case "exam-details":
        return (
          <CustomExamAttempts
            examId={selectedExamId || selectedExam?.id || ""}
            examTitle={selectedExam?.title}
            onBack={handleBack}
          />
        )
      case "exam-history":
      default:
        return <CustomExamHistory onViewExam={handleViewExam} onViewExamById={handleViewExamById} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  )
}
