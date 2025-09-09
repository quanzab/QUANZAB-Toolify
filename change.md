# Changelog

All notable changes to the QUANZAB Toolkit application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - YYYY-MM-DD

### Added
- **PDF Metadata Viewer**: Implemented a new tool based on the project blueprint that allows users to view and extract metadata properties (author, creation date, etc.) from a PDF file. This fulfills the "metadata extraction" capability outlined in the blueprint.

## [1.7.0] - YYYY-MM-DD

### Added
- **AI Proofreader**: Implemented a new premium tool based on the project blueprint that checks text for grammatical, spelling, and style errors, providing AI-powered suggestions for improvement.

## [1.6.0] - YYYY-MM-DD

### Added
- **PDF Page Manager**: Implemented a new premium tool based on the project blueprint that allows users to visually reorder, rotate, and delete pages from a PDF document.

## [1.5.0] - YYYY-MM-DD

### Added
- **AI Keyword Extractor**: Implemented a new premium tool based on the project blueprint that extracts relevant keywords from a block of text using AI.

## [1.4.0] - YYYY-MM-DD

### Added
- **AI Image Generator**: Implemented a new premium tool based on the project blueprint that allows users to generate images from text prompts using AI. Users can specify the number of images and aspect ratio.

## [1.3.0] - YYYY-MM-DD

### Added
- **Image Editor - Watermarking**: Added the ability to apply both text and image watermarks to images, a feature outlined in the project blueprint.
- **Enhanced Placeholders**: Updated the "Video to GIF" and "Video Editor" pages with more detailed technical explanations, setting clearer user expectations for these deferred features.

## [1.2.0] - YYYY-MM-DD

### Added

- **AI Content Generator**: Added a new premium tool that uses AI to generate various types of written content (blog posts, emails, etc.) from a user's prompt.
- **Project Documentation Updates**: Updated `todo.md` to reflect completed features and future plans.

## [1.1.0] - YYYY-MM-DD

### Added

- **Project Monitoring Files**: Introduced `blueprint.md`, `change.md`, and `todo.md` to better document and track the project's architecture, history, and future tasks.

## [1.0.2] - YYYY-MM-DD

### Added

- **Copy Summary Button**: Added a button to the Text Summarizer tool to allow users to easily copy the generated summary to their clipboard.

## [1.0.1] - YYYY-MM-DD

### Added

- **Task Due Dates**: Implemented a due date feature in the Task Manager. Users can now add and update due dates for their tasks. Overdue tasks are visually highlighted.

### Changed

- Updated `Task` interface in `types.ts` to include an optional `dueDate`.
- Modified `useTaskManager` hook to handle due date logic.
- Upgraded `TaskItem` and `TaskManagerPage` components with date picker functionality.

## [1.0.0] - YYYY-MM-DD

### Added

- **Initial Release**: Launched QUANZAB Toolkit with a suite of productivity tools.
- **Document Tools**: PDF Merge, Split, Compress, Converter, and Sign.
- **Business Tools**: Invoice Generator, Task Manager, Receipt Scanner.
- **AI & Text Tools**: AI Text Summarizer, AI Document Analyzer, Paraphraser.
- **Maritime Tools**: Crew Roster Planner, Vessel Compliance Checker.
- **Core Features**: Dark mode, responsive design, tool search, and filtering.