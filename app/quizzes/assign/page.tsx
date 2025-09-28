'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
}

interface Student {
  id: string;
  name: string;
  classSection: string;
  email: string;
}

interface Grade {
  id: string;
  name: string;
  sections: Section[];
}

interface Section {
  id: string;
  name: string;
}

export default function AssignQuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [assignToAll, setAssignToAll] = useState(false);
  const [dueDate, setDueDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGrade && selectedSection) {
      fetchStudents();
    }
  }, [selectedGrade, selectedSection]);

  const fetchData = async () => {
    // Mock data
    const mockQuizzes: Quiz[] = [
      { id: '1', title: 'Fractions Quiz', subject: 'Mathematics', duration: 30, totalQuestions: 20 },
      { id: '2', title: 'Algebra Basics', subject: 'Mathematics', duration: 45, totalQuestions: 25 },
      { id: '3', title: 'English Grammar', subject: 'English', duration: 40, totalQuestions: 30 },
    ];

    const mockGrades: Grade[] = [
      {
        id: '9',
        name: 'Grade 9',
        sections: [
          { id: 'A', name: 'Section A' },
          { id: 'B', name: 'Section B' },
          { id: 'C', name: 'Section C' },
        ]
      },
      {
        id: '10',
        name: 'Grade 10',
        sections: [
          { id: 'A', name: 'Section A' },
          { id: 'B', name: 'Section B' },
        ]
      },
    ];

    setQuizzes(mockQuizzes);
    setGrades(mockGrades);
  };

  const fetchStudents = async () => {
    // Mock data based on selected grade and section
    const mockStudents: Student[] = [
      { id: '1', name: 'Anaya Joshi', classSection: `${selectedGrade} ${selectedSection}`, email: 'anaya@example.com' },
      { id: '2', name: 'Rahul Sharma', classSection: `${selectedGrade} ${selectedSection}`, email: 'rahul@example.com' },
      { id: '3', name: 'Priya Singh', classSection: `${selectedGrade} ${selectedSection}`, email: 'priya@example.com' },
      { id: '4', name: 'Arjun Patel', classSection: `${selectedGrade} ${selectedSection}`, email: 'arjun@example.com' },
      { id: '5', name: 'Sneha Kumar', classSection: `${selectedGrade} ${selectedSection}`, email: 'sneha@example.com' },
    ];
    setStudents(mockStudents);
  };

  const handleStudentSelection = (studentId: string) => {
    if (assignToAll) return;
    
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignToAllChange = (checked: boolean) => {
    setAssignToAll(checked);
    if (checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleAssignQuiz = async () => {
    if (!selectedQuiz || !selectedGrade || !selectedSection || (!assignToAll && selectedStudents.length === 0)) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Quiz assigned successfully!');
      router.push('/quizzes');
    } catch (error) {
      console.error('Error assigning quiz:', error);
      alert('Failed to assign quiz');
    } finally {
      setLoading(false);
    }
  };

  const selectedGradeData = grades.find(g => g.id === selectedGrade);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center mb-4 font-medium text-[color:var(--primary-600)] hover:text-[color:var(--primary-700)]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Quizzes
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Assign Quiz to Student</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Quiz Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Quiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => setSelectedQuiz(quiz.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedQuiz === quiz.id 
                      ? 'border-[color:var(--primary-400)] bg-[var(--primary-50)]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">Subject: {quiz.subject}</p>
                  <p className="text-sm text-gray-600 mb-1">Duration: {quiz.duration} minutes</p>
                  <p className="text-sm text-gray-600">Questions: {quiz.totalQuestions}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grade and Section Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Grade & Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grade Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    setSelectedSection('');
                    setStudents([]);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--primary-400)] focus:border-[color:var(--primary-400)]"
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={!selectedGrade}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--primary-400)] focus:border-[color:var(--primary-400)] disabled:bg-gray-100"
                >
                  <option value="">Select Section</option>
                  {selectedGradeData?.sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Student Selection */}
          {students.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Select Students</h2>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={assignToAll}
                    onChange={(e) => handleAssignToAllChange(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Assign to all students</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelection(student.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedStudents.includes(student.id) || assignToAll
                        ? 'border-[color:var(--primary-400)] bg-[var(--primary-50)]' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${assignToAll ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id) || assignToAll}
                        readOnly
                        className="mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Set Due Date (Optional)</h2>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--primary-400)] focus:border-[color:var(--primary-400)]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssignQuiz}
              disabled={loading || !selectedQuiz || !selectedGrade || !selectedSection || (!assignToAll && selectedStudents.length === 0)}
              className="px-6 py-2 rounded-lg transition-colors bg-[color:var(--primary-500)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary-600)] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Assigning...' : 'Assign Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
