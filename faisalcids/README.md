# FaisalCIDS React UI

This front end application allows interaction with the FaisalCIDS database through a collection of dropdown and searchable menus. This interface queries data from the [database](https://gitlab.rcg.sfu.ca/faisal-lab/databases/faisal-cids) by communicating with the [API server](https://gitlab.rcg.sfu.ca/faisal-lab/databases/faisal-databasetools/-/tree/develop/api-server), which in turn queries the database. Also, records are associated with [XNAT](https://gitlab.rcg.sfu.ca/faisal-lab/databases/faisal-xnat) records, allowing users to open the XNAT interface to view images for a given record. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To Clone
If cloning separate from the `faisal-database-deploy` parent module

```sh
$ cd $path_to_repo
$ git clone git@gitlab.rcg.sfu.ca:faisal-lab/databases/faisal-databasetools.git
```

## Requirements
Node.js `version 14.x` or above can be installed from [here](https://nodejs.org/en/download/)

## Start front end interface manually
Navigate to the faisalcids folder and install dependencies
```sh
$ cd faisalcids
$ npm install
```

Initiate front end
```sh
$ npm start
```

The front end can now be accessed in the browser by navigating to http://localhost:3000
