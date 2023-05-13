import React, { useEffect, useCallback } from 'react'
import { TreeSelect } from 'antd'

import { FilterWidget } from 'components'

export default ({ value, onChange, options, field_select, widgetConfig = false, disabled, ...restProps }) => {
  const treeData =
    options && Array.isArray(options)
      ? options.map((option) => ({
          title: option[field_select.display],
          value: option[field_select.value],
          parentId: option.parentId,
        }))
      : []

  const valueProcessed = useCallback(
    (value, cb) => {
      if (value !== undefined && value !== null) {
        if (options.map((_) => _[field_select.value]).includes(value)) {
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
    [field_select.value, options]
  )

  const handleWidgetChange = useCallback(
    (value) => {
      valueProcessed(value, onChange)
    },
    [onChange, valueProcessed]
  )

  useEffect(() => {
    valueProcessed(value, onChange)
  }, [onChange, value, valueProcessed])

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <TreeSelect
        {...restProps}
        disabled={disabled}
        listHeight={150}
        dropdownMatchSelectWidth={300}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        treeDataSimpleMode={{
          id: 'value',
          pId: 'parentId',
          rootPId: '0',
        }}
        treeNodeFilterProp='title'
        showSearch
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        allowClear
        treeDefaultExpandAll
        treeData={treeData}
        onChange={onChange}
      />
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
