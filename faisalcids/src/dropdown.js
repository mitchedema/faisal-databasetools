import React, { useState } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';

import WhereSelector from './WhereSelector';
import './App.css';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const useMultiStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

function getStyles(value, values, theme) {
  return {
    fontWeight:
      values.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ColorButton = withStyles((theme) => ({
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
  const multiclasses = useMultiStyles();
  const theme = useTheme();
  const [schema, setSchema] = useState('');
  const [values, setValues] = useState([]);
  const [numberOfWhereSelectors, setNumberOfWhereSelectors] = useState(0);
  const [whereSelectorChoices, setWhereSelectorChoices] = useState({
      // 0: {value:, equator:, limit:}
  });

  const handleChangeSelect = (event) => {
    setSchema(event.target.value);
  };
  const handleChangeMultiple = (event) => {
    setValues(event.target.value);
  };

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
          <MenuItem value={'alzheimer'}>Alzheimer</MenuItem>
        </Select>
      </FormControl>
        {
          schema
          &&
          <FormControl className={multiclasses.formControl}>
          <InputLabel id="multiple-chip-label">Values</InputLabel>
          <Select
            labelId="multiple-chip-label"
            id="multiple-chip"
            multiple
            value={values}
            onChange={handleChangeMultiple}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {
              //these need to come from a fetch
              //the fetch below is not correct
              //const myValueOptions = fetch('localhost:4000/values/?${schema})
              //myValueOptions.map(
              //  value => <MenuItem value = {value}> {value} </MenuItem>
              //)
            }
            <MenuItem value={'age'} style={getStyles('age', values, theme)}
            >
              Age
            </MenuItem>
            <MenuItem value={'sex'} style={getStyles('sex', values, theme)}
            >
              Sex
            </MenuItem>
          </Select>
          </FormControl>
        }
        {
          values.length > 0
          &&
          <span>
            <Fab
              color="secondary"
              aria-label="minus"
              onClick={
                () => {
                  setNumberOfWhereSelectors(state => {
                    const nextValue = state - 1;
                    if (nextValue < 0) {
                      return state;
                    }
                    setWhereSelectorChoices(prevState => ({
                      ...prevState,
                      [nextValue]: {},
                    }));
                    return nextValue;
                  });
                }
              }
            >
              -
            </Fab>
            <Fab
              color="primary"
              aria-label="add"
              onClick={
                () => {
                  setNumberOfWhereSelectors(state => state + 1);
                }
              }
            >
              +
            </Fab>
            {
              //this needs to have logic to concatenate everything and send the
              //final get query here with onClick
            }
              <ColorButton variant="outlined" color="primary" className={classes.margin}>
                Query
              </ColorButton>
            {
              Array.from(Array(numberOfWhereSelectors)).map(
                (_, index) => (
                  <WhereSelector
                    values={values}
                    key={index}
                    idx={index}
                    whereSelectorChoices={whereSelectorChoices}
                    setWhereSelectorChoices={setWhereSelectorChoices}
                  />
                )
              )
            }
          </span>
        }
    </div>
  );
};
