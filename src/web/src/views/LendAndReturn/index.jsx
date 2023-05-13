import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import ReturnList from "./components/ReturnList";
import LendList from "./components/LendList";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box p={1}>
          {/* <Typography>{children}</Typography> */}
          {children}
        </Box>
      )}
    </div>
  );
}

export default function CenteredTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        style={{
          backgroundColor: "#fff",
        }}
      >
        <Tab label="借出" />
        <Tab label="归还" />
      </Tabs>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <LendList />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <ReturnList />
      </TabPanel>
    </>
  );
}
