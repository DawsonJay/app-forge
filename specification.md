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
5. LLM detects conflicts for unique fields
6. If conflicts exist: User resolves them in UI
7. Profile (with resolved conflicts) stored locally via Rust backend (JSON or SQLite)

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

### 4. Conflict Detection & Resolution

When multiple documents are uploaded, the LLM may extract conflicting information for fields that should have only one value. The system detects these conflicts and requires user resolution before profile creation.

#### Conflict Detection
- **Detection Method**: LLM identifies conflicts during profile extraction
- **Trigger Fields** (fields that must have single values):
  - `personalInfo.name`
  - `personalInfo.email`
  - `personalInfo.phone`
  - `personalInfo.location`
  - `personalInfo.dateOfBirth` (if present)
  - `workExperience` - overlapping date ranges with different companies/roles
  - `education` - same degree/institution with different years
- **Non-Conflict Fields** (can have multiple values, will be merged):
  - `skills` - merged and deduplicated
  - `projects` - all included
  - `certifications` - all included
  - `aboutMe` - merged or most detailed version used

#### Conflict Data Model
```typescript
interface Conflict {
  id: string;
  type: 'personal_info' | 'work_experience' | 'education' | 'date_overlap';
  field: string; // e.g., 'name', 'email', 'work_experience.march_2025'
  conflictingValues: Array<{
    value: any;
    source: string; // Document filename
  }>;
  description: string; // Human-readable conflict description
}

interface ConflictResolution {
  conflictId: string;
  resolvedValue: any;
  resolutionMethod: 'selected' | 'manual';
  source?: string; // Which document value was selected
}

interface ExtractedProfileWithConflicts {
  profile: UserProfile;
  conflicts: Conflict[];
}
```

#### LLM Extraction Output
The LLM extraction service must return both the extracted profile and detected conflicts:
- Extract profile structure from all documents
- For each unique field, check if multiple documents have different values
- If conflicts found, create conflict objects with:
  - All conflicting values
  - Source document filename for each value
  - Clear, human-readable description
- Return: `{ profile: UserProfile, conflicts: Conflict[] }`

#### User Resolution Flow
1. After profile extraction, if conflicts exist:
   - Display extracted profile (with conflicted fields highlighted)
   - Show conflict resolution section below profile
   - Disable "Next" button until all conflicts resolved
2. User resolves each conflict:
   - See all conflicting values with source documents
   - Select which value to keep (radio buttons)
   - OR manually enter custom value
3. Once all conflicts resolved:
   - "Next" button enabled
   - Profile saved with resolved values
   - User can proceed to next step
4. If no conflicts detected:
   - Profile displayed normally
   - User can proceed immediately

#### UI Requirements
- **Conflict Resolution Component**: Separate section below profile information
- **Visual Indicators**: Conflicted fields highlighted in profile display
- **Resolution Interface**: 
  - List of all conflicts
  - For each conflict: show all values with source documents
  - Radio buttons to select resolution
  - Option for manual/custom value entry
  - Progress indicator: "X of Y conflicts resolved"
- **Blocking Behavior**: Cannot create profile or proceed to next step until all conflicts resolved
- **No Partial Resolution**: All conflicts must be resolved before saving

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

## Current Implementation Plan

We are currently implementing **Stage 1: Profile Builder**. This stage focuses on:
1. Setting up the Tauri desktop application structure
2. Creating the React frontend with TypeScript
3. Building Rust backend for file operations
4. Implementing document upload and text extraction
5. Integrating LangChain.js for AI-powered profile extraction
6. Creating profile storage system

The implementation follows a component-based approach:
- **Frontend**: React components with TypeScript for type safety
- **Backend**: Rust commands exposed via Tauri IPC
- **Communication**: Frontend calls Rust backend via `invoke()` for file operations
- **LLM**: LangChain.js runs in the frontend, calling OpenAI API directly

## Implementation Phases

### Stage 1: Foundation & Profile Builder (Current)
**Status**: In Progress

