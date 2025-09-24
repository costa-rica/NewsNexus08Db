const sequelize = require("./_connection");
const User = require("./User");
const ArticleKeywordContract = require("./ArticleKeywordContract");
const EntityWhoCategorizedArticle = require("./EntityWhoCategorizedArticle");
const ArtificialIntelligence = require("./ArtificialIntelligence");
const State = require("./State");
const ArticleStateContract = require("./ArticleStateContract");
const Report = require("./Report");
const ArticleReportContract = require("./ArticleReportContract");
const ArticleReviewed = require("./ArticleReviewed");
const ArticleApproved = require("./ArticleApproved");
const ArticleDuplicateRating = require("./ArticleDuplicateRating");
const NewsApiRequest = require("./NewsApiRequest");
const ArticleContent = require("./ArticleContent");
const NewsRssRequest = require("./NewsRssRequest");
const Keyword = require("./Keyword");
const NewsArticleAggregatorSource = require("./NewsArticleAggregatorSource");
const Article = require("./Article");
const EntityWhoFoundArticle = require("./EntityWhoFoundArticle");
const NewsArticleAggregatorSourceStateContract = require("./NewsArticleAggregatorSourceStateContract");
const ArticleIsRelevant = require("./ArticleIsRelevant");
const NewsApiRequestWebsiteDomainContract = require("./NewsApiRequestWebsiteDomainContract");
const WebsiteDomain = require("./WebsiteDomain");
const ArticleEntityWhoCategorizedArticleContract = require("./ArticleEntityWhoCategorizedArticleContract");
module.exports = {
	sequelize,
	User,
	ArticleKeywordContract,
	EntityWhoCategorizedArticle,
	ArtificialIntelligence,
	State,
	ArticleStateContract,
	Report,
	ArticleReportContract,
	ArticleReviewed,
	ArticleApproved,
	ArticleDuplicateRating,
	NewsApiRequest,
	ArticleContent,
	NewsRssRequest,
	Keyword,
	NewsArticleAggregatorSource,
	Article,
	EntityWhoFoundArticle,
	NewsArticleAggregatorSourceStateContract,
	ArticleIsRelevant,
	NewsApiRequestWebsiteDomainContract,
	WebsiteDomain,
	ArticleEntityWhoCategorizedArticleContract,
};
require("./_associations");
