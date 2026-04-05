# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.0.1.0] - 2026-04-05

### Added
- Login middleware architecture with Edge runtime compatibility (`src/middleware.ts`)
- Unified `useAuth` hook for authentication state management (`src/hooks/useAuth.ts`)
- Session provider wrapper in root layout for NextAuth v5 context

### Changed
- Updated login page to use new `useAuth` hook with loading states and error handling
- Refactored `auth.ts` exports for NextAuth v5 compatibility

### Fixed
- Corrected GitHub Actions workflow action name (`vercel/actions-deploy`)

## [0.0.0.0] - 2026-04-05

### Added
- Initial project setup
