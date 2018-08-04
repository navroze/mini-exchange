const mongoose = require('mongoose');
const assert = require('assert');
require('../app');

const Company = mongoose.model('company');
const { getBestCompany } = require('../logic/exchange-logic');

describe('Exchange Logic', async () => {
  it('if no companies pass base targetting log base targetting', async () => {
    const request = {
      query: {
        baseBid: 12,
        category: 'autoMobile',
        countryCode: 'Us'
      }
    };
    const result = await getBestCompany(request);
    assert(result === 'No Companies Passed from Targeting');
  });

  it('if companies pass base targetting log base targetting', async () => {
    const companyRecord = new Company({
      countries: [
        'GER',
        'UK',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 10000,
      bid: 12344,
      category: 'advertising'
    });
    const companyRecord1 = new Company({
      countries: [
        'GER',
        'UK',
        'US',
        'CHN',
        'IND'
      ],
      budget: 10000,
      bid: 4983,
      category: 'automobile'
    });
    const request = {
      query: {
        category: 'advertising',
        countryCode: 'ind',
        baseBid: 99999
      }
    };
    await companyRecord.save();
    await companyRecord1.save();
    const result = await getBestCompany(request);
    assert(mongoose.Types.ObjectId.isValid(result[0]._id) === true);
  });

  it('if company has budget to sell stocks log budget check', async () => {
    const companyRecord = new Company({
      countries: [
        'GER',
        'UK',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 10000,
      bid: 12344,
      category: 'advertising'
    });
    const request = {
      query: {
        category: 'advertising',
        countryCode: 'ind',
        baseBid: 99999
      }
    };
    await companyRecord.save();
    const result = await getBestCompany(request);
    assert(mongoose.Types.ObjectId.isValid(result[0]._id) === true);
  });


  it('if company does not have budget to sell stocks log budget check', async () => {
    const companyRecord = new Company({
      countries: [
        'GER',
        'UK',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 0,
      bid: 12344,
      category: 'advertising'
    });
    const request = {
      query: {
        category: 'advertising',
        countryCode: 'ind'
      }
    };
    await companyRecord.save();
    const result = await getBestCompany(request);
    assert(result === 'No Companies Passed from Budget');
  });
});
