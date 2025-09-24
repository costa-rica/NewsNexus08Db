# Database Schema Overview (version 07)

This document provides detailed schema descriptions for all database tables (models) in the NewsNexus07Db system.

## Database / Project Architecture

### Project Structure

```
NewsNexus07Db/
├── index.js                     # Entry point - exports complete database module
├── package.json                 # Dependencies: sequelize, sqlite3
├── docs/
│   ├── images/
│   └── DATABASE_SCHEMA_OVERVIEW_07.md    # This file
├── models/                      # Database models directory
│   ├── _index.js               # Central model registry and exports
│   ├── _connection.js          # Database connection configuration
│   ├── _associations.js        # All model relationships/associations
│   ├── Article.js              # Individual model files
│   ├── User.js                 # (23 total model files)
│   └── ... (other models)
└── node_modules/               # Installed dependencies
```

### Entry Point: index.js

The `index.js` file at the project root serves as the main entry point for the entire database module. It simply exports the complete database configuration from `models/_index.js`:

```js
const db = require("./models/_index");
module.exports = db;
```

This allows other applications to import the entire database module with:

```js
const db = require("../NewsNexus07Db");
// or via package manager: npm install file:../NewsNexus07Db
```

### Core Architecture Files

#### models/\_connection.js

**Purpose**: Database connection configuration

- Creates Sequelize instance for SQLite database
- Uses environment variables `PATH_DATABASE` and `NAME_DB` for database location
- Configures connection settings (logging disabled)
- Exports the sequelize connection object

```js
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: path.join(process.env.PATH_DATABASE, process.env.NAME_DB),
	logging: false,
});
```

#### models/\_index.js

**Purpose**: Central model registry and module exports

- Imports the database connection from `_connection.js`
- Imports all 23 individual model files
- Exports all models and the sequelize connection in a single object
- Loads associations by requiring `_associations.js` at the end

This file acts as the central hub that:

1. Collects all models into one exportable object
2. Ensures associations are loaded after all models are defined
3. Provides a clean interface for importing specific models

#### models/\_associations.js

**Purpose**: Centralized relationship definitions

- Defines all Sequelize associations between models
- Uses hasMany, belongsTo, hasOne, and belongsToMany relationships
- Creates junction table relationships for many-to-many associations
- Must be loaded after all models are defined (hence the require at end of `_index.js`)

**Key Association Patterns**:

- User → Many (ArticleApproved, ArticleReviewed, etc.)
- Article → Many States (through ArticleStateContract)
- Article → Many Keywords (through ArticleKeywordContract)
- AI/Human categorization tracking through EntityWhoCategorizedArticle

### Import Pattern

The architecture supports both full module import and selective imports:

```js
// Full module import
const db = require("../NewsNexus07Db");
const { Article, User, sequelize } = db;

// Selective import (example from README)
const {
	NewsArticleAggregatorSource,
} = require("./NewsArticleAggregatorSource");
```

### Database Configuration

- **Database Type**: SQLite (via Sequelize ORM)
- **Environment Variables**:
  - `PATH_DATABASE`: Directory path for database file
  - `NAME_DB`: Database filename
- **No .env file required**: Inherits environment from importing application

## Article

Core entity for news articles.

| Field                   | Type     | Constraints                 | Description                        |
| ----------------------- | -------- | --------------------------- | ---------------------------------- |
| id                      | INTEGER  | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                  |
| publicationName         | STRING   |                             | Name of the publication            |
| author                  | STRING   |                             | Article author                     |
| title                   | STRING   |                             | Article title                      |
| description             | STRING   |                             | Article description/summary        |
| url                     | STRING   |                             | Original article URL               |
| urlToImage              | STRING   |                             | URL to article image               |
| publishedDate           | DATEONLY |                             | Date article was published         |
| entityWhoFoundArticleId | INTEGER  | FOREIGN KEY                 | Reference to EntityWhoFoundArticle |
| newsApiRequestId        | INTEGER  | FOREIGN KEY                 | Reference to NewsApiRequest        |
| newsRssRequestId        | INTEGER  | FOREIGN KEY                 | Reference to NewsRssRequest        |

## ArticleApproved

Tracks user approval status for articles.

| Field                       | Type     | Constraints                 | Description                             |
| --------------------------- | -------- | --------------------------- | --------------------------------------- |
| id                          | INTEGER  | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                       |
| userId                      | INTEGER  | NOT NULL, FOREIGN KEY       | Reference to User                       |
| articleId                   | INTEGER  | NOT NULL, FOREIGN KEY       | Reference to Article                    |
| isApproved                  | BOOLEAN  | DEFAULT true                | Approval status                         |
| headlineForPdfReport        | STRING   |                             | Custom headline for PDF reports         |
| publicationNameForPdfReport | STRING   |                             | Custom publication name for PDF reports |
| publicationDateForPdfReport | DATEONLY |                             | Custom publication date for PDF reports |
| textForPdfReport            | STRING   |                             | Custom text content for PDF reports     |
| urlForPdfReport             | STRING   |                             | Custom URL for PDF reports              |
| kmNotes                     | STRING   |                             | Knowledge management notes              |

