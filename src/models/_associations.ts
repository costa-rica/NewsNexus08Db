import Article from './Article';
import ArticleReportContract from './ArticleReportContract';
import Report from './Report';
import User from './User';

// --- User associations ---
User.hasMany(Report, { foreignKey: 'userId' });
Report.belongsTo(User, { foreignKey: 'userId' });

// --- Report associations ---
Report.hasMany(ArticleReportContract, { foreignKey: 'reportId' });
ArticleReportContract.belongsTo(Report, { foreignKey: 'reportId' });

// --- Article associations ---
Article.hasMany(ArticleReportContract, { foreignKey: 'articleId' });
ArticleReportContract.belongsTo(Article, { foreignKey: 'articleId' });

console.log('✅ Associations have been set up');