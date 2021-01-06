const Data = require('../models/appModel.js');

// call the select statement from models for GET request
exports.get_data = async function (req,res) {
  try {
    //parse params from URL
    const schema = req.query.schema;
    const values = req.query.values;
    let conditions = req.query.conditions;
    if (!conditions) {
      conditions = '\n';
    } else {
      //set up conditional statement in SQL format
      const parsedConditions = conditions.split(',')
      const andConditions = parsedConditions.map(
        condition => `AND ${condition}\n`
      );
      conditions = andConditions.join("");
    }
    const result = await Data.getData(schema,values,conditions);

    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.get_values = async function (req,res) {
  try {
    const schema = req.query.schema;
    const result = await Data.getValues(schema);

    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.get_range = async function (req,res) {
  try {
    const schema = req.query.schema;
    const value = req.query.value;
    const result = await Data.getRange(schema,value);

    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}