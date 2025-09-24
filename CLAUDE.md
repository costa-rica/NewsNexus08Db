# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NewsNexus08Db is a TypeScript Sequelize-based SQLite database module. It serves as a foundational database layer for the NewsNexus microservices ecosystem, designed to be imported as a dependency by other applications.

## Architecture

### Target Structure (TypeScript Refactor)

- **Entry Point**: `src/index.ts` (compiled to `dist/index.js`)
- **Source Code**: All TypeScript source files in `src/` directory
- **Distribution**: Compiled JavaScript and type declarations in `dist/` directory
- **ORM**: Sequelize with SQLite backend
- **Package Exports**: Both compiled JavaScript and `.d.ts` declaration files for strong typing

### Database Schema

The system manages 25+ interconnected models centered around news article aggregation:

**Core Entities**:

- `Article`: Main news article entity with metadata
- `User`: System users for approval/review workflows
- `State`: US geographic states for filtering
- `Keyword`: Categorization keywords

**Content Management**:

- `ArticleContent`: Full article text storage
- `ArticleApproved`: User approval tracking with PDF customization
- `ArticleReviewed`: Review status tracking
- `ArticleIsRelevant`: Relevance markings

**AI Integration**:

- `ArtificialIntelligence`: AI model definitions
- `EntityWhoCategorizedArticle`: Tracks human vs AI categorization
- `ArticleEntityWhoCategorizedArticleContract`: Junction table with keyword ratings

**Duplicate Detection**:

- `ArticleDuplicateRating`: Multi-algorithm similarity scoring (URL, content hash, embeddings, named entities)

**News Aggregation**:

- `NewsArticleAggregatorSource`: External news sources (APIs/RSS)
- `NewsApiRequest` / `NewsRssRequest`: Request tracking
- `EntityWhoFoundArticle`: Source attribution

**Reporting**:

- `Report`: Generated report containers
- `ArticleReportContract`: Article-to-report relationships

### Key Architectural Patterns

**Centralized Model Management**:

- `src/models/_index.ts`: Central model registry and exports
- `src/models/_connection.ts`: Database connection configuration
- `src/models/_associations.ts`: All model relationships

**Junction Tables**: Extensive use of many-to-many relationships through dedicated contract tables

**Dual Entity Tracking**: System tracks both human users and AI systems for categorization/discovery attribution

## Development Commands

**Setup** (Current project lacks package.json):

```bash
npm init -y
npm install sequelize sqlite3
npm install -D typescript @types/node
```

**TypeScript Build Commands** (To be implemented):

```bash
npm run build     # Compile TypeScript to dist/
npm run dev       # Development mode with watch
```

## Installation as Dependency

```bash
# Install as local file dependency
npm install file:../NewsNexus08Db

# Import in consuming application
import db from '../NewsNexus08Db';
const { Article, User, sequelize } = db;
```

## Environment Configuration

Required environment variables (set by consuming application):

- `PATH_DATABASE`: Directory path for SQLite database file
- `NAME_DB`: Database filename

## TypeScript Refactor Requirements

**Current Status**: Project is in transition from JavaScript (version 7) to TypeScript (version 8)

**Key Objectives**:

1. Convert all `.js` model files to `.ts` with proper typing
2. Implement `src/` source and `dist/` distribution structure
3. Configure `tsconfig.json` with `"declaration": true`
4. Export both compiled JavaScript and `.d.ts` files
5. Maintain backward compatibility for existing consumers

**Reference Code**: Version 7 JavaScript implementations available in `docs/version07referenceCode/`

## Schema Documentation

Comprehensive model descriptions and relationships documented in `docs/DATABASE_SCHEMA_OVERVIEW.md`. Key relationship patterns include complex many-to-many associations, self-referencing relationships for duplicates, and dual tracking of human vs AI interactions.
