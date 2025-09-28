'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { SectionSelection } from '../../../../../components/section-select';
import { useParams } from 'next/navigation';

export default function GradeSectionsPage() {
  const params = useParams();
  const gradeId = params.id as string;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <SectionSelection grade={gradeId} />
      </div>
    </div>
  );
}
