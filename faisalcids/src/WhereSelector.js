import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
  } = props;

  useEffect(() => {
    setWhereSelectorChoices(prevState => ({
      ...prevState,
      [idx]: {
        relation: '=',
        limit: 'one',
        value: '',
      } 
    }));
  }, []);

  const handleChangeSelect1 = (event) => {
    setWhereSelectorChoices(prevState => ({
      ...prevState,
      [idx]: {
          ...prevState[idx],
          value: event.target.value,
      },
    }));
  };
  const handleChangeSelect2 = (event) => {
    setWhereSelectorChoices(prevState => ({
      ...prevState,
      [idx]: {
        ...prevState[idx],
        relation: event.target.value,
      },
    }));
  };
  const handleChangeSelect3 = (event) => {
    setWhereSelectorChoices(prevState => ({
      ...prevState,
      [idx]: {
        ...prevState[idx],
        limit: event.target.value,
      },
    }));
  };

  return (
    <div className="selectors">
      <FormControl variant="outlined" className={classes.FormControl}>
        <Select
          labelId="simple-select-outlined-label"
          id="simple-select-outlined"
          onChange={handleChangeSelect1}
          className="select-styling"
        >
        {
          values.map(
            value => <MenuItem value = {value}> {value} </MenuItem>
          )
        }
        </Select>
      </FormControl>
      <FormControl variant="outlined" className={classes.FormControl}>
        <Select
          labelId="simple-select-outlined-label"
          id="simple-select-outlined"
          onChange={handleChangeSelect2}
        >
          <MenuItem value={'>'}>{'>'}</MenuItem>
          <MenuItem value={'<'}>{'<'}</MenuItem>
          <MenuItem value={'='}>=</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" className={classes.FormControl}>
        <Select
          labelId="simple-select-outlined-label"
          id="simple-select-outlined"
          onChange={handleChangeSelect3}
          className="select-styling"
        >
        {
        //these need to come from a fetch
        //the fetch below is not correct
        //const myValueOptions = fetch('localhost:4000/range/?${value})
        //myLimitOptions.map(
        //  limit => <MenuItem limit = {limit}> {limit} </MenuItem>
        //)
        }
          <MenuItem value={'one'}>one</MenuItem>
          <MenuItem value={'two'}>two</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}