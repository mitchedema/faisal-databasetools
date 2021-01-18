import React, { useState } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField'
import { DataGrid } from '@material-ui/data-grid'

import WhereSelector from './WhereSelector';
import './App.css';

import CsvDownload from 'react-json-to-csv'

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

  const baseURL = 'http://localhost:4000/data/?schema=';
  const baseRangeURL = 'http://localhost:4000/range/?schema=';
  const baseValueURL = 'http://localhost:4000/values/?schema=';

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

  // Handles changes to the schema selector and populates the field selector values
  const handleChangeSelect = (event) => {
    // Set schema value to selected value
    setSchema(event.target.value);
    const curSchema = event.target.value
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

  // Handles request generation and gets data
  function handleQuery() {
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
      if (fieldType !== 'number' && fieldType !== 'boolean') {;
        limit = putQuote(limit)
      }

      // Add the three components together, appended with a ','
      whereChoices += field + relation + limit;
      // Only append 1 less comma than the number of where selectors
      if (index < numberOfWhereSelectors - 1) {
        whereChoices += ',';
      }
    });

    if (schema && joinedValues) {
      // Formulate the request
      let request = baseURL + schema + '&values=' + joinedValues
      if (whereChoices) {
        request += '&conditions=' + whereChoices
      }
      // Declare headers for the GET request
      let headers = new Headers();
      headers.append('Content-Type', 'text/plain; charset=UTF-8');
      // Fetch the data
      fetch(request, headers).then(async response => {
        // Wait for the data to be returned
        const data = await response.json();
        // Populate table with data when data is returned
        if (data.length > 0) {
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
    }
  }

  return (
    <div className="selectors">
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="simple-select-outlined-label">Research Type</InputLabel>
        <Select
          labelId="simple-select-outlined-label"
          id="simple-select-outlined"
          value={schema}
          onChange={handleChangeSelect}
          label="Research Type"
          className="select-styling"
        >
          <MenuItem key={'a'} value={'alzheimer'}>Alzheimer</MenuItem>
        </Select>
      </FormControl>
        {
          schema
          &&
          <FormControl>
            <Autocomplete
              multiple
              autoHighlight
              id="multiple-autocomplete"
              options={valueOptions}
              onChange={handleChangeMultiple}
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
          <Fab
            color="primary"
            aria-label="add"
            onClick={
              () => {
                setNumberOfWhereSelectors(state => state + 1);
                const curChoices = [...whereSelectorChoices]
                curChoices.push({
                  relation: '=',
                  limit: '',
                  value: '',
                  options: []
                })
                setWhereSelectorChoices(curChoices)
              }
            }
            >
            +
          </Fab>
        }
        {
          //this needs to have logic to concatenate everything and send the
          //final get query here with onClick
        }
        <ColorButton variant="outlined" color="primary" className={classes.margin} onClick={handleQuery}>
          Query
        </ColorButton>
        <span>
          {
            values.length > 0
            &&
            whereSelectorChoices.map(
              (_, index) => (
                <React.Fragment key={"instance-" + index.toString()}>
                  <div>
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
                      />
                      <Fab
                        key={"remove-"+index.toString()}
                        color="secondary"
                        aria-label="minus"
                        onClick={
                          () => {
                            setNumberOfWhereSelectors(state => {
                              const nextValue = state - 1;
                              if (nextValue < 0) {
                                return state;
                              }
                              return nextValue;
                            });
                            const curChoices = [...whereSelectorChoices]
                            curChoices.splice(index, 1)
                            setWhereSelectorChoices(curChoices);
                          }
                        }
                      >
                        -
                      </Fab>
                    </span>
                  </div>
                </React.Fragment>
              )
            )
          }
        </span>
        <div className="dataTable">
          {
            data.length > 0
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
                textShadow:"0px 1px 0px #9b14b3"
                }}
            >
              Generate CSV ✨
            </CsvDownload>
          }
        </div>
    </div>
  );
};
