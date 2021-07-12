
module.exports = function(app) {
  const controller = require('../controllers/appController.js');
  const alzheimerController = require('../controllers/alzheimerController.js')
  const ukbiobankController = require('../controllers/ukbiobankController.js')

  app.get('/', (req, res) => {
    res.send('Hello World!')
  });

  app.route('/data').get(controller.get_data);
  app.route('/range').get(controller.get_range);
  app.route('/query').get(controller.get_query);
  app.route('/values').get(controller.get_values);
  app.route('/schemas').get(controller.get_schemas);

  app.route('/alzheimer/data').get(alzheimerController.get_data);
  app.route('/alzheimer/range').get(alzheimerController.get_range);
  app.route('/alzheimer/query').get(alzheimerController.get_query);
  
  app.route('/ukbiobank/data').get(ukbiobankController.get_data);
  app.route('/ukbiobank/range').get(ukbiobankController.get_range);
  app.route('/ukbiobank/query').get(ukbiobankController.get_query);
}
