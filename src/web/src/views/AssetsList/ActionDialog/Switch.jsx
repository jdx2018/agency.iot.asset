import React from "react";
import { Switch } from "antd";

export default React.memo(({ value, onChange, ...restProps }) => {
  const isChecked = (value === 1 || value === undefined) ? true : false

  return (
    <Switch {...restProps} checked={isChecked} onChange={(checked) => {
      onChange(checked ? 1 : 0)
    }} checkedChildren="开启" unCheckedChildren="关闭" />
  );
});
