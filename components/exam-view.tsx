"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Edit } from "lucide-react"

interface ExamData {
  title: string
  subject: string
  description: string
  examType: string
  dueDate: string
  timeLimit: string
  topic: string
  difficulty: string
  questionCount: string
  bloomTaxonomy: string
}

export interface ExamViewStudent {
  _id: string
  name: string
  email: string
  rollNumber: string
  status: 'active' | 'inactive'
}

interface GradeAndSection {
  standard: { id: string; name: string }
  section: { id: string; name: string }
  standardName: string
  sectionName: string
}

interface ExamViewProps {
  examData?: ExamData
  gradeAndSection?: GradeAndSection | null
  selectedStudents?: ExamViewStudent[]
  onCancel?: () => void
  onEdit?: () => void
  onGenerate?: () => void
  loading?: boolean
  error?: string
  success?: string
  isResultView?: boolean
}

export function ExamView({ 
  examData, 
  gradeAndSection, 
  selectedStudents = [], 
  onCancel, 
  onEdit, 
  onGenerate,
  loading = false,
  error = '',
  success = '',
  isResultView = false 
}: ExamViewProps) {
  if (isResultView) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-8">Ananya Joshi</h1>

        <div className="max-w-4xl space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Overview</h2>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Exam Title</div>
                <div className="font-medium">Mid-Term Math</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Student</div>
                <div className="font-medium">Anaya Joshi (Grade 5B)</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Class</div>
                <div className="font-medium">6A</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-sm text-gray-600 mb-1">Subject</div>
                <div className="font-medium">Math</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Date</div>
                <div className="font-medium">10 Jul , 10:00 AM</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className="font-medium" style={{ color: "var(--primary-600)" }}>Submitted</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Question and Answers</h2>
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-gray-400" />
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="font-medium mb-2">Q1. What is ½ + ¼?</div>
                <div className="mb-1" style={{ color: "var(--primary-600)" }}>Student's Answer: ¾ -Correct</div>
                <div style={{ color: "var(--primary-600)" }}>Correct Answer: ¾</div>
              </div>

              <div>
                <div className="font-medium mb-2">Convert 0.75 to a fraction.</div>
                <div className="text-red-500 mb-1">Student's Answer: ¾ -Incorrect</div>
                <div style={{ color: "var(--primary-600)" }}>Correct Answer: 1.02</div>
              </div>

              <div>
                <div className="font-medium mb-2">Decimal of 6.09</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="button-primary">Mark as viewed</Button>
          </div>
        </div>
      </div>
    )
  }

  const defaultExamData = {
    title: "Fractions Basics",
    subject: "Maths",
    description: "Set dive into world of fractions..",
    examType: "Class test",
    dueDate: "10 July , 2025",
    timeLimit: "10 min",
    topic: "Fractions",
    difficulty: "Medium",
    questionCount: "5",
    bloomTaxonomy: "remember"
  }

  const data = examData || defaultExamData

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-6xl">
        {/* Header with title and buttons */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">S</div>
            <h1 className="text-lg font-medium text-gray-900">
              Exam Created for {gradeAndSection?.standardName || "Grade 1"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Edit exam" onClick={onEdit} className="p-2 rounded hover:bg-gray-50 text-gray-400">
              <Edit className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Toggle details" className="p-2 rounded hover:bg-gray-50 text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Subtle divider line */}
        <div className="mx-6">
          <div className="border-t border-gray-100"></div>
        </div>

        {/* Content area with details */}
        <div className="px-6 py-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Exam Title</div>
                <div className="font-medium text-gray-900">{data.title}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Subject</div>
                <div className="font-medium text-gray-900">{data.subject}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Description</div>
                <div className="font-medium text-gray-900">{data.description}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Exam type</div>
                <div className="font-medium text-gray-900">{data.examType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Due date</div>
                <div className="font-medium text-gray-900">{data.dueDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Time limit</div>
                <div className="font-medium text-gray-900">{data.timeLimit}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Bloom's Taxonomy</div>
                <div className="font-medium text-gray-900">{data.bloomTaxonomy}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Students</div>
                <div className="font-medium text-gray-900">{selectedStudents.length} selected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-6xl mt-4">
          {error}
        </div>
      )}

      {success && (
        <div
          className="mb-4 p-4 rounded-lg max-w-6xl mt-4"
          style={{
            backgroundColor: "var(--primary-50)",
            border: `1px solid var(--primary-200)`,
            color: "var(--primary-700)",
          }}
        >
          {success}
        </div>
      )}

      {/* Action buttons outside the card */}
      <div className="flex justify-end gap-4 mt-6 max-w-6xl">
        <Button variant="outline" onClick={onCancel} className="text-gray-700">
          Cancel
        </Button>
        <Button 
          variant="outline" 
          onClick={onEdit} 
          className="text-gray-700"
        >
          Edit
        </Button>
        <Button 
          onClick={onGenerate} 
          disabled={loading}
          className="button-primary disabled:opacity-50"
        >
          {loading ? 'Generating & Assigning...' : 'Generate & Assign Exam'}
        </Button>
      </div>
    </div>
  )
}
