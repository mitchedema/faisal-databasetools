
module.exports = function(app) {
  var controller = require('../controllers/appController.js');

  app.route('/females/sdat')
    .get(controller.select_fem_sdat);

  app.route('/females/snc')
    .get(controller.select_fem_snc);

  app.route('/females')
    .get(controller.select_fem);

  app.route('/males/sdat')
    .get(controller.select_male_sdat);

  app.route('/males/snc')
    .get(controller.select_male_snc);

  app.route('/males')
    .get(controller.select_male);

  app.route('/')
    .get(controller.select_all_data);

  app.route('/sdat')
    .get(controller.select_all_sdat);

  app.route('/snc')
    .get(controller.select_all_snc);
}
