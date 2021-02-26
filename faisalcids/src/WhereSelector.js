import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { AsyncPaginate } from 'react-select-async-paginate';
import { orange } from '@material-ui/core/colors';
import OtherSelector from './OtherSelector';
import './WhereSelector.css'

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function WhereSelector(props) {
  const classes = useStyles();

  const {
    idx,
    values,
    setWhereSelectorChoices,
    whereSelectorOptions,
    setNumberOfWhereSelectors,
    whereSelectorChoices,
    dataType
  } = props;

  const [curSelectorValue, setCurSelectorValue] = useState('');
  const numberRelationChoices = [
    {
      value: '>',
      label: '>'
    },
    {
      value: '>=',
      label: '≥'
    },
    {
      value: '=',
      label: '='
    },
    {
      value: '<',
      label: '<'
    },
    {
      value: '<=',
      label: '≤'
    }
  ];
  const stringRelationChoices = [
    {
      value: '=',
      label: '='
    }
  ];
  const [otherConditions, setOtherConditions] = useState([]);
  const [numberOfOtherConds, setNumberOfOtherConds] = useState([]);

  // Handles the change of the value selector
  const handleChangeSelect1 = (event) => {
    let curChoices = [...whereSelectorChoices]
    const curValue = event.target.value
    // Get value options from populated selector options object
    const data = whereSelectorOptions[curValue]
    // Set the value to the currently selected value
    curChoices[idx]['value'] = curValue
    // Set the relation back to '='
    curChoices[idx]['relation'] = '='
    // Reset the limit
    curChoices[idx]['limit'] = ''
    // Changes the possible options for selection
    curChoices[idx]['options'] = data
    curChoices[idx]['otherConditions'] = []
    // Assign the selector properties
    setWhereSelectorChoices(curChoices);
    // Set the selector value for change detection
    setCurSelectorValue(curValue)
  };

  // Handles the change of the relation selector
  const handleChangeSelect2 = (event) => {
    // Change and assign the relation value to the selector based on the selection
    const curChoices = [...whereSelectorChoices]
    curChoices[idx]['relation'] = event.target.value
    setWhereSelectorChoices(curChoices)
  };

  // Handles the change of the limit selector
  const handleChangeSelect3 = (event) => {
    // Change and assign the limit value to the selector based on the selection
    const curChoices = [...whereSelectorChoices]
    curChoices[idx]['limit'] = event.value
    setWhereSelectorChoices(curChoices)
  };

  // Disable options that are already selected in another whereSelector
  const getDisabledOptions = (value) => {
    const chosenValues = [];
    whereSelectorChoices.forEach(selector => {
      chosenValues.push(selector['value']);
    })
    if (chosenValues.includes(value)) {
      return true;
    } else {
      return false;
    }
  }

  // Get set of relation choices based on data type of value
  const getRelationChoices = (value) => {
    if (dataType[whereSelectorChoices[idx]['value']] === 'number') {
      return numberRelationChoices;
    } else {
      return stringRelationChoices;
    }
  }

  // Populates and filters the limit option list based on the user input
  const loadOptions = (search, prevOptions) => {
    let allOptions = [];
    let filteredOptions = [];
    const limitOptions = whereSelectorChoices[idx]['options']

    // Format options for selector
    limitOptions.forEach(value => {
      allOptions.push({
        label: value.toString(),
        value: value
      })
    });

    if(!search) {
      // If no search present, show all options
      filteredOptions = allOptions;
    } else {
      // Filter options based on user search
      const searchLower = search.toLowerCase();

      filteredOptions = allOptions.filter(({label}) => label.toString().toLowerCase().startsWith(searchLower));
    }

    // Determine whether there are more options to load when selector is scrolled
    const hasMore = filteredOptions.length > prevOptions.length + 10;

    // Slice options to load 10 options at a time
    const slicedOptions = filteredOptions.slice(
      prevOptions.length,
      prevOptions.length + 10
    );

    // Return options and whether there is more data to load
    return {
      options: slicedOptions,
      hasMore
    };
  }

  return (
    <span>
      <span className="whereSelectors">
        <FormControl variant="outlined" className={classes.FormControl}>
          <Select
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            onChange={handleChangeSelect1}
            className="select-styling"
            value={whereSelectorChoices[idx]['value']}
          >
          {
            values.map(
              value => <MenuItem key = {value} value = {value} disabled={getDisabledOptions(value)}> {value} </MenuItem>
            )
          }
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.FormControl}>
          <Select
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            onChange={handleChangeSelect2}
            value={whereSelectorChoices[idx]['relation']}
          >
            {
              getRelationChoices().map(
                relation => <MenuItem key={relation.value} value={relation.value}> {relation.label} </MenuItem>
              )
            }
          </Select>
        </FormControl>
        <FormControl>
          <AsyncPaginate
            className="asySelect"
            value={{label: whereSelectorChoices[idx]['limit'].toString(), value: whereSelectorChoices[idx]['limit']}}
            loadOptions={loadOptions}
            onChange={handleChangeSelect3}
            cacheUniqs={[curSelectorValue, whereSelectorChoices.length]}/>
        </FormControl>
        <Tooltip title="Add AND/OR Condition" aria-label="add" placement="right">
          <span>
            <Fab
              disabled={whereSelectorChoices[idx]['value'] === ''}
              style={{
                width: 34,
                height: 34,
                marginLeft: 4
              }}
              aria-label="add"
              onClick={
                () => {
                  const curChoices = [...whereSelectorChoices]
                  console.log(curChoices)
                  const curConditions = curChoices[idx]['otherConditions']
                  // setNumberOfOtherConds(state => state + 1)
                  curConditions.push({
                    relation: '=',
                    limit: '',
                    value: whereSelectorChoices[idx]['value'],
                    condition: 'AND',
                    options: whereSelectorChoices[idx]['options']
                  })
                  setWhereSelectorChoices(curChoices)
                }
              }
              >
              +
            </Fab>
          </span>
        </Tooltip>
        <Tooltip title="Remove Condition" aria-label="remove" placement="right">
          <Fab
            key={"remove-"+idx.toString()}
            color="secondary"
            style={{
              width: 44,
              height: 44,
              marginLeft: 8
            }}
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
                curChoices.splice(idx, 1)
                setWhereSelectorChoices(curChoices);
              }
            }
          >
            -
          </Fab>
        </Tooltip>
      </span>
      <div>
        {
          whereSelectorChoices[idx]['otherConditions'].length > 0
          &&
          whereSelectorChoices[idx]['otherConditions'].map((_, index) => (
            <React.Fragment key={"otherCondition-" + index.toString()}>
              <div className="otherSelector">
                <OtherSelector
                  idx={index}
                  parentIdx={idx}
                  whereSelectorChoices={whereSelectorChoices}
                  setWhereSelectorChoices={setWhereSelectorChoices}
                  relationChoices={getRelationChoices()}>
                </OtherSelector>
                <Tooltip title="Remove AND/OR Condition" aria-label="remove" placement="right">
                  <Fab
                    key={"remove-cond-"+index.toString()}
                    style={{
                      height: 34,
                      width: 34,
                      marginLeft: 8
                    }}
                    color="secondary"
                    aria-label="minus"
                    onClick={
                      () => {
                        const curChoices = [...whereSelectorChoices]
                        curChoices[idx]['otherConditions'].splice(index, 1)
                        setWhereSelectorChoices(curChoices);
                      }
                    }
                  >
                    -
                  </Fab>
                </Tooltip>
              </div>
            </React.Fragment>
          ))
        }
      </div>
    </span>
  );
}