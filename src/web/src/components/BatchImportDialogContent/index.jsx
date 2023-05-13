import React, { useRef } from 'react'
import { Space, Button } from 'antd'

import styles from "./index.module.css"

const BatchImportDialogContent = ({ onSubmitImportData, extraText = "", downloadTemplateHandler }) => {
  const temp_import_data = useRef([])

  return <div>
    <div className={styles.wrapper}>
      <div>
        <div>{extraText}</div>
        <p>1. 请先下载模板文件: <a onClick={downloadTemplateHandler}>导入模板-excel文件</a></p>
        <p>2. 请上传文件: </p>
      </div>
    </div>
    <div
      style={{
        marginTop: 10,
        textAlign: "right",
      }}
    >
      <Space>
        <Button type="primary" onClick={() => {
          onSubmitImportData(temp_import_data.current)
        }}>
          导入
          </Button>
        <Button onClick={() => global.$hideModal()}>取消</Button>
      </Space>
    </div>
  </div>
}

export default BatchImportDialogContent