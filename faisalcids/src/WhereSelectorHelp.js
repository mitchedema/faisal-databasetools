import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { Close, Plus } from 'mdi-material-ui';
import { AsyncPaginate } from 'react-select-async-paginate';
import { orange } from '@material-ui/core/colors';
import classNames from 'classnames';
import OtherSelector from './OtherSelector';
import './WhereSelector.css';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function WhereSelectorHelp(props) {
  const classes = useStyles();

  const {
    idx,
    values,
    setWhereSelectorChoices,
    whereSelectorOptions,
    setNumberOfWhereSelectors,
    whereSelectorChoices,
    dataType,
    addOther
  } = props;

  const [curSelectorValue, setCurSelectorValue] = useState('');
  const [focus, setFocus] = useState(false);
  const [outline, setOutline] = useState(false);
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

  useEffect(() => {
    let curChoices = [...whereSelectorChoices];
    const curOptions = whereSelectorOptions[curChoices[idx]['value']]
    curChoices[idx]['options'] = curOptions;
    curChoices[idx]['otherConditions'].forEach(otherCondition => {
      otherCondition['options'] = curOptions;
    })
    setWhereSelectorChoices(curChoices);
    console.log(whereSelectorOptions);
  }, [])

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
    curChoices[idx]['error'] = false
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

  const handleCheckbox = (event) => {
    const curChoices = [...whereSelectorChoices]
    curChoices[idx]['notNull'] = event.target.checked
    setWhereSelectorChoices(curChoices)
  }

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

  const getDisabledFields = () => {
    return whereSelectorChoices[idx]['notNull']
  }

  const getClassName = () => {
    let fullClassName;
    if (getDisabledFields()) {
      fullClassName = 'disabled';
    } else {
      if (getErrorState()) {
        fullClassName = 'error';
      }
    }
    return fullClassName
  }

  // Get set of relation choices based on data type of value
  const getRelationChoices = (value) => {
    if (dataType[whereSelectorChoices[idx]['value']] === 'number') {
      return numberRelationChoices;
    } else {
      return stringRelationChoices;
    }
  }

  const getErrorState = () => {
    if (getDisabledFields()) {
      if (whereSelectorChoices[idx]['value']) {
        return false;
      } else {
        return whereSelectorChoices[idx]['error'];
      }
    } else {
      if (whereSelectorChoices[idx]['value'] !== ''
          && whereSelectorChoices[idx]['relation'] !== ''
          && whereSelectorChoices[idx]['limit'] !== '') {
        return false;
      } else {
        return whereSelectorChoices[idx]['error'];
      }
    }
  }

  const focusEvent = () => {
    setFocus(true);
    setOutline(true);
  }

  const blurEvent = () => {
    setFocus(false);
    setOutline(false);
  }

  const condClasses = classNames({
    'asySelect': true,
    'focus': focus && outline,
    'outline': outline && !(getClassName() === 'disabled'),
    'error': getClassName() === 'error',
    'disabled': getClassName() === 'disabled'
  })

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
        <FormControl variant="outlined" className={classes.FormControl} error={getErrorState()}>
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
        <FormControl variant="outlined" className={classes.FormControl} error={getErrorState()} disabled={getDisabledFields()}>
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
        <FormControl error={getErrorState()}>
          <AsyncPaginate
            className={condClasses}
            onFocus={focusEvent}
            onBlur={blurEvent}
            onMenuOpen={() => setFocus(true)}
            onMenuClose={() => setFocus(false)}
            value={{label: whereSelectorChoices[idx]['limit'].toString(), value: whereSelectorChoices[idx]['limit']}}
            loadOptions={loadOptions}
            onChange={handleChangeSelect3}
            cacheUniqs={[curSelectorValue, whereSelectorChoices.length]}
            isDisabled={getDisabledFields()}/>
        </FormControl>
        <FormControl>
          <FormControlLabel
            control={<Checkbox checked={whereSelectorChoices[idx]['notNull']} onChange={handleCheckbox}/>}
            label="Not NULL"/>
        </FormControl>
        <Tooltip title="Add AND/OR Condition" aria-label="add" placement="right">
          <IconButton
            className="iconButton"
            disabled={whereSelectorChoices[idx]['value'] === '' || getDisabledFields()}
            onClick={() => {
              const curChoices = [...whereSelectorChoices]
              console.log(curChoices)
              const curConditions = curChoices[idx]['otherConditions']
              // setNumberOfOtherConds(state => state + 1)
              if (curConditions.length <= 1 && addOther) {
                curConditions.push({
                  relation: '=',
                  limit: '',
                  value: whereSelectorChoices[idx]['value'],
                  condition: 'AND',
                  options: whereSelectorChoices[idx]['options'],
                  error: false
                })
                setWhereSelectorChoices(curChoices)
              }
            }}
          >
            <Plus/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Condition" aria-label="remove" placement="right">
          <IconButton
            className="iconButton"
            onClick={() => {}}
          >
            <Close/>
          </IconButton>
        </Tooltip>
      </span>
      <div>
        {
          whereSelectorChoices[idx]['otherConditions'].length > 0 && addOther
          &&
          whereSelectorChoices[idx]['otherConditions'].map((_, index) => (
            <React.Fragment key={"otherCondition-" + index.toString()}>
              <div className="otherSelector">
                <OtherSelector
                  idx={index}
                  parentIdx={idx}
                  whereSelectorChoices={whereSelectorChoices}
                  setWhereSelectorChoices={setWhereSelectorChoices}
                  relationChoices={getRelationChoices()}
                  disabled={getDisabledFields()}>
                </OtherSelector>
                <Tooltip title="Remove AND/OR Condition" aria-label="remove" placement="right">
                  <IconButton
                    className="iconButton"
                    disabled={getDisabledFields()}
                    onClick={() => {
                      if (addOther) {
                        const curChoices = [...whereSelectorChoices]
                        curChoices[idx]['otherConditions'].splice(index, 1)
                        setWhereSelectorChoices(curChoices);
                      }
                    }}
                  >
                    <Close/>
                  </IconButton>
                </Tooltip>
              </div>
            </React.Fragment>
          ))
        }
      </div>
    </span>
  );
}