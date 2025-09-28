"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

interface ExamAssignmentProps {
  onCancel: () => void
  onAssign: () => void
}

export function ExamAssignment({ onCancel, onAssign }: ExamAssignmentProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-8">Assign Exam to Student</h1>

      <div className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Exam Title
            </Label>
            <Input 
              id="title"
              placeholder="Enter Title" 
              className="bg-[var(--primary-50)] border-[var(--primary-100)] h-14 px-5 rounded-lg text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Subject
            </Label>
            <Select>
              <SelectTrigger className="bg-[var(--primary-50)] border-[var(--primary-100)] h-14 px-5 rounded-lg text-gray-700 w-full justify-between">
                <SelectValue placeholder="Math, Science, EVS, English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Math</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="evs">EVS</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description / Notes
            </Label>
            <Input 
              id="description"
              placeholder="Enter Description" 
              className="bg-[var(--primary-50)] border-[var(--primary-100)] h-24 px-5 rounded-lg text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="examType" className="text-sm font-medium text-gray-700">
              Exam Type
            </Label>
            <Select>
              <SelectTrigger className="bg-[var(--primary-50)] border-[var(--primary-100)] h-14 px-5 rounded-lg text-gray-700 w-full justify-between">
                <SelectValue placeholder="Class Test, Unit Test, Term Exam, Practice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class-test">Class Test</SelectItem>
                <SelectItem value="unit-test">Unit Test</SelectItem>
                <SelectItem value="term-exam">Term Exam</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
              Due Date
            </Label>
            <div className="relative">
              <Input 
                id="dueDate"
                placeholder="e.g., 27 June 2025" 
                className="bg-[var(--primary-50)] border-[var(--primary-100)] h-14 px-5 pr-12 rounded-lg text-gray-700 placeholder:text-gray-400"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
          <div>
            <Label htmlFor="timeLimit" className="text-sm font-medium text-gray-700">
              Time Limit
            </Label>
            <Select>
              <SelectTrigger className="bg-[var(--primary-50)] border-[var(--primary-100)] h-14 px-5 rounded-lg text-gray-700 w-full justify-between">
                <SelectValue placeholder="5, 10, 15 minutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={onAssign} className="flex-1 button-primary">
            Assign quiz
          </Button>
        </div>
      </div>
    </div>
  )
}