## ArticleContent

Stores full article content.

| Field     | Type    | Constraints                 | Description          |
| --------- | ------- | --------------------------- | -------------------- |
| id        | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier    |
| articleId | INTEGER | NOT NULL, FOREIGN KEY       | Reference to Article |
| content   | STRING  | NOT NULL                    | Full article content |

## ArticleDuplicateRating

Stores similarity metrics calculated by the NewsNexusDeduper microservice to identify duplicate articles. Used to compare new articles against already-approved articles using multiple detection algorithms.

| Field                 | Type    | Constraints                 | Description                                      |
| --------------------- | ------- | --------------------------- | ------------------------------------------------ |
| id                    | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                                |
| articleIdNew          | INTEGER | NOT NULL, FOREIGN KEY       | Reference to new Article being evaluated         |
| articleIdApproved     | INTEGER | NOT NULL, FOREIGN KEY       | Reference to already-approved Article to compare |
| urlCheck              | FLOAT   | 0-1 range, NULLABLE         | Canonical URL exact/near match score             |
| contentHash           | FLOAT   | 0-1 range, NULLABLE         | Exact/near-duplicate text hash similarity        |
| embeddingSearch       | FLOAT   | 0-1 range, NULLABLE         | Cosine similarity of title/body embeddings       |
| signatureMatchDate    | FLOAT   | 0-1 range, NULLABLE         | Date proximity score (e.g., ±3 days)             |
| signatureMatchState   | FLOAT   | 0-1 range, NULLABLE         | Geographic state match score                     |
| signatureMatchProduct | FLOAT   | 0-1 range, NULLABLE         | Product mention match score                      |
| signatureMatchHazard  | FLOAT   | 0-1 range, NULLABLE         | Hazard type match score                          |
| signatureMatchPlace   | FLOAT   | 0-1 range, NULLABLE         | Place/city/locality overlap score                |
| signatureMatchPeople  | FLOAT   | 0-1 range, NULLABLE         | Named person overlap score                       |
| score                 | FLOAT   | 0-1 range, NULLABLE         | Overall similarity score (equally weighted)      |
| scoreWeighted         | FLOAT   | 0-1 range, NULLABLE         | Overall similarity score (custom weightings)     |

**Purpose**:

- Automated duplicate detection to prevent redundant article processing
- Multi-layered similarity analysis using both traditional and AI-based methods
- Supports deduplication workflow in news aggregation pipeline

**Detection Methods**:

- **URL Check**: Canonical URL matching for exact/near duplicates
- **Content Hash**: Text hash comparison for identical/similar content
- **Embedding Search**: Semantic similarity using AI embeddings
- **Signature Matching**: Named entity recognition for dates, states, products, hazards, places, and people

**Scoring System**:

- All metrics normalized to 0-1 range (0 = no similarity, 1 = identical)
- Metrics are nullable until computed by deduplication service
- Two composite scores: equal weighting vs. custom algorithm weighting

**Indexes**:

- Unique composite index on (articleIdNew, articleIdApproved) to prevent duplicate comparisons
- Individual indexes on both foreign keys for efficient queries

**Usage Pattern**:

- Table is rebuilt per deduplication run
- New articles compared against all approved articles
- High similarity scores trigger manual review or automatic rejection

## ArticleEntityWhoCategorizedArticleContract

Junction table linking articles to categorization entities with keyword ratings.

| Field                  | Type    | Constraints                 | Description                              |
| ---------------------- | ------- | --------------------------- | ---------------------------------------- |
| id                     | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                        |
| articleId              | INTEGER | NOT NULL, FOREIGN KEY       | Reference to Article                     |
| entityWhoCategorizesId | INTEGER | NOT NULL, FOREIGN KEY       | Reference to EntityWhoCategorizedArticle |
| keyword                | STRING  |                             | Categorization keyword                   |
| keywordRating          | FLOAT   |                             | AI/semantic rating for keyword relevance |

**Indexes:**

- Unique composite index on (articleId, entityWhoCategorizesId, keyword)

## ArticleIsRelevant

Tracks user relevance markings for articles.

| Field      | Type    | Constraints                 | Description                |
| ---------- | ------- | --------------------------- | -------------------------- |
| id         | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier          |
| userId     | INTEGER | NOT NULL, FOREIGN KEY       | Reference to User          |
| articleId  | INTEGER | NOT NULL, FOREIGN KEY       | Reference to Article       |
| isRelevant | BOOLEAN | DEFAULT true                | Relevance status           |
| kmNotes    | STRING  |                             | Knowledge management notes |

