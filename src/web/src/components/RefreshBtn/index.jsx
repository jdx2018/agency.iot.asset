import React, { useState } from 'react'
import { SyncOutlined } from '@ant-design/icons'
import { } from 'antd'

export default ({ refreshData }) => {
  const [isSpin, setIsSpin] = useState(false)

  return <SyncOutlined style={{
    marginLeft: 10,
    color: "#00bcd4"
  }} onClick={async () => {
    setIsSpin(true)
    await refreshData()
    setIsSpin(false)
    global.$showMessage({
      message: "刷新数据成功",
      autoHideDuration: 1000,
      type: "success",
    });
  }} spin={isSpin} />
}