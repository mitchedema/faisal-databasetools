const { idleCount } = require('./db.js');
const psql = require('./db.js');
const fs = require('fs');

//Task object constructor
const Data = {
};

// generalized query to select data from faisal database
Data.getData = async (values,conditions) => {
  const query_template =
  `SELECT DISTINCT
    ${values},
    subject.RID,
    visit.VISCODE,
    dataset.name
  FROM
    alzheimer.dataset,
    alzheimer.subject,
    alzheimer.visit,
    alzheimer.repeatmeasure
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

// generalized query to select data from faisal database
Data.getRange = async (value) => {
    const query_template =
    `SELECT DISTINCT
      ${value}
    FROM
      alzheimer.dataset,
      alzheimer.subject,
      alzheimer.visit,
      alzheimer.repeatmeasure
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

Data.getQuery = async (values,conditions) => {
  const query_template =
  `SELECT DISTINCT
    ${values}
  FROM
    alzheimer.dataset,
    alzheimer.subject,
    alzheimer.visit,
    alzheimer.repeatmeasure
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
