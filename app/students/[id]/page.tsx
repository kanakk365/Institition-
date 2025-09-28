'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import api from '@/lib/api';

interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  class: string | null;
  section: string | null;
  schoolMailId: string | null;
  phone: string;
  alternatePhone: string | null;
  photoUrl: string;
  profilePictureUrl: string | null;
  isRegistrationCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  institutionId: string;
  standardId: string;
  sectionId: string;
  institution: {
    id: string;
    name: string;
  };
  standard: {
    id: string;
    name: string;
  };
  studentSection: {
    id: string;
    name: string;
  };
  quizzes: unknown[];
  SubmitQuiz: unknown[];
  Project: unknown[];
  AssignedProject: unknown[];
  assignedExams: unknown[];
  dailyChallenges: unknown[];
  personalizedTopicInsights: unknown[];
}

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    quizzes: false,
    projects: false,
    progress: false,
    household: false
  });

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      
      try {
        setLoading(true);
        const response = await api.get<ApiResponse<{ student: Student }>>(`/institution-admin/students/${studentId}`);
        
        if (response.data.success) {
          setStudent(response.data.data.student);
        } else {
          setError('Failed to fetch student details');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error && 'response' in err 
          ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch student details'
          : 'Failed to fetch student details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBack = () => {
    router.push('/students');
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary-500)] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading student details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 text-xl mr-3">❌</span>
                <p className="text-red-700 font-medium">{error || 'Student not found'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="mt-4 px-6 py-2 rounded-lg transition-colors button-primary"
            >
              Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Simple Collapsible Sections */}
          <div className="space-y-1">
            {/* Overview Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('overview')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900">Overview</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.overview ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-label="Toggle overview section"
                >
                  <title>Toggle overview section</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSections.overview && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Full Name</div>
                        <div className="text-gray-900">{student.firstName} {student.lastName}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
                        <div className="text-gray-900">{student.email}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Grade / Section</div>
                        <div className="text-gray-900">{student.standard.name} - {student.studentSection.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Institution</div>
                        <div className="text-gray-900">{student.institution.name}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: "var(--primary-500)" }}></div>
                          <span className="text-gray-900">Active</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Date Added</div>
                        <div className="text-gray-900">{formatDate(student.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quizzes Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('quizzes')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900">Quizzes</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.quizzes ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-label="Toggle quizzes section"
                >
                  <title>Toggle quizzes section</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSections.quizzes && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="mt-6">
                    {student.quizzes.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="text-white" style={{ backgroundColor: "var(--primary-500)" }}>
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium">Quiz Title</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Subject</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Score</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Time Taken</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">Fractions Basics</td>
                              <td className="px-4 py-3 text-sm text-gray-600">Math</td>
                              <td className="px-4 py-3 text-sm text-gray-900">87%</td>
                              <td className="px-4 py-3 text-sm text-gray-600">6 min</td>
                              <td className="px-4 py-3 text-sm text-gray-600">03 Jul 2025</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">Photosynthesis</td>
                              <td className="px-4 py-3 text-sm text-gray-600">Science</td>
                              <td className="px-4 py-3 text-sm text-gray-900">90%</td>
                              <td className="px-4 py-3 text-sm text-gray-600">3 min</td>
                              <td className="px-4 py-3 text-sm text-gray-600">03 Jul 2025</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">Figures of Speech</td>
                              <td className="px-4 py-3 text-sm text-gray-600">English</td>
                              <td className="px-4 py-3 text-sm text-gray-900">78%</td>
                              <td className="px-4 py-3 text-sm text-gray-600">7min</td>
                              <td className="px-4 py-3 text-sm text-gray-600">12 Jul 2025</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No quizzes completed yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('projects')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900">Projects</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.projects ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-label="Toggle projects section"
                >
                  <title>Toggle projects section</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSections.projects && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="mt-6">
                    {student.Project.length > 0 ? (
                      <div className="space-y-4">
                        {(student.Project as { id?: string; title?: string; description?: string; status?: string }[]).map((project, index) => (
                          <div key={project.id || `project-${index}`} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{project.title || `Project ${index + 1}`}</h4>
                              <span className="text-sm text-gray-500">{project.status || 'In Progress'}</span>
                            </div>
                            <p className="text-sm text-gray-600">{project.description || 'No description available'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No projects assigned yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('progress')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900">Progress</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.progress ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-label="Toggle progress section"
                >
                  <title>Toggle progress section</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSections.progress && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Academic Summary</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Total Quizzes</span>
                            <span className="font-medium text-gray-900">{student.quizzes.length}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Total Projects</span>
                            <span className="font-medium text-gray-900">{student.Project.length}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Assigned Exams</span>
                            <span className="font-medium text-gray-900">{student.assignedExams.length}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Account Status</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Registration</span>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              student.isRegistrationCompleted 
                                ? 'bg-[var(--primary-100)] text-[color:var(--primary-800)]' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.isRegistrationCompleted ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Verification</span>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              student.isVerified 
                                ? 'bg-[var(--primary-100)] text-[color:var(--primary-800)]' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Account Status</span>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              student.isActive 
                                ? 'bg-[var(--primary-100)] text-[color:var(--primary-800)]' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Household Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => toggleSection('household')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900">Household</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.household ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-label="Toggle household section"
                >
                  <title>Toggle household section</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSections.household && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Phone Number</span>
                            <p className="text-gray-900">{student.phone}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Email Address</span>
                            <p className="text-gray-900">{student.email}</p>
                          </div>
                          {student.alternatePhone && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Alternate Phone</span>
                              <p className="text-gray-900">{student.alternatePhone}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                            <p className="text-gray-900">{formatDate(student.dob)}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Gender</span>
                            <p className="text-gray-900 capitalize">{student.gender.toLowerCase()}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Institution</span>
                            <p className="text-gray-900">{student.institution.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
