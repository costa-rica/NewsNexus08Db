# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NewsNexus07Db is a Sequelize-based SQLite database module designed as a foundational component for a news aggregation platform. It serves as a shared database layer that can be imported as a dependency by other applications in the NewsNexus microservices ecosystem.

## Architecture

### Database Layer Architecture

- **ORM**: Sequelize with SQLite backend
- **Pattern**: Single entry point (`index.js`) exports everything from `models/_index.js`
- **Models**: 25 database models in individual files under `models/` directory
- **Associations**: Centralized relationship definitions in `models/_associations.js`
- **Connection**: Single database configuration in `models/_connection.js`

### Key Components

- **Core Models**: Articles, Users, States, Keywords, NewsApiSources, RssApiSources
- **Content Management**: ArticleContent, ArticleReview, ArticleApproval, ArticleStateArticle
- **AI Integration**: ArtificialIntelligenceModel for tracking AI categorization
- **Duplicate Detection**: ArticleDuplicateRating with sophisticated similarity metrics
- **Reporting**: Report and ReportArticle for generated content

## Development Setup

The project currently lacks package.json. To set up for development:

```bash
npm init -y
npm add sequelize sqlite3
```

## Environment Configuration

The database connection requires these environment variables to be set by the consuming application:

- `PATH_DATABASE`: Directory path for the SQLite database file
- `NAME_DB`: Database filename

## Usage as Dependency

To use this module in another project:

```bash
# Install as local dependency
npm add file:../NewsNexus07Db

# In consuming application
const db = require("../NewsNexus07Db");
const { Article, User, sequelize } = db;
```

## Database Schema

Comprehensive schema documentation is maintained in `docs/modelsDescriptions.md`. Key relationships include:

- Complex many-to-many relationships through junction tables
- Self-referencing relationships (Article duplicates)
- User tracking for approvals, reviews, and categorization
- AI vs Human categorization tracking

## Current Development Status

- **Missing**: package.json, testing infrastructure, build system
- **Planned Refactor**: Full TypeScript conversion with `src/` and `dist/` structure
- **Incomplete Documentation**: ArticleDuplicateRating model description needs completion

## File Structure Notes

- `models/_index.js`: Central model registry and barrel exports
- `models/_connection.js`: Database connection configuration
- `models/_associations.js`: All model relationships defined here
- Individual model files follow consistent Sequelize patterns
- No build step required - direct Node.js module consumption
