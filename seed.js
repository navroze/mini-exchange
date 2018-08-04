const _ = require('lodash');
const faker = require('faker');
const { MongoClient } = require('mongodb');


const MINIMUM_COMPANIES = 200;
const COMPANIES_TO_ADD = 15000;

function randomBetween(min, max) {
  return ~~(Math.random() * (max - min)) + min;
}

const categories = [
  'Education',
  'Electronics and telecom',
  'Nonprofit',
  'Pets and animals',
  'Travel',
  'Sports and outdoors',
  'Clothing',
  'Furniture',
  'Advertising'
];

const countryPrefixes = [
  'BEL',
  'IND',
  'FR',
  'US',
  'UK',
  'CHN',
  'JPN',
  'RUS',
  'AUS',
  'GER',
  'MEX'
];

function getCountries() {
  let countries = [];
  let index;
  for (let i = 0; i < 5; i++) {
    index = randomBetween(0, countryPrefixes.length - 1);
    countries.push(countryPrefixes[index]);
  }
  countries = _.uniq(countries);
  return countries;
}

function createCompany() {
  const company = {
    countries: getCountries(),
    bid: faker.random.number({ min: 100, max: 100000 }),
    category: categories[randomBetween(0, categories.length)].toLowerCase(),
  };
  company.budget = faker.random.number({ min: company.bid + 10, max: 10000 });
  return company;
}

const url = 'mongodb://localhost:27017';
const dbName = 'exchange';
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const companyCollection = db.collection('company');
  companyCollection.countDocuments()
    .then((count) => {
      if (count < MINIMUM_COMPANIES) {
        const companies = _.times(COMPANIES_TO_ADD, () => createCompany());
        companyCollection.insertMany(companies)
          .then((result) => {
            console.log(`Inserted ${result.insertedCount} values`);
            return companyCollection.createIndex({ countries: 1, category: 1 });
          })
          .then(response => console.log(`Index create on: ${response}`));
      }
    });
});
