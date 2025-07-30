'use client';

import { useState } from 'react';

interface ExpandableSectionProps {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export default function ExpandableSection({ title, content, defaultOpen = false }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line text-gray-600 transition-transform`}></i>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-white">
          {content}
        </div>
      )}
    </div>
  );
}