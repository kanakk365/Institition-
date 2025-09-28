"use client"

import { CustomQuizHistory } from "@/components/custom-quiz-history"

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
  const handleViewQuiz = (quiz: CustomQuiz) => {
    // Navigate to quiz details or implement view logic
    console.log("Viewing quiz:", quiz)
    // You can implement navigation to quiz details page here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <CustomQuizHistory onViewQuiz={handleViewQuiz} />
      </div>
    </div>
  )
}
