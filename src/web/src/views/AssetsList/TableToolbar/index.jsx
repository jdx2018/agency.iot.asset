/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Space, Button, Modal } from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  AlignLeftOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import { Card } from '@material-ui/core'

import ActionDialog from '../ActionDialog'
import clientService from 'api/clientService'

import { ColumnMenuSwitch, SearchInput, AdvanSearch, RefreshBtn, ToggleAllBtn, HideButtonWithAuth } from 'components'
import FileActions from './FileActions'
import { cloneDeep } from 'lodash'

export default React.memo(
  ({
    originData,
    columns,
    setColumn,
    setFilterData,
    refreshData,
    selected,
    setSelectedRowKeys,
    pageSize,
    filterData,
    filterConfig,
  }) => {
    const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), [])
    const [open, setOpen] = React.useState(false)
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const [formValues, setFormValues] = React.useState(null)
    const [formType, setFormType] = React.useState('create')
    const [editBtnLoading, setEditBtnLoading] = React.useState(false)

    const handleDelete = () => {
      Modal.confirm({
        title: '警告',
        centered: true,
        icon: <ExclamationCircleOutlined />,
        content: '确认删除资产信息？',
        async onOk() {
          const assetId = selectedRowKeys[0]
          const res = await clientService.asset.deleteAsset(assetId)
          if (res.code === 1) {
            global.$showMessage({
              message: '删除资产信息成功',
              type: 'success',
            })
            refreshData()
          } else {
            global.$showMessage({
              message: res.message,
              autoHideDuration: 5000,
              type: 'error',
            })
          }
        },
      })
    }

    const handleEdit = async () => {
      setEditBtnLoading(true)
      const res = await clientService.asset.getAsset_detail(selectedRowKeys[0])
      setEditBtnLoading(false)
      if (res.code === 1) {
        setFormType('edit')
        setOpen(true)
        setFormValues(res.data)
      } else {
        global.$showMessage({
          type: 'error',
          message: res.message,
        })
      }
    }

    const handleOpenDrawer = () => {
      setDrawerOpen(true)
    }

    const handleCloseDrawer = React.useCallback(() => {
      setDrawerOpen(false)
    }, [])

    const handleCreateAsset = () => {
      setFormType('create')
      setOpen(true)
      setFormValues(null)
    }

    const handleCreateAssetExtendData = () => {
      setFormType('create')
      setOpen(true)
      const row = cloneDeep(originData.find((v) => v.assetId === selectedRowKeys[0]))
      row.classId = row.className
      row.manager = row.managerName
      row.ownOrgId = row.ownOrgName
      row.placeId = row.placeName
      delete row.assetId
      delete row.barcode
      delete row.epc
      delete row.useEmployeeName
      delete row.useOrgName

      delete row.className
      delete row.managerName
      delete row.ownOrgName
      delete row.placeName
      setFormValues(row)
    }

    const handleCloseDialog = React.useCallback(
      (isRefresh = false) => {
        setOpen(false)
        if (isRefresh) {
          refreshData()
        }
      },
      [refreshData]
    )

    const handleValuesChange = React.useCallback(
      (filters) => {
        refreshData(filters)
      },
      [refreshData]
    )
    return (
      <>
        <Card
          style={{
            marginTop: 10,
            marginBottom: 10,
            padding: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'none',
          }}
        >
          <Space size={10}>
            <HideButtonWithAuth funcId='zichan_add'>
              <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateAsset}>
                新增
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='zichan_add'>
              <Button onClick={handleCreateAssetExtendData} disabled={selectedRowKeys.length !== 1}>
                <PlusCircleOutlined /> 复制资产
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='zichan_edit'>
              <Button loading={editBtnLoading} onClick={handleEdit} disabled={selectedRowKeys.length !== 1}>
                <EditOutlined /> 编辑
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='zichan_delete'>
              <Button type='danger' onClick={handleDelete} disabled={selectedRowKeys.length !== 1}>
                <DeleteOutlined /> 删除
              </Button>
            </HideButtonWithAuth>
            <FileActions
              columns={columns}
              data={filterData}
              selectedRowKeys={selectedRowKeys}
              originData={originData}
              refreshData={refreshData}
            />
          </Space>

          <Space>
            <ToggleAllBtn
              originDataWithKey={filterData.map((v) => v.assetId)}
              setSelectedRowKeys={setSelectedRowKeys}
              pageSize={pageSize}
            />
            <SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
            <a onClick={handleOpenDrawer}>
              <AlignLeftOutlined /> <span style={{ userSelect: 'none' }}>高级筛选</span>
            </a>
            <RefreshBtn refreshData={refreshData} />
          </Space>
        </Card>
        <AdvanSearch
          formConfg={filterConfig}
          open={drawerOpen}
          closeDrawer={handleCloseDrawer}
          valuesChange={handleValuesChange}
        />
        <ActionDialog type={formType} formValues={formValues} open={open} closeDialog={handleCloseDialog} />
      </>
    )
  }
)
