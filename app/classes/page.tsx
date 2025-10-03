"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { Sidebar } from '@/components/ui/sidebar';
import api from '@/lib/api';

interface Standard {
  id: string;
  name: string;
  institutionId: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}

interface Section {
  id: string;
  name: string;
  standardId: string;
  createdAt: string;
  updatedAt: string;
  standard?: {
    id: string;
    name: string;
  };
}

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

interface StandardsResponse {
  standards: Standard[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

interface SectionsResponse {
  sections: Section[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

interface StudentsResponse {
  students: Student[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  standardId: string;
  sectionId: string;
  standard: {
    id: string;
    name: string;
  };
  studentSection: {
    id: string;
    name: string;
  };
}

interface Class {
  id: string;
  grade: string;
  totalStudents: number;
  sections: string;
}

const gradeOptions = [
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'UG',
  'PG',
];

export default function ClassesPage() {
  const router = useRouter();
  const [standards, setStandards] = useState<Standard[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addingClass, setAddingClass] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all students for a specific standard and section
  const fetchStudentsForSection = useCallback(async (standardName: string, sectionName: string): Promise<number> => {
    try {
      let totalStudents = 0;
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await api.get<ApiResponse<StudentsResponse>>(
          `/institution-admin/students?page=${currentPage}&standardName=${encodeURIComponent(standardName)}&sectionName=${encodeURIComponent(sectionName)}`
        );
        
        if (response.data.success) {
          totalStudents += response.data.data.students.length;
          totalPages = response.data.data.pagination.totalPages;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      return totalStudents;
    } catch (err) {
      console.error(`Error fetching students for ${standardName} - ${sectionName}:`, err);
      return 0;
    }
  }, []);

  // Fetch student counts for all sections of a standard
  const fetchStudentCountsForStandard = useCallback(async (standard: Standard, standardSections: Section[]): Promise<number> => {
    try {
      const studentCountPromises = standardSections.map(section => 
        fetchStudentsForSection(standard.name, section.name)
      );
      
      const studentCounts = await Promise.all(studentCountPromises);
      return studentCounts.reduce((total, count) => total + count, 0);
    } catch (err) {
      console.error(`Error fetching student counts for standard ${standard.name}:`, err);
      return 0;
    }
  }, [fetchStudentsForSection]);

  // Fetch all standards from all pages
  const fetchAllStandards = useCallback(async () => {
    try {
      let allStandards: Standard[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const url = currentPage === 1 ? '/institution-admin/standards' : `/institution-admin/standards?page=${currentPage}`;
        const response = await api.get<ApiResponse<StandardsResponse>>(url);
        
        if (response.data.success) {
          allStandards = [...allStandards, ...response.data.data.standards];
          totalPages = response.data.data.pagination.totalPages;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      setStandards(allStandards);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch classes'
        : 'Failed to fetch classes';
      setError(errorMessage);
    }
  }, []);

  // Fetch all sections from all pages
  const fetchAllSections = useCallback(async () => {
    try {
      let allSections: Section[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const url = currentPage === 1 ? '/institution-admin/sections' : `/institution-admin/sections?page=${currentPage}`;
        const response = await api.get<ApiResponse<SectionsResponse>>(url);
        
        if (response.data.success) {
          allSections = [...allSections, ...response.data.data.sections];
          totalPages = response.data.data.pagination.totalPages;
          currentPage++;
        } else {
          break;
        }
      } while (currentPage <= totalPages);

      setSections(allSections);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch sections'
        : 'Failed to fetch sections';
      setError(errorMessage);
    }
  }, []);

  // Transform standards and sections into classes data with real student counts
  const transformToClasses = useCallback(async () => {
    try {
      const classesData: Class[] = await Promise.all(
        standards.slice().reverse().map(async (standard) => {
          const standardSections = sections.filter(section => section.standardId === standard.id);
          const sectionNames = standardSections.map(section => section.name).join(', ');
          
          // Get real student count for this standard
          const totalStudents = await fetchStudentCountsForStandard(standard, standardSections);
          
          return {
            id: standard.id,
            grade: standard.name,
            totalStudents,
            sections: sectionNames || 'No sections'
          };
        })
      );
      
      setClasses(classesData);
    } catch (err) {
      console.error('Error transforming classes data:', err);
      setError('Failed to load student counts');
    }
  }, [standards, sections, fetchStudentCountsForStandard]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAllStandards(), fetchAllSections()]);
      setLoading(false);
    };

    fetchData();
  }, [fetchAllStandards, fetchAllSections]);

  useEffect(() => {
    const loadClassesWithStudentCounts = async () => {
      if (standards.length > 0 && sections.length > 0) {
        setLoading(true);
        await transformToClasses();
        setLoading(false);
      }
    };

    loadClassesWithStudentCounts();
  }, [standards, sections, transformToClasses]);

  const handleCreateNewClass = async () => {
    if (!newClassName.trim()) {
      setError('Please enter a class name');
      return;
    }

    if (selectedSections.length === 0) {
      setError('Please select at least one section');
      return;
    }

    setAddingClass(true);
    setError('');
    setSuccess('');

    try {
      // First, create the standard (class)
      const standardResponse = await api.post<ApiResponse<{ standard: Standard }>>('/institution-admin/standards', {
        name: newClassName.trim(),
      });

      if (standardResponse.data.success) {
        const newStandardId = standardResponse.data.data.standard.id;
        
        // Create the selected sections
        const sectionPromises = selectedSections.map(sectionName =>
          api.post<ApiResponse<{ section: Section }>>('/institution-admin/sections', {
            name: sectionName,
            standardId: newStandardId,
          })
        );

        await Promise.all(sectionPromises);
        
        const sectionsList = selectedSections.join(', ');
        setSuccess(`Class "${newClassName}" created successfully with sections ${sectionsList}!`);
        setNewClassName('');
        setSelectedSections([]);
        setShowModal(false);
        // Refresh data
        await Promise.all([fetchAllStandards(), fetchAllSections()]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as Error & { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create class'
        : 'Failed to create class';
      setError(errorMessage);
    } finally {
      setAddingClass(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setNewClassName('');
    setSelectedSections([]);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setNewClassName('');
    setSelectedSections([]);
  };

  const toggleSection = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleViewClass = (classId: string) => {
    // Navigate to class details page
    router.push(`/classes/${classId}`);
  };

  // Filter classes based on search
  const filteredClasses = classes.filter(cls =>
    cls.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">All Classes</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={openModal}
                className="button-primary px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Create new class
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search class here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mx-6 mt-4 p-4 bg-[var(--primary-50)] border border-[color:var(--primary-200)] text-[color:var(--primary-700)] rounded-lg">
              {success}
            </div>
          )}

          {/* Add Class Modal */}
          {showModal && (
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-lg w-full mx-4 transform transition-all duration-300 ease-out scale-100 opacity-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-[color:var(--primary-500)] to-[color:var(--primary-600)] bg-clip-text text-transparent flex items-center">
                    <span className="mr-4 text-4xl">🎓</span>
                    Add New Class
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100/50 transition-all duration-200 backdrop-blur-sm"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label htmlFor="className" className="block text-sm font-bold text-gray-800 mb-4">
                      Class Name
                    </label>
                    <Select
                      value={newClassName || undefined}
                      onValueChange={setNewClassName}
                    >
                      <SelectTrigger
                        id="className"
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[color:var(--primary-200)] focus:border-[color:var(--primary-400)] transition-all duration-300 shadow-lg backdrop-blur-sm bg-white/90 text-lg text-left justify-between"
                      >
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-2 border-[color:var(--primary-100)] shadow-xl bg-white/95 backdrop-blur-lg">
                        {gradeOptions.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="block text-sm font-bold text-gray-800 mb-4">
                      Select Sections
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((section) => (
                        <button
                          key={section}
                          type="button"
                          onClick={() => toggleSection(section)}
                          className={`py-3 px-4 rounded-2xl border-2 font-bold transition-all duration-300 transform hover:scale-105 ${
                            selectedSections.includes(section)
                              ? 'bg-gradient-to-r from-[color:var(--primary-500)] to-[color:var(--primary-600)] text-[color:var(--primary-foreground)] border-[color:var(--primary-400)] shadow-lg scale-105'
                              : 'bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:border-[color:var(--primary-300)] hover:bg-[color:var(--primary-50)] shadow-md'
                          }`}
                        >
                          {section}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-3 font-medium">
                      Select the sections you want to create for this class.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={handleCreateNewClass}
                    disabled={addingClass || !newClassName.trim() || selectedSections.length === 0}
                    className="flex-1 bg-gradient-to-r from-[color:var(--primary-500)] to-[color:var(--primary-600)] text-[color:var(--primary-foreground)] py-4 px-6 rounded-2xl font-bold hover:from-[color:var(--primary-600)] hover:to-[color:var(--primary-700)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center backdrop-blur-sm"
                  >
                    {addingClass ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-[color:var(--primary-foreground)] mr-3"></span>
                        Creating Class...
                      </>
                    ) : (
                      <>
                        <span className="mr-3 text-lg">✨</span>
                        Create Class
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={addingClass}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 font-bold disabled:opacity-50 backdrop-blur-sm bg-white/80 shadow-lg transform hover:scale-105 disabled:hover:scale-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--primary-500)]"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--primary-50)] border-b border-[color:var(--primary-200)]">
                    <th className="text-left py-4 px-6 font-medium text-[color:var(--primary-800)]">Grade</th>
                    <th className="text-left py-4 px-6 font-medium text-[color:var(--primary-800)]">Total Students</th>
                    <th className="text-left py-4 px-6 font-medium text-[color:var(--primary-800)]">Sections</th>
                    <th className="text-left py-4 px-6 font-medium text-[color:var(--primary-800)]">View Button</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500">
                        {searchTerm ? 'No classes found matching your search.' : 'No classes found. Create your first class to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`border-b border-[color:var(--primary-100)] transition-colors hover:bg-[color:var(--primary-100)] ${
                          index % 2 === 0 ? "bg-white" : "bg-[var(--primary-50)]"
                        }`}
                      >
                        <td className="py-4 px-6 text-[color:var(--primary-800)] font-medium">{row.grade}</td>
                        <td className="py-4 px-6 text-[color:var(--primary-700)]">{row.totalStudents}</td>
                        <td className="py-4 px-6 text-[color:var(--primary-700)]">{row.sections}</td>
                        <td className="py-4 px-6">
                          <Button 
                            size="sm" 
                            onClick={() => handleViewClass(row.id)}
                            className="button-primary px-4 py-2 rounded-lg shadow-sm"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
