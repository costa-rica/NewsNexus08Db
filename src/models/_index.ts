import sequelize from './_connection';
import Article from './Article';
import ArticleApproved from './ArticleApproved';
import ArticleContent from './ArticleContent';
import ArticleDuplicateRating from './ArticleDuplicateRating';
import ArticleEntityWhoCategorizedArticleContract from './ArticleEntityWhoCategorizedArticleContract';
import ArticleIsRelevant from './ArticleIsRelevant';
import ArticleKeywordContract from './ArticleKeywordContract';
import ArticleReportContract from './ArticleReportContract';
import ArticleReviewed from './ArticleReviewed';
import ArticleStateContract from './ArticleStateContract';
import ArtificialIntelligence from './ArtificialIntelligence';
import EntityWhoCategorizedArticle from './EntityWhoCategorizedArticle';
import EntityWhoFoundArticle from './EntityWhoFoundArticle';
import Keyword from './Keyword';
import NewsApiRequest from './NewsApiRequest';
import NewsApiRequestWebsiteDomainContract from './NewsApiRequestWebsiteDomainContract';
import NewsArticleAggregatorSource from './NewsArticleAggregatorSource';
import NewsArticleAggregatorSourceStateContract from './NewsArticleAggregatorSourceStateContract';
import NewsRssRequest from './NewsRssRequest';
import Report from './Report';
import State from './State';
import User from './User';
import WebsiteDomain from './WebsiteDomain';

const db = {
  sequelize,
  Article,
  ArticleApproved,
  ArticleContent,
  ArticleDuplicateRating,
  ArticleEntityWhoCategorizedArticleContract,
  ArticleIsRelevant,
  ArticleKeywordContract,
  ArticleReportContract,
  ArticleReviewed,
  ArticleStateContract,
  ArtificialIntelligence,
  EntityWhoCategorizedArticle,
  EntityWhoFoundArticle,
  Keyword,
  NewsApiRequest,
  NewsApiRequestWebsiteDomainContract,
  NewsArticleAggregatorSource,
  NewsArticleAggregatorSourceStateContract,
  NewsRssRequest,
  Report,
  State,
  User,
  WebsiteDomain,
};

// Load associations
import './_associations';

export default db;
export {
  sequelize,
  Article,
  ArticleApproved,
  ArticleContent,
  ArticleDuplicateRating,
  ArticleEntityWhoCategorizedArticleContract,
  ArticleIsRelevant,
  ArticleKeywordContract,
  ArticleReportContract,
  ArticleReviewed,
  ArticleStateContract,
  ArtificialIntelligence,
  EntityWhoCategorizedArticle,
  EntityWhoFoundArticle,
  Keyword,
  NewsApiRequest,
  NewsApiRequestWebsiteDomainContract,
  NewsArticleAggregatorSource,
  NewsArticleAggregatorSourceStateContract,
  NewsRssRequest,
  Report,
  State,
  User,
  WebsiteDomain,
};