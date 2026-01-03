# App-Forge Technical Specification

## Project Overview

**App-Forge** is an AI-powered job application generator that helps users create personalized CVs and cover letters by processing their profile data and job descriptions. The application is built as a privacy-first local desktop application using modern web technologies wrapped in a native desktop framework.

### Purpose
- Generate personalized CVs and cover letters tailored to specific job descriptions
- Process user profile data from various document formats (PDF, Word, text)
- Maintain user privacy by keeping all data local
- Demonstrate LLM integration and desktop application development skills

### Key Principles
- **Privacy-first**: All data stays on the user's machine
- **Local-first**: No web server, runs as native desktop application
- **Flexible input**: Accepts unstructured documents, LLM extracts structure
- **Efficient**: Process documents once, generate multiple applications

## Architecture

### Technology Stack

#### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **LangChain.js** - LLM orchestration and prompt management
- **Modern CSS** - Styling (Tailwind CSS or similar)

#### Backend
- **Rust** - System programming, file I/O, document processing
- **Tauri** - Desktop application framework
- **SQLite** (optional) - Local data storage

#### LLM Integration
- **OpenAI API** - Primary LLM provider (via LangChain.js)
- **LangChain.js** - Handles prompt templates, chains, and API calls

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Desktop Window                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │         React + TypeScript Frontend               │  │
│  │  - Document upload UI                              │  │
│  │  - Profile management                              │  │
│  │  - Job description input                           │  │
│  │  - Generated document preview                     │  │
│  │  - LangChain.js (LLM orchestration)               │  │
│  └───────────────────────────────────────────────────┘  │
│                      ↕ IPC                              │
│  ┌───────────────────────────────────────────────────┘  │
│  │         Rust Backend (Tauri)                        │  │
│  │  - File system operations                          │  │
│  │  - Document loading (PDF, Word, text)               │  │
│  │  - Profile storage (JSON/SQLite)                   │  │
│  │  - System integration (file pickers, etc.)         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
                    OpenAI API
              (via LangChain.js)
```

### Data Flow

#### Phase 1: Profile Building (One-Time)
1. User uploads documents (CV, project descriptions, about me)
2. Rust backend loads files and extracts text
3. Text sent to React frontend
4. LangChain.js processes text and extracts structured profile
5. Profile stored locally via Rust backend (JSON or SQLite)

#### Phase 2: Document Generation (Per Application)
1. User enters job description
2. Frontend loads stored profile via Rust backend
3. LangChain.js combines profile + job description + templates
4. LLM generates personalized CV and cover letter
5. Generated documents saved via Rust backend

## Core Features

### 1. Profile Building
- **Input**: Documents (PDF, Word, text files) containing:
  - Past CV/resume
  - Project descriptions
  - About me paragraph
- **Processing**: 
  - Document loading (Rust backend)
  - Text extraction
  - LLM extraction of structured profile data
- **Output**: Stored profile (JSON structure)
- **Storage**: Local file system (managed by Rust)

### 2. Document Generation
- **Input**: 
  - Stored user profile
  - Job description (new per application)
  - CV template
  - Cover letter template
- **Processing**:
  - LangChain.js chains for matching profile to job
  - LLM generation of personalized content
- **Output**: 
  - Tailored CV (formatted text/markdown)
  - Tailored cover letter (formatted text/markdown)

### 3. Profile Management
- View current profile
- Update profile (re-upload documents or edit directly)
- Profile completeness indicator

## Technical Decisions

### Why Tauri over Electron?
- **Smaller bundle size**: ~10MB vs ~100MB+ for Electron
- **Rust backend**: Better performance, memory safety, system integration
- **Better security**: Smaller attack surface
- **Cross-platform**: Builds for Linux, Windows, macOS

### Why LangChain.js in Frontend?
- **Full LangChain features**: Chains, agents, prompt templates
- **Uses existing skills**: JavaScript/TypeScript knowledge
- **API calls from frontend**: Acceptable for local app (data only sent during generation)
- **Simpler architecture**: No need for Python backend process

### Why Local-First?
- **Privacy**: Sensitive personal data (CV, work history) stays on user's machine
- **No server costs**: No hosting required
- **Offline capable**: Can work without internet (except for LLM API calls)
- **User control**: Users own their data completely

### Why Flexible Input Format?
- **User-friendly**: No need for rigid JSON schemas
- **LLM capability**: LLMs excel at extracting structure from unstructured text
- **Industry-agnostic**: Works for tech, nursing, or any field
- **Natural workflow**: Users can paste existing documents

## Implementation Phases

### Week 1: Foundation
- Tauri project setup
- Rust backend basics (file I/O, document loading)
- React frontend setup
- Basic UI structure
- Document upload functionality

### Week 2: LLM Integration
- LangChain.js setup and configuration
- Profile extraction from documents
- Profile storage system
- Basic prompt templates

### Week 3: Generation & Polish
- CV generation pipeline
- Cover letter generation pipeline
- Document formatting and export
- UI polish and error handling
- Testing and refinement

## File Structure

```
app-forge/
├── CHAT-RECORDS.md          # Chat record instructions
├── README.md                # Project overview
├── specification.md          # This file
├── .gitignore
├── package.json             # Node.js dependencies
├── tsconfig.json            # TypeScript config
├── src/                     # React frontend
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── DocumentUpload.tsx
│   │   ├── ProfileView.tsx
│   │   ├── JobInput.tsx
│   │   └── DocumentPreview.tsx
│   ├── services/
│   │   └── langchain.ts     # LangChain.js setup
│   └── types/
│       └── profile.ts        # TypeScript types
└── src-tauri/               # Rust backend
    ├── Cargo.toml
    ├── tauri.conf.json
    └── src/
        ├── main.rs           # Tauri commands
        ├── file_ops.rs       # File operations
        └── document.rs       # Document loading
```

## Data Models

### User Profile (JSON Structure)
```typescript
interface UserProfile {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  workExperience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year?: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
  aboutMe?: string;
  certifications?: string[];
  // Flexible structure - LLM extracts what's available
}
```

## Security & Privacy

- **API Keys**: Stored locally, encrypted at rest (Tauri secure storage)
- **Data Storage**: All files stored locally, never uploaded to external servers
- **API Calls**: Only profile data and job descriptions sent to OpenAI during generation
- **No Telemetry**: No usage tracking or analytics
- **Open Source**: Code can be audited for privacy compliance

## Cross-Platform Support

- **Linux**: `.AppImage`, `.deb`, or `.rpm` packages
- **Windows**: `.exe` or `.msi` installer
- **macOS**: `.app` bundle or `.dmg`

Build process uses Tauri's cross-platform build system. Development can be done on any platform, with builds for other platforms generated as needed.

## Future Enhancements (Post-MVP)

- Profile completeness checker (analyze example job descriptions)
- Multiple template options
- Export to PDF/Word formats
- Version history for generated documents
- Batch generation for multiple jobs
- Integration with job search APIs

## Success Criteria

- Successfully extracts profile from unstructured documents
- Generates coherent, personalized CVs and cover letters
- All data remains local (privacy maintained)
- Cross-platform builds work correctly
- Demonstrates LangChain.js and Tauri skills
- Useful for actual job applications

