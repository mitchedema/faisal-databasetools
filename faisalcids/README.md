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

# Components

## `dropdown.js`
This component houses all of the selectors and buttons that are present in the interface. Within this component exists various other components that are children of the dropdown component. All data is shared from the parent component to the children components.

### Children Components
* `Schema` selector
    * Allows selection of database schema
* `Values` selector
    * Lists values that can be selected from database
* `WhereSelector`
    * Selector set specifying `WHERE` conditions to be applied in query

## `WhereSelector.js`
This component contains a set of three selectors allowing for a `field`, `relation`, and `value` to be specified to formulate a query condition. Any number of conditions can be added by simply pressing a designated addition button.

* `field` selector
    * Specifies the database field that is being conditioned, only fields present in the `values` selector are available as options here
* `relation` selector
    * Specifies the type of comparison to be applied (i.e. <, >, =)
* `value` selector
    * The value to be compared against, constraining the returned `field` value

### Children Components
* OtherSelector
    * Selector set allowing logical `AND` or `OR` operations to be applied between conditions for a given field

## `OtherSelector.js`
This component contains another set of selectors similar to the `WhereSelector`, however, these have the `field` value enforced by its parent `WhereSelector`. The `OtherSelector` allows for logical operations to be applied between conditions if multiple are applied to a single field. Any number of these selectors can also be added by clicking the designated addition button.

* `operation` selector
    * Specifies the logical operation (`AND`/`OR`) to be applied between conditions
* `relation` selector
    * Same as the `WhereSelector`, specifying the type of comparison to be applied
* `value` selector
    * Same as the `WhereSelector`, specifying the value to compare against in the condition
