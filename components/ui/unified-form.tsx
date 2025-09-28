"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ErrorMessage, SuccessMessage } from "./unified-selection"

// Question interface for forms
interface QuestionOption {
  id?: string
  optionText: string
  isCorrect: boolean
}

interface Question {
  id?: string
  questionText: string
  questionType?: 'MCQ' | 'LONG'
  marks?: number
  options?: QuestionOption[]
  correctAnswer?: string
}

// Form field configuration
interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  defaultValue?: string | number
}

// Form submission data - separate interface for submission
interface FormSubmissionData {
  [key: string]: string | number | Question[] | undefined
  questions?: Question[]
}

// Unified form props
interface UnifiedFormProps {
  title: string
  subtitle?: string
  fields: FormField[]
  includeQuestions?: boolean
  questionConfig?: {
    allowMCQ?: boolean
    allowLongAnswer?: boolean
    requireMarks?: boolean
  }
  onSubmit: (data: FormSubmissionData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
  cancelLabel?: string
}

// Question Editor Component
function QuestionEditor({
  question,
  index,
  onUpdate,
  onRemove,
  config
}: {
  question: Question
  index: number
  onUpdate: (index: number, question: Question) => void
  onRemove: (index: number) => void
  config?: {
    allowMCQ?: boolean
    allowLongAnswer?: boolean
    requireMarks?: boolean
  }
}) {
  const updateQuestion = (field: keyof Question, value: string | number | 'MCQ' | 'LONG' | QuestionOption[]) => {
    onUpdate(index, { ...question, [field]: value })
  }

  const updateOption = (optionIndex: number, field: keyof QuestionOption, value: string | boolean) => {
    if (!question.options) return
    const newOptions = question.options.map((opt, i) =>
      i === optionIndex ? { ...opt, [field]: value } : opt
    )
    updateQuestion('options', newOptions)
  }

  const addOption = () => {
    const newOptions = [...(question.options || []), { 
      id: `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      optionText: '', 
      isCorrect: false 
    }]
    updateQuestion('options', newOptions)
  }

  const removeOption = (optionIndex: number) => {
    if (!question.options || question.options.length <= 2) return
    const newOptions = question.options.filter((_, i) => i !== optionIndex)
    updateQuestion('options', newOptions)
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50 relative overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Question {index + 1}</h4>
        <Button
          type="button"
          onClick={() => onRemove(index)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          Remove
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor={`question-text-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
          <Textarea
            id={`question-text-${index}`}
            placeholder="Enter your question here..."
            value={question.questionText}
            onChange={(e) => updateQuestion('questionText', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(config?.allowMCQ || config?.allowLongAnswer) && (
            <div className="relative z-10">
              <label htmlFor={`question-type-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
              <Select
                value={question.questionType || 'MCQ'}
                onValueChange={(value: 'MCQ' | 'LONG') => {
                  const updatedQuestion = { ...question, questionType: value }
                  if (value === 'LONG') {
                    updatedQuestion.options = undefined
                    updatedQuestion.correctAnswer = updatedQuestion.correctAnswer || ''
                  } else {
                    updatedQuestion.correctAnswer = undefined
                    updatedQuestion.options = updatedQuestion.options || [
                      { optionText: '', isCorrect: false },
                      { optionText: '', isCorrect: false },
                      { optionText: '', isCorrect: false },
                      { optionText: '', isCorrect: false }
                    ]
                  }
                  onUpdate(index, updatedQuestion)
                }}
              >
                <SelectTrigger id={`question-type-${index}`} className="w-full bg-white border border-gray-300 h-10">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  {config?.allowMCQ && (
                    <SelectItem value="MCQ" className="cursor-pointer hover:bg-gray-100 px-3 py-2">
                      Multiple Choice
                    </SelectItem>
                  )}
                  {config?.allowLongAnswer && (
                    <SelectItem value="LONG" className="cursor-pointer hover:bg-gray-100 px-3 py-2">
                      Long Answer
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {config?.requireMarks && (
            <div>
              <label htmlFor={`question-marks-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
              <Input
                id={`question-marks-${index}`}
                type="number"
                placeholder="1"
                value={question.marks || 1}
                onChange={(e) => updateQuestion('marks', parseInt(e.target.value) || 1)}
              />
            </div>
          )}
        </div>

        {/* MCQ Options */}
        {question.questionType === 'MCQ' && question.options && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="block text-sm font-medium text-gray-700">Options</div>
              <Button
                type="button"
                onClick={addOption}
                variant="outline"
                size="sm"
              >
                + Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {question.options.map((option, optIndex) => (
                <div key={option.id || `option-${index}-${optIndex}`} className="flex items-center gap-3">
                  <Checkbox
                    checked={option.isCorrect}
                    onCheckedChange={(checked) =>
                      updateOption(optIndex, 'isCorrect', !!checked)
                    }
                  />
                  <Input
                    placeholder={`Option ${optIndex + 1}`}
                    value={option.optionText}
                    onChange={(e) =>
                      updateOption(optIndex, 'optionText', e.target.value)
                    }
                    className="flex-1"
                  />
                  {question.options && question.options.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeOption(optIndex)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Check the correct answer(s)</p>
          </div>
        )}

        {/* Long Answer */}
        {question.questionType === 'LONG' && (
          <div>
            <label htmlFor={`question-answer-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
            <Textarea
              id={`question-answer-${index}`}
              placeholder="Enter the correct answer or key points..."
              value={question.correctAnswer || ''}
              onChange={(e) => updateQuestion('correctAnswer', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Main Unified Form Component
export function UnifiedForm({
  title,
  subtitle,
  fields,
  includeQuestions = false,
  questionConfig = {
    allowMCQ: true,
    allowLongAnswer: true,
    requireMarks: true
  },
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel"
}: UnifiedFormProps) {
  const [formData, setFormData] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {}
    fields.forEach(field => {
      initial[field.name] = field.defaultValue || ''
    })
    return initial
  })
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleFieldChange = (fieldName: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      questionText: '',
      questionType: questionConfig.allowMCQ ? 'MCQ' : 'LONG',
      ...(questionConfig.requireMarks && { marks: 1 }),
      ...(questionConfig.allowMCQ && {
        options: [
          { id: `opt-${Date.now()}-1`, optionText: '', isCorrect: false },
          { id: `opt-${Date.now()}-2`, optionText: '', isCorrect: false },
          { id: `opt-${Date.now()}-3`, optionText: '', isCorrect: false },
          { id: `opt-${Date.now()}-4`, optionText: '', isCorrect: false }
        ]
      })
    }
    setQuestions(prev => [...prev, newQuestion])
  }

  const updateQuestion = (index: number, question: Question) => {
    setQuestions(prev => prev.map((q, i) => i === index ? question : q))
  }

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setError(`${field.label} is required`)
        return false
      }
    }

    // Validate questions if included
    if (includeQuestions) {
      if (questions.length === 0) {
        setError('Please add at least one question')
        return false
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        if (!q.questionText.trim()) {
          setError(`Question ${i + 1} text is required`)
          return false
        }

        if (q.questionType === 'MCQ' && q.options) {
          if (!q.options.some(opt => opt.isCorrect)) {
            setError(`Question ${i + 1} must have at least one correct answer`)
            return false
          }
          if (q.options.some(opt => !opt.optionText.trim())) {
            setError(`Question ${i + 1} has empty options`)
            return false
          }
        }

        if (q.questionType === 'LONG' && !q.correctAnswer?.trim()) {
          setError(`Question ${i + 1} must have a correct answer`)
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!validateForm()) return

    try {
      setLoading(true)
      const submitData = {
        ...formData,
        ...(includeQuestions && { questions })
      }
      await onSubmit(submitData)
      setSuccess('Form submitted successfully!')
    } catch (err) {
      setError('Failed to submit form')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      value: String(formData[field.name] || ''),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleFieldChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)
    }

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            {...commonProps}
          />
        )
      
      case 'select':
        return (
          <Select 
            value={String(formData[field.name])} 
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            <SelectTrigger className="w-full bg-white border border-gray-300 h-10">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            {...commonProps}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <Button 
              type="button" 
              onClick={onCancel} 
              variant="outline"
              className="mb-4"
            >
              ← Back
            </Button>
            <h1 className="text-2xl font-semibold mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>

          <div className="space-y-6">
            {/* Form Fields */}
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={`field-${field.name}`} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div id={`field-${field.name}`}>
                  {renderField(field)}
                </div>
              </div>
            ))}

            {/* Questions Section */}
            {includeQuestions && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                  <Button type="button" onClick={addQuestion} variant="outline">
                    + Add Question
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No questions added yet. Click "Add Question" to start.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <QuestionEditor
                        key={question.id || `question-${index}`}
                        question={question}
                        index={index}
                        onUpdate={updateQuestion}
                        onRemove={removeQuestion}
                        config={questionConfig}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center gap-4 pt-6">
              <Button onClick={onCancel} variant="outline">
                {cancelLabel}
              </Button>
              <Button
                onClick={handleSubmit}
                className="button-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : submitLabel}
              </Button>
            </div>

            {/* Success/Error Messages */}
            {success && <SuccessMessage message={success} />}
            {error && <ErrorMessage error={error} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnifiedForm
