
# Changelog

All notable changes to the QUANZAB Toolkit application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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