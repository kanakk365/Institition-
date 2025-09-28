"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, ExternalLink, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import api from '@/lib/api'

interface AssignedStudent {
  id: string
  name: string
  email: string
  isCompleted: boolean
}

interface ProjectDetails {
  id: string
  title: string
  class: string
  subject: string
  description: string
  pdfUrl: string
  standardName: string
  sectionName: string
  assignedStudents: AssignedStudent[]
  createdAt: string
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

interface ProjectDetailsResponse {
  projects: ProjectDetails[]
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const standardId = params.id as string
  
  const [projects, setProjects] = useState<ProjectDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true)
        const response = await api.get<ApiResponse<ProjectDetailsResponse>>(
          `/teacher/projects/class/${standardId}`
        )
        
        if (response.data.success) {
          setProjects(response.data.data.projects)
          // Expand first project by default
          if (response.data.data.projects.length > 0) {
            setExpandedProjects({ [response.data.data.projects[0].id]: true })
          }
        } else {
          setError('No projects found for this class')
        }
      } catch (err) {
        console.error('Error fetching project details:', err)
        setError('Failed to fetch project details')
      } finally {
        setLoading(false)
      }
    }

    if (standardId) {
      fetchProjectDetails()
    }
  }, [standardId])

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const handleDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[color:var(--primary-500)]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || projects.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error || 'No projects found for this class'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Class Projects</h1>
          <Badge className="bg-[var(--primary-50)] text-[color:var(--primary-800)]">
            {projects[0]?.standardName} - Section {projects[0]?.sectionName}
          </Badge>
        </div>

        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button 
              type="button"
              className="w-full px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 text-left"
              onClick={() => toggleProject(project.id)}
            >
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-medium text-gray-900">{project.title}</h2>
                <Badge className="bg-[var(--primary-50)] text-[color:var(--primary-800)]">Active</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(project.pdfUrl, project.title)
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  {expandedProjects[project.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </button>

            {expandedProjects[project.id] && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Project title</h3>
                      <p className="text-gray-900">{project.title}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Subject</h3>
                      <p className="text-gray-900 capitalize">{project.subject}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Class</h3>
                      <p className="text-gray-900">{project.class}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Created Date</h3>
                      <p className="text-gray-900">{formatDate(project.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Grade / Section</h3>
                      <p className="text-gray-900">{project.standardName} - {project.sectionName}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Project File</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{project.title}.pdf</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(project.pdfUrl, project.title)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-900">{project.description}</p>
                </div>

                {/* Assigned Students Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Assigned Students ({project.assignedStudents.length})
                  </h3>
                  
                  {project.assignedStudents.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm font-medium bg-[color:var(--primary-500)] text-[color:var(--primary-foreground)]">
                        <div>Student Name</div>
                        <div>Email</div>
                        <div>Status</div>
                        <div>Completion</div>
                      </div>
                      {project.assignedStudents.map((student) => (
                        <div key={student.id} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-gray-200 text-sm bg-white">
                          <div className="text-gray-900">{student.name}</div>
                          <div className="text-gray-600">{student.email}</div>
                          <div>
                            <Badge className="bg-[var(--primary-50)] text-[color:var(--primary-800)]">
                              Assigned
                            </Badge>
                          </div>
                          <div>
                            <Badge 
                              className={
                                student.isCompleted 
                                  ? "bg-[var(--primary-50)] text-[color:var(--primary-800)]"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {student.isCompleted ? "Completed" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No students assigned to this project</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
