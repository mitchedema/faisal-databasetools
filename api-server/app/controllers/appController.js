const Data = require('../models/appModel.js');

function groupConditions(conditions) {
  let groupedConditions = '';
  const delimiters = [',', ';'];
  const conditionDelimiters = new RegExp(delimiters.join('|'), 'g');
  const parsedConditions = conditions.split(conditionDelimiters);
  const relations = ['<', '<=', '=', '>', '>='];
  const relationDelimiters = new RegExp(relations.join('|'), 'g');
  const fields = parsedConditions.map(condition => {
      const splitConditions = condition.split(relationDelimiters);
      return splitConditions[0]
  });
  const delims = [];
  for (var i = 0; i < conditions.length; i++) {
    if (conditions[i] === ',' || conditions[i] === ';') {
      delims.push(conditions[i]);
    }
  }
  const andConditions = parsedConditions.map(
    (condition, index) => {
      const splitCondition = condition.split(relationDelimiters)[0]
      if (index === 0) {
        if (fields.filter(field => field === splitCondition).length === 1) {
          return `(${condition})\n`
        }
        return `(${condition}`
      } else {
        if (delims[index-1] === ',') {
          if (splitCondition === fields[index-1] && splitCondition === fields[index+1]) {
            return ` AND ${condition}`
          } else if (splitCondition !== fields[index-1] && splitCondition === fields[index+1]) {
            return `    AND (${condition}`
          } else if (splitCondition !== fields[index+1] && splitCondition === fields[index-1]) {
            return ` AND ${condition})\n`
          } else {
            return `    AND (${condition})\n`
          }
        } else {
          if (splitCondition === fields[index-1] && splitCondition === fields[index+1]) {
            return ` OR ${condition}`
          } else if (splitCondition !== fields[index-1] && splitCondition === fields[index+1]) {
            return `    OR (${condition}`
          } else if (splitCondition !== fields[index+1] && splitCondition === fields[index-1]) {
            return ` OR ${condition})\n`
          } else {
            return `    OR (${condition})\n`
          }
        }
      }
    }
  );
  groupedConditions = 'AND (' + andConditions.join("") + ')';
  return groupedConditions;
}

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
      conditions = groupConditions(conditions);
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

exports.get_schemas = async function (req,res) {
  try {
    const result = await Data.getSchemas();

    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

exports.get_query = async function (req,res) {
  try {
    const schema = req.query.schema;
    const values = req.query.values;
    let conditions = req.query.conditions;
    if (!conditions) {
      conditions = '\n';
    } else {
      //set up conditional statement in SQL format
      conditions = groupConditions(conditions);
    }
    const result = await Data.getQuery(schema,values,conditions);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
}