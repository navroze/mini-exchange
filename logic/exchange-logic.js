const Company = require('../models/company');

const exchangeLogic = {};

exchangeLogic.getBestCompany = async ({ query }) => {
  try {
    const findQuery = {
      countries: query.countryCode.toUpperCase(),
      category: query.category.toLowerCase()
    };
    const company = await Company.find(findQuery).sort({ bid: -1 }).limit(1);
    if (company.length <= 0) {
      return 'No Companies Passed from Targeting';
    }
    if (company[0].budget <= 0 || (query.baseBid / 100) > company[0].budget) {
      return 'No Companies Passed from Budget';
    }
    if (company[0].bid >= query.baseBid) {
      return 'No Companies Passed from BaseBid check';
    }
    const newBudget = company[0].budget - (query.baseBid / 100);
    Company.update({ _id: company[0]._id }, { budget: newBudget, bid: query.baseBid });
    return company;
  } catch (error) {
    console.log(error);
  }
};

module.exports = exchangeLogic;
