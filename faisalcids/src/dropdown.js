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
  const [option2, setOption2] = React.useState('');
  const [option3, setOption3] = React.useState('');

  const handleChangeSelect1 = (event) => {
    setSchema(event.target.value);
  };
  const handleChangeSelect2 = (event) => {
    setSchema(event.target.value);
  };
  const handleChangeSelect3 = (event) => {
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
          onChange={handleChangeSelect1}
          label="Research Type"
          className="select-styling"
        >
          <MenuItem value={'alzheimer'}>Alzheimer</MenuItem>
        </Select>
        {
          schema
          && <Select
            labelId="imple-select-outlined-label"
            id="simple-select-outlined"
            value={option2}
            onChange={handleChangeSelect2}
            label="Research Type"
            className="select-styling"
          >
            <MenuItem value={'alzheimer'}>Alzheimer</MenuItem>
          </Select>
        }
        {
          schema
          && option2
          && <Select
            labelId="imple-select-outlined-label"
            id="simple-select-outlined"
            value={option}
            onChange={handleChangeSelect3}
            label="Research Type"
            className="select-styling"
          >
            <MenuItem value={'alzheimer'}>Alzheimer</MenuItem>
          </Select>
        }
      </FormControl>
    </div>
  );
}