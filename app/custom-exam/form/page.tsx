"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SUBJECT_OPTIONS } from "@/lib/subjects"

interface ExamData {
  examDetails: {
    title: string
    subject: string
    topic: string
    timeLimitMinutes: number
    instructions: string
  }
  description: string
  classSection: {
    standardId: string
    sectionId: string
  }
  questions: Question[]
}

interface Question {
  questionText: string
  questionType: 'MCQ' | 'LONG' | 'SHORT'
  marks: number
  bloomTaxonomy: string
  options?: { optionText: string; isCorrect: boolean }[]
  correctAnswer?: string
}

export default function CustomExamFormPage() {
  const router = useRouter()
  const [data, setData] = useState<ExamData>({
    examDetails: { title: '', subject: '', topic: '', timeLimitMinutes: 60, instructions: '' },
    description: '',
    classSection: { standardId: '', sectionId: '' },
    questions: [],
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('customExamGradeAndSection')
    const std = sessionStorage.getItem('customExamSelectedStandard')
    if (stored && std) {
      const parsed = JSON.parse(stored)
      const standard = JSON.parse(std)
      setData(prev => ({
        ...prev, 
        classSection: { standardId: standard.id, sectionId: parsed.section.id }
      }))
    }
  }, [])

  const handleInputChange = (field: keyof ExamData['examDetails'], value: string | number) => {
    setData(prev => ({
      ...prev,
      examDetails: { ...prev.examDetails, [field]: value }
    }))
  }

  const handleDescriptionChange = (value: string) => {
    setData(prev => ({
      ...prev,
      description: value
    }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      questionType: 'MCQ',
      marks: 1,
      bloomTaxonomy: 'remember',
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    }
    setData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const removeQuestion = (index: number) => {
    setData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const updateQuestion = (index: number, field: keyof Question, value: string | number | Question['options'] | Question['questionType']) => {
    setData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const updateOption = (questionIndex: number, optionIndex: number, field: 'optionText' | 'isCorrect', value: string | boolean) => {
    setData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          options: q.options?.map((opt, j) => 
            j === optionIndex ? { ...opt, [field]: value } : opt
          )
        } : q
      )
    }))
  }

  const handleSubmit = async () => {
    if (data.questions.length === 0) {
      setError('Please add at least one question')
      return
    }

    // Validate questions
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i]
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text is required`)
        return
      }
      if (q.questionType === 'MCQ' && q.options) {
        if (!q.options.some(opt => opt.isCorrect)) {
          setError(`Question ${i + 1} must have at least one correct answer`)
          return
        }
        if (q.options.some(opt => !opt.optionText.trim())) {
          setError(`Question ${i + 1} has empty options`)
          return
        }
      }
      if ((q.questionType === 'LONG' || q.questionType === 'SHORT') && !q.correctAnswer?.trim()) {
        setError(`Question ${i + 1} must have a correct answer`)
        return
      }
    }

    // Store exam data for confirmation page to handle API calls
    sessionStorage.setItem('examFormData', JSON.stringify(data))
    
    // Navigate directly to confirmation page without API call
    router.push('/custom-exam/confirmation')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <button type="button" onClick={() => router.push("/custom-exam/students")} className="text-gray-600 mb-4">← Back</button>
            <h1 className="text-2xl font-semibold mb-2">Create Custom Exam</h1>
            <p className="text-gray-600">Fill in the exam details below</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
              <Input
                placeholder="Enter title"
                value={data.examDetails.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <Select
                value={data.examDetails.subject || undefined}
                onValueChange={(value) => handleInputChange('subject', value)}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300 h-10">
                  <SelectValue placeholder="Enter subject" />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  {SUBJECT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-100 px-3 py-2">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <Input
                placeholder="Enter topic"
                value={data.examDetails.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <Input
                type="number"
                placeholder="Enter time limit"
                value={data.examDetails.timeLimitMinutes}
                onChange={(e) => handleInputChange('timeLimitMinutes', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <Textarea
                placeholder="Enter instructions"
                value={data.examDetails.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                placeholder="Enter description"
                value={data.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                rows={3}
              />
            </div>

            {/* Questions Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                <Button type="button" onClick={addQuestion} variant="outline">
                  + Add Question
                </Button>
              </div>

              {data.questions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No questions added yet. Click "Add Question" to start.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {data.questions.map((question, index) => (
                    <div key={`question-${index}`} className="border rounded-lg p-4 bg-gray-50 relative overflow-visible">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Button 
                          type="button" 
                          onClick={() => removeQuestion(index)} 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                          <Textarea
                            placeholder="Enter your question here..."
                            value={question.questionText}
                            onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="relative z-10">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                            <Select
                              value={question.questionType}
                              onValueChange={(value: 'MCQ' | 'LONG' | 'SHORT') => {
                                const updatedQuestion = { ...question, questionType: value }
                                if (value === 'LONG' || value === 'SHORT') {
                                  updatedQuestion.options = undefined
                                  updatedQuestion.correctAnswer = ''
                                } else {
                                  updatedQuestion.correctAnswer = undefined
                                  updatedQuestion.options = [
                                    { optionText: '', isCorrect: false },
                                    { optionText: '', isCorrect: false },
                                    { optionText: '', isCorrect: false },
                                    { optionText: '', isCorrect: false }
                                  ]
                                }
                                setData(prev => ({
                                  ...prev,
                                  questions: prev.questions.map((q, i) => i === index ? updatedQuestion : q)
                                }))
                              }}
                            >
                              <SelectTrigger className="w-full bg-white border border-gray-300 h-10">
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                              <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                                <SelectItem value="MCQ" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Multiple Choice</SelectItem>
                                <SelectItem value="SHORT" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Short Answer</SelectItem>
                                <SelectItem value="LONG" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Long Answer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="relative z-10">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bloom's Taxonomy</label>
                            <Select
                              value={question.bloomTaxonomy || 'remember'}
                              onValueChange={(value) => updateQuestion(index, 'bloomTaxonomy', value)}
                            >
                              <SelectTrigger className="w-full bg-white border border-gray-300 h-10">
                                <SelectValue placeholder="Select Bloom's Taxonomy level" />
                              </SelectTrigger>
                              <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                                <SelectItem value="remember">Remember</SelectItem>
                                <SelectItem value="understand">Understand</SelectItem>
                                <SelectItem value="apply">Apply</SelectItem>
                                <SelectItem value="analyze">Analyze</SelectItem>
                                <SelectItem value="evaluate">Evaluate</SelectItem>
                                <SelectItem value="create">Create</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                            <Input
                              type="number"
                              placeholder="Enter marks"
                              value={question.marks}
                              onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </div>

                        {question.questionType === 'MCQ' && question.options && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-3">
                                  <Checkbox
                                    checked={option.isCorrect}
                                    onCheckedChange={(checked) => 
                                      updateOption(index, optIndex, 'isCorrect', !!checked)
                                    }
                                  />
                                  <Input
                                    placeholder={`Enter option ${optIndex + 1}`}
                                    value={option.optionText}
                                    onChange={(e) =>
                                      updateOption(index, optIndex, 'optionText', e.target.value)
                                    }
                                    className="flex-1"
                                  />
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Check the correct answer(s)</p>
                          </div>
                        )}

                        {(question.questionType === 'LONG' || question.questionType === 'SHORT') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                            <Textarea
                              placeholder={question.questionType === 'SHORT' ? "Enter the short correct answer..." : "Enter the correct answer or key points..."}
                              value={question.correctAnswer || ''}
                              onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-6">
              <Button onClick={() => router.back()} variant="outline">Cancel</Button>
              <Button
                onClick={handleSubmit}
                className="button-primary"
                disabled={loading || !data.examDetails.title}
              >
                {loading ? 'Creating...' : 'Create Custom Exam'}
              </Button>
            </div>

            {success && (
              <div className="bg-[var(--primary-50)] border border-[var(--primary-200)] text-[var(--primary-800)] px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
