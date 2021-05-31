import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './help.css';
import './WhereSelector.css';
import './App.css';
import './dropdown.css';
import Typography from '@material-ui/core/Typography';
import { Select, FormControl, InputLabel, MenuItem, Tooltip, TextField, Accordion, AccordionSummary, AccordionDetails, IconButton, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { InformationOutline, Plus } from 'mdi-material-ui';
import { green } from '@material-ui/core/colors';
import WhereSelectorHelp from './WhereSelectorHelp';

const InfoTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#464646',
    color: 'white',
    maxWidth: 200,
    fontSize: '0.8em',
  }
}))(Tooltip);

const InfoIcon = withStyles(() => ({
  root: {
    marginRight: 8,
    fill: '#4a4a4a',
    right: 0,
    position: 'absolute'
  }
}))(InformationOutline);

const ColorButton = withStyles(() => ({
  root: {
    color: '#fff',
    borderColor: green[500],
    '&:hover': {
      backgroundColor: green[400],
      color: '#000'
    },
    width: 'fit-content',
    marginBottom: '8px'
  },
}))(Button);

function Help() {
  const [valOptions, setValOptions] = useState(['Value 1']);
  const [expanded, setExpanded] = useState('');
  const [whereSelector, setWhereSelector] = useState([{ "relation": ">", "limit": 1, "value": "Value 1", "error": false, "notNull": false, "otherConditions": [{"relation":"<","limit":2,"value":"Value 1","condition":"AND","error":false}] }]);
  const [whereSelectorVal, setWhereSelectorVal] = useState([{ "relation": ">", "limit": '', "value": "Value 1", "error": false, "notNull": false, "otherConditions": [{"relation":"<","limit":'',"value":"Value 1","condition":"AND","error":false}] }]);
  const [formValid, setFormValid] = useState('');
  const whereSelectorOptions = {'Value 1': [1, 2], 'Value 2': ['Option 1', 'Option 2']};
  const dataTypes = {'Value 1': 'number', 'Value 2': 'string'};

  const handleAccordion = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  }

  function handleValidation() {
    let formIsValid = true;
    const whereSelector = [...whereSelectorVal];
    // Loop through each whereSelector and determine if any fields are unselected
    whereSelectorVal.forEach((selector, index) => {
      const field = selector['value'];
      const relation = selector['relation'];
      const limit = selector['limit'];
      const notNull = selector['notNull'];
      // If any field is unselected, indicate that the form is invalid
      if (field === '' || relation === '' || limit === '') {
        if (!notNull) {
          whereSelector[index]['error'] = true;
          formIsValid = false;
        } else {
          if (field === '') {
            whereSelector[index]['error'] = true;
            formIsValid = false;
          }
        }
      }
      // Loop through each otherCondition selector
      const otherConditions = selector['otherConditions'];
      otherConditions.forEach((condition, otherIndex) => {
        const condRelation = condition['relation'];
        const condLimit = condition['limit'];
        const condType = condition['condition'];
        // If any field is unselected, indicate that the form is invalid
        if (condRelation === '' || condLimit === '' || condType === '') {
          // whereSelector[index]['error'] = true;
          if (!notNull) {
            whereSelector[index]['otherConditions'][otherIndex]['error'] = true;
            formIsValid = false;
          }
        }
      })
    })
    if (!formIsValid) {
      alert('Selections are invalid, please ensure that all fields are populated')
    }
    setWhereSelectorVal(whereSelector);
    setFormValid(formIsValid);
  }

  function handleQuery() {
    handleValidation();
  }

  return (
    <div className="helpPage">
      <Card>
        <CardContent className="helpSection">
          <Typography className="bodyText" variant="h4">{"Usage"}</Typography>
          <br/>
          <Typography className="bodyText" variant="body1">{"The FaisalCIDS interface allows you to query the FaisalCIDS database by interacting with a set of selectors to properly condition and constrain the data to be returned."}</Typography>
          <br/>
          <Accordion className="topRounded" expanded={expanded === 'panel1'} onChange={handleAccordion('panel1')}>
            <AccordionSummary>
              <Typography><code>Schema</code> Selector</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="bodyText" variant="body1">{"The first selector beside the \"Query\", \"Export\", and \"Import\" buttons is called the \"Schema\" selector. The Schema selector corresponds to the database schema, or research interest, that the desired data inhabits."}</Typography>
              <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  marginTop: '8px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  backgroundColor: '#404040',
                  width: 'fit-content'
              }}>
                <FormControl variant="outlined" className="schema">
                  <InputLabel id="simple-select-outlined-label">Research Type</InputLabel>
                  <Select
                    labelId="simple-select-outlined-label"
                    id="simple-select-outlined"
                    label="Research Type"
                    className="select-styling"
                    value={"schema1"}
                  >
                    <MenuItem className="schema" value={"schema1"}>Schema 1</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordion('panel2')}>
            <AccordionSummary>
              <Typography><code>Fields</code> Selector</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="bodyText" variant="body1">{"After a schema has been selected, another selector, this time a searchable one, will appear."}</Typography>
              <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 8px 10px 8px',
                  marginTop: '8px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#404040',
                  width: 'fit-content'
              }}>
                <FormControl>
                  <Autocomplete
                    multiple
                    autoHighlight
                    disableListWrap
                    id="multiple-autocomplete"
                    // id="multiple-chip"
                    options={["Value 1", "Value 2"]}
                    onChange={(event, values) => {
                      setValOptions(values);
                      const curW = [...whereSelector];
                      const curWVal = [...whereSelectorVal];
                      if (!values.includes(curW[0].value)) {
                        curW[0].value = '';
                        curW[0].relation = '=';
                        curW[0].limit = '';
                        curW[0].otherConditions = [];
                        curWVal[0].value = '';
                        curWVal[0].relation = '=';
                        curWVal[0].limit = '';
                        curWVal[0].otherConditions = [];
                        curWVal[0].error = false;
                        setWhereSelector(curW);
                        setWhereSelectorVal(curWVal);
                      }
                    }}
                    value={valOptions}
                    renderOption={(option, { selected }) => (
                      <React.Fragment>
                        {option}
                        <InfoTooltip title={<React.Fragment>{"Info for: " + option + ", Type: " + dataTypes[option]}</React.Fragment>} placement="left">
                          <InfoIcon/>
                        </InfoTooltip>
                      </React.Fragment>
                    )}
                    renderInput={(selected, index) => (
                      <TextField
                        {...selected}
                        label="Fields"
                        variant="outlined"/>
                    )}/>
                </FormControl>
                {
                  valOptions.length > 0
                  &&
                  <Tooltip title="Add Condition" aria-label="add" placement="bottom">
                    <IconButton className="iconButton">
                      <Plus/>
                    </IconButton>
                  </Tooltip>
                }
              </div>
              <Typography className="bodyText" variant="body1">{"This selector is the \"Fields\" selector, where you can specify the exact database fields that are desired. These fields all belong to the previously selected schema."}</Typography>
              <Typography className="bodyText" variant="body1">{"By simply typing into the input field, search results will appear, displaying the possible fields that are similar to the entered text. Any number of fields can be selected from the list of options."}</Typography>
              <Typography className="bodyText" variant="body1">{"For more information about each field, the small information icon to the right of each option can be hovered over, giving a brief description of the associated field. Give it a try!"}</Typography>
              <Typography className="bodyText" variant="body1">{"After a single value is selected, a \"+\" button appears, allowing conditions to be added"}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleAccordion('panel3')}>
            <AccordionSummary>
              <Typography><code>WHERE</code> Condition Selector Set</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="bodyText" variant="body1">To apply conditions in order to constrain the returned set of data, certain parameters need to be specified. Those parameters are the <code>field</code>, <code>relation</code>, and <code>value</code> selectors.</Typography>
              {
                valOptions.length > 0 ?
                <div className="whereSelector" style={{
                  padding: '8px',
                  marginTop: '8px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#404040',
                  width: 'fit-content'
                }}>
                  <span>
                    <WhereSelectorHelp
                      values={valOptions.length > 0 ? valOptions : ['No Options']}
                      key={0}
                      idx={0}
                      whereSelectorChoices={whereSelector}
                      setWhereSelectorChoices={setWhereSelector}
                      whereSelectorOptions={whereSelectorOptions}
                      setNumberOfWhereSelectors={() => {}}
                      schema={'schema'}
                      dataType={dataTypes}
                      addOther={false}
                    />
                  </span>
                </div>
                :
                <Typography variant="h6" style={{
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  paddingLeft: '10px',
                  fontWeight: 'bold',
                  marginTop: '8px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#404040'
                }}>Please select an option in the <code>Fields</code> selector above</Typography>
              }
              <Typography variant="h6"><code>field</code> selector</Typography>
              <Typography className="bodyText" variant="body1">This selector allows you to specify the database field to be conditioned, such that any values returned for this field are limited to conform to the specified conditions. Only values that are present in the <code>Fields</code> selector are options in this selector, as conditions can only be applied to fields that are being queried from the database.</Typography>
              <br/>
              <Typography variant="h6"><code>relation</code> selector</Typography>
              <Typography className="bodyText" variant="body1">This selector specifies the type of comparison to be applied for the given field. Examples of these relations are <code>{"<"}</code>, <code>{"="}</code>, and <code>{">"}</code>. The set of options available here are dependent on the type of field selected in the <code>field</code> selector (number, string, etc.). Numbers have a larger set of options as they can be compared in terms of magnitude, whereas strings can only be compared for equality.</Typography>
              <br/>
              <Typography variant="h6"><code>value</code> selector</Typography>
              <Typography className="bodyText" variant="body1">This selector specifies the value to be compared against, constraining the database to only return records that pass these conditions. This selector is already populated with all value posibilities of the field selected in the <code>field</code> selector.</Typography>
              <br/>
              <Typography variant="h6"><code>Not NULL</code> checkbox</Typography>
              <Typography className="bodyText" variant="body1">In the database, most columns are allowed to store NULL values, as not every field for every record will be populated with a value. In the event that only non-NULL values are desired for a field, you can select the checkbox such that the database will return only populated values for a given field.</Typography>
              <Typography className="bodyText" variant="body1">By selecting this checkbox, however, no further conditions can be applied as conditions will inherently return non-NULL values. As can be seen in the above example, when the checkbox is selected (try it), all selectors but the <code>field</code> selector are disabled. This checkbox is only required in the case where strictly non-NULL values are to be queried from the database for a particular field. Applying conditions to a given field and specifying for it to be non-NULL is essentially redundant.</Typography>
              <br/>
              <Typography className="bodyText" variant="body1">If a field is removed from the <code>Fields</code> selector, and the same field was selected in a selector set, the entire selector set will be removed as the conditioned field is no longer being queried from the database. For the purpose of this demo, the selector set shown above will only be cleared. Conditions can be removed as necessary, simply by clicking the associated "X" button. Lastly, the "+" button, not to be confused with the "+" button beside the <code>Fields</code> selector, adds yet another condition, however, this condition is slightly different.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleAccordion('panel4')}>
            <AccordionSummary>
              <Typography><code>AND</code>/<code>OR</code> Condition Grouping</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="bodyText" variant="body1">The final component of this interface is the conditional grouping selector set. This selector set allows you to apply further conditions within a single field, to narrow down the returned data even further.</Typography>
              <Typography className="bodyText" variant="body1">When querying from a database, logical operations are used to combine individual conditions. When multiple conditions are specified for a single field, typically these conditions are grouped and executed within the field first, before coalescing them with the conditions of other fields</Typography>
              <Typography className="bodyText" variant="body1">In terms of logical operations there are two main operations used in database queries, the <code>AND</code> operator and the <code>OR</code> operator. These operators are placed between two individual conditions and produce different results based on the type of operator used.</Typography>
              <Typography className="bodyText" variant="body1"><code>AND</code> operations are inclusive, indicating that the surrounding conditions both need to be true for the entire condition to be true.</Typography>
              <Typography className="bodyText" variant="body1"><code>OR</code> conditions are non-inclusive, only requiring one of the surrounding conditions to be true for the entire condition to also be true.</Typography>
              {
                valOptions.length > 0 ?
                <div className="whereSelector" style={{
                  padding: '8px',
                  marginTop: '8px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#404040',
                  width: 'fit-content'
                }}>
                  <span>
                    <WhereSelectorHelp
                      values={valOptions.length > 0 ? valOptions : ['No Options']}
                      key={0}
                      idx={0}
                      whereSelectorChoices={whereSelector}
                      setWhereSelectorChoices={setWhereSelector}
                      whereSelectorOptions={whereSelectorOptions}
                      setNumberOfWhereSelectors={() => {}}
                      schema={'schema'}
                      dataType={dataTypes}
                      addOther={true}
                    />
                  </span>
                </div>
                :
                <Typography variant="h6" style={{
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  paddingLeft: '10px',
                  fontWeight: 'bold',
                  marginTop: '8px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#404040'
                }}>Please select an option in the <code>Fields</code> selector above</Typography>
              }
              <Typography className="bodyText" variant="body1">As can be seen in the selector sets above, there is a second set below the original <code>WHERE</code> condition selector set. This selector set is almost identical to its parent set, with the exception of the first selector containing options for the operator. The <code>field</code> is enforced to be the same as its parent, as well as the set of <code>value</code> options that are also passed down from the parent.</Typography>
              <Typography className="bodyText" variant="body1">When the <code>Not NULL</code> checkbox is selected, all three selectors will be disabled, as there is no need for them to be set when the only constraint is to return non-NULL values.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion className="bottomRounded" expanded={expanded === 'panel5'} onChange={handleAccordion('panel5')}>
            <AccordionSummary>
              <Typography>Querying Data + Selection Import/Export</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6">Querying and Validation</Typography>
              <Typography className="bodyText" variant="body1">Finally, once all selections and conditions have been specified, you can simply press the query button. This will query the database and display the results in a table. If the results are satisfactory, they can be exported to a CSV file by clicking the "Generate CSV" button.</Typography>
              <Typography className="bodyText" variant="body1">If fields are left empty, and the query button is pressed, the interface will display a prompt saying that the selections are invalid. Invalid selector sets are shown as red in the interface, where all three selectors are highlighted in this colour. When all selections are made, the red outline will disappear, and the selections can be queried. Try pressing the query button below, before and after making selections.</Typography>
              {
                valOptions.length > 0 ?
                <div className="whereSelector" 
                  style={{
                    padding: '8px',
                    marginTop: '8px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#404040',
                    width: 'fit-content'
                }}>
                  <ColorButton variant="outlined" color="primary" onClick={handleQuery}>
                    Query
                  </ColorButton>
                  <span>
                    <WhereSelectorHelp
                      values={valOptions.length > 0 ? valOptions : ['No Options']}
                      key={0}
                      idx={0}
                      whereSelectorChoices={whereSelectorVal}
                      setWhereSelectorChoices={setWhereSelectorVal}
                      whereSelectorOptions={whereSelectorOptions}
                      setNumberOfWhereSelectors={() => {}}
                      schema={'schema'}
                      dataType={dataTypes}
                      addOther={true}
                    />
                  </span>
                  <div>
                  {
                    formValid
                    &&
                    <button
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
                        marginTop: '8px'
                      }}
                    >
                      Generate CSV ✨
                    </button>
                  }
                </div>
                </div>                
                :
                <Typography variant="h6" style={{
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  paddingLeft: '10px',
                  fontWeight: 'bold',
                  marginTop: '8px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#404040'
                }}>Please select an option in the <code>Fields</code> selector above</Typography>
              }
              <br/>
              <Typography variant="h6">Import/Export</Typography>
              <Typography className="bodyText" variant="body1">To export the currently made selections, the export button can be clicked. This will download a file to your computer containing 2 components: an SQL query and the information required to re-import the selections. The SQL query can be used to interact directly with the database if required.</Typography>
              <Typography className="bodyText" variant="body1">To import selections from and exported file, the import button can be pressed, opening a file dialog for file selection. Simply select the exported file and the interface will import and populate all of the selector values. Any necessary changes can be made in the interface and the selections can be exported as required.</Typography>
            </AccordionDetails>
          </Accordion>
          <br/>
        </CardContent>
      </Card>
    </div>
  );
}

export default Help;