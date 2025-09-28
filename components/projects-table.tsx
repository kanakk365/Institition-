"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

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

interface ProjectsTableProps {
  projects: Project[]
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter()

  const handleViewProject = (standardId: string) => {
    router.push(`/projects/${standardId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Project Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Subject</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Class</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Created Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{project.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{project.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{project.class}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(project.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--primary-100)] text-[color:var(--primary-800)]">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      className="button-primary px-4 py-1 text-sm"
                      onClick={() => handleViewProject(project.standardId)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
