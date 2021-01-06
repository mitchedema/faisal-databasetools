
module.exports = function(app) {
  const controller = require('../controllers/appController.js');

  app.route('/data').get(controller.get_data);
  app.route('/values').get(controller.get_values);
}
