import React, { useEffect, useCallback } from "react";
import { AutoComplete } from "antd";
import matchSorter from "match-sorter";

import { FilterWidget } from 'components'

export default React.memo(({ value, onChange, options, widgetConfig = false, disabled, ...restProps }) => {
  const [opt, setOpt] = React.useState([])
  const dataRef = React.useRef([])

  const onSearch = (searchText) => {
    const result = matchSorter(dataRef.current.map((_) => _.text), searchText.trim()).map(_ => ({ value: _ }))
    setOpt(
      result
    );
  };

  const handleWidgetChange = useCallback((value) => {
    onChange(value);
  }, [onChange])

  useEffect(() => {
    setOpt(options.map(_ => ({ value: _.value })))
    dataRef.current = options
  }, [options])

  return (
    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
      <AutoComplete
        {...restProps}
        listHeight={150}
        disabled={disabled}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        value={value}
        onChange={onChange}
        options={opt}
        onSearch={onSearch}
      />
      <div style={{
        width: 30
      }}>
        {!disabled && <FilterWidget widgetConfig={widgetConfig} onChange={handleWidgetChange} />}
      </div>
    </div>
  );
});
