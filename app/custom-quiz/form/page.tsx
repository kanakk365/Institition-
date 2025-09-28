"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface QuizData {
  quizDetails: {
    title: string
    subject: string
    topic: string
    timeLimitMinutes: number
    instructions: string
    difficulty: string
  }
  classSection: {
    standardId: string
    sectionId: string
  }
  questions: Question[]
}

interface Question {
  questionText: string
  marks: number
  options: { optionText: string; isCorrect: boolean }[]
}

export default function CustomQuizFormPage() {
  const router = useRouter()
  const [data, setData] = useState<QuizData>({
    quizDetails: { title: '', subject: '', topic: '', timeLimitMinutes: 30, instructions: '', difficulty: 'MEDIUM' },
    classSection: { standardId: '', sectionId: '' },
    questions: [],
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('customQuizGradeAndSection')
    const std = sessionStorage.getItem('customQuizSelectedStandard')
    if (stored && std) {
      const parsed = JSON.parse(stored)
      const standard = JSON.parse(std)
      setData(prev => ({
        ...prev, 
        classSection: { standardId: standard.id, sectionId: parsed.section.id }
      }))
    }
  }, [])

  const handleInputChange = (field: keyof QuizData['quizDetails'], value: string | number) => {
    setData(prev => ({
      ...prev,
      quizDetails: { ...prev.quizDetails, [field]: value }
    }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      marks: 1,
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

  const updateQuestion = (index: number, field: keyof Question, value: string | number | Question['options']) => {
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
      if (!q.options.some(opt => opt.isCorrect)) {
        setError(`Question ${i + 1} must have at least one correct answer`)
        return
      }
      if (q.options.some(opt => !opt.optionText.trim())) {
        setError(`Question ${i + 1} has empty options`)
        return
      }
    }

    // Store quiz data for confirmation page to handle API calls
    sessionStorage.setItem('quizFormData', JSON.stringify(data))
    
    // Navigate directly to confirmation page without API call
    router.push('/custom-quiz/confirmation')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <button type="button" onClick={() => router.back()} className="text-gray-600 mb-4">← Back</button>
            <h1 className="text-2xl font-semibold mb-2">Create Custom Quiz</h1>
            <p className="text-gray-600">Fill in the quiz details below</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
              <Input 
                placeholder="e.g., Mathematics Quiz - Algebra" 
                value={data.quizDetails.title} 
                onChange={(e) => handleInputChange('title', e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <Input 
                placeholder="e.g., Mathematics" 
                value={data.quizDetails.subject} 
                onChange={(e) => handleInputChange('subject', e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <Input 
                placeholder="e.g., Algebra" 
                value={data.quizDetails.topic} 
                onChange={(e) => handleInputChange('topic', e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <Input 
                type="number"
                placeholder="30" 
                value={data.quizDetails.timeLimitMinutes} 
                onChange={(e) => handleInputChange('timeLimitMinutes', parseInt(e.target.value) || 0)} 
              />
            </div>

            <div className="relative z-10">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <Select value={data.quizDetails.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger className="w-full bg-white border border-gray-300 h-10">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  <SelectItem value="EASY" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Easy</SelectItem>
                  <SelectItem value="MEDIUM" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Medium</SelectItem>
                  <SelectItem value="HARD" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <Textarea 
                placeholder="Please read all questions carefully..." 
                value={data.quizDetails.instructions} 
                onChange={(e) => handleInputChange('instructions', e.target.value)} 
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={question.marks}
                            onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={`option-${index}-${optIndex}`} className="flex items-center gap-3">
                                <Checkbox
                                  checked={option.isCorrect}
                                  onCheckedChange={(checked) => 
                                    updateOption(index, optIndex, 'isCorrect', !!checked)
                                  }
                                />
                                <Input
                                  placeholder={`Option ${optIndex + 1}`}
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
                className="bg-green-500 hover:bg-green-600 text-white" 
                disabled={loading || !data.quizDetails.title}
              >
                {loading ? 'Creating...' : 'Create Custom Quiz'}
              </Button>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
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
