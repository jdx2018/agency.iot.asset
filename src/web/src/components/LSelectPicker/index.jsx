import React, { useEffect, useCallback } from 'react'
import { Select } from 'antd'

import { FilterWidget } from 'components'

export default ({ value, onChange, options, widgetConfig = false, disabled, ...restProps }) => {
  const valueProcessed = useCallback(
    (value, cb) => {
      if (value !== undefined && value !== null) {
        if (options.map((_) => _.value).includes(value)) {
          cb(value)
        } else {
          const option = options.find((_) => _.text === value)
          if (option) {
            cb(option.value)
          } else {
            cb('')
          }
        }
      }
    },
    [options]
  )

  const handleWidgetChange = useCallback(
    (value) => {
      onChange(value)
    },
    [onChange]
  )

  useEffect(() => {
    valueProcessed(value, onChange)
  }, [onChange, options, value, valueProcessed])

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Select
        {...restProps}
        disabled={disabled}
        listHeight={150}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        value={value}
        onChange={onChange}
        showSearch
        optionFilterProp='children'
        filterOption={(input, option) =>
          option.children ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
        }
      >
        {options.map((option) => {
          return (
            <Select.Option key={option.value} value={option.value}>
              {option.text}
            </Select.Option>
          )
        })}
      </Select>

      <div
        style={{
          width: 30,
        }}
      >
        {!disabled && <FilterWidget widgetConfig={widgetConfig} onChange={handleWidgetChange} />}
      </div>
    </div>
  )
}
