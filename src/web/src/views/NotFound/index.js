import React from "react";
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom'

function NotFound() {
  const history = useHistory()
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Result
        status="404"
        title="页面不存在"
        subTitle="您访问的页面可能在另外一个时空~"
        extra={<Button type="primary" onClick={() => history.push('/')}>回到主页</Button>}
      />
    </div>
  );
}

export default NotFound;
