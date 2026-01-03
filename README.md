# App-Forge

AI-powered job application generator - a privacy-first desktop application that helps you create personalized CVs and cover letters tailored to specific job descriptions.

## Overview

App-Forge processes your profile data from various document formats and uses AI to generate customized CVs and cover letters for each job application. All processing happens locally on your machine - your data never leaves your computer except for the LLM API calls during generation.

## Features

- **Document Processing**: Upload your CV, project descriptions, and personal information in any format (PDF, Word, text)
- **AI-Powered Extraction**: Automatically extracts structured profile data from unstructured documents
- **Personalized Generation**: Creates tailored CVs and cover letters based on your profile and job descriptions
- **Privacy-First**: All data stored locally, no external servers
- **Cross-Platform**: Runs on Linux, Windows, and macOS

## Tech Stack

- **Frontend**: React + TypeScript + LangChain.js
- **Backend**: Rust (Tauri framework)
- **LLM**: OpenAI API via LangChain.js
- **Storage**: Local JSON files or SQLite

## Architecture

App-Forge is built with Tauri, which provides a native desktop application wrapper around a React frontend. The Rust backend handles file operations and system integration, while the React frontend manages the UI and LLM orchestration via LangChain.js.

For detailed architecture and implementation details, see [specification.md](specification.md).

## Development Status

🚧 **In Development** - Project setup and initial architecture complete. Implementation in progress.

## Setup

*(Setup instructions will be added as development progresses)*

## Usage

*(Usage instructions will be added as development progresses)*

## Privacy

- All data stored locally on your machine
- Only sends data to OpenAI API during document generation
- No telemetry or usage tracking
- Open source - code can be audited

## License

*(To be determined)*

