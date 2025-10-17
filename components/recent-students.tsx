import { Button } from "@/components/ui/button"

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  joinedAt: string;
}

interface RecentStudentsProps {
  students?: Student[];
}

const defaultStudents = [
  {
    id: "01",
    name: "Jo Monet",
    email: "otojumeju@yahoo.com",
    class: "Grade 1",
    section: "A",
    joinedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "02",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    class: "Grade 2",
    section: "B",
    joinedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "03",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    class: "Grade 3",
    section: "A",
    joinedAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: "04",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    class: "Grade 4",
    section: "C",
    joinedAt: "2024-01-04T00:00:00.000Z",
  },
]

export function RecentStudents({ students = defaultStudents }: RecentStudentsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Header */}
  <div className="grid grid-cols-5 gap-4 p-4 bg-gradient-to-r from-[color:var(--primary-500)] to-[color:var(--primary-600)] text-[color:var(--primary-foreground)] text-sm font-medium rounded-t-lg">
          <div>Student Name</div>
          <div className="col-span-2">Email</div>
          <div>Class/Section</div>
          <div className="flex justify-between items-center">
            <span>Joined</span>
            <span>Action</span>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-0">
          {students.map((student, index) => (
            <div
              key={student.id}
              className={`grid grid-cols-5 gap-4 p-4 text-sm border-b border-[color:var(--primary-100)] transition-colors hover:bg-[color:var(--primary-100)] ${
                index % 2 === 0 ? "bg-white" : "bg-[var(--primary-50)]"
              }`}
            >
              <div className="font-medium text-[color:var(--primary-800)]">{student.name}</div>
              <div className="col-span-2 text-[color:var(--primary-700)]">{student.email}</div>
              <div className="text-[color:var(--primary-700)]">{student.class} - {student.section}</div>
              <div className="flex justify-between items-center">
                <span className="text-[color:var(--primary-700)]">{formatDate(student.joinedAt)}</span>
                <Button size="sm" className="button-primary px-4 py-1 text-xs shadow-sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
