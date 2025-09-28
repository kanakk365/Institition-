"use client"

import { CustomExamHistory } from "@/components/custom-exam-history"

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
  const handleViewExam = (exam: CustomExam) => {
    // Navigate to exam details or implement view logic
    console.log("Viewing exam:", exam)
    // You can implement navigation to exam details page here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <CustomExamHistory onViewExam={handleViewExam} />
      </div>
    </div>
  )
}
