import React from 'react';
import {
  FolderIcon,
  TuneIcon,
  WandIcon,
  UserIcon,
  SecureIcon,
  PresentationIcon,
  ChartBarIcon,
  TypeIcon,
  StarIcon
} from '../components/Icons';

interface FeatureSubCategory {
  name: string;
  features: string[];
}

export interface FeatureCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subCategories: FeatureSubCategory[];
}

export const platformFeatures: FeatureCategory[] = [
  {
    title: '1. File Management',
    icon: FolderIcon,
    color: 'text-blue-400',
    subCategories: [
      {
        name: 'Document Management',
        features: ['PDF, Word, Excel, PowerPoint, Markdown, Text, ePub, MOBI', 'Upload / Download / Rename / Move / Delete', 'Version History & Auto Backup'],
      },
      {
        name: 'Media Management',
        features: ['Images (JPG, PNG, GIF, SVG, TIFF, WebP)', 'Audio (MP3, WAV)', 'Video (MP4, AVI, MOV)', 'Auto-tagging / AI Categorization'],
      },
      {
        name: 'Cloud Integration',
        features: ['Google Drive / OneDrive / Dropbox / Box', 'Sync & Offline Access'],
      },
    ],
  },
  {
    title: '2. Editing & Conversion',
    icon: TuneIcon,
    color: 'text-green-400',
    subCategories: [
      {
        name: 'Document Editing',
        features: ['Text formatting / Tables / Charts / Templates', 'Track changes / Comments / Redaction'],
      },
      {
        name: 'PDF Tools',
        features: ['Merge / Split / Reorder / Compress / OCR', 'Annotate / Watermark / Protect / Unlock'],
      },
      {
        name: 'Media Editing',
        features: ['Image: Crop / Resize / Filters / Background Removal', 'Video: Trim / Merge / Captions / Watermark', 'Audio: Trim / Normalize / Convert'],
      },
      {
        name: 'Conversion Tools',
        features: ['PDF ↔ Word / Excel / PowerPoint / Image', 'Image ↔ PDF', 'Audio ↔ Text / Video ↔ GIF'],
      },
    ],
  },
  {
    title: '3. AI-Powered Features',
    icon: WandIcon,
    color: 'text-purple-400',
    subCategories: [
      {
        name: 'Intelligence',
        features: ['Document Summarization & Keyword Extraction', 'Smart Search (Text, Audio, Video)', 'Language Translation'],
      },
      {
        name: 'Interaction',
        features: ['Content Assistant (Q&A on documents)', 'Media Enhancement (Image/Video/Audio)', 'Predictive Recommendations (Templates, Files)'],
      },
    ],
  },
  {
    title: '4. Collaboration & Workflow',
    icon: UserIcon,
    color: 'text-cyan-400',
    subCategories: [
      {
        name: 'Team Features',
        features: ['Shared Workspaces / Team Folders', 'Real-Time Co-Editing', 'Comments & Annotations'],
      },
      {
        name: 'Productivity',
        features: ['Approval Chains / Review Workflows', 'Task Integration / Kanban Boards', 'Notifications & Activity Logs'],
      },
    ],
  },
  {
    title: '5. Security & Compliance',
    icon: SecureIcon,
    color: 'text-red-400',
    subCategories: [
      {
        name: 'Core Security',
        features: ['End-to-End Encryption', 'Role-Based Access Control', 'Digital Signatures & Verification'],
      },
      {
        name: 'Compliance',
        features: ['Audit Trails & Logs', 'Supports GDPR / HIPAA / ISO Standards'],
      },
    ],
  },
  {
    title: '6. Templates & Design',
    icon: PresentationIcon,
    color: 'text-yellow-400',
    subCategories: [
      {
        name: 'Template Library',
        features: ['Documents (Contracts, Reports, Invoices)', 'Presentations & Infographics'],
      },
      {
        name: 'AI Generation',
        features: ['AI-Generated Presentations from prompt', 'AI-Generated Documents from outline', 'Custom Page Layout & Design Tools'],
      },
    ],
  },
  {
    title: '7. Analytics & Dashboard',
    icon: ChartBarIcon,
    color: 'text-orange-400',
    subCategories: [
      {
        name: 'Usage Statistics',
        features: ['Document & Media Usage Analytics', 'Team Activity & Performance', 'Conversion & Edit Statistics'],
      },
      {
        name: 'Insights',
        features: ['AI-driven Insights & Recommendations'],
      },
    ],
  },
  {
    title: '8. Developer Tools',
    icon: TypeIcon,
    color: 'text-indigo-400',
    subCategories: [
      {
        name: 'API & Extensibility',
        features: ['REST API / SDKs', 'Webhooks / Automation', 'Integration with Third-Party Apps'],
      },
    ],
  },
  {
    title: '9. Value-Added Features',
    icon: StarIcon,
    color: 'text-pink-400',
    subCategories: [
      {
        name: 'Platform Enhancements',
        features: ['Marketplace (Templates, Assets, AI Content Packs)', 'Dark Mode & Accessibility', 'Offline Mode & Multi-Language UI'],
      },
    ],
  },
];