## ArticleKeywordContract

Junction table for article-keyword relationships with rankings.

| Field                  | Type    | Constraints                 | Description                              |
| ---------------------- | ------- | --------------------------- | ---------------------------------------- |
| id                     | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                        |
| articleId              | INTEGER | NOT NULL, FOREIGN KEY       | Reference to Article                     |
| entityWhoCategorizesId | INTEGER | NOT NULL, FOREIGN KEY       | Reference to EntityWhoCategorizedArticle |
| ranking                | FLOAT   | NOT NULL                    | Keyword ranking/relevance score          |

## ArticleReportContract

Junction table linking articles to reports.

| Field                          | Type    | Constraints                 | Description                        |
| ------------------------------ | ------- | --------------------------- | ---------------------------------- |
| id                             | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                  |
| reportId                       | INTEGER | NOT NULL, FOREIGN KEY       | Reference to Report                |
| articleId                      | INTEGER | NOT NULL, FOREIGN KEY       | Reference to Article               |
| articleReferenceNumberInReport | STRING  |                             | Reference number within the report |
| articleAcceptedByCpsc          | BOOLEAN | DEFAULT true                | CPSC acceptance status             |
| articleRejectionReason         | STRING  |                             | Reason for rejection if applicable |

## ArticleReviewed

Tracks user review status for articles.

| Field      | Type    | Constraints                 | Description                |
| ---------- | ------- | --------------------------- | -------------------------- |
| id         | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier          |
| userId     | INTEGER | NOT NULL, FOREIGN KEY       | Reference to User          |
| articleId  | INTEGER | NOT NULL, FOREIGN KEY       | Reference to Article       |
| isReviewed | BOOLEAN | DEFAULT true                | Review status              |
| kmNotes    | STRING  |                             | Knowledge management notes |

## ArticleStateContract

Junction table for article-state relationships.

| Field     | Type    | Constraints                 | Description          |
| --------- | ------- | --------------------------- | -------------------- |
| id        | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier    |
| articleId | INTEGER | NOT NULL, FOREIGN KEY       | Reference to Article |
| stateId   | INTEGER | NOT NULL, FOREIGN KEY       | Reference to State   |

## ArtificialIntelligence

Defines AI systems used for article categorization.

| Field                | Type    | Constraints                 | Description                  |
| -------------------- | ------- | --------------------------- | ---------------------------- |
| id                   | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier            |
| name                 | STRING  | NOT NULL                    | AI system name               |
| description          | STRING  |                             | AI system description        |
| huggingFaceModelName | STRING  |                             | HuggingFace model identifier |
| huggingFaceModelType | STRING  |                             | HuggingFace model type       |

## EntityWhoCategorizedArticle

Tracks who/what categorized articles (human or AI).

| Field                    | Type    | Constraints                 | Description                                 |
| ------------------------ | ------- | --------------------------- | ------------------------------------------- |
| id                       | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                           |
| userId                   | INTEGER | FOREIGN KEY, NULLABLE       | Reference to User (if human)                |
| artificialIntelligenceId | INTEGER | FOREIGN KEY, NULLABLE       | Reference to ArtificialIntelligence (if AI) |

## EntityWhoFoundArticle

Tracks who/what found articles (user or aggregator source).

| Field                         | Type    | Constraints                 | Description                                             |
| ----------------------------- | ------- | --------------------------- | ------------------------------------------------------- |
| id                            | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                                       |
| userId                        | INTEGER | FOREIGN KEY, NULLABLE       | Reference to User (if manual)                           |
| newsArticleAggregatorSourceId | INTEGER | FOREIGN KEY, NULLABLE       | Reference to NewsArticleAggregatorSource (if automated) |

## Keyword

Master list of categorization keywords.

| Field      | Type    | Constraints                 | Description       |
| ---------- | ------- | --------------------------- | ----------------- |
| id         | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| keyword    | STRING  | NOT NULL                    | Keyword text      |
| category   | STRING  |                             | Keyword category  |
| isArchived | BOOLEAN | DEFAULT false               | Archive status    |

## NewsApiRequest

Tracks API-based news aggregation requests.

| Field                               | Type     | Constraints                 | Description                              |
| ----------------------------------- | -------- | --------------------------- | ---------------------------------------- |
| id                                  | INTEGER  | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                        |
| newsArticleAggregatorSourceId       | INTEGER  | NOT NULL, FOREIGN KEY       | Reference to NewsArticleAggregatorSource |
| countOfArticlesReceivedFromRequest  | INTEGER  |                             | Number of articles received              |
| countOfArticlesSavedToDbFromRequest | INTEGER  |                             | Number of articles saved to database     |
| countOfArticlesAvailableFromRequest | INTEGER  |                             | Total articles available from source     |
| dateStartOfRequest                  | DATEONLY |                             | Request start date                       |
| dateEndOfRequest                    | DATEONLY |                             | Request end date                         |
| status                              | STRING   |                             | Request status                           |
| url                                 | STRING   |                             | API request URL                          |
| andString                           | STRING   |                             | AND search parameters                    |
| orString                            | STRING   |                             | OR search parameters                     |
| notString                           | STRING   |                             | NOT search parameters                    |
| isFromAutomation                    | BOOLEAN  | DEFAULT false               | Automated request flag                   |

