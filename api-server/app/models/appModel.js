const { idleCount } = require('./db.js');
const psql = require('./db.js');

//Task object constructor
const Data = {
};

// generalized query to select data from faisal database
Data.getData = async (schema,values,conditions) => {
  const query_template =
  `SELECT
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

module.exports= Data;
