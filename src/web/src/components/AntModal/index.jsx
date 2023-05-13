import React, { useState, useEffect, useCallback } from 'react'
import { Modal } from 'antd'
import deepmerge from "deepmerge";
import { CloseOutlined } from '@ant-design/icons'
// import { Scrollbars } from 'react-custom-scrollbars'

const initialState = {
  open: false,
  title: '',
  content: null,
  width: 0,
  height: '62vh',
  zIndex: 9999
}

const AntModal = () => {
  const [opts, setOpts] = useState(initialState)

  const show = useCallback((state) => {
    setOpts(deepmerge(state, { open: true }))
  }, [])

  const hide = useCallback(() => {
    setOpts(c => deepmerge(c, { open: false }))
    setTimeout(() => {
      setOpts(initialState)
    }, 100)
  }, [])

  useEffect(() => {
    global.$showModal = (state) => {
      show(state);
    };
    global.$hideModal = () => {
      hide();
    };
  }, [hide, show])

  return <Modal
    destroyOnClose
    zIndex={opts.zIndex}
    centered={true}
    width={opts.width}
    footer={null}
    onCancel={hide}
    closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
    title={<span
      style={{
        fontSize: 16,
        color: "#fff",
      }}
    >

      {opts.title}
    </span>} visible={opts.open}>
    {/* <Scrollbars height={opts.height}> */}
    {opts.content}
    {/* </Scrollbars> */}
  </Modal>
}

export default AntModal