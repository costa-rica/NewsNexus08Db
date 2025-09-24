# Database Schema Overview

This document provides a comprehensive overview of the NewsNexus08Db database schema. All tables use SQLite as the underlying database engine and are managed through Sequelize ORM.

## NewsNexus08Db Description

- One class per table (`src/models/<Name>.ts`) with strong typings.
- Centralized initialization and associations.
- Emit `.d.ts` so downstream apps (API, mobile) get type-safe imports.
- dist/ is the output directory for compiled JavaScript files.
- src/ is the source directory for TypeScript files.
- All tables have an updatedAt and createdAt field.

## Database / Project Architecture

### Project Structure

```
NewsNexus08Db/
├── src/                          # TypeScript source files
│   ├── index.ts                  # Main entry point
│   └── models/                   # Sequelize model definitions
│       ├── _connection.ts        # Database connection setup
│       ├── _index.ts            # Model registry and exports
│       ├── _associations.ts     # All model relationships
│       ├── Article.ts           # Core article model
│       ├── User.ts              # User management
│       └── [23 other models...] # Complete model suite
├── dist/                        # Compiled JavaScript output
│   ├── index.js                 # Compiled entry point
│   ├── index.d.ts               # TypeScript declarations
│   └── models/                  # Compiled models with .d.ts files
├── docs/                        # Documentation
└── package.json                 # Project configuration
```

### Entry Point: src/index.ts

```typescript
import db from './models/_index';

export default db;
export * from './models/_index';
```

The main entry point:
- Imports the centralized database object from `models/_index.ts`
- Exports both the default db object and all named exports
- Provides clean API: `import db from 'NewsNexus08Db'` or `import { Article, User } from 'NewsNexus08Db'`

### Core Architecture Files

#### models/_connection.ts

```typescript
import { Sequelize } from 'sequelize';
import * as path from 'path';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.env.PATH_DATABASE || '.', process.env.NAME_DB || 'database.sqlite'),
  logging: false,
});

export default sequelize;
```

**Purpose**: Configures SQLite database connection using environment variables from consuming application.

#### models/_index.ts

**Purpose**: Central model registry that:
- Imports all 25+ model classes
- Exports unified `db` object with all models and sequelize instance
- Loads associations via `import './_associations'`
- Provides both default and named exports for flexible importing

```typescript
const db = {
  sequelize,
  Article,
  User,
  // ... all 25+ models
};

export default db;
export { sequelize, Article, User, /* all models */ };
```

#### models/_associations.ts

**Purpose**: Defines all Sequelize relationships between models:
- 50+ association definitions
- Complex many-to-many relationships via junction tables
- Self-referencing relationships (ArticleDuplicateRating)
- Foreign key constraints and cascading behaviors

**Key Patterns**:
- Junction tables for many-to-many: `ArticleKeywordContract`, `ArticleStateContract`
- Dual entity tracking: User vs AI categorization/discovery
- Hierarchical relationships: Articles → Content, Reviews, Approvals

### Import Pattern

**As npm dependency** (when published):
```typescript
import db from 'newsnexus08db';
const { Article, User, sequelize } = db;

// Or named imports
import { Article, User, sequelize } from 'newsnexus08db';
```

**As local file dependency**:
```typescript
import db from '../NewsNexus08Db';
const { Article, User, sequelize } = db;

// Direct model access
import { Article } from '../NewsNexus08Db';
```

**Usage Example**:
```typescript
import { Article, User, sequelize } from 'newsnexus08db';

// Initialize database
await sequelize.authenticate();

// Create article
const article = await Article.create({
  title: "Breaking News",
  author: "Reporter Name",
  url: "https://example.com/article"
});

// Query with associations
const articles = await Article.findAll({
  include: [User, State]
});
```

### Database Configuration

- **Database Type**: SQLite (via Sequelize ORM)
- **Environment Variables**:
  - `PATH_DATABASE`: Directory path for database file
  - `NAME_DB`: Database filename
- **No .env file required**: Inherits environment from importing application

## Tables

### Core Entity Tables

#### Articles
Main news article storage with metadata.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique article identifier |
| publicationName | STRING | NULLABLE | News source name |
| author | STRING | NULLABLE | Article author |
| title | STRING | NULLABLE | Article headline |
| description | STRING | NULLABLE | Article summary |
| url | STRING | NULLABLE | Original article URL |
| urlToImage | STRING | NULLABLE | Featured image URL |
| publishedDate | DATEONLY | NULLABLE | Publication date |
| entityWhoFoundArticleId | INTEGER | FK, NULLABLE | Reference to discovery source |
| newsApiRequestId | INTEGER | FK, NULLABLE | Reference to NewsAPI request |
| newsRssRequestId | INTEGER | FK, NULLABLE | Reference to RSS request |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

#### Users
System users for approval/review workflows.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| username | STRING | NOT NULL | User login name |
| email | STRING | NOT NULL | User email address |
| password | STRING | NOT NULL | Hashed password |
| isAdmin | BOOLEAN | DEFAULT false | Admin privileges flag |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

