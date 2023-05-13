import React, { useCallback, useEffect } from 'react'
import { TreeSelect } from 'antd'
import { useDispatch } from 'react-redux'

export default React.memo(({ value, onChange, label, FetchDataFunc, key_, data, desc, disabled, cacheField }) => {
  const dispatch = useDispatch()
  const [opts, setOpts] = React.useState(null)

  const fetchNewOptions = useCallback(
    async (cb) => {
      const res = await FetchDataFunc()
      if (res.code === 1) {
        if (cacheField) {
          import(`store/slices/${cacheField}`).then(({ addList }) => {
            dispatch(addList(res.data))
          })
        }
        let treeData =
          res.data && Array.isArray(res.data)
            ? res.data.map((node) => {
                return {
                  title: node[label],
                  value: node[key_],
                  parentId: node.parentId,
                }
              })
            : []
        setOpts(treeData)
        cb(treeData)
      } else {
        setOpts(null)
      }
    },
    [FetchDataFunc, cacheField, dispatch, key_, label]
  )

  const valueProcessed = useCallback(
    (value, cb) => {
      if (value !== undefined && value !== null) {
        if (!opts) {
          fetchNewOptions((opts) => {
            if (opts.map((_) => _.value).includes(value)) {
              cb(value)
            } else {
              const option = opts.find((_) => _.title === value)
              if (option) {
                cb(option.value)
              } else {
                cb('')
              }
            }
          })
        } else {
          if (opts.map((_) => _.value).includes(value)) {
            cb(value)
          } else {
            const option = opts.find((_) => _.title === value)
            if (option) {
              cb(option.value)
            } else {
              cb('')
            }
          }
        }
      }
    },
    [fetchNewOptions, opts]
  )

  useEffect(() => {
    if (data && data.length > 0) {
      setOpts(
        data.map((node) => {
          return {
            title: node[label],
            value: node[key_],
            parentId: node.parentId,
          }
        })
      )
    } else {
      if (FetchDataFunc) {
        fetchNewOptions()
      }
    }
  }, [FetchDataFunc, data, fetchNewOptions, key_, label])

  useEffect(() => {
    data &&
      data.length > 0 &&
      setOpts(
        data.map((node) => {
          return {
            title: node[label],
            value: node[key_],
            parentId: node.parentId,
          }
        })
      )
  }, [data, key_, label])

  useEffect(() => {
    valueProcessed(value, onChange)
  }, [onChange, value, valueProcessed])

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <TreeSelect
        disabled={disabled}
        treeDataSimpleMode={{
          id: 'value',
          pId: 'parentId',
          rootPId: '0',
        }}
        treeNodeFilterProp='title'
        showSearch
        style={{ width: 180 }}
        listHeight={150}
        dropdownMatchSelectWidth={300}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={`请输入${desc}`}
        allowClear
        treeDefaultExpandAll
        treeData={opts}
        onChange={onChange}
      />
      <div
        style={{
          width: 30,
        }}
      ></div>
    </div>
  )
})
