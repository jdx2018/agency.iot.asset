import React, { useEffect, useCallback } from 'react'
import { Select } from 'antd'

import { FilterWidget } from 'components'

export default ({ value, onChange, billMain, form, widgetConfig = false, disabled, ...restProps }) => {
  const { dataSource, field_select, setRelated } = billMain

  const handleChange = useCallback(
    (value) => {
      if (setRelated) {
        form.setFieldsValue({
          [setRelated.objectName]: dataSource.find((d) => d[field_select.value] === value)[setRelated.fieldName],
        })
      }
      onChange.call(null, value)
    },
    [dataSource, field_select.value, form, onChange, setRelated]
  )

  const valueProcessed = useCallback(
    (value, cb) => {
      if (value !== undefined && value !== null) {
        if (dataSource.map((_) => _[field_select.value]).includes(value)) {
          cb(value)
        } else {
          const option = dataSource.find((_) => _.text === value)
          if (option) {
            cb(option.value)
          } else {
            cb('')
          }
        }
      }
    },
    [dataSource, field_select.value]
  )

  const handleWidgetChange = useCallback(
    (value) => {
      handleChange(value)
    },
    [handleChange]
  )

  useEffect(() => {
    valueProcessed(value, onChange)
  }, [onChange, value, valueProcessed])
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Select
        {...restProps}
        disabled={disabled}
        listHeight={150}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        value={value}
        onChange={handleChange}
        showSearch
        optionFilterProp='children'
        filterOption={(input, option) =>
          option.children ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false
        }
      >
        {dataSource.map((option) => {
          return (
            <Select.Option key={option[field_select.value]} value={option[field_select.value]}>
              {option[field_select.display]}
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
