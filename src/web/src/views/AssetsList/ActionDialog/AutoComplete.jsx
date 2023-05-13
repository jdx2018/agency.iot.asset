import React from "react";
import { AutoComplete } from "antd";
import matchSorter from "match-sorter";
import { useDispatch } from 'react-redux'

export default React.memo(({ value, onChange, label, data, key_, desc, disabled, cacheField, FetchDataFunc }) => {
  const [option, setOption] = React.useState([])
  const dataRef = React.useRef([])
  const dispatch = useDispatch()

  const onSearch = (searchText) => {
    const result = matchSorter(dataRef.current.map((_) => _.text), searchText.trim()).map(_ => ({ value: _ }))
    setOption(
      result
    );
  };


  React.useEffect(() => {
    if (data && data.length > 0) {
      setOption(data.map(_ => ({ value: _[label] })))
    } else {
      (async () => {
        const res = await FetchDataFunc();
        if (res.code === 1) {
          if (cacheField) {
            import(`store/slices/${cacheField}`).then(({ addList }) => {
              dispatch(addList(res.data))
            })
          }
          const data = res.data
          if (data && Array.isArray(data)) {
            setOption(data.map(_ => ({ value: _[label] })))
          }
          dataRef.current = res.data
        } else {
          global.$showMessage({
            message: res.message,
            type: "error",
            autoHideDuration: 5000,
          });
        }
      })();
    }
  }, [FetchDataFunc, cacheField, data, dispatch, label]);


  return (
    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
      <AutoComplete
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        disabled={disabled}
        listHeight={150}
        value={value}
        onChange={onChange}
        options={option}
        onSearch={onSearch}
        style={{ width: 180 }}
        placeholder={`请输入${desc}`}
      />
      <div style={{
        width: 30
      }}></div>
    </div>
  );
});
