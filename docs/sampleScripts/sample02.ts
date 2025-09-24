/**
 * Sample02 - CSV Data Import from ZIP file
 *
 * This script demonstrates:
 * 1. Extracting CSV files from a ZIP archive
 * 2. Parsing CSV data and importing into database tables
 * 3. Handling foreign key relationships during import
 * 4. Error handling and data validation
 *
 * Expected ZIP file structure:
 * - User.csv (id, username, email, password, isAdmin)
 * - Article.csv (id, title, description, author, publicationName, url, urlToImage, publishedDate, entityWhoFoundArticleId, newsApiRequestId, newsRssRequestId)
 * - Report.csv (id, dateSubmittedToClient, nameCrFormat, nameZipFile, userId)
 * - ArticleReportContract.csv (id, reportId, articleId, articleReferenceNumberInReport, articleAcceptedByCpsc, articleRejectionReason)
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import AdmZip from 'adm-zip';
import { parse } from 'csv-parse/sync';

// Set environment variables before importing the database
process.env.PATH_DATABASE = path.join(__dirname, 'test-data');
process.env.NAME_DB = 'import-test-database.sqlite';

// Import the database module
import db, { sequelize, User, Article, Report, ArticleReportContract } from '../../src/index';

interface CsvRow {
  [key: string]: string;
}

// Define the import order to respect foreign key constraints
const IMPORT_ORDER = ['User', 'Article', 'Report', 'ArticleReportContract'];

// Model mapping
const MODEL_MAP: { [key: string]: any } = {
  User,
  Article,
  Report,
  ArticleReportContract,
};

async function extractZipFile(zipPath: string, extractPath: string): Promise<string[]> {
  console.log(`📦 Extracting ZIP file: ${zipPath}`);

  if (!fsSync.existsSync(zipPath)) {
    throw new Error(`ZIP file not found: ${zipPath}`);
  }

  // Create extraction directory
  await fs.mkdir(extractPath, { recursive: true });

  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();

  const csvFiles: string[] = [];

  zipEntries.forEach(entry => {
    if (entry.entryName.endsWith('.csv') && !entry.isDirectory) {
      const fileName = path.basename(entry.entryName);
      const extractFilePath = path.join(extractPath, fileName);

      console.log(`  Extracting: ${fileName}`);
      zip.extractEntryTo(entry.entryName, extractPath, false, true);
      csvFiles.push(extractFilePath);
    }
  });

  console.log(`✅ Extracted ${csvFiles.length} CSV files`);
  return csvFiles;
}

async function parseCsvFile(filePath: string): Promise<CsvRow[]> {
  console.log(`📊 Parsing CSV file: ${path.basename(filePath)}`);

  const content = await fs.readFile(filePath, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  console.log(`  Found ${records.length} records`);
  return records;
}

function convertCsvRowToModelData(modelName: string, row: CsvRow): any {
  const data: any = { ...row };

  // Convert string values to appropriate types
  Object.keys(data).forEach(key => {
    const value = data[key];

    // Skip conversion for null or empty strings
    if (value === null || value === '') {
      data[key] = null;
      return;
    }

    // Convert boolean fields
    if (key.startsWith('is') || key.includes('Accepted') || key.includes('Admin')) {
      data[key] = value.toLowerCase() === 'true' || value === '1';
      return;
    }

    // Convert ID fields to integers
    if (key.endsWith('Id') || key === 'id') {
      const numValue = parseInt(value, 10);
      data[key] = isNaN(numValue) ? null : numValue;
      return;
    }

    // Convert date fields
    if (key.includes('Date') && value) {
      // Try to parse as date, keep as string if it's already in proper format
      data[key] = value;
      return;
    }
  });

  return data;
}

async function importCsvToModel(modelName: string, csvData: CsvRow[]): Promise<void> {
  console.log(`🗃️  Importing ${csvData.length} records to ${modelName} table...`);

  const Model = MODEL_MAP[modelName];
  if (!Model) {
    throw new Error(`Unknown model: ${modelName}`);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const row of csvData) {
    try {
      const modelData = convertCsvRowToModelData(modelName, row);

      // Remove undefined/empty id field to let auto-increment work
      if (modelData.id === null || modelData.id === undefined) {
        delete modelData.id;
      }

      await Model.create(modelData);
      successCount++;
    } catch (error) {
      errorCount++;
      console.warn(`  ⚠️  Error importing row to ${modelName}:`, error instanceof Error ? error.message : error);
      console.warn(`     Row data:`, row);
    }
  }

  console.log(`✅ ${modelName}: ${successCount} imported, ${errorCount} errors`);
}

async function main() {
  if (process.argv.length < 3) {
    console.error('❌ Usage: ts-node sample02.ts <path-to-zip-file>');
    console.error('   Example: ts-node sample02.ts ./data/sample-data.zip');
    process.exit(1);
  }

  const zipPath = path.resolve(process.argv[2]);
  const extractPath = path.join(__dirname, 'temp-csv-extract');

  try {
    console.log('🚀 Starting CSV Import from ZIP...');
    console.log(`📁 ZIP file: ${zipPath}`);
    console.log(`📂 Extract to: ${extractPath}`);

    // Test database connection
    console.log('📡 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Create database tables
    console.log('🏗️  Creating database tables...');
    await sequelize.sync({ force: true }); // force: true drops existing tables
    console.log('✅ Database tables created successfully.');

    // Extract ZIP file
    const csvFiles = await extractZipFile(zipPath, extractPath);

    if (csvFiles.length === 0) {
      throw new Error('No CSV files found in ZIP archive');
    }

    // Parse all CSV files
    const csvData: { [modelName: string]: CsvRow[] } = {};

    for (const filePath of csvFiles) {
      const fileName = path.basename(filePath, '.csv');

      // Only process files that match our expected models
      if (IMPORT_ORDER.includes(fileName)) {
        csvData[fileName] = await parseCsvFile(filePath);
      } else {
        console.warn(`⚠️  Skipping unknown CSV file: ${fileName}.csv`);
      }
    }

    // Import data in correct order (respecting foreign key constraints)
    console.log('📥 Starting data import...');

    for (const modelName of IMPORT_ORDER) {
      if (csvData[modelName]) {
        await importCsvToModel(modelName, csvData[modelName]);
      } else {
        console.log(`ℹ️  No data found for ${modelName}, skipping...`);
      }
    }

    // Verify import results
    console.log('\n📈 Import Summary:');
    const userCount = await User.count();
    const articleCount = await Article.count();
    const reportCount = await Report.count();
    const contractCount = await ArticleReportContract.count();

    console.log(`   Users: ${userCount}`);
    console.log(`   Articles: ${articleCount}`);
    console.log(`   Reports: ${reportCount}`);
    console.log(`   Article-Report Contracts: ${contractCount}`);

    // Test a few relationships
    if (reportCount > 0) {
      console.log('\n🔍 Testing relationships...');
      const reportsWithUsers = await Report.findAll({
        include: [{ model: User, attributes: ['username'] }],
        limit: 3,
      });

      reportsWithUsers.forEach((report, index) => {
        console.log(`   Report ${index + 1}: ${report.nameCrFormat} by ${(report as any).User?.username || 'Unknown'}`);
      });
    }

    console.log('\n🎉 CSV import completed successfully!');
    console.log(`📁 Database file location: ${process.env.PATH_DATABASE}/${process.env.NAME_DB}`);

  } catch (error) {
    console.error('❌ Error during CSV import:', error);
    process.exit(1);
  } finally {
    // Clean up extracted files
    try {
      console.log('🧹 Cleaning up temporary files...');
      await fs.rm(extractPath, { recursive: true, force: true });
      console.log('✅ Cleanup completed.');
    } catch (cleanupError) {
      console.warn('⚠️  Warning: Could not clean up temporary files:', cleanupError);
    }

    // Close database connection
    await sequelize.close();
    console.log('🔌 Database connection closed.');
  }
}

// Run the main function
if (require.main === module) {
  main().catch(console.error);
}

export default main;