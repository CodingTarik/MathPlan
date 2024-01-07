// Importing necessary dependencies and styles
import './App.css';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import React from 'react';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext } from '@mui/lab';
import SchoolIcon from '@mui/icons-material/School';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PolicyIcon from '@mui/icons-material/Policy';
import SettingsIcon from '@mui/icons-material/Settings';
import $ from 'jquery';
import ExaminationRegulationApp from './pages/examinationregulations.tsx';
//@ts-expect-error json-editor is not typed
import * as JSONEditor from '@json-editor/json-editor';
import 'select2/dist/css/select2.css';
import select2 from 'select2';

import AddModuleFields from './components/module_management';
/**
 * JSX structure representing the entire intern application.
 *
 * @function App
 * @returns {JSX.Element} The rendered React element.
 */
function App() {
  // State to manage the currently selected tab index
  const [index, setIndex] = React.useState(0);

  // Adding jsoneditor and select2
  window.JSONEditor = JSONEditor.JSONEditor;
  
  // Add jquery to window
  // @ts-expect-error need this for jsoneditor to expand this to select2
  window.$ = window.jQuery = $;

  // Extend JQuery with select2
  // @ts-expect-error select2 is not typed correctly
  select2($);

  // Color options for different tabs
  const colors = ['primary', 'neutral', 'success', 'warning'] as const;

  // JSX structure representing the entire application
  return (
    <>
      {/* 
        Tabs component for navigation. 
        - `size="lg"` sets the size of the tabs to large.
        - `aria-label` provides an accessible label for screen readers.
        - `value` represents the currently selected tab index.
        - `onChange` is the callback function when a tab is changed.
        - `sx` is a styling object defined using theme variables.
      */}
      <Tabs
        size="lg"
        aria-label="Intern Navigation"
        value={index}
        onChange={(_event, value) => setIndex(value as number)}
        sx={(theme) => ({
          p: 1,
          borderRadius: 16,
          mx: 'auto',
          mt: 0,
          boxShadow: theme.shadow.sm,
          // Variables for customizing the shadow, is used in many componens of material ui
          // simple rgb value like 100, 100, 100
          // example use "--joy-shadowRing": "0 0 0 30px rgba(var(--joy-shadowChannel, 255 255 255) / 0.1)",
          '--joy-shadowChannel': theme.vars.palette[colors[index]].darkChannel,
          /**
           * Customizes the appearance of tab button "root" elements with CSS styling.
           *
           * The "root" elements correspond to all tab buttons, similar to ".MuiTab-root" in the DOM for each tab.
           * The styling is applied using the Emotion library, where the "&" refers to the parent element (Tabs Object).
           *
           * For detailed information on CSS selectors, visit: {@link https://www.w3schools.com/cssref/css_selectors.php}
           * To explore CSS pseudo-classes, refer to: {@link https://www.w3schools.com/css/css_pseudo_classes.asp}
           * Learn more about nested styling with Emotion: {@link https://emotion.sh/docs/nested}
           *
           * @property {string} "&" - Reference to the parent element (Tabs Object) for applying styles to all tab buttons of the current tab.
           */
          [`& .${tabClasses.root}`]: {
            py: 1,
            flex: 1,
            transition: '0.3s',
            fontWeight: 'md',
            fontSize: 'md',
            [`&:not(.${tabClasses.selected}):not(:hover)`]: {
              opacity: 0.7
            }
          }
        })}
      >
        {/* 
          TabList component for displaying individual tabs. 
          - `variant="soft"` sets a soft styling variant for the TabList.
        */}
        <TabList
          variant="soft"
          size="md"
          disableUnderline
          sx={{ borderRadius: 'lg', p: 0 }}
        >
          {/* 
            Individual Tab components for each section. 
            - `orientation="vertical"` sets the tabs to display tab content vertically.
            - Conditional styling based on the selected tab index using `... (index === 0 && { color: colors[0] })`.
          */}
          <Tab
            disableIndicator
            orientation="vertical"
            {...(index === 0 && { color: colors[0] })}
          >
            {/* 
              ListItemDecorator component wraps the icon for consistent styling.
              Icon and label for the first tab.
            */}
            <ListItemDecorator>
              <SchoolIcon />
            </ListItemDecorator>
            Modulverwaltung
          </Tab>
          <Tab
            disableIndicator
            orientation="vertical"
            {...(index === 1 && { color: colors[1] })}
          >
            <ListItemDecorator>
              <ReceiptLongIcon />
            </ListItemDecorator>
            Anträge
          </Tab>
          <Tab
            disableIndicator
            orientation="vertical"
            /* ... operator used to spread the object properties, here color=colors[2] */
            {...(index === 2 && { color: colors[2] })}
          >
            <ListItemDecorator>
              <PolicyIcon />
            </ListItemDecorator>
            Prüfungsordnung
          </Tab>
          <Tab
            disableIndicator
            orientation="vertical"
            {...(index === 3 && { color: colors[3] })}
          >
            <ListItemDecorator>
              <SettingsIcon />
            </ListItemDecorator>
            Einstellungen
          </Tab>
        </TabList>
      </Tabs>

      {/* 
        TabContext component for managing tab panels. 
        - `value={String(index)}` sets the active tab panel based on the current index.
      */}
      <TabContext value={String(index)}>
        {/* 
          TabPanel components for each tab's content. 
          - The content can be customized for each tab.
        */}
        <TabPanel value="0">
           <AddModuleFields/>
        </TabPanel>
        <TabPanel value="1">
          <b>Second</b> tab panel content
        </TabPanel>
        <TabPanel value="2">
          <ExaminationRegulationApp></ExaminationRegulationApp>
        </TabPanel>
        <TabPanel value="3">
          <b>Fourth</b> tab panel content
        </TabPanel>
      </TabContext>
    </>
  );
}

// Export the App component as the default export
export default App;
