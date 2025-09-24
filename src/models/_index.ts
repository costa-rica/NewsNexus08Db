import sequelize from './_connection';
import Article from './Article';
import ArticleReportContract from './ArticleReportContract';
import Report from './Report';
import User from './User';

const db = {
  sequelize,
  Article,
  ArticleReportContract,
  Report,
  User,
};

// Load associations
import './_associations';

export default db;
export {
  sequelize,
  Article,
  ArticleReportContract,
  Report,
  User,
};