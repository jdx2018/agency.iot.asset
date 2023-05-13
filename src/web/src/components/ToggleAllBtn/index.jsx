import React from 'react'
import { Checkbox } from 'antd';
import _ from 'lodash'

export default ({ originDataWithKey, setSelectedRowKeys, pageSize }) => {
  const handleSetSelectedRowKeys = (e) => {
    let selectObj = {}
    const chunkList = _.chunk(originDataWithKey, pageSize)
    chunkList.forEach((chunk, index) => {
      selectObj[index + 1] = e.target.checked ? chunk : []
    })
    setSelectedRowKeys(selectObj)
  }
  return <Checkbox onChange={handleSetSelectedRowKeys}><span style={{
    color: '#00bcd4',
    userSelect: 'none',
    zIndex: 0
  }}>全选</span></Checkbox>
}