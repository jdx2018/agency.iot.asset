import React from "react";
import { Tabs, Tab, Box } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Destribute from "./components/Destribute";
import CancelStock from "./components/CancelStock";

function TabPanel(props) {
  const { children, value, index, ...restProps } = props;

  return (
    <div hidden={value !== index} {...restProps}>
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}

export default () => {
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
        <Tab label="派发" />
        <Tab label="退库" />
      </Tabs>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <Destribute />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <CancelStock />
      </TabPanel>
    </>
  );
};
