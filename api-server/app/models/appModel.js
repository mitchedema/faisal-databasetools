const { idleCount } = require('./db.js');
const psql = require('./db.js');

//Task object constructor
const Data = {
};

const query_template =
      `SELECT 
        SUBJECTID,
        VISCODE,
        FLDSTRNG,
        AGE,
        SEX,
        DX_STRATIFICATION,
        APOE4,
        APOE2,
        APOE3,
        MMSE,
        CDRSB,
        ADAS11,
        ADAS13
      FROM 
        alzheimer.subject,
        alzheimer.visit
      WHERE
        subject.id = visit.subjectid
        `

// select statement for GET request females with sDat diagnosis
Data.getFemSdat = async () => {
  try{
    const condition = `AND
                   sex = 'Female'
                 AND
                   dx_stratification = 'sDAT';`
    const client = await psql.connect();
    const result = await client.query(query_template + condition);
    await client.release();
    return result;
  } catch(err) {
    console.log(err)
  }
}

// select statement for GET request females with sNC diagnosis
Data.getFemSnc = async () => {
  try{
    const condition = `AND
                  sex = 'Female'
                AND
                  dx_stratification = 'sNC';`
    const client = await psql.connect();
    const result = await client.query(query_template + condition);
    await client.release();
    return result;
  } catch(err) {
    console.log(err)
  }
}

// select statement for GET request all females
Data.getFem = async () => {
    try{
        const condition = `AND
                      sex = 'Female';`
        const client = await psql.connect();
        const result = await client.query(query_template+condition);
        await client.release();
        return result;
      } catch(err) {
        console.log(err)
      }
}

// select statement for GET request males with sDAT diagnosis
Data.getMaleSdat = async () => {
    try{
        const condition = `AND
                      sex = 'Male'
                    AND
                      dx_stratification = 'sDAT';`
        const client = await psql.connect();
        const result = await client.query(query_template+condition);
        await client.release();
        return result;
      } catch(err) {
        console.log(err)
      }
}

// select statement for GET request males with sNC diagnosis
Data.getMaleSnc = async () => {
    try{
        const condition = `AND
                      sex = 'Male'
                    AND
                      dx_stratification = 'sNC';`
        const client = await psql.connect();
        const result = await client.query(query_template+condition);
        await client.release();
        return result;
      } catch(err) {
        console.log(err)
      }
}

// select statement for GET request all males
Data.getMale = async () => {
    try{
        const condition = `AND
                      sex = 'Male';`
        const client = await psql.connect();
        const result = await client.query(query_template+condition);
        await client.release();
        return result;
      } catch(err) {
        console.log(err)
      }
}

// select statement for GET request for all data
Data.getAllData = async () => {
    try{
        condition = `;`
        const client = await psql.connect();
        const result = await client.query(query_template+condition);
        await client.release();
        return result;
      } catch(err) {
        console.log(err)
      }
}

// select statement for GET request all with sDAT diagnosis
Data.getAllSdat = async () => {
    try{
        const condition = `AND
                      dx_stratification = 'sDAT';`
        const client = await psql.connect();
        const result = await client.query(query_template+condition);
        await client.release();
        return result;
      } catch(err) {
        console.log(err)
      }
}

// select statement for GET request all with sNC diagnosis
Data.getAllSnc = async () => {
    try{
        const condition = `AND
                      dx_stratification = 'sNC';`
        const client = await psql.connect();
        const result = await client.query(query_template+condition);
        await client.release();
        return result;
      } catch(err) {
        console.log(err)
      }
}

module.exports= Data;
