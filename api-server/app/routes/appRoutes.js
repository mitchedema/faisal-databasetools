
module.exports = function(app) {
  const controller = require('../controllers/appController.js');
  const alzheimerController = require('../controllers/alzheimerController.js')
  const ukbiobankController = require('../controllers/ukbiobankController.js')

  app.route('/api/data').get(controller.get_data);
  app.route('/api/range').get(controller.get_range);
  app.route('/api/query').get(controller.get_query);
  app.route('/api/values').get(controller.get_values);
  app.route('/api/schemas').get(controller.get_schemas);

  app.route('/api/alzheimer/data').get(alzheimerController.get_data);
  app.route('/api/alzheimer/range').get(alzheimerController.get_range);
  app.route('/api/alzheimer/query').get(alzheimerController.get_query);
  
  app.route('/api/ukbiobank/data').get(ukbiobankController.get_data);
  app.route('/api/ukbiobank/range').get(ukbiobankController.get_range);
  app.route('/api/ukbiobank/query').get(ukbiobankController.get_query);
}
