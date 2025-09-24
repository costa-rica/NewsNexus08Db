/**
 * Sample01 - Basic Database Connection and Table Creation Test
 *
 * This script demonstrates:
 * 1. Importing the NewsNexus08Db package
 * 2. Setting up environment variables
 * 3. Connecting to the SQLite database
 * 4. Creating database tables
 * 5. Creating sample records
 * 6. Querying data with associations
 */

import * as path from 'path';

// Set environment variables before importing the database
process.env.PATH_DATABASE = path.join(__dirname, 'test-data');
process.env.NAME_DB = 'test-database.sqlite';

// Import the database module
import db, { sequelize, User, Article, Report, ArticleReportContract } from '../../src/index';

async function main() {
  try {
    console.log('🚀 Starting NewsNexus08Db Test...');

    // Test database connection
    console.log('📡 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database tables (creates tables if they don't exist)
    console.log('🏗️  Creating database tables...');
    await sequelize.sync({ force: true }); // force: true drops existing tables
    console.log('✅ Database tables created successfully.');

    // Create sample data
    console.log('📝 Creating sample data...');

    // Create a user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
      isAdmin: false,
    });
    console.log(`✅ Created user: ${user.username} (ID: ${user.id})`);

    // Create an article
    const article = await Article.create({
      title: 'Sample News Article',
      description: 'This is a test article for demonstration purposes',
      author: 'Test Author',
      publicationName: 'Test Publication',
      url: 'https://example.com/test-article',
      publishedDate: '2024-09-24',
    });
    console.log(`✅ Created article: ${article.title} (ID: ${article.id})`);

    // Create a report
    const report = await Report.create({
      nameCrFormat: 'Test Report CR-001',
      nameZipFile: 'test-report.zip',
      userId: user.id,
    });
    console.log(`✅ Created report: ${report.nameCrFormat} (ID: ${report.id})`);

    // Create article-report relationship
    const articleReportContract = await ArticleReportContract.create({
      reportId: report.id,
      articleId: article.id,
      articleReferenceNumberInReport: 'AR-001',
      articleAcceptedByCpsc: true,
    });
    console.log(`✅ Created article-report contract (ID: ${articleReportContract.id})`);

    // Test associations by querying data
    console.log('🔍 Testing associations...');

    // Find report with associated user and articles
    const reportWithAssociations = await Report.findOne({
      where: { id: report.id },
      include: [
        {
          model: User,
          attributes: ['username', 'email'],
        },
        {
          model: ArticleReportContract,
          include: [
            {
              model: Article,
              attributes: ['title', 'author', 'url'],
            },
          ],
        },
      ],
    });

    if (reportWithAssociations) {
      console.log('📊 Report with associations:');
      console.log(`   Report: ${reportWithAssociations.nameCrFormat}`);
      console.log(`   Created by: ${(reportWithAssociations as any).User.username}`);
      console.log(`   Articles in report: ${(reportWithAssociations as any).ArticleReportContracts.length}`);

      (reportWithAssociations as any).ArticleReportContracts.forEach((contract: any, index: number) => {
        console.log(`     ${index + 1}. ${contract.Article.title} by ${contract.Article.author}`);
        console.log(`        Reference: ${contract.articleReferenceNumberInReport}`);
        console.log(`        Accepted: ${contract.articleAcceptedByCpsc ? 'Yes' : 'No'}`);
      });
    }

    // Get database info
    const userCount = await User.count();
    const articleCount = await Article.count();
    const reportCount = await Report.count();
    const contractCount = await ArticleReportContract.count();

    console.log('\n📈 Database Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Articles: ${articleCount}`);
    console.log(`   Reports: ${reportCount}`);
    console.log(`   Article-Report Contracts: ${contractCount}`);

    console.log('\n🎉 Test completed successfully!');
    console.log(`📁 Database file location: ${process.env.PATH_DATABASE}/${process.env.NAME_DB}`);

  } catch (error) {
    console.error('❌ Error during test:', error);
    process.exit(1);
  } finally {
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