import React from 'react';

export enum Category {
  DOCUMENTS = 'Document & File Tools',
  BUSINESS = 'Business Productivity',
  AI = 'AI & Text Tools',
  MARITIME = 'Niche Maritime Tools',
}

export interface Tool {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: Category;
  premium?: boolean;
  path: string;
  tags?: ('New' | 'Popular' | 'AI')[];
  featured?: boolean;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}
