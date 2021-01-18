import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { AsyncPaginate } from 'react-select-async-paginate';

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
    whereSelectorChoices
  } = props;

  const [curSelectorValue, setCurSelectorValue] = useState('');

  // Handles the change of the value selector
  const handleChangeSelect1 = (event) => {
    let curChoices = [...whereSelectorChoices]
    const curValue = event.target.value
    // Get value options from populated selector options object
    const data = whereSelectorOptions[curValue]
    // Set the value to the currently selected value
    curChoices[idx]['value'] = curValue
    // Reset the limit
    curChoices[idx]['limit'] = ''
    // Changes the possible options for selection
    curChoices[idx]['options'] = data
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
    <span className="selectors">
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
            value => <MenuItem key = {value} value = {value}> {value} </MenuItem>
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
          <MenuItem value={'>'}>{'>'}</MenuItem>
          <MenuItem value={'<'}>{'<'}</MenuItem>
          <MenuItem value={'='}>{'='}</MenuItem>
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
    </span>
  );
}