#### Phase 1.1: Project Setup
- ✅ Project architecture and specification
- 🔄 Tauri project initialization
- 🔄 React + TypeScript frontend setup
- 🔄 Rust backend structure
- 🔄 Tailwind CSS configuration
- 🔄 Development environment setup

#### Phase 1.2: Basic File Operations
- ⏳ Rust backend file I/O commands
- ⏳ Tauri IPC communication setup
- ⏳ File picker integration
- ⏳ Basic text file loading

#### Phase 1.3: Document Processing
- ⏳ PDF text extraction (Rust backend)
- ⏳ Word document parsing (Rust backend)
- ⏳ Text file handling
- ⏳ Document text extraction pipeline

#### Phase 1.4: Profile Builder UI
- ⏳ Document upload component
- ⏳ Extracted text preview
- ⏳ Profile extraction trigger
- ⏳ Profile display component
- ⏳ Conflict resolution component
- ⏳ Conflict highlighting in profile display
- ⏳ Loading states and error handling

#### Phase 1.5: LLM Integration
- ⏳ LangChain.js setup and configuration
- ⏳ OpenAI API integration
- ⏳ Profile extraction prompt templates
- ⏳ Conflict detection in extraction prompt
- ⏳ Structured output with conflicts array
- ⏳ Structured output parsing
- ⏳ Error handling for API calls

#### Phase 1.6: Profile Storage
- ⏳ Profile save/load functionality (Rust backend)
- ⏳ JSON serialization/deserialization
- ⏳ Local file storage management
- ⏳ Profile validation

### Stage 2: Document Generation
**Status**: Planned

- Job description input UI
- Profile loading and display
- LangChain.js generation chains
- CV template system
- Cover letter template system
- Document preview component
- Export functionality

### Stage 3: Polish & Testing
**Status**: Planned

- UI/UX improvements
- Comprehensive error handling
- Loading states and user feedback
- Cross-platform testing
- Performance optimization
- Documentation and user guides

## File Structure

```
app-forge/
├── CHAT-RECORDS.md          # Chat record instructions
├── README.md                # Project overview
├── specification.md          # This file
├── .gitignore
├── package.json             # Node.js dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── index.html               # HTML entry point
├── src/                     # React frontend
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles (Tailwind)
│   ├── components/
│   │   ├── ProfileBuilder.tsx  # Profile builder (Stage 1)
│   │   ├── DocumentUpload.tsx  # Document upload UI
│   │   ├── ProfileView.tsx     # Profile display
│   │   ├── ConflictResolution.tsx  # Conflict resolution UI
│   │   ├── JobInput.tsx        # Job description input (Stage 2)
│   │   └── DocumentPreview.tsx # Generated doc preview (Stage 2)
│   ├── services/
│   │   └── langchain.ts     # LangChain.js setup & profile extraction
│   └── types/
│       └── profile.ts        # TypeScript types (UserProfile interface)
└── src-tauri/               # Rust backend
    ├── Cargo.toml           # Rust dependencies
    ├── tauri.conf.json      # Tauri configuration
    ├── build.rs             # Build script
    └── src/
        ├── main.rs          # Tauri commands & app entry
        ├── file_ops.rs      # File operations (save/load)
        └── document.rs      # Document loading & text extraction
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

### Conflict Detection Types
```typescript
interface Conflict {
  id: string;
  type: 'personal_info' | 'work_experience' | 'education' | 'date_overlap';
  field: string; // e.g., 'name', 'email', 'work_experience.march_2025'
  conflictingValues: Array<{
    value: any;
    source: string; // Document filename
  }>;
  description: string; // Human-readable conflict description
}

interface ConflictResolution {
  conflictId: string;
  resolvedValue: any;
  resolutionMethod: 'selected' | 'manual';
  source?: string; // Which document value was selected
}

interface ExtractedProfileWithConflicts {
  profile: UserProfile;
  conflicts: Conflict[];
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

