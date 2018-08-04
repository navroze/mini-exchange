const { queryValidator } = require('../validation/req-validation');
const { getBestCompany } = require('../logic/exchange-logic');

const stockController = {};

stockController.getStock = async (req, res) => {
  const result = await queryValidator(req);
  if (!result.status) {
    res.status(422).json({ message: 'Please enter baseBid category and countryCode' });
    return;
  }
  const response = await getBestCompany(req);
  if (response === 'No Companies Passed from Targeting') {
    res.status(404).json({ message: response });
    return;
  }
  if (response === 'No Companies Passed from Budget') {
    res.status(200).json({ message: response });
    return;
  }
  if (response === 'No Companies Passed from BaseBid check') {
    res.status(200).json({ message: response });
    return;
  }
  res.status(200).json({ companyId: response[0]._id });
};

module.exports = stockController;
