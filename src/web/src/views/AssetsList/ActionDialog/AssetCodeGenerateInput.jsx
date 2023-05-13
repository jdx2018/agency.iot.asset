import React from "react";

import { Input, Checkbox } from "antd";

export default React.memo(function ({ value, onChange, setFieldsValue, disabled }) {
  const [isAutoGenerate, setIsAutoGenerate] = React.useState(false);

  const handleSwitchStatus = (e) => {
    setIsAutoGenerate(e.target.checked);
    setFieldsValue({ assetId: "" });
  };

  React.useEffect(() => {
    setIsAutoGenerate(disabled);
  }, [disabled]);

  return (
    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
      <Input
        style={{
          width: 180,
          marginRight: 10
        }}
        value={value}
        onChange={onChange}
        placeholder={isAutoGenerate ? "系统自动生成" : "请输入资产编码"}
        disabled={isAutoGenerate}
      />
      <div style={{
        width: 90
      }}>
        {!disabled && (
          <Checkbox onChange={handleSwitchStatus} checked={isAutoGenerate}>
            <span
              style={{
                fontSize: 12,
                color: "#9e9e9e",
              }}
            >
              自动生成
          </span>
          </Checkbox>
        )}
      </div>
    </div>
  );
});
