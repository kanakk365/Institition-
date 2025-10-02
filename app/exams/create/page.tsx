"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SUBJECT_OPTIONS } from "@/lib/subjects"
import { ArrowLeft, Calendar } from "lucide-react"

interface Standard {
  id: number
  name: string
}

interface Section {
  id: number
  name: string
  classstandardid: number
  standard: Standard
}

export default function CreateExamPage() {
  const router = useRouter()
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [fromFlow, setFromFlow] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    examType: "",
    dueDate: "",
    timeLimit: "",
    grade: "",
    section: "",
    bloomTaxonomy: "remember"
  })

  useEffect(() => {
    // Check if we're coming from the grade/section/student selection flow
    const standard = sessionStorage.getItem('selectedStandard')
    const section = sessionStorage.getItem('selectedSection')
    const students = sessionStorage.getItem('selectedStudents')
    
    if (standard && section && students) {
      setFromFlow(true)
      setSelectedStandard(JSON.parse(standard))
      setSelectedSection(JSON.parse(section))
      setSelectedStudents(JSON.parse(students))
      
      // Pre-fill form data with selected grade and section
      const standardData = JSON.parse(standard)
      const sectionData = JSON.parse(section)
      setFormData(prev => ({
        ...prev,
        grade: standardData.name,
        section: sectionData.name
      }))
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle exam creation logic here
    const examData = {
      ...formData,
      selectedStudents: fromFlow ? selectedStudents : [],
      sectionId: fromFlow ? selectedSection?.id : null,
      standardId: fromFlow ? selectedStandard?.id : null
    }
    console.log("Creating exam:", examData)
    
    // Clear sessionStorage after successful creation
    if (fromFlow) {
      sessionStorage.removeItem('selectedStandard')
      sessionStorage.removeItem('selectedSection')
      sessionStorage.removeItem('selectedStudents')
    }
    
    // Navigate back to exams list
    router.push("/exams")
  }

  const handleCancel = () => {
    // Clear sessionStorage if canceling from flow
    if (fromFlow) {
      sessionStorage.removeItem('selectedStandard')
      sessionStorage.removeItem('selectedSection')
      sessionStorage.removeItem('selectedStudents')
    }
    router.back()
  }

  const startFlow = () => {
    router.push('/exams/create/grade')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exams
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Exam</h1>
          <p className="text-gray-600 mt-2">Create and configure a new exam for your students</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Exam Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter exam title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="h-14 px-5 rounded-lg text-[color:var(--primary-800)] placeholder:text-[color:var(--primary-500)] bg-[var(--primary-50)] border border-[color:var(--primary-100)]"
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject
                  </Label>
                  <Select
                    value={formData.subject || undefined}
                    onValueChange={(value) => handleInputChange("subject", value)}
                  >
                    <SelectTrigger className="h-14 px-5 rounded-lg w-full justify-between bg-[var(--primary-50)] border border-[color:var(--primary-100)] text-[color:var(--primary-700)] focus:ring-[color:var(--primary-300)]">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-4">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description / Notes
                  </Label>
                  <Input
                    id="description"
                    placeholder="Enter exam description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="h-24 px-5 rounded-lg text-[color:var(--primary-800)] placeholder:text-[color:var(--primary-500)] bg-[var(--primary-50)] border border-[color:var(--primary-100)]"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="examType" className="text-sm font-medium text-gray-700">
                    Exam Type
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("examType", value)}>
                    <SelectTrigger className="h-14 px-5 rounded-lg w-full justify-between bg-[var(--primary-50)] border border-[color:var(--primary-100)] text-[color:var(--primary-700)] focus:ring-[color:var(--primary-300)]">
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit-test">Unit Test</SelectItem>
                      <SelectItem value="mid-term">Mid-term Exam</SelectItem>
                      <SelectItem value="final-exam">Final Exam</SelectItem>
                      <SelectItem value="class-test">Class Test</SelectItem>
                      <SelectItem value="practice">Practice Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="bloomTaxonomy" className="text-sm font-medium text-gray-700">
                    Bloom's Taxonomy
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("bloomTaxonomy", value)}>
                    <SelectTrigger className="h-14 px-5 rounded-lg w-full justify-between bg-[var(--primary-50)] border border-[color:var(--primary-100)] text-[color:var(--primary-700)] focus:ring-[color:var(--primary-300)]">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
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

            {/* Scheduling */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Scheduling & Timing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                    Due Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      className="h-14 px-5 pr-12 rounded-lg text-[color:var(--primary-800)] bg-[var(--primary-50)] border border-[color:var(--primary-100)]"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="timeLimit" className="text-sm font-medium text-gray-700">
                    Time Limit
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("timeLimit", value)}>
                    <SelectTrigger className="h-14 px-5 rounded-lg w-full justify-between bg-[var(--primary-50)] border border-[color:var(--primary-100)] text-[color:var(--primary-700)] focus:ring-[color:var(--primary-300)]">
                      <SelectValue placeholder="Select time limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Target Students */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Target Students</h2>
              
              {fromFlow ? (
                // Show selected information from flow
                <div className="space-y-4">
                  <div className="p-6 rounded-lg border bg-[var(--primary-50)] border-[color:var(--primary-200)]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Selected Students</h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startFlow}
                        className="text-[color:var(--primary-600)] border-[color:var(--primary-300)] hover:bg-[var(--primary-50)]"
                      >
                        Change Selection
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Grade:</span>
                        <span className="ml-2 text-gray-900">{selectedStandard?.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Section:</span>
                        <span className="ml-2 text-gray-900">{selectedSection?.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Students:</span>
                        <span className="ml-2 text-gray-900">{selectedStudents.length} selected</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Show manual selection or flow starter
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Recommended: Use Student Selection Flow</h3>
                        <p className="text-gray-600 text-sm">
                          Select grade, section, and specific students through our guided flow for better targeting.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={startFlow}
                        className="bg-[color:var(--primary-500)] hover:bg-[color:var(--primary-600)] text-[color:var(--primary-foreground)]"
                      >
                        Select Students
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500 text-sm font-medium">OR</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label htmlFor="grade" className="text-sm font-medium text-gray-700">
                        Grade/Class (Manual)
                      </Label>
                      <Select 
                        onValueChange={(value) => handleInputChange("grade", value)}
                        value={formData.grade}
                      >
                        <SelectTrigger className="h-14 px-5 rounded-lg w-full justify-between bg-[var(--primary-50)] border border-[color:var(--primary-100)] text-[color:var(--primary-700)] focus:ring-[color:var(--primary-300)]">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Grade 1</SelectItem>
                          <SelectItem value="2">Grade 2</SelectItem>
                          <SelectItem value="3">Grade 3</SelectItem>
                          <SelectItem value="4">Grade 4</SelectItem>
                          <SelectItem value="5">Grade 5</SelectItem>
                          <SelectItem value="6">Grade 6</SelectItem>
                          <SelectItem value="7">Grade 7</SelectItem>
                          <SelectItem value="8">Grade 8</SelectItem>
                          <SelectItem value="9">Grade 9</SelectItem>
                          <SelectItem value="10">Grade 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4">
                      <Label htmlFor="section" className="text-sm font-medium text-gray-700">
                        Section (Manual)
                      </Label>
                      <Select 
                        onValueChange={(value) => handleInputChange("section", value)}
                        value={formData.section}
                      >
                        <SelectTrigger className="h-14 px-5 rounded-lg w-full justify-between bg-[var(--primary-50)] border border-[color:var(--primary-100)] text-[color:var(--primary-700)] focus:ring-[color:var(--primary-300)]">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Section A</SelectItem>
                          <SelectItem value="B">Section B</SelectItem>
                          <SelectItem value="C">Section C</SelectItem>
                          <SelectItem value="D">Section D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-8 py-3 bg-[color:var(--primary-500)] hover:bg-[color:var(--primary-600)] text-[color:var(--primary-foreground)]"
              >
                Create Exam
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
