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
  const queryConditions = parsedConditions.map(
    (condition, index) => {
      let curCondition;
      if (condition.includes('NOTNULL')) {
        curCondition = fields[index] + ' IS NOT NULL'
      } else {
        curCondition = condition
      }
      const splitCondition = condition.split(relationDelimiters)[0]
      if (index === 0) {
        if (fields.filter(field => field === splitCondition).length === 1) {
          return `(${curCondition})\n`
        }
        return `(${curCondition}`
      } else {
        if (delims[index-1] === ',') {
          if (splitCondition === fields[index-1] && splitCondition === fields[index+1]) {
            return ` AND ${curCondition}`
          } else if (splitCondition !== fields[index-1] && splitCondition === fields[index+1]) {
            return `    AND (${curCondition}`
          } else if (splitCondition !== fields[index+1] && splitCondition === fields[index-1]) {
            return ` AND ${curCondition})\n`
          } else {
            return `    AND (${curCondition})\n`
          }
        } else {
          if (splitCondition === fields[index-1] && splitCondition === fields[index+1]) {
            return ` OR ${curCondition}`
          } else if (splitCondition !== fields[index-1] && splitCondition === fields[index+1]) {
            return `    OR (${curCondition}`
          } else if (splitCondition !== fields[index+1] && splitCondition === fields[index-1]) {
            return ` OR ${curCondition})\n`
          } else {
            return `    OR (${curCondition})\n`
          }
        }
      }
    }
  );
  groupedConditions = 'AND (' + queryConditions.join("") + ')';
  return groupedConditions;
}

// call the select statement from models for GET request
exports.get_data = async function (req,res) {
  try {
    //parse params from URL
    const schema = req.query.schema;
    const values = req.query.values;
    let conditions = req.query.conditions;
    console.log(conditions);
    if (!conditions) {
      conditions = '\n';
    } else {
      //set up conditional statement in SQL format
      conditions = groupConditions(conditions);
    }
    console.log(conditions);
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

    return res.status(200).json(result);
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
    
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    } else {
      const defResult = [{ schema_name: 'public' }];
      return res.status(200).json(defResult);
    }
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
