import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import './App.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect() {
  const classes = useStyles();
  const [schema, setSchema] = React.useState('');

  const handleChange = (event) => {
    setSchema(event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="simple-select-outlined-label">Research Type</InputLabel>
        <Select
          labelId="imple-select-outlined-label"
          id="simple-select-outlined"
          value={schema}
          onChange={handleChange}
          label="Research Type"
          className="select-styling"
        >
          <MenuItem value={'alzheimer'}>Alzheimer</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
