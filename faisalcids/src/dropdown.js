import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { DataGrid } from '@material-ui/data-grid';

import WhereSelector from './WhereSelector';
import './dropdown.css';

import CsvDownload from 'react-json-to-csv'
import { Tooltip } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const ColorButton = withStyles(() => ({
  root: {
    color: '#fff',
    borderColor: green[500],
    '&:hover': {
      backgroundColor: green[400],
      color: '#000'
    },
  },
}))(Button);

export default function SimpleSelect() {
  const classes = useStyles();
  const [schema, setSchema] = useState('');
  const [values, setValues] = useState([]);
  const [valueOptions, setValueOptions] = useState([]);
  const [numberOfWhereSelectors, setNumberOfWhereSelectors] = useState(0);
  const [whereSelectorChoices, setWhereSelectorChoices] = useState([]);
  const [whereSelectorOptions, setWhereSelectorOptions] = useState({});
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tablePage, setTablePage] = useState(1);
  const [dataType, setDataType] = useState({});
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    getSchemas();
  });

  const baseURL = 'http://localhost:4000/data/?schema=';
  const baseRangeURL = 'http://localhost:4000/range/?schema=';
  const baseValueURL = 'http://localhost:4000/values/?schema=';
  const baseQueryURL = 'http://localhost:4000/query/?schema=';
  const baseSchemaURL = 'http://localhost:4000/schemas';

  const dataTypeTranslation = {
    'integer': 'number',
    'double precision': 'number',
    'date': 'date',
    'boolean': 'boolean',
    'character varying': 'string'
  };

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  function putQuote(value) {
    return "'" + value + "'";
  }

  function getSchemas() {
    if (schemas.length === 0) {
      fetch(baseSchemaURL).then(async response => {
        let data = await response.json()
        data = data.map(value => value.schema_name)
        setSchemas(data)
      })
    }
  }

  // Handles changes to the schema selector and populates the field selector values
  const handleChangeSelect = (event) => {
    // Set schema value to selected value
    setSchema(event.target.value);
    const curSchema = event.target.value
    setValues([])
    setValueOptions([])
    setWhereSelectorChoices([])
    setWhereSelectorOptions({})
    setNumberOfWhereSelectors(0)
    // Fetch all values present in schema
    fetch(baseValueURL + curSchema).then(async response => {
      // Wait for data to be returned
      let data = await response.json()
      let dataTypes = {}
      // Create a datatypes object, containing type information for each value in schema
      data.forEach(value => {
        dataTypes[value.column_name] = dataTypeTranslation[value.data_type]
      })
      // Assign datatypes to datatype object
      setDataType(dataTypes)
      // Create array of all fields in schema
      data = data.map(value => value.column_name)
      // Filter values such that only unique fields exist in array
      // Changes can be made to avoid needing this
      data = data.filter(onlyUnique)
      // Sort values for display
      data.sort()
      // Set options for value selector to sorted and filtered field array
      setValueOptions(data)
    })
  };

  // Handles when the multiple selector is changed, and populates where selectors
  const handleChangeMultiple = (event, values) => {
    // Set selector value to values selected
    setValues(values);
    const newValues = values
    const curValues = Object.keys(whereSelectorOptions)
    let diff
    // Need to handle values being added and removed from selector
    if (newValues.length > curValues.length) {
      // Case when value is added to selector
      // Obtain the newly added value
      diff = newValues.filter(x => curValues.indexOf(x) === -1)[0]
      if (diff) {
        // Fetch value options for the selected field
        fetch(baseRangeURL + schema + '&value=' + diff).then(
          async response => {
            // Wait for data to be returned
            let data = await response.json()
            // Create array from values returned
            data = data.map(value => value[diff])
            // Filter values such that null is removed from array
            // Changes can be made to avoid needing this
            const filteredData = data.filter(value => {return value != null})
            // Sort the values for display, based on type
            filteredData.sort((a,b) => {
              if (dataType[diff] === 'number') {
                return a-b
              } else if (dataType[diff] === 'string') {
                return a.localeCompare(b)
              }
            })
            // Assign options to object containing all past/present selected values
            setWhereSelectorOptions({...whereSelectorOptions, [diff]: filteredData})
          }
        )
      }
    } else {
      // Case when value is removed
      // Want to remove the where selector corresponding to the removed field
      // Get list of currently selected values in where selectors
      const choiceValues = whereSelectorChoices.map(selector => {
        return selector['value']
      })
      // Obtain the removed value
      diff = choiceValues.filter(x => newValues.indexOf(x) === -1)[0]
      if (diff) {
        // Get the current where selectors
        const curChoices = [...whereSelectorChoices]
        let diffIndex = []
        // Find the index of the where selector that needs to be removed
        curChoices.forEach((value, index) => {
          if (value['value'] === diff) {
            diffIndex.push(index)
          }
        })
        // If indexes are found, remove all where selectors with the removed value
        if (diffIndex.length > 0) {
          diffIndex.slice().reverse().forEach(ind => {
            setNumberOfWhereSelectors(state => {
              const nextValue = state - 1;
              if (nextValue < 0) {
                return state;
              }
              return nextValue;
            });
            // Remove selector from array
            curChoices.splice(ind, 1)
          })
          // Update where selector array
          setWhereSelectorChoices(curChoices)
        }
      }
    }
  };

  // Exports the query and selections to a txt file, allowing the user to re-import their selections
  function exportQuery() {
    // Assign all variables to be exported as a copy to an object
    const exp = {}
    exp['whereSelector'] = [...whereSelectorChoices];
    exp['schema'] = [...schema];
    exp['values'] = [...values];
    exp['dataType'] = [...dataType];
    exp['numberOfWhereSelectors'] = [...numberOfWhereSelectors];
    exp['whereSelectorOptions'] = [...whereSelectorOptions];
    exp['valueOptions'] = [...valueOptions];
    // Generate a request based on the current selections
    const request = generateRequest(baseQueryURL);
    // Declare headers for the GET request
    let headers = new Headers();
    headers.append('Content-Type', 'text/plain; charset=UTF-8');
    // Query the 'query' route to obtain the formulated query based on the selections
    fetch(request, headers).then(async response => {
      let query = '';
      const data = await response.json();
      // Text formatting for output txt file
      const spacer = '########################\n';
      query = data.query;
      let expJSON = '';
      expJSON += spacer;
      expJSON += '\n';
      expJSON += 'Query\n';
      expJSON += '\n';
      expJSON += spacer;
      expJSON += '\n';
      // Insert query
      expJSON += query;
      expJSON += '\n';
      expJSON += spacer;
      expJSON += '\n';
      expJSON += '\n';
      expJSON += '\n';
      expJSON += spacer;
      expJSON += '\n';
      expJSON += 'Exported Selections\n';
      expJSON += '\n';
      expJSON += spacer;
      expJSON += '\n';
      // Insert metadata for re-import as a JSON string
      expJSON += JSON.stringify(exp);
      const contentType = "application/json;charset=utf-8;";
      // Create a temporary element for download and remove after completion
      const a = document.createElement('a');
      a.download = 'export.txt';
      a.href = 'data:' + contentType + ',' + encodeURIComponent(expJSON);
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  // Handles the upload of an imported selections file
  async function handleUpload(event) {
    // Get uploaded file
    const files = event.target.files;
    
    if (files.length > 0) {
      // Read uploaded file
      const reader = new FileReader();
      let file = {};
      reader.readAsText(files[0]);
      reader.onload = () => {
        let file = '';
        const lines = reader.result.split('\n');
        // Search for specific line in file that indicates location of metadata
        const startIndex = lines.findIndex(value => value === 'Exported Selections');
        if (startIndex > 0) {
          // Pull out metadata by indexing line array a set number of lines after identifier index
          file = lines[startIndex + 4];
          // Store the results of the file into the designated variables
          storeResults(file);
        }
      }
      function storeResults(result) {
        // Store all selections and variables into their designated variables
        if (result) {
          // Convert JSON string to an object
          file = JSON.parse(result);
          setValues(file.values);
          setSchema(file.schema);
          setDataType(file.dataType);
          setNumberOfWhereSelectors(file.numberOfWhereSelectors);
          setWhereSelectorOptions(file.whereSelectorOptions);
          setValueOptions(file.valueOptions);
          setWhereSelectorChoices(file.whereSelector);
        }
      }
    }
    // Clear out current value in file input
    const oldInput = document.getElementById('queryImport');
    oldInput.value = '';
  }

  // Ensure all selectors have a value populated
  function handleValidation() {
    let formIsValid = true;
    // Loop through each whereSelector and determine if any fields are unselected
    whereSelectorChoices.forEach(selector => {
      const field = selector['value'];
      const relation = selector['relation'];
      const limit = selector['limit'];
      // If any field is unselected, indicate that the form is invalid
      if (field === '' || relation === '' || limit === '') {
        formIsValid = false;
      }
      // Loop through each otherCondition selector
      const otherConditions = selector['otherConditions'];
      otherConditions.forEach(condition => {
        const condRelation = condition['relation'];
        const condLimit = condition['limit'];
        const condType = condition['condition'];
        // If any field is unselected, indicate that the form is invalid
        if (condRelation === '' || condLimit === '' || condType === '') {
          formIsValid = false;
        }
      })
    })
    return formIsValid;
  }

  function generateRequest(inURL) {
    // Join selected values
    const joinedValues = values.join();
    let whereChoices = '';
    // For each where selector, formulate the conditions based on the selected values
    whereSelectorChoices.forEach((selector, index) => {
      // Get the field name
      const field = selector['value'];
      // Get the type of the selected field
      const fieldType = dataType[field];
      // Get the selected relation
      const relation = selector['relation'];
      // Get the selected limit
      let limit = selector['limit'];
      // If the field type is not a number or boolean, put quotes around it
      if (fieldType !== 'number' && fieldType !== 'boolean') {
        limit = putQuote(limit);
      }
      // Add the three components together, appended with a ','
      if (field && relation && limit) {
        whereChoices += field + relation + limit;
      }
      const otherConditions = selector['otherConditions'];
      otherConditions.forEach((condition, index) => {
        const condRelation = condition['relation'];
        let condLimit = condition['limit'];
        const condType = condition['condition'];
        if (fieldType !== 'number' && fieldType !== 'boolean') {
          condLimit = putQuote(condLimit);
        }
        if (condRelation && condLimit && condType) {
          if (condType === 'AND') {
            whereChoices += ',' + field + condRelation + condLimit;
          } else if (condType === 'OR') {
            whereChoices += ';' + field + condRelation + condLimit;
          }
        }
      })

      // Only append 1 less comma than the number of where selectors
      if (index < numberOfWhereSelectors - 1) {
        whereChoices += ',';
      }
    });

    let request = '';
    if (schema && joinedValues) {
      // Formulate the request
      request = inURL + schema + '&values=' + joinedValues
      if (whereChoices) {
        request += '&conditions=' + whereChoices
      }
    }
    return request;
  }
  
  // Handles request generation and gets data
  function handleQuery() {
    // Get the validity status of the selectors
    const formIsValid = handleValidation();
    let request = '';
    // If all selectors are populated, generate the request
    if (formIsValid) {
      request = generateRequest(baseURL);
    }

    // If selectors are all valid, send request to the database
    if (request) {
      console.log(request)
      // Declare headers for the GET request
      let headers = new Headers();
      headers.append('Content-Type', 'text/plain; charset=UTF-8');
      // Fetch the data
      fetch(request, headers).then(async response => {
        // Wait for the data to be returned
        const data = await response.json();
        // Populate table with data when data is returned
        if (data.length >= 0) {
          // Add an id field to each record for table display
          data.forEach((record, index) => {
            record.id = index
          })
          // Assign data
          setData(data);
          // Create column name array for table display
          const columns = values.map(value => (
            {field: value}
          ));
          // Assign column names
          setColumns(columns)
          // Move table page index back to the first page
          setTablePage(1)
        }
      });
    } else {
      alert('Selections are invalid, please ensure that all fields are populated')
    }
  }

  return (
    <div className="selectors">
      <Card>
      <CardContent>
      <span className="buttons">
      <FormControl variant="outlined" className={classes.formControl, 'schema'}>
        <InputLabel id="simple-select-outlined-label">Research Type</InputLabel>
        <Select
          labelId="simple-select-outlined-label"
          id="simple-select-outlined"
          value={schema}
          onChange={handleChangeSelect}
          label="Research Type"
          className="select-styling"
        >
          {
            schemas.map(
              schema => <MenuItem className="schema" key={schema} value={schema}>{schema}</MenuItem>
            )
          }
        </Select>
      </FormControl>
      <span>
        <ColorButton variant="outlined" color="primary" className={classes.margin} onClick={handleQuery}>
          Query
        </ColorButton>
        <ColorButton variant="outlined" color="secondary" className={classes.margin} onClick={exportQuery}>
          Export
        </ColorButton>
        <label className="import">
          <input id="queryImport" type="file" onChange={handleUpload}></input>
          Import
        </label>
      </span>
      </span>
      <div className="autocomplete">
        {
          schema
          &&
          <FormControl>
            <Autocomplete
              multiple
              autoHighlight
              disableListWrap
              id="multiple-autocomplete"
              options={valueOptions}
              onChange={handleChangeMultiple}
              value={values}
              renderInput={(selected, index) => (
                <TextField
                  {...selected}
                  label="Values"
                  variant="outlined"/>
              )}/>
          </FormControl>
        }
        {
          values.length > 0
          &&
          <Tooltip title="Add Condition" aria-label="add" placement="bottom">
            <Fab
              color="primary"
              style={{
                width: 44,
                height: 44,
                marginLeft: 8
              }}
              aria-label="add"
              onClick={
                () => {
                  setNumberOfWhereSelectors(state => state + 1);
                  const curChoices = [...whereSelectorChoices]
                  curChoices.push({
                    relation: '=',
                    limit: '',
                    value: '',
                    options: [],
                    otherConditions: []
                  })
                  setWhereSelectorChoices(curChoices)
                }
              }
              >
              +
            </Fab>
          </Tooltip>
        }
      </div>
        {
          //this needs to have logic to concatenate everything and send the
          //final get query here with onClick
        }
        <span>
          {
            values.length > 0
            &&
            whereSelectorChoices.map(
              (_, index) => (
                <React.Fragment key={"instance-" + index.toString()}>
                  <div className="whereSelector">
                    <span>
                      <WhereSelector
                        values={values}
                        key={index}
                        idx={index}
                        whereSelectorChoices={whereSelectorChoices}
                        setWhereSelectorChoices={setWhereSelectorChoices}
                        whereSelectorOptions={whereSelectorOptions}
                        setNumberOfWhereSelectors={setNumberOfWhereSelectors}
                        schema={schema}
                        dataType={dataType}
                      />
                    </span>
                  </div>
                </React.Fragment>
              )
            )
          }
        </span>
        </CardContent>
        </Card>
        {
          //Button to generate csv from returned JSON
        }
        <div>
          {
            data.length > 0
            &&
            <CsvDownload
              data={data}
              filename="query.csv"
              style={{ //pass other props, like styles
                boxShadow:"inset 0px 1px 0px 0px #e184f3",
                background:"linear-gradient(to bottom, #c123de 5%, #a20dbd 100%)",
                backgroundColor:"#c123de",
                borderRadius:"6px",
                display:"inline-block",
                cursor:"pointer","color":"#ffffff",
                fontSize:"15px",
                fontWeight:"bold",
                padding:"6px 24px",
                textDecoration:"none",
                textShadow:"0px 1px 0px #9b14b3",
                }}
            >
              Generate CSV ✨
            </CsvDownload>
          }
        </div>
        <div className="dataTable">
          {
            data.length >= 0 && columns.length > 0
            &&
            <div>
              <DataGrid
                rows={data}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                page={tablePage}
                onPageChange={(params) => {
                  setTablePage(params.page)
                }}/>
            </div>
          }
        </div>
    </div>
  );
};
