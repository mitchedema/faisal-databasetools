const { idleCount } = require('./db.js');
const psql = require('./db.js');

//Task object constructor
const Data = {
};

// generalized query to select data from faisal database
Data.getData = async (schema,values,conditions) => {
  const query_template =
  `SELECT DISTINCT
    ${values}
  FROM
    ${schema}.dataset,
    ${schema}.subject,
    ${schema}.visit,
    ${schema}.repeatmeasure
  WHERE
    dataset.id = subject.datasetid AND
    subject.id = visit.subjectid AND
    visit.id = repeatmeasure.visitid
    ${conditions};
    `
  try{
    const client = await psql.connect();
    const result = await client.query(query_template);
    await client.release();
    return result;
  } catch(err) {
    console.log(err)
  }
}

// get all values in a given schema
Data.getValues = async (schema) => {
  const query_template =
  `SELECT
    column_name,
    data_type
  FROM
    information_schema.columns
  WHERE
    table_schema = '${schema}';`
  try{
    const client = await psql.connect();
    const result = await client.query(query_template);
    await client.release();
    return result;
  } catch(err) {
      console.log(err)
  }
}

// generalized query to select data from faisal database
Data.getRange = async (schema,value) => {
    const query_template =
    `SELECT DISTINCT
      ${value}
    FROM
      ${schema}.dataset,
      ${schema}.subject,
      ${schema}.visit,
      ${schema}.repeatmeasure
    WHERE
      dataset.id = subject.datasetid AND
      subject.id = visit.subjectid AND
      visit.id = repeatmeasure.visitid;
      `
    try{
      const client = await psql.connect();
      const result = await client.query(query_template);
      await client.release();
      return result;
    } catch(err) {
      console.log(err)
    }
}

Data.getSchemas = async () => {
  const query_template =
  `SELECT
    schema_name
  FROM
    information_schema.schemata
  WHERE
    schema_name NOT IN ('information_schema', 'pg_catalog', 'public')
    AND schema_name NOT LIKE 'pg_toast%'
    AND schema_name NOT LIKE 'pg_temp_%';`
  try{
    const client = await psql.connect();
    const result = await client.query(query_template);
    await client.release();
    return result;
  } catch(err) {
    console.log(err)
  }
}

Data.getQuery = async (schema,values,conditions) => {
  const query_template =
  `SELECT DISTINCT
    ${values}
  FROM
    ${schema}.dataset,
    ${schema}.subject,
    ${schema}.visit,
    ${schema}.repeatmeasure
  WHERE
    dataset.id = subject.datasetid AND
    subject.id = visit.subjectid AND
    visit.id = repeatmeasure.visitid
    ${conditions};
    `
  try{
    return { query: query_template };
  } catch(err) {
    console.log(err)
  }
}

module.exports= Data;
