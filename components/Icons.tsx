import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    {props.children}
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </Icon>
);

export const StarIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props} fill="currentColor" stroke="none" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </Icon>
);

export const MergeIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6.28A2 2 0 0111.28 9h1.44A2 2 0 0115 10.72V17m-6 0h6m-3-10V3M3 3h18" />
  </Icon>
);

export const SplitIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-4-6h8m6-3v6m-2-3h-2M4 9v6M6 12H4" />
  </Icon>
);

export const CompressIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4M15 10h-6m3-3v6" />
  </Icon>
);

export const ConvertIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </Icon>
);

export const SignIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </Icon>
);

export const InvoiceIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </Icon>
);

export const SummarizeIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </Icon>
);

export const AIIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </Icon>
);

export const MaritimeIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.62 10.38a2 2 0 00-.73-1.6L14.4 3.29a2 2 0 00-2.8 0L6.11 8.78a2 2 0 00-.73 1.6l-2 9.02a2 2 0 001.99 2.18h14.26a2 2 0 001.99-2.18l-2-9.02zM12 15a3 3 0 100-6 3 3 0 000 6z" />
  </Icon>
);

export const FastIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </Icon>
);

export const SecureIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12 12 0 0012 21.414a12 12 0 008.618-15.414z" />
  </Icon>
);

export const FreeIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12v10H4V12" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 6H8a2 2 0 00-2 2v4h12V8a2 2 0 00-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22V6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6H7.5a2.5 2.5 0 00-2.5 2.5V12m9-6h4.5a2.5 2.5 0 012.5 2.5V12" />
  </Icon>
);

export const TrustedIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Icon>
);

export const SunIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />
  </Icon>
);

export const MoonIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </Icon>
);

export const UndoIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" />
  </Icon>
);

export const RedoIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m8-10l-4-4m4 4l-4 4" />
  </Icon>
);

export const UploadIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </Icon>
);

export const DownloadIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V3" />
  </Icon>
);

export const ZipIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h4a2 2 0 002-2V8a2 2 0 00-2-2h-1m-1 8v-1m0-2v-1m0-2v-1" />
  </Icon>
);

export const PencilIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 7.196z" />
  </Icon>
);

export const TypeIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7V6a1 1 0 011-1h14a1 1 0 011 1v1M7 12h10M9 12V6m6 6V6" />
    </Icon>
);

export const ChecklistIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </Icon>
);

export const UserIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </Icon>
);

export const WandIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 2.879a3 3 0 014.242 4.242l-2.828 2.829-4.243-4.243L14.12 2.88z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.3 5.7L2.88 14.12a3 3 0 004.243 4.243l8.418-8.418" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.222 18.364L3.515 19.07M6.343 16.243l-1.06 1.06M2.1 12l.707.707M12 2.1l-.707.707" />
  </Icon>
);

export const ImageIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </Icon>
);

export const TuneIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </Icon>
);

export const PresentationIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354v15.292m-4.06-2.882L12 21l4.06-4.236M3 4h18v10H3z"/>
  </Icon>
);

export const FolderIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </Icon>
);

export const ChartBarIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
  </Icon>
);

export const TranslateIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13-4-4-4 4M5 13h10a2 2 0 012 2v2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-1.5-1.5M15 13l1.5-1.5M19 13h-4" />
  </Icon>
);

export const KanbanIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </Icon>
);

export const WatermarkIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </Icon>
);

export const LockIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </Icon>
);

export const LockOpenIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </Icon>
);

export const DocumentMinusIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </Icon>
);

export const VideoIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h10a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </Icon>
);

export const AudioIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m-2.828-2.828a2 2 0 010 2.828M10 18v-2m0-4V6a2 2 0 012-2h0a2 2 0 012 2v6m-4 4h4" />
  </Icon>
);

export const ResearchIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8M10 8h4M3 4h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-3.5-3.5M14 10a4 4 0 11-8 0 4 4 0 018 0z" />
  </Icon>
);

export const TagIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.586 2.586a2 2 0 00-2.828 0L2.172 10.172a2 2 0 000 2.828l7.586 7.586a2 2 0 002.828 0l7.586-7.586a2 2 0 000-2.828L12.586 2.586z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13a1 1 0 11-2 0 1 1 0 012 0z" />
    </Icon>
);

export const ProofreadIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </Icon>
);

export const TableCellsIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16M4 6v12m8-12v12" />
  </Icon>
);