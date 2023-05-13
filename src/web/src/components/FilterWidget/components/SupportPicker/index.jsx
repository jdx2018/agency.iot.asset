import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import { AntTable } from "components";
import { ReconciliationOutlined, CloseOutlined } from '@ant-design/icons'
import TableToolbar from "./TableToolbar";
import clientService from 'api/clientService'

const DialogContent = ({ onSelectedChange }) => {
  const [tableData, setTableData] = useState([])
  const [header, setHeader] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      const res = await clientService.supplier.getSupplierList()
      if (res.code === 1) {
        setHeader(res.data.header)
        setTableData(res.data.rows)
      } else {
        global.$showMessage({
          type: 'error',
          message: res.message,
          autoHideDuration: 5000,
        })
      }
    }
    fetchData()
  }, [])
  return <div
    style={{
      flexGrow: 1,
      marginLeft: 10,
      marginBottom: 5,
      height: 621
    }}
  >
    <AntTable
      onSelectedChange={onSelectedChange}
      extraRowSelection={{ type: 'radio' }}
      rowKey="supplierId"
      useRowSelect={true}
      TableToolbar={TableToolbar}
      height="500px"
      tableData={tableData}
      column={Object.keys(header).map((header_key) => ({
        title: header[header_key].zh,
        dataIndex: header_key,
        width: header[header_key].width,
      }))}
    />
  </div>
}

export default React.memo(({ onChange }) => {
  const [open, setOpen] = useState(false)
  const valueRef = useRef(null)

  const handleConfirm = () => {
    if (valueRef.current) {
      onChange(valueRef.current)
    }
    setOpen(false)
  }

  const handleSelectedChange = (ids) => {
    valueRef.current = ids[0]
  }

  return (
    <>
      <div style={{
        marginLeft: 3,
        color: '#616161',
        cursor: "pointer"
      }}
        onClick={() => setOpen(true)}>

        <ReconciliationOutlined />
      </div>
      <Modal
        zIndex={10000}
        width={'948px'}
        footer={[<Button key="1" onClick={() => setOpen(false)}>关闭</Button>,
        <Button key="0" type="primary" onClick={handleConfirm}>
          确认
      </Button>
        ]}
        closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
        title={<span
          style={{
            fontSize: 16,
            color: "#fff",
          }}
        >
          供应商列表
      </span>} visible={open} onOk={handleConfirm} onCancel={() => setOpen(false)}>
        <Scrollbars style={{
          height: '62vh'
        }}>
          <DialogContent onSelectedChange={handleSelectedChange} />
        </Scrollbars>
      </Modal>
    </>
  );
});
