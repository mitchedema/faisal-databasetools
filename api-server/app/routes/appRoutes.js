
module.exports = function(app) {
  const controller = require('../controllers/appController.js');

  app.route('/data').get(controller.get_data);
  app.route('/values').get(controller.get_values);
  app.route('/range').get(controller.get_range);
  app.route('/schemas').get(controller.get_schemas);
  app.route('/query').get(controller.get_query);
}
