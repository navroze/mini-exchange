const Company = require('../models/company');

const validation = {};

validation.queryValidator = async ({ query }) => {
  /**
  * Check if all query parameters are present.
  */
  if (!('baseBid' in query) || !('category' in query) || !('countryCode' in query)) {
    return {
      status: false,
      error: {
        location: 'query',
        msg: 'Please provide category baseBid and countryCode'
      }
    };
  }

  /**
 * Check if query parameters are undefined.
 */
  if (query.baseBid === undefined
      || query.category === undefined
      || query.countryCode === undefined) {
    return {
      status: false,
      error: {
        location: 'query',
        msg: 'Please provide valid category baseBid and countryCode'
      }
    };
  }


  /**
 * Check if baseBid is a number.
 */
  query.baseBid = Number(query.baseBid);
  if (isNaN(query.baseBid)) {
    return {
      status: false,
      error: {
        location: 'query',
        msg: 'Please provide a valid base bid'
      }
    };
  }

  /**
 * Check if baseBid is greater than 0.
 */
  if (query.baseBid <= 0) {
    return {
      status: false,
      error: {
        location: 'baseBid',
        msg: 'Base bid should be greater than 0'
      }
    };
  }


  try {
    /**
 * Check if category is valid.
 */
    query.category = query.category.toLowerCase();
    let result = await Company.findOne({ category: query.category });
    if (!result) {
      return {
        status: false,
        error: {
          location: 'category',
          msg: 'Could not find category'
        }
      };
    }
    /**
 * Check if country Code is valid.
 */
    query.countryCode = query.countryCode.toUpperCase();
    result = await Company.findOne({ countries: query.countryCode });
    if (!result) {
      return {
        status: false,
        error: {
          location: 'Country Code',
          msg: 'Could not find country code'
        }
      };
    }
    return { status: true };
  } catch (error) {
    console.log(error);
  }
};

module.exports = validation;
