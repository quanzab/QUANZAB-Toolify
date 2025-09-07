
# QUANZAB Toolify - Project Blueprint

This document outlines the architecture, features, and technical specifications of the QUANZAB Toolify application.

## 1. Core Philosophy

QUANZAB Toolify is a comprehensive, all-in-one productivity suite designed to be fast, secure, and intuitive. It leverages modern web technologies and AI to streamline common tasks related to documents, business productivity, and text manipulation. The application prioritizes user experience with a clean, dark-mode-first interface and responsive design.

## 2. Technology Stack

- **Frontend Framework:** React 19 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS with a custom theme configuration.
- **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`, custom hooks).
- **Client-Side Libraries:**
  - **PDF Manipulation:** `pdf-lib` (merging, signing), `pdfjs-dist` (rendering, splitting, compressing, conversion).
  - **File Handling:** `react-dropzone`, `file-saver`, `jszip`.
  - **AI Integration:** `@google/genai` for Gemini API access.

## 3. Application Architecture

- **`index.tsx`**: Main entry point, renders the React application.
- **`App.tsx`**: Core component handling routing, layout (Header/Footer), and lazy loading of page components.
- **`components/`**: Contains reusable UI components used across the application (e.g., `ToolCard`, `FileDropzone`, `Header`, `Loader`).
- **`pages/`**: Each tool has its own page component (e.g., `PdfMergePage.tsx`, `TextSummarizerPage.tsx`). This allows for code splitting and lazy loading.
- **`hooks/`**: Houses custom hooks for shared logic, such as `useTheme` for theme toggling and `useTaskManager` for business logic.
- **`data/`**: Stores static data like the list of available tools (`tools.ts`).
- **`types.ts`**: Centralized location for TypeScript type definitions and interfaces.

## 4. Feature Set

### Core Platform Features

- **Responsive Design:** Fully functional on desktop, tablet, and mobile devices.
- **Dark Mode:** User-toggleable dark/light theme, with dark as the default.
- **Interactive UI:** Features like a cursor glow effect enhance user engagement.
- **Search & Filtering:** Users can search for tools and filter by category on the homepage.
- **Lazy Loading:** Tool pages are lazy-loaded to improve initial load performance.

### Tool Categories & Features

#### A. Document & File Tools

1.  **PDF Merge:** Combine multiple PDFs, re-order files, and download the merged result. Includes advanced features like batch renaming original files.
2.  **PDF Split:** Extract specific pages from a PDF either by visual selection or by entering page ranges.
3.  **PDF Compress:** Reduce PDF file size by converting pages to images. Offers multiple quality levels.
4.  **PDF Converter:** Convert PDF pages into high-quality JPG or PNG images. Includes an optional AI-powered OCR feature to extract text.
5.  **PDF Sign (Premium):** Electronically sign documents by drawing, typing, or uploading a signature image.

#### B. Business Productivity

1.  **Invoice Generator:** Create simple, professional invoices and download them as PDFs.
2.  **Task Manager:** A to-do list application with local storage persistence, allowing users to add, delete, complete, and set due dates for tasks.
3.  **Receipt Scanner:** Uses AI to scan an image of a receipt and extract key information like vendor, date, total, and line items.

#### C. AI & Text Tools

1.  **Text Summarizer:** Leverages the Gemini API to generate concise summaries of long-form text.
2.  **AI Document Analyzer (Premium):** A chat-based interface allowing users to upload a document and ask questions about its content.
3.  **Paraphraser & Rewriter:** Rephrases text in various tones (e.g., Formal, Casual, Creative) using AI.

#### D. Niche Maritime Tools

1.  **Crew Roster Planner:** A simple interface to manage and schedule crew members for weekly rosters.
2.  **Vessel Compliance Checker (Premium):** A mock tool to check vessel compliance against international regulations.
