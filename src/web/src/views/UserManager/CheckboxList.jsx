import React, { useState, useEffect } from 'react'
import { Checkbox, Divider, } from 'antd'

const CheckboxGroup = Checkbox.Group;

const checkboxStyle = {
  display: 'block',
  height: '28px',
  lineHeight: '28px',
  marginLeft: 0
}


const CheckboxList = ({ page, onCheckedChange }) => {
  const pageList = Object.keys(page.funcObj).map(v => page.funcObj[v])
  const [checkedList, setCheckedList] = useState(() =>
    pageList.reduce((acc, cur) => cur.funcStatus ? [...acc, cur.funcId] : acc, [])
  );

  const [indeterminate, setIndeterminate] = useState(() => !!pageList.some(page => page.funcStatus) && !pageList.every(page => page.funcStatus));
  const [checkAll, setCheckAll] = useState(() => !!pageList.every(page => page.funcStatus));

  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < pageList.length);
    setCheckAll(list.length === pageList.length);
  };

  const onCheckAllChange = e => {
    const checkedList = e.target.checked ? pageList.map(_ => _.funcId) : []
    setCheckedList(checkedList);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    const funcObj_copy = JSON.parse(JSON.stringify(page.funcObj))
    Object.keys(funcObj_copy).forEach(v => {
      funcObj_copy[v].funcStatus = 0
    })
    checkedList.forEach(v => {
      funcObj_copy[v].funcStatus = 1
    })
    onCheckedChange({ id: page.id, funcObj: funcObj_copy })
  }, [checkedList, onCheckedChange, page])

  return (
    <>
      <div>{page.pageDesc}</div>
      <div>
        <Checkbox
          onClick={(e) => e.stopPropagation()}
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}>
          全选
      </Checkbox>
      </div>
      <Divider style={{ margin: '5px 0' }} />
      <CheckboxGroup value={checkedList} onChange={onChange}>
        {pageList.map(opt => <Checkbox
          onClick={(e) => e.stopPropagation()}
          key={opt.funcId} style={checkboxStyle}
          name={opt.funcId}
          value={opt.funcId}>{opt.funcDesc}</Checkbox>)}
      </CheckboxGroup>
    </>
  );
}

export default CheckboxList