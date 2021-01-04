const Data = require('../models/appModel.js');

// call the select statement from models for GET request
exports.select_fem_sdat = async function (req,res) {
  try {
    const result = await Data.getFemSdat();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.select_fem_snc = async function (req,res) {
  try {
    const result = await Data.getFemSnc();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.select_fem = async function (req,res) {
  try {
    console.log('Im here');
    const result = await Data.getFem();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.select_male_sdat = async function (req,res) {
  try {
    const result = await Data.getMaleSdat();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.select_male_snc = async function (req,res) {
  try {
    const result = await Data.getMaleSnc();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.select_male = async function (req,res) {
  try {
    const result = await Data.getMale();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.select_all_data = async function (req,res) {
  try {
    const result = await Data.getAllData();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.select_all_sdat = async function (req,res) {
  try {
    const result = await Data.getAllSdat();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// call the select statement from models for GET request
exports.select_all_snc = async function (req,res) {
  try {
    const result = await Data.getAllSnc();
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json(err);
  }
}