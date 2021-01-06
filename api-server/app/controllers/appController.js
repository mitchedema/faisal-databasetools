const Data = require('../models/appModel.js');

// call the select statement from models for GET request
exports.get_data = async function (req,res) {
  try {
    const schema = req.query.schema;
    const values = req.query.values;
    let conditions = req.query.conditions;
    if (!conditions) {
      conditions = '\n';
    } else {
      const parsedConditions = conditions.split(',')
      const andConditions = parsedConditions.map(
        condition => `AND ${condition}\n`
      );
      conditions = andConditions.join("");
    }

    console.log(conditions);

    const result = await Data.getData(schema,values,conditions);

    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}
