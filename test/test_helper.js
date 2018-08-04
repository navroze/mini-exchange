const mongoose = require('mongoose');
const chalk = require('chalk');

before((done) => {
  mongoose.connect('mongodb://localhost:27017/exchange_test', { useNewUrlParser: true });
  mongoose.connection
    .once('open', () => {
      console.log('Connected to exchange_test');
      done();
    })
    .on('error', (err) => {
      console.log('%s MongoDB connection error. Please make sure MongoDB is running.', err, chalk.red('✗'));
    });
});

beforeEach((done) => {
  const { company } = mongoose.connection.collections;
  company.drop()
    .then(() => done())
    .catch(() => done());
});