## NewsApiRequestWebsiteDomainContract

Junction table for NewsApiRequest and WebsiteDomain relationships.

| Field                         | Type    | Constraints                 | Description                 |
| ----------------------------- | ------- | --------------------------- | --------------------------- |
| id                            | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier           |
| newsApiRequestId              | INTEGER | FOREIGN KEY, NULLABLE       | Reference to NewsApiRequest |
| websiteDomainId               | INTEGER | FOREIGN KEY, NULLABLE       | Reference to WebsiteDomain  |
| includedOrExcludedFromRequest | STRING  | DEFAULT "included"          | Include/exclude status      |

## NewsArticleAggregatorSource

Defines external news sources for aggregation.

| Field     | Type    | Constraints                 | Description           |
| --------- | ------- | --------------------------- | --------------------- |
| id        | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier     |
| nameOfOrg | STRING  |                             | Organization name     |
| url       | STRING  |                             | Source URL            |
| apiKey    | STRING  |                             | API key for access    |
| isApi     | BOOLEAN | DEFAULT false               | API-based source flag |
| isRss     | BOOLEAN | DEFAULT false               | RSS-based source flag |

## NewsArticleAggregatorSourceStateContract

Junction table for NewsArticleAggregatorSource and State relationships.

| Field                         | Type    | Constraints                 | Description                              |
| ----------------------------- | ------- | --------------------------- | ---------------------------------------- |
| id                            | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                        |
| stateId                       | INTEGER | NOT NULL, FOREIGN KEY       | Reference to State                       |
| newsArticleAggregatorSourceId | INTEGER | NOT NULL, FOREIGN KEY       | Reference to NewsArticleAggregatorSource |

## NewsRssRequest

Tracks RSS-based news aggregation requests.

| Field                               | Type     | Constraints                 | Description                              |
| ----------------------------------- | -------- | --------------------------- | ---------------------------------------- |
| id                                  | INTEGER  | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                        |
| newsArticleAggregatorSourceId       | INTEGER  | NOT NULL, FOREIGN KEY       | Reference to NewsArticleAggregatorSource |
| countOfArticlesReceivedFromRequest  | INTEGER  |                             | Number of articles received              |
| countOfArticlesSavedToDbFromRequest | INTEGER  |                             | Number of articles saved to database     |
| dateStartOfRequest                  | DATEONLY |                             | Request start date                       |
| dateEndOfRequest                    | DATEONLY |                             | Request end date                         |
| gotResponse                         | BOOLEAN  |                             | Response received flag                   |

## Report

Defines generated reports containing collections of articles.

| Field                 | Type    | Constraints                 | Description                          |
| --------------------- | ------- | --------------------------- | ------------------------------------ |
| id                    | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier                    |
| dateSubmittedToClient | DATE    |                             | Client submission date               |
| nameCrFormat          | STRING  |                             | Report name in CR format             |
| nameZipFile           | STRING  |                             | ZIP file name for report             |
| userId                | INTEGER | NOT NULL, FOREIGN KEY       | Reference to User who created report |

## State

US states for geographic filtering and organization.

| Field        | Type    | Constraints                 | Description        |
| ------------ | ------- | --------------------------- | ------------------ |
| id           | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier  |
| name         | STRING  | NOT NULL                    | Full state name    |
| abbreviation | STRING  | NOT NULL                    | State abbreviation |

## User

System users who can review, approve, and manage articles.

| Field    | Type    | Constraints                 | Description                   |
| -------- | ------- | --------------------------- | ----------------------------- |
| id       | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier             |
| username | STRING  | NOT NULL                    | User login name               |
| email    | STRING  | NOT NULL                    | User email address            |
| password | STRING  | NOT NULL                    | Encrypted password            |
| isAdmin  | BOOLEAN | DEFAULT false               | Administrator privileges flag |

## WebsiteDomain

Defines website domains for filtering and categorization.

| Field                 | Type    | Constraints                 | Description                |
| --------------------- | ------- | --------------------------- | -------------------------- |
| id                    | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier          |
| name                  | STRING  | NOT NULL                    | Domain name                |
| isArchived            | BOOLEAN | DEFAULT false               | Archive status             |
| isArchievedNewsDataIo | BOOLEAN | DEFAULT false               | NewsData.io archive status |
