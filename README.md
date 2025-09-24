![Logo](./docs/images/logoAndNameRound.png)

A Sequelize SQLite module for the NewsNexus08Db and microservices suite of applications. The current task is to convert this entire project to TypeScript.

## General Architecture

This project will have all the code stored in a src/ directory and the compiled code stored in a dist/ directory. The entry point to this applicaiton will will be a file named index.ts in the src/ directory. There rest of the folder structure should follow that found in the docs/version07referenceCode/ directory.

## TypeScript Refactor (Next Task)

This project (`NewsNexus08Db`) is the foundation for the version 8 platform suite. The next major task is a **full TypeScript refactor**, not a minimal change. The goal is to **ship types** so that downstream apps benefit from strong typing. The refactor will include:

- Converting `.js` files in `/models` and `index.js` into `.ts`.
- Adding a proper `tsconfig.json` with `"declaration": true`.
- Publishing both compiled JavaScript and `.d.ts` declaration files.
- Organizing the project so files are structured in a clean, idiomatic way (src/, dist/, etc.).

Claude (the code assistant) will be responsible for performing this refactor.

## installation

1. `npm init -y`
2. `npm install sequelize sqlite3`

## import to other apps

`npm install file:../NewsNexus08Db`

## Environmental Variables

- No .env file is needed becuase this package will use the .env vars from the project it is imported into.

## Example of How to leverage associations

1. Get the EntityWhoFoundArticle.id from the GNews NewsArticleAggregatorSource

```js
const {
	NewsArticleAggregatorSource,
} = require("./NewsArticleAggregatorSource");
const { EntityWhoFoundArticle } = require("./EntityWhoFoundArticle");

const gNewsSource = await NewsArticleAggregatorSource.findOne({
	where: { nameOfOrg: "GNews" },
	include: [{ model: EntityWhoFoundArticle }],
});

const entityWhoFoundArticleId = gNewsSource.EntityWhoFoundArticle?.id;
```
