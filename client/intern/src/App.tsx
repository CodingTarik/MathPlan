import "./App.css";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { TabContext } from "@mui/lab";
import SchoolIcon from '@mui/icons-material/School';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PolicyIcon from '@mui/icons-material/Policy';
import SettingsIcon from '@mui/icons-material/Settings';

function App() {
  const [index, setIndex] = React.useState(0);
  const colors = ["primary", "danger", "success", "warning"] as const;
  return (
    <>
      <Tabs
        size="lg"
        aria-label="Bottom Navigation"
        value={index}
        onChange={(_eventf, value) => setIndex(value as number)}
        sx={(theme) => ({
          p: 1,
          borderRadius: 16,
          mx: "auto",
          mt: 0,
          boxShadow: theme.shadow.sm,
          "--joy-shadowChannel": theme.vars.palette[colors[index]].darkChannel,
          [`& .${tabClasses.root}`]: {
            py: 1,
            flex: 1,
            transition: "0.3s",
            fontWeight: "md",
            fontSize: "md",
            [`&:not(.${tabClasses.selected}):not(:hover)`]: {
              opacity: 0.7,
            },
          },
        })}
      >
        <TabList
          variant="soft"
          size="md"
          disableUnderline
          sx={{ borderRadius: "lg", p: 0 }}
        >
          <Tab
            disableIndicator
            orientation="vertical"
            {... (index === 0 && { color: colors[0] })}
          >
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
      <TabContext value={String(index)}>
        <TabPanel value="0">
          <b>Second</b> tab panel
        </TabPanel>
        <TabPanel value="1">
          <b>Third</b> tab panel
        </TabPanel>
        <TabPanel value="2">
          <b>Third</b> tab panel
        </TabPanel>
        <TabPanel value="3">
          <b>Third</b> tab panel
        </TabPanel>
      </TabContext>
    </>
  );
}

export default App;
