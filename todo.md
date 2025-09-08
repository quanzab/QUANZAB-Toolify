# Project To-Do List

This document tracks planned features, enhancements, and bug fixes for the QUANZAB Toolkit application.

## High Priority

- [x] **Implement User Authentication**: Set up a user login/signup system to support premium features and personalized experiences. (Mock implementation using localStorage).
- [x] **Activate Premium Features**: Gate premium tools (`PDF Sign`, `AI Document Analyzer`, etc.) behind the authentication system.
- [x] **PDF Sign Tool - Interactivity**: Implement the drag, drop, and resize functionality for signatures and text boxes on the PDF pages.
- [ ] **Improve Error Handling**: Provide more specific user feedback for errors, especially for PDF processing (e.g., handling encrypted/corrupt files) and API calls.
- [ ] **Enhance Accessibility**: Conduct a full accessibility audit. Add necessary ARIA attributes, ensure keyboard navigability, and check color contrast.
- [ ] **Complete "Coming Soon" Tools**: Build the tools that are currently placeholders, such as an AI Presentation Generator or advanced data analysis tools.

## Medium Priority

- [ ] **Refactor PDF Logic**: Abstract common `pdfjs-dist` and `pdf-lib` logic into reusable hooks or utility functions to reduce code duplication across PDF tools.
- [ ] **Add Unit & Integration Tests**: Implement a testing framework (e.g., Vitest, React Testing Library) and write tests for critical components and hooks.
- [ ] **Expand PDF Converter**: Add more output options like PDF to Word (`.docx`), Excel, etc. This may require a different library or a backend service.
- [x] **Add Confirmation Modals**: Implement "Are you sure?" modals for destructive actions like deleting a task or resetting a tool's state.

## Recently Added

- [x] **AI Content Generator**: New tool to generate various types of content from a text prompt.

## Low Priority / Future Ideas

- [ ] **Cloud Storage Integration**: Allow users to save/load files from services like Google Drive or Dropbox.
- [ ] **User Settings Page**: Create a page for users to manage their profile, subscription, and application preferences (e.g., default compression level).
- [ ] **Collaborative Tools**: Introduce features that allow multiple users to work on a document simultaneously.
- [ ] **Internationalization (i18n)**: Add support for multiple languages.
- [ ] **Performance Optimization**: Profile the application to identify and fix performance bottlenecks, especially in the PDF rendering and processing tools.
- [ ] **API for Developers**: Expose some of the tool functionalities via a public API for developers.