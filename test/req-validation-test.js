const mongoose = require('mongoose');
const assert = require('assert');
require('../app');

const Company = mongoose.model('company');
const { queryValidator } = require('../validation/req-validation');


describe('Request Validation', () => {
  it('Check if variables are un-defined', async () => {
    const request = {
      query: {
        baseBid: undefined,
        category: undefined,
        countryCode: 'US'
      }
    };
    const result = await queryValidator(request);
    assert(result.status === false);
    assert(result.error.msg === 'Please provide valid category baseBid and countryCode');
  });

  it('Check if all queries are present', async () => {
    const request = {
      query: {
        countryCode: 'US'
      }
    };
    const result = await queryValidator(request);
    assert(result.status === false);
    assert(result.error.msg === 'Please provide category baseBid and countryCode');
  });

  it('Check if base bid is not a number', async () => {
    const request = {
      query: {
        baseBid: 'welcome',
        category: 'autmobile',
        countryCode: 'US'
      }
    };
    const result = await queryValidator(request);
    assert(result.status === false);
    assert(result.error.msg === 'Please provide a valid base bid');
  });

  it('Check if category is not present in database', async () => {
    const request = {
      query: {
        baseBid: '100',
        category: 'autmobile',
        countryCode: 'US'
      }
    };
    const result = await queryValidator(request);
    assert(result.status === false);
    assert(result.error.msg === 'Could not find category');
  });

  it('Check if country code is not present in database', async () => {
    const companyRecord = new Company({
      countries: [
        'GER',
        'UK',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 981,
      bid: 50830,
      category: 'advertising'
    });
    await companyRecord.save();
    const request = {
      query: {
        baseBid: '100',
        category: 'advertising',
        countryCode: 'US'
      }
    };
    const result = await queryValidator(request);
    assert(result.status === false);
    assert(result.error.msg === 'Could not find country code');
  });

  it('Check if basebid is less than 0', async () => {
    const request = {
      query: {
        baseBid: '-1',
        category: 'advertising',
        countryCode: 'US'
      }
    };
    const result = await queryValidator(request);
    assert(result.status === false);
    assert(result.error.msg === 'Base bid should be greater than 0');
  });
});
