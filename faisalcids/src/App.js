import SimpleSelect from "./dropdown"
import './App.css'
import { useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import classNames from 'classnames';
import { HelpCircleOutline, Database } from 'mdi-material-ui';
import Help from "./help";

const TabGroup = withStyles({
  root: {
    // borderBottom: '1px solid #e8e8e8'
    backgroundColor: '#282828'
  },
  indicator: {
    backgroundColor: '#00c2a4'
  }
})(Tabs)

const TabLower = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    marginRight: theme.spacing(4),
    transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#00c2a4',
      opacity: 1
    },
    '&:focus': {
      color: '#00c2a4',
    }
  },
  selected: {
    color: '#00c2a4',
    fontWeight: theme.typography.fontWeightMedium
  }
}))(Tab);

const TabLowerIcon = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    marginRight: theme.spacing(4),
    transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '& .MuiSvgIcon-root': {
      marginBottom: 'unset !important',
      marginLeft: '4px',
      fontSize: '1.25rem'
    },
    '& .MuiTab-wrapper': {
      flexDirection: 'row-reverse'
    },
    '&:hover': {
      color: '#00c2a4',
      opacity: 1
    },
    '&:focus': {
      color: '#00c2a4',
    }
  },
  selected: {
    color: '#00c2a4',
  },
  labelIcon: {
    minHeight: 'unset',
    paddingTop: '6px'
  }
}))(Tab);

const TabIcon = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    minWidth: 'unset',
    opacity: '1 !important',
    '& .MuiSvgIcon-root': {
      marginBottom: 'unset !important',
      fontSize: '1.25rem'
    },
    '&:hover': {
      '& .MuiSvgIcon-root': {
        fill: '#00c2a4',
        opacity: 1
      }
    }
  },
  labelIcon: {
    minHeight: 'unset',
    paddingTop: '6px'
  }
}))(Tab);

function TabPanel(props) {
  const { children, value, index } = props;
  const displayClasses = classNames({
    'hidden-tab': value !== index
  });
  
  return (
    <div
      role="tabpanel"
      className={displayClasses}
      id={`tabpanel-${index}`}
    >
      {children}
    </div>
  );
}

function App() {
  const [tabIndex, setTabIndex] = useState(1);

  const handleTabChange = (event, newValue) => {
    if (newValue == 0) {
      setTabIndex(1);
    } else {
      setTabIndex(newValue);
    }
  }

  return (
    <div className="App">
      <AppBar position="static">
        <TabGroup value={tabIndex} onChange={handleTabChange}>
          <TabIcon disableRipple icon={<Database/>}/>
          <TabLower disableRipple label="FaisalCIDS"/>
          <TabLowerIcon disableRipple label="Help" icon={<HelpCircleOutline/>}/>
        </TabGroup>
      </AppBar>
      <TabPanel value={tabIndex} index={1}>
        <SimpleSelect/>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <Help/>
      </TabPanel>
    </div>
  );
}

export default App;
