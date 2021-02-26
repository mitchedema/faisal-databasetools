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
    parentIdx,
    whereSelectorChoices,
    setWhereSelectorChoices,
    relationChoices
  } = props;

  const [curSelectorValue, setCurSelectorValue] = useState('');

  // Handles the change of the value selector
  const handleChangeSelect1 = (event) => {
    let curChoices = [...whereSelectorChoices]
    const curValue = event.target.value
    curChoices[parentIdx]['otherConditions'][idx]['condition'] = curValue;
    // Assign the selector properties
    setWhereSelectorChoices(curChoices);
  };

  // Handles the change of the relation selector
  const handleChangeSelect2 = (event) => {
    // Change and assign the relation value to the selector based on the selection
    const curChoices = [...whereSelectorChoices]
    const curValue = event.target.value;
    curChoices[parentIdx]['otherConditions'][idx]['relation'] = curValue
    setWhereSelectorChoices(curChoices)
  };

  // Handles the change of the limit selector
  const handleChangeSelect3 = (event) => {
    // Change and assign the limit value to the selector based on the selection
    const curChoices = [...whereSelectorChoices]
    curChoices[parentIdx]['otherConditions'][idx]['limit'] = event.value
    setWhereSelectorChoices(curChoices)
  };

  // Populates and filters the limit option list based on the user input
  const loadOptions = (search, prevOptions) => {
    let allOptions = [];
    let filteredOptions = [];
    const limitOptions = whereSelectorChoices[parentIdx]['otherConditions'][idx]['options']

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
      <span className="otherSelectors">
        <FormControl variant="outlined" className={classes.FormControl}>
          <Select
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            onChange={handleChangeSelect1}
            className="select-styling"
            value={whereSelectorChoices[parentIdx]['otherConditions'][idx]['condition']}
          >
            <MenuItem key={'AND'} value={'AND'}> {'AND'} </MenuItem>
            <MenuItem key={'OR'} value={'OR'}> {'OR'} </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.FormControl}>
          <Select
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            onChange={handleChangeSelect2}
            value={whereSelectorChoices[parentIdx]['otherConditions'][idx]['relation']}
          >
            {
              relationChoices.map(
                relation => <MenuItem key={relation.value} value={relation.value}> {relation.label} </MenuItem>
              )
            }
          </Select>
        </FormControl>
        <FormControl>
          <AsyncPaginate
            className="asySelect"
            value={{label: whereSelectorChoices[parentIdx]['otherConditions'][idx]['limit'].toString(), value: whereSelectorChoices[parentIdx]['otherConditions'][idx]['limit']}}
            loadOptions={loadOptions}
            onChange={handleChangeSelect3}
            cacheUniqs={[curSelectorValue, whereSelectorChoices.length]}/>
        </FormControl>
      </span>
    </span>
  );
}