#### States
US geographic states for filtering.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique state identifier |
| name | STRING | NOT NULL | Full state name |
| abbreviation | STRING | NOT NULL | Two-letter state code |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

#### Keywords
Categorization keywords for article tagging.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique keyword identifier |
| keyword | STRING | NOT NULL | Keyword text |
| category | STRING | NULLABLE | Keyword category/group |
| isArchived | BOOLEAN | DEFAULT false | Archived status flag |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

### Content Management Tables

#### ArticleContents
Full article text storage separate from metadata.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique content identifier |
| articleId | INTEGER | FK, NOT NULL | Reference to Article |
| content | STRING | NOT NULL | Full article text |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

#### Reports
Generated report containers for client delivery.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique report identifier |
| dateSubmittedToClient | DATE | NULLABLE | Client delivery timestamp |
| nameCrFormat | STRING | NULLABLE | CR format filename |
| nameZipFile | STRING | NULLABLE | ZIP archive filename |
| userId | INTEGER | FK, NOT NULL | Report creator reference |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

### AI Integration Tables

#### ArtificialIntelligences
AI model definitions for categorization tracking.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique AI model identifier |
| name | STRING | NOT NULL | Model display name |
| description | STRING | NULLABLE | Model description |
| huggingFaceModelName | STRING | NULLABLE | HuggingFace model identifier |
| huggingFaceModelType | STRING | NULLABLE | Model type classification |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

#### EntityWhoCategorizedArticles
Tracks whether human or AI performed categorization.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique entity identifier |
| userId | INTEGER | FK, NULLABLE | Human categorizer reference |
| artificialIntelligenceId | INTEGER | FK, NULLABLE | AI model reference |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

**Note**: Either `userId` OR `artificialIntelligenceId` should be set, not both.

### Duplicate Detection Tables

#### ArticleDuplicateRatings
Multi-algorithm similarity scoring for duplicate detection.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique rating identifier |
| articleIdNew | INTEGER | FK, NOT NULL | New article being evaluated |
| articleIdApproved | INTEGER | FK, NOT NULL | Approved article to compare against |
| urlCheck | FLOAT | 0-1 range, NULLABLE | URL similarity score |
| contentHash | FLOAT | 0-1 range, NULLABLE | Text hash similarity |
| embeddingSearch | FLOAT | 0-1 range, NULLABLE | Semantic embedding similarity |
| signatureMatchDate | FLOAT | 0-1 range, NULLABLE | Date proximity score |
| signatureMatchState | FLOAT | 0-1 range, NULLABLE | Geographic state match |
| signatureMatchProduct | FLOAT | 0-1 range, NULLABLE | Product/entity match |
| signatureMatchHazard | FLOAT | 0-1 range, NULLABLE | Hazard/risk match |
| signatureMatchPlace | FLOAT | 0-1 range, NULLABLE | Location/place match |
| signatureMatchPeople | FLOAT | 0-1 range, NULLABLE | Named person match |
| score | FLOAT | 0-1 range, NULLABLE | Unweighted composite score |
| scoreWeighted | FLOAT | 0-1 range, NULLABLE | Weighted composite score |
| createdAt | DATE | NOT NULL | Timestamp |
| updatedAt | DATE | NOT NULL | Timestamp |

**Indexes**: Unique constraint on `(articleIdNew, articleIdApproved)` plus individual field indexes.

### Junction/Contract Tables

The system uses extensive many-to-many relationships via dedicated junction tables:

- **ArticleStateContract**: Articles ↔ States
- **ArticleKeywordContract**: Articles ↔ Keywords
- **ArticleReportContract**: Articles ↔ Reports
- **ArticleEntityWhoCategorizedArticleContract**: Articles ↔ Categorization entities with keyword ratings
- **NewsApiRequestWebsiteDomainContract**: NewsAPI requests ↔ Website domains
- **NewsArticleAggregatorSourceStateContract**: News sources ↔ States

*All junction tables include `id`, `createdAt`, `updatedAt` plus foreign keys to linked entities.*

## Associations / Relationships

### Core Entity Relationships

#### Article Relationships
Central hub connecting to most other entities:

| Relationship | Target Entity | Type | Foreign Key | Description |
|-------------|---------------|------|-------------|-------------|
| Article → ArticleContent | ArticleContent | One-to-Many | articleId | Full text storage |
| Article → ArticleStateContract | ArticleStateContract | One-to-Many | articleId | State associations |
| Article → ArticleKeywordContract | ArticleKeywordContract | One-to-Many | articleId | Keyword tagging |
| Article → ArticleReportContract | ArticleReportContract | One-to-Many | articleId | Report inclusion |
| Article → ArticleReviewed | ArticleReviewed | One-to-Many | articleId | Review tracking |
| Article → ArticleApproved | ArticleApproved | One-to-Many | articleId | Approval tracking |
| Article → ArticleIsRelevant | ArticleIsRelevant | One-to-Many | articleId | Relevance marking |
| Article → EntityWhoFoundArticle | EntityWhoFoundArticle | Many-to-One | entityWhoFoundArticleId | Discovery attribution |
| Article → NewsApiRequest | NewsApiRequest | Many-to-One | newsApiRequestId | NewsAPI source |
| Article → NewsRssRequest | NewsRssRequest | Many-to-One | newsRssRequestId | RSS source |

