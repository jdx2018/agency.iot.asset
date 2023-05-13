/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import TableToolbar from './TableToolbar'
import { AntTable } from 'components'

import ActionDialog from './ActionDialog'
import clientService from 'api/clientService'

const BILL_TITLE = '退库'

export default React.memo(() => {
  const [column, setColumn] = useState([])
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterConfig, setFilterConfig] = useState({})
  const [open, setOpen] = useState(false)
  const [dialogData, setDialogData] = useState({ billMain: {}, billDetail: {} })
  const filterRef = React.useRef(null)
  const [billNo, setCurNo] = useState('')

  const refreshData = React.useCallback(async (filter = null) => {
    let f = null
    if (!filter) {
      f = filterRef.current
    } else if (JSON.stringify(filter) === '{}') {
      filterRef.current = null
      f = filterRef.current
    } else {
      filterRef.current = filter
      f = filterRef.current
    }
    setLoading(true)
    const filter_ = JSON.parse(JSON.stringify(f))
    const res = await clientService.bill_tuiku_material.queryBill(filter_)
    setLoading(false)
    if (res.code === 1) {
      const header = res.data.header
      const column = Object.keys(header).map((header_key) => {
        const column_ = {
          title: header[header_key].zh,
          dataIndex: header_key,
          width: header[header_key].width,
        }
        if (header_key === 'billNo') {
          column_.render = (text, row, index) => {
            return (
              <a
                onClick={async () => {
                  setOpen(true)
                  setCurNo(text)
                  const res = await clientService.bill_tuiku_material.queryBillDetail(text)
                  if (res.code === 1) {
                    setDialogData(res.data)
                  } else {
                    global.$showMessage({
                      message: res.message,
                      type: 'error',
                      autoHideDuration: 5000,
                    })
                  }
                }}
              >
                {text}
              </a>
            )
          }
        }
        return column_
      })
      setColumn(column)
      setTableData(res.data.rows)
      setFilterConfig(res.data.filter)
    } else {
      global.$showMessage({
        message: res.message,
        type: 'error',
        autoHideDuration: 5000,
      })
    }
  }, [])

  const handleCloseDialog = React.useCallback(
    (isRefresh = false) => {
      setOpen(false)
      if (isRefresh) {
        refreshData()
      }
    },
    [refreshData]
  )

  return (
    <>
      <div
        style={{
          height: 'calc(100vh - 254px)',
        }}
      >
        <AntTable
          billTitle={BILL_TITLE}
          loading={loading}
          rowKey='billNo'
          useRowSelect={true}
          column={column}
          TableToolbar={TableToolbar}
          tableData={tableData}
          filterConfig={filterConfig}
          toolbarProps={{ refreshData }}
        />
      </div>
      <ActionDialog
        billNo={billNo}
        billTitle={BILL_TITLE}
        type='detail'
        dialogData={dialogData}
        open={open}
        closeDialog={handleCloseDialog}
      />
    </>
  )
})
