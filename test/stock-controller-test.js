const mongoose = require('mongoose');
const request = require('supertest');
const assert = require('assert');
const app = require('../app');

const Company = mongoose.model('company');

describe('Stock Controller', () => {
  it('GET to / should return 422 status if request parameters are bad', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  it('GET to /?countryCode=us&baseBid=1&category=adverTisiNg should return "No Companies Passed from Targetting"', async () => {
    const companyRecord = new Company({
      countries: [
        'GER',
        'UK',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 981,
      bid: 12344,
      category: 'advertising'
    });
    const companyRecord1 = new Company({
      countries: [
        'GER',
        'US',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 981,
      bid: 12344,
      category: 'automobiles'
    });

    await companyRecord.save();
    await companyRecord1.save();
    await request(app)
      .get('/?countryCode=us&baseBid=1&category=adverTisiNg')
      .expect('Content-Type', /json/)
      .expect(404)
      .then(({ body }) => {
        assert(body.message === 'No Companies Passed from Targeting');
      });
  });

  it('GET to /?countryCode=geR&baseBid=1&category=adverTisiNg should return "No Companies Passed from Budget"', async () => {
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
    await companyRecord.save();
    await request(app)
      .get('/?countryCode=geR&baseBid=1&category=adverTisiNg')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        assert(body.message === 'No Companies Passed from Budget');
      });
  });

  it('GET to /?countryCode=geR&baseBid=1&category=adverTisiNg should return "No Companies Passed from BaseBid Check"', async () => {
    const companyRecord = new Company({
      countries: [
        'GER',
        'UK',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 245,
      bid: 12344,
      category: 'advertising'
    });
    await companyRecord.save();
    await request(app)
      .get('/?countryCode=geR&baseBid=1&category=adverTisiNg')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        assert(body.message === 'No Companies Passed from BaseBid check');
      });
  });

  it('GET to /?countryCode=geR&baseBid=2234&category=adverTisiNg should return "No Companies Passed from Budget"', async () => {
    const companyRecord = new Company({
      countries: [
        'GER',
        'UK',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 23,
      bid: 2222,
      category: 'advertising'
    });
    await companyRecord.save();
    await request(app)
      .get('/?countryCode=geR&baseBid=2422&category=adverTisiNg')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        assert(body.message === 'No Companies Passed from Budget');
      });
  });

  it('GET to /?countryCode=geR&baseBid=2234&category=adverTisiNg should return company-id', async () => {
    const companyRecord = new Company({
      countries: [
        'GER',
        'UK',
        'RUS',
        'JPN',
        'IND'
      ],
      budget: 28,
      bid: 2222,
      category: 'advertising'
    });
    await companyRecord.save();
    await request(app)
      .get('/?countryCode=geR&baseBid=2422&category=adverTisiNg')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        assert(mongoose.Types.ObjectId.isValid(body.companyId) === true);
      });
  });
});
