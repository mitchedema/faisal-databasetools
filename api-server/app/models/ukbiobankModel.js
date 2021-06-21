const { idleCount } = require('./db.js');
const psql = require('./db.js');
const fs = require('fs');

function putQuote(values) {
  const vals = values.split(',')
  const valsQuote = vals.map(val => {
    if (!isNaN(val)) {
      return '"' + val + '"'
    } else {
      return val
    }
  })
  const valsString = valsQuote.join(',')
  return valsString
}

//Task object constructor
const Data = {
};

// generalized query to select data from faisal database
Data.getData = async (values,conditions) => {
  values = putQuote(values);
  const query_template =
  `SELECT DISTINCT
    ${values},
    subject.eid,
    visit.VISCODE
  FROM
    ukbiobank.subject,
    ukbiobank.visit,
    ukbiobank.repeatmeasure
  WHERE
    subject.id = visit.subjectid AND
    visit.id = repeatmeasure.visitid
    ${conditions};
    `
  console.log(query_template);
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
    value = putQuote(value)
    const query_template =
    `SELECT DISTINCT
      ${value}
    FROM
      ukbiobank.subject,
      ukbiobank.visit,
      ukbiobank.repeatmeasure
    WHERE
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
  values = putQuote(values)
  const query_template =
  `SELECT DISTINCT
    ${values}
  FROM
    ukbiobank.subject,
    ukbiobank.visit,
    ukbiobank.repeatmeasure
  WHERE
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
