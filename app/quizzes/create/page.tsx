'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { GradeSelection } from '../../../components/grade-select';

export default function CreateQuizPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <GradeSelection />
      </div>
    </div>
  );
}
