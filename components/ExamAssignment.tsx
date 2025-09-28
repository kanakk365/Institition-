"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import { useState } from "react"

interface ExamAssignmentProps {
  onCancel: () => void
  onAssign: (formData: QuizFormData) => void
}

interface QuizFormData {
  examTitle: string
  subject: string
  description: string
  examType: string
  dueDate: string
  timeLimit: string
}

export function ExamAssignment({ onCancel, onAssign }: ExamAssignmentProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    examTitle: '',
    subject: '',
    description: '',
    examType: '',
    dueDate: '',
    timeLimit: ''
  })

  const handleInputChange = (field: keyof QuizFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    onAssign(formData)
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button type="button" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          ← Back
        </button>
        
        <h1 className="text-xl font-semibold mb-8 text-gray-900">Assign Exam to Student</h1>

        <div className="space-y-8">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label htmlFor="exam-title" className="block text-sm font-medium text-gray-700">Exam Title</label>
              <Input 
                id="exam-title"
                placeholder="Enter Title" 
                value={formData.examTitle}
                onChange={(e) => handleInputChange('examTitle', e.target.value)}
                className="h-12 w-full border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50 text-gray-700"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              <Input 
                id="subject"
                placeholder="Math, Science, EVS, English" 
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="h-12 w-full border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50 text-gray-700"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Notes</label>
              <Input 
                id="description"
                placeholder="Enter Description" 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="h-12 w-full border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50 text-gray-700"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="exam-type" className="block text-sm font-medium text-gray-700">Exam Type</label>
              <Input 
                id="exam-type"
                placeholder="Class Test, Unit Test, Term Exam, Practice" 
                value={formData.examType}
                onChange={(e) => handleInputChange('examType', e.target.value)}
                className="h-12 w-full border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50 text-gray-700"
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">Due Date</label>
              <div className="relative">
                <Input 
                  id="due-date"
                  placeholder="e.g., 27 June 2025" 
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="h-12 w-full border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50 text-gray-700 pr-12"
                />
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="space-y-3">
              <label htmlFor="time-limit" className="block text-sm font-medium text-gray-700">Time Limit</label>
              <Input 
                id="time-limit"
                placeholder="5, 10, 15 minutes" 
                value={formData.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', e.target.value)}
                className="h-12 w-full border-green-200 focus:border-green-500 focus:ring-green-500 bg-green-50 text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - positioned in bottom right */}
        <div className="flex justify-end gap-4 mt-12">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="px-8 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white"
          >
            Create Exam
          </Button>
        </div>
      </div>
    </div>
  )
}
