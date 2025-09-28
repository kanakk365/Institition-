"use client"

import { useState, useEffect } from "react"
import { ProjectsTable } from "@/components/projects-table"
import api from '@/lib/api'

interface Project {
  id: string
  title: string
  class: string
  persona: string
  pdfUrl: string
  subject: string
  description: string
  institutionId: string
  teacherId: string
  userId: string | null
  standardId: string
  sectionId: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

interface ProjectsResponse {
  projects: Project[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await api.get<ApiResponse<ProjectsResponse>>('/teacher/projects/all')
        
        if (response.data.success) {
          setProjects(response.data.data.projects)
        } else {
          setError('Failed to fetch projects')
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to fetch projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Search</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <ProjectsTable projects={filteredProjects} />
        )}
      </div>
    </div>
  )
}
