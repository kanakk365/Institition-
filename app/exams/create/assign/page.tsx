"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExamView } from "@/components/exam-view"
import api from "@/lib/api"
import { SUBJECT_OPTIONS } from "@/lib/subjects"
import { useRouter } from "next/navigation"

interface ExamFormData {
  subject: string
  topic: string
  examType: string
  level: string
  questionType: string
  bloomTaxonomy: string
  questionConfig: {
    questionType: string
    config: {
      long?: {
        count: number
        marksPerQuestion: number
      }
      short?: {
        count: number
        marksPerQuestion: number
      }
    }
  }
}

interface Student {
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

type CurrentStep = "form" | "confirmation"

export default function CreateExamAssignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<CurrentStep>("form")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [examFormData, setExamFormData] = useState<ExamFormData | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const [gradeAndSection, setGradeAndSection] = useState<GradeAndSection | null>(null)
  const [generatedExamId, setGeneratedExamId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ExamFormData>({
    subject: '',
    topic: '',
    examType: 'Questions & Answers',
    level: 'medium',
    questionType: 'both',
    bloomTaxonomy: 'remember',
    questionConfig: {
      questionType: 'both',
      config: {
        long: {
          count: 3,
          marksPerQuestion: 5
        },
        short: {
          count: 4,
          marksPerQuestion: 2
        }
      }
    }
  })

  useEffect(() => {
    // Get data from sessionStorage
    const students = sessionStorage.getItem('examSelectedStudents')
    const gradeSection = sessionStorage.getItem('examGradeAndSection')
    
    if (students) {
      setSelectedStudents(JSON.parse(students))
    }
    
    if (gradeSection) {
      setGradeAndSection(JSON.parse(gradeSection))
    }
  }, [])

  const handleInputChange = (field: keyof ExamFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleQuestionTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      questionType: value,
      questionConfig: {
        questionType: value,
        config: value === 'long' 
          ? { long: { count: 5, marksPerQuestion: 5 } }
          : value === 'short'
          ? { short: { count: 10, marksPerQuestion: 2 } }
          : {
              long: { count: 3, marksPerQuestion: 5 },
              short: { count: 4, marksPerQuestion: 2 }
            }
      }
    }))
  }

  const handleConfigChange = (type: 'long' | 'short', field: 'count' | 'marksPerQuestion', value: number) => {
    setFormData(prev => ({
      ...prev,
      questionConfig: {
        ...prev.questionConfig,
        config: {
          ...prev.questionConfig.config,
          [type]: {
            ...prev.questionConfig.config[type],
            [field]: value
          }
        }
      }
    }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject.trim() || !formData.topic.trim()) {
      setError('Subject and Topic are required')
      return
    }

    setExamFormData(formData)
    setCurrentStep("confirmation")
  }

  const handleBackToForm = () => {
    setCurrentStep("form")
  }

  const handleGenerateAndAssign = async () => {
    if (!examFormData) return
    
    setLoading(true)
    setError('')
    
    try {
      // Step 1: Generate the exam
      // Map form examType to API-accepted values
      const getApiExamType = (formExamType: string) => {
        switch (formExamType) {
          case 'Multiple Choice':
          case 'Mixed Format':
            return 'Quiz'
          case 'Questions & Answers':
          default:
            return 'Questions & Answers'
        }
      }
      
      const apiPayload = {
        subject: examFormData.subject,
        topic: examFormData.topic,
        examType: getApiExamType(examFormData.examType),
        level: examFormData.level,
        questionType: examFormData.questionType,
        questionConfig: examFormData.questionConfig,
        bloomTaxanomy: examFormData.bloomTaxonomy
      }
      
      console.log('Generating exam with data:', apiPayload)
      const examResponse = await api.post('/teacher/exam', apiPayload)
      
      if (!examResponse.data.success) {
        throw new Error(examResponse.data.message || 'Failed to generate exam')
      }

      const examId = examResponse.data.data.exam.id
      setGeneratedExamId(examId)
      console.log('Exam generated successfully, ID:', examId)

      // Step 2: Assign exam to selected students
      if (selectedStudents.length > 0) {
        const studentIds = selectedStudents.map(student => student._id)
        const assignPayload = {
          examId: examId,
          studentIds: studentIds
        }

        console.log('Assigning exam to students:', assignPayload)
        const assignResponse = await api.post('/teacher/student/assign-exam', assignPayload)
        
        if (!assignResponse.data.success) {
          throw new Error(assignResponse.data.message || 'Failed to assign exam to students')
        }

        console.log('Exam assigned successfully to students')
      }

      // Clear sessionStorage
      sessionStorage.removeItem('examSelectedStudents')
      sessionStorage.removeItem('examGradeAndSection')
      
      // Navigate back to exams list
      setTimeout(() => {
        router.push('/exams')
      }, 2000)
      
    } catch (err: unknown) {
      console.error('Error in exam generation/assignment:', err)
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || err.message
        : err instanceof Error ? err.message : 'Failed to generate and assign exam'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('examSelectedStudents')
    sessionStorage.removeItem('examGradeAndSection')
    router.push('/exams')
  }

  if (currentStep === "confirmation") {
    return (
      <ExamView
        examData={{
          title: examFormData?.topic || '',
          subject: examFormData?.subject || '',
          description: `${examFormData?.questionType} questions at ${examFormData?.level} level (${examFormData?.bloomTaxonomy} level)`,
          examType: examFormData?.examType || '',
          dueDate: new Date().toLocaleDateString(),
          timeLimit: '60 min',
          topic: examFormData?.topic || '',
          difficulty: examFormData?.level || '',
          bloomTaxonomy: examFormData?.bloomTaxonomy || 'remember',
          questionCount: ((examFormData?.questionConfig.config.long?.count || 0) + (examFormData?.questionConfig.config.short?.count || 0)).toString()
        }}
        gradeAndSection={gradeAndSection}
        selectedStudents={selectedStudents}
        onCancel={handleCancel}
        onEdit={handleBackToForm}
        onGenerate={handleGenerateAndAssign}
        loading={loading}
        error={error}
        success={generatedExamId ? 'Exam generated and assigned successfully!' : ''}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="text-gray-600 hover:text-gray-800 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate New Exam</h1>
          <p className="text-gray-600">Create AI-generated exams with customizable question types and difficulty</p>
          
          {gradeAndSection && (
            <div className="mt-4 p-4 bg-[var(--primary-50)] rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium text-[color:var(--primary-800)]">Selected:</span>
                <span className="text-[color:var(--primary-700)]">{gradeAndSection.standardName} - {gradeAndSection.sectionName}</span>
                <span className="text-[color:var(--primary-700)]">•</span>
                <span className="text-[color:var(--primary-700)]">{selectedStudents.length} students selected</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Subject *
                </Label>
                <Select
                  value={formData.subject || undefined}
                  onValueChange={(value) => handleInputChange('subject', value)}
                >
                  <SelectTrigger id="subject" className="bg-[var(--primary-50)] border border-[color:var(--primary-100)] h-14 px-5 rounded-lg text-gray-700 w-full justify-between">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] bg-white shadow-lg border border-gray-200">
                    {SUBJECT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                  Topic *
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Wave Motion and Sound, Algebra, Organic Chemistry"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="  bg-[var(--primary-50)] border border-[color:var(--primary-100)]  px-5 rounded-lg text-gray-700 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <Label htmlFor="examType" className="text-sm font-medium text-gray-700">
                  Exam Type
                </Label>
                <div className="relative">
                  <Select value={formData.examType} onValueChange={(value) => handleInputChange('examType', value)}>
                    <SelectTrigger className="bg-[var(--primary-50)] border border-[color:var(--primary-100)] h-14 px-5 rounded-lg text-gray-700 w-full justify-between">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-white shadow-lg border border-gray-200">
                      <SelectItem value="Quiz">Quiz</SelectItem>
                      <SelectItem value="Questions & Answers">Questions & Answers</SelectItem>
                      <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                      <SelectItem value="Mixed Format">Mixed Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="level" className="text-sm font-medium text-gray-700">
                  Difficulty Level
                </Label>
                <div className="relative">
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger className="bg-[var(--primary-50)] border border-[color:var(--primary-100)] h-14 px-5 rounded-lg text-gray-700 w-full justify-between">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-white shadow-lg border border-gray-200">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="bloomTaxonomy" className="text-sm font-medium text-gray-700">
                  Bloom's Taxonomy
                </Label>
                <div className="relative">
                  <Select value={formData.bloomTaxonomy} onValueChange={(value) => handleInputChange('bloomTaxonomy', value)}>
                    <SelectTrigger className="bg-[var(--primary-50)] border border-[color:var(--primary-100)] h-14 px-5 rounded-lg text-gray-700 w-full justify-between">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-white shadow-lg border border-gray-200">
                      <SelectItem value="remember">Remember</SelectItem>
                      <SelectItem value="understand">Understand</SelectItem>
                      <SelectItem value="apply">Apply</SelectItem>
                      <SelectItem value="analyze">Analyze</SelectItem>
                      <SelectItem value="evaluate">Evaluate</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="questionType" className="text-sm font-medium text-gray-700">
                  Question Type Configuration
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'long', label: 'Long Answer Only', description: 'Detailed essay-type questions' },
                    { value: 'short', label: 'Short Answer Only', description: 'Brief response questions' },
                    { value: 'both', label: 'Both Long & Short', description: 'Mixed question types' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleQuestionTypeChange(option.value)}
                      className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                        formData.questionType === option.value
                          ? 'border-[color:var(--primary-500)] bg-[var(--primary-50)] shadow-md'
                          : 'border-gray-200 bg-white hover:border-[color:var(--primary-300)] hover:bg-[var(--primary-50)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.questionType === option.value
                            ? 'border-[color:var(--primary-500)] bg-[color:var(--primary-500)]'
                            : 'border-gray-300'
                        }`}>
                          {formData.questionType === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-800">{option.label}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Configuration */}
              <div className="bg-[var(--primary-50)] border border-[color:var(--primary-100)] rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Question Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(formData.questionType === 'long' || formData.questionType === 'both') && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">Long Answer Questions</h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-600">Number of Questions</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.questionConfig.config.long?.count || 0}
                            onChange={(e) => handleConfigChange('long', 'count', parseInt(e.target.value) || 0)}
                            className="bg-white border-gray-200 h-12 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Marks per Question</Label>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            value={formData.questionConfig.config.long?.marksPerQuestion || 0}
                            onChange={(e) => handleConfigChange('long', 'marksPerQuestion', parseInt(e.target.value) || 0)}
                            className="bg-white border-gray-200 h-12 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(formData.questionType === 'short' || formData.questionType === 'both') && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">Short Answer Questions</h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-600">Number of Questions</Label>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            value={formData.questionConfig.config.short?.count || 0}
                            onChange={(e) => handleConfigChange('short', 'count', parseInt(e.target.value) || 0)}
                            className="bg-white border-gray-200 h-12 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Marks per Question</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.questionConfig.config.short?.marksPerQuestion || 0}
                            onChange={(e) => handleConfigChange('short', 'marksPerQuestion', parseInt(e.target.value) || 0)}
                            className="bg-white border-gray-200 h-12 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-[var(--primary-50)] rounded-lg">
                  <h4 className="font-medium text-[color:var(--primary-800)] mb-2">Exam Summary</h4>
                  <div className="text-sm text-[color:var(--primary-700)]">
                    <p>
                      Total Questions: {' '}
                      {(formData.questionConfig.config.long?.count || 0) + (formData.questionConfig.config.short?.count || 0)}
                    </p>
                    <p>
                      Total Marks: {' '}
                      {((formData.questionConfig.config.long?.count || 0) * (formData.questionConfig.config.long?.marksPerQuestion || 0)) + 
                       ((formData.questionConfig.config.short?.count || 0) * (formData.questionConfig.config.short?.marksPerQuestion || 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-6 pt-12">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleCancel}
                className="border-red-500 text-red-500 hover:bg-red-50 bg-white px-10 py-3 h-12 rounded-lg font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[color:var(--primary-500)] hover:bg-[color:var(--primary-600)] text-[color:var(--primary-foreground)] px-10 py-3 h-12 rounded-lg font-medium"
              >
                Continue to Confirmation
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
