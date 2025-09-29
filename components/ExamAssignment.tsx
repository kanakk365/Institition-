"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBJECT_OPTIONS } from "@/lib/subjects";
import { Calendar } from "lucide-react";

interface ExamAssignmentProps {
  onCancel: () => void;
  onAssign: (formData: QuizFormData) => void;
}

interface QuizFormData {
  examTitle: string;
  subject: string;
  description: string;
  examType: string;
  dueDate: string;
  timeLimit: string;
}

export function ExamAssignment({ onCancel, onAssign }: ExamAssignmentProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    examTitle: "",
    subject: "",
    description: "",
    examType: "",
    dueDate: "",
    timeLimit: "",
  });

  const handleInputChange = (field: keyof QuizFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onAssign(formData);
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button type="button" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          ← Back
        </button>

        <h1 className="text-xl font-semibold mb-8 text-gray-900">Assign Exam to Student</h1>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label htmlFor="exam-title" className="block text-sm font-medium text-gray-700">
                Exam Title
              </label>
              <Input
                id="exam-title"
                placeholder="Enter Title"
                value={formData.examTitle}
                onChange={(event) => handleInputChange("examTitle", event.target.value)}
                className="h-12 w-full border-[color:var(--primary-200)] focus:border-[color:var(--primary-400)] focus:ring-[color:var(--primary-300)] bg-[var(--primary-50)] text-[color:var(--primary-800)]"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <Select value={formData.subject || undefined} onValueChange={(value) => handleInputChange("subject", value)}>
                <SelectTrigger
                  id="subject"
                  className="h-12 w-full border-[color:var(--primary-200)] focus:border-[color:var(--primary-400)] focus:ring-[color:var(--primary-300)] bg-[var(--primary-50)] text-[color:var(--primary-800)] justify-between"
                >
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  {SUBJECT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-100 px-3 py-2">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description / Notes
              </label>
              <Input
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(event) => handleInputChange("description", event.target.value)}
                className="h-12 w-full border-[color:var(--primary-200)] focus:border-[color:var(--primary-400)] focus:ring-[color:var(--primary-300)] bg-[var(--primary-50)] text-[color:var(--primary-800)]"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="exam-type" className="block text-sm font-medium text-gray-700">
                Exam Type
              </label>
              <Input
                id="exam-type"
                placeholder="Class Test, Unit Test, Term Exam, Practice"
                value={formData.examType}
                onChange={(event) => handleInputChange("examType", event.target.value)}
                className="h-12 w-full border-[color:var(--primary-200)] focus:border-[color:var(--primary-400)] focus:ring-[color:var(--primary-300)] bg-[var(--primary-50)] text-[color:var(--primary-800)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <div className="relative">
                <Input
                  id="due-date"
                  placeholder="e.g., 27 June 2025"
                  value={formData.dueDate}
                  onChange={(event) => handleInputChange("dueDate", event.target.value)}
                  className="h-12 w-full border-[color:var(--primary-200)] focus:border-[color:var(--primary-400)] focus:ring-[color:var(--primary-300)] bg-[var(--primary-50)] text-[color:var(--primary-800)] pr-12"
                />
                <Calendar className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              </div>
            </div>
            <div className="space-y-3">
              <label htmlFor="time-limit" className="block text-sm font-medium text-gray-700">
                Time Limit
              </label>
              <Input
                id="time-limit"
                placeholder="5, 10, 15 minutes"
                value={formData.timeLimit}
                onChange={(event) => handleInputChange("timeLimit", event.target.value)}
                className="h-12 w-full border-[color:var(--primary-200)] focus:border-[color:var(--primary-400)] focus:ring-[color:var(--primary-300)] bg-[var(--primary-50)] text-[color:var(--primary-800)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel} className="px-8 py-2 text-gray-700 border-gray-300 hover:bg-gray-50">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-8 py-2 bg-[color:var(--primary-500)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary-600)]"
          >
            Create Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
