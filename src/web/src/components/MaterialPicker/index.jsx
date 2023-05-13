import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'

import { Button, Space, Table, Pagination, InputNumber } from 'antd'

import { Card } from '@material-ui/core'

import PerfectScrollbar from 'react-perfect-scrollbar'

import MaterialFilter from './MaterialFilter'

import app_config from 'config/app'

import * as lodash from 'lodash'
import PurchaseFilter from './PurchaseFilter'

const list2chunkobj = (arr, size) => {
  let obj = {}
  if (!arr || !Array.isArray(arr)) {
    return obj
  }
  const chunkList = Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))
  chunkList.forEach((_, index) => {
    obj[index + 1] = _
  })
  return obj
}

const chunkobj2list = (chunkobj) => {
  return Object.values(chunkobj).reduce((acc, cur) => acc.concat(cur), [])
}

export default memo(
  ({
    value,
    type,
    onChange,
    pickerConfig = null,
    getMaterialListFunc,
    height = 380,
    width = '100%',
    useStorageCountLimit = false,
    enabledPurchaseFilter = false,
  }) => {
    const selectedRef = useRef({})
    const dataRef = useRef([])
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])

    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [pageSize, setPageSize] = useState(10)
    const [current, setCurrent] = useState(1)

    const notinSelectedKeysRef = useRef([])

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        selectedRef.current[current] = selectedRowKeys
        setSelectedRowKeys(selectedRef.current[current])
        notinSelectedKeysRef.current = dataRef.current
          .filter((_) => !chunkobj2list(selectedRef.current).includes(_.materialId))
          .map((_) => _.materialId)
        onChange(dataRef.current.filter((_) => chunkobj2list(selectedRef.current).includes(_.materialId)))
      },
    }

    const tableMinWidth = useMemo(
      () =>
        columns.reduce((acc, cur) => {
          if (cur.width && typeof cur.width === 'number') {
            return acc + cur.width
          }
          return acc + app_config.defaultColumnWidth
        }, 0) + 50,
      [columns]
    )
    const isDisableRemoveBtn = Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), []).length === 0
    const tableRowClassName = (record, index) => {
      if (index % 2 === 0) {
        return 'bg-f7f8fa'
      }
    }
    const totalSelectedCount = Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), []).length

    const onPageChange = (page, pageSize) => {
      setCurrent(page)
      setData(dataRef.current.slice((page - 1) * pageSize, page * pageSize))
      if (selectedRef.current[page]) {
        setSelectedRowKeys(selectedRef.current[page])
      }
    }

    const handleMaterialPickerComplete = useCallback(
      (materials) => {
        let hash = {}
        const data_ = dataRef.current.concat(materials).reduce(function (item, next) {
          if (!hash[next.materialId]) {
            hash[next.materialId] = true
            item.push(next)
          }
          return item
        }, [])
        dataRef.current = data_
        setData(dataRef.current.slice((current - 1) * pageSize, current * pageSize))
        const d = list2chunkobj(dataRef.current, pageSize)
        Object.keys(d).forEach((_) => {
          d[_] = d[_].map((_) => _.materialId).filter((_) => !notinSelectedKeysRef.current.includes(_))
        })
        selectedRef.current = d
        setSelectedRowKeys(selectedRef.current[current])
        onChange(dataRef.current.filter((_) => chunkobj2list(selectedRef.current).includes(_.materialId)))
      },
      [current, onChange, pageSize]
    )

    const handleRemoveMaterial = useCallback(() => {
      const selectedKeys = chunkobj2list(selectedRef.current)
      selectedKeys.forEach((key) => {
        const idx = dataRef.current.map((c) => c.materialId).findIndex((materialId) => materialId === key)
        dataRef.current.splice(idx, 1)
      })
      Object.keys(selectedRef.current).forEach((key) => {
        selectedRef.current[key] = []
      })
      setData(dataRef.current.slice((current - 1) * pageSize, current * pageSize))

      onChange([])
    }, [current, onChange, pageSize])

    useEffect(() => {
      if (value) {
        dataRef.current = value
        setData(dataRef.current.slice(0, pageSize))
      }
    }, [pageSize])

    useEffect(() => {
      ;(async () => {
        if (pickerConfig) {
          const header = pickerConfig.header
          if (header) {
            const columns = Object.keys(header).map((header_key) => {
              if (header_key === 'qty') {
                return {
                  title: header[header_key].zh,
                  dataIndex: header_key,
                  width: header[header_key].width,
                  render: (text, record) => {
                    return (
                      <InputNumber
                        disabled={type === 'detail'}
                        style={{
                          width: 80,
                        }}
                        // precision={2}
                        size='small'
                        min={0}
                        max={type !== 'detail' ? (useStorageCountLimit ? record.storageQty : NaN) : Infinity}
                        value={Number(text)}
                        onChange={(value) => {
                          const data_copy = lodash.cloneDeep(data)
                          data_copy.forEach((material) => {
                            if (record.materialId === material.materialId) {
                              material.qty = value
                            }
                          })
                          setData(data_copy)
                          dataRef.current.forEach((material) => {
                            if (record.materialId === material.materialId) {
                              material.qty = value
                            }
                          });

                          if (type === 'create') {
                            onChange(
                              dataRef.current.filter((_) => chunkobj2list(selectedRef.current).includes(_.materialId))
                            )
                          }

                          if (type === 'edit') {
                            onChange(dataRef.current)
                          }
                        }}
                      />
                    )
                  },
                }
              }
              return {
                title: header[header_key].zh,
                dataIndex: header_key,
                width: header[header_key].width,
              }
            })

            setColumns(columns)
          }
        }
      })()
    }, [data, onChange, pickerConfig])

    useEffect(() => {
      if (pickerConfig && pickerConfig.rows) {
        dataRef.current = pickerConfig.rows
        setData(dataRef.current.slice((current - 1) * pageSize, current * pageSize))
      }
    }, [pageSize, pickerConfig])

    useEffect(() => {
      if (type === 'create') {
        dataRef.current = []
        setData(dataRef.current.slice(0, pageSize))
      }
    }, [pageSize, type])

    return (
      <>
        {type === 'create' && (
          <Space
            spacing={8}
            style={{
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Button
              type='primary'
              onClick={() => {
                global.$showModal({
                  width: 900,
                  zIndex: 9999,
                  content: (
                    <MaterialFilter
                      getMaterialListFunc={getMaterialListFunc}
                      onMaterialPickerComplete={handleMaterialPickerComplete}
                    />
                  ),
                  title: '耗材列表',
                })
              }}
            >
              选择耗材
            </Button>
            {enabledPurchaseFilter && (
              <Button
                type='primary'
                onClick={() => {
                  global.$showModal({
                    zIndex: 9999,
                    width: 900,
                    content: <PurchaseFilter onAssetPickerComplete={handleMaterialPickerComplete} />,
                    title: '选择采购单',
                  })
                }}
              >
                关联采购单
              </Button>
            )}
            <Button type='primary' disabled={isDisableRemoveBtn} onClick={handleRemoveMaterial}>
              移除耗材
            </Button>
          </Space>
        )}
        <Card
          style={{
            boxShadow: 'none',
            border: '1px solid #f0f0f0',
            // padding: 5,
            marginBottom: 10,
          }}
        >
          <PerfectScrollbar style={{ width, height }}>
            <div
              style={{
                minWidth: tableMinWidth,
              }}
            >
              <Table
                sticky
                rowKey='materialId'
                rowClassName={tableRowClassName}
                size='middle'
                rowSelection={type === 'create' ? rowSelection : false}
                pagination={false}
                columns={columns}
                dataSource={data}
              />
            </div>
          </PerfectScrollbar>
        </Card>
        <div
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            boxShadow: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            共&nbsp;
            <span
              style={{
                fontSize: 16,
                color: '#00bcd4',
                backgroundColor: '#fff!important',
              }}
            >
              {dataRef.current.length}&nbsp;
            </span>
            条数据
            {type === 'create' && (
              <span>
                ，当前选中&nbsp;
                <span
                  style={{
                    fontSize: 16,
                    color: '#00bcd4',
                  }}
                >
                  {totalSelectedCount}
                </span>
                &nbsp; 条
              </span>
            )}
          </div>
          <div>
            <Pagination
              hideOnSinglePage
              onChange={onPageChange}
              current={current}
              total={dataRef.current.length}
              pageSize={pageSize}
            />
          </div>
        </div>
      </>
    )
  }
)
