import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'


export default ({ info, width = 50, height = 50, style }) => {
  const [src, setSrc] = useState('')
  useEffect(() => {
    QRCode.toDataURL(info ? info : '无数据', {
      width,
      height
    }, (err, url) => {
      setSrc(url)
    })
  }, [height, info, width])
  return <img style={style} src={src} alt={info} />
}