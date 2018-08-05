const winston = require('winston');

const Company = require('../models/company');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: './exchange-logs/exchange.log' })
  ]
});
const exchangeLogic = {};

exchangeLogic.getBestCompany = async ({ query }) => {
  try {
    const findQuery = {
      countries: query.countryCode.toUpperCase(),
      category: query.category.toLowerCase()
    };
    const company = await Company.find(findQuery).sort({ bid: -1 }).limit(1);
    if (company.length <= 0) {
      logger.log({
        level: 'info',
        message: 'No Companies Passed from Targeting'
      });
      return 'No Companies Passed from Targeting';
    }
    if (company[0].budget <= 0 || (query.baseBid / 100) > company[0].budget) {
      logger.log({
        level: 'info',
        message: {
          BudgetCheck: {
            companyId: company[0].id,
            message: 'No Companies Passed from Budget'
          }
        }
      });
      return 'No Companies Passed from Budget';
    }
    if (company[0].bid >= query.baseBid) {
      logger.log({
        level: 'info',
        message: {
          BudgetCheck: {
            companyId: company[0].id,
            message: 'No Companies Passed from BaseBid Check'
          }
        }
      });
      return 'No Companies Passed from BaseBid check';
    }
    const newBudget = company[0].budget - (query.baseBid / 100);
    await Company.update({ _id: company[0]._id }, { budget: newBudget, bid: query.baseBid });
    logger.log({
      level: 'info',
      message: {
        BudgetCheck: {
          companyId: company[0].id,
          message: 'Winning Company'
        }
      }
    });
    return company;
  } catch (error) {
    console.log(error);
  }
};

module.exports = exchangeLogic;
