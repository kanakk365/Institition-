"use client"

import { useState } from "react"
import { CustomQuizHistory, CustomQuizAttempts } from "@/components/custom-quiz-history"

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

export default function CustomQuizPage() {
  const [currentView, setCurrentView] = useState("quiz-history")
  const [selectedQuiz, setSelectedQuiz] = useState<CustomQuiz | null>(null)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)

  const handleViewQuiz = (quiz: CustomQuiz) => {
    setSelectedQuiz(quiz)
    setSelectedQuizId(quiz.id)
    setCurrentView("quiz-details")
  }

  const handleViewQuizById = (quizId: string) => {
    setSelectedQuizId(quizId)
    setCurrentView("quiz-details")
  }

  const handleBack = () => {
    setCurrentView("quiz-history")
    setSelectedQuiz(null)
    setSelectedQuizId(null)
  }

  const renderContent = () => {
    switch (currentView) {
      case "quiz-details":
        return (
          <CustomQuizAttempts
            quizId={selectedQuizId || selectedQuiz?.id || ""}
            quizTitle={selectedQuiz?.title}
            onBack={handleBack}
          />
        )
      case "quiz-history":
      default:
        return <CustomQuizHistory onViewQuiz={handleViewQuiz} onViewQuizById={handleViewQuizById} />
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