#### User Relationships
User entity connects to multiple workflow tracking tables:

| Relationship | Target Entity | Type | Foreign Key | Description |
|-------------|---------------|------|-------------|-------------|
| User → EntityWhoCategorizedArticle | EntityWhoCategorizedArticle | One-to-Many | userId | Human categorization |
| User → EntityWhoFoundArticle | EntityWhoFoundArticle | One-to-Many | userId | Human discovery |
| User → Report | Report | One-to-Many | userId | Report creation |
| User → ArticleReviewed | ArticleReviewed | One-to-Many | userId | Review actions |
| User → ArticleApproved | ArticleApproved | One-to-Many | userId | Approval actions |
| User → ArticleIsRelevant | ArticleIsRelevant | One-to-Many | userId | Relevance decisions |

### Many-to-Many Relationships

#### Article ↔ State (via ArticleStateContract)
Articles can be associated with multiple states, states can have multiple articles:

```typescript
Article.belongsToMany(State, {
  through: ArticleStateContract,
  foreignKey: 'articleId',
});
State.belongsToMany(Article, {
  through: ArticleStateContract,
  foreignKey: 'stateId',
});
```

#### Article ↔ EntityWhoCategorizedArticle (via ArticleEntityWhoCategorizedArticleContract)
Complex many-to-many with additional rating data in junction table:

```typescript
Article.hasMany(ArticleEntityWhoCategorizedArticleContract, {
  foreignKey: 'articleId',
});
EntityWhoCategorizedArticle.hasMany(ArticleEntityWhoCategorizedArticleContract, {
  foreignKey: 'entityWhoCategorizesId',
});
```

#### NewsApiRequest ↔ WebsiteDomain (via NewsApiRequestWebsiteDomainContract)
API requests can target multiple domains:

```typescript
NewsApiRequest.belongsToMany(WebsiteDomain, {
  through: NewsApiRequestWebsiteDomainContract,
  foreignKey: 'newsApiRequestId',
});
```

### AI Integration Relationships

#### Dual Entity Tracking Pattern
The system tracks both human users and AI systems for categorization/discovery:

```
EntityWhoCategorizedArticle
├── User (userId) - Human categorizer
└── ArtificialIntelligence (artificialIntelligenceId) - AI model

EntityWhoFoundArticle
├── User (userId) - Human discovery
└── NewsArticleAggregatorSource (newsArticleAggregatorSourceId) - Automated source
```

### Self-Referencing Relationships

#### ArticleDuplicateRating
Self-referencing relationship comparing articles against each other:

```typescript
// Article has many duplicate ratings as "new" article
Article.hasMany(ArticleDuplicateRating, {
  as: 'NewDuplicates',
  foreignKey: 'articleIdNew',
});

// Article has many duplicate ratings as "approved" comparison
Article.hasMany(ArticleDuplicateRating, {
  as: 'ApprovedDuplicates',
  foreignKey: 'articleIdApproved',
});

// Reverse relationships
ArticleDuplicateRating.belongsTo(Article, {
  as: 'NewArticle',
  foreignKey: 'articleIdNew',
});
ArticleDuplicateRating.belongsTo(Article, {
  as: 'ApprovedArticle',
  foreignKey: 'articleIdApproved',
});
```

### News Aggregation Relationships

#### NewsArticleAggregatorSource Hub
Central source management connecting to requests and geographical targeting:

```
NewsArticleAggregatorSource
├── NewsApiRequest (One-to-Many)
├── NewsRssRequest (One-to-Many)
├── EntityWhoFoundArticle (One-to-One)
└── NewsArticleAggregatorSourceStateContract → State (Many-to-Many)
```

### Workflow Tracking Pattern

Multiple tables follow the same pattern for tracking user actions on articles:

- **ArticleReviewed**: User review status
- **ArticleApproved**: User approval with PDF customization
- **ArticleIsRelevant**: User relevance marking

Each connects:
- User (userId) - Who performed the action
- Article (articleId) - Which article was affected
- Plus action-specific metadata fields

### Complete Relationship Summary

**Total Associations**: 50+ Sequelize relationship definitions in `_associations.ts`

**Key Patterns**:
1. **Hub-and-Spoke**: Article as central entity connecting to specialized tables
2. **Junction Tables**: Extensive many-to-many relationships via contract tables
3. **Dual Tracking**: Human vs AI entity attribution
4. **Workflow States**: Multiple user action tracking tables per article
5. **Self-Reference**: Articles comparing against other articles for duplicates
6. **Hierarchical**: Reports containing articles, sources managing requests

**Cascade Behavior**: Foreign keys maintain referential integrity with appropriate cascade settings for data consistency.
