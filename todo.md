# Project To-Do List

This document tracks planned features, enhancements, and bug fixes for the QUANZAB Toolkit application.

## High Priority

- [x] **Implement User Authentication**: Set up a user login/signup system to support premium features and personalized experiences. (Mock implementation using localStorage).
- [x] **Activate Premium Features**: Gate premium tools (`PDF Sign`, `AI Document Analyzer`, etc.) behind the authentication system.
- [x] **PDF Sign Tool - Interactivity**: Implement the drag, drop, and resize functionality for signatures and text boxes on the PDF pages.
- [x] **Improve Error Handling**: Provided more specific user feedback for password-protected files in PDF Split, Merge, and Compress tools. (Ongoing).
- [ ] **Enhance Accessibility**: Conduct a full accessibility audit. Add necessary ARIA attributes, ensure keyboard navigability, and check color contrast. (Ongoing improvements made).
- [x] **Complete "Coming Soon" Tools**: All non-deferred tools are now implemented and stabilized.
  - [x] AI Presentation Generator
  - [x] AI Code Assistant
  - [x] PDF Annotator (Simplified Text Annotation)
  - [x] Language Translator
  - [x] Project Planner (Kanban Board)
  - [x] PDF Watermarker
  - [x] PDF Protect
  - [ ] Video to GIF Converter (Deferred due to complexity)
  - [ ] AI Audio Transcriber (Deferred due to complexity)
  - [ ] Video Editor (Deferred due to complexity)


## Medium Priority

- [ ] **Refactor PDF Logic**: Abstract common `pdfjs-dist` and `pdf-lib` logic into reusable hooks or utility functions to reduce code duplication across PDF tools.
- [ ] **Add Unit & Integration Tests**: Implement a testing framework (e.g., Vitest, React Testing Library) and write tests for critical components and hooks.
- [ ] **Expand PDF Converter**: Add more output options like PDF to Word (`.docx`), Excel, etc. This may require a different library or a backend service.
- [x] **Add Confirmation Modals**: Implemented for all tools with reset/delete functionality.

## Low Priority / Future Ideas

- [ ] **Cloud Storage Integration**: Allow users to save/load files from services like Google Drive or Dropbox.
- [ ] **User Settings Page**: Create a page for users to manage their profile, subscription, and application preferences (e.g., default compression level).
- [ ] **Collaborative Tools**: Introduce features that allow multiple users to work on a document simultaneously.
- [ ] **Internationalization (i18n)**: Add support for multiple languages.
- [x] **Performance Optimization**: Profiled and optimized key tools, such as the PDF to Image converter's AI processing. (Ongoing).
- [ ] **API for Developers**: Expose some of the tool functionalities via a public API for developers.