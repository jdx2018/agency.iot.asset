import React, { useCallback, useEffect } from 'react';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';

export default React.memo(({ value, onChange, label, key_, FetchDataFunc, data, desc, disabled, cacheField }) => {
  const [opts, setOpts] = React.useState(null);
  const dispatch = useDispatch();

  const fetchNewOptions = useCallback(
    async (cb) => {
      const res = await FetchDataFunc();
      if (res.code === 1) {
        if (cacheField) {
          import(`store/slices/${cacheField}`).then(({ addList }) => {
            dispatch(addList(res.data));
          });
        }
        setOpts(res.data);
        cb(res.data);
      } else {
        setOpts(null);
      }
    },
    [FetchDataFunc, cacheField, dispatch]
  );

  const valueProcessed = useCallback(
    (value, cb) => {
      if (value !== undefined && value !== null) {
        if (!opts) {
          fetchNewOptions((opts) => {
            if (opts.map((_) => _.value).includes(value)) {
              cb(value);
            } else {
              // 针对特殊数据结构做特殊处理
              const option = opts.find((_) => (_.text ?? _.employeeName) === value);
              if (option) {
                cb(option.value ?? option.employeeId);
              } else {
                cb('');
              }
            }
          });
        }
      }
    },
    [fetchNewOptions, opts]
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setOpts(data);
    } else {
      if (FetchDataFunc && !opts) {
        fetchNewOptions(() => {});
      }
    }
  }, [FetchDataFunc, data, fetchNewOptions, opts]);

  useEffect(() => {
    valueProcessed(value, onChange);
  }, [onChange, value, valueProcessed]);

  const filterOptionHandle = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Select
        disabled={disabled}
        listHeight={150}
        value={value}
        onChange={onChange}
        showSearch
        style={{ width: 180 }}
        placeholder={`请选择${desc}`}
        optionFilterProp='children'
        filterOption={filterOptionHandle}
      >
        {(() => {
          if (opts && Array.isArray(opts)) {
            return opts.map((e) => (
              <Select.Option key={e[key_]} value={e[key_]}>
                {e[label]}
              </Select.Option>
            ));
          }
          return null;
        })()}
      </Select>
      <div
        style={{
          width: 30,
        }}
      ></div>
    </div>
  );
});
